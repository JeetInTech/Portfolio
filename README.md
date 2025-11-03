# 🚀 Sangramjeet Ghosh - Portfolio Website

A modern, responsive portfolio website showcasing my expertise in Data Science, AI/ML Engineering, and Full-Stack Development. Built with pure HTML, CSS, and JavaScript with a focus on performance, accessibility, and stunning visual effects.

## 🌐 Portfolio is Live!

Visit: [https://sangramjeet.me/](https://sangramjeet.me/) | [https://www.sangramjeet.me/](https://www.sangramjeet.me/)

Connect on LinkedIn: [https://www.linkedin.com/in/sangramjeetghosh/](https://www.linkedin.com/in/sangramjeetghosh/)

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge)](https://sangramjeet.me)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue?style=for-the-badge&logo=github)](https://github.com/JeetInTech/Portfolio)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/sangramjeetghosh/)

## ✨ Features

### 🎨 Design & UI/UX
- **Responsive Design** - Fully optimized for all devices (Desktop, Tablet, Mobile)
- **Dark/Light Mode** - Toggle between themes with smooth transitions
- **Modern Glassmorphism** - Beautiful glass effects with backdrop blur
- **Smooth Animations** - GSAP-powered animations and scroll effects
- **Interactive Elements** - Hover effects, transitions, and micro-interactions
- **Cyber-Techy Theme** - Neon colors and futuristic design in dark mode

### 📱 Responsive Breakpoints
- **Desktop** (1200px+) - Full-width layouts with multiple columns
- **Tablet** (768px - 1024px) - Optimized grid layouts
- **Mobile Landscape** (480px - 768px) - Single/dual column layouts
- **Mobile Portrait** (375px - 480px) - Stacked layouts
- **Small Devices** (320px - 375px) - Compact, touch-optimized design

### 🔧 Technical Features
- **Pure Vanilla JS** - No frameworks, lightweight and fast
- **CSS3 Animations** - Keyframes, transforms, and transitions
- **GSAP Integration** - Professional scroll-triggered animations
- **Swiper.js Slider** - Touch-enabled certificate carousel
- **Modal System** - Interactive project preview modals
- **Form Handling** - Contact form with validation
- **LocalStorage** - Theme preference persistence
- **Mobile Menu** - Hamburger navigation with smooth toggle

### 🎯 Sections

1. **Home**
   - Dynamic typing effect introduction
   - Rotating profession showcase
   - Social media links
   - CV download button

2. **About**
   - Professional statistics cards
   - Detailed bio with journey highlights
   - Skills timeline
   - Education background
   - Contact information

3. **Services/Expertise**
   - Data Science capabilities
   - Software Engineering skills
   - Full-Stack Development expertise

4. **Skills**
   - Technical skills with proficiency levels
   - Tools & technologies
   - Expertise areas with detailed descriptions

5. **Projects**
   - Featured project showcases
   - Live preview iframes
   - Interactive modals
   - Technology tags
   - External links

6. **Insights/Certificates**
   - Swiper carousel
   - Certificate gallery
   - Professional achievements

7. **Gallery**
   - Photo grid layout
   - Lightbox modal
   - Responsive masonry design

8. **Contact**
   - Contact form with validation
   - Email integration
   - Social links

## 🛠️ Tech Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with custom properties
- **JavaScript (ES6+)** - Vanilla JS for interactivity

### Libraries & Plugins
- **[GSAP 3.12.4](https://greensock.com/gsap/)** - Animation library
- **[ScrollTrigger](https://greensock.com/scrolltrigger/)** - Scroll-based animations
- **[Swiper.js 9](https://swiperjs.com/)** - Touch slider
- **[Boxicons](https://boxicons.com/)** - Icon library
- **[Font Awesome 6.5.1](https://fontawesome.com/)** - Additional icons
- **[ScrollReveal](https://scrollrevealjs.org/)** - Scroll animations

### Fonts
- **[Poppins](https://fonts.google.com/specimen/Poppins)** - Primary font (300-900 weights)

## 📂 Project Structure

```
Portfolio/
├── index.html                 # Root entry point
├── app.js                     # Main application logic
├── package.json               # Project dependencies
├── .gitignore                 # Git ignore rules
├── README.md                  # Project documentation
│
├── html/                      # HTML pages
│   ├── index.html            # Main home page
│   ├── about.html            # About page
│   ├── skills.html           # Skills showcase
│   ├── gallery.html          # Photo gallery
│   └── projects.html         # Projects page
│
├── css/                       # Stylesheets
│   ├── main.css              # Home page styles
│   ├── about.css             # About page styles
│   ├── skills.css            # Skills page styles
│   ├── gallery.css           # Gallery page styles
│   ├── style.css             # Global styles
│   └── responsive.css        # Media queries
│
├── js/                        # JavaScript files
│   ├── main.js               # Home page scripts
│   ├── about.js              # About page scripts
│   ├── skills.js             # Skills page scripts
│   ├── gallery.js            # Gallery page scripts
│   ├── contact.js            # Contact form handler
│   ├── download.js           # CV download script
│   └── projects.js           # Projects modal logic
│
├── assets/                    # Legacy assets
│   ├── css/                  # Additional stylesheets
│   ├── js/                   # Additional scripts
│   ├── images/               # Image assets
│   └── fonts/                # Font files
│
└── images/                    # Main images directory
    ├── logo1.png             # Site logo/favicon
    ├── jjj.png               # Profile image
    ├── cer1.png - cer11.png  # Certificates
    └── gallery/              # Gallery photos
```

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Text editor (VS Code recommended)
- Basic knowledge of HTML, CSS, JavaScript

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/JeetInTech/Portfolio.git
   cd Portfolio
   ```

2. **Open in browser**
   ```bash
   # Option 1: Direct file opening
   open html/index.html
   
   # Option 2: Using Python server
   python -m http.server 8000
   
   # Option 3: Using Node.js server
   npx http-server
   ```

3. **Or use Live Server**
   - Install "Live Server" extension in VS Code
   - Right-click `html/index.html`
   - Select "Open with Live Server"

### Configuration

1. **Update Personal Information**
   - Edit `html/index.html` - Update name, bio, social links
   - Edit `html/about.html` - Update statistics, education, timeline
   - Edit `html/skills.html` - Update skills, tools, expertise

2. **Add Your Images**
   - Replace `images/jjj.png` with your profile photo
   - Replace `images/logo1.png` with your logo
   - Add certificates to `images/` folder

3. **Update Projects**
   - Edit project cards in `html/index.html`
   - Update iframe URLs with your live projects
   - Modify project descriptions and tags

4. **Configure Contact Form**
   - Update email settings in `js/contact.js`
   - Add your email service credentials
   - Test form submission

5. **Customize Colors**
   - Edit CSS variables in `:root` selector
   - Light theme: `css/main.css` (line 14-43)
   - Dark theme: `.dark-mode` selector (line 45-74)

## 🎨 Customization

### Color Scheme

**Light Mode (Regal Green Theme)**
```css
--bg-color: #f8f9f5;           /* Ivory background */
--text-color: #1e2930;         /* Deep slate gray */
--main-color: #1b5e20;         /* Royal emerald green */
--primary-gradient: linear-gradient(135deg, #1b5e20 0%, #43a047 100%);
```

**Dark Mode (Cyber Neon Theme)**
```css
--bg-color: #0a1410;           /* Near-black background */
--text-color: #e0e8e2;         /* Soft pearl gray */
--main-color: #2e8b57;         /* Deep sea green */
--neon-cyan: #00ff9d;          /* Neon cyan accent */
--neon-blue: #00d4ff;          /* Neon blue accent */
```

### Typography
- **Primary Font**: Poppins (300, 400, 500, 600, 700, 800, 900)
- **Base Size**: 62.5% (10px)
- **Scaling**: rem-based for responsive design

### Animations
- **Duration**: 0.3s - 0.8s
- **Easing**: cubic-bezier(0.4, 0, 0.2, 1)
- **Scroll Animations**: GSAP ScrollTrigger
- **Hover Effects**: CSS transitions

## 📱 Mobile Optimization

### Performance
- Optimized images (WebP format recommended)
- Lazy loading for images
- Minimal JavaScript execution
- Efficient CSS (no redundant rules)
- Hardware acceleration for animations

### Touch Interactions
- Minimum touch target: 44x44px
- Swipe gestures for sliders
- Touch-friendly navigation
- Haptic feedback considerations

### Accessibility
- Semantic HTML structure
- ARIA labels where needed
- Keyboard navigation support
- High contrast ratios (WCAG AA)
- Focus indicators
- Screen reader compatible

## 🔧 Browser Support

| Browser | Version |
|---------|---------|
| Chrome | 90+ ✅ |
| Firefox | 88+ ✅ |
| Safari | 14+ ✅ |
| Edge | 90+ ✅ |
| Opera | 76+ ✅ |
| Samsung Internet | 14+ ✅ |

## 📊 Performance Metrics

- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.5s
- **Total Bundle Size**: < 500KB
- **Mobile Optimized**: Yes ✅

## 🚧 Roadmap

- [ ] Add blog section
- [ ] Implement PWA features
- [ ] Add service worker for offline access
- [ ] Integrate CMS for easy content updates
- [ ] Add multi-language support
- [ ] Implement analytics dashboard
- [ ] Add testimonials section
- [ ] Create admin panel

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is **free to use** and does not contain any license. Feel free to use it for personal or commercial projects.

## 👤 Author

**Sangramjeet Ghosh**

- Portfolio: [https://sangramjeet.me/](https://sangramjeet.me/)
- LinkedIn: [Sangramjeet Ghosh](https://www.linkedin.com/in/sangramjeetghosh/)
- GitHub: [@JeetInTech](https://github.com/JeetInTech)
- Twitter: [@SangramJee97448](https://x.com/SangramJee97448)
- Instagram: [@officiallyjeet](https://www.instagram.com/officiallyjeet/)

## 🙏 Acknowledgments

- **GSAP** - For amazing animation library
- **Swiper.js** - For smooth touch sliders
- **Boxicons** - For beautiful icons
- **Font Awesome** - For additional icons
- **Google Fonts** - For Poppins font family
- **Unsplash** - For placeholder images

## 📞 Support

For support, email sangramjeetghosh@example.com or open an issue in the repository.

## ⭐ Show Your Support

Give a ⭐️ if you like this project!

---

<div align="center">

**[⬆ back to top](#-sangramjeet-ghosh---portfolio-website)**

Made with ❤️ by [Sangramjeet Ghosh](https://github.com/JeetInTech)

</div>
