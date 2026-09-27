/* ============================================================================
 * world-live.js — WORLD 01 · LIVE PROJECTS
 * ----------------------------------------------------------------------------
 * Entity  : a 2D digital human drawn procedurally in SVG — software that left
 *           the development environment. Breathing, blinking, head drift,
 *           cursor-tracking eyes, trailing hair, orbiting interface fragments.
 * Projects: a constellation of floating thin-line surface fragments with
 *           pointer parallax. No cards, no grid.
 *
 * Contract: window.UNIVERSE.registerWorld({ id, mount, unmount, onHover,
 *           onActivate }). Nothing else is exposed. ctx is never cached
 *           across mounts; unmount() kills every RAF and listener.
 * ========================================================================== */

(function () {
    'use strict';

    /* ---- geometry of the project constellation ---------------------------
       x / y are percentages of the field; d is the depth tier.
       Authored so the reading order (top band L→R, then the next band) is the
       same as the DOM order, which is the same as the tab order.            */
    var LAYOUT = [
        { x: 3,  y: 4,  d: 0 },
        { x: 26, y: 16, d: 1 },
        { x: 50, y: 3,  d: 0 },
        { x: 73, y: 13, d: 1 },
        { x: 6,  y: 30, d: 1 },
        { x: 30, y: 44, d: 0 },
        { x: 55, y: 33, d: 1 },
        { x: 78, y: 45, d: 2 },
        { x: 4,  y: 60, d: 0 },
        { x: 33, y: 72, d: 1 },
        { x: 60, y: 64, d: 0 }
    ];

    /* depth tiers: near / mid / far — scale, opacity, parallax factor */
    var DEPTH = [
        { s: 1.00, o: 1.00, p: 1.00 },
        { s: 0.93, o: 0.84, p: 0.62 },
        { s: 0.86, o: 0.68, p: 0.34 }
    ];

    var BLINK_MS = 120;          /* eyelid close */
    var SCATTER_MS = 170;        /* activation flourish, core waits 180 */

    function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
    function lerp(a, b, k) { return a + (b - a) * k; }

    /* short mono label for the floating name fragments */
    function shortName(n) {
        return n.length > 14 ? n.split(/[\s—-]/)[0] : n;
    }

    /* ========================================================================
       ENTITY MARKUP — every coordinate is deliberate, viewBox 300 x 200.
       Half-length framing: head, shoulders, torso, one forward arm, hair mass.
       ====================================================================== */
    function entityMarkup(projects, fragCount, statik) {
        var i, m = [];

        m.push('<svg class="wl-ent" viewBox="0 0 300 200" ' +
               'preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">');

        /* -- clip paths so the irises can never leave the eye openings -- */
        m.push('<defs>' +
            '<clipPath id="wlEyeL"><path d="M135 61c3-4.4 9-4.4 12 0-3 4.4-9 4.4-12 0z"/></clipPath>' +
            '<clipPath id="wlEyeR"><path d="M152 61c3-4.4 9-4.4 12 0-3 4.4-9 4.4-12 0z"/></clipPath>' +
            '</defs>');

        /* -- background depth plane: connection web + interface plates ---- */
        m.push('<g class="wl-depth">');
        m.push('<path class="wl-web-line" d="M14 172 L62 132 L110 150 L150 96"/>');
        m.push('<path class="wl-web-line" d="M286 168 L242 128 L196 146 L168 104"/>');
        m.push('<path class="wl-web-line" d="M40 24 L88 54 L124 44"/>');
        m.push('<path class="wl-web-line" d="M262 26 L214 58 L180 46"/>');
        m.push('<rect class="wl-plate" x="18" y="34" width="46" height="26" rx="1"/>');
        m.push('<path class="wl-web-line" d="M24 42 H50 M24 48 H58 M24 54 H42"/>');
        m.push('<rect class="wl-plate" x="236" y="118" width="48" height="22" rx="1"/>');
        m.push('<path class="wl-web-line" d="M242 126 H272 M242 132 H262"/>');
        m.push('<rect class="wl-plate" x="30" y="128" width="34" height="16" rx="1"/>');
        m.push('</g>');

        /* ================= the figure ================= */
        m.push('<g class="wl-fig">');

        /* -- body: torso, shoulders, arm, garment ------------------------- */
        m.push('<g class="wl-body">');
        /* neck, drawn first so the torso overlaps its base */
        m.push('<path class="wl-fill" d="M139 80 L139 100 Q150 107 161 100 L161 80 Z"/>');
        m.push('<path class="wl-line" d="M139 82 C139 92 137.5 97 134 101"/>');
        m.push('<path class="wl-line" d="M161 82 C161 92 162.5 97 166 101"/>');
        /* torso silhouette — asymmetric shoulders for a three-quarter read */
        m.push('<path class="wl-fill" d="M150 99 C132 100 117 105 108 112 ' +
               'C99 119 94 131 92 145 L87 200 L213 200 L208 147 ' +
               'C206 133 201 121 192 114 C183 107 168 100 150 99 Z"/>');
        m.push('<path class="wl-line" d="M150 99 C132 100 117 105 108 112 ' +
               'C99 119 94 131 92 145 L87 200"/>');
        m.push('<path class="wl-line" d="M150 99 C168 100 183 107 192 114 ' +
               'C201 121 206 133 208 147 L213 200"/>');
        /* garment: collar, seams, a chest hairline, a forward arm edge */
        m.push('<path class="wl-detail" d="M133 105 L150 126 L167 105"/>');
        m.push('<path class="wl-detail" d="M119 110 C130 121 133 138 132 200"/>');
        m.push('<path class="wl-detail" d="M187 116 C196 134 198 164 196 200" opacity="0.8"/>');
        m.push('<path class="wl-detail" d="M111 152 H140 M160 152 H189" opacity="0.6"/>');
        m.push('<path class="wl-detail" d="M150 132 V200" opacity="0.45"/>');
        /* mono glyph run stitched into the shoulder */
        m.push('<text class="wl-glyph" x="99" y="129" transform="rotate(-6 99 129)">01·RUN</text>');
        m.push('<text class="wl-glyph" x="171" y="170" opacity="0.4">SYS//OK</text>');
        m.push('</g>');

        /* -- hair mass (trails the head by a frame or two) ---------------- */
        m.push('<g class="wl-hair">');
        m.push('<path class="wl-fill-2" d="M124 58 C120 30 134 17 150 17 ' +
               'C166 17 180 30 176 58 C182 71 185 88 181 100 ' +
               'C177 87 175 74 173 66 C175 51 170 37 158 33 ' +
               'C146 29 132 36 128 50 C127 58 127 62 128 68 ' +
               'C126 77 124 87 121 98 C117 85 119 70 124 58 Z"/>');
        m.push('<path class="wl-hair-line" d="M124 58 C120 30 134 17 150 17 ' +
               'C166 17 180 30 176 58"/>');
        m.push('<path class="wl-hair-line" d="M176 58 C182 71 185 88 181 100" opacity="0.7"/>');
        m.push('<path class="wl-hair-line" d="M124 58 C119 71 117 87 121 98" opacity="0.7"/>');
        m.push('</g>');

        /* -- head ---------------------------------------------------------- */
        m.push('<g class="wl-skull">');
        m.push('<path class="wl-fill" d="M150 26 C163.5 26 173.6 35.4 174.6 49.4 ' +
               'C175 55 174.7 59.8 173.8 64.8 C173.2 68.1 171.9 70.2 170.1 71.4 ' +
               'C168.8 78.3 165 84.8 159.7 88.6 C156.4 91 153.1 92.1 150 92.1 ' +
               'C146.9 92.1 143.6 91 140.3 88.6 C135 84.8 131.2 78.3 129.9 71.4 ' +
               'C128.1 70.2 126.8 68.1 126.2 64.8 C125.3 59.8 125 55 125.4 49.4 ' +
               'C126.4 35.4 136.5 26 150 26 Z"/>');
        m.push('<path class="wl-line" d="M150 26 C163.5 26 173.6 35.4 174.6 49.4 ' +
               'C175 55 174.7 59.8 173.8 64.8 C173.2 68.1 171.9 70.2 170.1 71.4 ' +
               'C168.8 78.3 165 84.8 159.7 88.6 C156.4 91 153.1 92.1 150 92.1 ' +
               'C146.9 92.1 143.6 91 140.3 88.6 C135 84.8 131.2 78.3 129.9 71.4 ' +
               'C128.1 70.2 126.8 68.1 126.2 64.8 C125.3 59.8 125 55 125.4 49.4 ' +
               'C126.4 35.4 136.5 26 150 26 Z"/>');
        /* fringe sweeping across the brow */
        m.push('<path class="wl-fill-2" d="M126 51 C128 35 138.5 27 151 27 ' +
               'C164 27 173 36 174.4 51 C170 42 161.5 37 151.5 38 ' +
               'C140.5 39 131 43 126 51 Z"/>');
        m.push('<path class="wl-hair-line" d="M126 51 C131 43 140.5 39 151.5 38 ' +
               'C161.5 37 170 42 174.4 51"/>');
        /* brows, nose, mouth, cheek — restrained, all 1.5px */
        m.push('<path class="wl-detail" d="M135.5 54.5 C138.5 52 143.5 52 146.5 54"/>');
        m.push('<path class="wl-detail" d="M153.5 54 C156.5 52 161.5 52 164.5 54.5"/>');
        m.push('<path class="wl-detail" d="M150 60 L148.8 70 C148.8 71.6 151.4 72.6 153.2 71.4"/>');
        m.push('<path class="wl-detail" d="M144 79 C147 81.2 153 81.2 156 79"/>');
        m.push('<path class="wl-detail" d="M136 68 C138.5 75 142 79.5 146 82" opacity="0.5"/>');
        /* interface filament running along the jaw — the "escaped software" tell */
        m.push('<path class="wl-draw" d="M158 86 L176 96" fill="none"/>');
        /* eyes: almond rim + clipped iris that tracks the pointer */
        m.push('<path class="wl-eye-rim" d="M135 61c3-4.4 9-4.4 12 0-3 4.4-9 4.4-12 0z"/>');
        m.push('<path class="wl-eye-rim" d="M152 61c3-4.4 9-4.4 12 0-3 4.4-9 4.4-12 0z"/>');
        m.push('<g class="wl-eye wl-eye--l">' +
               '<g clip-path="url(#wlEyeL)"><g class="wl-pupil">' +
               '<circle class="wl-iris" cx="141" cy="61" r="2.5"/>' +
               '<circle class="wl-spec" cx="140" cy="60" r="0.8"/>' +
               '</g></g></g>');
        m.push('<g class="wl-eye wl-eye--r">' +
               '<g clip-path="url(#wlEyeR)"><g class="wl-pupil">' +
               '<circle class="wl-iris" cx="158" cy="61" r="2.5"/>' +
               '<circle class="wl-spec" cx="157" cy="60" r="0.8"/>' +
               '</g></g></g>');
        m.push('</g>');   /* /head */
        m.push('</g>');   /* /fig  */

        /* -- orbiting interface fragments --------------------------------- */
        m.push('<g class="wl-orbit">');
        for (i = 0; i < fragCount; i++) {
            m.push('<g class="wl-frag">' +
                   '<rect class="wl-plate" x="-13" y="-8" width="26" height="16" rx="1"/>' +
                   '<path class="wl-web-line" d="M-9 -3 H5 M-9 2 H9"/>' +
                   '<path class="wl-draw" d="M-9 6 H7"/>' +
                   '</g>');
        }
        m.push('</g>');

        /* -- HUD: live / deployed ticks and project name fragments --------- */
        m.push('<g class="wl-hud">');
        m.push('<g class="wl-tick">' +
               '<circle class="wl-tick-dot" cx="16" cy="14" r="2"/>' +
               '<text class="wl-glyph" x="24" y="16.5">LIVE</text></g>');
        m.push('<g class="wl-tick">' +
               '<circle class="wl-tick-dot" cx="16" cy="26" r="2" opacity="0.5"/>' +
               '<text class="wl-glyph" x="24" y="28.5">DEPLOYED ' +
               String(projects.length) + '</text></g>');

        var spots = [
            { x: 6,   y: 96,  a: 'start' },
            { x: 294, y: 84,  a: 'end' },
            { x: 294, y: 190, a: 'end' },
            { x: 6,   y: 190, a: 'start' },
            { x: 150, y: 10,  a: 'middle' }
        ];
        for (i = 0; i < spots.length && i < projects.length; i++) {
            m.push('<text class="wl-lab" x="' + spots[i].x + '" y="' + spots[i].y +
                   '" text-anchor="' + spots[i].a + '"' +
                   (statik ? '' : ' style="transition-delay:' + (i * 45) + 'ms"') + '>' +
                   escapeText(shortName(projects[i].name)) + '</text>');
        }
        m.push('</g>');

        m.push('</svg>');
        return m.join('');
    }

    function escapeText(s) {
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    /* ========================================================================
       MODULE STATE — rebuilt on every mount, torn down on every unmount.
       ====================================================================== */
    var st = null;

    function teardown() {
        if (!st) return;
        cancelAnimationFrame(st.raf);
        cancelAnimationFrame(st.pxRaf);
        clearTimeout(st.scatterT);
        st.off.forEach(function (f) { f(); });
        if (st.svg && st.svg.parentNode) st.svg.parentNode.removeChild(st.svg);
        if (st.world && st.world.parentNode) st.world.parentNode.removeChild(st.world);
        if (st.fallback) st.fallback.hidden = false;
        st = null;
    }

    /* add a listener and register its removal in one go */
    function on(target, type, fn, opts) {
        target.addEventListener(type, fn, opts);
        st.off.push(function () { target.removeEventListener(type, fn, opts); });
    }

    /* ========================================================================
       MOUNT
       ====================================================================== */
    function mount(ctx) {
        teardown();

        var reduced = !!ctx.reducedMotion;
        var area = window.innerWidth * window.innerHeight;
        /* fragment count scales with viewport area */
        var fragCount = reduced ? 0 : clamp(Math.round(area / 190000), 3, 9);

        st = {
            raf: 0, pxRaf: 0, scatterT: 0, off: [],
            reduced: reduced,
            hot: 0, hotTarget: 0,
            t0: 0, rect: null, rectAge: 0,
            ptr: { x: 0, y: 0, has: false },
            eye: { x: 0, y: 0, tx: 0, ty: 0 },
            head: { x: 0, y: 0 },
            hair: { x: 0, y: 0 },
            blinkAt: 3 + Math.random() * 4,
            blinkStart: -99,
            frags: [],
            svg: null, world: null, fallback: null
        };

        buildEntity(ctx, fragCount);
        buildProjects(ctx);

        if (reduced) {
            composeStatic();            /* one still frame, no loops */
        } else {
            st.t0 = performance.now();
            st.raf = requestAnimationFrame(frame);
            on(document, 'visibilitychange', function () {
                if (document.hidden) {
                    cancelAnimationFrame(st.raf);
                    st.raf = 0;
                } else if (!st.raf) {
                    st.t0 = performance.now() - 1000;   /* resume mid-cycle */
                    st.raf = requestAnimationFrame(frame);
                }
            });
        }
    }

    /* ---- entity ------------------------------------------------------------ */
    function buildEntity(ctx, fragCount) {
        ctx.stage.insertAdjacentHTML('beforeend',
            entityMarkup(ctx.projects, fragCount, st.reduced));

        var svg = ctx.stage.querySelector('.wl-ent');
        st.svg = svg;
        st.gBody  = svg.querySelector('.wl-body');
        st.gHair  = svg.querySelector('.wl-hair');
        st.gHead  = svg.querySelector('.wl-skull');
        st.gOrbit = svg.querySelector('.wl-orbit');
        st.eyeL   = svg.querySelector('.wl-eye--l');
        st.eyeR   = svg.querySelector('.wl-eye--r');
        st.pupils = svg.querySelectorAll('.wl-pupil');

        var nodes = svg.querySelectorAll('.wl-frag');
        for (var i = 0; i < nodes.length; i++) {
            st.frags.push({
                n: nodes[i],
                a: (i / nodes.length) * Math.PI * 2 + Math.random() * 0.4,
                rx: 96 + Math.random() * 34,
                ry: 46 + Math.random() * 22,
                sp: 0.055 + Math.random() * 0.06,
                sc: 0.55 + Math.random() * 0.5,
                yo: -8 + Math.random() * 30
            });
        }

        if (st.reduced) return;

        /* the pointer drives the eyes — the detail that sells the figure.
           Coordinates are stored raw; the rect is refreshed cheaply. */
        on(window, 'pointermove', function (e) {
            st.ptr.x = e.clientX;
            st.ptr.y = e.clientY;
            st.ptr.has = true;
        }, { passive: true });

        var invalidate = function () { st.rect = null; };
        on(window, 'resize', invalidate);
        on(window, 'scroll', invalidate, { passive: true });
    }

    /* ---- project environment ----------------------------------------------- */
    function buildProjects(ctx) {
        var ps = ctx.projectStage;

        /* hide the core's fallback list rather than destroying it */
        st.fallback = ps.querySelector('.u-worldstage__fallback');
        if (st.fallback) st.fallback.hidden = true;

        var root = document.createElement('div');
        root.className = 'wl-world';

        var head = document.createElement('div');
        head.className = 'wl-head';
        var kicker = document.createElement('span');
        kicker.className = 'wl-head__kicker';
        kicker.textContent = 'World 01 / Live projects — ' + ctx.projects.length + ' deployed systems';
        var lead = document.createElement('p');
        lead.className = 'wl-head__lead';
        lead.textContent = 'Software that left the development environment. ' +
            'Each surface below is a running system — select one to open it.';
        head.appendChild(kicker);
        head.appendChild(lead);
        root.appendChild(head);

        var field = document.createElement('div');
        field.className = 'wl-field';
        st.field = field;

        /* faint connection web threaded through the constellation */
        var pts = ctx.projects.map(function (p, i) {
            var L = LAYOUT[i % LAYOUT.length];
            return { x: L.x + 8, y: L.y + 7 };
        });
        var d = pts.map(function (pt, i) {
            return (i ? 'L' : 'M') + pt.x.toFixed(2) + ' ' + pt.y.toFixed(2);
        }).join(' ');
        field.insertAdjacentHTML('beforeend',
            '<svg class="wl-links" viewBox="0 0 100 100" preserveAspectRatio="none" ' +
            'aria-hidden="true" focusable="false"><path class="wl-links__path" d="' + d + '"/>' +
            pts.map(function (pt) {
                return '<circle class="wl-links__node" cx="' + pt.x.toFixed(2) +
                       '" cy="' + pt.y.toFixed(2) + '" r="0.28"/>';
            }).join('') + '</svg>');

        ctx.projects.forEach(function (p, i) {
            field.appendChild(projectNode(p, i, ctx));
        });

        root.appendChild(field);
        ps.appendChild(root);
        st.world = root;

        if (st.reduced) return;

        /* pointer parallax — two CSS vars on the field, children inherit */
        var pending = false, mx = 0, my = 0;
        on(field, 'pointermove', function (e) {
            var r = field.getBoundingClientRect();
            mx = ((e.clientX - r.left) / Math.max(r.width, 1) - 0.5) * -26;
            my = ((e.clientY - r.top) / Math.max(r.height, 1) - 0.5) * -16;
            if (pending) return;
            pending = true;
            st.pxRaf = requestAnimationFrame(function () {
                pending = false;
                field.style.setProperty('--wl-px', mx.toFixed(2) + 'px');
                field.style.setProperty('--wl-py', my.toFixed(2) + 'px');
            });
        }, { passive: true });

        on(field, 'pointerleave', function () {
            field.style.setProperty('--wl-px', '0px');
            field.style.setProperty('--wl-py', '0px');
        });
    }

    function projectNode(p, i, ctx) {
        var L = LAYOUT[i % LAYOUT.length];
        var D = DEPTH[L.d];

        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'wl-node';
        b.dataset.status = p.status;
        b.setAttribute('aria-label', p.name + ', ' + p.status + '. ' + p.blurb);
        b.style.setProperty('--wl-x', L.x + '%');
        b.style.setProperty('--wl-y', L.y + '%');
        b.style.setProperty('--wl-s', D.s);
        b.style.setProperty('--wl-o', D.o);
        b.style.setProperty('--wl-p', D.p);

        var idx = String(i + 1).padStart(2, '0');
        b.innerHTML =
            '<span class="wl-node__top">' +
                '<span class="wl-node__idx">' + idx + '</span>' +
                '<span class="wl-node__chip"><span class="wl-node__dot"></span>' +
                    escapeText(p.status) + '</span>' +
            '</span>' +
            '<span class="wl-node__name">' + escapeText(p.name) + '</span>' +
            '<span class="wl-node__blurb">' + escapeText(p.blurb) + '</span>' +
            '<span class="wl-node__meter"></span>' +
            '<svg class="wl-node__spark" viewBox="0 0 28 28" aria-hidden="true" focusable="false">' +
                '<circle cx="8" cy="9" r="1.1"/><circle cx="20" cy="7" r="0.9"/>' +
                '<circle cx="18" cy="19" r="1.2"/><circle cx="7" cy="20" r="0.8"/>' +
            '</svg>';

        b.addEventListener('click', function () { ctx.onOpenProject(p.id); });
        /* focus mirrors hover so keyboard users get the same reveal */
        b.addEventListener('focus', function () { b.classList.add('is-on'); });
        b.addEventListener('blur', function () { b.classList.remove('is-on'); });
        return b;
    }

    /* ========================================================================
       ANIMATION
       ====================================================================== */
    function stageRect() {
        if (!st.rect && st.svg) st.rect = st.svg.getBoundingClientRect();
        return st.rect;
    }

    function frame(now) {
        if (!st) return;
        st.raf = requestAnimationFrame(frame);

        var t = (now - st.t0) / 1000;
        st.hot = lerp(st.hot, st.hotTarget, 0.09);

        /* refresh the cached rect a few times a second, not every move */
        if (++st.rectAge > 40) { st.rectAge = 0; st.rect = null; }

        /* ---- eyes follow the cursor, clamped and eased ------------------ */
        if (st.ptr.has) {
            var r = stageRect();
            if (r && r.width) {
                var cx = r.left + r.width / 2;
                var cy = r.top + r.height * 0.35;      /* eye line, not centre */
                st.eye.tx = clamp((st.ptr.x - cx) / 260, -1, 1);
                st.eye.ty = clamp((st.ptr.y - cy) / 220, -1, 1);
            }
        }
        st.eye.x = lerp(st.eye.x, st.eye.tx, 0.11);
        st.eye.y = lerp(st.eye.y, st.eye.ty, 0.11);

        var px = (st.eye.x * 2.3).toFixed(2);
        var py = (st.eye.y * 1.5).toFixed(2);
        for (var i = 0; i < st.pupils.length; i++) {
            st.pupils[i].setAttribute('transform', 'translate(' + px + ',' + py + ')');
        }

        /* ---- blink: randomised 3–7s interval, ~120ms close -------------- */
        if (t > st.blinkAt) {
            st.blinkStart = t;
            st.blinkAt = t + 3 + Math.random() * 4;
        }
        var bp = (t - st.blinkStart) / (BLINK_MS / 1000);
        var lid = 1;
        if (bp >= 0 && bp <= 1) {
            lid = bp < 0.5 ? 1 - bp * 1.88 : (bp - 0.5) * 1.88 + 0.06;
        }
        eyeLid(st.eyeL, 141, lid);
        eyeLid(st.eyeR, 158, lid);

        /* ---- head drift: low-frequency noise + a nudge toward the cursor - */
        var n1 = Math.sin(t * 0.37) * 0.62 + Math.sin(t * 0.23 + 1.7) * 0.38;
        var n2 = Math.sin(t * 0.29 + 0.9) * 0.6 + Math.sin(t * 0.17 + 2.4) * 0.4;
        var hx = n1 * 2.1 + st.eye.x * 1.9;
        var hy = n2 * 1.3 + st.eye.y * 1.1;
        st.head.x = lerp(st.head.x, hx, 0.08);
        st.head.y = lerp(st.head.y, hy, 0.08);
        st.gHead.setAttribute('transform',
            'translate(' + st.head.x.toFixed(2) + ',' + st.head.y.toFixed(2) + ') ' +
            'rotate(' + (st.head.x * 0.28).toFixed(2) + ' 150 95)');

        /* ---- hair / garment edge trails the head ------------------------ */
        st.hair.x = lerp(st.hair.x, st.head.x * 0.82, 0.035);
        st.hair.y = lerp(st.hair.y, st.head.y * 0.82, 0.035);
        st.gHair.setAttribute('transform',
            'translate(' + st.hair.x.toFixed(2) + ',' + st.hair.y.toFixed(2) + ') ' +
            'rotate(' + (st.hair.x * 0.34).toFixed(2) + ' 150 104)');

        /* ---- breathing: ~4s cycle, anchored at the bottom of the frame -- */
        var br = Math.sin(t * (Math.PI * 2 / 4));
        var sy = (1 + br * 0.008).toFixed(4);
        st.gBody.setAttribute('transform',
            'translate(0 200) scale(1 ' + sy + ') translate(0 -200) ' +
            'translate(' + (st.head.x * 0.22).toFixed(2) + ' ' + (br * -0.7).toFixed(2) + ')');

        /* ---- orbiting interface fragments ------------------------------- */
        var speed = 1 + st.hot * 1.6;
        for (var f = 0; f < st.frags.length; f++) {
            var g = st.frags[f];
            g.a += g.sp * speed * 0.016;
            var ox = 150 + Math.cos(g.a) * g.rx;
            var oy = 108 + Math.sin(g.a) * g.ry + g.yo;
            var depth = 0.55 + (Math.sin(g.a) + 1) * 0.28;   /* behind / in front */
            g.n.setAttribute('transform',
                'translate(' + ox.toFixed(2) + ' ' + oy.toFixed(2) + ') ' +
                'scale(' + (g.sc * depth).toFixed(3) + ')');
            g.n.setAttribute('opacity', (0.28 + depth * 0.4 + st.hot * 0.25).toFixed(3));
        }
    }

    /* collapse an eye vertically about its own centre */
    function eyeLid(g, cx, k) {
        g.setAttribute('transform',
            'translate(' + cx + ' 61) scale(1 ' + Math.max(k, 0.06).toFixed(3) +
            ') translate(' + (-cx) + ' -61)');
    }

    /* one composed still frame for reduced motion */
    function composeStatic() {
        st.gHead.setAttribute('transform', 'translate(1.2 -0.6)');
        st.gHair.setAttribute('transform', 'translate(0.9 -0.4)');
        st.gBody.setAttribute('transform', 'translate(0 0)');
        eyeLid(st.eyeL, 141, 1);
        eyeLid(st.eyeR, 158, 1);
        for (var i = 0; i < st.pupils.length; i++) {
            st.pupils[i].setAttribute('transform', 'translate(0.6,0.4)');
        }
    }

    /* ========================================================================
       WORLD INTERFACE
       ====================================================================== */
    var WORLD = {
        id: 'live',

        mount: mount,

        unmount: teardown,

        onHover: function (active) {
            if (!st) return;
            st.hotTarget = active ? 1 : 0;
            st.svg.classList.toggle('is-hot', !!active);
            if (st.reduced) st.hot = active ? 1 : 0;
        },

        onActivate: function () {
            if (!st || st.reduced) return;
            var svg = st.svg;
            svg.classList.add('is-scatter');
            clearTimeout(st.scatterT);
            st.scatterT = setTimeout(function () {
                svg.classList.remove('is-scatter');
            }, SCATTER_MS + 20);
        }
    };

    /* core builds its slots on DOMContentLoaded; register after that so the
       slot exists and the core fallback line is retired. */
    function register() { if (window.UNIVERSE) window.UNIVERSE.registerWorld(WORLD); }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', register);
    } else {
        register();
    }
})();
