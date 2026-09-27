/* ============================================================================
 * world-agents.js — WORLD 02 · AI AUTOMATION & AGENTS
 * ----------------------------------------------------------------------------
 * Entity  : a half-length autonomous humanoid, procedural SVG, plus a five-node
 *           agent loop (INPUT -> REASONING -> TOOLS -> ACTION -> RESULT).
 * Fleet   : 11 projects laid out as a command topology; the five GENESIS:*
 *           subsystems cluster around the GENESIS supervisor node.
 *
 * Motion is CSS-driven on purpose: no requestAnimationFrame loop runs for the
 * entity or the topology, so there is nothing to leak. The only JS timing is
 * (a) the long-interval mechanical "tics" and (b) one rAF-coalesced parallax
 * write, both torn down in unmount().
 *
 * Everything lives inside this IIFE; the single global effect is registerWorld.
 * ========================================================================== */
(function () {
    'use strict';

    if (!window.UNIVERSE || !window.UNIVERSE.registerWorld) return;

    /* ------------------------------------------------------------------ *
     * module state — reset on every mount, ctx is never cached across one
     * ------------------------------------------------------------------ */
    var S = {
        alive: false,
        stage: null,
        fleet: null,
        svg: null,
        awake: false,
        static: false,
        open: null,          // fn(projectId)
        ticT: 0,             // servo / panel tic timer
        panelT: 0,
        surgeT: 0,
        raf: 0,
        mq: null,
        onMQ: null
    };

    var mqNarrow = window.matchMedia('(max-width: 768px)');
    var mqHover = window.matchMedia('(hover: hover) and (pointer: fine)');

    /* ==================================================================== *
     * 1. THE ROBOT — deliberate geometry, drawn once as markup.
     *    Base coordinate space: x 34..144, y 13..210 (half-length: the legs
     *    run off the bottom edge of the frame on purpose).
     * ==================================================================== */
    function robotMarkup() {
        return [
            /* ---- pelvis + legs (static; the frame crops them) ---------- */
            '<g class="wa-base">',
            '<path class="wa-plate" d="M69 172 L82 172 L81 210 L68 210 Z"/>',
            '<path class="wa-plate" d="M90 172 L103 172 L104 210 L91 210 Z"/>',
            '<path class="wa-plate" d="M64 148 L108 148 L105 172 L67 172 Z"/>',
            '<circle class="wa-joint" cx="75" cy="176" r="3"/>',
            '<circle class="wa-joint" cx="97" cy="176" r="3"/>',
            '</g>',

            /* ---- chest assembly: breathes on a ~4s cycle --------------- */
            '<g class="wa-chest">',

            /*   left arm, set behind the torso ------------------------- */
            '<g class="wa-arm-l">',
            '<path class="wa-plate wa-recede" d="M41 104 L52 102 L49 130 L39 128 Z"/>',
            '<circle class="wa-joint wa-recede" cx="44" cy="131" r="5"/>',
            '<path class="wa-plate wa-recede" d="M40 134 L50 133 L53 162 L44 162 Z"/>',
            '</g>',

            /*   shoulder assemblies ------------------------------------ */
            '<path class="wa-plate" d="M38 92 L62 84 L64 104 L42 110 Z"/>',
            '<path class="wa-plate" d="M110 84 L134 92 L130 110 L108 104 Z"/>',

            /*   torso ---------------------------------------------------*/
            '<path class="wa-plate" d="M62 84 L110 84 L114 118 L108 148 L64 148 L58 118 Z"/>',
            '<path class="wa-hair" d="M66 91 L106 91"/>',
            '<path class="wa-hair" d="M62 143 L110 143"/>',

            /*   shoulder joints (over the plate seam) ------------------- */
            '<circle class="wa-joint" cx="48" cy="99" r="5.5"/>',
            '<circle class="wa-joint" cx="124" cy="99" r="5.5"/>',
            '<circle class="wa-joint-pin" cx="48" cy="99" r="1.6"/>',
            '<circle class="wa-joint-pin" cx="124" cy="99" r="1.6"/>',

            /*   service panel: cover irises open on a long interval ------*/
            '<g class="wa-panel">',
            '<path class="wa-panel-lead" d="M67 129 L81 129"/>',
            '<path class="wa-panel-lead" d="M67 135 L81 135"/>',
            '<path class="wa-panel-lead" d="M67 141 L78 141"/>',
            '<rect class="wa-panel-cover" x="64" y="124" width="22" height="22" rx="1"/>',
            '</g>',

            /*   heat vents --------------------------------------------- */
            '<path class="wa-hair" d="M94 128 L106 128"/>',
            '<path class="wa-hair" d="M94 134 L106 134"/>',
            '<path class="wa-hair" d="M94 140 L103 140"/>',

            /*   power core — pulses out of phase with the optic --------- */
            '<g class="wa-core">',
            '<circle class="wa-core-ring" cx="86" cy="110" r="11.5"/>',
            '<path class="wa-core-tick" d="M86 96 L86 100 M86 120 L86 124 M72 110 L76 110 M96 110 L100 110"/>',
            '<circle class="wa-core-mid" cx="86" cy="110" r="6.5"/>',
            '<circle class="wa-core-hot" cx="86" cy="110" r="3"/>',
            '</g>',

            /*   neck ---------------------------------------------------- */
            '<path class="wa-plate" d="M78 74 L94 74 L94 85 L78 85 Z"/>',
            '<path class="wa-hair" d="M78 79 L94 79"/>',

            /*   right arm, articulated, in front ------------------------ */
            '<g class="wa-arm-r">',
            '<path class="wa-plate" d="M118 102 L129 99 L143 124 L134 130 Z"/>',
            '<circle class="wa-joint" cx="138" cy="128" r="5.5"/>',
            '<g class="wa-forearm">',
            '<path class="wa-plate" d="M133 131 L143 130 L140 160 L131 160 Z"/>',
            '<circle class="wa-joint" cx="136" cy="162" r="4"/>',
            '<path class="wa-plate" d="M129 165 L144 165 L142 175 L131 175 Z"/>',
            '<path class="wa-digit" d="M131 175 L134 175 L134 184 L131 184 Z"/>',
            '<path class="wa-digit wa-finger" d="M135 175 L138 175 L138 185 L135 185 Z"/>',
            '<path class="wa-digit" d="M139 175 L142 175 L141 183 L138 183 Z"/>',
            '</g>',
            '</g>',

            '</g>', /* /wa-chest */

            /* ---- head: soft bob + occasional servo tic ----------------- */
            '<g class="wa-head-bob">',
            '<g class="wa-head">',
            '<path class="wa-hair" d="M86 26 L86 15"/>',
            '<circle class="wa-beacon" cx="86" cy="13" r="2.2"/>',
            '<path class="wa-plate" d="M66 34 L77 26 L95 26 L106 34 L106 44 L66 44 Z"/>',
            '<rect class="wa-plate" x="64" y="44" width="44" height="22" rx="2.5"/>',
            '<rect class="wa-plate" x="58.5" y="48" width="5" height="11" rx="1"/>',
            '<rect class="wa-plate" x="108.5" y="48" width="5" height="11" rx="1"/>',
            '<path class="wa-plate" d="M68 66 L104 66 L100 74 L72 74 Z"/>',
            '<path class="wa-hair" d="M70 70 L102 70"/>',
            /*   single optical core --------------------------------------*/
            '<g class="wa-optic">',
            '<circle class="wa-eye-ring" cx="86" cy="55" r="8"/>',
            '<circle class="wa-eye-mid" cx="86" cy="55" r="4.4"/>',
            '<circle class="wa-eye-hot" cx="86" cy="55" r="1.9"/>',
            '</g>',
            '</g>',
            '</g>'
        ].join('');
    }

    /* ==================================================================== *
     * 2. THE FIVE-NODE AGENT LOOP
     *    Two authored layouts. Wide = horizontal zig-zag beside the figure.
     *    Narrow (<=768px) = the same five nodes stacked vertically.
     *    Every path carries pathLength="100" so the draw-in and the travelling
     *    pulse are normalised regardless of real path length.
     * ==================================================================== */
    var NODES = [
        { label: 'INPUT',     token: 'RUN' },
        { label: 'REASONING', token: '↻' },
        { label: 'TOOLS',     token: '200' },
        { label: 'ACTION',    token: 'RUN' },
        { label: 'RESULT',    token: 'OK' }
    ];

    var LAYOUT = {
        wide: {
            vb: '0 0 420 210',
            bot: 'translate(0,0)',
            pos: [[188, 150], [244, 104], [300, 148], [352, 96], [398, 142]],
            label: { dx: 0, dy: 19, anchor: 'middle' },
            token: { dx: 13, dy: -12, anchor: 'start' },
            /* edge 0 is the robot's own tether into INPUT */
            edges: [
                'M112 116 C 140 126, 160 142, 181 149',
                'M195 146 C 212 140, 222 118, 238 108',
                'M251 108 C 266 118, 278 138, 293 145',
                'M307 144 C 322 136, 332 112, 346 101',
                'M358 101 C 372 112, 382 128, 392 137',
                'M398 135 C 410 58, 312 26, 247 97'   /* RESULT -> REASONING feedback */
            ],
            /* glyph count scales with the drawing area (6 wide / 3 narrow) */
            glyphs: [
                [24, 44, '01'], [152, 62, 'ACK'], [18, 112, '0x1F'],
                [30, 170, '10'], [158, 178, '»'], [166, 120, '11']
            ]
        },
        narrow: {
            vb: '0 0 340 330',
            bot: 'translate(2,55) scale(1.05)',
            pos: [[236, 38], [236, 100], [236, 162], [236, 224], [236, 286]],
            label: { dx: 15, dy: 4, anchor: 'start' },
            token: { dx: -14, dy: 4, anchor: 'end' },
            edges: [
                'M122 172 C 168 168, 200 116, 228 44',
                'M236 45 L236 93',
                'M236 107 L236 155',
                'M236 169 L236 217',
                'M236 231 L236 279',
                'M243 286 C 300 260, 300 126, 243 100'
            ],
            glyphs: [[22, 60, '01'], [160, 96, 'ACK'], [26, 300, '0x1F']]
        }
    };

    function layout() {
        return mqNarrow.matches ? LAYOUT.narrow : LAYOUT.wide;
    }

    function entityMarkup() {
        var L = layout();
        var out = ['<svg class="wa-entity" viewBox="' + L.vb +
            '" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">'];

        /* --- the figure ------------------------------------------------ */
        out.push('<g class="wa-bot" transform="' + L.bot + '">' + robotMarkup() + '</g>');

        /* --- drifting data glyphs -------------------------------------- */
        out.push('<g class="wa-glyphs">');
        L.glyphs.forEach(function (g, i) {
            out.push('<text class="wa-glyph" style="--i:' + i + '" x="' + g[0] +
                '" y="' + g[1] + '">' + g[2] + '</text>');
        });
        out.push('</g>');

        /* --- the network ----------------------------------------------- */
        out.push('<g class="wa-net">');

        /* base edges, drawn in dependency order on wake */
        L.edges.forEach(function (d, i) {
            out.push('<path class="wa-edge" style="--i:' + i +
                '" pathLength="100" d="' + d + '"/>');
        });
        /* travelling data pulses, one per completed edge */
        L.edges.forEach(function (d, i) {
            out.push('<path class="wa-edge-pulse" style="--i:' + i +
                '" pathLength="100" d="' + d + '"/>');
        });

        NODES.forEach(function (n, i) {
            var p = L.pos[i];
            out.push('<g class="wa-node" style="--i:' + i + '">');
            out.push('<circle class="wa-node-ring" cx="' + p[0] + '" cy="' + p[1] + '" r="7"/>');
            out.push('<circle class="wa-node-dot" cx="' + p[0] + '" cy="' + p[1] + '" r="2.6"/>');
            out.push('<text class="wa-node-label" text-anchor="' + L.label.anchor +
                '" x="' + (p[0] + L.label.dx) + '" y="' + (p[1] + L.label.dy) + '">' +
                n.label + '</text>');
            out.push('<text class="wa-node-token" text-anchor="' + L.token.anchor +
                '" x="' + (p[0] + L.token.dx) + '" y="' + (p[1] + L.token.dy) + '">' +
                n.token + '</text>');
            out.push('</g>');
        });

        out.push('</g></svg>');
        return out.join('');
    }

    function renderEntity() {
        S.stage.innerHTML = entityMarkup();
        S.svg = S.stage.querySelector('.wa-entity');
        syncEntityFlags();
    }

    function syncEntityFlags() {
        if (!S.svg) return;
        S.svg.classList.toggle('is-awake', S.awake && !S.static);
        S.svg.classList.toggle('is-static', S.static);
    }

    /* ---- long-interval mechanical tics (servo turn / panel iris) ------- */
    function scheduleTic() {
        if (!S.alive || S.static) return;
        S.ticT = setTimeout(function () {
            if (!S.alive || !S.svg) return;
            if (Math.random() < 0.5) {
                var head = S.svg.querySelector('.wa-head');
                if (head) {
                    head.classList.add('is-tic');
                    S.panelT = setTimeout(function () {
                        head.classList.remove('is-tic');
                    }, 700);
                }
            } else {
                var panel = S.svg.querySelector('.wa-panel');
                if (panel) {
                    panel.classList.add('is-open');
                    S.panelT = setTimeout(function () {
                        panel.classList.remove('is-open');
                    }, 1900);
                }
            }
            scheduleTic();
        }, 5200 + Math.random() * 7000);
    }

    /* ==================================================================== *
     * 3. THE FLEET — command topology for the 11 projects.
     *    x / y are percentages of the map box; the SVG overlay uses the same
     *    0..100 space (preserveAspectRatio="none") so anchors line up exactly.
     *    Authored in visual reading order => DOM order => tab order.
     * ==================================================================== */
    var PLACES = [
        /* id,                        x,  y,   w%,  depth, tier */
        ['sebastian',                  4,  6,  22, 1.00, 'lead'],
        ['multi-llm-arena',           70,  8,  22, 0.70, 'lead'],
        ['genesis-job-agent',         52, 24,  20, 0.55, 'sub'],
        ['openinstaflow',             79, 31,  19, 0.75, 'lead'],
        ['genesis',                   24, 36,  24, 1.00, 'hub'],
        ['genesis-jobpulse',          55, 46,  20, 0.60, 'sub'],
        ['genesis-cold-mails',         6, 52,  18, 0.50, 'sub'],
        ['social-automation',         76, 60,  22, 0.80, 'lead'],
        ['genesis-yt-auto',           26, 66,  22, 0.60, 'sub'],
        ['genesis-linkedin-outreach', 50, 74,  22, 0.55, 'sub'],
        ['streak-guardian',            8, 86,  22, 0.70, 'lead']
    ];

    /* hairline command paths. 'hub' edges are the GENESIS cluster and read
       slightly stronger, so the topology tells the architectural truth. */
    var LINKS = [
        ['sebastian', 'genesis',                   'M4 6 Q 10 22 24 36',      1],
        ['sebastian', 'multi-llm-arena',           'M4 6 Q 37 1 70 8',        0],
        ['sebastian', 'streak-guardian',           'M4 6 C 1 40, 1 70, 8 86', 0],
        ['genesis', 'genesis-job-agent',           'M24 36 Q 40 27 52 24',    1],
        ['genesis', 'genesis-jobpulse',            'M24 36 Q 41 43 55 46',    1],
        ['genesis', 'genesis-cold-mails',          'M24 36 Q 12 41 6 52',     1],
        ['genesis', 'genesis-yt-auto',             'M24 36 Q 28 51 26 66',    1],
        ['genesis', 'genesis-linkedin-outreach',   'M24 36 Q 34 58 50 74',    1],
        ['social-automation', 'openinstaflow',     'M76 60 Q 82 45 79 31',    0],
        ['genesis-linkedin-outreach', 'social-automation', 'M50 74 Q 64 70 76 60', 0]
    ];

    var STATUS_CLASS = {
        'LIVE': 'wa-chip--live',
        'PRIVATE': 'wa-chip--private',
        'OPEN SOURCE': 'wa-chip--open',
        'EXPERIMENTAL': 'wa-chip--experimental'
    };

    function esc(s) {
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function renderFleet(projects) {
        var byId = {};
        projects.forEach(function (p) { byId[p.id] = p; });

        /* authored order first, then anything the data adds later */
        var ordered = [];
        PLACES.forEach(function (pl) {
            if (byId[pl[0]]) { ordered.push({ p: byId[pl[0]], pl: pl }); delete byId[pl[0]]; }
        });
        projects.forEach(function (p) {
            if (byId[p.id]) ordered.push({ p: p, pl: [p.id, 8, 94, 22, 0.6, 'sub'] });
        });

        var out = [];
        out.push('<div class="wa-fleet' + (S.static ? ' is-static' : '') + '">');

        out.push('<div class="wa-fleet__head">');
        out.push('<p class="wa-fleet__eyebrow">02 / FLEET TOPOLOGY · ' +
            ordered.length + ' SYSTEMS</p>');
        out.push('<h2 class="wa-fleet__title">Systems that run themselves</h2>');
        out.push('<p class="wa-fleet__lead">An operating fleet. One supervisor process, ' +
            'five subsystems reporting into it, and independent agents holding their own ' +
            'ground on the edges.</p>');
        out.push('</div>');

        out.push('<div class="wa-map">');

        /* --- connection overlay ---------------------------------------- */
        out.push('<svg class="wa-map__links" viewBox="0 0 100 100" ' +
            'preserveAspectRatio="none" aria-hidden="true" focusable="false">');
        LINKS.forEach(function (l, i) {
            var attrs = ' data-a="' + l[0] + '" data-b="' + l[1] +
                '" pathLength="100" d="' + l[2] + '"';
            out.push('<path class="wa-link' + (l[3] ? ' wa-link--hub' : '') + '"' + attrs + '/>');
            out.push('<path class="wa-link-pulse" style="--i:' + i + '"' + attrs + '/>');
        });
        out.push('</svg>');

        /* --- project objects ------------------------------------------- */
        ordered.forEach(function (o, i) {
            var p = o.p, pl = o.pl;
            var idx = String(i + 1).padStart(2, '0');
            var chip = STATUS_CLASS[p.status] || 'wa-chip--private';
            out.push(
                '<button type="button" class="wa-obj wa-obj--' + pl[5] + '" ' +
                'data-pid="' + esc(p.id) + '" ' +
                'style="--x:' + pl[1] + '%;--y:' + pl[2] + '%;--w:' + pl[3] + '%;--d:' + pl[4] + '" ' +
                'aria-label="' + esc(p.name + '. ' + p.blurb + ' Status: ' + p.status) + '">' +
                '<span class="wa-obj__name">' + esc(p.name) + '</span>' +
                '<span class="wa-obj__meta" aria-hidden="true">' +
                '<span class="wa-chip ' + chip + '">' + esc(p.status) + '</span>' +
                '<span class="wa-obj__idx">' + idx + '</span>' +
                '</span>' +
                '<span class="wa-obj__blurb" aria-hidden="true">' + esc(p.blurb) + '</span>' +
                '</button>'
            );
        });

        out.push('</div></div>');
        return out.join('');
    }

    /* ---- connected-path highlight -------------------------------------- */
    function litPaths(root, id, on) {
        if (!id) return;
        var sel = '[data-a="' + id + '"],[data-b="' + id + '"]';
        var paths = root.querySelectorAll('.wa-map__links ' + sel);
        for (var i = 0; i < paths.length; i++) paths[i].classList.toggle('is-lit', on);
    }

    function objOf(node) {
        return node && node.closest ? node.closest('.wa-obj') : null;
    }

    /* ---- parallax: one rAF-coalesced write of two custom properties ---- */
    function bindParallax(root) {
        if (S.static || !mqHover.matches) return;
        var px = 0, py = 0;
        root.addEventListener('pointermove', function (e) {
            var r = root.getBoundingClientRect();
            px = ((e.clientX - r.left) / Math.max(r.width, 1) - 0.5) * 2;   /* -1..1 */
            py = ((e.clientY - r.top) / Math.max(r.height, 1) - 0.5) * 2;
            if (S.raf) return;
            S.raf = requestAnimationFrame(function () {
                S.raf = 0;
                root.style.setProperty('--wa-px', (px * 14).toFixed(2));
                root.style.setProperty('--wa-py', (py * 10).toFixed(2));
            });
        });
        root.addEventListener('pointerleave', function () {
            root.style.setProperty('--wa-px', '0');
            root.style.setProperty('--wa-py', '0');
        });
    }

    function bindFleet(root) {
        /* delegated: pointer, focus and activation all route through the root */
        root.addEventListener('click', function (e) {
            var b = objOf(e.target);
            if (b && S.open) S.open(b.getAttribute('data-pid'));
        });
        root.addEventListener('pointerover', function (e) {
            var b = objOf(e.target);
            if (b) litPaths(root, b.getAttribute('data-pid'), true);
        });
        root.addEventListener('pointerout', function (e) {
            var b = objOf(e.target);
            if (b) litPaths(root, b.getAttribute('data-pid'), false);
        });
        root.addEventListener('focusin', function (e) {
            var b = objOf(e.target);
            if (b) litPaths(root, b.getAttribute('data-pid'), true);
        });
        root.addEventListener('focusout', function (e) {
            var b = objOf(e.target);
            if (b) litPaths(root, b.getAttribute('data-pid'), false);
        });
        bindParallax(root);
    }

    /* ==================================================================== *
     * 4. WORLD INTERFACE
     * ==================================================================== */
    window.UNIVERSE.registerWorld({
        id: 'agents',

        mount: function (ctx) {
            S.alive = true;
            S.static = !!ctx.reducedMotion;
            S.awake = S.static;                 /* static frame is fully drawn */
            S.stage = ctx.stage;
            S.fleet = ctx.projectStage;
            S.open = ctx.onOpenProject;

            renderEntity();

            ctx.projectStage.innerHTML = renderFleet(ctx.projects);
            bindFleet(ctx.projectStage);

            /* the entity swaps between the horizontal and stacked network */
            S.onMQ = function () { if (S.alive) renderEntity(); };
            if (mqNarrow.addEventListener) mqNarrow.addEventListener('change', S.onMQ);
            else if (mqNarrow.addListener) mqNarrow.addListener(S.onMQ);

            scheduleTic();
        },

        unmount: function () {
            S.alive = false;
            clearTimeout(S.ticT);
            clearTimeout(S.panelT);
            clearTimeout(S.surgeT);
            if (S.raf) cancelAnimationFrame(S.raf);
            S.raf = 0;

            if (S.onMQ) {
                if (mqNarrow.removeEventListener) mqNarrow.removeEventListener('change', S.onMQ);
                else if (mqNarrow.removeListener) mqNarrow.removeListener(S.onMQ);
                S.onMQ = null;
            }
            /* dropping the roots drops every delegated listener with them */
            if (S.stage) S.stage.innerHTML = '';
            if (S.fleet) S.fleet.innerHTML = '';
            S.stage = S.fleet = S.svg = S.open = null;
            S.awake = false;
        },

        onHover: function (active) {
            if (S.static) return;               /* static frame never re-sequences */
            S.awake = !!active;
            syncEntityFlags();
        },

        onActivate: function () {
            if (!S.svg || S.static) return;
            S.svg.classList.add('is-surge');
            clearTimeout(S.surgeT);
            S.surgeT = setTimeout(function () {
                if (S.svg) S.svg.classList.remove('is-surge');
            }, 170);                            /* under the 180ms core grace */
        }
    });
})();
