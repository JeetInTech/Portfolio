document.addEventListener('DOMContentLoaded', () => {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const overlay = document.querySelector('.overlay');
    const menuIcon = document.querySelector('#menu-icon');
    const navbar = document.querySelector('.navbar');

        // // Generate 20 gallery items dynamically
        // const gallery = document.querySelector('.gallery');
        // for (let i = 1; i <= 20; i++) {
        //     const item = document.createElement('div');
        //     item.className = 'gallery-item';
        //     const imagePath = `photos/photo%20(${i}).jpg`;
        //     item.innerHTML = `<img src="${imagePath}" alt="Photo ${i}">`;
        //     gallery.appendChild(item);
        // }
    
        // Create independent floating animations
        const floatingAnimations = [
            { x: 15, y: 15, rotate: 13 },
            { x: -15, y: 15, rotate: -13 },
            { x: 15, y: -15, rotate: -12 },
            { x: -15, y: -15, rotate: 12 }
        ];
    
        document.querySelectorAll('.gallery-item').forEach(item => {
            // Random animation parameters for each image
            const animation = floatingAnimations[Math.floor(Math.random() * floatingAnimations.length)];
            
            item.style.setProperty('--float-x', `${animation.x}px`);
            item.style.setProperty('--float-y', `${animation.y}px`);
            item.style.setProperty('--float-rotate', `${animation.rotate}deg`);
            item.style.animationDelay = `${Math.random() * 20}s`;
        });

    // Gallery Functionality
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            if (this.classList.contains('active')) {
                this.classList.add('flip');
    
                // Listen for animation completion before resetting
                this.addEventListener('animationend', function removeFlip() {
                    this.classList.remove('active', 'flip');
                    overlay.classList.remove('active');
                    this.removeEventListener('animationend', removeFlip); // Clean up event listener
                }, { once: true }); // Ensures it runs only once per click
            } else {
                // Remove active state from all other images
                galleryItems.forEach(otherItem => otherItem.classList.remove('active'));
                this.classList.add('active');
                overlay.classList.add('active');
            }
        });
    });
    
    
    // Close when clicking outside
    overlay.addEventListener('click', () => {
        const activeItem = document.querySelector('.gallery-item.active');
        if(activeItem) {
            activeItem.classList.add('flip');
            setTimeout(() => {
                activeItem.classList.remove('active', 'flip');
                overlay.classList.remove('active');
            }, 800);
        }
    });

    // Mobile Menu Toggle
    menuIcon.addEventListener('click', () => {
        navbar.classList.toggle('active');
        menuIcon.classList.toggle('bx-x');
    });

    // Close menu when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if(!navbar.contains(e.target) && !menuIcon.contains(e.target)) {
            navbar.classList.remove('active');
            menuIcon.classList.remove('bx-x');
        }
    });

    // Add random movement to gallery items
    galleryItems.forEach(item => {
        item.style.animationDelay = `${Math.random() * 15}s`;
    });
});