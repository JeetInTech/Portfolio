// ================================
// MOBILE MENU FUNCTIONALITY
// ================================
class MobileMenu {
    constructor() {
        this.menuToggle = document.getElementById('menu-toggle');
        this.mobileMenu = document.getElementById('mobile-menu');
        this.mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
        this.mobileMenuClose = document.getElementById('mobile-menu-close');
        this.navbar = document.querySelector('.navbar');
        
        this.init();
    }

    init() {
        if (!this.menuToggle || !this.mobileMenu) return;

        // Toggle mobile menu
        this.menuToggle.addEventListener('click', () => {
            this.toggleMenu();
        });

        // Close menu with close button
        this.mobileMenuClose.addEventListener('click', () => {
            this.closeMenu();
        });

        // Close menu with overlay click
        this.mobileMenuOverlay.addEventListener('click', () => {
            this.closeMenu();
        });

        // Close menu when clicking on a nav link
        const navLinks = this.mobileMenu.querySelectorAll('.nav-item');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu();
            });
        });

        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen()) {
                this.closeMenu();
            }
        });

        // Close menu on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.isMenuOpen()) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        if (this.isMenuOpen()) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        this.menuToggle.classList.add('active');
        this.mobileMenu.classList.add('active');
        this.mobileMenuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus first menu item for accessibility
        const firstMenuItem = this.mobileMenu.querySelector('.nav-item');
        if (firstMenuItem) {
            setTimeout(() => firstMenuItem.focus(), 300);
        }
    }

    closeMenu() {
        this.menuToggle.classList.remove('active');
        this.mobileMenu.classList.remove('active');
        this.mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    isMenuOpen() {
        return this.mobileMenu.classList.contains('active');
    }
}

// ================================
// DARK MODE FUNCTIONALITY
// ================================
class DarkMode {
    constructor() {
        this.toggleBtn = document.getElementById('dark-mode-toggle');
        this.themeIcon = document.getElementById('theme-icon');
        this.currentTheme = this.getStoredTheme() || 'light';
        
        this.init();
    }

    init() {
        if (!this.toggleBtn) return;

        // Apply stored theme
        this.applyTheme(this.currentTheme);

        // Toggle theme on button click
        this.toggleBtn.addEventListener('click', () => {
            this.toggleTheme();
        });

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!this.getStoredTheme()) {
                this.applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
        this.storeTheme(newTheme);
    }

    applyTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        
        // Update icon
        if (this.themeIcon) {
            this.themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }

        // Add smooth transition
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        
        // Announce theme change for screen readers
        this.announceThemeChange(theme);
    }

    getStoredTheme() {
        try {
            return localStorage.getItem('theme');
        } catch (e) {
            // Fallback for environments without localStorage
            return null;
        }
    }

    storeTheme(theme) {
        try {
            localStorage.setItem('theme', theme);
        } catch (e) {
            // Graceful degradation if localStorage is not available
            console.warn('Cannot store theme preference');
        }
    }

    announceThemeChange(theme) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.style.position = 'absolute';
        announcement.style.left = '-10000px';
        announcement.style.width = '1px';
        announcement.style.height = '1px';
        announcement.style.overflow = 'hidden';
        announcement.textContent = `Theme changed to ${theme} mode`;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
}

// ================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ================================
class AnimationObserver {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.init();
    }

    init() {
        // Create intersection observer
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, this.observerOptions);

        // Observe all animatable elements
        this.observeElements();
    }

    observeElements() {
        const elements = document.querySelectorAll('.skill-card, .tool-card, .expertise-card');
        elements.forEach(el => this.observer.observe(el));
    }

    animateElement(element) {
        // Add animation class with stagger delay
        const delay = this.calculateDelay(element);
        
        setTimeout(() => {
            element.classList.add('animate');
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, delay);

        // Unobserve after animation
        this.observer.unobserve(element);
    }

    calculateDelay(element) {
        const siblings = Array.from(element.parentNode.children);
        const index = siblings.indexOf(element);
        return index * 100; // 100ms stagger between elements
    }
}

