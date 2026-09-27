/* ============================================================================
 * world-experiments.js — WORLD 04 · EXPERIMENTS & TOOLS
 * ----------------------------------------------------------------------------
 * THE ENTITY  a piece of unstable experimental software. An isometric tri-bar
 *             (Penrose-ish impossible frame) drawn procedurally to canvas, then
 *             corrupted: RGB channel fringing, horizontal slice displacement,
 *             dropped bands, quantised pixel blocks, partial hex glyph runs.
 *             Not a character. No face, no mascot.
 *
 * TECHNIQUE   Two canvases. The offscreen holds the composed (fringed) form;
 *             the visible one blits it back in displaced horizontal bands. All
 *             corruption is therefore a re-composition of one coherent solid,
 *             which is what keeps it reading as datamosh and not as noise.
 *
 * SAFETY      Flicker is rate limited by CFG.flickerGap (>=620ms between
 *             events => under 1.7 flashes/second) and amplitude capped by
 *             CFG.flickerAmp. Both are hard guards, not preferences.
 *
 * REDUCED     ctx.reducedMotion => no RAF at all. One static, uncorrupted,
 * MOTION      fully stable frame of the form, and a clean project layout.
 *
 * Everything lives inside this IIFE; the only global touched is the
 * registerWorld() call at the bottom.
 * ========================================================================== */
