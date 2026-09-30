/* ============================================================================
 * universe-core.js — Projects Universe · CORE SHELL
 * ============================================================================
 *
 *  ┌──────────────────────────────────────────────────────────────────────┐
 *  │  WORLD REGISTRATION INTERFACE — bind this exactly.                   │
 *  └──────────────────────────────────────────────────────────────────────┘
 *
 *  window.UNIVERSE.registerWorld({
 *      id: 'live' | 'agents' | 'generators' | 'experiments',
 *      mount(ctx),       // start rendering. ctx described below.
 *      unmount(),        // STOP every RAF loop, remove every listener.
 *      onHover(active),  // boolean — entity activation on slot hover/focus.
 *      onActivate()      // optional click flourish before the world route opens.
 *  });
 *
 *  ctx = {
 *      stage,          // HTMLElement — this world's slot entity box in the
 *                      //   universe scene. Render the animated entity here.
 *                      //   Core owns the numeral / title / subtitle / focus
 *                      //   chrome around it. Do not write outside `stage`.
 *      projectStage,   // HTMLElement — the full-screen element for this
 *                      //   world's project environment. Core adds/removes
 *                      //   `.is-active` on it as the world route opens/closes.
 *                      //   Build the world's project layout in here.
 *      projects,       // Array — this world's records from UNIVERSE_DATA.
 *                      //   { id, world, name, blurb, what, tech[], status,
 *                      //     url|null, repo|null }
 *      accent,         // { primary, secondary } resolved colour strings.
 *      reducedMotion,  // boolean — true => no particles, no blur, no glitch.
 *      onOpenProject   // fn(projectId) — opens the SHARED detail view.
 *                      //   Worlds must NOT build their own detail view.
 *  }
 *
 *  LIFECYCLE (what core actually calls, and when):
 *    • registerWorld() may be called at any time, before or after core init.
 *      A world that never registers still renders: core draws the slot chrome
 *      plus a static fallback, and the world route falls back to a plain list.
 *    • mount(ctx) is called lazily, for ONE world at a time:
 *        – when that world's slot becomes the active slot in the universe
 *          scene (pointer hover, keyboard focus, or — on narrow viewports —
 *          scrolled into view), and
 *        – unconditionally when the #/world/:id or #/project/:id route for
 *          that world opens, if it is not already mounted.
 *    • unmount() is called before any OTHER world mounts, and when the
 *      universe is exited. This is how "only one world runs an animation
 *      loop at a time" is enforced — honour it: kill your RAF in unmount().
 *    • onHover(true/false) tracks slot hover/focus. It can fire while the
 *      world is mounted at universe level.
 *    • onActivate() fires on slot click, immediately before the route change.
 *      Core waits at most 180ms for the flourish; it never awaits a promise.
 *    • ctx is rebuilt per mount — never cache it across mounts.
 *
 *  ROUTES:  #/  ·  #/universe  ·  #/world/:id  ·  #/project/:id
 * ========================================================================== */

