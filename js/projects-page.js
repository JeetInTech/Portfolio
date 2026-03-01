/* ============================================================
   PROJECTS PAGE — JavaScript
   Tech stacks sourced from README files & package.json
   ============================================================ */
(function () {
    'use strict';

    /* ----------------------------------------------------------
       TECH COLOR MAP — brand colors for each technology
    ---------------------------------------------------------- */
    const TECH_COLORS = {
        /* Frameworks & Libraries */
        'React':        '#61dafb', 'React 18':     '#61dafb', 'React 19':     '#61dafb',
        'Next.js 14':   '#ffffff', 'Next.js 15':   '#ffffff',
        'Vue.js':       '#42b883', 'Angular':      '#dd0031',
        'Tailwind CSS': '#06B6D4', 'Tailwind CSS v4':'#06B6D4',
        'styled-components':'#DB7093',
        'Framer Motion':'#0055FF',
        'Radix UI':     '#9364F5', 'Zustand':      '#443E38',
        'Lucide React': '#F56565',
        'React Router': '#CA4245', 'React Router 7':'#CA4245',
        'React Helmet': '#5B4F9E',
        'Capacitor':    '#119EFF',

        /* Languages */
        'TypeScript':   '#3178c6', 'JavaScript':   '#f1e05a',
        'Python':       '#3572A5', 'HTML5':        '#E34F26', 'CSS3': '#1572B6',

        /* Backend */
        'FastAPI':      '#009688', 'Flask':        '#ffffff',
        'Node.js':      '#68a063', 'Express.js':   '#ffffff',

        /* Databases */
        'PostgreSQL':   '#336791', 'SQLite':       '#003B57',
        'Prisma':       '#2D3748', 'Supabase':     '#3ECF8E',
        'Firebase':     '#FFCA28', 'ChromaDB':     '#FF6B6B',
        'pgvector':     '#336791', 'IndexedDB':    '#E8A230',
        'better-sqlite3':'#003B57',

        /* AI / ML */
        'OpenAI':       '#412991',
        'Gemini AI':    '#4285F4', 'Gemini 2.5 Flash':'#4285F4',
        'Gemini Live':  '#4285F4', 'Google Gemini':'#4285F4',
        'Groq':         '#f55036', 'LangChain':    '#1C3C3C',
        'LangGraph':    '#1C3C3C',
        'Ollama':       '#ffffff', 'CLIP':         '#412991',
        'PyTorch':      '#EE4C2C', 'Vercel AI SDK':'#000000',
        'Natural.js':   '#3c873a', 'Sentiment.js': '#f55036',
        'Stockfish':    '#E8A230',

        /* Computer Vision */
        'OpenCV':       '#5C3EE8', 'MediaPipe':    '#0097A7',
        'face-recognition':'#FF6B6B',

        /* Voice / Audio */
        'faster-whisper':'#74AA9C', 'Edge TTS':    '#0078D4',
        'Web Audio API':'#9B59B6', 'Web Speech API':'#4285F4',

        /* Build & Tools */
        'Vite':         '#646CFF', 'Vite 5':       '#646CFF', 'Vite 6': '#646CFF', 'Vite 7': '#646CFF',
        'Docker':       '#2496ED', 'Electron':     '#47848F',
        'Webpack':      '#8DD6F9',
        'react-markdown':'#ffffff',

        /* Libraries */
        'Three.js':     '#000000', 'Canvas':       '#E44D26',
        'Pygame':       '#30A14E', 'python-chess': '#769656',
        'Playwright':   '#2EAD33', 'PyAutoGUI':    '#3572A5',
        'NumPy':        '#013243', 'SciPy':        '#8CAAE6',
        'Pillow':       '#3776AB', 'Watchdog':     '#3572A5',
        'Socket.IO':    '#010101', 'WebSockets':   '#FF6B00',
        'Axios':        '#5A29E4',
        'yt-dlp':       '#FF0000', 'FFmpeg':       '#007808',
        'Rich CLI':     '#ffffff', 'rembg':        '#FF6F61',
        'U²-Net':       '#FF6F61', 'Multer':       '#ffffff',
        'pdf-parse':    '#E44D26', 'Razorpay':     '#0C2451',
        'AWS':          '#FF9900', 'Helmet':       '#ffffff',
        'node-cache':   '#68a063', 'python-dotenv':'#ECD53F',

        /* Platforms */
        'PWA':          '#5A0FC8', 'Service Worker':'#FF6B00',
        'Netlify':      '#00C7B7', 'Vercel':       '#000000',
        'CSS Modules':  '#1572B6',
        'next-themes':  '#ffffff',

        /* Concepts */
        'Responsive':   '#10b981',
        'LDA':          '#1da1f2', 'NLP':          '#1da1f2',
        'Topic Modeling':'#1da1f2',
        'Hologram Viz': '#7F00FF',
        'Sentiment Analysis':'#11998e',
        'aiofiles':     '#3572A5'
    };

    /* ----------------------------------------------------------
       TECH CATEGORIES — for grouped visualization layout
    ---------------------------------------------------------- */
    function categorizeTech(name) {
        const front = ['React','React 18','React 19','Next.js 14','Next.js 15','Tailwind CSS','Tailwind CSS v4','styled-components','Framer Motion','Radix UI','Lucide React','React Router','React Router 7','React Helmet','Capacitor','Zustand','HTML5','CSS3','CSS Modules','next-themes','react-markdown','Responsive','Canvas','Three.js','Pygame','Electron','Vite','Vite 5','Vite 6','Vite 7'];
        const back  = ['FastAPI','Flask','Node.js','Express.js','WebSockets','Multer','Helmet','node-cache','Razorpay','AWS','Docker','aiofiles'];
        const data  = ['PostgreSQL','SQLite','better-sqlite3','Prisma','Supabase','Firebase','ChromaDB','pgvector','IndexedDB'];
        const ai    = ['OpenAI','Gemini AI','Gemini 2.5 Flash','Gemini Live','Google Gemini','Groq','LangChain','LangGraph','Ollama','CLIP','PyTorch','Vercel AI SDK','Natural.js','Sentiment.js','Stockfish','OpenCV','MediaPipe','face-recognition','faster-whisper','Edge TTS','Web Audio API','Web Speech API','LDA','NLP','Topic Modeling','Sentiment Analysis','rembg','U²-Net'];
        if (front.includes(name)) return 'Frontend';
        if (back.includes(name))  return 'Backend';
        if (data.includes(name))  return 'Database';
        if (ai.includes(name))    return 'AI / ML';
        return 'Tools';
    }

    const CATEGORY_COLORS = {
        'Frontend': '#61dafb',
        'Backend':  '#68a063',
        'Database': '#336791',
        'AI / ML':  '#f55036',
        'Tools':    '#f1e05a'
    };

    /* ----------------------------------------------------------
       PROJECT DATA — verified from README / package.json / requirements.txt
    ---------------------------------------------------------- */
    const PROJECTS = {
        'Neuroviai — AI Content Automation SaaS': {
            tech: ['Next.js 14','TypeScript','Tailwind CSS','Framer Motion','Radix UI','Zustand','FastAPI','PostgreSQL','OpenAI','Gemini AI'],
            github: '', url: 'https://neuroviai.com/'
        },
        'Crafting Brain — Digital Agency Platform': {
            tech: ['React 18','React Router','styled-components','Axios','Lucide React','React Helmet'],
            github: '', url: 'https://craftingbrain.com/'
        },
        'Second Brain — AI Knowledge Management': {
            tech: ['Next.js 15','TypeScript','Tailwind CSS v4','Framer Motion','PostgreSQL','Prisma','Gemini 2.5 Flash','Vercel AI SDK','Lucide React'],
            github: 'https://github.com/JeetInTech/Second-Brain',
            url: 'https://secondbraindev.vercel.app/'
        },
        'Ezz Notes — Smart Note Taking': {
            tech: ['HTML5','CSS3','JavaScript','IndexedDB','PWA','Service Worker'],
            github: 'https://github.com/JeetInTech/Jeet-Notes',
            url: 'https://ezznotes.netlify.app/'
        },
        'Sri Durga Electrical Works': {
            tech: ['React 19','Vite 7','React Router 7','Lucide React','CSS Modules','Supabase'],
            github: 'https://github.com/JeetInTech/E-Commerce-Website', url: ''
        },
        'SANA — Multilingual AI Voice Assistant': {
            tech: ['React 19','TypeScript','Vite 6','Gemini 2.5 Flash','Three.js','Canvas','Tailwind CSS','Web Audio API'],
            github: 'https://github.com/JeetInTech/SANA-MULTILINGUAL-AI-ASSISTANT', url: ''
        },
        'Sebastian — Autonomous AI Butler': {
            tech: ['Python','FastAPI','WebSockets','Gemini Live','Groq','Ollama','faster-whisper','Edge TTS','OpenCV','PostgreSQL','pgvector','Supabase','PyAutoGUI','Playwright'],
            github: '', url: ''
        },
        'Multi-LLM Group Discussion': {
            tech: ['Python','Ollama','Groq','Google Gemini','Rich CLI','python-dotenv'],
            github: 'https://github.com/JeetInTech/Multi-LLM-Discussion', url: ''
        },
        'Virtual Therapist — LangGraph Agentic AI': {
            tech: ['Python','FastAPI','LangGraph','LangChain','ChromaDB','Groq','Edge TTS','WebSockets','aiofiles'],
            github: 'https://github.com/JeetInTech/Virtual-Therapist---LangGraph-Agentic-AI-System', url: ''
        },
        'PixelPerfect — AI Game Screenshot Gallery': {
            tech: ['React 18','Vite 5','Tailwind CSS','Framer Motion','Socket.IO','Flask','CLIP','PyTorch','Watchdog'],
            github: 'https://github.com/JeetInTech/PixelPerfect-AI-Powered-Game-Screenshot-Gallery', url: ''
        },
        'AI Data Analysis Platform — Agent': {
            tech: ['Python','LangChain','Groq'],
            github: 'https://github.com/JeetInTech/AI-Data-Analysis-Platform---Agent', url: ''
        },
        'AI Chess': {
            tech: ['Python','Pygame','python-chess','Stockfish'],
            github: 'https://github.com/JeetInTech/AI-CHESS', url: ''
        },
        'Hand Gesture Keyboard & Mouse Control': {
            tech: ['Python','OpenCV','MediaPipe','face-recognition','PyAutoGUI','NumPy','SciPy'],
            github: 'https://github.com/JeetInTech/keyboard-and-Mouse-Cintrolls-With-hands-and-finger-Gestures', url: ''
        },
        'Facial Recognition Biometric Lock': {
            tech: ['Python','OpenCV','MediaPipe','PyAutoGUI','NumPy','Pillow'],
            github: 'https://github.com/JeetInTech/facial-recognition-security-biometric-lock', url: ''
        },
        'Twitter Trends Analysis — LDA': {
            tech: ['Node.js','Express.js','SQLite','Natural.js','Sentiment.js','Axios','node-cache','Helmet'],
            github: 'https://github.com/JeetInTech/Twitter-Trends-Analysis-', url: ''
        },
        'Voice Studio Pro — AI Voice Suite': {
            tech: ['React 19','TypeScript','Vite 6','Gemini AI'],
            github: '', url: ''
        },
        'StreamRip — YouTube Converter': {
            tech: ['React 18','Vite 5','Tailwind CSS','Electron','Flask','yt-dlp','FFmpeg','Express.js'],
            github: 'https://github.com/JeetInTech/Youtube-mp3-and-mp4-converter', url: ''
        },
        'Wallpaper Generator — AI Art': {
            tech: ['TypeScript','Vite','Gemini AI'],
            github: 'https://github.com/JeetInTech/Wallpaper-Generator', url: ''
        },
        'Profile Photo Headshot — AI': {
            tech: ['TypeScript','Vite','Gemini AI'],
            github: 'https://github.com/JeetInTech/Profile-Photo-Headshot', url: ''
        },
        'Background Remover — AI': {
            tech: ['Python','FastAPI','rembg','U²-Net','Docker','Pillow'],
            github: '', url: ''
        },
        'PDF Reader with Text-to-Speech': {
            tech: ['Node.js','Express.js','Multer','pdf-parse','HTML5','CSS3','JavaScript','Web Speech API'],
            github: '', url: ''
        },
        'Novel Reading Site': {
            tech: ['Next.js 15','TypeScript','Tailwind CSS','react-markdown'],
            github: 'https://github.com/JeetInTech/novel-reading-site', url: ''
        },
        'Holographic Body Movement Detection': {
            tech: ['Python','OpenCV','MediaPipe','NumPy'],
            github: 'https://github.com/JeetInTech/Hologram-and-body-movement-detection', url: ''
        },
        'On-Screen Virtual Keyboard': {
            tech: ['Python','OpenCV','MediaPipe','PyAutoGUI','NumPy','Pygame'],
            github: 'https://github.com/JeetInTech/On-Screen-Virtual-Keyboard', url: ''
        },
        'Scrolling Control with Hand Gestures': {
            tech: ['Python','OpenCV','MediaPipe','PyAutoGUI','NumPy'],
            github: 'https://github.com/JeetInTech/Scrolling-Control-With-hand-Gestures', url: ''
        },
        'Scientific Calculator': {
            tech: ['TypeScript','React','Vite','Tailwind CSS'],
            github: 'https://github.com/JeetInTech/Scientific-calculator', url: ''
        },
        'Jeet Notes': {
            tech: ['HTML5','CSS3','JavaScript','IndexedDB','PWA','Service Worker'],
            github: 'https://github.com/JeetInTech/Jeet-Notes',
            url: 'https://ezznotes.netlify.app/'
        }
    };

    /* ----------------------------------------------------------
       THEME TOGGLE
    ---------------------------------------------------------- */
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon   = document.getElementById('theme-icon');
    const saved       = localStorage.getItem('theme');

    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.body.classList.add('dark-mode');
        if (themeIcon) themeIcon.className = 'fas fa-sun';
    }
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            if (themeIcon) themeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
        });
    }

    /* ----------------------------------------------------------
       MOBILE MENU
    ---------------------------------------------------------- */
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mOverlay   = document.getElementById('mobile-menu-overlay');
    const closeBtn   = document.getElementById('mobile-menu-close');

    function openMenu() {
        mobileMenu?.classList.add('active');
        mOverlay?.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    function closeMenu() {
        mobileMenu?.classList.remove('active');
        mOverlay?.classList.remove('active');
        document.body.style.overflow = '';
    }
    menuToggle?.addEventListener('click', openMenu);
    closeBtn?.addEventListener('click', closeMenu);
    mOverlay?.addEventListener('click', closeMenu);
    document.querySelectorAll('.mobile-menu .nav-item').forEach(a => a.addEventListener('click', closeMenu));

    /* ----------------------------------------------------------
       FILTER SYSTEM
    ---------------------------------------------------------- */
    const filterBtns  = document.querySelectorAll('.filter-btn');
    const allCards    = document.querySelectorAll('.pcard');
    const categories  = document.querySelectorAll('.project-category');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;

            if (filter === 'all') {
                allCards.forEach(c => c.classList.remove('hidden'));
                categories.forEach(cat => { cat.style.display = ''; });
            } else {
                allCards.forEach(card => {
                    const cats = card.dataset.cats || '';
                    card.classList.toggle('hidden', !cats.includes(filter));
                });
                categories.forEach(cat => {
                    const visible = cat.querySelectorAll('.pcard:not(.hidden)');
                    cat.style.display = visible.length === 0 ? 'none' : '';
                });
            }
            setTimeout(revealVisible, 100);
        });
    });

    /* ----------------------------------------------------------
       SCROLL REVEAL (Intersection Observer)
    ---------------------------------------------------------- */
    function revealVisible() {
        const cards = document.querySelectorAll('.pcard:not(.hidden)');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    setTimeout(() => entry.target.classList.add('visible'), i * 60);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        cards.forEach(card => {
            if (!card.classList.contains('visible')) observer.observe(card);
        });
    }
    window.addEventListener('DOMContentLoaded', () => setTimeout(revealVisible, 200));

    /* ----------------------------------------------------------
       STAT COUNTER ANIMATION
    ---------------------------------------------------------- */
    function animateCounters() {
        document.querySelectorAll('.stat-value[data-count]').forEach(counter => {
            const target   = parseInt(counter.dataset.count, 10);
            const duration = 1800;
            const start    = performance.now();
            function tick(now) {
                const p = Math.min((now - start) / duration, 1);
                const ease = 1 - (1 - p) * (1 - p);
                counter.textContent = Math.round(ease * target);
                if (p < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
        });
    }
    const heroObs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) { animateCounters(); heroObs.disconnect(); }
        });
    }, { threshold: 0.3 });
    const statsBar = document.querySelector('.stats-bar');
    if (statsBar) heroObs.observe(statsBar);

    /* ----------------------------------------------------------
       BACK TO TOP
    ---------------------------------------------------------- */
    document.querySelector('.back-to-top')?.addEventListener('click', e => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ----------------------------------------------------------
       HEADER AUTO-HIDE + FILTER BAR SYNC
    ---------------------------------------------------------- */
    let lastScroll       = 0;
    const header         = document.querySelector('.header');
    const filterSection  = document.querySelector('.filter-section');

    if (header) header.style.transition = 'transform 0.3s ease, background 0.3s ease';

    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        const hidden = y > 100 && y > lastScroll;

        if (header) header.style.transform = hidden ? 'translateY(-100%)' : 'translateY(0)';
        if (filterSection) {
            if (hidden) filterSection.classList.add('header-hidden');
            else        filterSection.classList.remove('header-hidden');
        }
        lastScroll = y;
    }, { passive: true });

    /* ===========================================================
       TECH VISUALIZATION — Enhanced Network Graph Modal
    =========================================================== */
    const vizOverlay = document.getElementById('viz-overlay');
    const vizCanvas  = document.getElementById('viz-canvas');
    const vizTitle   = document.getElementById('viz-title');
    const vizStack   = document.getElementById('viz-stack');
    const vizActions = document.getElementById('viz-actions');
    const vizClose   = document.getElementById('viz-close');
    let   animFrame  = null;

    /* -- Close -- */
    function closeViz() {
        vizOverlay?.classList.remove('active');
        document.body.style.overflow = '';
        if (animFrame) { cancelAnimationFrame(animFrame); animFrame = null; }
    }
    vizClose?.addEventListener('click', closeViz);
    vizOverlay?.addEventListener('click', e => { if (e.target === vizOverlay) closeViz(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeViz(); });

    /* -- Open -- */
    function openViz(card) {
        const titleEl = card.querySelector('.pcard__title');
        if (!titleEl) return;
        const name = titleEl.textContent.trim();
        const proj = PROJECTS[name];
        if (!proj) return;

        vizTitle.textContent = name;

        // Tech node pills
        vizStack.innerHTML = '';
        proj.tech.forEach((t, i) => {
            const color = TECH_COLORS[t] || '#10b981';
            const cat   = categorizeTech(t);
            const node  = document.createElement('span');
            node.className = 'tech-node';
            node.style.setProperty('--i', i);
            node.innerHTML = `<span class="tech-node__dot" style="background:${color}"></span>${t}<span class="tech-node__cat">${cat}</span>`;
            vizStack.appendChild(node);
        });

        // Action links
        vizActions.innerHTML = '';
        if (proj.url) {
            vizActions.innerHTML += `<a href="${proj.url}" target="_blank" class="action-link primary"><i class="fas fa-external-link-alt"></i> Live Site</a>`;
        }
        if (proj.github) {
            vizActions.innerHTML += `<a href="${proj.github}" target="_blank" class="action-link secondary"><i class="fab fa-github"></i> Source Code</a>`;
        }
        if (!proj.url && !proj.github) {
            vizActions.innerHTML = `<span class="action-link secondary" style="opacity:0.5;cursor:default"><i class="fas fa-lock"></i> Private Repository</span>`;
        }

        vizOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        requestAnimationFrame(() => drawNetworkGraph(proj.tech, name));
    }

    /* -- Click handlers on card visuals -- */
    document.querySelectorAll('.pcard').forEach(card => {
        const visual = card.querySelector('.pcard__visual');
        if (visual) {
            visual.addEventListener('click', e => {
                if (e.target.tagName === 'IFRAME') return;
                openViz(card);
            });
        }
    });

    /* ===========================================================
       NETWORK GRAPH — Canvas Renderer (Enhanced)
       · Grouped by category (Frontend / Backend / DB / AI / Tools)
       · Gradient-filled nodes with glow halos
       · Animated data particles along connections
       · Floating ambient particles
       · Gentle idle bob per node
    =========================================================== */
    function drawNetworkGraph(techList, projectName) {
        if (!vizCanvas) return;
        const ctx = vizCanvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const wrap = vizCanvas.parentElement;
        const W    = wrap.clientWidth;
        const H    = wrap.clientHeight;
        vizCanvas.width  = W * dpr;
        vizCanvas.height = H * dpr;
        ctx.scale(dpr, dpr);

        const isDark = document.body.classList.contains('dark-mode');

        /* — Group techs by category — */
        const groups = {};
        techList.forEach(t => {
            const cat = categorizeTech(t);
            if (!groups[cat]) groups[cat] = [];
            groups[cat].push(t);
        });
        const catKeys = Object.keys(groups);

        /* — Layout: center hub + category arcs — */
        const cx = W / 2;
        const cy = H / 2;
        const hubR = Math.min(W, H) < 300 ? 22 : 30;
        const ringR = Math.min(W, H) * 0.34;
        const nodeR = Math.min(W, H) < 300 ? 16 : 20;

        // Center hub
        const nodes = [{
            x: cx, y: cy, targetX: cx, targetY: cy,
            r: hubR, label: 'CORE', color: '#10b981',
            isCenter: true, cat: 'hub', bobOffset: 0
        }];

        // Distribute categories around the circle
        let globalIdx = 0;
        const totalTech = techList.length;
        catKeys.forEach((cat, ci) => {
            const techs = groups[cat];
            const catColor = CATEGORY_COLORS[cat] || '#888';
            techs.forEach((t, ti) => {
                const angle = ((globalIdx + 0.5) / totalTech) * Math.PI * 2 - Math.PI / 2;
                const tx = cx + Math.cos(angle) * ringR;
                const ty = cy + Math.sin(angle) * ringR;
                nodes.push({
                    x: cx + (Math.random() - 0.5) * 30,
                    y: cy + (Math.random() - 0.5) * 30,
                    targetX: tx, targetY: ty,
                    r: nodeR,
                    label: t.length > 13 ? t.slice(0, 11) + '..' : t,
                    color: TECH_COLORS[t] || catColor,
                    isCenter: false,
                    cat: cat,
                    bobOffset: globalIdx * 0.7,
                    angle: angle
                });
                globalIdx++;
            });
        });

        /* — Connections: hub ↔ every node, plus intra-category arcs — */
        const connections = [];
        for (let i = 1; i < nodes.length; i++) {
            connections.push([0, i]);
        }
        // Connect adjacent nodes within the same category
        const catIndices = {};
        nodes.forEach((n, i) => {
            if (n.isCenter) return;
            if (!catIndices[n.cat]) catIndices[n.cat] = [];
            catIndices[n.cat].push(i);
        });
        Object.values(catIndices).forEach(indices => {
            for (let i = 0; i < indices.length - 1; i++) {
                connections.push([indices[i], indices[i + 1]]);
            }
            // Close the ring for categories with 3+ nodes
            if (indices.length >= 3) {
                connections.push([indices[indices.length - 1], indices[0]]);
            }
        });

        /* — Ambient particles — */
        const particles = Array.from({ length: 50 }, () => ({
            x: Math.random() * W,
            y: Math.random() * H,
            r: Math.random() * 1.5 + 0.4,
            speed: Math.random() * 0.25 + 0.05,
            angle: Math.random() * Math.PI * 2,
            opacity: Math.random() * 0.3 + 0.05
        }));

        /* — Data pulses flowing along hub connections — */
        const pulses = [];
        for (let i = 1; i < nodes.length; i++) {
            pulses.push({
                connIdx: i - 1, // index into connections (hub connections are first)
                t: Math.random(), // position 0..1 along line
                speed: 0.003 + Math.random() * 0.004,
                color: nodes[i].color,
                r: 3
            });
        }

        let frame = 0;
        const settleFrames = 70;

        function render() {
            frame++;
            ctx.clearRect(0, 0, W, H);

            const ease = Math.min(frame / settleFrames, 1);
            const easeVal = 1 - Math.pow(1 - ease, 3);

            /* — Update ambient particles — */
            particles.forEach(p => {
                p.x += Math.cos(p.angle) * p.speed;
                p.y += Math.sin(p.angle) * p.speed;
                if (p.x < -5) p.x = W + 5;
                if (p.x > W + 5) p.x = -5;
                if (p.y < -5) p.y = H + 5;
                if (p.y > H + 5) p.y = -5;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = isDark
                    ? `rgba(16,185,129,${p.opacity})`
                    : `rgba(16,185,129,${p.opacity * 0.6})`;
                ctx.fill();
            });

            /* — Update node positions — */
            nodes.forEach((n, i) => {
                if (n.isCenter) {
                    n.r = hubR + Math.sin(frame * 0.04) * 1.5;
                } else {
                    const bob = Math.sin(frame * 0.02 + n.bobOffset) * 3;
                    n.x = cx + (n.targetX - cx) * easeVal + bob * 0.5;
                    n.y = cy + (n.targetY - cy) * easeVal + Math.cos(frame * 0.018 + n.bobOffset) * 2;
                }
            });

            /* — Draw connections — */
            connections.forEach(([ai, bi], ci) => {
                const a = nodes[ai];
                const b = nodes[bi];
                const isHub = ai === 0;
                const lineAlpha = isHub ? 0.35 * easeVal : 0.08 * easeVal;

                if (isHub) {
                    const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
                    grad.addColorStop(0, hexToRgba(a.color, lineAlpha));
                    grad.addColorStop(1, hexToRgba(b.color, lineAlpha));
                    ctx.strokeStyle = grad;
                    ctx.lineWidth = 1.8;
                } else {
                    ctx.strokeStyle = isDark
                        ? `rgba(255,255,255,${lineAlpha})`
                        : `rgba(0,0,0,${lineAlpha})`;
                    ctx.lineWidth = 1;
                }

                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.stroke();
            });

            /* — Draw data pulses — */
            if (ease > 0.3) {
                pulses.forEach(pulse => {
                    pulse.t += pulse.speed;
                    if (pulse.t > 1) pulse.t -= 1;
                    const [ai, bi] = connections[pulse.connIdx];
                    const a = nodes[ai];
                    const b = nodes[bi];
                    const px = a.x + (b.x - a.x) * pulse.t;
                    const py = a.y + (b.y - a.y) * pulse.t;

                    // Glow
                    const pg = ctx.createRadialGradient(px, py, 0, px, py, 8);
                    pg.addColorStop(0, hexToRgba(pulse.color, 0.5));
                    pg.addColorStop(1, hexToRgba(pulse.color, 0));
                    ctx.beginPath();
                    ctx.arc(px, py, 8, 0, Math.PI * 2);
                    ctx.fillStyle = pg;
                    ctx.fill();

                    // Dot
                    ctx.beginPath();
                    ctx.arc(px, py, pulse.r, 0, Math.PI * 2);
                    ctx.fillStyle = hexToRgba(pulse.color, 0.9);
                    ctx.fill();
                });
            }

            /* — Draw category arc labels — */
            if (ease > 0.7) {
                const labelAlpha = Math.min((ease - 0.7) / 0.3, 1);
                ctx.save();
                ctx.globalAlpha = labelAlpha * 0.5;
                ctx.font = '600 9px "JetBrains Mono", monospace';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                catKeys.forEach(cat => {
                    const indices = catIndices[cat];
                    if (!indices || indices.length === 0) return;
                    // Average angle of the category nodes
                    let avgX = 0, avgY = 0;
                    indices.forEach(idx => { avgX += nodes[idx].x; avgY += nodes[idx].y; });
                    avgX /= indices.length;
                    avgY /= indices.length;
                    // Push label outward from center
                    const dx = avgX - cx;
                    const dy = avgY - cy;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const labelR = ringR + 28;
                    const lx = cx + (dx / dist) * labelR;
                    const ly = cy + (dy / dist) * labelR;

                    ctx.fillStyle = CATEGORY_COLORS[cat] || '#888';
                    ctx.fillText(cat.toUpperCase(), lx, ly);
                });
                ctx.restore();
            }

            /* — Draw nodes — */
            nodes.forEach(n => {
                // Outer glow halo
                const halo = ctx.createRadialGradient(n.x, n.y, n.r * 0.6, n.x, n.y, n.r * 3);
                halo.addColorStop(0, hexToRgba(n.color, 0.18));
                halo.addColorStop(1, hexToRgba(n.color, 0));
                ctx.beginPath();
                ctx.arc(n.x, n.y, n.r * 3, 0, Math.PI * 2);
                ctx.fillStyle = halo;
                ctx.fill();

                // Filled circle with gradient
                const ng = ctx.createRadialGradient(n.x - n.r * 0.3, n.y - n.r * 0.3, n.r * 0.1, n.x, n.y, n.r);
                ng.addColorStop(0, hexToRgba(n.color, isDark ? 0.35 : 0.28));
                ng.addColorStop(1, hexToRgba(n.color, isDark ? 0.12 : 0.08));
                ctx.beginPath();
                ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
                ctx.fillStyle = ng;
                ctx.fill();

                // Border ring
                ctx.beginPath();
                ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
                ctx.strokeStyle = hexToRgba(n.color, 0.7);
                ctx.lineWidth = 2;
                ctx.stroke();

                // Inner shine highlight
                ctx.beginPath();
                ctx.arc(n.x, n.y - n.r * 0.15, n.r * 0.65, 0, Math.PI * 2);
                ctx.fillStyle = hexToRgba('#ffffff', isDark ? 0.04 : 0.06);
                ctx.fill();

                // Label
                ctx.fillStyle = isDark ? '#e2e8f0' : '#1e293b';
                ctx.font = n.isCenter
                    ? `bold ${hubR < 25 ? 9 : 11}px "JetBrains Mono", monospace`
                    : `600 ${nodeR < 18 ? 8 : 9.5}px "Inter", sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(n.label, n.x, n.y);
            });

            animFrame = requestAnimationFrame(render);
        }

        if (animFrame) cancelAnimationFrame(animFrame);
        frame = 0;
        animFrame = requestAnimationFrame(render);
    }

    /* -- hex → rgba -- */
    function hexToRgba(hex, alpha) {
        if (!hex || hex[0] !== '#') return `rgba(100,100,100,${alpha})`;
        let r = 0, g = 0, b = 0;
        if (hex.length === 4) {
            r = parseInt(hex[1] + hex[1], 16);
            g = parseInt(hex[2] + hex[2], 16);
            b = parseInt(hex[3] + hex[3], 16);
        } else if (hex.length === 7) {
            r = parseInt(hex.slice(1, 3), 16);
            g = parseInt(hex.slice(3, 5), 16);
            b = parseInt(hex.slice(5, 7), 16);
        }
        return `rgba(${r},${g},${b},${alpha})`;
    }

})();
