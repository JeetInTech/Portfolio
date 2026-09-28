/* ============================================================================
 * world-generators.js — WORLD 03 · LOCAL GENERATORS
 * ============================================================================
 *  Entity:  a 2D AI FORGE — a procedural SVG workstation. Rack of GPU-like
 *           compute bays, a glowing processing core, model lattice, pipeline
 *           rails carrying thin-line media thumbnails.
 *           Pipeline reads INPUT -> MODEL -> PROCESSING -> OUTPUT.
 *           No human figure, no robot. Machinery only.
 *
 *  Motion:  idle motion is CSS-driven (transform / opacity / stroke-dashoffset
 *           only), so it dies with the DOM on unmount. ONE requestAnimationFrame
 *           loop exists, and only to retype the mono readouts; it is cancelled
 *           in unmount() and self-pauses while the document is hidden.
 *
 *  Project environment: a lab floor of processing bays. Each project is a
 *           thin-line machine frame carrying its own media motif.
 *
 *  Everything lives in this IIFE. The only global touched is
 *  window.UNIVERSE.registerWorld.
 * ========================================================================== */
(function () {
    'use strict';

    var SVGNS = 'http://www.w3.org/2000/svg';

    /* ------------------------------------------------------------------ *
     * MODULE STATE — reset on every mount. ctx is never cached across
     * mounts; only the pieces needed by the running frame are kept.
     * ------------------------------------------------------------------ */
    var S = null;

    /* ============================================================================
       GEOMETRY TABLES
       Two rig layouts: 'h' (wide, left-to-right) and 'v' (narrow, top-to-bottom).
       Stage groups are drawn around a local origin and simply translated into
       place, so both layouts reuse the same machine drawings.
       ========================================================================== */
    var LAYOUTS = {
        h: {
            vb: '0 0 480 200',
            cls: 'wg-rig--h',
            pos: { input: [58, 96], model: [168, 96], proc: [296, 92], out: [430, 96] },
            rails: 'M101 96 H125 M211 96 H232 M360 96 H387',
            label: { dx: 0, dy: 64, anchor: 'middle' },
            start: [24, 96],       // where payload / thumbs enter
            travel: [432, 0],      // start -> far end of the rail
            toCore: [304, -4],     // start -> core centre (296+32, 92)
            readouts: [[14, 18], [212, 18], [388, 18]],
            drift: [0, 7]          // cross-axis particle scatter
        },
        v: {
            vb: '0 0 300 440',
            cls: 'wg-rig--v',
            pos: { input: [130, 60], model: [130, 170], proc: [130, 282], out: [130, 392] },
            rails: 'M130 106 V124 M130 216 V227 M130 337 V346',
            label: { dx: 72, dy: 4, anchor: 'start' },
            start: [130, 6],
            travel: [0, 432],
            toCore: [32, 276],
            readouts: [[8, 14], [8, 28], [8, 42]],
            drift: [7, 0]
        }
    };

    /* media motifs used by the travelling thumbnails and by the project bays */
    var MOTIF = {
        /* film frame-strip — video work */
        film:
            '<rect class="wg-ln" x="-11" y="-7" width="22" height="14" rx="1"/>' +
            '<path class="wg-hair" d="M-11 -4h22M-11 4h22M-4 -7v14M4 -7v14"/>',
        /* waveform strip — audio work */
        wave:
            '<rect class="wg-ln" x="-11" y="-7" width="22" height="14" rx="1"/>' +
            '<path class="wg-hair" d="M-8 0v-3M-5 0v-5M-2 0v-2M1 0v-4M4 0v-6M7 0v-3' +
            'M-8 0v3M-5 0v5M-2 0v2M1 0v4M4 0v6M7 0v3"/>',
        /* image tile grid — vision work */
        tiles:
            '<rect class="wg-ln" x="-11" y="-7" width="22" height="14" rx="1"/>' +
            '<path class="wg-hair" d="M-4 -7v14M4 -7v14M-11 0h22"/>'
    };

    /* project id -> media motif for the lab floor (8 distinct procedural machines) */
    var BAY_MOTIF = {
        'ai-video-editor': 'timeline',
        'offline-image': 'diffusion',
        'yt-clip-master': 'facetrack',
        'photo-enhancer': 'enhancer',
        'chatterbox': 'audio',
        'long-video': 'pipeline',
        'ai-data-analyst': 'automl',
        'genesis-linkedin-publisher': 'publisher'
    };

    /* asymmetric lab-floor placement (desktop only). x/y are % of the plot,
       d is depth 0..1 -> scale + opacity + parallax amount.
       Order matches the data order, so tab order follows reading order. */
    var PLOT = [
        { x: 0, y: 0, d: 0.00 },
        { x: 27, y: 7, d: 0.30 },
        { x: 55, y: 1, d: 0.14 },
        { x: 8, y: 31, d: 0.42 },
        { x: 36, y: 37, d: 0.08 },
        { x: 64, y: 29, d: 0.26 },
        { x: 17, y: 63, d: 0.20 },
        { x: 49, y: 67, d: 0.00 }
    ];

    /* ============================================================================
       SMALL HELPERS
       ========================================================================== */
    function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }

    function svgEl(tag, attrs) {
        var n = document.createElementNS(SVGNS, tag);
        for (var k in attrs) { if (attrs.hasOwnProperty(k)) n.setAttribute(k, attrs[k]); }
        return n;
    }

    function esc(s) {
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function pad2(n) { return (n < 10 ? '0' : '') + n; }

    /* ============================================================================
       ENTITY — THE FORGE
       ========================================================================== */

    /* --- INPUT bay: intake frame swallowing rough, unprocessed fragments ---- */
    function gInput() {
        return '' +
            '<rect class="wg-frame" x="-43" y="-46" width="86" height="92" rx="1.5"/>' +
            '<path class="wg-hair" d="M-43 -30h9M-43 -10h9M-43 10h9M-43 30h9"/>' +
            '<path class="wg-edge" d="M-43 -38v-8h8M43 -38v-8h-8M-43 38v8h8M43 38v8h-8"/>' +
            /* raw, deliberately irregular fragments */
            '<g class="wg-raw">' +
            '<path class="wg-ln jit" style="--i:0" d="M-24 -20l13-6l9 10l-8 10z"/>' +
            '<path class="wg-ln jit" style="--i:1" d="M3 -24l14 5l-4 12l-12-3z"/>' +
            '<path class="wg-ln jit" style="--i:2" d="M-17 6l16-4l5 13l-15 5z"/>' +
            '</g>' +
            /* determinate intake bar (scaleX, never width) */
            '<rect class="wg-track" x="-30" y="31" width="60" height="2"/>' +
            '<rect class="wg-bar" x="-30" y="31" width="60" height="2" style="--i:0"/>' +
            '<text class="wg-idx" x="-40" y="-34">01</text>';
    }

    /* --- MODEL: a 3x3 node lattice whose nodes illuminate in sequence ------- */
    function gModel() {
        var cols = [-24, 0, 24], rows = [-22, 0, 22];
        var edges = '', nodes = '', i, j, k, n = 0;
        for (i = 0; i < 2; i++) {
            for (j = 0; j < 3; j++) {
                for (k = 0; k < 3; k++) {
                    edges += 'M' + cols[i] + ' ' + rows[j] + 'L' + cols[i + 1] + ' ' + rows[k];
                }
            }
        }
        for (i = 0; i < 3; i++) {
            for (j = 0; j < 3; j++) {
                nodes += '<circle class="wg-node" cx="' + cols[i] + '" cy="' + rows[j] +
                    '" r="3" style="--i:' + (n++) + '"/>';
            }
        }
        return '' +
            '<rect class="wg-frame" x="-43" y="-46" width="86" height="92" rx="1.5"/>' +
            '<path class="wg-edge" d="M-43 -38v-8h8M43 -38v-8h-8M-43 38v8h8M43 38v8h-8"/>' +
            '<path class="wg-lattice" d="' + edges + '"/>' +
            nodes +
            '<text class="wg-idx" x="-40" y="-34">02</text>';
    }

    /* --- PROCESSING: GPU rack + glowing core + heat shimmer ----------------- */
    function gProc() {
        var bays = '', i, y;
        for (i = 0; i < 4; i++) {
            y = -45 + i * 24;
            bays +=
                '<g class="wg-gpu" style="--i:' + i + '">' +
                '<rect class="wg-gpu__bay" x="-58" y="' + y + '" width="62" height="18" rx="1"/>' +
                /* heat fins */
                '<path class="wg-hair" d="M-14 ' + (y + 3) + 'v12M-10 ' + (y + 3) + 'v12M-6 ' +
                (y + 3) + 'v12M-2 ' + (y + 3) + 'v12"/>' +
                /* per-bay load bar, scaleX from the left */
                '<rect class="wg-track" x="-54" y="' + (y + 12) + '" width="34" height="2"/>' +
                '<rect class="wg-bar" x="-54" y="' + (y + 12) + '" width="34" height="2" ' +
                'style="--i:' + i + '"/>' +
                '<circle class="wg-gpu__led" cx="-51" cy="' + (y + 5) + '" r="1.8"/>' +
                '</g>';
        }
        return '' +
            '<rect class="wg-frame" x="-64" y="-55" width="128" height="110" rx="1.5"/>' +
            '<path class="wg-edge" d="M-64 -47v-8h8M64 -47v-8h-8M-64 47v8h8M64 47v8h-8"/>' +
            '<path class="wg-hair" d="M8 -55V55"/>' +
            bays +
            /* heat shimmer — low-amplitude vertical displacement above the core */
            '<g class="wg-shimmer">' +
            '<path class="wg-hair sh" style="--i:0" d="M20 -36q6-5 12 0t12 0"/>' +
            '<path class="wg-hair sh" style="--i:1" d="M22 -43q5-4 10 0t10 0"/>' +
            '<path class="wg-hair sh" style="--i:2" d="M24 -49q4-3 8 0t8 0"/>' +
            '</g>' +
            /* the compute core */
            '<g class="wg-core">' +
            '<circle class="wg-core__ring" style="--i:0" cx="32" cy="0" r="14"/>' +
            '<circle class="wg-core__ring" style="--i:1" cx="32" cy="0" r="21"/>' +
            '<path class="wg-core__hex" d="M32 -11l9.5 5.5v11L32 11l-9.5-5.5v-11z"/>' +
            '<circle class="wg-core__dot" cx="32" cy="0" r="3.6"/>' +
            '</g>' +
            '<text class="wg-idx" x="-60" y="-59">03</text>';
    }

    /* --- OUTPUT: generated artefacts materialise, then dissolve ------------- */
    function gOut() {
        return '' +
            '<rect class="wg-frame" x="-43" y="-46" width="86" height="92" rx="1.5"/>' +
            '<path class="wg-edge" d="M-43 -38v-8h8M43 -38v-8h-8M-43 38v8h8M43 38v8h-8"/>' +
            '<g class="wg-out">' +
            '<rect class="wg-ln" x="-28" y="-30" width="26" height="20" rx="1"/>' +
            '<rect class="wg-ln" x="3" y="-30" width="26" height="20" rx="1"/>' +
            '<rect class="wg-ln" x="-28" y="-5" width="26" height="20" rx="1"/>' +
            '<rect class="wg-ln" x="3" y="-5" width="26" height="20" rx="1"/>' +
            '<path class="wg-hair" d="M-24 -20h18M-24 -16h11M7 -20h18M7 -16h11' +
            'M-24 5h18M-24 9h11M7 5h18M7 9h11"/>' +
            '</g>' +
            /* floating fragments of the generated result */
            '<g class="wg-frag">' +
            '<rect class="wg-ln fr" style="--i:0" x="-33" y="20" width="12" height="8" rx="1"/>' +
            '<rect class="wg-ln fr" style="--i:1" x="-8" y="22" width="12" height="8" rx="1"/>' +
            '<rect class="wg-ln fr" style="--i:2" x="17" y="19" width="12" height="8" rx="1"/>' +
            '</g>' +
            '<text class="wg-idx" x="-40" y="-34">04</text>';
    }

    var STAGES = [
        { key: 'input', label: 'INPUT', body: gInput },
        { key: 'model', label: 'MODEL', body: gModel },
        { key: 'proc', label: 'PROCESSING', body: gProc },
        { key: 'out', label: 'OUTPUT', body: gOut }
    ];

    /* Build the whole rig for a given layout. Returns an <svg>. */
    function buildRig(layout, particleCount) {
        var L = LAYOUTS[layout];
        var svg = svgEl('svg', {
            'class': 'wg-rig ' + L.cls,
            viewBox: L.vb,
            preserveAspectRatio: 'xMidYMid meet',
            'aria-hidden': 'true',
            focusable: 'false'
        });

        /* layout-dependent motion vectors, consumed by the CSS keyframes */
        svg.style.setProperty('--wg-tx', L.travel[0] + 'px');
        svg.style.setProperty('--wg-ty', L.travel[1] + 'px');
        svg.style.setProperty('--wg-mx', L.toCore[0] + 'px');
        svg.style.setProperty('--wg-my', L.toCore[1] + 'px');

        var m = '';

        /* pipeline rails — drawn in on mount via stroke-dashoffset */
        m += '<path class="wg-rail" d="' + L.rails + '"/>';

        /* four machine stages + their mono labels */
        STAGES.forEach(function (st, i) {
            var p = L.pos[st.key];
            m += '<g class="wg-stage wg-stage--' + st.key + '" style="--i:' + i + '" ' +
                'transform="translate(' + p[0] + ' ' + p[1] + ')">' + st.body() + '</g>';
            m += '<text class="wg-label" text-anchor="' + L.label.anchor + '" x="' +
                (p[0] + L.label.dx) + '" y="' + (p[1] + L.label.dy) + '">' + st.label + '</text>';
        });

        /* flowing particles — count scales with the viewport area */
        var i, seed;
        for (i = 0; i < particleCount; i++) {
            seed = (i * 0.37) % 1;
            m += '<circle class="wg-particle" r="1.1" cx="' +
                (L.start[0] + (seed - 0.5) * 2 * L.drift[0]) + '" cy="' +
                (L.start[1] + (seed - 0.5) * 2 * L.drift[1]) + '" ' +
                'style="--i:' + i + ';--dur:' + (3.4 + seed * 2.6).toFixed(2) + 's"/>';
        }

        /* Travelling media thumbnails: film, waveform, image tiles.
           NOTE: the outer <g> carries the transform ATTRIBUTE for placement and
           the inner <g> carries the CSS transform animation — a CSS transform
           would otherwise override the attribute and snap the group to 0,0. */
        var place = 'transform="translate(' + L.start[0] + ' ' + L.start[1] + ')"';
        ['film', 'wave', 'tiles'].forEach(function (kind, k) {
            m += '<g ' + place + '><g class="wg-thumb" style="--i:' + k + '">' +
                MOTIF[kind] + '</g></g>';
        });

        /* the hover payload: one rough fragment driven all the way through */
        m += '<g ' + place + '><g class="wg-payload">' +
            '<path class="wg-ln" d="M-9-7l11-3l7 8l-5 9l-11-2z"/>' +
            '<path class="wg-hair" d="M-4-2h9M-4 2h5"/>' +
            '</g></g>';

        /* mono readouts */
        var r = L.readouts;
        m += '<text class="wg-read" id="wg-read-thru" x="' + r[0][0] + '" y="' + r[0][1] + '">THRU 06.2/S</text>';
        m += '<text class="wg-read" id="wg-read-bay" x="' + r[1][0] + '" y="' + r[1][1] + '">BAY 01 34%</text>';
        m += '<text class="wg-read" id="wg-read-gen" x="' + r[2][0] + '" y="' + r[2][1] + '">GEN 00%</text>';

        svg.innerHTML = m;
        return svg;
    }

    /* --- rig lifecycle ------------------------------------------------------ */
    function layoutFor() {
        return window.matchMedia('(max-width: 768px)').matches ? 'v' : 'h';
    }

    function renderRig() {
        var stage = S.stage;
        var rect = stage.getBoundingClientRect();
        var area = Math.max(1, rect.width * rect.height);
        /* particle count scales to the entity area */
        var n = S.reduced ? 0 : clamp(Math.round(area / 2400), 4, 14);

        stage.textContent = '';
        S.rig = buildRig(S.layout, n);
        if (S.reduced) S.rig.classList.add('wg--still');
        if (S.hot) S.rig.classList.add('is-hot');
        stage.appendChild(S.rig);

        S.read = {
            thru: S.rig.querySelector('#wg-read-thru'),
            bay: S.rig.querySelector('#wg-read-bay'),
            gen: S.rig.querySelector('#wg-read-gen')
        };
    }

    /* --- the single RAF loop: mono readouts only ---------------------------- */
    function tick(now) {
        if (!S) return;
        S.raf = requestAnimationFrame(tick);
        if (now - S.last < 110) return;       /* ~9 updates/sec is plenty */
        S.last = now;

        var target = S.hot ? 24.8 : 6.2;
        S.thru += (target - S.thru) * 0.07;
        S.gen = (S.gen + (S.hot ? 4.5 : 1.7)) % 101;
        S.bayT += S.hot ? 0.035 : 0.014;
        var bay = (Math.floor(S.bayT) % 4) + 1;
        var load = Math.round((S.bayT % 1) * 99);

        if (S.read.thru) S.read.thru.textContent = 'THRU ' +
            (S.thru < 10 ? '0' : '') + S.thru.toFixed(1) + '/S';
        if (S.read.bay) S.read.bay.textContent = 'BAY ' + pad2(bay) + ' ' + pad2(load) + '%';
        if (S.read.gen) S.read.gen.textContent = 'GEN ' + pad2(Math.round(S.gen)) + '%';
    }

    function startLoop() {
        if (!S || S.reduced || S.raf) return;
        S.last = 0;
        S.raf = requestAnimationFrame(tick);
    }

    function stopLoop() {
        if (S && S.raf) { cancelAnimationFrame(S.raf); S.raf = 0; }
    }

    /* ============================================================================
       PROJECT ENVIRONMENT — THE LAB FLOOR
       ========================================================================== */

    /* thin-line machine frame + media motif for one project bay (8 distinct machine types) */
    function bayArtwork(kind) {
        var motif = '', i, j, x;

        if (kind === 'timeline') {
            /* 01: AI LOCAL VIDEO EDITOR — NLE Timeline scrubbing with playhead & audio energy cuts */
            motif += '<g class="wg-b-timeline">';
            motif += '<rect class="wg-b-ln wg-tl-clip c1" x="16" y="24" width="44" height="13" rx="1.5"/>';
            motif += '<rect class="wg-b-ln wg-tl-clip c2" x="64" y="24" width="52" height="13" rx="1.5"/>';
            motif += '<rect class="wg-b-ln wg-tl-clip c3" x="120" y="24" width="64" height="13" rx="1.5"/>';
            motif += '<path class="wg-b-hair" d="M30 24v13M50 24v13M88 24v13M148 24v13"/>';
            motif += '<rect class="wg-b-hair" x="16" y="41" width="168" height="11" rx="1"/>';
            for (i = 0; i < 24; i++) {
                var ax = 20 + i * 7;
                var ah = 2 + ((i * 7 + 3) % 8);
                motif += '<line class="wg-tl-audio" style="--i:' + i + '" x1="' + ax + '" y1="' + (46.5 - ah/2) + '" x2="' + ax + '" y2="' + (46.5 + ah/2) + '"/>';
            }
            motif += '<rect class="wg-tl-overlay o1" x="40" y="56" width="24" height="6" rx="1"/>';
            motif += '<rect class="wg-tl-overlay o2" x="100" y="56" width="34" height="6" rx="1"/>';
            motif += '<g class="wg-tl-playhead">' +
                '<line class="wg-tl-needle" x1="0" y1="20" x2="0" y2="64"/>' +
                '<polygon class="wg-tl-diamond" points="0,20 -4,15 4,15"/>' +
                '</g>';
            motif += '</g>';
        } else if (kind === 'diffusion') {
            /* 02: OFFLINE IMAGE WORKSTATION — Latent space grid with progressive denoising vectors */
            motif += '<g class="wg-b-diffusion">';
            for (j = 0; j < 2; j++) {
                for (i = 0; i < 4; i++) {
                    var dx = 22 + i * 40;
                    var dy = 24 + j * 20;
                    motif += '<rect class="wg-diff-cell" style="--i:' + (j * 4 + i) + '" x="' + dx + '" y="' + dy + '" width="34" height="16" rx="1.5"/>';
                    motif += '<circle class="wg-diff-seed" style="--i:' + (j * 4 + i) + '" cx="' + (dx + 17) + '" cy="' + (dy + 8) + '" r="2"/>';
                }
            }
            motif += '<path class="wg-diff-vector" d="M39 32 L79 52 M119 32 L159 52 M79 32 L119 52"/>';
            motif += '<circle class="wg-diff-core" cx="99" cy="42" r="14"/>';
            motif += '<circle class="wg-diff-core-pulse" cx="99" cy="42" r="8"/>';
            motif += '</g>';
        } else if (kind === 'facetrack') {
            /* 03: GENESIS: YT-CLIP-MASTER — 16:9 frame + 9:16 vertical crop bounds + face tracking reticle */
            motif += '<g class="wg-b-facetrack">';
            motif += '<rect class="wg-b-hair" x="18" y="22" width="164" height="42" rx="2"/>';
            motif += '<rect class="wg-ft-crop" x="84" y="22" width="32" height="42" stroke-dasharray="3 2"/>';
            motif += '<g class="wg-ft-reticle">' +
                '<path class="wg-ft-bracket" d="M-10 -10h5 M-10 -10v5 M10 -10h-5 M10 -10v5 M-10 10h5 M-10 10v-5 M10 10h-5 M10 10v-5"/>' +
                '<circle class="wg-ft-dot" cx="0" cy="0" r="1.6"/>' +
                '<line class="wg-ft-eyeline" x1="-6" y1="-2" x2="6" y2="-2"/>' +
                '</g>';
            motif += '<line class="wg-ft-caption" x1="88" y1="58" x2="112" y2="58"/>';
            motif += '<line class="wg-ft-caption" x1="92" y1="61" x2="108" y2="61"/>';
            motif += '</g>';
        } else if (kind === 'enhancer') {
            /* 04: PHOTO ENHANCER & BG REMOVER — Coarse pixel blocks + sharp cutout mesh & scanning laser */
            motif += '<g class="wg-b-enhancer">';
            for (j = 0; j < 3; j++) {
                for (i = 0; i < 4; i++) {
                    motif += '<rect class="wg-esr-pixel" style="--i:' + (j*4+i) + '" x="' + (22 + i*16) + '" y="' + (24 + j*14) + '" width="14" height="12"/>';
                }
            }
            motif += '<path class="wg-esr-contour" d="M106 58 C106 38, 122 30, 142 30 C162 30, 178 38, 178 58 Z"/>';
            motif += '<circle class="wg-esr-mesh-dot" cx="142" cy="40" r="2.5"/>';
            motif += '<path class="wg-b-hair" d="M118 48h48 M126 54h32"/>';
            motif += '<g class="wg-esr-laser-group">' +
                '<line class="wg-esr-beam" x1="0" y1="20" x2="0" y2="66"/>' +
                '<circle class="wg-esr-spark" cx="0" cy="43" r="2"/>' +
                '</g>';
            motif += '</g>';
        } else if (kind === 'audio') {
            /* 05: CHATTERBOX AUDIO STUDIO — 22-bar voice frequency spectrum analyzer + voice formant ripples */
            motif += '<g class="wg-b-audio">';
            for (i = 0; i < 22; i++) {
                var bx = 22 + i * 7.2;
                var bmax = 8 + ((i * 11) % 18);
                motif += '<line class="wg-audio-eq-bar" style="--i:' + i + ';--h:' + bmax + '" x1="' + bx + '" y1="62" x2="' + bx + '" y2="' + (62 - bmax) + '"/>';
                motif += '<rect class="wg-audio-peak" style="--i:' + i + '" x="' + (bx - 1) + '" y="' + (60 - bmax) + '" width="2" height="1.5"/>';
            }
            motif += '<path class="wg-audio-wave" d="M22 40 Q 56 22, 92 40 T 162 40 T 176 40"/>';
            motif += '<circle class="wg-audio-core" cx="22" cy="40" r="3"/>';
            motif += '</g>';
        } else if (kind === 'pipeline') {
            /* 06: LONG-FORMAT VIDEO PIPELINE — Modular conveyor assembly with flowing packet conduits */
            motif += '<g class="wg-b-pipeline">';
            var px = [22, 64, 106, 148];
            for (i = 0; i < 4; i++) {
                motif += '<rect class="wg-pipe-stage" style="--i:' + i + '" x="' + px[i] + '" y="28" width="28" height="28" rx="2"/>';
                motif += '<circle class="wg-pipe-node" style="--i:' + i + '" cx="' + (px[i] + 14) + '" cy="42" r="3"/>';
            }
            motif += '<line class="wg-pipe-conduit" x1="50" y1="42" x2="64" y2="42"/>';
            motif += '<line class="wg-pipe-conduit" x1="92" y1="42" x2="106" y2="42"/>';
            motif += '<line class="wg-pipe-conduit" x1="134" y1="42" x2="148" y2="42"/>';
            motif += '<circle class="wg-pipe-pkt pkt-1" cx="0" cy="42" r="2.4"/>';
            motif += '<circle class="wg-pipe-pkt pkt-2" cx="0" cy="42" r="2.4"/>';
            motif += '<path class="wg-pipe-rail" d="M16 62h168M20 65h160" stroke-dasharray="6 4"/>';
            motif += '</g>';
        } else if (kind === 'automl') {
            /* 07: AI DATA ANALYST & AUTOML — Decision tree synapse DAG + animated ROC/AUC loss curve */
            motif += '<g class="wg-b-automl">';
            var l1 = [28, 42, 56];
            var l2 = [22, 35, 48, 61];
            var l3 = [28, 42, 56];
            var l4 = [35, 49];
            for (i = 0; i < 3; i++) {
                for (j = 0; j < 4; j++) {
                    motif += '<line class="wg-aml-synapse" style="--i:' + (i+j) + '" x1="30" y1="' + l1[i] + '" x2="72" y2="' + l2[j] + '"/>';
                }
            }
            for (i = 0; i < 4; i++) {
                for (j = 0; j < 3; j++) {
                    motif += '<line class="wg-aml-synapse" style="--i:' + (i*2+j) + '" x1="72" y1="' + l2[i] + '" x2="118" y2="' + l3[j] + '"/>';
                }
            }
            for (i = 0; i < 3; i++) {
                for (j = 0; j < 2; j++) {
                    motif += '<line class="wg-aml-synapse" style="--i:' + (i+j*3) + '" x1="118" y1="' + l3[i] + '" x2="164" y2="' + l4[j] + '"/>';
                }
            }
            for (i = 0; i < 3; i++) motif += '<circle class="wg-aml-node" style="--i:' + i + '" cx="30" cy="' + l1[i] + '" r="2.8"/>';
            for (i = 0; i < 4; i++) motif += '<circle class="wg-aml-node" style="--i:' + (i+3) + '" cx="72" cy="' + l2[i] + '" r="2.8"/>';
            for (i = 0; i < 3; i++) motif += '<circle class="wg-aml-node" style="--i:' + (i+7) + '" cx="118" cy="' + l3[i] + '" r="2.8"/>';
            for (i = 0; i < 2; i++) motif += '<circle class="wg-aml-node" style="--i:' + (i+10) + '" cx="164" cy="' + l4[i] + '" r="3.2"/>';
            motif += '<path class="wg-aml-curve" d="M30 65 Q 80 62, 130 36 T 172 26"/>';
            motif += '</g>';
        } else if (kind === 'publisher') {
            /* 08: GENESIS: LINKEDIN PUBLISHER — Social post frame with typewriter beam & broadcast pulse */
            motif += '<g class="wg-b-publisher">';
            motif += '<rect class="wg-pub-card" x="20" y="22" width="130" height="44" rx="2"/>';
            motif += '<circle class="wg-pub-avatar" cx="30" cy="32" r="4"/>';
            motif += '<line class="wg-pub-text t1" x1="38" y1="30" x2="100" y2="30"/>';
            motif += '<line class="wg-pub-text t2" x1="38" y1="35" x2="80" y2="35"/>';
            motif += '<rect class="wg-pub-img" x="26" y="42" width="118" height="18" rx="1.5"/>';
            motif += '<circle class="wg-pub-ring" cx="85" cy="51" r="5" stroke-dasharray="4 3"/>';
            motif += '<circle class="wg-pub-beacon" cx="164" cy="34" r="3.5"/>';
            motif += '<line class="wg-b-ln" x1="164" y1="37.5" x2="164" y2="60"/>';
            motif += '<path class="wg-pub-wave w1" d="M170 28 a 9 9 0 0 1 0 12"/>';
            motif += '<path class="wg-pub-wave w2" d="M174 24 a 15 15 0 0 1 0 20"/>';
            motif += '<path class="wg-pub-wave w3" d="M178 20 a 21 21 0 0 1 0 28"/>';
            motif += '</g>';
        } else {
            /* Fallback generic high-tech module */
            for (j = 0; j < 2; j++) {
                for (i = 0; i < 5; i++) {
                    motif += '<rect class="wg-b-tile" style="--i:' + (j * 5 + i) + '" x="' +
                        (18 + i * 34) + '" y="' + (24 + j * 19) + '" width="28" height="15" rx="1"/>';
                }
            }
        }

        return '<svg class="wg-bay__art" viewBox="0 0 200 84" preserveAspectRatio="xMidYMid meet" ' +
            'aria-hidden="true" focusable="false">' +
            /* machine frame: rack ears, bay rails, connector lugs */
            '<path class="wg-b-frame" d="M6 8h188v68H6z"/>' +
            '<path class="wg-b-hair" d="M6 18h188M6 66h188"/>' +
            '<path class="wg-b-edge" d="M0 12v-4h10M200 12v-4h-10M0 72v4h10M200 72v4h-10"/>' +
            '<circle class="wg-b-lug" cx="12" cy="13" r="1.6"/>' +
            '<circle class="wg-b-lug" cx="188" cy="13" r="1.6"/>' +
            '<path class="wg-b-hair" d="M170 68h20M170 72h12"/>' +
            '<g class="wg-b-motif">' + motif + '</g>' +
            '</svg>';
    }

    function statusClass(status) {
        return 'wg-chip--' + String(status).toLowerCase().replace(/[^a-z]+/g, '-');
    }

    function buildFloor(ctx) {
        var host = ctx.projectStage;

        /* hide the core's plain-list fallback while this module owns the stage */
        var fb = host.querySelector('.u-worldstage__fallback');
        if (fb) fb.hidden = true;

        var floor = document.createElement('div');
        floor.className = 'wg-floor';

        var head = '' +
            '<header class="wg-floor__head">' +
            '<p class="wg-kicker">LAB FLOOR &middot; ' + pad2(ctx.projects.length) + ' PROCESSING BAYS</p>' +
            '<h2 class="wg-floor__title">Machines that generate.</h2>' +
            '<p class="wg-floor__lead">Every system on this floor runs its models on local hardware. ' +
            'Raw input enters a bay, the GPU does the work, and the generated output never leaves ' +
            'the machine.</p>' +
            '</header>';

        var plot = '<div class="wg-floor__plot">';
        ctx.projects.forEach(function (p, i) {
            var kind = BAY_MOTIF[p.id] || 'timeline';
            plot +=
                '<button type="button" class="wg-bay wg-bay--' + kind + '" data-id="' + esc(p.id) + '" ' +
                'style="--i:' + i + '" ' +
                'aria-label="' + esc(p.name + '. ' + p.status + '. ' + p.blurb) + '">' +
                '<span class="wg-bay__idx">' + pad2(i + 1) + '</span>' +
                bayArtwork(kind) +
                '<span class="wg-bay__name">' + esc(p.name) + '</span>' +
                '<span class="wg-bay__meta">' +
                '<span class="wg-chip ' + statusClass(p.status) + '">' + esc(p.status) + '</span>' +
                '</span>' +
                '<span class="wg-bay__blurb">' + esc(p.blurb) + '</span>' +
                '</button>';
        });
        plot += '</div>';

        floor.innerHTML = head + plot;
        host.appendChild(floor);

        /* one delegated click handler for all eight bays */
        S.onClick = function (e) {
            var btn = e.target.closest ? e.target.closest('.wg-bay') : null;
            if (btn && btn.dataset.id) ctx.onOpenProject(btn.dataset.id);
        };
        floor.addEventListener('click', S.onClick);

        /* pointer parallax — desktop spatial layout only, transform only */
        var plotEl = floor.querySelector('.wg-floor__plot');
        if (!S.reduced && window.matchMedia('(hover: hover) and (min-width: 1025px)').matches) {
            S.onMove = function (e) {
                var r = plotEl.getBoundingClientRect();
                S.px = ((e.clientX - r.left) / r.width - 0.5) * 2;
                S.py = ((e.clientY - r.top) / r.height - 0.5) * 2;
                if (S.pending) return;
                S.pending = requestAnimationFrame(function () {
                    S.pending = 0;
                    plotEl.style.setProperty('--wg-px', S.px.toFixed(3));
                    plotEl.style.setProperty('--wg-py', S.py.toFixed(3));
                });
            };
            plotEl.addEventListener('pointermove', S.onMove);
            S.plotEl = plotEl;
        }

        S.floor = floor;
        S.fallback = fb;
    }

    /* ============================================================================
       WORLD MODULE
       ========================================================================== */
    var MODULE = {
        id: 'generators',

        mount: function (ctx) {
            if (S) MODULE.unmount();

            S = {
                stage: ctx.stage,
                projectStage: ctx.projectStage,
                reduced: !!ctx.reducedMotion,
                layout: layoutFor(),
                hot: false,
                rig: null, read: {},
                raf: 0, last: 0, pending: 0,
                thru: 6.2, gen: 0, bayT: 0,
                px: 0, py: 0,
                floor: null, fallback: null, plotEl: null,
                spinTimer: 0,
                onClick: null, onMove: null, onVis: null, onMQ: null, mq: null
            };

            S.stage.classList.add('wg-host');
            renderRig();
            buildFloor(ctx);

            /* swap the rig between the wide and the vertical pipeline */
            S.mq = window.matchMedia('(max-width: 768px)');
            S.onMQ = function () {
                var next = layoutFor();
                if (next === S.layout) return;
                S.layout = next;
                renderRig();
            };
            if (S.mq.addEventListener) S.mq.addEventListener('change', S.onMQ);
            else S.mq.addListener(S.onMQ);

            /* pause the readout loop while the tab is hidden */
            S.onVis = function () {
                if (document.hidden) stopLoop(); else startLoop();
            };
            document.addEventListener('visibilitychange', S.onVis);

            if (!document.hidden) startLoop();
        },

        unmount: function () {
            if (!S) return;

            stopLoop();
            if (S.pending) cancelAnimationFrame(S.pending);
            if (S.spinTimer) clearTimeout(S.spinTimer);

            if (S.mq && S.onMQ) {
                if (S.mq.removeEventListener) S.mq.removeEventListener('change', S.onMQ);
                else S.mq.removeListener(S.onMQ);
            }
            if (S.onVis) document.removeEventListener('visibilitychange', S.onVis);
            if (S.floor && S.onClick) S.floor.removeEventListener('click', S.onClick);
            if (S.plotEl && S.onMove) S.plotEl.removeEventListener('pointermove', S.onMove);

            if (S.stage) {
                S.stage.classList.remove('wg-host');
                S.stage.textContent = '';
            }
            if (S.floor && S.floor.parentNode) S.floor.parentNode.removeChild(S.floor);
            if (S.fallback) S.fallback.hidden = false;   /* hand the stage back */

            S = null;
        },

        /* slot hover / focus — and, on touch, scroll-into-view via the core's
           IntersectionObserver. Runs the full transformation pass. */
        onHover: function (active) {
            if (!S) return;
            S.hot = !!active;
            if (S.rig) S.rig.classList.toggle('is-hot', S.hot);
        },

        /* brief core over-spin, under 180ms. Core does not wait on this. */
        onActivate: function () {
            if (!S || !S.rig || S.reduced) return;
            S.rig.classList.add('is-spin');
            if (S.spinTimer) clearTimeout(S.spinTimer);
            S.spinTimer = setTimeout(function () {
                if (S && S.rig) S.rig.classList.remove('is-spin');
            }, 170);
        }
    };

    if (window.UNIVERSE && typeof window.UNIVERSE.registerWorld === 'function') {
        window.UNIVERSE.registerWorld(MODULE);
    } else {
        /* core may initialise after this file parses */
        window.addEventListener('DOMContentLoaded', function () {
            if (window.UNIVERSE && window.UNIVERSE.registerWorld) {
                window.UNIVERSE.registerWorld(MODULE);
            }
        });
    }
}());