(function () {
    'use strict';

    var DATA = window.UNIVERSE_DATA || { worlds: [], projects: [] };
    var WORLDS = DATA.worlds;
    var PROJECTS = DATA.projects;

    var SITE = 'Sangramjeet Ghosh';
    var PAGE_TITLE = document.title; /* portal level keeps the SEO <title> */
    var ACTIVATE_GRACE = 180;   // ms core waits for onActivate() flourish
    var RESIZE_DEBOUNCE = 160;  // ms

    /* ---- lookups ---------------------------------------------------------- */
    var worldById = {};
    WORLDS.forEach(function (w) { worldById[w.id] = w; });

    var projectById = {};
    PROJECTS.forEach(function (p) { projectById[p.id] = p; });

    function projectsOf(id) {
        return PROJECTS.filter(function (p) { return p.world === id; });
    }

    /* ---- tiny helpers ----------------------------------------------------- */
    function $(sel, root) { return (root || document).querySelector(sel); }
    function el(tag, cls, text) {
        var n = document.createElement(tag);
        if (cls) n.className = cls;
        if (text != null) n.textContent = text;
        return n;
    }
    function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
    function safe(fn, label) {
        try { return fn(); }
        catch (e) { console.error('[universe] world module error: ' + label, e); }
    }

    var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    function reduced() { return motionQuery.matches; }

    /* ---- DOM refs (resolved on init) -------------------------------------- */
    var page, portalSection, portalStage, portalCanvas, portalBtn, portalTitle;
    var universe, field, ambientCanvas, stagesRoot;
    var chrome, crumbs, exitBtn, warp, detail, detailPanel;

    /* ============================================================================
       CANVAS UTILITY — devicePixelRatio aware, capped at 2, debounced refit.
       ========================================================================== */
    function fitCanvas(canvas) {
        if (!canvas) return { ctx: null, w: 0, h: 0 };
        var rect = canvas.getBoundingClientRect();
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        // Use offsetWidth/offsetHeight to avoid CSS transform scaling (e.g. warp-dive scale(22))
        var cssW = canvas.offsetWidth || canvas.clientWidth || Math.min(rect.width, window.innerWidth);
        var cssH = canvas.offsetHeight || canvas.clientHeight || Math.min(rect.height, window.innerHeight);
        // Safety bounds to guarantee canvas texture never overflows hardware GPU limits
        cssW = Math.max(1, Math.min(cssW, Math.min(window.innerWidth || 1920, 3840)));
        cssH = Math.max(1, Math.min(cssH, Math.min(window.innerHeight || 1080, 2160)));
        var w = Math.max(1, Math.round(cssW * dpr));
        var h = Math.max(1, Math.round(cssH * dpr));
        if (canvas.width !== w || canvas.height !== h) {
            canvas.width = w;
            canvas.height = h;
        }
        var ctx = canvas.getContext('2d');
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        return { ctx: ctx, w: cssW, h: cssH };
    }

    function onResize(fn) {
        var t = 0;
        window.addEventListener('resize', function () {
            clearTimeout(t);
            t = setTimeout(fn, RESIZE_DEBOUNCE);
        });
    }

    /* ============================================================================
       LEVEL 1 — THE BLACK HOLE PORTAL
       Accretion particles on decaying spirals + radial lens displacement +
       cursor ripples. Canvas 2D only.
       ========================================================================== */
    var portal = {
        raf: 0, running: false,
        w: 0, h: 0, ctx: null,
        particles: [], ripples: [],
        hot: 0, hotTarget: 0,
        pointer: { x: 0, y: 0, inside: false },
        chars: [], charBoxes: [], lastRipple: 0
    };

    function portalSeed() {
        var area = portal.w * portal.h;
        var count = clamp(Math.round(area / 1200), 160, 480);  // scales smoothly across screens
        var core = portalCoreRadius();
        portal.particles.length = 0;
        for (var i = 0; i < count; i++) {
            portal.particles.push(newParticle(core, true));
        }
    }

    function portalCoreRadius() {
        return Math.max(42, Math.min(portal.w, portal.h) * 0.10);
    }

    function newParticle(core, spread) {
        var outer = Math.max(portal.w, portal.h) * 0.58;
        // Relativistic accretion density: denser near photon ring, smooth exponential falloff outward
        var u = Math.random();
        var r = spread
            ? core * 1.04 + Math.pow(u, 2.1) * (outer - core * 1.04)
            : outer * (0.82 + Math.random() * 0.22);
        return {
            r: r,
            a: Math.random() * Math.PI * 2,
            spin: 0.65 + Math.random() * 0.5,    // angular speed base
            fall: 0.08 + Math.random() * 0.22,   // gentle inward accretion drift
            size: 0.6 + Math.random() * 1.4,
            tint: Math.random()
        };
    }

    function portalFit() {
        var m = fitCanvas(portalCanvas);
        portal.ctx = m.ctx; portal.w = m.w; portal.h = m.h;
        portalSeed();
        portal.charBoxes = [];
    }

    function portalFrame() {
        if (!portal.running) return;
        var c = portal.ctx, w = portal.w, h = portal.h;
        var cx = w * 0.5, cy = h * 0.5;
        var core = portalCoreRadius();

        portal.hot += (portal.hotTarget - portal.hot) * 0.08;
        var hot = portal.hot;

        c.clearRect(0, 0, w, h);

        /* 1. Deep space gravitational well glow — seamless radial bloom to void */
        var glowR = Math.max(core * 5.6, Math.min(w, h) * 0.52);
        var bloom = c.createRadialGradient(cx, cy, core * 0.85, cx, cy, glowR);
        bloom.addColorStop(0.00, 'rgba(255, 255, 255, ' + (0.16 + hot * 0.12).toFixed(3) + ')');
        bloom.addColorStop(0.14, 'rgba(56, 189, 248, ' + (0.14 + hot * 0.10).toFixed(3) + ')');
        bloom.addColorStop(0.35, 'rgba(167, 139, 250, ' + (0.09 + hot * 0.07).toFixed(3) + ')');
        bloom.addColorStop(0.68, 'rgba(15, 23, 42, ' + (0.04 + hot * 0.03).toFixed(3) + ')');
        bloom.addColorStop(1.00, 'rgba(3, 4, 7, 0)');
        c.fillStyle = bloom;
        c.fillRect(0, 0, w, h);

        /* 2. Secondary Einstein Lensing Ring (bent light from behind the black hole) */
        c.save();
        c.beginPath();
        c.ellipse(cx, cy, core * 1.35, core * 1.16, 0, 0, Math.PI * 2);
        c.strokeStyle = 'rgba(167, 139, 250, ' + (0.09 + hot * 0.08).toFixed(3) + ')';
        c.lineWidth = 1.2;
        c.stroke();
        c.restore();

        /* 3. Accretion field: Keplerian differential spin + relativistic Doppler boosting */
        var speed = 1.0 + hot * 1.35;
        var maxR = Math.max(w, h) * 0.56;
        var lensK = core * core * (0.38 + hot * 0.35);   // gravitational deflection factor
        c.lineCap = 'round';

        for (var i = 0; i < portal.particles.length; i++) {
            var p = portal.particles[i];

            /* Keplerian orbital velocity: slower, majestic spin with realistic r^(-0.68) curve */
            var normR = Math.max(p.r / core, 1.0);
            var angSpeed = (p.spin * 0.62 / Math.pow(normR, 0.68)) * speed;
            p.a += angSpeed * 0.038;

            /* Gentle inward accretion drift toward the horizon */
            p.r -= (p.fall * 0.22 * speed) * (1 + (core * 0.9) / Math.max(p.r, 1));

            if (p.r <= core * 1.018) {   /* Swallowed by the event horizon */
                portal.particles[i] = newParticle(core, false);
                continue;
            }

            /* Lens distortion — positions near the horizon are pushed outward */
            var effR = p.r + lensK / p.r;
            var x = cx + Math.cos(p.a) * effR;
            var y = cy + Math.sin(p.a) * effR * 0.80;   /* disc inclination tilt */

            /* Curved orbital arc trajectory using quadratic bezier */
            var trailSpan = clamp((0.07 + hot * 0.12) * (core / Math.max(p.r, core * 0.75)), 0.02, 0.32);
            var aTail = p.a - trailSpan;
            var rTail = effR + (0.5 + hot * 0.7) * (core / Math.max(p.r, core));
            var tailX = cx + Math.cos(aTail) * rTail;
            var tailY = cy + Math.sin(aTail) * rTail * 0.80;

            var aMid = p.a - trailSpan * 0.5;
            var rMid = (effR + rTail) * 0.5;
            var ctrlX = cx + Math.cos(aMid) * rMid;
            var ctrlY = cy + Math.sin(aMid) * rMid * 0.80;

            /* Relativistic Doppler beaming: approaching matter is boosted, receding is dimmed */
            var doppler = 1.0 - Math.sin(p.a) * 0.46;

            /* Borderless screen fade: particles vanish smoothly to 0 before canvas borders */
            var distCenter = Math.hypot(x - cx, y - cy);
            var edgeFade = clamp(1 - (distCenter / maxR), 0, 1);
            edgeFade = Math.pow(edgeFade, 1.4);

            var depthAlpha = clamp(1 - (p.r / (maxR * 1.1)), 0.08, 1);
            var alpha = clamp((0.16 + depthAlpha * 0.6) * doppler * (0.65 + hot * 0.35) * edgeFade, 0.01, 0.95);

            /* Relativistic spectrum: white/cyan on high-energy approaching side, violet on receding */
            if (doppler > 1.15) {
                c.strokeStyle = p.tint > 0.4
                    ? 'rgba(255, 255, 255, ' + alpha.toFixed(3) + ')'
                    : 'rgba(56, 189, 248, ' + alpha.toFixed(3) + ')';
            } else if (doppler > 0.88) {
                c.strokeStyle = p.tint > 0.6
                    ? 'rgba(186, 230, 253, ' + alpha.toFixed(3) + ')'
                    : 'rgba(196, 181, 253, ' + alpha.toFixed(3) + ')';
            } else {
                c.strokeStyle = 'rgba(167, 139, 250, ' + (alpha * 0.88).toFixed(3) + ')';
            }

            c.lineWidth = p.size * (0.8 + doppler * 0.35);
            c.beginPath();
            c.moveTo(tailX, tailY);
            c.quadraticCurveTo(ctrlX, ctrlY, x, y);
            c.stroke();
        }

        /* 4. Cursor gravitational ripples */
        for (var j = portal.ripples.length - 1; j >= 0; j--) {
            var rp = portal.ripples[j];
            rp.t += 0.022;
            if (rp.t >= 1) { portal.ripples.splice(j, 1); continue; }
            var rr = 8 + rp.t * 160;
            c.strokeStyle = 'rgba(199, 210, 254, ' + ((1 - rp.t) * 0.16).toFixed(3) + ')';
            c.lineWidth = 1;
            c.beginPath();
            c.arc(rp.x, rp.y, rr, 0, Math.PI * 2);
            c.stroke();
        }

        /* 5. Inner Photon Sphere Ring (razor-sharp trapped photon orbit with shimmer) */
        var shimmer = Math.sin(performance.now() * 0.003) * 0.04;
        c.beginPath();
        c.arc(cx, cy, core * 1.045, 0, Math.PI * 2);
        c.strokeStyle = 'rgba(56, 189, 248, ' + (0.32 + hot * 0.25 + shimmer).toFixed(3) + ')';
        c.lineWidth = 2.5;
        c.stroke();

        c.beginPath();
        c.arc(cx, cy, core * 1.018, 0, Math.PI * 2);
        c.strokeStyle = 'rgba(255, 255, 255, ' + (0.82 + hot * 0.18).toFixed(3) + ')';
        c.lineWidth = 1.2;
        c.stroke();

        /* 6. Pitch-black Event Horizon (Central Cosmic Shadow) */
        c.globalCompositeOperation = 'source-over';
        c.fillStyle = '#000000';
        c.beginPath();
        c.arc(cx, cy, core, 0, Math.PI * 2);
        c.fill();

        portal.raf = requestAnimationFrame(portalFrame);
    }

    function portalStart() {
        if (portal.running || reduced() || document.hidden || !portalCanvas) return;
        portal.running = true;
        portalFit();
        portal.raf = requestAnimationFrame(portalFrame);
    }

    function portalStop() {
        portal.running = false;
        cancelAnimationFrame(portal.raf);
    }

    /* ---- title per-character distortion ------------------------------------ */
    function splitTitle() {
        if (!portalTitle) return;
        var text = portalTitle.textContent;
        portalTitle.textContent = '';
        portal.chars = [];
        for (var i = 0; i < text.length; i++) {
            var s = el('span', 'u-ch', text[i]);
            s.setAttribute('aria-hidden', 'true');
            portalTitle.appendChild(s);
            portal.chars.push(s);
        }
        /* keep the accessible string intact for screen readers */
        var sr = el('span', 'u-sr', text);
        portalTitle.appendChild(sr);
    }

    function measureChars() {
        if (!portal.chars.length) return;
        portal.charBoxes = portal.chars.map(function (s) {
            var r = s.getBoundingClientRect();
            return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
        });
    }

    function distortTitle(px, py) {
        if (reduced() || !portal.charBoxes.length) return;
        for (var i = 0; i < portal.chars.length; i++) {
            var b = portal.charBoxes[i];
            var dx = b.x - px, dy = b.y - py;
            var d = Math.sqrt(dx * dx + dy * dy) || 1;
            var pull = clamp(140 / d, 0, 1.1);
            portal.chars[i].style.transform =
                'translate3d(' + (dx / d * pull * 5).toFixed(2) + 'px,' +
                (dy / d * pull * 4).toFixed(2) + 'px,0) skewX(' +
                (pull * 3).toFixed(2) + 'deg)';
        }
    }

    function resetTitle() {
        if (portal.chars) portal.chars.forEach(function (s) { s.style.transform = ''; });
    }

    function initPortal() {
        splitTitle();
        if (!portalBtn) return;

        var setHot = function (on) {
            portal.hotTarget = on ? 1 : 0;
            if (portalSection) portalSection.classList.toggle('is-hot', on);
            if (on) measureChars(); else resetTitle();
        };

        portalBtn.addEventListener('pointerenter', function () { setHot(true); });
        portalBtn.addEventListener('pointerleave', function () { setHot(false); });
        portalBtn.addEventListener('focus', function () { setHot(true); });
        portalBtn.addEventListener('blur', function () { setHot(false); });

        if (portalCanvas) {
            portalBtn.addEventListener('pointermove', function (e) {
                if (reduced()) return;
                var rect = portalCanvas.getBoundingClientRect();
                portal.pointer.x = e.clientX - rect.left;
                portal.pointer.y = e.clientY - rect.top;
                var now = performance.now();
                if (now - portal.lastRipple > 90) {
                    portal.lastRipple = now;
                    portal.ripples.push({ x: portal.pointer.x, y: portal.pointer.y, t: 0 });
                    if (portal.ripples.length > 14) portal.ripples.shift();
                }
                distortTitle(e.clientX, e.clientY);
            });
        }

        portalBtn.addEventListener('click', function (e) {
            e.preventDefault();
            go('#/universe');
        });

        var beacon = $('#beaconCard');
        if (beacon) {
            beacon.addEventListener('click', function (e) {
                e.preventDefault();
                go('#/universe');
            });
        }

        onResize(function () {
            if (portal.running) portalFit();
            if (portalSection && portalSection.classList.contains('is-hot')) measureChars();
        });
    }

    /* ============================================================================
       LEVEL 2 — AMBIENT DRIFTING FIELD (core-owned; worlds own their entities)
       ========================================================================== */
    var ambient = { raf: 0, running: false, ctx: null, w: 0, h: 0, dots: [] };

    function ambientFit() {
        var m = fitCanvas(ambientCanvas);
        ambient.ctx = m.ctx; ambient.w = m.w; ambient.h = m.h;
        var count = clamp(Math.round((m.w * m.h) / 14000), 40, 190);
        ambient.dots.length = 0;
        for (var i = 0; i < count; i++) {
            ambient.dots.push({
                x: Math.random() * m.w,
                y: Math.random() * m.h,
                vx: (Math.random() - 0.5) * 0.12,
                vy: -0.04 - Math.random() * 0.14,
                r: 0.4 + Math.random() * 1.1,
                o: 0.08 + Math.random() * 0.3
            });
        }
    }

    function ambientFrame() {
        if (!ambient.running) return;
        var c = ambient.ctx, w = ambient.w, h = ambient.h;
        c.clearRect(0, 0, w, h);
        for (var i = 0; i < ambient.dots.length; i++) {
            var d = ambient.dots[i];
            d.x += d.vx; d.y += d.vy;
            if (d.y < -4) { d.y = h + 4; d.x = Math.random() * w; }
            if (d.x < -4) d.x = w + 4;
            if (d.x > w + 4) d.x = -4;
            c.fillStyle = 'rgba(203,213,225,' + d.o.toFixed(3) + ')';
            c.beginPath();
            c.arc(d.x, d.y, d.r, 0, Math.PI * 2);
            c.fill();
        }
        ambient.raf = requestAnimationFrame(ambientFrame);
    }

    function ambientStart() {
        if (ambient.running || reduced() || document.hidden) return;
        ambient.running = true;
        ambientFit();
        ambient.raf = requestAnimationFrame(ambientFrame);
    }

    function ambientStop() {
        ambient.running = false;
        cancelAnimationFrame(ambient.raf);
    }

    /* ============================================================================
       WORLD SLOTS + WORLD STAGES (core chrome; module entity goes inside)
       ========================================================================== */
    var slots = {};        // id -> { button, entity, stage }
    var registry = {};     // id -> module definition
    var mountedId = null;  // the single world currently mounted
    var activeSlotId = null;

    function buildSlots() {
        WORLDS.forEach(function (w) {
            var btn = el('button', 'u-slot u-slot--' + w.id);
            btn.type = 'button';
            btn.id = 'u-slot-' + w.id;
            btn.setAttribute('aria-label',
                'Open world ' + w.index + ', ' + w.title + '. ' + w.subtitle);

            var num = el('span', 'u-slot__num', w.index);
            num.setAttribute('aria-hidden', 'true');

            var entity = el('span', 'u-slot__entity');
            entity.setAttribute('aria-hidden', 'true');
            entity.appendChild(el('span', 'u-slot__fallback'));

            var title = el('span', 'u-slot__title', w.title);
            var sub = el('span', 'u-slot__sub', w.subtitle);
            var meta = el('span', 'u-slot__meta',
                projectsOf(w.id).length + ' systems');

            btn.appendChild(num);
            btn.appendChild(entity);
            btn.appendChild(title);
            btn.appendChild(sub);
            btn.appendChild(meta);
            field.appendChild(btn);

            /* per-world full-screen project environment */
            var stage = el('div', 'u-worldstage');
            stage.id = 'u-stage-' + w.id;
            stage.setAttribute('aria-label', w.title);
            stage.setAttribute('role', 'region');
            stage.hidden = true;
            buildStageFallback(stage, w);
            stagesRoot.appendChild(stage);

            slots[w.id] = { button: btn, entity: entity, stage: stage, world: w };

            btn.addEventListener('pointerenter', function () { setActiveSlot(w.id); });
            btn.addEventListener('focus', function () { setActiveSlot(w.id); });
            btn.addEventListener('pointerleave', function () { clearActiveSlot(w.id); });
            btn.addEventListener('blur', function () { clearActiveSlot(w.id); });
            btn.addEventListener('click', function () { activateWorld(w.id); });
        });

        /* narrow viewports have no hover — activate the slot in view instead */
        if ('IntersectionObserver' in window) {
            var io = new IntersectionObserver(function (entries) {
                if (window.innerWidth > 768) return;
                entries.forEach(function (en) {
                    var id = en.target.id.replace('u-slot-', '');
                    if (en.isIntersecting && en.intersectionRatio > 0.55) setActiveSlot(id);
                });
            }, { threshold: [0, 0.55, 1] });
            WORLDS.forEach(function (w) { io.observe(slots[w.id].button); });
        }
    }

    /* Core fallback so a missing world module never breaks the page. */
    function buildStageFallback(stage, w) {
        var wrap = el('div', 'u-worldstage__fallback');
        wrap.appendChild(el('h2', 'u-worldstage__heading', w.title));
        wrap.appendChild(el('p', 'u-worldstage__lead', w.subtitle));
        var list = el('ul', 'u-plainlist');
        projectsOf(w.id).forEach(function (p, i) {
            var li = el('li', 'u-plainlist__item');
            var b = el('button', 'u-plainlist__btn');
            b.type = 'button';
            b.appendChild(el('span', 'u-plainlist__idx',
                String(i + 1).padStart(2, '0')));
            b.appendChild(el('span', null, p.name));
            b.addEventListener('click', function () { openProject(p.id); });
            li.appendChild(b);
            list.appendChild(li);
        });
        wrap.appendChild(list);
        stage.appendChild(wrap);
    }

    function accentFor(id) {
        var cs = getComputedStyle(document.documentElement);
        return {
            primary: (cs.getPropertyValue('--u-accent-' + id) || '#f1f5f9').trim(),
            secondary: (cs.getPropertyValue('--u-accent-' + id + '-2') || '#94a3b8').trim()
        };
    }

    function contextFor(id) {
        return {
            stage: slots[id].entity,
            projectStage: slots[id].stage,
            projects: projectsOf(id),
            accent: accentFor(id),
            reducedMotion: reduced(),
            onOpenProject: openProject
        };
    }

    var mountedWorlds = {};

    function mountWorld(id) {
        if (mountedWorlds[id]) return;
        var mod = registry[id];
        if (!mod || typeof mod.mount !== 'function') return;
        if (!slots[id]) return;
        mountedWorlds[id] = true;
        var slot = slots[id];
        if (slot) slot.button.classList.add('u-slot--mounted');
        safe(function () { mod.mount(contextFor(id)); }, id + '.mount');
    }

    function unmountWorld(id) {
        if (!mountedWorlds[id]) return;
        var mod = registry[id];
        if (mod && typeof mod.unmount === 'function') {
            safe(function () { mod.unmount(); }, id + '.unmount');
        }
        delete mountedWorlds[id];
        var slot = slots[id];
        if (slot) slot.button.classList.remove('u-slot--mounted');
    }

    function mountAllRegisteredWorlds() {
        WORLDS.forEach(function (w) {
            if (registry[w.id]) mountWorld(w.id);
        });
    }

    function setActiveSlot(id) {
        if (activeSlotId === id) return;
        if (activeSlotId && registry[activeSlotId] && registry[activeSlotId].onHover) {
            var prev = activeSlotId;
            safe(function () { registry[prev].onHover(false); }, prev + '.onHover');
        }
        activeSlotId = id;
        if (id) {
            mountWorld(id);
            if (registry[id] && registry[id].onHover) {
                safe(function () { registry[id].onHover(true); }, id + '.onHover');
            }
        }
    }

    function clearActiveSlot(id) {
        if (activeSlotId !== id) return;
        if (registry[id] && registry[id].onHover) {
            safe(function () { registry[id].onHover(false); }, id + '.onHover');
        }
        activeSlotId = null;
    }

    function activateWorld(id) {
        var mod = registry[id];
        var delay = 0;
        if (mod && typeof mod.onActivate === 'function') {
            safe(function () { mod.onActivate(); }, id + '.onActivate');
            delay = ACTIVATE_GRACE;
        }
        setTimeout(function () { go('#/world/' + id); }, reduced() ? 0 : delay);
    }

    /* ============================================================================
       PROJECT DETAIL VIEW — shared by all four worlds.
       ========================================================================== */
    var detailState = { open: false, opener: null, keyHandler: null };

    var STATUS_CLASS = {
        'LIVE': 'u-status--live',
        'PRIVATE': 'u-status--private',
        'OPEN SOURCE': 'u-status--open',
        'EXPERIMENTAL': 'u-status--experimental'
    };

    function extIcon() {
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'u-icon');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('aria-hidden', 'true');
        var p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        p.setAttribute('d', 'M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5');
        svg.appendChild(p);
        return svg;
    }

    function renderDetail(p) {
        var w = worldById[p.world];
        detailPanel.textContent = '';

        var close = el('button', 'u-detail__close');
        close.type = 'button';
        close.setAttribute('aria-label', 'Close project detail');
        close.appendChild(document.createTextNode('Close'));
        close.addEventListener('click', function () { stepUp(); });
        detailPanel.appendChild(close);

        var eyebrow = el('div', 'u-detail__eyebrow');
        eyebrow.appendChild(el('span', null, w ? w.index + ' / ' + w.title : 'PROJECT'));
        detailPanel.appendChild(eyebrow);

        var h = el('h2', 'u-detail__name', p.name);
        h.id = 'u-detail-title';
        detailPanel.appendChild(h);

        detailPanel.appendChild(el('p', 'u-detail__blurb', p.blurb));

        detailPanel.appendChild(el('h3', 'u-detail__sectitle', 'What it does'));
        detailPanel.appendChild(el('p', 'u-detail__what', p.what));

        detailPanel.appendChild(el('h3', 'u-detail__sectitle', 'Technology'));
        var chips = el('ul', 'u-chips');
        (p.tech || []).forEach(function (t) {
            chips.appendChild(el('li', 'u-chip', t));
        });
        detailPanel.appendChild(chips);

        detailPanel.appendChild(el('h3', 'u-detail__sectitle', 'Status'));
        var st = el('p', null);
        var chip = el('span', 'u-status ' + (STATUS_CLASS[p.status] || 'u-status--private'), p.status);
        st.appendChild(chip);
        detailPanel.appendChild(st);

        /* NO FAKE LINKS — a button exists only when a real URL exists. */
        var links = el('div', 'u-detail__links');
        var any = false;
        if (p.url) {
            var a = el('a', 'u-link-btn');
            a.href = p.url;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            a.appendChild(document.createTextNode('Visit'));
            a.appendChild(extIcon());
            a.setAttribute('aria-label', 'Visit ' + p.name + ', opens in a new tab');
            links.appendChild(a);
            any = true;
        }
        if (p.repo) {
            var r = el('a', 'u-link-btn');
            r.href = p.repo;
            r.target = '_blank';
            r.rel = 'noopener noreferrer';
            r.appendChild(document.createTextNode('Source'));
            r.appendChild(extIcon());
            r.setAttribute('aria-label', 'Source code for ' + p.name + ', opens in a new tab');
            links.appendChild(r);
            any = true;
        }
        if (any) {
            detailPanel.appendChild(links);
        } else {
            detailPanel.appendChild(el('p', 'u-detail__note',
                p.status === 'PRIVATE'
                    ? 'Private codebase — no public link.'
                    : 'No public link for this system.'));
        }
    }

    function trapFocus(e) {
        if (e.key !== 'Tab') return;
        var nodes = detailPanel.querySelectorAll(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
        if (!nodes.length) return;
        var first = nodes[0], last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault(); first.focus();
        }
    }

    function openDetail(p) {
        renderDetail(p);
        detail.hidden = false;
        requestAnimationFrame(function () { detail.classList.add('is-open'); });
        detailState.open = true;
        detailState.keyHandler = trapFocus;
        detail.addEventListener('keydown', detailState.keyHandler);
        var close = $('.u-detail__close', detailPanel);
        if (close) close.focus();
    }

    function closeDetail() {
        if (!detailState.open) return;
        detail.classList.remove('is-open');
        if (detailState.keyHandler) detail.removeEventListener('keydown', detailState.keyHandler);
        detailState.open = false;
        var t = setTimeout(function () { detail.hidden = true; }, reduced() ? 0 : 400);
        void t;
        /* focus returns to the object that opened it */
        if (detailState.opener && document.contains(detailState.opener)) {
            detailState.opener.focus();
        }
        detailState.opener = null;
    }

    /* Public: worlds call ctx.onOpenProject(id) */
    function openProject(id) {
        if (!projectById[id]) return;
        detailState.opener = document.activeElement;
        go('#/project/' + id);
    }

    /* ============================================================================
       THE PULL-THROUGH TRANSITION
       ========================================================================== */
    var warping = false;

    function runWarp(dir, swap, done) {
        if (warping) return;
        warping = true;

        if (reduced()) {
            /* the whole cinematic sequence collapses to a 200ms crossfade */
            swap();
            var target = dir === 'in' ? universe : page;
            if (target && target.animate) {
                target.animate([{ opacity: 0 }, { opacity: 1 }],
                    { duration: 200, easing: 'linear' });
            }
            warping = false;
            if (done) done();
            return;
        }

        var dur = dir === 'in' ? 1050 : 850;
        document.body.classList.add(dir === 'in' ? 'u-warping' : 'u-warping-out');
        warp.classList.add(dir === 'in' ? 'is-in' : 'is-out');

        /* forward: swap under the black frame near the end (88%).
           reverse: swap at 40ms under the opaque veil, but keep body locked until warp ends. */
        setTimeout(swap, dir === 'in' ? Math.round(dur * 0.88) : 40);

        setTimeout(function () {
            warp.className = 'u-warp';
            document.body.classList.remove('u-warping', 'u-warping-out');
            if (dir === 'out') {
                document.body.classList.remove('u-locked');
                portalStart();
            }
            warping = false;
            if (done) done();
        }, dur);
    }

    /* ============================================================================
       ROUTER — #/ · #/universe · #/world/:id · #/project/:id
       ========================================================================== */
    var LEVEL = { portal: 0, universe: 1, world: 2, project: 3 };
    var current = { name: 'portal' };

    function parse(hash) {
        var raw = String(hash == null ? location.hash : hash).replace(/^#\/?/, '');
        var parts = raw.split('/').filter(Boolean);
        if (parts[0] === 'universe') return { name: 'universe' };
        if (parts[0] === 'world' && worldById[parts[1]]) {
            return { name: 'world', world: parts[1] };
        }
        if (parts[0] === 'project' && projectById[parts[1]]) {
            var p = projectById[parts[1]];
            return { name: 'project', world: p.world, project: p.id };
        }
        return { name: 'portal' };
    }

    function go(hash) {
        if (warping) return;
        if (location.hash === hash) render(parse(hash));
        else location.hash = hash;
    }

    function titleFor(r) {
        if (r.name === 'project') return projectById[r.project].name + ' · ' + SITE;
        if (r.name === 'world') return worldById[r.world].title + ' · ' + SITE;
        if (r.name === 'universe') return 'Projects Universe · ' + SITE;
        return PAGE_TITLE;
    }

    function buildCrumbs(r) {
        crumbs.textContent = '';
        function add(label, href, currentPage) {
            if (crumbs.childNodes.length) {
                var sep = el('span', 'u-crumbs__sep', '/');
                sep.setAttribute('aria-hidden', 'true');
                crumbs.appendChild(sep);
            }
            if (currentPage) {
                var s = el('span', null, label);
                s.setAttribute('aria-current', 'page');
                crumbs.appendChild(s);
            } else {
                var a = el('a', null, label);
                a.href = href;
                crumbs.appendChild(a);
            }
        }
        add('Project Universe', '#/universe', r.name === 'universe');
        if (r.name === 'world' || r.name === 'project') {
            add(worldById[r.world].title, '#/world/' + r.world, r.name === 'world');
        }
        if (r.name === 'project') {
            add(projectById[r.project].name, '#/project/' + r.project, true);
        }
    }

    function applyRoute(r) {
        var inUniverse = r.name !== 'portal';

        /* --- page frame / universe visibility --- */
        if (inUniverse) {
            universe.hidden = false;
            document.documentElement.classList.add('u-locked');
            document.body.classList.add('u-locked');
            if (page) page.setAttribute('inert', '');
            portalStop();
            ambientStart();
            mountAllRegisteredWorlds();
        } else {
            universe.hidden = true;
            if (!warping) {
                document.documentElement.classList.remove('u-locked');
                document.body.classList.remove('u-locked');
                portalStart();
            }
            if (page) page.removeAttribute('inert');
            ambientStop();
            activeSlotId = null;
        }

        /* --- world stages --- */
        WORLDS.forEach(function (w) {
            var active = (r.world === w.id) && (r.name === 'world' || r.name === 'project');
            var st = slots[w.id].stage;
            st.hidden = !active;
            st.classList.toggle('is-active', active);
            if (active) {
                st.scrollTop = 0;
            }
        });
        universe.classList.toggle('is-world', r.name === 'world' || r.name === 'project');
        if (universe) universe.scrollTop = 0;
        window.scrollTo(0, 0);

        if (r.world && (r.name === 'world' || r.name === 'project')) mountWorld(r.world);

        /* --- detail view --- */
        if (r.name === 'project') {
            if (!detailState.open || detail.dataset.pid !== r.project) {
                detail.dataset.pid = r.project;
                openDetail(projectById[r.project]);
            }
        } else {
            delete detail.dataset.pid;
            closeDetail();
        }

        /* --- chrome --- */
        chrome.hidden = !inUniverse;
        if (inUniverse) {
            buildCrumbs(r);
            var atUniverse = r.name === 'universe';
            exitBtn.textContent = atUniverse ? 'Exit universe' : 'Back to universe';
            exitBtn.setAttribute('href', atUniverse ? '#/' : '#/universe');
            exitBtn.setAttribute('aria-label',
                atUniverse ? 'Exit the projects universe' : 'Back to the universe');
        }

        document.title = titleFor(r);
    }

    function render(r) {
        var from = LEVEL[current.name], to = LEVEL[r.name];
        var swap = function () { applyRoute(r); };

        if (from === 0 && to > 0) {
            runWarp('in', function () {
                swap();
                if (!reduced()) {
                    universe.classList.add('is-revealing');
                    setTimeout(function () {
                        universe.classList.remove('is-revealing');
                    }, 560);
                }
            });
        } else if (from > 0 && to === 0) {
            /* portal must be alive before the reverse warp peels back */
            runWarp('out', swap);
        } else {
            swap();
        }

        current = r;
    }

    function stepUp() {
        if (current.name === 'project') go('#/world/' + current.world);
        else if (current.name === 'world') {
            var back = slots[current.world];
            go('#/universe');
            if (back) setTimeout(function () { back.button.focus(); }, reduced() ? 0 : 420);
        } else if (current.name === 'universe') go('#/');
    }

    /* ============================================================================
       INIT
       ========================================================================== */
    function init() {
        page = $('#u-page');
        /* PORTED: the portal is mounted as .u-portal INSIDE the page's own
           <section id="projects">, so the hover class must land on the mount,
           not on the host section. Falls back to #projects for the standalone
           layout where they are the same element. */
        portalSection = $('.u-portal') || $('#projects');
        portalStage = $('.u-portal__stage') || $('#nebulaFigureWrap');
        portalCanvas = $('#u-portal-canvas');
        portalBtn = $('#u-portal-button');
        portalTitle = $('.u-portal__title');
        universe = $('#universe');
        field = $('#u-field');
        ambientCanvas = $('#u-ambient');
        stagesRoot = $('#u-stages');
        chrome = $('#u-chrome');
        crumbs = $('#u-crumbs');
        exitBtn = $('#u-exit');
        warp = $('#u-warp');
        detail = $('#u-detail');
        detailPanel = $('#u-detail-panel');
        void portalStage;

        buildSlots();
        initPortal();

        /* worlds that registered before DOM-ready get their chrome updated now */
        Object.keys(registry).forEach(function (id) {
            if (slots[id]) slots[id].button.classList.add('u-slot--mounted');
        });

        /* click on the scrim closes the detail view */
        detail.addEventListener('mousedown', function (e) {
            if (e.target === detail) stepUp();
        });

        /* Escape steps up exactly one level */
        document.addEventListener('keydown', function (e) {
            if (e.key !== 'Escape') return;
            if (current.name === 'portal') return;
            e.preventDefault();
            stepUp();
        });

        window.addEventListener('hashchange', function () {
            /* PORTED: this page's nav uses plain section anchors (#about,
               #contact, #home). Universe routes always start '#/'. A section
               anchor while we are already at portal level is not ours — let it
               scroll and do nothing. If the universe IS open, fall through:
               parse() resolves to 'portal' and the overlay closes, which is the
               right answer for "user clicked a nav link". */
            var h = location.hash;
            var ours = h === '' || h === '#' || h.indexOf('#/') === 0;
            if (!ours && current.name === 'portal') return;
            render(parse());
        });

        /* pause every RAF loop when the tab is hidden */
        document.addEventListener('visibilitychange', function () {
            if (document.hidden) { portalStop(); ambientStop(); }
            else if (current.name === 'portal') portalStart();
            else ambientStart();
        });

        onResize(function () { if (ambient.running) ambientFit(); });

        /* reacting to a live reduced-motion change costs nothing */
        var onMotion = function () {
            if (reduced()) { portalStop(); ambientStop(); }
            else if (current.name === 'portal') portalStart();
            else ambientStart();
        };
        if (motionQuery.addEventListener) motionQuery.addEventListener('change', onMotion);
        else if (motionQuery.addListener) motionQuery.addListener(onMotion);

        if ('scrollRestoration' in history) {
            try { history.scrollRestoration = 'manual'; } catch (e) {}
        }

        /* deep links resolve on load, with no warp on first paint */
        mountAllRegisteredWorlds();
        var initial = parse();
        current = initial;
        applyRoute(initial);
    }

    /* ---- public API -------------------------------------------------------- */
    window.UNIVERSE = {
        registerWorld: function (def) {
            if (!def || !def.id || !worldById[def.id]) {
                console.warn('[universe] registerWorld: unknown or missing id', def);
                return;
            }
            registry[def.id] = def;
            var slot = slots[def.id];
            if (slot) {
                slot.button.classList.add('u-slot--mounted');
                mountWorld(def.id);
            }
        },
        openProject: openProject,
        navigate: go,
        data: DATA,
        get route() { return current; }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
