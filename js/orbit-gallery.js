/**
 * orbit-gallery.js — Certificates orbiting the centre figure.
 *
 * Rings rotate via CSS animation (two animations total, GPU-composited);
 * JS only places each item and drives the popup. Click a certificate to
 * pop it up, click again (or the close control) to send it back into place.
 */
(function () {
    'use strict';

    /* ========================================================
       DATA
       ======================================================== */
    var CERTS = [
        { img: '../images/certs/google-ads.jpg', cat: 'cloud', pdf: '../certs/google-ads.pdf', title: 'Google Ads Certification', badge: 'Cloud / Platform' },
        { img: '../images/certs/aws.jpg', cat: 'cloud', pdf: '../certs/aws.pdf', title: 'AWS Cloud Certification', badge: 'Cloud / Platform' },
        { img: '../images/cert-deep-learning.jpg', cat: 'aiml', title: 'Deep Learning Specialization', badge: 'AI / ML' },
        { img: '../images/cert-cnn.jpg', cat: 'aiml', title: 'Convolutional Neural Networks', badge: 'AI / ML' },
        { img: '../images/cert-face-detection.jpg', cat: 'aiml', title: 'Face Detection & Recognition', badge: 'AI / ML' },
        { img: '../images/cert-sangramjeet.jpg', cat: 'aiml', title: 'AI/ML Professional Certificate', badge: 'AI / ML' },
        { img: '../images/cer1.png', cat: 'aiml', title: 'Machine Learning', badge: 'AI / ML' },
        { img: '../images/cer2.png', cat: 'aiml', title: 'Data Science', badge: 'AI / ML' },
        { img: '../images/cer3.png', cat: 'aiml', title: 'Python for Data Science', badge: 'AI / ML' },
        { img: '../images/cer4.png', cat: 'aiml', title: 'Neural Networks & Deep Learning', badge: 'AI / ML' },
        { img: '../images/cer5.png', cat: 'aiml', title: 'NLP Specialization', badge: 'AI / ML' },
        { img: '../images/c6.png', cat: 'aiml', title: 'Advanced Machine Learning', badge: 'AI / ML' },
        { img: '../images/c7.jpg', cat: 'aiml', title: 'TensorFlow Developer', badge: 'AI / ML' },
        { img: '../images/c8.jpg', cat: 'aiml', title: 'Computer Vision', badge: 'AI / ML' },
        { img: '../images/c9.jpg', cat: 'aiml', title: 'AI Engineering', badge: 'AI / ML' },
        { img: '../images/c10.jpg', cat: 'aiml', title: 'Reinforcement Learning', badge: 'AI / ML' },
        { img: '../images/c11.jpg', cat: 'aiml', title: 'MLOps & Deployment', badge: 'AI / ML' },
        { img: '../images/cert-ideathon.jpg', cat: 'competition', title: 'Ideathon 2.0 — 1st Place', badge: 'Competition' },
        { img: '../images/cert-winner.jpg', cat: 'competition', title: 'Competition Winner', badge: 'Competition' },
        { img: '../images/cert-metaloop.jpg', cat: 'competition', title: 'Metaloop Recognition', badge: 'Competition' },
        { img: '../images/certs/Coursera-1EHWFX70U8N5.jpg', cat: 'aiml', pdf: '../certs/Coursera-1EHWFX70U8N5.pdf', title: 'Coursera Certificate', badge: 'AI / ML' },
        { img: '../images/certs/Coursera-4M3M89ZRTF60.jpg', cat: 'aiml', pdf: '../certs/Coursera-4M3M89ZRTF60.pdf', title: 'Coursera Certificate', badge: 'AI / ML' },
        { img: '../images/certs/Coursera-5AYMMX4HKR41.jpg', cat: 'aiml', pdf: '../certs/Coursera-5AYMMX4HKR41.pdf', title: 'Coursera Certificate', badge: 'AI / ML' },
        { img: '../images/certs/Coursera-7P9AGL4ZB6CE.jpg', cat: 'aiml', pdf: '../certs/Coursera-7P9AGL4ZB6CE.pdf', title: 'Coursera Certificate', badge: 'AI / ML' },
        { img: '../images/certs/Coursera-BMYDF7SEUROF.jpg', cat: 'aiml', pdf: '../certs/Coursera-BMYDF7SEUROF.pdf', title: 'Coursera Certificate', badge: 'AI / ML' },
        { img: '../images/certs/Coursera-BR1C6TF04NNE.jpg', cat: 'aiml', pdf: '../certs/Coursera-BR1C6TF04NNE.pdf', title: 'Coursera Certificate', badge: 'AI / ML' },
        { img: '../images/certs/Coursera-C8JVOMQYOFLN.jpg', cat: 'aiml', pdf: '../certs/Coursera-C8JVOMQYOFLN.pdf', title: 'Coursera Certificate', badge: 'AI / ML' },
        { img: '../images/certs/Coursera-CBT5C6GNZTRH.jpg', cat: 'aiml', pdf: '../certs/Coursera-CBT5C6GNZTRH.pdf', title: 'Coursera Certificate', badge: 'AI / ML' },
        { img: '../images/certs/Coursera-ERJO7QGD6KSJ.jpg', cat: 'aiml', pdf: '../certs/Coursera-ERJO7QGD6KSJ.pdf', title: 'Coursera Certificate', badge: 'AI / ML' },
        { img: '../images/certs/Coursera-GSASAU8TX5AE.jpg', cat: 'aiml', pdf: '../certs/Coursera-GSASAU8TX5AE.pdf', title: 'Coursera Certificate', badge: 'AI / ML' },
        { img: '../images/certs/Coursera-HUW2AW1WR9AW.jpg', cat: 'aiml', pdf: '../certs/Coursera-HUW2AW1WR9AW.pdf', title: 'Coursera Certificate', badge: 'AI / ML' },
        { img: '../images/certs/Coursera-J6NJJZ597S6S.jpg', cat: 'aiml', pdf: '../certs/Coursera-J6NJJZ597S6S.pdf', title: 'Coursera Certificate', badge: 'AI / ML' },
        { img: '../images/certs/Coursera-L1P40CGRD8MB.jpg', cat: 'aiml', pdf: '../certs/Coursera-L1P40CGRD8MB.pdf', title: 'Coursera Certificate', badge: 'AI / ML' },
        { img: '../images/certs/Coursera-LQKME2RW84PL.jpg', cat: 'aiml', pdf: '../certs/Coursera-LQKME2RW84PL.pdf', title: 'Coursera Certificate', badge: 'AI / ML' },
        { img: '../images/certs/Coursera-LUECMJYAT23M.jpg', cat: 'aiml', pdf: '../certs/Coursera-LUECMJYAT23M.pdf', title: 'Coursera Certificate', badge: 'AI / ML' },
        { img: '../images/certs/Coursera-TMVWXU9PDOPD.jpg', cat: 'aiml', pdf: '../certs/Coursera-TMVWXU9PDOPD.pdf', title: 'Coursera Certificate', badge: 'AI / ML' },
        { img: '../images/certs/Coursera-UNNKGMLVIJG0.jpg', cat: 'aiml', pdf: '../certs/Coursera-UNNKGMLVIJG0.pdf', title: 'Coursera Certificate', badge: 'AI / ML' },
        { img: '../images/certs/Coursera-WXAQT5F9AK9X.jpg', cat: 'aiml', pdf: '../certs/Coursera-WXAQT5F9AK9X.pdf', title: 'Coursera Certificate', badge: 'AI / ML' },
        { img: '../images/certs/Coursera-YTVWRQPW3QC6.jpg', cat: 'aiml', pdf: '../certs/Coursera-YTVWRQPW3QC6.pdf', title: 'Coursera Certificate', badge: 'AI / ML' },
        { img: '../images/certs/Coursera-ZTO0F1V6P4Z0.jpg', cat: 'aiml', pdf: '../certs/Coursera-ZTO0F1V6P4Z0.pdf', title: 'Coursera Certificate', badge: 'AI / ML' }
    ];

    var SPIN_SECONDS = 110;      // one full revolution of the sphere
    var THUMB = 96;              // thumbnail width in px
    var BASE_RADIUS = 400;       // sphere radius at full scale
    var FULL_SPAN = BASE_RADIUS * 2 + THUMB;   // stage size that radius assumes

    var stage = document.getElementById('orbitStage');
    var grid = document.getElementById('orbitGrid');
    var modal = document.getElementById('certModal');
    if (!stage || !grid || !modal) return;

    var modalImg = document.getElementById('certModalImg');
    var modalTitle = document.getElementById('certModalTitle');
    var modalBadge = document.getElementById('certModalBadge');
    var modalPdf = document.getElementById('certModalPdf');

    var visible = CERTS.slice();   // current filtered set
    var openIndex = -1;            // index into `visible`, -1 = closed

    /* ========================================================
       BUILD
       ======================================================== */
    function makeThumb(cert, indexInVisible) {
        var btn = document.createElement('button');
        btn.className = 'orbit-cert-inner';
        btn.type = 'button';
        btn.setAttribute('aria-label', 'View ' + cert.title);
        btn.dataset.index = indexInVisible;

        var face = document.createElement('span');
        face.className = 'orbit-cert-face';

        var img = document.createElement('img');
        img.src = cert.img;
        img.alt = cert.title;
        img.loading = 'lazy';
        img.decoding = 'async';
        face.appendChild(img);
        btn.appendChild(face);

        return btn;
    }

    // Evenly spaced points on a sphere via a Fibonacci lattice — the only
    // distribution that avoids the clumping you get at the poles when you
    // step latitude and longitude on a fixed grid.
    function spherePoints(n) {
        var pts = [];
        if (!n) return pts;

        var golden = Math.PI * (3 - Math.sqrt(5));   // ~2.39996 rad
        for (var i = 0; i < n; i++) {
            // The +0.5 offset keeps points off the exact poles. Without it a
            // 2-item filter puts one card straight overhead and one underfoot.
            var y = 1 - ((i + 0.5) / n) * 2;         // near +1 (top) .. near -1
            var ring = Math.sqrt(Math.max(0, 1 - y * y));
            var theta = golden * i;
            var x = Math.cos(theta) * ring;
            var z = Math.sin(theta) * ring;
            pts.push({
                x: x, y: y, z: z,
                lon: Math.atan2(x, z) * 180 / Math.PI,
                lat: Math.asin(y) * 180 / Math.PI
            });
        }
        return pts;
    }

    // The sphere must fit inside the stage box in BOTH axes, or overflow:hidden
    // clips its top and bottom.
    function radius() {
        var box = stage.getBoundingClientRect();
        var span = Math.min(box.width, box.height);
        if (!span) return BASE_RADIUS;
        return Math.round(BASE_RADIUS * Math.min(1, span / FULL_SPAN));
    }

    var slots = [];   // { el, billboard, x, y, z } for the depth pass

    function render() {
        var scene = document.getElementById('orbitScene');
        scene.querySelectorAll('.orbit-sphere').forEach(function (el) { el.remove(); });
        grid.innerHTML = '';
        slots = [];

        var r = radius();
        var pts = spherePoints(visible.length);

        var sphere = document.createElement('div');
        sphere.className = 'orbit-sphere';
        sphere.style.setProperty('--dur', SPIN_SECONDS + 's');

        pts.forEach(function (pt, i) {
            var slot = document.createElement('div');
            slot.className = 'orbit-cert';
            slot.style.setProperty('--lon', pt.lon.toFixed(3) + 'deg');
            slot.style.setProperty('--lat', pt.lat.toFixed(3) + 'deg');
            slot.style.setProperty('--r', r + 'px');
            slot.style.setProperty('--dur', SPIN_SECONDS + 's');
            slot.dataset.index = i;

            // Extra layer: cancels the surface tilt so the card faces us.
            var billboard = document.createElement('div');
            billboard.className = 'orbit-cert-billboard';
            billboard.appendChild(makeThumb(visible[i], i));
            slot.appendChild(billboard);

            sphere.appendChild(slot);
            slots.push({ el: slot, billboard: billboard, x: pt.x, y: pt.y, z: pt.z });
        });

        scene.appendChild(sphere);

        // Flat fallback for narrow screens / reduced motion
        visible.forEach(function (cert, i) {
            grid.appendChild(makeThumb(cert, i));
        });
    }

    /* ========================================================
       DEPTH PASS
       Perspective already scales the cards by distance, but front and back
       still read identically without haze. One rAF loop derives the spin
       angle from the clock (no layout reads) and writes --depth per card.
       ======================================================== */
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    (function depthLoop() {
        if (reduceMotion) return;
        var elapsed = 0;
        var last = performance.now();

        function frame(now) {
            var dt = now - last;
            last = now;
            if (!stage.classList.contains('paused')) elapsed += dt;

            var theta = (elapsed / (SPIN_SECONDS * 1000)) * Math.PI * 2;
            var cos = Math.cos(theta);
            var sin = Math.sin(theta);

            for (var i = 0; i < slots.length; i++) {
                var s = slots[i];
                // rotate the unit position around Y by theta, take the z component
                var z = s.z * cos + s.x * sin;
                s.el.style.setProperty('--depth', ((z + 1) / 2).toFixed(3));
            }
            requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
    })();

    /* ========================================================
       POPUP
       ======================================================== */
    function markOpenSlot(index) {
        stage.querySelectorAll('.orbit-cert.is-open').forEach(function (el) {
            el.classList.remove('is-open');
        });
        if (index < 0) return;
        var slot = stage.querySelector('.orbit-cert[data-index="' + index + '"]');
        if (slot) slot.classList.add('is-open');
    }

    function open(index) {
        var cert = visible[index];
        if (!cert) return;
        openIndex = index;

        modalImg.src = cert.img;
        modalImg.alt = cert.title;
        modalTitle.textContent = cert.title;
        modalBadge.textContent = cert.badge;

        if (cert.pdf) {
            modalPdf.href = cert.pdf;
            modalPdf.hidden = false;
        } else {
            modalPdf.hidden = true;
        }

        modal.classList.add('open');
        stage.classList.add('paused');   // orbit freezes while open
        document.body.style.overflow = 'hidden';
        markOpenSlot(index);
    }

    // Sends the certificate back into place
    function close() {
        modal.classList.remove('open');
        stage.classList.remove('paused');
        document.body.style.overflow = '';
        modalImg.src = '';
        markOpenSlot(-1);
        openIndex = -1;
    }

    function step(delta) {
        if (openIndex < 0 || !visible.length) return;
        open((openIndex + delta + visible.length) % visible.length);
    }

    /* ========================================================
       EVENTS
       ======================================================== */
    document.addEventListener('click', function (e) {
        var thumb = e.target.closest('.orbit-cert-inner');
        if (thumb) {
            var i = parseInt(thumb.dataset.index, 10);
            // Clicking the certificate that is already open sends it back.
            if (i === openIndex) close();
            else open(i);
            return;
        }

        if (e.target.closest('#certModalClose')) { close(); return; }
        if (e.target.closest('#certModalPrev')) { step(-1); return; }
        if (e.target.closest('#certModalNext')) { step(1); return; }
        if (e.target.closest('#certModalPdf')) return;   // let the PDF link work

        // Clicking anywhere else on the popup returns it to orbit
        if (modal.classList.contains('open') && e.target.closest('.cert-modal')) close();
    });

    document.addEventListener('keydown', function (e) {
        if (!modal.classList.contains('open')) return;
        if (e.key === 'Escape') close();
        else if (e.key === 'ArrowLeft') step(-1);
        else if (e.key === 'ArrowRight') step(1);
    });

    // No hover-pause: scrolling drags the page under a stationary cursor,
    // which fires mouseenter and freezes the orbit mid-scroll. The rings turn
    // slowly enough (78-132s per revolution) to click without it.

    // Filters
    document.querySelectorAll('.orbit-filter').forEach(function (btn) {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.orbit-filter').forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            var f = btn.dataset.filter;
            visible = f === 'all' ? CERTS.slice() : CERTS.filter(function (c) { return c.cat === f; });
            close();
            render();
            var countEl = document.getElementById('orbitShownCount');
            if (countEl) countEl.textContent = visible.length;
        });
    });

    /* ========================================================
       HEADER
       ======================================================== */
    var header = document.querySelector('.header');
    window.addEventListener('scroll', function () {
        if (header) header.classList.toggle('sticky', window.scrollY > 80);
    }, { passive: true });

    var menuIcon = document.getElementById('menu-icon');
    var navbar = document.querySelector('.navbar');
    if (menuIcon && navbar) {
        menuIcon.addEventListener('click', function () {
            menuIcon.classList.toggle('bx-x');
            navbar.classList.toggle('active');
        });
    }

    // Re-scale the sphere when the stage box changes
    var resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            var r = radius() + 'px';
            slots.forEach(function (s) { s.el.style.setProperty('--r', r); });
        }, 150);
    }, { passive: true });

    render();
})();