// ================================
// FLOATING SOCIAL BUTTONS ANIMATION
// ================================
class FloatingSocial {
    constructor() {
        this.socialContainer = document.querySelector('.floating-social');
        this.socialButtons = document.querySelectorAll('.social-btn');
        this.init();
    }

    init() {
        if (!this.socialContainer) return;

        // Add entrance animation
        this.animateEntrance();
        
        // Add hover effects
        this.addHoverEffects();
        
        // Add scroll-based hide/show
        this.handleScroll();
    }

    animateEntrance() {
        this.socialButtons.forEach((btn, index) => {
            btn.style.opacity = '0';
            btn.style.transform = 'translateX(100px)';
            
            setTimeout(() => {
                btn.style.transition = 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                btn.style.opacity = '0.8';
                btn.style.transform = 'translateX(0)';
            }, (index + 1) * 200);
        });
    }

    addHoverEffects() {
        this.socialButtons.forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                this.createRipple(btn);
            });
        });
    }

    createRipple(button) {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            width: 100px;
            height: 100px;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%) scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        button.style.position = 'relative';
        button.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }

    handleScroll() {
        let lastScrollY = window.scrollY;
        let ticking = false;

        const updateSocialVisibility = () => {
            const currentScrollY = window.scrollY;
            const scrollDelta = currentScrollY - lastScrollY;

            if (Math.abs(scrollDelta) > 5) {
                if (scrollDelta > 0 && currentScrollY > 200) {
                    // Scrolling down - hide
                    this.socialContainer.style.transform = 'translateX(100px)';
                    this.socialContainer.style.opacity = '0';
                } else {
                    // Scrolling up or near top - show
                    this.socialContainer.style.transform = 'translateX(0)';
                    this.socialContainer.style.opacity = '1';
                }
                lastScrollY = currentScrollY;
            }
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateSocialVisibility);
                ticking = true;
            }
        });
    }
}

// ================================
// SKILL CARD INTERACTIONS
// ================================
class SkillCardEffects {
    constructor() {
        this.skillCards = document.querySelectorAll('.skill-card, .tool-card, .expertise-card');
        this.init();
    }

    init() {
        this.skillCards.forEach(card => {
            this.addTiltEffect(card);
            this.addParallaxEffect(card);
            this.setupInitialState(card);
        });
    }

    setupInitialState(card) {
        // Set initial state for animations
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    }

    addTiltEffect(card) {
        // Only add tilt effect on non-touch devices
        if ('ontouchstart' in window) return;

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    }

