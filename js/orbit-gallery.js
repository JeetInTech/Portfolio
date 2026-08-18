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

    // base radius (px at full scale), rotation period (s), direction
    var RINGS = [
        { r: 270, dur: 78, dir: 'cw' },
        { r: 365, dur: 104, dir: 'ccw' },
        { r: 460, dur: 132, dir: 'cw' }
    ];
    var THUMB = 96;              // thumbnail width
    var FULL_SPAN = 460 * 2 + THUMB;   // stage size the base radii assume

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

        var img = document.createElement('img');
        img.src = cert.img;
        img.alt = cert.title;
        img.loading = 'lazy';
        img.decoding = 'async';
        btn.appendChild(img);

        return btn;
    }

    // Choose how many rings to use, then spread evenly across them. A small
    // filtered set gets ONE ring — three rings holding one item each reads as
    // broken, not sparse.
    function distribute(count) {
        if (!count) return [0, 0, 0];

        var buckets = [0, 0, 0];
        if (count <= 12) {
            buckets[1] = count;                      // middle ring only
        } else if (count <= 26) {
            buckets[1] = Math.ceil(count * 0.45);    // middle + outer
            buckets[2] = count - buckets[1];
        } else {
            buckets[0] = Math.round(count * 0.25);   // all three
            buckets[1] = Math.round(count * 0.35);
            buckets[2] = count - buckets[0] - buckets[1];
        }
        return buckets;
    }

    // Orbits must fit inside the stage box in BOTH axes, or overflow:hidden
    // clips the top and bottom of the outer ring.
    function scaleFactor() {
        var box = stage.getBoundingClientRect();
        var span = Math.min(box.width, box.height);
        if (!span) return 1;
        return Math.min(1, span / FULL_SPAN);
    }

    function render() {
        stage.querySelectorAll('.orbit-ring').forEach(function (r) { r.remove(); });
        grid.innerHTML = '';

        var buckets = distribute(visible.length);
        var scale = scaleFactor();
        var cursor = 0;

        buckets.forEach(function (count, ringIndex) {
            if (!count) return;
            var cfg = RINGS[ringIndex];
            var ring = document.createElement('div');
            ring.className = 'orbit-ring';
            ring.dataset.dir = cfg.dir;
            ring.style.setProperty('--dur', cfg.dur + 's');

            for (var i = 0; i < count; i++) {
                var cert = visible[cursor];
                var slot = document.createElement('div');
                slot.className = 'orbit-cert';
                slot.style.setProperty('--a', (i / count) * 360 + 'deg');
                slot.style.setProperty('--r', Math.round(cfg.r * scale) + 'px');
                slot.style.setProperty('--dur', cfg.dur + 's');
                slot.dataset.index = cursor;
                slot.appendChild(makeThumb(cert, cursor));
                ring.appendChild(slot);
                cursor++;
            }
            stage.appendChild(ring);
        });

        // Flat fallback for narrow screens / reduced motion
        visible.forEach(function (cert, i) {
            grid.appendChild(makeThumb(cert, i));
        });
    }

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

    // Re-scale the orbits when the stage box changes
    var resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            var scale = scaleFactor();
            stage.querySelectorAll('.orbit-ring').forEach(function (ring, ringIndex) {
                var base = RINGS[ringIndex] ? RINGS[ringIndex].r : RINGS[RINGS.length - 1].r;
                ring.querySelectorAll('.orbit-cert').forEach(function (slot) {
                    slot.style.setProperty('--r', Math.round(base * scale) + 'px');
                });
            });
        }, 150);
    }, { passive: true });

    render();
})();
