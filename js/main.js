/**
 * Main Application Logic & Interactivity
 * Sangramjeet Ghosh Portfolio — Redesign Experience
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    /* ========================================================
       1. NAVBAR & MOBILE MENU
       ======================================================== */
    const menuIcon = document.querySelector('#menu-icon');
    const navbar = document.querySelector('.navbar');
    const header = document.querySelector('.header');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('header nav a');

    if (menuIcon && navbar) {
        menuIcon.addEventListener('click', () => {
            menuIcon.classList.toggle('bx-x');
            navbar.classList.toggle('active');
        });
    }

    // Scroll Active Link & Sticky Header
    window.addEventListener('scroll', () => {
        const top = window.scrollY;

        // Sticky Navbar
        if (header) {
            header.classList.toggle('sticky', top > 80);
        }

        // Section Highlighting
        sections.forEach(sec => {
            const offset = sec.offsetTop - 180;
            const height = sec.offsetHeight;
            const id = sec.getAttribute('id');

            if (top >= offset && top < offset + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    const activeAnchor = document.querySelector(`header nav a[href*="${id}"]`);
                    if (activeAnchor) activeAnchor.classList.add('active');
                });
            }
        });

        // Close mobile menu on scroll
        if (menuIcon && navbar) {
            menuIcon.classList.remove('bx-x');
            navbar.classList.remove('active');
        }

        // Update Journey Timeline Progress
        updateJourneyProgress();
    }, { passive: true });

    /* ========================================================
       3. RESUME DROPDOWN & BATCH DOWNLOAD
       ======================================================== */
    window.toggleResumeMenu = function() {
        const dropdown = document.querySelector('.resume-dropdown');
        if (dropdown) dropdown.classList.toggle('open');
    };

    document.addEventListener('click', (e) => {
        const dropdown = document.querySelector('.resume-dropdown');
        if (dropdown && !dropdown.contains(e.target)) {
            dropdown.classList.remove('open');
        }
    });

    window.downloadAllResumes = function() {
        const resumes = [
            '../resumes/Sangramjeet Ghosh - AI Software Systems.pdf',
            '../resumes/Sangramjeet Ghosh - Full Stack AI.pdf',
            '../resumes/Sangramjeet Ghosh - CV.pdf'
        ];
        resumes.forEach((url, i) => {
            setTimeout(() => {
                const a = document.createElement('a');
                a.href = url;
                a.download = url.split('/').pop();
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }, i * 400);
        });

        const dropdown = document.querySelector('.resume-dropdown');
        if (dropdown) dropdown.classList.remove('open');
    };

    /* ========================================================
       4. INTERACTIVE AI ARCHITECTURE BLUEPRINT
       ======================================================== */
    const ARCH_NODES = {
        input: {
            title: "01. Multimodal Streaming Ingestion",
            desc: "Captures bidirectional PCM 16kHz audio chunks, live video frames from user webcams, or structured text payloads. Performs low-latency buffering and audio normalisation before dispatching.",
            latency: "< 30 ms",
            tech: "Web Audio API / Canvas / WebSockets",
            reliability: "99.9% Stream Recovery",
            projects: ["SANA Multilingual Voice Butler", "Sebastian Autonomous Butler", "Voice Studio Pro"]
        },
        gateway: {
            title: "02. FastAPI Gateway & Load Router",
            desc: "High-throughput asynchronous ASGI microservice layer handling JWT authentication, IP-based sliding window rate-limiting, request validation via Pydantic, and SSE / WebSocket multiplexing.",
            latency: "< 15 ms",
            tech: "FastAPI / Uvicorn / Redis Cache",
            reliability: "Zero-Drop Queue Handlers",
            projects: ["Neuroviai API Microservices", "Background Remover API", "Virtual Therapist Backend"]
        },
        orchestrator: {
            title: "03. Agent Swarm & State Routing",
            desc: "Dynamic cyclic graph orchestrator built on LangGraph and LangChain. Evaluates user intent, branches execution across specialized sub-agents, and preserves conversation state with checkpoints.",
            latency: "< 80 ms routing",
            tech: "LangGraph / LangChain / Python 3.11",
            reliability: "Cyclic Loop Guardrails",
            projects: ["Virtual Therapist", "Sebastian Butler Agent", "AI Data Analysis Platform"]
        },
        memory: {
            title: "04. Vector Memory & Semantic Context",
            desc: "Hybrid retrieval pipeline combining dense vector embeddings with metadata filtering. Stores document chunks and historical conversational embeddings with pgvector and ChromaDB.",
            latency: "< 45 ms search",
            tech: "pgvector / PostgreSQL / ChromaDB",
            reliability: "Cosine Similarity Indexing",
            projects: ["Second Brain Knowledge Engine", "Neuroviai RAG Pipeline", "Sebastian Memory"]
        },
        inference: {
            title: "05. Multi-Tier Model Inferencing & Fallback",
            desc: "Intelligent multi-provider LLM tier. Prioritizes primary low-latency models (Gemini 2.5 Flash / Groq LLaMA) with automatic seamless fallback to GPT-4o or Claude 3.5 Sonnet on quota/rate spikes.",
            latency: "< 250 ms TTFT",
            tech: "Gemini Live API / Groq LPUs / OpenAI",
            reliability: "4-Tier Failover (99.5% SaaS Uptime)",
            projects: ["Neuroviai SaaS", "Multi-LLM Discussion Swarm", "SANA Voice Assistant"]
        },
        tools: {
            title: "06. Tool Sandbox & 110+ Integration APIs",
            desc: "Isolated execution sandbox allowing agents to query live external APIs, parse structured schemas, execute safe Python calculations, browse web pages with Playwright, and persist records.",
            latency: "< 120 ms exec",
            tech: "Playwright / 110+ REST APIs / Sandboxed Python",
            reliability: "Atomic Rollback Handlers",
            projects: ["Sebastian Digital Butler", "StreamRip Processor", "AI Data Analysis Platform"]
        },
        stream: {
            title: "07. Real-Time Streaming Client Dispatch",
            desc: "Broadcasts continuous token streams, audio buffers, or visual updates over secure full-duplex WebSockets. Renders sub-second audio synthesis via Edge TTS and real-time canvas visualizers.",
            latency: "< 20 ms delivery",
            tech: "WebSockets / Edge TTS / Three.js Canvas",
            reliability: "Auto-Reconnecting Sockets",
            projects: ["SANA Holographic Visualizer", "Second Brain Chat", "PixelPerfect WebSockets"]
        }
    };

    window.selectArchNode = function(nodeKey) {
        const data = ARCH_NODES[nodeKey];
        if (!data) return;

        // Update active class on nodes
        document.querySelectorAll('.blueprint-node').forEach(node => {
            node.classList.toggle('active', node.getAttribute('data-node') === nodeKey);
        });

        // Update inspector DOM
        const titleEl = document.getElementById('inspectorTitle');
        const descEl = document.getElementById('inspectorDesc');
        const latencyEl = document.getElementById('inspectorLatency');
        const techEl = document.getElementById('inspectorTech');
        const reliabilityEl = document.getElementById('inspectorReliability');
        const projectsEl = document.getElementById('inspectorProjects');

        if (titleEl) titleEl.textContent = data.title;
        if (descEl) descEl.textContent = data.desc;
        if (latencyEl) latencyEl.textContent = data.latency;
        if (techEl) techEl.textContent = data.tech;
        if (reliabilityEl) reliabilityEl.textContent = data.reliability;

        if (projectsEl) {
            projectsEl.innerHTML = data.projects.map(p => 
                `<span class="impl-tag"><i class="fas fa-link"></i> ${p}</span>`
            ).join('');
        }
    };

    /* ========================================================
       5. LIVING TECH CONSTELLATION FILTERING
       ======================================================== */
    window.filterTechCluster = function(category) {
        // Toggle active button
        document.querySelectorAll('.tech-tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-filter') === category);
        });

        // Filter cards
        const cards = document.querySelectorAll('.tech-card');
        cards.forEach(card => {
            const cat = card.getAttribute('data-cat');
            if (category === 'all' || cat === category) {
                card.style.display = 'flex';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            } else {
                card.style.display = 'none';
            }
        });
    };

    /* ========================================================
       6. SEBASTIAN AI COMMAND TERMINAL SIMULATOR
       ======================================================== */
    const terminalOutput = document.getElementById('terminalOutput');
    const terminalInput = document.getElementById('terminalInput');
    const terminalSubmit = document.getElementById('terminalSubmit');

    const COMMAND_REGISTRY = {
        help: `
Available System Commands:
  - <strong class="term-highlight">whoami</strong>     : Summary biography & engineering background
  - <strong class="term-highlight">neurovia</strong>   : Inspect metrics & link to Neuroviai AI SaaS
  - <strong class="term-highlight">projects</strong>   : List flagship production & AI open-source systems
  - <strong class="term-highlight">skills</strong>     : Print technical skills & core architectural domains
  - <strong class="term-highlight">resume</strong>     : Download official engineering resumes & CV
  - <strong class="term-highlight">contact</strong>    : Direct channels to reach Sangramjeet Ghosh
  - <strong class="term-highlight">clear</strong>      : Clear terminal log output
        `,
        whoami: `
<strong>Sangramjeet Ghosh (Jeet)</strong>
Role: AI/ML Systems Engineer & Full-Stack Architect
Location: Hyderabad, India
Education: B.Tech in CSE (Artificial Intelligence & Machine Learning) at Malla Reddy University (CGPA 8.0)
Specialization: Production RAG, Multi-Agent Swarms, FastAPI Microservices, React 19, AWS Cloud
Founder: Neuroviai (<a href="https://neuroviai.dev/" target="_blank" class="term-highlight">neuroviai.dev</a>)
Author: <em>"The Future of Touchless Technology"</em> (Amazon KDP)
        `,
        neurovia: `
<strong>🌟 Neurovia AI — AI Content Automation Platform</strong>
Status: LIVE & OPERATIONAL (99.5% Uptime)
URL: <a href="https://neuroviai.dev/" target="_blank" class="term-highlight">https://neuroviai.dev/</a>
Architecture: 6 FastAPI Microservices, 4-Tier LLM Fallback (GPT-4 / Gemini / Claude / LLaMA), Razorpay Payments
Metrics: 50+ Daily Active Users
        `,
        projects: `
<strong>Selected Production & Open-Source Projects:</strong>
  1. <a href="https://neuroviai.dev/" target="_blank" class="term-highlight">Neurovia AI</a> — AI Content Automation SaaS (Next.js, FastAPI, PostgreSQL)
  2. <a href="https://secondbraindev.vercel.app/" target="_blank" class="term-highlight">Second Brain</a> — AI Knowledge Base & RAG (Next.js 15, Prisma, Gemini 2.5)
  3. <a href="https://github.com/JeetInTech/SANA-MULTILINGUAL-AI-ASSISTANT" target="_blank" class="term-highlight">SANA Butler</a> — Real-Time Multilingual Voice Butler (React 19, Gemini Live, Canvas)
  4. <a href="https://craftingbrain.com/" target="_blank" class="term-highlight">Crafting Brain</a> — Creative Agency Web App (React 18, styled-components)
  5. <a href="https://github.com/JeetInTech/Virtual-Therapist---LangGraph-Agentic-AI-System" target="_blank" class="term-highlight">Virtual Therapist</a> — LangGraph Agentic System (FastAPI, ChromaDB)
        `,
        skills: `
<strong>Primary Technical Capabilities:</strong>
  • AI & ML: LangChain, LangGraph, Gemini Live API, PyTorch, RAG, pgvector, OpenCV, MediaPipe
  • Backend: Python, FastAPI, Node.js, Express, PostgreSQL, Prisma, Supabase, WebSockets
  • Frontend: React 19, Next.js 15, TypeScript, Tailwind CSS, Canvas API, Three.js
  • Cloud & Ops: AWS (Certified), Docker, Git, CI/CD Actions, Vercel, Render
        `,
        resume: `
Initiating resume download process...
  → <a href="../resumes/Sangramjeet-Ghosh-AI-Resume.pdf" download class="term-highlight">Download AI Engineer Resume (PDF)</a>
  → <a href="../resumes/Sangramjeet-Ghosh-Fullstack-Resume.pdf" download class="term-highlight">Download Full-Stack Resume (PDF)</a>
  → <a href="../resumes/Sangramjeet-Ghosh-CV.pdf" download class="term-highlight">Download Complete Master CV (PDF)</a>
        `,
        contact: `
<strong>Direct Transmission Channels:</strong>
  • Email: <a href="mailto:jeeth.enterprises108@gmail.com" class="term-highlight">jeeth.enterprises108@gmail.com</a>
  • LinkedIn: <a href="https://www.linkedin.com/in/sangramjeetghosh/" target="_blank" class="term-highlight">linkedin.com/in/sangramjeetghosh</a>
  • GitHub: <a href="https://github.com/JeetInTech" target="_blank" class="term-highlight">github.com/JeetInTech</a>
  • Location: Hyderabad, India (Open to Global Remote)
        `
    };

    window.executeTermCommand = function(rawCmd) {
        const cmd = rawCmd.trim().toLowerCase();
        if (!cmd) return;

        // Echo User Input Line
        const echoLine = document.createElement('div');
        echoLine.className = 'term-line';
        echoLine.innerHTML = `<span class="term-prompt">guest@sangramjeet:~$</span> <span class="term-command-echo">${rawCmd}</span>`;
        terminalOutput.appendChild(echoLine);

        if (cmd === 'clear') {
            terminalOutput.innerHTML = '';
        } else if (COMMAND_REGISTRY[cmd]) {
            const respLine = document.createElement('div');
            respLine.className = 'term-response';
            respLine.innerHTML = COMMAND_REGISTRY[cmd];
            terminalOutput.appendChild(respLine);
        } else {
            const errLine = document.createElement('div');
            errLine.className = 'term-response';
            errLine.innerHTML = `<span style="color: #ff5f56;">Command not recognized: '${rawCmd}'.</span> Type <strong class="term-highlight">help</strong> to view valid commands.`;
            terminalOutput.appendChild(errLine);
        }

        // Scroll to bottom
        terminalOutput.scrollTop = terminalOutput.scrollHeight;

        if (terminalInput) {
            terminalInput.value = '';
            terminalInput.focus();
        }
    };

    if (terminalInput) {
        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                executeTermCommand(terminalInput.value);
            }
        });
    }

    if (terminalSubmit && terminalInput) {
        terminalSubmit.addEventListener('click', () => {
            executeTermCommand(terminalInput.value);
        });
    }

    /* ========================================================
       7. DYNAMIC 3D CARD TILT EFFECT (GPU-Accelerated)
       ======================================================== */
    const tiltCards = document.querySelectorAll('[data-tilt]');
    
    // Only enable tilt on non-touch devices for silky smooth performance
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((y - centerY) / centerY) * -7;
                const rotateY = ((x - centerX) / centerX) * 7;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
            });
        });
    }

    /* ========================================================
       8. JOURNEY TIMELINE SCROLL PROGRESS
       ======================================================== */
    function updateJourneyProgress() {
        const journeySection = document.getElementById('journey');
        const progressLine = document.getElementById('journeyProgress');
        if (!journeySection || !progressLine) return;

        const rect = journeySection.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const totalHeight = journeySection.offsetHeight;

        if (rect.top <= windowHeight && rect.bottom >= 0) {
            const scrolled = Math.min(Math.max((windowHeight - rect.top) / (totalHeight + windowHeight * 0.5), 0), 1);
            progressLine.style.height = `${(scrolled * 100).toFixed(1)}%`;
        }
    }

    /* ========================================================
       9. LIVE STATS COUNTER ANIMATION
       ======================================================== */
    function animateCounters() {
        const counters = document.querySelectorAll('.counter-number');
        counters.forEach(counter => {
            const originalText = counter.textContent.trim();
            const target = parseInt(originalText, 10);
            if (isNaN(target)) return;

            const suffix = originalText.replace(/[0-9]/g, '');
            let current = 0;
            const increment = Math.max(Math.ceil(target / 25), 1);

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                counter.textContent = current + suffix;
            }, 45);
        });
    }

    // Trigger counters via IntersectionObserver
    const observerTarget = document.querySelector('.telemetry-matrix') || document.querySelector('.certi-counter');
    if (observerTarget) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        counterObserver.observe(observerTarget);
    }

    /* ========================================================
       10. SCROLLREVEAL ANIMATIONS
       ======================================================== */
    if (typeof ScrollReveal !== 'undefined') {
        const sr = ScrollReveal({
            distance: '50px',
            duration: 1000,
            delay: 150,
            reset: false
        });

        sr.reveal('.section-tag-wrap, .heading, .section-subtitle', { origin: 'top' });
        sr.reveal('.telemetry-card', { origin: 'bottom', interval: 100 });
        sr.reveal('.founder-spotlight-card', { origin: 'right', delay: 250 });
        sr.reveal('.journey-step', { origin: 'left', interval: 120 });
        sr.reveal('.blueprint-container', { origin: 'bottom', delay: 200 });
        sr.reveal('.tech-card', { origin: 'bottom', interval: 80 });
        sr.reveal('.project-deck', { origin: 'bottom', interval: 150 });
        sr.reveal('.terminal-wrapper', { origin: 'bottom', delay: 200 });
        sr.reveal('.achievement-card-new', { origin: 'bottom', interval: 100 });
        sr.reveal('.contact-console-grid', { origin: 'bottom', delay: 200 });
    }
});