    addParallaxEffect(card) {
        const icon = card.querySelector('.skill-icon, .tool-icon, .expertise-icon');
        if (!icon) return;

        // Only add parallax effect on non-touch devices
        if ('ontouchstart' in window) return;

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const moveX = (x - rect.width / 2) / 20;
            const moveY = (y - rect.height / 2) / 20;
            
            icon.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`;
        });

        card.addEventListener('mouseleave', () => {
            icon.style.transform = 'translate(0, 0) scale(1)';
        });
    }
}

// ================================
// HEADER SCROLL EFFECTS
// ================================
class HeaderEffects {
    constructor() {
        this.header = document.querySelector('.header');
        this.init();
    }

    init() {
        if (!this.header) return;

        let lastScrollY = 0;
        let ticking = false;

        const updateHeader = () => {
            const scrollY = window.scrollY;
            
            // Add background blur effect
            if (scrollY > 50) {
                this.header.style.background = 'rgba(var(--bg-color-rgb), 0.95)';
                this.header.style.backdropFilter = 'blur(15px)';
                this.header.style.boxShadow = '0 2px 20px var(--shadow)';
            } else {
                this.header.style.background = 'rgba(var(--bg-color-rgb), 0.95)';
                this.header.style.backdropFilter = 'blur(10px)';
                this.header.style.boxShadow = 'none';
            }

            // Hide/show header on scroll (only on mobile)
            if (window.innerWidth <= 768) {
                if (Math.abs(scrollY - lastScrollY) > 10) {
                    if (scrollY > lastScrollY && scrollY > 100) {
                        this.header.style.transform = 'translateY(-100%)';
                    } else {
                        this.header.style.transform = 'translateY(0)';
                    }
                    lastScrollY = scrollY;
                }
            }

            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        });
    }
}

// ================================
// SMOOTH SCROLLING FOR ANCHOR LINKS
// ================================
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                
                if (target) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const offsetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// ================================
// RESPONSIVE UTILITIES
// ================================
class ResponsiveUtils {
    constructor() {
        this.breakpoints = {
            mobile: 768,
            tablet: 1024,
            desktop: 1200
        };
        this.init();
    }

    init() {
        this.handleResize();
        window.addEventListener('resize', () => this.handleResize());
    }

    handleResize() {
        const width = window.innerWidth;
        
        // Update CSS custom properties based on screen size
        if (width <= this.breakpoints.mobile) {
            document.documentElement.style.setProperty('--container-padding', '20px');
            document.documentElement.style.setProperty('--section-padding', '60px 0');
        } else if (width <= this.breakpoints.tablet) {
            document.documentElement.style.setProperty('--container-padding', '40px');
            document.documentElement.style.setProperty('--section-padding', '80px 0');
        } else {
            document.documentElement.style.setProperty('--container-padding', '60px');
            document.documentElement.style.setProperty('--section-padding', '100px 0');
        }
    }

    isMobile() {
        return window.innerWidth <= this.breakpoints.mobile;
    }

    isTablet() {
        return window.innerWidth <= this.breakpoints.tablet;
    }
}

// ================================
// PERFORMANCE OPTIMIZATION
// ================================
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        // Lazy load images
        this.lazyLoadImages();
        
        // Preload critical resources
        this.preloadResources();
        
        // Optimize animations
        this.optimizeAnimations();
        
        // Reduce motion for users who prefer it
        this.respectReducedMotion();
    }

    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    preloadResources() {
        // Preload critical fonts
        const fontLink = document.createElement('link');
        fontLink.rel = 'preload';
        fontLink.as = 'font';
        fontLink.type = 'font/woff2';
        fontLink.crossOrigin = 'anonymous';
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap';
        document.head.appendChild(fontLink);
    }

    optimizeAnimations() {
        // Use CSS transforms and will-change for better performance
        const animatedElements = document.querySelectorAll('.skill-card, .tool-card, .expertise-card');
        
        animatedElements.forEach(el => {
            el.style.willChange = 'transform, opacity';
            
            // Remove will-change after animation completes
            el.addEventListener('transitionend', () => {
                el.style.willChange = 'auto';
            }, { once: true });
        });
    }

    respectReducedMotion() {
        // Check if user prefers reduced motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (prefersReducedMotion) {
            // Disable animations
            const style = document.createElement('style');
            style.textContent = `
                *, *::before, *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// ================================
// ACCESSIBILITY ENHANCEMENTS
// ================================
class AccessibilityEnhancements {
    constructor() {
        this.init();
    }

    init() {
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
        this.setupARIALabels();
        this.setupSkipLinks();
    }

    setupKeyboardNavigation() {
        // Handle keyboard navigation for cards
        const cards = document.querySelectorAll('.skill-card, .tool-card, .expertise-card');
        
        cards.forEach(card => {
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    card.click();
                }
            });
        });
    }

    setupFocusManagement() {
        // Focus management for modal/menu interactions
        const focusableElements = 'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, [tabindex]:not([tabindex="-1"])';
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                const focusableContent = document.querySelectorAll(focusableElements);
                const firstFocusableElement = focusableContent[0];
                const lastFocusableElement = focusableContent[focusableContent.length - 1];

                if (e.shiftKey) {
                    if (document.activeElement === firstFocusableElement) {
                        lastFocusableElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusableElement) {
                        firstFocusableElement.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }

    setupARIALabels() {
        // Add ARIA labels for better screen reader support
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        if (darkModeToggle) {
            darkModeToggle.setAttribute('aria-label', 'Toggle dark mode');
        }

        const menuToggle = document.getElementById('menu-toggle');
        if (menuToggle) {
            menuToggle.setAttribute('aria-label', 'Toggle mobile menu');
            menuToggle.setAttribute('aria-expanded', 'false');
        }

        // Update ARIA attributes when menu state changes
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                        const isOpen = mobileMenu.classList.contains('active');
                        menuToggle.setAttribute('aria-expanded', isOpen.toString());
                    }
                });
            });
            
            observer.observe(mobileMenu, { attributes: true });
        }
    }

    setupSkipLinks() {
        // Add skip to main content link
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--accent-color);
            color: white;
            padding: 8px;
            text-decoration: none;
            z-index: 10000;
            border-radius: 4px;
            transition: top 0.3s;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Add main content ID
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.setAttribute('id', 'main-content');
        }
    }
}

