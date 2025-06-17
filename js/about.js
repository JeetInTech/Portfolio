document.addEventListener("DOMContentLoaded", function() {
    const darkModeIcon = document.getElementById('darkMode-icon');
    const menuIcon = document.getElementById('menu-icon');
    const navbar = document.querySelector('.navbar');
    const body = document.body;

    // 🌙 Dark Mode Toggle
    function toggleDarkMode() {
        body.classList.toggle('dark-mode');
        
        if (body.classList.contains('dark-mode')) {
            darkModeIcon.classList.replace('bx-moon', 'bx-sun');
            // Store preference in memory instead of localStorage
            window.darkModeEnabled = true;
        } else {
            darkModeIcon.classList.replace('bx-sun', 'bx-moon');
            window.darkModeEnabled = false;
        }
    }

    // Initialize dark mode state
    if (window.darkModeEnabled) {
        body.classList.add('dark-mode');
        darkModeIcon.classList.replace('bx-moon', 'bx-sun');
    } else {
        // Ensure moon icon is set if dark mode is disabled
        if (!darkModeIcon.classList.contains('bx-moon') && !darkModeIcon.classList.contains('bx-sun')) {
            darkModeIcon.classList.add('bx-moon');
        }
    }

    if (darkModeIcon) {
        darkModeIcon.addEventListener('click', toggleDarkMode);
    }

    // 📱 Mobile Menu Toggle
    function toggleMenu(event) {
        event.stopPropagation();
        navbar.classList.toggle('active');
        menuIcon.classList.toggle('bx-x');

        if (navbar.classList.contains('active')) {
            document.addEventListener('click', closeMenuOnClickOutside);
        } else {
            document.removeEventListener('click', closeMenuOnClickOutside);
        }
    }

    function closeMenuOnClickOutside(event) {
        if (!navbar.contains(event.target) && !menuIcon.contains(event.target)) {
            navbar.classList.remove('active');
            menuIcon.classList.remove('bx-x');
            document.removeEventListener('click', closeMenuOnClickOutside);
        }
    }

    if (menuIcon) {
        menuIcon.addEventListener('click', toggleMenu);
    }

    // 🖥️ Close Menu on Window Resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            navbar.classList.remove('active');
            menuIcon.classList.remove('bx-x');
        }
    });

    // 🎯 Navigation Link Clicks (Close mobile menu)
    const navLinks = document.querySelectorAll('.navbar a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Close mobile menu when link is clicked
            navbar.classList.remove('active');
            menuIcon.classList.remove('bx-x');
            document.removeEventListener('click', closeMenuOnClickOutside);
        });
    });

    // 🚀 GSAP Animations
    if (typeof gsap !== 'undefined') {
        // Page title animation
        gsap.to(".animate-title", {
            duration: 1,
            y: 0,
            opacity: 1,
            ease: "power4.out"
        });

        // Content cards animation
        gsap.to(".animate-card", {
            duration: 1,
            y: 0,
            opacity: 1,
            stagger: 0.2,
            scrollTrigger: {
                trigger: ".about-content",
                start: "top 80%", 
                toggleActions: "play none none none"
            }
        });

        // Profile section slide-in animation
        gsap.to(".animate-slide-left", {
            duration: 1,
            x: 0,
            opacity: 1,
            ease: "power2.out",
            scrollTrigger: {
                trigger: ".profile-section",
                start: "top 85%",
                toggleActions: "play none none none"
            }
        });

        // Timeline items animation
        gsap.to(".animate-timeline", {
            duration: 0.8,
            x: 0,
            opacity: 1,
            stagger: 0.3,
            scrollTrigger: {
                trigger: ".interactive-timeline",
                start: "top 80%",
                toggleActions: "play none none none"
            }
        });

        // Skill bubbles animation
        gsap.to(".animate-bubble", {
            duration: 0.6,
            scale: 1,
            opacity: 1,
            stagger: 0.1,
            scrollTrigger: {
                trigger: ".skill-bubbles",
                start: "top 85%",
                toggleActions: "play none none none"
            }
        });

        // Education cards animation
        gsap.to(".animate-education", {
            duration: 0.8,
            y: 0,
            opacity: 1,
            stagger: 0.2,
            scrollTrigger: {
                trigger: ".education-cards",
                start: "top 80%",
                toggleActions: "play none none none"
            }
        });

        // Contact items animation
        gsap.to(".animate-contact", {
            duration: 0.6,
            x: 0,
            opacity: 1,
            stagger: 0.1,
            scrollTrigger: {
                trigger: ".contact-info",
                start: "top 85%",
                toggleActions: "play none none none"
            }
        });

        // Floating elements animation
        gsap.to(".shape", {
            rotation: 360,
            duration: 20,
            ease: "none",
            repeat: -1
        });
    }

    // 📱 Touch-friendly interactions
    const socialFloats = document.querySelectorAll('.social-float');
    socialFloats.forEach(social => {
        social.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        social.addEventListener('touchend', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // 📊 Profile stats animation on scroll
    const statNumbers = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.animated) {
                const target = entry.target;
                const finalNumber = target.textContent;
                const numberValue = parseInt(finalNumber.replace(/\D/g, ''));
                
                if (numberValue) {
                    target.animated = true;
                    animateNumber(target, 0, numberValue, finalNumber.includes('+') ? '+' : '');
                }
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => observer.observe(stat));

    function animateNumber(element, start, end, suffix) {
        const duration = 2000;
        const stepTime = 50;
        const steps = duration / stepTime;
        const increment = (end - start) / steps;
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                element.textContent = end + suffix;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + suffix;
            }
        }, stepTime);
    }

    // 🎨 Parallax effect for background shapes
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const shapes = document.querySelectorAll('.shape');
        
        shapes.forEach((shape, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed);
            shape.style.transform = `translateY(${yPos}px) rotate(${scrolled * 0.1}deg)`;
        });
    });

    // 🔍 Image hover effects
    const profileImage = document.querySelector('.profile-image img');
    if (profileImage) {
        profileImage.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        profileImage.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }

    // 📧 Email validation for contact form (if added later)
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // 🎯 Smooth scroll for better UX
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});