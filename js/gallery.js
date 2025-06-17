document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const galleryItems = document.querySelectorAll('.gallery-item');
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const closeBtn = document.getElementById('closeBtn');
    const modalBackdrop = document.querySelector('.modal-backdrop');
    const menuIcon = document.querySelector('#menu-icon');
    const navbar = document.querySelector('.navbar');

    // Interaction elements
    const likeBtn = document.querySelector('.like-btn');
    const dislikeBtn = document.querySelector('.dislike-btn');
    const likeCount = document.querySelector('.like-count');
    const dislikeCount = document.querySelector('.dislike-count');

    // Gallery functionality
    let currentImageIndex = 0;
    let isModalOpen = false;
    let userInteractions = {};

    // In-memory storage for interactions (replacing localStorage)
    let userId = 'anon_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

    // Load stored interactions from memory
    const loadStoredData = () => {
        return userInteractions;
    };

    // Save interactions to memory
    const saveToMemory = (data) => {
        userInteractions = { ...data };
    };

    // Initialize storage
    userInteractions = loadStoredData();

    // Ensure each image has interaction data
    const initializeImageData = (imageIndex) => {
        if (!userInteractions[imageIndex]) {
            userInteractions[imageIndex] = {
                likes: Math.floor(Math.random() * 50), // Random initial likes
                dislikes: Math.floor(Math.random() * 5), // Random initial dislikes
                comments: [],
                userLiked: false,
                userDisliked: false
            };
        }
    };

    // Create enhanced floating animations for gallery items
    const createFloatingAnimation = () => {
        galleryItems.forEach((item, index) => {
            // Random floating parameters
            const floatDistance = 5 + Math.random() * 10;
            const rotateAngle = -3 + Math.random() * 6;
            const duration = 4 + Math.random() * 4;
            const delay = Math.random() * 2;

            // Apply CSS custom properties for floating animation
            item.style.setProperty('--float-distance', `${floatDistance}px`);
            item.style.setProperty('--rotate-angle', `${rotateAngle}deg`);
            item.style.setProperty('--float-duration', `${duration}s`);
            item.style.setProperty('--float-delay', `${delay}s`);

            // Add floating animation class
            item.classList.add('floating');
        });
    };

    // Add floating animation CSS dynamically
    const addFloatingCSS = () => {
        const style = document.createElement('style');
        style.textContent = `
            .gallery-item.floating {
                animation: 
                    floatGentle var(--float-duration, 6s) ease-in-out infinite var(--float-delay, 0s),
                    rotateGentle calc(var(--float-duration, 6s) * 1.5) ease-in-out infinite calc(var(--float-delay, 0s) * 0.5);
            }

            @keyframes floatGentle {
                0%, 100% { 
                    transform: translateY(0) translateX(0) scale(1); 
                }
                25% { 
                    transform: translateY(calc(var(--float-distance, 8px) * -0.5)) translateX(calc(var(--float-distance, 8px) * 0.3)) scale(1.01); 
                }
                50% { 
                    transform: translateY(calc(var(--float-distance, 8px) * -1)) translateX(0) scale(1); 
                }
                75% { 
                    transform: translateY(calc(var(--float-distance, 8px) * -0.5)) translateX(calc(var(--float-distance, 8px) * -0.3)) scale(1.01); 
                }
            }

            @keyframes rotateGentle {
                0%, 100% { 
                    transform: rotate(0deg); 
                }
                50% { 
                    transform: rotate(var(--rotate-angle, 2deg)); 
                }
            }

            .gallery-item.reveal {
                animation: revealScale 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
            }

            @keyframes revealScale {
                from {
                    opacity: 0;
                    transform: translateY(50px) scale(0.8);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }

            @keyframes rippleExpand {
                to {
                    transform: translate(-50%, -50%) scale(2);
                    opacity: 0;
                }
            }

            .gallery-item.loaded {
                opacity: 1;
                transition: opacity 0.3s ease;
            }

            .gallery-item.error {
                opacity: 0.5;
                filter: grayscale(100%);
            }

            .modal-interactions {
                display: flex;
                align-items: center;
                gap: 1rem;
                margin: 1rem 0;
                padding: 1rem;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                backdrop-filter: blur(10px);
            }

            .interaction-btn {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.5rem 1rem;
                border: none;
                border-radius: 8px;
                background: rgba(255, 255, 255, 0.1);
                color: white;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .interaction-btn:hover {
                background: rgba(255, 255, 255, 0.2);
                transform: translateY(-2px);
            }

            .interaction-btn.active {
                background: #6366f1;
                color: white;
            }

            .comments-section {
                margin-top: 1rem;
                padding: 1rem;
                background: rgba(0, 0, 0, 0.3);
                border-radius: 12px;
                max-height: 300px;
                overflow-y: auto;
            }

            .comment-input-container {
                display: flex;
                gap: 0.5rem;
                margin-bottom: 1rem;
            }

            .comment-input {
                flex: 1;
                padding: 0.5rem;
                border: none;
                border-radius: 8px;
                background: rgba(255, 255, 255, 0.1);
                color: white;
            }

            .comment-input::placeholder {
                color: rgba(255, 255, 255, 0.6);
            }

            .comment {
                margin-bottom: 0.5rem;
                padding: 0.5rem;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 8px;
                font-size: 0.9rem;
            }

            .comment-author {
                font-weight: bold;
                color: #a78bfa;
                margin-bottom: 0.25rem;
            }
        `;
        document.head.appendChild(style);
    };

    // Initialize floating animations
    addFloatingCSS();
    createFloatingAnimation();

    // Enhanced gallery item click handler
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            openModal(item, index);
        });

        // Add magnetic effect on mouse move
        item.addEventListener('mousemove', (e) => {
            if (isModalOpen) return;
            
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            const moveX = x * 0.1;
            const moveY = y * 0.1;
            
            item.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.02)`;
        });

        item.addEventListener('mouseleave', () => {
            if (isModalOpen) return;
            item.style.transform = '';
        });
    });

    // Open modal with enhanced animations
    const openModal = (clickedItem, index) => {
        if (isModalOpen) {
            closeModal();
            return;
        }

        isModalOpen = true;
        currentImageIndex = index;
        
        const img = clickedItem.querySelector('img');
        modalImage.src = img.src;
        modalImage.alt = img.alt;
        
        // Initialize image data if needed
        initializeImageData(index);
        
        // Add dramatic opening animation
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Create ripple effect from click position  
        createRippleEffect(clickedItem);
        
        // Load interaction data for current image
        loadInteractionData(index);
        
        // Disable floating animations temporarily
        galleryItems.forEach(item => {
            item.style.animationPlayState = 'paused';
        });
    };

    // Load interaction data for specific image
    const loadInteractionData = (imageIndex) => {
        initializeImageData(imageIndex);
        const data = userInteractions[imageIndex];
        
        // Update like/dislike counts and states
        if (likeCount) likeCount.textContent = data.likes;
        if (dislikeCount) dislikeCount.textContent = data.dislikes;
        if (commentCount) commentCount.textContent = data.comments.length;
        
        // Update button states
        if (likeBtn) likeBtn.classList.toggle('active', data.userLiked);
        if (dislikeBtn) dislikeBtn.classList.toggle('active', data.userDisliked);
        
        // Load comments
        loadComments(imageIndex);
    };

    // Handle like/dislike functionality
    const handleLikeDislike = (action) => {
        const data = userInteractions[currentImageIndex];
        
        if (action === 'like') {
            if (data.userLiked) {
                // Unlike
                data.likes--;
                data.userLiked = false;
                if (likeBtn) likeBtn.classList.remove('active');
            } else {
                // Like
                data.likes++;
                data.userLiked = true;
                if (likeBtn) likeBtn.classList.add('active');
                
                // Remove dislike if present
                if (data.userDisliked) {
                    data.dislikes--;
                    data.userDisliked = false;
                    if (dislikeBtn) dislikeBtn.classList.remove('active');
                }
            }
        } else if (action === 'dislike') {
            if (data.userDisliked) {
                // Un-dislike
                data.dislikes--;
                data.userDisliked = false;
                if (dislikeBtn) dislikeBtn.classList.remove('active');
            } else {
                // Dislike
                data.dislikes++;
                data.userDisliked = true;
                if (dislikeBtn) dislikeBtn.classList.add('active');
                
                // Remove like if present
                if (data.userLiked) {
                    data.likes--;
                    data.userLiked = false;
                    if (likeBtn) likeBtn.classList.remove('active');
                }
            }
        }
        
        // Update display
        if (likeCount) likeCount.textContent = data.likes;
        if (dislikeCount) dislikeCount.textContent = data.dislikes;
        
        // Save to memory
        saveToMemory(userInteractions);
    };

    // Generate anonymous username
    const generateAnonymousName = () => {
        const adjectives = ['Cool', 'Happy', 'Bright', 'Swift', 'Bold', 'Smart', 'Kind', 'Wild', 'Free', 'Pure'];
        const nouns = ['Visitor', 'Guest', 'Explorer', 'Wanderer', 'Dreamer', 'Artist', 'Spirit', 'Soul', 'Mind', 'Heart'];
        const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
        const noun = nouns[Math.floor(Math.random() * nouns.length)];
        return `${adj}${noun}${Math.floor(Math.random() * 999)}`;
    };

    // Handle comment posting
    const postComment = () => {
        if (!commentInput || !commentInput.value.trim()) return;
        
        const commentText = commentInput.value.trim();
        const data = userInteractions[currentImageIndex];
        
        const comment = {
            id: Date.now(),
            author: generateAnonymousName(),
            text: commentText,
            timestamp: new Date().toLocaleString()
        };
        
        data.comments.push(comment);
        commentInput.value = '';
        
        // Update comment count
        if (commentCount) commentCount.textContent = data.comments.length;
        
        // Reload comments display
        loadComments(currentImageIndex);
        
        // Save to memory
        saveToMemory(userInteractions);
    };

    // Load comments for display
    const loadComments = (imageIndex) => {
        if (!commentsList) return;
        
        const data = userInteractions[imageIndex];
        commentsList.innerHTML = '';
        
        data.comments.forEach(comment => {
            const commentEl = document.createElement('div');
            commentEl.className = 'comment';
            commentEl.innerHTML = `
                <div class="comment-author">${comment.author}</div>
                <div class="comment-text">${comment.text}</div>
                <div class="comment-time" style="font-size: 0.8rem; opacity: 0.7; margin-top: 0.25rem;">${comment.timestamp}</div>
            `;
            commentsList.appendChild(commentEl);
        });
    };

    // Close modal with smooth animations
    const closeModal = () => {
        if (!isModalOpen) return;
        
        isModalOpen = false;
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Re-enable floating animations
        setTimeout(() => {
            galleryItems.forEach(item => {
                item.style.animationPlayState = 'running';
            });
        }, 500);
    };

    // Create ripple effect
    const createRippleEffect = (element) => {
        const ripple = document.createElement('div');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = '50%';
        ripple.style.top = '50%';
        ripple.style.transform = 'translate(-50%, -50%) scale(0)';
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, rgba(139, 92, 246, 0.2) 70%, transparent 100%)';
        ripple.style.pointerEvents = 'none';
        ripple.style.zIndex = '10';
        ripple.style.animation = 'rippleExpand 0.8s ease-out forwards';
        
        element.style.position = 'relative';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 800);
    };

    // Enhanced keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!isModalOpen) return;
        
        switch(e.key) {
            case 'Escape':
                closeModal();
                break;
            case 'ArrowLeft':
                navigateImage(-1);
                break;
            case 'ArrowRight':
                navigateImage(1);
                break;
        }
    });

    // Navigate between images
    const navigateImage = (direction) => {
        const newIndex = (currentImageIndex + direction + galleryItems.length) % galleryItems.length;
        currentImageIndex = newIndex;
        
        const newImg = galleryItems[newIndex].querySelector('img');
        
        // Add slide transition effect
        modalImage.style.opacity = '0';
        modalImage.style.transform = `translateX(${direction * 50}px) scale(0.9)`;
        
        setTimeout(() => {
            modalImage.src = newImg.src;
            modalImage.alt = newImg.alt;
            modalImage.style.transform = `translateX(${-direction * 50}px) scale(0.9)`;
            
            setTimeout(() => {
                modalImage.style.opacity = '1';
                modalImage.style.transform = 'translateX(0) scale(1)';
                
                // Load interaction data for new image
                loadInteractionData(newIndex);
            }, 50);
        }, 150);
    };

    // Modal event listeners
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeModal();
        });
    }

    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', closeModal);
    }

    // Prevent modal content click from closing modal
    if (modal) {
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    }

    // Like/Dislike button event listeners
    if (likeBtn) {
        likeBtn.addEventListener('click', () => handleLikeDislike('like'));
    }

    if (dislikeBtn) {
        dislikeBtn.addEventListener('click', () => handleLikeDislike('dislike'));
    }

    // Comment functionality
    if (postCommentBtn) {
        postCommentBtn.addEventListener('click', postComment);
    }

    if (commentInput) {
        commentInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                postComment();
            }
        });
    }

    // Toggle comments visibility
    if (toggleCommentsBtn) {
        toggleCommentsBtn.addEventListener('click', () => {
            const commentsSection = document.querySelector('.comments-section');
            if (commentsSection) {
                commentsSection.style.display = commentsSection.style.display === 'none' ? 'block' : 'none';
            }
        });
    }

    // Mobile menu functionality
    if (menuIcon && navbar) {
        menuIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            navbar.classList.toggle('active');
            menuIcon.classList.toggle('bx-x');
            menuIcon.classList.toggle('bx-menu');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navbar.contains(e.target) && !menuIcon.contains(e.target)) {
                navbar.classList.remove('active');
                menuIcon.classList.remove('bx-x');
                menuIcon.classList.add('bx-menu');
            }
        });

        // Close menu when clicking on nav links
        navbar.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navbar.classList.remove('active');
                menuIcon.classList.remove('bx-x');
                menuIcon.classList.add('bx-menu');
            });
        });
    }

    // Smooth scroll reveal animation for gallery items
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationDelay = '0s';
                entry.target.classList.add('reveal');
            }
        });
    }, observerOptions);

    galleryItems.forEach(item => {
        observer.observe(item);
    });

    // Add parallax effect to background
    let ticking = false;
    
    const updateParallax = () => {
        const scrolled = window.pageYOffset;
        const parallax = document.body;
        const speed = scrolled * 0.2;
        
        parallax.style.setProperty('--scroll', `${speed}px`);
        ticking = false;
    };

    const requestParallaxUpdate = () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    };

    window.addEventListener('scroll', requestParallaxUpdate);

    // Add performance optimization
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
        // Disable complex animations for users who prefer reduced motion
        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        `;
        document.head.appendChild(styleSheet);
    }

    // Add touch gestures for mobile
    let touchStartX = 0;
    let touchStartY = 0;

    if (modal) {
        modal.addEventListener('touchstart', (e) => {
            if (!isModalOpen) return;
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        modal.addEventListener('touchend', (e) => {
            if (!isModalOpen) return;
            
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;
            
            // Swipe left/right to navigate
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    navigateImage(-1); // Swipe right = previous
                } else {
                    navigateImage(1);  // Swipe left = next
                }
            }
            
            // Swipe down to close
            if (deltaY > 100 && Math.abs(deltaX) < 50) {
                closeModal();
            }
        }, { passive: true });
    }

    // Add loading states for images
    galleryItems.forEach(item => {
        const img = item.querySelector('img');
        
        img.addEventListener('load', () => {
            item.classList.add('loaded');
        });
        
        img.addEventListener('error', () => {
            item.classList.add('error');
        });
    });

    // Initialize image data for all gallery items
    galleryItems.forEach((item, index) => {
        initializeImageData(index);
    });

    // Add resize handler for responsive behavior
    const handleResize = () => {
        // Recalculate floating animations on resize
        if (window.innerWidth <= 768) {
            // Reduce animations on mobile for better performance
            galleryItems.forEach(item => {
                item.style.setProperty('--float-distance', '3px');
                item.style.setProperty('--float-duration', '8s');
            });
        }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call once on load

    // Add error handling for missing elements
    const checkRequiredElements = () => {
        const requiredElements = {
            modal: 'imageModal',
            modalImage: 'modalImage'
        };

        for (const [key, id] of Object.entries(requiredElements)) {
            if (!document.getElementById(id)) {
                console.warn(`⚠️ Required element #${id} not found. Some functionality may not work.`);
            }
        }
    };

    checkRequiredElements();

    // Initialize performance monitoring
    const monitorPerformance = () => {
        if ('performance' in window) {
            const startTime = performance.now();
            
            setTimeout(() => {
                const endTime = performance.now();
                const initTime = endTime - startTime;
                console.log(`⚡ Gallery initialization completed in ${initTime.toFixed(2)}ms`);
            }, 100);
        }
    };

    monitorPerformance();

    // Initialize
    console.log('🎨 Modern Gallery initialized with', galleryItems.length, 'images');
    console.log('👤 User ID:', userId);
    console.log('💾 Interaction data loaded for', Object.keys(userInteractions).length, 'images');
    
    // Log feature availability
    const features = [];
    if (likeBtn && dislikeBtn) features.push('Like/Dislike');
    if (commentInput && postCommentBtn) features.push('Comments');
    if (menuIcon && navbar) features.push('Mobile Menu');
    if (features.length > 0) {
        console.log('✨ Available features:', features.join(', '));
    }
    
    console.log('🚀 Gallery ready for interaction!');
});