// ================================
// ADD RIPPLE ANIMATION CSS
// ================================
const addRippleCSS = () => {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: translate(-50%, -50%) scale(1);
                opacity: 0;
            }
        }
        
        .skill-card, .tool-card, .expertise-card {
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        
        .skill-card:hover, .tool-card:hover, .expertise-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px var(--shadow);
        }
        
        .skill-card:focus, .tool-card:focus, .expertise-card:focus {
            outline: 2px solid var(--accent-color);
            outline-offset: 2px;
        }
        
        /* Mobile optimizations */
        @media (max-width: 768px) {
            .skill-card, .tool-card, .expertise-card {
                margin-bottom: 20px;
            }
            
            .floating-social {
                bottom: 20px;
                right: 20px;
            }
            
            .dark-mode-toggle {
                bottom: 20px;
                right: 20px;
                width: 50px;
                height: 50px;
                font-size: 20px;
            }
        }
    `;
    document.head.appendChild(style);
};

// ================================
// INITIALIZE ALL COMPONENTS
// ================================
document.addEventListener('DOMContentLoaded', () => {
    // Add CSS for interactions
    addRippleCSS();
    
    // Initialize all components
    new MobileMenu();
    new DarkMode();
    new AnimationObserver();
    new FloatingSocial();
    new SkillCardEffects();
    new HeaderEffects();
    new SmoothScroll();
    new ResponsiveUtils();
    new PerformanceOptimizer();
    new AccessibilityEnhancements();
    
    // Add loading complete class to body
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
    
    // Add fade-in animation to main content
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.style.opacity = '0';
        mainContent.style.transform = 'translateY(20px)';
        mainContent.style.transition = 'all 0.8s ease-out';
        
        setTimeout(() => {
            mainContent.style.opacity = '1';
            mainContent.style.transform = 'translateY(0)';
        }, 200);
    }
});

// ================================
// RESIZE HANDLER
// ================================
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Recalculate positions and animations on resize
        const event = new CustomEvent('windowResized');
        document.dispatchEvent(event);
    }, 250);
});

// ================================
// ERROR HANDLING
// ================================
window.addEventListener('error', (e) => {
    console.warn('An error occurred:', e.error);
    // Graceful degradation - ensure basic functionality works
});

// ================================
// TOUCH DEVICE OPTIMIZATIONS
// ================================
if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');
    
    // Add touch-specific styles
    const touchStyle = document.createElement('style');
    touchStyle.textContent = `
        .touch-device .skill-card:hover,
        .touch-device .tool-card:hover,
        .touch-device .expertise-card:hover {
            transform: none;
        }
        
        .touch-device .skill-card:active,
        .touch-device .tool-card:active,
        .touch-device .expertise-card:active {
            transform: scale(0.98);
        }
    `;
    document.head.appendChild(touchStyle);
}

// ================================
// EXPORT FOR TESTING (if needed)
// ================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        MobileMenu,
        DarkMode,
        AnimationObserver,
        FloatingSocial,
        SkillCardEffects,
        HeaderEffects,
        SmoothScroll,
        ResponsiveUtils,
        PerformanceOptimizer,
        AccessibilityEnhancements
    };
}