(function () {
    'use strict';

    if (!window.UNIVERSE || !window.UNIVERSE.registerWorld) return;

    /* ---- tuning knobs ---------------------------------------------------- */
    var CFG = {
        idle: 0.10,          // instability floor while mounted (restraint)
        hover: 1.00,         // instability while the slot is hovered/focused
        ease: 0.12,          // per-frame lerp toward the target level
        flickerGap: 620,     // ms — HARD floor between flicker events
        flickerAmp: 0.10,    // max full-field luminance drop (0..1)
        collapseMs: 180,     // onActivate flourish budget
        resizeWait: 160      // debounce
    };

    var MONO = "'JetBrains Mono', ui-monospace, monospace";

    /* ---- small helpers --------------------------------------------------- */
    function rnd(a, b) { return a + Math.random() * (b - a); }
    function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }

    /* '#rrggbb' -> 'rgba(r,g,b,a)'. Accepts anything else untouched. */
    function withAlpha(hex, a) {
        var m = /^#?([0-9a-f]{6})$/i.exec(String(hex).trim());
        if (!m) return hex;
        var n = parseInt(m[1], 16);
        return 'rgba(' + (n >> 16 & 255) + ',' + (n >> 8 & 255) + ',' +
               (n & 255) + ',' + a + ')';
    }

    /* devicePixelRatio-aware fit, capped at 2. */
    function fit(canvas) {
        var r = canvas.getBoundingClientRect();
        var d = Math.min(window.devicePixelRatio || 1, 2);
        var w = Math.max(1, Math.round(r.width * d));
        var h = Math.max(1, Math.round(r.height * d));
        if (canvas.width !== w || canvas.height !== h) {
            canvas.width = w;
            canvas.height = h;
        }
        var g = canvas.getContext('2d');
        g.setTransform(d, 0, 0, d, 0, 0);
        return { g: g, w: r.width, h: r.height, d: d };
    }

    /* ========================================================================
       ENTITY
       ====================================================================== */
    var E = {
        canvas: null, off: null, g: null, og: null,
        w: 0, h: 0, d: 1,
        raf: 0, running: false, reduced: false,
        accent: { primary: '#ffffff', secondary: '#b8ff3c' },
        level: CFG.idle, target: CFG.idle,
        nextTick: 0, slices: [], blocks: [], glyphs: [], marks: [],
        closeAt: 0,           // until when the frame resolves to the impossible junction
        flickAt: 0, flickUntil: 0,
        collapseAt: 0, cp: 0
    };

    /* Partial hex / truncated address runs. Never readable words. */
    var GLYPHS = ['7f a3', '0x3c', 'e4 91', 'c2::', 'ff1a', 'd8 0b', '::5e',
                  '9e7', 'a1 —', '0b4f', '3c b8', '—— 6d'];

    /* ------------------------------------------------------------------
       The underlying coherent form: an isometric tri-bar. Three arms, each
       one's cross-section running along the NEXT arm's direction — which is
       exactly what makes the junction impossible when the loop closes.
       `closed` false shortens the last arm so the frame reads as an ordinary
       open figure; true snaps it shut into the impossible junction.
       ------------------------------------------------------------------ */
    function formQuads(w, h, scale, closed) {
        var R = Math.min(w, h);
        var L = R * 0.46 * scale;
        var bw = R * 0.15 * scale;
        var dirs = [], i;
        for (i = 0; i < 3; i++) {
            var a = (-90 + i * 120) * Math.PI / 180;
            dirs.push([Math.cos(a), Math.sin(a)]);
        }
        var A = [[0, 0]];
        A.push([A[0][0] + dirs[0][0] * L, A[0][1] + dirs[0][1] * L]);
        A.push([A[1][0] + dirs[1][0] * L, A[1][1] + dirs[1][1] * L]);

        var quads = [], minx = 1e9, maxx = -1e9, miny = 1e9, maxy = -1e9;
        for (i = 0; i < 3; i++) {
            var d0 = dirs[i], d1 = dirs[(i + 1) % 3];
            var len = (!closed && i === 2) ? L * 0.80 : L;
            var p0 = A[i];
            var p1 = [p0[0] + d0[0] * len, p0[1] + d0[1] * len];
            var q = [p0, p1,
                     [p1[0] + d1[0] * bw, p1[1] + d1[1] * bw],
                     [p0[0] + d1[0] * bw, p0[1] + d1[1] * bw]];
            quads.push(q);
            for (var k = 0; k < 4; k++) {
                if (q[k][0] < minx) minx = q[k][0];
                if (q[k][0] > maxx) maxx = q[k][0];
                if (q[k][1] < miny) miny = q[k][1];
                if (q[k][1] > maxy) maxy = q[k][1];
            }
        }
        /* centre the figure in the box */
        var ox = w / 2 - (minx + maxx) / 2;
        var oy = h / 2 - (miny + maxy) / 2;
        for (i = 0; i < 3; i++) {
            for (var j = 0; j < 4; j++) {
                quads[i][j][0] += ox;
                quads[i][j][1] += oy;
            }
        }
        return quads;
    }

    function strokeQuads(g, quads, color, fill) {
        g.lineWidth = 1.5;
        g.lineJoin = 'miter';
        g.strokeStyle = color;
        for (var i = 0; i < quads.length; i++) {
            var q = quads[i];
            g.beginPath();
            g.moveTo(q[0][0], q[0][1]);
            for (var k = 1; k < 4; k++) g.lineTo(q[k][0], q[k][1]);
            g.closePath();
            if (fill) { g.fillStyle = fill; g.fill(); }   /* real occlusion */
            g.stroke();
        }
    }

    /* Compose the clean-but-fringed form into the offscreen buffer. */
    function composeForm() {
        var og = E.og, w = E.w, h = E.h, lv = E.level;
        og.setTransform(E.d, 0, 0, E.d, 0, 0);
        og.clearRect(0, 0, w, h);

        var quads = formQuads(w, h, 1 - E.cp * 0.45, performance.now() < E.closeAt);
        var sep = 0.5 + lv * 3.2 + E.cp * 7;   /* channel separation, px */

        /* two channel ghosts, additive, no fill — they survive only where they
           stick out past the solid pass below. Print-glitch fringe, not neon. */
        og.save();
        og.globalCompositeOperation = 'lighter';
        og.translate(-sep, -sep * 0.22);
        strokeQuads(og, quads, 'rgba(255,58,58,' + (0.22 + lv * 0.32) + ')', null);
        og.restore();

        og.save();
        og.globalCompositeOperation = 'lighter';
        og.translate(sep, sep * 0.22);
        strokeQuads(og, quads, withAlpha(E.accent.secondary, 0.20 + lv * 0.34), null);
        og.restore();

        /* the solid pass: near-void fills give the bars their occlusion */
        strokeQuads(og, quads, withAlpha(E.accent.primary, 0.88), '#030407');
    }

    /* Recompute the corruption set. Runs on a slow irregular clock at rest,
       a fast one on hover — never per frame, which is what makes the idle
       movement read as "tiny pixel movements" rather than static noise. */
    function retick(now) {
        var lv = E.level, w = E.w, h = E.h, i;
        var area = w * h;
        var scale = clamp(area / 40000, 0.5, 2);       /* counts follow viewport */

        E.slices = [];
        var n = Math.round((1 + lv * 6) * scale);
        for (i = 0; i < n; i++) {
            E.slices.push({
                y: rnd(0, h),
                h: rnd(2, 5 + lv * 16),
                dx: rnd(-1, 1) * (1.5 + lv * 20),
                drop: Math.random() < lv * 0.22
            });
        }

        E.blocks = [];
        n = Math.round(lv * 5 * scale);
        for (i = 0; i < n; i++) E.blocks.push({ x: rnd(0, w - 12), y: rnd(0, h - 12) });

        /* broken text + field propagation are hover-only */
        E.glyphs = [];
        E.marks = [];
        if (lv > 0.45) {
            n = Math.round(rnd(1, 3 + scale));
            for (i = 0; i < n; i++) {
                E.glyphs.push({
                    t: GLYPHS[(Math.random() * GLYPHS.length) | 0],
                    x: rnd(4, w - 52), y: rnd(12, h - 6),
                    cut: Math.random() < 0.55        /* clipped mid-glyph */
                });
            }
            n = Math.round(rnd(2, 5 + scale * 2));
            for (i = 0; i < n; i++) {
                E.marks.push({
                    x: rnd(0, w), y: rnd(0, h),
                    l: rnd(4, 22), acid: Math.random() < 0.28
                });
            }
        }

        /* unstable geometry: the junction occasionally resolves into the
           impossible closure, then lets go again. Rare at rest. */
        if (now > E.closeAt && Math.random() < 0.05 + lv * 0.35) {
            E.closeAt = now + rnd(180, 1400);
        }

        E.nextTick = now + (lv > 0.5 ? rnd(70, 200) : rnd(260, 1100));
    }

    function paint(now) {
        var g = E.g, w = E.w, h = E.h, d = E.d, lv = E.level, i;

        /* collapse flourish (onActivate) */
        E.cp = 0;
        if (E.collapseAt) {
            var p = (now - E.collapseAt) / CFG.collapseMs;
            if (p >= 1) E.collapseAt = 0; else E.cp = p;
        }

        composeForm();

        g.setTransform(d, 0, 0, d, 0, 0);
        g.clearRect(0, 0, w, h);

        /* full-field flicker: low amplitude, rate limited. Never a strobe. */
        g.globalAlpha = (now < E.flickUntil)
            ? 1 - CFG.flickerAmp * (0.35 + 0.65 * lv)
            : 1;

        g.drawImage(E.off, 0, 0, w * d, h * d, 0, 0, w, h);

        /* horizontal slice displacement + dropped bands */
        for (i = 0; i < E.slices.length; i++) {
            var s = E.slices[i];
            var sh = Math.min(s.h, h - s.y);
            if (sh <= 0) continue;
            g.clearRect(0, s.y, w, sh);
            if (s.drop) continue;
            g.drawImage(E.off, 0, s.y * d, w * d, sh * d, s.dx, s.y, w, sh);
        }

        /* quantised pixel blocks */
        if (E.blocks.length) {
            g.imageSmoothingEnabled = false;
            for (i = 0; i < E.blocks.length; i++) {
                var b = E.blocks[i];
                g.drawImage(E.off, b.x * d, b.y * d, 5 * d, 5 * d, b.x, b.y, 11, 11);
            }
            g.imageSmoothingEnabled = true;
        }

        g.globalAlpha = 1;

        /* scanlines — dark, constant, never flashing */
        g.fillStyle = 'rgba(3,4,7,' + (0.14 + lv * 0.30) + ')';
        for (var y = 0; y < h; y += 3) g.fillRect(0, y, w, 1);

        /* glitches propagating out into the surrounding field */
        for (i = 0; i < E.marks.length; i++) {
            var m = E.marks[i];
            g.fillStyle = m.acid
                ? withAlpha(E.accent.secondary, 0.34 * lv)
                : 'rgba(203,213,225,' + (0.20 * lv) + ')';
            g.fillRect(m.x, m.y, m.l, 1);
        }

        /* broken typography */
        if (E.glyphs.length) {
            g.font = '10px ' + MONO;
            g.textBaseline = 'alphabetic';
            for (i = 0; i < E.glyphs.length; i++) {
                var gl = E.glyphs[i];
                g.save();
                if (gl.cut) { g.beginPath(); g.rect(gl.x - 2, gl.y - 8, 60, 4.5); g.clip(); }
                g.fillStyle = 'rgba(148,163,184,' + (0.30 + lv * 0.45) + ')';
                g.fillText(gl.t, gl.x, gl.y);
                g.restore();
            }
        }

        /* collapse wave */
        if (E.cp > 0) {
            g.strokeStyle = withAlpha(E.accent.secondary, 0.55 * (1 - E.cp));
            g.lineWidth = 1.5;
            g.beginPath();
            g.arc(w / 2, h / 2, E.cp * Math.max(w, h) * 0.75, 0, Math.PI * 2);
            g.stroke();
        }
    }

    /* One static, fully stable, uncorrupted frame — reduced motion + unmount. */
    function paintStatic() {
        var f = fit(E.canvas);
        E.g = f.g; E.w = f.w; E.h = f.h; E.d = f.d;
        if (E.w < 2 || E.h < 2) return;
        f.g.clearRect(0, 0, E.w, E.h);
        strokeQuads(f.g, formQuads(E.w, E.h, 1, true),
                    withAlpha(E.accent.primary, 0.85), '#030407');
    }

    function frame(now) {
        if (!E.running) return;
        E.raf = requestAnimationFrame(frame);
        if (E.w < 2 || E.h < 2 || !E.og) { refit(); return; }  /* box not laid out yet */
        E.level += (E.target - E.level) * CFG.ease;
        if (now >= E.nextTick) retick(now);
        if (now >= E.flickAt) {
            E.flickUntil = now + rnd(45, 90);
            E.flickAt = now + CFG.flickerGap + Math.random() * 1500;
        }
        paint(now);
    }

    function startLoop() {
        if (E.running || E.reduced || document.hidden) return;
        E.running = true;
        E.raf = requestAnimationFrame(frame);
    }

    function stopLoop() {
        E.running = false;
        cancelAnimationFrame(E.raf);
        E.raf = 0;
    }

    function refit() {
        if (!E.canvas) return;
        if (E.reduced) { paintStatic(); return; }
        var f = fit(E.canvas);
        E.g = f.g; E.w = f.w; E.h = f.h; E.d = f.d;
        E.off.width = E.canvas.width;
        E.off.height = E.canvas.height;
        E.og = E.off.getContext('2d');
        E.nextTick = 0;
    }

    function buildEntity(ctx) {
        var c = ctx.stage.querySelector('.wx-entity');
        if (!c) {
            c = document.createElement('canvas');
            c.className = 'wx-entity';
            c.setAttribute('aria-hidden', 'true');
            ctx.stage.appendChild(c);
        }
        E.canvas = c;
        E.accent = ctx.accent || E.accent;
        E.reduced = !!ctx.reducedMotion;
        E.level = E.target = CFG.idle;
        E.collapseAt = 0;
        E.slices = []; E.blocks = []; E.glyphs = []; E.marks = [];

        if (E.reduced) { paintStatic(); return; }

        if (!E.off) E.off = document.createElement('canvas');
        refit();
        E.closeAt = 0;
        E.flickAt = performance.now() + CFG.flickerGap;
        startLoop();
    }

    /* ========================================================================
       PROJECT ENVIRONMENT — unstable artefacts on a lab bench.
       Corrupted at rest, STABLE on hover/focus. Interaction brings order.
       ====================================================================== */

    /* Authored composition. DOM order == this order == visual reading order,
       so tab order is correct without any tabindex juggling. */
    var LAYOUT = [
        { id: 'local-cortex',            x: '1%',  y: '3%',  w: '25%', d: 1.7, s: 0.95, o: 0.74 },
        { id: 'solo-leveling',           x: '70%', y: '7%',  w: '27%', d: 1.1, s: 0.90, o: 0.68 },
        { id: 'craftbrain-segmentation', x: '34%', y: '30%', w: '32%', d: 2.2, s: 1.00, o: 0.92 },
        { id: 'touchless-exp',           x: '3%',  y: '60%', w: '31%', d: 1.4, s: 0.96, o: 0.82 },
        { id: 'cvforge',                 x: '63%', y: '71%', w: '25%', d: 0.8, s: 0.88, o: 0.64 }
    ];

    var STATUS_CLASS = {
        'LIVE': 'live', 'PRIVATE': 'private',
        'OPEN SOURCE': 'open', 'EXPERIMENTAL': 'exp'
    };

    var ENV = { root: null, pointerTarget: null, onPointer: null };
    var active = null;   /* the CURRENT ctx — never cached across mounts */

    function buildEnv(ctx) {
        var stage = ctx.projectStage;
        if (ENV.root && ENV.root.parentNode === stage) return;  /* already built */

        stage.innerHTML = '';                      /* drop the core fallback list */
        var root = document.createElement('div');
        root.className = 'wx-root';

        var head = document.createElement('div');
        head.className = 'wx-head';
        head.innerHTML =
            '<p class="wx-head__kicker">04 / EXPERIMENTS &amp; TOOLS</p>' +
            '<p class="wx-head__lead">Unstable artefacts on the bench. ' +
            'Each one resolves as you reach it.</p>';
        root.appendChild(head);

        var bench = document.createElement('div');
        bench.className = 'wx-bench';

        /* layout order first, then anything the layout does not know about */
        var byId = {}, order = [];
        ctx.projects.forEach(function (p) { byId[p.id] = p; });
        LAYOUT.forEach(function (l) { if (byId[l.id]) { order.push([byId[l.id], l]); delete byId[l.id]; } });
        Object.keys(byId).forEach(function (k, i) {
            order.push([byId[k], { x: (6 + i * 18) + '%', y: (84 + i * 4) + '%', w: '26%', d: 1, s: 0.9, o: 0.7 }]);
        });

        order.forEach(function (pair, i) {
            bench.appendChild(buildItem(pair[0], pair[1], i));
        });

        root.appendChild(bench);
        stage.appendChild(root);
        ENV.root = root;
    }

    function buildItem(p, l, i) {
        var idx = String(i + 1).padStart(2, '0');
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'wx-p';
        b.style.cssText =
            '--wx-x:' + l.x + ';--wx-y:' + l.y + ';--wx-w:' + l.w +
            ';--wx-depth:' + l.d + ';--wx-scale:' + l.s + ';--wx-rest:' + l.o +
            ';--wx-i:' + i;
        b.setAttribute('aria-label',
            p.name + '. ' + p.status + '. ' + p.blurb + ' Open project.');

        var sc = STATUS_CLASS[p.status] || 'exp';

        b.innerHTML =
            '<span class="wx-p__rule" aria-hidden="true"></span>' +
            '<span class="wx-p__idx">' + idx + '</span>' +
            '<span class="wx-p__name" data-text="' + esc(p.name) + '">' +
                esc(p.name) + '</span>' +
            '<span class="wx-p__chip wx-p__chip--' + sc + '">' + esc(p.status) + '</span>' +
            '<span class="wx-p__blurb">' + esc(p.blurb) + '</span>';

        b.addEventListener('click', function () {
            if (active) active.onOpenProject(p.id);
        });
        return b;
    }

    function esc(s) {
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    /* Pointer parallax — pointer-capable wide viewports only. Transform only. */
    function bindPointer(ctx) {
        if (ENV.onPointer) return;
        if (ctx.reducedMotion) return;
        if (!window.matchMedia('(hover: hover) and (min-width: 1025px)').matches) return;

        var root = ENV.root;
        ENV.pointerTarget = ctx.projectStage;
        ENV.onPointer = function (e) {
            var r = ctx.projectStage.getBoundingClientRect();
            root.style.setProperty('--wx-px', ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
            root.style.setProperty('--wx-py', ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
        };
        ENV.pointerTarget.addEventListener('pointermove', ENV.onPointer, { passive: true });
    }

    function unbindPointer() {
        if (ENV.onPointer && ENV.pointerTarget) {
            ENV.pointerTarget.removeEventListener('pointermove', ENV.onPointer);
        }
        ENV.onPointer = null;
        ENV.pointerTarget = null;
    }

    /* ========================================================================
       LIFECYCLE
       ====================================================================== */
    var onResize = null, onVis = null, resizeTimer = 0;

    function mount(ctx) {
        active = ctx;
        buildEntity(ctx);
        buildEnv(ctx);

        /* only our own root is touched — core chrome is left alone */
        ENV.root.classList.toggle('wx-reduced', !!ctx.reducedMotion);

        bindPointer(ctx);

        onResize = function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(refit, CFG.resizeWait);
        };
        window.addEventListener('resize', onResize);

        onVis = function () {
            if (document.hidden) stopLoop(); else startLoop();
        };
        document.addEventListener('visibilitychange', onVis);
    }

    function unmount() {
        stopLoop();
        clearTimeout(resizeTimer);
        if (onResize) window.removeEventListener('resize', onResize);
        if (onVis) document.removeEventListener('visibilitychange', onVis);
        onResize = onVis = null;
        unbindPointer();
        /* leave the slot showing a clean, stable frame rather than a frozen glitch */
        if (E.canvas) { E.level = E.target = 0; paintStatic(); }
        active = null;
    }

    function onHover(on) {
        E.target = on ? CFG.hover : CFG.idle;
        E.nextTick = 0;                     /* react on the next frame */
        if (on) E.closeAt = performance.now() + rnd(240, 900);
        else if (Math.random() < 0.5) E.closeAt = 0;
    }

    function onActivate() {
        E.collapseAt = performance.now();
        E.closeAt = E.collapseAt + CFG.collapseMs;
    }

    window.UNIVERSE.registerWorld({
        id: 'experiments',
        mount: mount,
        unmount: unmount,
        onHover: onHover,
        onActivate: onActivate
    });
})();
