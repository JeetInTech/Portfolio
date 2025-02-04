// Animations using GSAP
document.addEventListener('DOMContentLoaded', () => {
  // Fade in page content
  gsap.from('.container', {
    opacity: 0,
    y: 20,
    duration: 0.5
  });

  // Animate skill bars
  if (document.querySelector('.skill-bars')) {
    gsap.from('.progress', {
      width: 0,
      duration: 1,
    stagger: 0.2
  });
}

  // Gallery functionality
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeLightbox = document.querySelector('.close-lightbox');

  if (galleryItems.length > 0) {
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const imgSrc = item.querySelector('img').src;
        lightboxImg.src = imgSrc;
        lightbox.classList.add('active');
      });
    });

    closeLightbox.addEventListener('click', () => {
      lightbox.classList.remove('active');
    });

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove('active');
      }
    });

    // Gallery filters
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');

        const category = btn.dataset.category;
        galleryItems.forEach(item => {
          if (category === 'all' || item.dataset.category === category) {
            gsap.to(item, { opacity: 1, scale: 1, duration: 0.3 });
            item.style.display = 'block';
          } else {
            gsap.to(item, { opacity: 0, scale: 0.8, duration: 0.3 });
            item.style.display = 'none';
          }
        });
      });
    });
  }

  // Animate cards on scroll
  const animateOnScroll = () => {
    const cards = document.querySelectorAll('.project-card, .experience-card, .education-card, .certification-card');
    cards.forEach(card => {
      const cardTop = card.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (cardTop < windowHeight * 0.8) {
        gsap.to(card, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out'
        });
      }
    });
  };

  // Set initial state for cards
  gsap.set('.project-card, .experience-card, .education-card, .certification-card', {
    opacity: 0,
    y: 50
  });

  // Add scroll event listener
  window.addEventListener('scroll', animateOnScroll);
  animateOnScroll(); // Run once on load
});

// Active nav link
const setActiveNavLink = () => {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
};

setActiveNavLink();

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      gsap.to(window, { scrollTo: target.offsetTop, duration: 1, ease: 'power2.inOut' });
    }
  });
});