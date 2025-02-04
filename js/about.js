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
            localStorage.setItem('darkMode', 'enabled');
        } else {
            darkModeIcon.classList.replace('bx-sun', 'bx-moon');
            localStorage.setItem('darkMode', 'disabled');
        }
    }
  
    // Load Dark Mode Preference
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'enabled') {
        body.classList.add('dark-mode');
        darkModeIcon.classList.replace('bx-moon', 'bx-sun');
    } else {
        // Ensure moon icon is set if dark mode is disabled
        darkModeIcon.classList.replace('bx-sun', 'bx-moon');
        // If initial class was missing, add 'bx-moon'
        if (!darkModeIcon.classList.contains('bx-moon') && !darkModeIcon.classList.contains('bx-sun')) {
            darkModeIcon.classList.add('bx-moon');
        }
    }
  
    if (darkModeIcon) {
        darkModeIcon.addEventListener('click', toggleDarkMode);
    }
  
    // ... rest of your code (menu toggles, GSAP, etc.)


  darkModeIcon.addEventListener('click', toggleDarkMode);

  // 📱 Mobile Menu Toggle
  function toggleMenu(event) {
      event.stopPropagation(); // Prevents click from closing the menu immediately
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

  menuIcon.addEventListener('click', toggleMenu);

  // 🖥️ Close Menu on Window Resize
  window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
          navbar.classList.remove('active');
          menuIcon.classList.remove('bx-x');
      }
  });

  // 🚀 GSAP Animations
  gsap.to(".animate-title", {
      duration: 1,
      y: 0,
      opacity: 1,
      ease: "power4.out"
  });

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
});
