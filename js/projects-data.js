/**
 * projects-data.js — Complete Engineering Systems & Projects Directory
 * Sangramjeet Ghosh Portfolio — Master Systems Inventory
 *
 * Covers all 40+ candidate-owned projects across 5 tiers:
 * 1. High-Impact Flagships (Commercial SaaS, Published Tools, Master Fleets)
 * 2. Production & Deployed Systems (Live platforms, Full-stack apps, Mobile)
 * 3. Autonomous AI & Agent Fleets (Multi-agent loops, MCP servers, Web automation)
 * 4. AI/ML Labs & Computer Vision (AutoML, Diffusion, Transformers, DSP, MediaPipe)
 * 5. Experimental Labs & Tooling (Tauri IDE, Extensions, CLI utilities, Prototypes)
 */

window.PROJECTS_DATA = [
    /* ========================================================
       TIER 1: HIGH-IMPACT FLAGSHIPS (7 Projects)
       ======================================================== */
    {
        id: "neurovia",
        title: "Neurovia AI",
        subtitle: "Multi-Service Content Automation SaaS",
        tier: "flagship",
        tierLabel: "⭐ High-Impact Flagship",
        status: "Live Commercial SaaS",
        statusType: "live",
        isPrivate: true,
        accessNote: "Proprietary Commercial Codebase (Founder Owned)",
        url: "https://neuroviai.dev/",
        displayUrl: "neuroviai.dev",
        screenshot: "https://api.microlink.io/?url=https%3A%2F%2Fneuroviai.dev%2F&screenshot=true&meta=false&embed=screenshot.url",
        tagline: "Next-gen multi-service content automation SaaS generating 1.2K+ monthly organic clicks with 99.7% uptime.",
        metrics: [
            { label: "Monthly Traffic", value: "1.2K+ Clicks" },
            { label: "Cold-Start Latency", value: "< 150 ms" },
            { label: "Microservices", value: "6 FastAPI" },
            { label: "Availability SLA", value: "99.7% Uptime" }
        ],
        desc: "Engineered and launched a production multi-tenant SaaS platform from scratch. Combines a Next.js 14 App Router frontend with 6 decoupled FastAPI microservices, an atomic token credit economy, and automated multi-platform social media syndication across LinkedIn, X/Twitter, Instagram, and WhatsApp.",
        architecture: [
            { step: "01. Client & Global State", detail: "Next.js 14 App Router, TypeScript, Zustand, and client-side ServerWarmer routine mitigating serverless cold starts." },
            { step: "02. API Gateway & Billing", detail: "JWT reverse proxy routing requests, enforcing rate limits (12k tokens/min), and processing Razorpay HMAC-SHA256 webhooks." },
            { step: "03. 4-Tier LLM Fallback", detail: "Resilient routing cascade: Gemini Pro → Groq Llama-3 → HuggingFace → Local Ollama with exponential backoff on HTTP 429." },
            { step: "04. Background Publishing", detail: "Celery workers backed by Redis task queues isolating Playwright browser publishers to prevent thread starvation." },
            { step: "05. Database & Security", detail: "PostgreSQL on Supabase with Row-Level Security (RLS) and atomic stored procedures eliminating double-charging." }
        ],
        challenges: "Mitigated severe serverless cold-start delays from 5,200ms down to sub-150ms through an asynchronous client heartbeat routine. Prevented concurrent race conditions during token checkout by executing atomic PostgreSQL stored procedures with idempotency keys.",
        stack: ["Next.js 14", "TypeScript", "FastAPI", "PostgreSQL", "Supabase RLS", "Celery", "Redis", "Razorpay", "Docker", "Playwright"]
    },
    {
        id: "memecredible",
        title: "Mr. Memecredible",
        subtitle: "Published VS Code Extension · 904 Installs",
        tier: "flagship",
        tierLabel: "⭐ High-Impact Flagship",
        status: "Published Developer Tool",
        statusType: "published",
        isPrivate: false,
        accessNote: "Published on Official Microsoft Visual Studio Marketplace",
        url: "https://marketplace.visualstudio.com/items?itemName=SangramjeetGhosh.mr-memecredible",
        displayUrl: "marketplace.visualstudio.com",
        screenshot: "https://api.microlink.io/?url=https%3A%2F%2Fmarketplace.visualstudio.com%2Fitems%3FitemName%3DSangramjeetGhosh.mr-memecredible&screenshot=true&meta=false&embed=screenshot.url",
        tagline: "High-performance developer productivity tool published on the Microsoft VS Code Marketplace with 904 active installs.",
        metrics: [
            { label: "Active Installs", value: "904 Devs" },
            { label: "Diagnostic Budget", value: "< 16 ms" },
            { label: "Meme Stages", value: "9 Uncanny" },
            { label: "Typing Latency", value: "0 ms Delay" }
        ],
        desc: "Built and published a viral developer productivity extension on the official Microsoft Visual Studio Marketplace. Monitors code diagnostic health in real-time, mapping syntax degradation and linter errors to a dynamic 9-stage uncanny meme meter in an isolated Webview panel.",
        architecture: [
            { step: "01. Language Server Hook", detail: "Subscribes to vscode.languages.onDidChangeDiagnostics events with debounced event throttling." },
            { step: "02. Stability Scoring Engine", detail: "Asynchronous calculation of syntax severity scores within a strict <16ms frame budget to prevent editor typing lag." },
            { step: "03. Bi-Directional IPC", detail: "Dispatches state updates across isolated Webview panels using postMessage protocol with zero main-thread blocking." },
            { step: "04. Webview Animation Core", detail: "Dynamic CSS3 keyframes and stateful meme rendering optimized for minimal memory footprint (<250KB bundle)." }
        ],
        challenges: "Executing language server diagnostic parsing in real-time without introducing typing latency or editor stutter. Solved by implementing an asynchronous debounced observer guaranteeing all calculations execute within a 16ms frame budget.",
        stack: ["TypeScript", "VS Code Extension API", "Node.js", "Webview IPC", "HTML5", "CSS3 Animations"]
    },
    {
        id: "sebastian",
        title: "Sebastian",
        subtitle: "Autonomous AI Operating System & Private Butler",
        tier: "flagship",
        tierLabel: "⭐ High-Impact Flagship",
        status: "Autonomous AI OS",
        statusType: "agent",
        isPrivate: true,
        accessNote: "Private Core Operating System (438+ Files, 25 Modules)",
        url: "https://github.com/JeetInTech",
        displayUrl: "github.com/JeetInTech",
        tagline: "Autonomous personal AI operating system featuring Gemini Live full-duplex voice, 92 tools, and sub-10ms vector memory.",
        metrics: [
            { label: "Registered Tools", value: "92 Tools" },
            { label: "Voice Latency", value: "~400 ms" },
            { label: "Memory Retrieval", value: "< 10 ms" },
            { label: "System Scope", value: "25 Modules" }
        ],
        desc: "Architected a comprehensive autonomous operating system (438+ core files, 25 specialized modules). Operates via full-duplex bidirectional streaming voice with barge-in interruption detection, orchestrating 92 deterministic tools across Green/Yellow permission gates with persistent pgvector memory.",
        architecture: [
            { step: "01. Bidirectional Voice Stream", detail: "Google Gemini Live bidirectional PCM 16kHz audio streaming with real-time barge-in cancellation and Kokoro TTS." },
            { step: "02. 3-Tier Security Gates", detail: "Deterministic permission gates (Green: read-only, Yellow: user consent, Red: blocked) governing 92 registered tools." },
            { step: "03. MCP Child Process Fleet", detail: "Dynamic npx Model Context Protocol servers managing GitHub, Playwright browser automation, and filesystem operations." },
            { step: "04. Vector RAG Memory Subsystem", detail: "PostgreSQL with pgvector cosine similarity search (sub-10ms) and turn-by-turn knowledge graph correlation." },
            { step: "05. Discord Bridge", detail: "Voice channel integration with real-time PCM audio resampling between Discord (48kHz stereo) and Gemini Live (16kHz mono)." }
        ],
        challenges: "Achieving seamless conversational voice interaction without awkward turn-taking pauses. Solved by integrating Gemini Live WebSocket streaming with sub-400ms turnaround and local audio DSP barge-in interruption detection.",
        stack: ["Python 3.12", "Gemini Live API", "Kokoro TTS", "PostgreSQL", "pgvector", "Model Context Protocol", "PyAudio", "FastAPI"]
    },
    {
        id: "genesis",
        title: "Genesis",
        subtitle: "Master Fleet Cockpit & Process Supervisor",
        tier: "flagship",
        tierLabel: "⭐ High-Impact Flagship",
        status: "Desktop Control Workstation",
        statusType: "production",
        isPrivate: true,
        accessNote: "Private Systems Architecture (PySide6 / Qt6 Native GUI)",
        url: "https://github.com/JeetInTech",
        displayUrl: "github.com/JeetInTech",
        tagline: "Desktop operations cockpit supervising a fleet of 10 background agents, featuring a 60,000-particle scalar field face at 60 FPS.",
        metrics: [
            { label: "Supervised Agents", value: "10 Agents" },
            { label: "Particle Density", value: "60k Particles" },
            { label: "GUI Performance", value: "60 FPS (CPU)" },
            { label: "Incident Recovery", value: "Automated" }
        ],
        desc: "Full-screen PySide6 (Qt6) desktop control workstation supervising 10 autonomous background agents. Features non-blocking psutil process-tree monitoring, an evidence-based entity topology graph, an automated regex incident remediation engine, and a 60,000-particle dynamic face rendered purely on CPU.",
        architecture: [
            { step: "01. Non-Blocking Supervisor", detail: "psutil process-tree tracking profiling real-time CPU and memory metrics across distributed background agents." },
            { step: "02. Evidence-Based Topology", detail: "Links independent agents only when shared entities correlate across disparate SQLite and JSON datastores." },
            { step: "03. Regex Incident Engine", detail: "Intercepts fatal crash logs and unhandled exceptions, executing automated auto-restart routines with exponential backoff." },
            { step: "04. Vectorized CPU Particle Face", detail: "60,000-particle scalar density field rendered at a locked 60 FPS using vectorized NumPy operations on CPU." },
            { step: "05. Fleet Audio Interface", detail: "faster-whisper STT and Kokoro neural voice answering fleet operational queries within 2 seconds of speech cessation." }
        ],
        challenges: "Rendering 60,000 dynamic visual particles at 60 FPS while concurrently polling 10 process trees without causing UI thread locks or frame drops on Windows. Solved using vectorized NumPy arrays and worker thread isolation.",
        stack: ["Python", "PySide6 (Qt6)", "psutil", "NumPy", "faster-whisper", "Kokoro TTS", "Windows Task Scheduler", "SQLite"]
    },
    {
        id: "video_editor",
        title: "AI Local Video Editor",
        subtitle: "Autonomous Vision-Guided Studio · 4,140 Files",
        tier: "flagship",
        tierLabel: "⭐ High-Impact Flagship",
        status: "Vision-Guided Media Studio",
        statusType: "production",
        isPrivate: true,
        accessNote: "Private Offline Studio Architecture (4,140 Files)",
        url: "https://github.com/JeetInTech",
        displayUrl: "github.com/JeetInTech",
        tagline: "100% offline vision-guided video editor using GPU speech transcription and a 4-signal heuristic scoring engine.",
        metrics: [
            { label: "Engine Scope", value: "4,140 Files" },
            { label: "Heuristic Signals", value: "4 Vectors" },
            { label: "Cloud Dependency", value: "0% Offline" },
            { label: "Manual Effort Cut", value: "80% Saved" }
        ],
        desc: "Engineered a heavyweight 100% offline automated video editing studio spanning 4,140 files. Ingests raw multi-gigabyte screen/camera recordings, runs local GPU speech transcription to cut dead air and retakes, and evaluates 4 weighted signals to intelligently place contextual memes, sound effects, and overlays.",
        architecture: [
            { step: "01. Ingestion & Audio Extraction", detail: "FFmpeg demuxing and local faster-whisper speech-to-text with word-level alignment." },
            { step: "02. Dead-Air & Retake Pruning", detail: "Analyzes audio RMS energy and speech redundancy, automatically excising filler words, silence, and false starts." },
            { step: "03. Computer Vision Frame Analysis", detail: "OpenCV visual layout analysis detecting speaker face positions, on-screen text coordinates, and gaze boundaries." },
            { step: "04. 4-Signal Scoring Engine", detail: "Evaluates Intent (0.35), Visual Clearance (0.30), Content Safety (0.20), and Asset Relevance (0.15) for overlay placement." },
            { step: "05. FFmpeg Headless Assembly", detail: "Multi-track compositing with dynamic burned-in subtitle animation and human veto review checkpoints." }
        ],
        challenges: "Placing contextual memes and audio stingers without obscuring the presenter's face or on-screen code. Solved by combining OpenCV facial bounding boxes with a 4-signal weighted mathematical scoring engine.",
        stack: ["Python", "faster-whisper GPU", "OpenCV", "FFmpeg", "Pydub", "MoviePy", "NumPy"]
    },
    {
        id: "job_agent",
        title: "Genesis: Job Application Agent",
        subtitle: "Autonomous Multi-Board Recruitment Bot",
        tier: "flagship",
        tierLabel: "⭐ High-Impact Flagship",
        status: "Autonomous Web Agent",
        statusType: "agent",
        isPrivate: true,
        accessNote: "Private Agent Implementation (1,400+ Files, 5 Portals)",
        url: "https://github.com/JeetInTech",
        displayUrl: "github.com/JeetInTech",
        tagline: "Autonomous recruitment agent that completed 460+ job applications across 5 portals with dynamic LaTeX tailoring.",
        metrics: [
            { label: "Submitted Apps", value: "460+ Applied" },
            { label: "Supported Portals", value: "5 Platforms" },
            { label: "PDF Compile Time", value: "1.8 Seconds" },
            { label: "Crash Frequency", value: "0 Crashes" }
        ],
        desc: "Production recruitment bot spanning 1,400+ files. Executes end-to-end job discovery, qualification extraction, dynamic LaTeX resume tailoring, and multi-step web form submission across Wellfound, Indeed, LinkedIn, Internshala, and Naukri with zero human intervention.",
        architecture: [
            { step: "01. Browser Session Reuse", detail: "Attaches to live browser sessions via Chrome DevTools Protocol (CDP) to bypass Cloudflare bot detection." },
            { step: "02. Semantic Job Parsing", detail: "Extracts job requirements, required tech stacks, and culture fit criteria using Groq Llama-3." },
            { step: "03. Dynamic LaTeX Tailoring", detail: "Synthesizes tailored resume bullet points and compiles fresh PDFs via local pdflatex in 1.8 seconds." },
            { step: "04. Multi-Step Form Automation", detail: "Drives Playwright to answer questionnaires, upload tailored PDFs, and navigate multi-step modal dialogues." },
            { step: "05. Audit Trail & Verification", detail: "SQLite finite state machine (applications.db) capturing full-page screenshot verification on every submission." }
        ],
        challenges: "Navigating complex dynamic modal forms with unpredictable input fields, file upload dialogs, and anti-bot measures. Solved by reusing authenticated Chrome CDP sessions and implementing fuzzy question-answering with Groq LLM.",
        stack: ["Python", "Playwright", "Chrome CDP", "Groq LLM", "SQLite", "pdflatex", "BeautifulSoup4", "Jinja2"]
    },
    {
        id: "molars",
        title: "Molars Nutrition Platform",
        subtitle: "Founding Engineer · Commercial Brand System",
        tier: "flagship",
        tierLabel: "⭐ High-Impact Flagship",
        status: "Production Startup Platform",
        statusType: "live",
        isPrivate: true,
        accessNote: "Commercial Startup Platform (Founding Engineer)",
        url: "https://molars.netlify.app/",
        displayUrl: "molars.netlify.app",
        tagline: "Commercial startup platform built with React 19, Next.js, and an interactive molecular canvas component.",
        metrics: [
            { label: "Lighthouse Score", value: "95+ Score" },
            { label: "Canvas Frame Rate", value: "60 FPS" },
            { label: "Frontend Stack", value: "React 19" },
            { label: "Infrastructure", value: "Serverless" }
        ],
        desc: "Architected and delivered the official brand and customer waitlist web platform as Founding Engineer for Molars Nutrition. Built with React 19, Next.js, and Tailwind CSS, featuring an interactive molecular canvas with physics-based cursor repulsion and serverless Netlify Functions.",
        architecture: [
            { step: "01. React 19 Modern Architecture", detail: "Next.js App Router with React 19 concurrent features, zero hydration mismatches, and optimized Core Web Vitals." },
            { step: "02. Molecular Physics Canvas", detail: "Custom HTML5 Canvas rendering interactive molecular nodes with spring physics and cursor repulsion at 60 FPS." },
            { step: "03. Serverless Ingestion", detail: "Netlify Functions (waitlist.mts) handling transactional email dispatch, client validation, and Supabase synchronization." },
            { step: "04. Responsive Design System", detail: "Mobile-first typography and accessible layouts delivering 95+ Google Lighthouse scores across all metrics." }
        ],
        challenges: "Rendering interactive molecular physics on mobile browsers without draining battery or causing scroll jank. Solved by writing an optimized requestAnimationFrame canvas loop with offscreen buffer caching.",
        stack: ["React 19", "Next.js", "TypeScript", "Tailwind CSS", "HTML5 Canvas", "Netlify Functions", "Supabase"]
    },

    /* ========================================================
       TIER 2: PRODUCTION SAAS & DEPLOYED SYSTEMS (8 Projects)
       ======================================================== */
    {
        id: "yt_auto",
        title: "Genesis: Video Pipeline (yt-auto)",
        subtitle: "Autonomous YouTube Shorts Engine · 2,420+ Files",
        tier: "production",
        tierLabel: "🚀 Production & SaaS",
        status: "Production Media Pipeline",
        statusType: "production",
        isPrivate: true,
        accessNote: "Private Automation Pipeline (2,420+ Files)",
        url: "https://github.com/JeetInTech",
        displayUrl: "github.com/JeetInTech",
        tagline: "End-to-end automated YouTube Shorts pipeline with multi-rule Script Police and automated video assembly.",
        metrics: [
            { label: "Files in Engine", value: "2,420+ Files" },
            { label: "Output Format", value: "9:16 Shorts" },
            { label: "Speech Engine", value: "Edge-TTS" },
            { label: "Upload Mode", value: "Autonomous" }
        ],
        desc: "Fully autonomous short-form media production pipeline. Ingests trend prompts, synthesizes 60-second viral scripts, enforces strict pacing via a multi-rule 'Script Police' engine, generates neural voiceovers, composites dynamic burned-in .ass subtitles, and automatically uploads to YouTube via OAuth 2.0.",
        architecture: [
            { step: "01. Viral Script Generation", detail: "Ollama / Groq LLMs generate high-retention English and Hinglish narrative scripts." },
            { step: "02. Script Police Filter", detail: "Multi-rule regex validator enforcing hook timing, word count budgets, and tone pacing." },
            { step: "03. Neural Audio Synthesis", detail: "Edge-TTS generating natural voiceovers with custom pitch, rate, and inflection adjustments." },
            { step: "04. FFmpeg Video Assembly", detail: "Stitches stock B-roll, background audio, and animated subtitles into 1080x1920 vertical video." },
            { step: "05. YouTube Data API v3", detail: "Automated video upload with scheduled release times, tags, and SEO description metadata." }
        ],
        challenges: "Ensuring video pace matches neural audio duration exactly without audio clipping or awkward video loops. Solved by calculating precise word-level duration stamps before invoking FFmpeg concat filters.",
        stack: ["Python", "Ollama", "Groq LLM", "Edge-TTS", "FFmpeg", "YouTube Data API v3", "OAuth 2.0"]
    },
    {
        id: "multiverse",
        title: "Realtime Multiverse Platform",
        subtitle: "Interactive Real-Time Community Web App",
        tier: "production",
        tierLabel: "🚀 Production & SaaS",
        status: "Live Web Application",
        statusType: "live",
        isPrivate: true,
        accessNote: "Private Next.js 16 / React 19 Codebase",
        url: "https://github.com/JeetInTech/U---enter-the-multiverse",
        displayUrl: "github.com/JeetInTech/U---enter-the-multiverse",
        tagline: "Bleeding-edge community web app with React 19, Motion 13 5-stage UI state machine, and Supabase Realtime.",
        metrics: [
            { label: "UI Framework", value: "React 19" },
            { label: "Bundler Engine", value: "Turbopack" },
            { label: "Presence Latency", value: "< 50 ms" },
            { label: "Animation Engine", value: "Motion 13" }
        ],
        desc: "Interactive community multiverse application built with Next.js 16 Turbopack and React 19. Features an animated 5-stage UI state machine (enter → forge → arrive → map → region) driven by Motion 13 layout transitions, live user presence tracking via Supabase Realtime WebSockets, and procedural Web Audio cues.",
        architecture: [
            { step: "01. Next.js 16 Turbopack Core", detail: "React 19 concurrent features with sub-second hot reloads and zero hydration mismatch." },
            { step: "02. 5-Stage Animated State Machine", detail: "Motion 13 layout transitions managing character creation, portal transit, and multiverse map exploration." },
            { step: "03. Supabase Realtime WebSockets", detail: "Broadcasting live user presence, cursor locations, and room state with sub-50ms latency." },
            { step: "04. Web Audio Procedural Sound", detail: "Synthesizes procedural audio feedback directly in the browser on user state transitions." }
        ],
        challenges: "Coordinating multi-user presence cursors and complex animated stage transitions simultaneously without UI thread jank. Solved by debouncing presence broadcasts and utilizing React 19 startTransition.",
        stack: ["Next.js 16", "React 19", "Tailwind CSS v4", "Motion 13", "Supabase Realtime", "WebSockets", "Web Audio API"]
    },
    {
        id: "secondbrain",
        title: "Second Brain",
        subtitle: "AI Knowledge Management Engine",
        tier: "production",
        tierLabel: "🚀 Production & SaaS",
        status: "Live Web Application",
        statusType: "live",
        isPrivate: false,
        accessNote: "Open Repository & Deployed Web App",
        url: "https://secondbraindev.vercel.app/",
        displayUrl: "secondbraindev.vercel.app",
        screenshot: "https://api.microlink.io/?url=https%3A%2F%2Fsecondbraindev.vercel.app%2F&screenshot=true&meta=false&embed=screenshot.url",
        tagline: "Semantic knowledge management engine with hybrid vector retrieval and conversational Q&A.",
        metrics: [
            { label: "Framework", value: "Next.js 15" },
            { label: "Retrieval", value: "Hybrid Vector" },
            { label: "LLM Model", value: "Gemini 2.5" },
            { label: "ORM", value: "Prisma" }
        ],
        desc: "AI-powered personal knowledge management engine. Ingests articles, markdown notes, and research papers, executing automated summarization, semantic vector search, and conversational Q&A over personal knowledge bases.",
        architecture: [
            { step: "01. Knowledge Ingestion", detail: "Next.js 15 App Router capturing unstructured notes, URLs, and document uploads." },
            { step: "02. Chunking & Embeddings", detail: "Recursive text chunking with Gemini vector embeddings stored in PostgreSQL via Prisma ORM." },
            { step: "03. Hybrid Retrieval", detail: "Combines dense vector similarity with keyword metadata filtering for high-precision retrieval." },
            { step: "04. Conversational Synthesis", detail: "Grounded answer generation using Gemini 2.5 Flash with direct citation anchors." }
        ],
        challenges: "Preventing hallucinated responses over user notes. Solved by implementing strict cosine threshold gates and grounded citation injection.",
        stack: ["Next.js 15", "TypeScript", "Prisma ORM", "PostgreSQL", "Gemini 2.5 Flash", "Tailwind CSS"]
    },
    {
        id: "solo_leveling",
        title: "Solo Leveling Mobile App",
        subtitle: "Gamified Fitness & Habit Mobile Platform",
        tier: "production",
        tierLabel: "🚀 Production & SaaS",
        status: "Mobile Application",
        statusType: "production",
        isPrivate: true,
        accessNote: "Private React Native / Kotlin Architecture",
        url: "https://github.com/JeetInTech",
        displayUrl: "github.com/JeetInTech",
        tagline: "Gamified RPG-style habit and fitness tracking app built with React Native, Kotlin native bridge, and Celery/Redis.",
        metrics: [
            { label: "Mobile Stack", value: "React Native" },
            { label: "Native Bridge", value: "Android Kotlin" },
            { label: "Queue Engine", value: "Celery / Redis" },
            { label: "Storage", value: "SQLite Offline" }
        ],
        desc: "Gamified mobile productivity application turning real-world daily habits and workouts into an RPG leveling system. Implements custom native Android Kotlin bridges for pedometer sensor tracking, background state sync with Celery/Redis, and offline SQLite caching.",
        architecture: [
            { step: "01. Mobile Client", detail: "React Native and Expo with custom animated character HUD and quest completion effects." },
            { step: "02. Native Android Bridge", detail: "Custom Kotlin module tapping into hardware step counters and battery-efficient sensor polling." },
            { step: "03. Asynchronous Backend", detail: "FastAPI server with Celery and Redis managing leaderboard rankings and daily quest resets." },
            { step: "04. Offline-First Storage", detail: "SQLite local database synchronizing state opportunistically upon network re-establishment." }
        ],
        challenges: "Accurately tracking physical step counts in the background without aggressive Android battery killer termination. Solved by developing an Android Foreground Service in Kotlin with custom notification channels.",
        stack: ["React Native", "Expo", "Kotlin", "FastAPI", "Celery", "Redis", "SQLite"]
    },
    {
        id: "jobpulse",
        title: "Genesis: JobPulse",
        subtitle: "Recruitment Email Intelligence & FastAPI Service",
        tier: "production",
        tierLabel: "🚀 Production & SaaS",
        status: "Production Backend Service",
        statusType: "production",
        isPrivate: true,
        accessNote: "Private Genesis Agent Infrastructure",
        url: "https://github.com/JeetInTech",
        displayUrl: "github.com/JeetInTech",
        tagline: "Asynchronous backend service ingesting and classifying recruitment communications via Gmail API and Groq LLM.",
        metrics: [
            { label: "Classification", value: "98% Accuracy" },
            { label: "Service Protocol", value: "FastAPI REST" },
            { label: "Ingestion", value: "Gmail OAuth" },
            { label: "Thread Reconstruct", value: "RFC 822" }
        ],
        desc: "Continuous recruitment email intelligence service. Interacts with the Google Gmail API via OAuth 2.0 to reconstruct multi-message email threads, classify interview invites, online assessments, and rejections with Groq LLM, and expose an internal FastAPI REST service.",
        architecture: [
            { step: "01. Gmail API Polling", detail: "Asynchronous background cron loop fetching unread recruitment communications via OAuth 2.0." },
            { step: "02. RFC 822 Thread Reconstruction", detail: "Correlates inbound replies across Message-ID and In-Reply-To headers to rebuild full conversation history." },
            { step: "03. Groq LLM Classification", detail: "Classifies email intent into INTERVIEW, OA, REJECTION, or OFFER with structured Pydantic v2 schemas." },
            { step: "04. FastAPI REST Gateway", detail: "Exposes endpoints (cli.py serve --port 8000) for querying application status and interview dates." }
        ],
        challenges: "Handling rate-limited Gmail API quotas during inbox sweeps. Solved by implementing incremental token synchronization and RFC 822 thread grouping.",
        stack: ["Python", "FastAPI", "Gmail API", "OAuth 2.0", "Groq LLM", "Pydantic v2", "SQLite"]
    },
    {
        id: "aiexamtool",
        title: "AIExamTool",
        subtitle: "Serverless Exam Evaluation Platform · Final Year Project",
        tier: "production",
        tierLabel: "🚀 Production & SaaS",
        status: "Serverless Academic Platform",
        statusType: "production",
        isPrivate: true,
        accessNote: "Final Year Academic Project (AWS Serverless Architecture)",
        url: "https://github.com/JeetInTech",
        displayUrl: "github.com/JeetInTech",
        tagline: "AWS serverless academic platform with FAISS semantic question generation and automated assignment grading.",
        metrics: [
            { label: "Cloud Compute", value: "AWS Lambda" },
            { label: "Database", value: "DynamoDB" },
            { label: "Retrieval", value: "FAISS Vector" },
            { label: "User Roles", value: "3 Scoped Panels" }
        ],
        desc: "Serverless academic evaluation platform engineered as university final-year project. Deploys three role-scoped portals (student, faculty, department head) on AWS Lambda and Amazon DynamoDB, executing automated semantic assignment grading and PDF report generation.",
        architecture: [
            { step: "01. AWS Serverless Core", detail: "Flask microservices packaged into AWS Lambda handlers fronted by Amazon API Gateway." },
            { step: "02. Course Syllabus RAG", detail: "FAISS vector database chunking lecture notes to ground dynamic question synthesis." },
            { step: "03. Automated Evaluation", detail: "Compares student submissions against reference criteria using semantic embeddings and OpenAI API." },
            { step: "04. Dynamic Reporting", detail: "ReportLab engine generating automated performance report PDFs emailed directly to students." }
        ],
        challenges: "Scaling serverless execution to evaluate multi-page document submissions within AWS Lambda 29-second API Gateway timeout limits. Solved by decoupling evaluation into asynchronous worker jobs.",
        stack: ["Python", "Flask", "AWS Lambda", "DynamoDB", "FAISS", "OpenAI API", "ReportLab", "React"]
    },
    {
        id: "crafting",
        title: "CraftingBrain",
        subtitle: "Creative Agency Platform · Live Client System",
        tier: "production",
        tierLabel: "🚀 Production & SaaS",
        status: "Live Client Platform",
        statusType: "live",
        isPrivate: false,
        accessNote: "Commercial Client Web Platform",
        url: "https://craftingbrain.com/",
        displayUrl: "craftingbrain.com",
        screenshot: "https://api.microlink.io/?url=https%3A%2F%2Fcraftingbrain.com%2F&screenshot=true&meta=false&embed=screenshot.url",
        tagline: "Commercial agency platform with fluid CSS animations, optimized responsive layouts, and zero downtime.",
        metrics: [
            { label: "Role", value: "Lead Frontend" },
            { label: "Performance", value: "60 FPS Anim" },
            { label: "Status", value: "Live Production" },
            { label: "Stack", value: "React 18" }
        ],
        desc: "Commercial web platform designed and built for CraftingBrain creative agency. Features bespoke interactive animations, custom styled-components, and optimized responsive layouts across the full device breakpoint range.",
        architecture: [
            { step: "01. Component Architecture", detail: "React 18 single-page application structured with reusable styled-components." },
            { step: "02. Animation Engine", detail: "Hardware-accelerated CSS transforms and intersection observers delivering fluid 60 FPS transitions." },
            { step: "03. Performance Optimization", detail: "Code-split route chunks, responsive WebP image serving, and CDN edge caching." }
        ],
        challenges: "Maintaining consistent 60 FPS animation performance across diverse mobile and desktop screen sizes. Solved by utilizing CSS GPU transforms and eliminating layout thrashing.",
        stack: ["React 18", "styled-components", "Axios", "React Router", "Vite"]
    },
    {
        id: "sana",
        title: "SANA",
        subtitle: "Multilingual AI Voice Butler",
        tier: "production",
        tierLabel: "🚀 Production & SaaS",
        status: "Voice AI System",
        statusType: "live",
        isPrivate: false,
        accessNote: "Open Source Audio AI Assistant",
        url: "https://github.com/JeetInTech/SANA-MULTILINGUAL-AI-ASSISTANT",
        displayUrl: "github.com/JeetInTech/SANA",
        screenshot: "https://api.microlink.io/?url=https%3A%2F%2Fgithub.com%2FJeetInTech%2FSANA-MULTILINGUAL-AI-ASSISTANT&screenshot=true&meta=false&embed=screenshot.url",
        tagline: "Multilingual voice-first assistant with Three.js holographic visualizer and sub-second Gemini Live audio streaming.",
        metrics: [
            { label: "Languages", value: "EN + Hindi" },
            { label: "Voice Latency", value: "Sub-Second" },
            { label: "Visualizer", value: "Three.js 3D" },
            { label: "Audio Model", value: "Gemini Live" }
        ],
        desc: "Multilingual voice-first AI butler capable of real-time conversational streaming in English and Hindi. Features a responsive 3D holographic canvas visualizer driven by live audio frequencies via the Web Audio API.",
        architecture: [
            { step: "01. Audio Stream Ingestion", detail: "Web Audio API capturing 16kHz PCM audio buffers with continuous background noise suppression." },
            { step: "02. Real-Time Streaming", detail: "Bidirectional WebSockets communicating directly with Google Gemini Live API." },
            { step: "03. 3D Audio Visualizer", detail: "Three.js shader geometry morphing in real time to the live audio frequency spectrum." }
        ],
        challenges: "Eliminating acoustic feedback loops when the AI responds while the microphone is live. Solved by implementing an acoustic echo-canceling audio gate.",
        stack: ["React 19", "TypeScript", "Vite 6", "Gemini Live", "Three.js", "Web Audio API"]
    },

    /* ========================================================
       TIER 3: AUTONOMOUS AI & AGENT FLEETS (6 Projects)
       ======================================================== */
    {
        id: "therapist",
        title: "Virtual Therapist",
        subtitle: "LangGraph Autonomous Multi-Modal Agent · 24 Tools",
        tier: "agent",
        tierLabel: "🤖 Autonomous AI & Agents",
        status: "Agentic Clinical Assistant",
        statusType: "agent",
        isPrivate: false,
        accessNote: "Public Implementation with Deterministic Safety Guardrails",
        url: "https://github.com/JeetInTech/Virtual-Therapist---LangGraph-Agentic-AI-System",
        displayUrl: "github.com/JeetInTech/Virtual-Therapist",
        screenshot: "https://api.microlink.io/?url=https%3A%2F%2Fgithub.com%2FJeetInTech%2FVirtual-Therapist---LangGraph-Agentic-AI-System&screenshot=true&meta=false&embed=screenshot.url",
        tagline: "LangGraph autonomous ReAct agent with 24 deterministic tools, ChromaDB memory, and <50ms safety guardrails.",
        metrics: [
            { label: "Domain Tools", value: "24 Tools" },
            { label: "Safety Intercept", value: "< 50 ms" },
            { label: "Sensory Streams", value: "Face + Voice" },
            { label: "Memory Engine", value: "ChromaDB" }
        ],
        desc: "Autonomous clinical assistant agent built with LangGraph StateGraph. Features a ReAct loop orchestrating 24 deterministic domain tools (CBT exercises, sleep hygiene trackers, risk escalation), combining real-time facial micro-expression classification with acoustic voice prosody analysis.",
        architecture: [
            { step: "01. Multimodal Perception", detail: "Captures facial expressions (FER/OpenCV) and acoustic prosody (MFCCs/pitch via Librosa)." },
            { step: "02. LangGraph ReAct Loop", detail: "Stateful agent workflow with 24 deterministic tools and strict JSON output validation." },
            { step: "03. Deterministic Safety Rail", detail: "Sub-50ms interceptor checking crisis indicators with zero LLM bypass vulnerability." },
            { step: "04. Episodic Vector Memory", detail: "ChromaDB indexing longitudinal session affective vectors for trend tracking." }
        ],
        challenges: "Guaranteeing that suicidal ideation or crisis indicators are never bypassed by creative LLM jailbreaks. Solved by placing a deterministic keyword and semantic embedding safety guardrail before any LLM prompt evaluation.",
        stack: ["Python", "LangGraph", "ChromaDB", "OpenCV", "Librosa", "Groq LLM", "Edge-TTS"]
    },
    {
        id: "openinstaflow",
        title: "OpenInstaFlow",
        subtitle: "Instagram Graph API MCP Server",
        tier: "agent",
        tierLabel: "🤖 Autonomous AI & Agents",
        status: "Model Context Protocol Server",
        statusType: "production",
        isPrivate: true,
        accessNote: "Private Enterprise Model Context Protocol Server",
        url: "https://github.com/JeetInTech",
        displayUrl: "github.com/JeetInTech",
        tagline: "Production Model Context Protocol server exposing Instagram Creator and Business accounts to Claude Desktop and Cursor.",
        metrics: [
            { label: "Protocol", value: "Anthropic MCP" },
            { label: "Supported Clients", value: "Claude & Cursor" },
            { label: "API Target", value: "Meta Graph API" },
            { label: "Language", value: "TypeScript" }
        ],
        desc: "Standardized Model Context Protocol (MCP) server written in TypeScript. Enables AI agents (Claude Desktop, Cursor IDE) to inspect Instagram account analytics, query media reach and impressions, stage posts, and publish media directly through natural language instructions.",
        architecture: [
            { step: "01. MCP Protocol Core", detail: "Implements @modelcontextprotocol/sdk exposing standardized tool definitions and resources." },
            { step: "02. Meta Graph REST Client", detail: "Secure communication layer with token refresh, rate-limit throttling, and error translation." },
            { step: "03. Tool Dispatcher", detail: "Executes media queries, demographic analytics, carousel publishing, and caption staging." }
        ],
        challenges: "Handling Meta's complex OAuth 2.0 access token expiration and image container publishing verification cycles. Solved by writing an automatic container status polling worker in TypeScript.",
        stack: ["TypeScript", "Node.js", "@modelcontextprotocol/sdk", "Instagram Graph API", "OAuth 2.0"]
    },
    {
        id: "cold_mails",
        title: "Genesis: Cold Mails Engine",
        subtitle: "Autonomous Outreach & Pitch Generator",
        tier: "agent",
        tierLabel: "🤖 Autonomous AI & Agents",
        status: "Autonomous Outreach Agent",
        statusType: "agent",
        isPrivate: true,
        accessNote: "Private Genesis Agent Module",
        url: "https://github.com/JeetInTech",
        displayUrl: "github.com/JeetInTech",
        tagline: "Autonomous lead enrichment and hyper-personalized email pitching engine powered by Groq Llama-3.",
        metrics: [
            { label: "Model Core", value: "Groq Llama-3" },
            { label: "Generation Speed", value: "< 2s / Pitch" },
            { label: "Deduplication", value: "JSON Hashes" },
            { label: "Draft Action", value: "Gmail API" }
        ],
        desc: "Autonomous outbound business development agent. Scrapes prospective company websites, parses product offerings, identifies engineering pain points, and generates hyper-personalized pitch emails directly drafted into Gmail with deduplication tracking.",
        architecture: [
            { step: "01. Lead Extraction & Scraping", detail: "Crawls company homepages and careers portals, converting raw DOM into clean markdown." },
            { step: "02. Contextual Pitch Synthesis", detail: "Groq Llama-3 analyzes company engineering stack to synthesize tailored technical value propositions." },
            { step: "03. Automated Gmail Drafts", detail: "Connects to Gmail API via OAuth 2.0 to prepare drafts ready for human one-click approval." }
        ],
        challenges: "Preventing repetitive robotic email templates. Solved by providing few-shot style guides and dynamically injecting recent company achievements.",
        stack: ["Python", "Groq LLM", "Gmail API", "OAuth 2.0", "BeautifulSoup4"]
    },
    {
        id: "linkedin_outreach",
        title: "Genesis: LinkedIn Outreach Agent",
        subtitle: "Headless Browser Networking Pipeline",
        tier: "agent",
        tierLabel: "🤖 Autonomous AI & Agents",
        status: "Autonomous Browser Agent",
        statusType: "agent",
        isPrivate: true,
        accessNote: "Private Playwright + Edge Automation Agent",
        url: "https://github.com/JeetInTech",
        displayUrl: "github.com/JeetInTech",
        tagline: "6-stage automated LinkedIn outreach pipeline running headlessly on Microsoft Edge with SQLite tracking.",
        metrics: [
            { label: "Pipeline Stages", value: "6 Stages" },
            { label: "Browser Engine", value: "Playwright Edge" },
            { label: "Rate Limiting", value: "Humanized" },
            { label: "Storage", value: "outreach.db" }
        ],
        desc: "Autonomous professional networking bot operating over Microsoft Edge. Implements a 6-stage automation pipeline (Sync → Follow → Sweep → Harvest → Outreach → Track) to identify relevant engineering managers and send personalized connection requests.",
        architecture: [
            { step: "01. Humanized Navigation", detail: "Playwright driving Edge with randomized click delays, bezier mouse curves, and viewport jitter." },
            { step: "02. Lead Harvesting", detail: "Extracts profiles from engineering searches and stores contact metadata in SQLite." },
            { step: "03. Connection Messaging", detail: "Generates tailored greeting notes and tracks response status in outreach.db." }
        ],
        challenges: "Bypassing aggressive LinkedIn bot detection algorithms. Solved by reusing local Edge authenticated user profiles and enforcing strict daily interaction quotas.",
        stack: ["Python", "Playwright", "Microsoft Edge", "SQLite", "Groq LLM"]
    },
    {
        id: "linkedin_publisher",
        title: "Genesis: LinkedIn Publisher",
        subtitle: "Autonomous Content & ComfyUI Image Generator",
        tier: "agent",
        tierLabel: "🤖 Autonomous AI & Agents",
        status: "Autonomous Publisher Agent",
        statusType: "agent",
        isPrivate: true,
        accessNote: "Private Autonomous Publishing Infrastructure",
        url: "https://github.com/JeetInTech",
        displayUrl: "github.com/JeetInTech",
        tagline: "Autonomous content generation and publication pipeline integrating headless ComfyUI local image generation.",
        metrics: [
            { label: "Image Engine", value: "ComfyUI Local" },
            { label: "Text Model", value: "Groq Llama-3" },
            { label: "API Protocol", value: "LinkedIn REST" },
            { label: "Automation", value: "100% Scheduled" }
        ],
        desc: "Autonomous technical content creator. Researches trending computer science and AI developments, drafts long-form educational posts using Groq Llama-3, dispatches local prompts to a headless ComfyUI queue for custom diagram creation, and posts via the LinkedIn REST API.",
        architecture: [
            { step: "01. Trend Identification", detail: "Monitors arXiv, Hacker News, and GitHub trending feeds for breakthrough announcements." },
            { step: "02. Content Authoring", detail: "Synthesizes multi-paragraph educational analyses with code snippets and bullet breakdowns." },
            { step: "03. ComfyUI Image Generation", detail: "Dispatches headless API requests to local diffusion models for custom diagrams." },
            { step: "04. LinkedIn REST Publishing", detail: "Uploads binary image assets and registers scheduled posts through official LinkedIn endpoints." }
        ],
        challenges: "Generating relevant visual infographics without manual graphic design tools. Solved by scripting headless ComfyUI workflow JSONs with prompt conditioning.",
        stack: ["Python", "Groq LLM", "ComfyUI API", "LinkedIn REST API", "Pillow"]
    },
    {
        id: "multi_llm",
        title: "Multi-LLM Discussion Arena",
        subtitle: "Cognitive Swarm Debate System",
        tier: "agent",
        tierLabel: "🤖 Autonomous AI & Agents",
        status: "Autonomous Cognitive Swarm",
        statusType: "agent",
        isPrivate: true,
        accessNote: "Private Agentic Multi-Model Arena",
        url: "https://github.com/JeetInTech",
        displayUrl: "github.com/JeetInTech",
        tagline: "Five independent LLMs with distinct cognitive reasoning styles debating complex engineering challenges.",
        metrics: [
            { label: "Debating Agents", value: "5 Personas" },
            { label: "Reasoning Styles", value: "Logical/Creative" },
            { label: "Coordination", value: "Round-Robin" },
            { label: "Synthesis", value: "Consensus Node" }
        ],
        desc: "Autonomous multi-agent deliberation framework. Assigns distinct cognitive roles (Logical, Creative, Skeptical, Practical, Synthesizer) across 5 LLM instances, allowing them to debate architectural trade-offs, critique opposing views, and converge on an optimal consensus.",
        architecture: [
            { step: "01. Persona Formulation", detail: "Configures system prompts enforcing adversarial scrutiny and domain-specific perspectives." },
            { step: "02. Turn-Based Deliberation", detail: "Round-robin conversational blackboard where each agent reads all prior responses before replying." },
            { step: "03. Consensus Synthesis", detail: "Synthesizer agent consolidates debated trade-offs into a final actionable engineering recommendation." }
        ],
        challenges: "Preventing infinite conversational echo chambers or repetitive agreeing loops. Solved by implementing strict divergence penalties and forced adversarial counterarguments.",
        stack: ["Python", "LangChain", "Groq API", "Google Gemini", "FastAPI"]
    },

    /* ========================================================
       TIER 4: AI/ML LABS & COMPUTER VISION ENGINES (8 Projects)
       ======================================================== */
    {
        id: "ai_data_analyst",
        title: "AI Data Analyst & AutoML",
        subtitle: "Out-of-Core Big Data Machine Learning Engine",
        tier: "aiml",
        tierLabel: "👁️ AI/ML & Computer Vision",
        status: "Enterprise AutoML Pipeline",
        statusType: "lab",
        isPrivate: true,
        accessNote: "Private Big Data & MLOps Engine",
        url: "https://github.com/JeetInTech/Ai-data-analyst",
        displayUrl: "github.com/JeetInTech/Ai-data-analyst",
        tagline: "Out-of-core tabular AutoML pipeline capable of ingesting 5GB+ datasets with Optuna tuning and LIME explainability.",
        metrics: [
            { label: "Dataset Capacity", value: "5GB+ (Out-of-Core)" },
            { label: "Optimization", value: "Optuna 50+ Trials" },
            { label: "Validation", value: "Pandera Contracts" },
            { label: "Explainability", value: "LIME & SHAP" }
        ],
        desc: "Enterprise-grade AutoML and exploratory data analysis pipeline. Handles datasets exceeding physical RAM using Dask and PyArrow, enforces strict schema contracts with Pandera, executes Bayesian hyperparameter optimization with Optuna, and generates local model explanations with LIME.",
        architecture: [
            { step: "01. Out-of-Core Ingestion", detail: "Dask and PyArrow streaming partitioned datasets from disk without out-of-memory errors." },
            { step: "02. Pandera Schema Validation", detail: "Enforces data type contracts, boundary constraints, and automated missing value imputation." },
            { step: "03. Bayesian Tuning", detail: "Optuna search over LightGBM, XGBoost, and Scikit-learn models across 50+ hyperparameter trials." },
            { step: "04. Experiment Tracking & XAI", detail: "Logs runs to MLflow and computes local feature importance explanations using LIME." }
        ],
        challenges: "Training models on datasets larger than available RAM on a single machine. Solved by building a partitioned out-of-core pipeline with Dask and streaming data directly into tree boosting algorithms.",
        stack: ["Python", "Dask", "PyArrow", "Pandera", "Optuna", "Scikit-Learn", "LightGBM", "MLflow", "LIME"]
    },
    {
        id: "offline_image",
        title: "Offline Image Workstation",
        subtitle: "Low-VRAM Local Diffusion System",
        tier: "aiml",
        tierLabel: "👁️ AI/ML & Computer Vision",
        status: "Local Diffusion Workstation",
        statusType: "lab",
        isPrivate: true,
        accessNote: "Private Standalone Windows Executable (.exe)",
        url: "https://github.com/JeetInTech",
        displayUrl: "github.com/JeetInTech",
        tagline: "100% offline local generative diffusion system optimized for consumer hardware with CPU offloading.",
        metrics: [
            { label: "Packaging", value: "Standalone .exe" },
            { label: "GUI Engine", value: "PySide6" },
            { label: "VRAM Footprint", value: "< 4GB VRAM" },
            { label: "Inference Engine", value: "ComfyUI Queue" }
        ],
        desc: "Desktop generative image workstation packaged as a standalone Windows executable. Implements model weight CPU/GPU offloading, batch scheduling, and low-VRAM memory optimizations to generate high-resolution images on consumer hardware without cloud dependencies.",
        architecture: [
            { step: "01. PySide6 Native Interface", detail: "Clean desktop GUI with prompt builders, aspect ratio selectors, and history browser." },
            { step: "02. ComfyUI Headless Queue", detail: "Local backend executing diffusion workflows via WebSocket job queues." },
            { step: "03. Memory Optimization", detail: "Model CPU offload, fp16 precision, and memory-sliced cross-attention for low-VRAM GPUs." }
        ],
        challenges: "Running modern diffusion models on 4GB consumer GPUs without CUDA out-of-memory errors. Solved by implementing dynamic weight offloading and cross-attention slicing.",
        stack: ["Python", "PySide6", "ComfyUI", "Stable Diffusion", "PyTorch", "PyInstaller"]
    },
    {
        id: "text_summarizer",
        title: "CNN Text Summarization",
        subtitle: "Fine-Tuned Seq2Seq Deep Learning Pipeline",
        tier: "aiml",
        tierLabel: "👁️ AI/ML & Computer Vision",
        status: "Deep Learning NLP Pipeline",
        statusType: "lab",
        isPrivate: false,
        accessNote: "Public Model Weights on HuggingFace Hub",
        url: "https://huggingface.co/JeetinTechh/CNN-News-data",
        displayUrl: "huggingface.co/JeetinTechh",
        screenshot: "https://api.microlink.io/?url=https%3A%2F%2Fhuggingface.co%2FJeetinTechh%2FCNN-News-data&screenshot=true&meta=false&embed=screenshot.url",
        tagline: "Sequence-to-sequence deep learning summarizer fine-tuned on the CNN/DailyMail dataset with ROUGE metrics.",
        metrics: [
            { label: "Model Architecture", value: "PEGASUS / T5" },
            { label: "Dataset", value: "CNN/DailyMail" },
            { label: "Evaluation", value: "ROUGE-1/2/L" },
            { label: "Deployment", value: "Docker / Flask" }
        ],
        desc: "End-to-end deep learning NLP pipeline fine-tuning transformer models for abstractive text summarization. Handles 1,024-token long-form news inputs, executes beam-search decoding, and evaluates performance against standard ROUGE metrics.",
        architecture: [
            { step: "01. Data Preprocessing", detail: "Custom data transformation pipeline tokenizing and dynamically padding news articles." },
            { step: "02. Model Fine-Tuning", detail: "PyTorch and HuggingFace Transformers fine-tuning PEGASUS model with gradient accumulation." },
            { step: "03. ROUGE Metric Evaluation", detail: "Calculates ROUGE-1, ROUGE-2, and ROUGE-L F1 scores across held-out evaluation sets." },
            { step: "04. Containerized Serving", detail: "Packaged into a lightweight Flask inference API inside Docker for reproducible serving." }
        ],
        challenges: "Managing GPU memory during fine-tuning on long-sequence 1024-token documents. Solved by utilizing gradient checkpointing and mixed-precision fp16 training.",
        stack: ["Python", "PyTorch", "Transformers", "HuggingFace Datasets", "Docker", "Flask"]
    },
    {
        id: "yt_clip",
        title: "Genesis: YT-Clip-Master",
        subtitle: "Video Repurposer & Vertical Face-Tracker",
        tier: "aiml",
        tierLabel: "👁️ AI/ML & Computer Vision",
        status: "Computer Vision Media Engine",
        statusType: "lab",
        isPrivate: true,
        accessNote: "Private Genesis Video Processing Module",
        url: "https://github.com/JeetInTech",
        displayUrl: "github.com/JeetInTech",
        tagline: "Automated video repurposing engine extracting viral hooks, emotional peaks, and cropping to 9:16 with face tracking.",
        metrics: [
            { label: "Aspect Ratio", value: "16:9 to 9:16" },
            { label: "Face Tracking", value: "OpenCV Haar" },
            { label: "Peak Detection", value: "Audio RMS" },
            { label: "Subtitle Burn", value: "Word Timestamps" }
        ],
        desc: "Long-form to short-form video repurposing engine. Ingests horizontal podcasts, performs speech transcription with word-level timestamps, detects emotional peaks in audio RMS energy, crops the video dynamically to vertical 9:16 following speaker faces, and outputs ready-to-publish shorts.",
        architecture: [
            { step: "01. Audio Transcribe & Align", detail: "faster-whisper extracts full transcript with millisecond word timestamps." },
            { step: "02. Virality Peak Scoring", detail: "Analyzes pitch shifts, loudness spikes, and sentence sentiment to identify top 60s highlights." },
            { step: "03. Dynamic 9:16 Crop", detail: "OpenCV face detection tracking speaker head movements and centering them in the vertical frame." },
            { step: "04. Animated Subtitle Burn", detail: "Generates high-retention karaoke-style burned-in subtitles via FFmpeg." }
        ],
        challenges: "Keeping the speaker centered in dynamic vertical 9:16 crops when they move rapidly across a 16:9 frame. Solved by smoothing face coordinates with an exponential moving average filter.",
        stack: ["Python", "OpenCV", "faster-whisper", "FFmpeg", "MoviePy", "Pydub"]
    },
    {
        id: "photo_enhancer",
        title: "Photo Enhancer & Background Remover",
        subtitle: "Real-ESRGAN Super-Resolution Service",
        tier: "aiml",
        tierLabel: "👁️ AI/ML & Computer Vision",
        status: "Computer Vision Microservice",
        statusType: "lab",
        isPrivate: true,
        accessNote: "Private Dockerized Computer Vision Service",
        url: "https://github.com/JeetInTech",
        displayUrl: "github.com/JeetInTech",
        tagline: "Containerized microservice performing 4x image super-resolution and precision background removal.",
        metrics: [
            { label: "Upscaling Factor", value: "4x Real-ESRGAN" },
            { label: "Segmentation", value: "Rembg / U2-Net" },
            { label: "Runtime", value: "ONNX Runtime" },
            { label: "Deployment", value: "Docker / FastAPI" }
        ],
        desc: "GPU-accelerated computer vision microservice. Implements Real-ESRGAN 4x deep learning super-resolution to restore pixelated images, coupled with Rembg (U²-Net) ONNX Runtime inference for clean background removal.",
        architecture: [
            { step: "01. FastAPI Endpoint", detail: "Receives raw image uploads, validates MIME types, and streams image tensors." },
            { step: "02. Background Cutout", detail: "Executes Rembg ONNX model producing alpha-channel matte masks in under 800ms." },
            { step: "03. 4x Super-Resolution", detail: "Tensors processed through Real-ESRGAN to restore fine details and eliminate compression artifacts." }
        ],
        challenges: "Balancing high-resolution super-resolution quality with fast API response times. Solved by quantizing models and running inference on ONNX Runtime.",
        stack: ["Python", "FastAPI", "Real-ESRGAN", "Rembg", "ONNX Runtime", "OpenCV", "Docker"]
    },
    {
        id: "touchless",
        title: "Touchless Gestures & 3D Control",
        subtitle: "Real-Time MediaPipe HCI System",
        tier: "aiml",
        tierLabel: "👁️ AI/ML & Computer Vision",
        status: "Computer Vision HCI System",
        statusType: "lab",
        isPrivate: true,
        accessNote: "Private Research Prototype (Authored Amazon KDP Book)",
        url: "https://www.amazon.com/dp/B0FBLC1RLT",
        displayUrl: "amazon.com/dp/B0FBLC1RLT",
        tagline: "Real-time 21-point hand tracking system enabling touchless air-typing, mouse control, and 3D navigation.",
        metrics: [
            { label: "Tracking Speed", value: "30+ FPS" },
            { label: "Hand Landmarks", value: "21 Points" },
            { label: "Published Book", value: "Amazon KDP" },
            { label: "HCI Precision", value: "Euclidean Math" }
        ],
        desc: "Touchless human-computer interaction system. Tracks 21 hand landmarks in real-time at 30+ FPS using MediaPipe, calculating Euclidean finger distances and knuckle angles to map air gestures to OS cursor movement, scrolling, and virtual keyboard typing without physical hardware contact.",
        architecture: [
            { step: "01. Video Stream Ingestion", detail: "OpenCV captures webcam feed and applies histogram equalization for low-light stability." },
            { step: "02. 21-Point Landmark Detection", detail: "MediaPipe Hands extracts 3D coordinates (x, y, z) for every finger joint." },
            { step: "03. Mathematical Gesture Classifier", detail: "Calculates Euclidean vector distances to recognize pinches, air-taps, peace signs, and swipes." },
            { step: "04. OS Input Synthesizer", detail: "PyAutoGUI injects OS cursor movements, mouse clicks, and keystrokes into the host operating system." }
        ],
        challenges: "Preventing jittery cursor jumps caused by slight hand tremors. Solved by implementing an exponential smoothing filter over landmark coordinates.",
        stack: ["Python", "OpenCV", "MediaPipe", "PyAutoGUI", "PyOpenGL", "NumPy"]
    },
    {
        id: "craftbrain_segmentation",
        title: "Craftbrain Customer Segmentation",
        subtitle: "Unsupervised Machine Learning Engine",
        tier: "aiml",
        tierLabel: "👁️ AI/ML & Computer Vision",
        status: "Unsupervised ML Pipeline",
        statusType: "lab",
        isPrivate: true,
        accessNote: "Private Market Intelligence Pipeline",
        url: "https://github.com/JeetInTech",
        displayUrl: "github.com/JeetInTech",
        tagline: "Unsupervised machine learning pipeline using PCA, K-Means, and DBSCAN for behavioral customer persona clustering.",
        metrics: [
            { label: "Clustering Algorithms", value: "K-Means & DBSCAN" },
            { label: "Dimensionality", value: "PCA Reduction" },
            { label: "Validation", value: "Silhouette Score" },
            { label: "Visualization", value: "Interactive 3D" }
        ],
        desc: "Unsupervised machine learning pipeline analyzing commercial customer behavioral datasets. Implements Principal Component Analysis (PCA) for variance-preserving dimensionality reduction, clusters user cohorts using K-Means and DBSCAN, and validates separation via Silhouette Coefficients.",
        architecture: [
            { step: "01. Feature Scaling & Encoding", detail: "Standardizes high-dimensional transaction data and encodes categorical traits with Scikit-learn." },
            { step: "02. PCA Dimensionality Reduction", detail: "Reduces 20+ feature dimensions to 3 principal components while preserving 85% of total variance." },
            { step: "03. Cohort Clustering", detail: "Identifies core customer segments using K-Means and detects behavioral outliers with DBSCAN." },
            { step: "04. Business Persona Profiling", detail: "Generates interactive 3D cluster visualizations in Plotly and summarizes actionable persona profiles." }
        ],
        challenges: "Determining the optimal number of customer clusters without subjective bias. Solved by plotting the Elbow Method alongside automated Silhouette Coefficient maximization.",
        stack: ["Python", "Scikit-Learn", "Pandas", "NumPy", "Matplotlib", "Seaborn", "Plotly"]
    },
    {
        id: "social_bot",
        title: "Multi-Platform Social Automation",
        subtitle: "WhatsApp & Instagram Messaging Fleet",
        tier: "aiml",
        tierLabel: "👁️ AI/ML & Computer Vision",
        status: "Automated Messaging Engine",
        statusType: "lab",
        isPrivate: true,
        accessNote: "Private Social Scraping & Automation Bot",
        url: "https://github.com/JeetInTech",
        displayUrl: "github.com/JeetInTech",
        tagline: "Automated browser bot managing customer communication across WhatsApp Web and Instagram Direct Messages.",
        metrics: [
            { label: "Target Platforms", value: "WhatsApp + Insta" },
            { label: "Browser Engine", value: "Selenium Driver" },
            { label: "Interaction Style", value: "Persona-Matched" },
            { label: "Detection Evasion", value: "Dynamic Delays" }
        ],
        desc: "Multi-platform social automation engine. Connects to WhatsApp Web and Instagram via headless Selenium and Playwright, monitors incoming customer inquiries, parses intent, and synthesizes brand-aligned responses with human-like typing delays.",
        architecture: [
            { step: "01. Session State Persistence", detail: "Persists browser cookies and local storage tokens to avoid repetitive QR code logins." },
            { step: "02. Real-Time Chat Polling", detail: "DOM mutation observers detecting new incoming messages across active chat threads." },
            { step: "03. Contextual Reply Generator", detail: "Groq LLM generates conversational replies conforming to configured brand persona tone." },
            { step: "04. Humanized Input Dispatch", detail: "Simulates human typing cadences with randomized keystroke intervals." }
        ],
        challenges: "Bypassing aggressive WhatsApp Web session disconnection algorithms. Solved by implementing persistent user data directory caching and gentle heartbeat interactions.",
        stack: ["Python", "Selenium", "Playwright", "Groq LLM", "BeautifulSoup4"]
    },

    /* ========================================================
       TIER 5: EXPERIMENTAL LABS, UTILITIES & PROTOTYPES (11 Projects)
       ======================================================== */
    {
        id: "local_cortex",
        title: "Local Cortex",
        subtitle: "Native Desktop AI IDE · Tauri v2 & Rust",
        tier: "experimental",
        tierLabel: "🧪 Experimental Labs & Tooling",
        status: "Native Desktop IDE",
        statusType: "experimental",
        isPrivate: false,
        accessNote: "Open Source Native Desktop Software",
        url: "https://github.com/JeetInTech/Local-Cortex-your-local-chatgpt-with-built-in-editor",
        displayUrl: "github.com/JeetInTech/Local-Cortex",
        screenshot: "https://api.microlink.io/?url=https%3A%2F%2Fgithub.com%2FJeetInTech%2FLocal-Cortex-your-local-chatgpt-with-built-in-editor&screenshot=true&meta=false&embed=screenshot.url",
        tagline: "Native Windows desktop AI code editor built with Tauri v2, Rust, and local vector RAG over Ollama.",
        metrics: [
            { label: "Systems Core", value: "Tauri v2 / Rust" },
            { label: "RAM Footprint", value: "< 120MB (vs Electron)" },
            { label: "Local Inference", value: "Ollama RAG" },
            { label: "Packaging", value: "NSIS / MSI .exe" }
        ],
        desc: "High-performance native desktop AI code editor. Features a Rust backend managing asynchronous IPC commands, native filesystem traversal, and local codebase vector RAG indexing, coupled with a React frontend rendering the Monaco code editor.",
        architecture: [
            { step: "01. Tauri v2 Rust Backend", detail: "High-speed native IPC layer managing file I/O and command routing with zero Electron bloat." },
            { step: "02. Local Codebase RAG", detail: "rag.rs chunks and indexes project files into local vector embeddings over Ollama." },
            { step: "03. Autonomous Editing Loop", detail: "agent.rs analyzes multi-file codebases and synthesizes unified diff patches." },
            { step: "04. Monaco Code Editor", detail: "Embeds the industry-standard Monaco editor with syntax highlighting and file tree management." }
        ],
        challenges: "Maintaining a lightweight desktop memory footprint compared to bloated Electron IDEs. Solved by utilizing Tauri v2 with native Windows WebView2 and Rust.",
        stack: ["Rust", "Tauri v2", "React", "TypeScript", "Monaco Editor", "Ollama"]
    },
    {
        id: "jobflow_ai",
        title: "JobFlow AI",
        subtitle: "Smart Job Copilot Chrome Extension",
        tier: "experimental",
        tierLabel: "🧪 Experimental Labs & Tooling",
        status: "Browser Extension",
        statusType: "experimental",
        isPrivate: true,
        accessNote: "Private Chrome Manifest v3 Extension",
        url: "https://github.com/JeetInTech",
        displayUrl: "github.com/JeetInTech",
        tagline: "Chrome Extension Manifest v3 injecting real-time job application intelligence directly into job boards.",
        metrics: [
            { label: "Architecture", value: "Manifest v3" },
            { label: "Supported Sites", value: "LinkedIn / Naukri" },
            { label: "LLM Backend", value: "Gemini API" },
            { label: "DOM Scraper", value: "Content Scripts" }
        ],
        desc: "Browser copilot extension built on Chrome Manifest v3. Injects content scripts directly into LinkedIn, Naukri, and Wellfound job postings to extract job requirements, score candidate resume match fit, and auto-generate custom cover letters.",
        architecture: [
            { step: "01. Content Script DOM Parser", detail: "Parses active job description DOM elements on page navigation." },
            { step: "02. Match Fit Scoring", detail: "Evaluates candidate skill alignment and displays a floating match rating HUD." },
            { step: "03. Cover Letter Generator", detail: "Generates tailored application answers with one-click clipboard copying." }
        ],
        challenges: "Handling Chrome Manifest v3 service worker lifecycle constraints without dropping active DOM analysis state. Solved by caching state in chrome.storage.local.",
        stack: ["JavaScript", "Chrome Extensions API", "Manifest v3", "Gemini API", "HTML/CSS"]
    },
    {
        id: "streak_guardian",
        title: "Streak Guardian Agent",
        subtitle: "Git CLI & Windows Task Scheduler Tool",
        tier: "experimental",
        tierLabel: "🧪 Experimental Labs & Tooling",
        status: "Developer Automation Tool",
        statusType: "experimental",
        isPrivate: true,
        accessNote: "Private Developer Tooling Agent",
        url: "https://github.com/JeetInTech",
        displayUrl: "github.com/JeetInTech",
        tagline: "Automated developer tooling agent verifying daily git commits and scheduling reminders via Windows Task Scheduler.",
        metrics: [
            { label: "Scheduler", value: "Windows Tasks" },
            { label: "Git Engine", value: "Git CLI Internals" },
            { label: "Model", value: "Ollama Local" },
            { label: "Verification", value: "GitHub API" }
        ],
        desc: "Autonomous developer productivity tool. Scans local git repositories across the machine, verifies whether meaningful code commits were recorded for the day, checks the GitHub public API, and triggers desktop notifications to safeguard development streaks.",
        architecture: [
            { step: "01. Repo Discovery", detail: "Recursively scans workspace roots for active .git repositories and uncommitted diffs." },
            { step: "02. Commit Quality Verification", detail: "Inspects git log author-dates and commit message semantic quality using local Ollama." },
            { step: "03. Scheduled Execution", detail: "Registered into Windows Task Scheduler running automated evening validation checks." }
        ],
        challenges: "Accurately identifying active coding repos across 100+ local folders without sluggish filesystem scans. Solved by maintaining a cached repository registry.",
        stack: ["Python", "Git CLI", "GitHub API", "Ollama", "Windows Task Scheduler"]
    },
    {
        id: "pypi_jeet",
        title: "Published PyPI Package (jeet)",
        subtitle: "Open-Source Python Utility",
        tier: "experimental",
        tierLabel: "🧪 Experimental Labs & Tooling",
        status: "Published Open Source",
        statusType: "published",
        isPrivate: false,
        accessNote: "Published on Python Package Index (PyPI)",
        url: "https://pypi.org/project/jeet/",
        displayUrl: "pypi.org/project/jeet",
        screenshot: "https://api.microlink.io/?url=https%3A%2F%2Fpypi.org%2Fproject%2Fjeet%2F&screenshot=true&meta=false&embed=screenshot.url",
        tagline: "Developer utility package published to the official Python Package Index (PyPI) via Twine and Setuptools.",
        metrics: [
            { label: "Registry", value: "PyPI Official" },
            { label: "Install Command", value: "pip install jeet" },
            { label: "Packaging", value: "Wheel / Setuptools" },
            { label: "License", value: "MIT Open Source" }
        ],
        desc: "Published open-source Python package on the Python Package Index (PyPI). Implements reusable developer utilities, terminal formatting helpers, and automation routines, installable worldwide via standard pip.",
        architecture: [
            { step: "01. Package Structure", detail: "Follows modern pyproject.toml and setuptools build specifications." },
            { step: "02. Distribution Builds", detail: "Automated binary wheel and source distribution packaging via build and Twine." },
            { step: "03. PyPI Release", detail: "GPG-signed releases published to PyPI for global package installation." }
        ],
        challenges: "Adhering to strict PEP 517/518 build standards and namespace management. Solved by structuring clean module entrypoints.",
        stack: ["Python", "Setuptools", "Wheel", "Twine", "PyPI"]
    },
    {
        id: "cli_portfolio",
        title: "Developer Portfolio CLI",
        subtitle: "npm Interactive Terminal Portfolio",
        tier: "experimental",
        tierLabel: "🧪 Experimental Labs & Tooling",
        status: "Published npm Package",
        statusType: "published",
        isPrivate: false,
        accessNote: "Published on official npm registry",
        url: "https://www.npmjs.com/package/sangramjeet",
        displayUrl: "npmjs.com/package/sangramjeet",
        tagline: "Interactive terminal portfolio published to npm, runnable instantly via npx sangramjeet.",
        metrics: [
            { label: "Registry", value: "npm Official" },
            { label: "Execution", value: "npx sangramjeet" },
            { label: "Interface", value: "Terminal TUI" },
            { label: "Environment", value: "Node.js" }
        ],
        desc: "Interactive command-line portfolio published to the npm registry. Allows recruiters and developers to explore skills, projects, and contact channels directly in their terminal with interactive arrow navigation.",
        architecture: [
            { step: "01. Node.js TUI", detail: "Built using Inquirer.js and Chalk for styled interactive terminal menus." },
            { step: "02. Global npx Execution", detail: "Executable shebang binary enabling zero-install execution via npx." }
        ],
        challenges: "Ensuring cross-platform terminal compatibility across Windows Command Prompt, PowerShell, and Unix shells. Solved by adhering to ANSI color escape standards.",
        stack: ["Node.js", "JavaScript", "npm", "Inquirer.js", "Chalk"]
    },
    {
        id: "long_video",
        title: "Long-Format Video Pipeline",
        subtitle: "Modular Script-to-Video Assembler",
        tier: "experimental",
        tierLabel: "🧪 Experimental Labs & Tooling",
        status: "Experimental Prototype",
        statusType: "experimental",
        isPrivate: true,
        accessNote: "Private Video Assembler Prototype",
        url: "https://github.com/JeetInTech",
        displayUrl: "github.com/JeetInTech",
        tagline: "Experimental pipeline synthesizing 5 to 10-minute long-form educational videos with chapter transitions.",
        metrics: [
            { label: "Video Duration", value: "5-10 Minutes" },
            { label: "Chapter Splitting", value: "Automatic" },
            { label: "Compositor", value: "FFmpeg" },
            { label: "Status", value: "Prototype Lab" }
        ],
        desc: "Experimental video production pipeline designed for long-format educational tutorials. Explores multi-chapter script generation, background music ducking, and automated b-roll sequencing for 5-10 minute videos.",
        architecture: [
            { step: "01. Multi-Chapter Generation", detail: "Generates long-form outlines and subdivides topics into coherent 2-minute sections." },
            { step: "02. Audio Ducking", detail: "Lowers background soundtrack volume automatically during voiceover speech segments." },
            { step: "03. Chapter Title Cards", detail: "Renders animated transition cards separating narrative topics." }
        ],
        challenges: "Maintaining narrative consistency across 10-minute AI script outputs. Led to the development of the focused AI Local Video Editor studio.",
        stack: ["Python", "FFmpeg", "MoviePy", "Edge-TTS", "Groq LLM"]
    },
    {
        id: "christina",
        title: "Christina Persona Agent",
        subtitle: "Cognitive Conversational System",
        tier: "experimental",
        tierLabel: "🧪 Experimental Labs & Tooling",
        status: "Experimental Cognitive Agent",
        statusType: "experimental",
        isPrivate: true,
        accessNote: "Private Behavioral Persona Experiment",
        url: "https://github.com/JeetInTech",
        displayUrl: "github.com/JeetInTech",
        tagline: "Experimental conversational persona exploring emotional tone modulation and dynamic personality shifts.",
        metrics: [
            { label: "Personality Engine", value: "Stateful Shifts" },
            { label: "Tone Tracking", value: "Valence Vectors" },
            { label: "Status", value: "Internal Lab" },
            { label: "Core", value: "Python / Groq" }
        ],
        desc: "Cognitive persona experiment evaluating how LLMs adjust conversational warmth, humor, and assertiveness based on longitudinal conversational history and sentiment valence vectors.",
        architecture: [
            { step: "01. Tone Modulation Engine", detail: "Dynamically modulates system prompt parameters based on user emotional sentiment." },
            { step: "02. Episodic Personality Memory", detail: "Tracks user preferences and inside jokes across multiple chat sessions." }
        ],
        challenges: "Preventing sudden personality inconsistencies between conversation turns. Provided foundational research for the Virtual Therapist.",
        stack: ["Python", "Groq LLM", "LangChain", "SQLite"]
    },
    {
        id: "chatterbox",
        title: "Chatterbox Audio Studio",
        subtitle: "Speech Synthesis & Audio Processing Fork",
        tier: "experimental",
        tierLabel: "🧪 Experimental Labs & Tooling",
        status: "Audio Processing Lab",
        statusType: "experimental",
        isPrivate: true,
        accessNote: "Audio Processing & Speech Customization Fork",
        url: "https://github.com/JeetInTech",
        displayUrl: "github.com/JeetInTech",
        tagline: "Exploratory audio workstation experimenting with voice cloning, pitch modification, and DSP sound filters.",
        metrics: [
            { label: "Audio Processing", value: "Pydub / Librosa" },
            { label: "Voice Cloning", value: "TTS Models" },
            { label: "Status", value: "Lab Experiment" },
            { label: "Domain", value: "Speech DSP" }
        ],
        desc: "Audio experimentation lab focused on neural voice synthesis, audio equalization, pitch shifting, and format conversion pipelines, establishing DSP algorithms later used in the SANA voice assistant.",
        architecture: [
            { step: "01. Audio DSP Filters", detail: "Applies high-pass filters, dynamic compression, and audio normalization." },
            { step: "02. Voice Synthesis", detail: "Compares latency and naturalness across Kokoro, Edge-TTS, and Coqui TTS." }
        ],
        challenges: "Minimizing metallic robotic artifacts in synthesized neural voice streams.",
        stack: ["Python", "Pydub", "Librosa", "SoundFile", "PyAudio"]
    },
    {
        id: "cvforge",
        title: "CvForge Online",
        subtitle: "LaTeX Resume Builder Prototype",
        tier: "experimental",
        tierLabel: "🧪 Experimental Labs & Tooling",
        status: "Prototype Web App",
        statusType: "experimental",
        isPrivate: false,
        accessNote: "Early Web Prototype on GitHub",
        url: "https://github.com/JeetInTech/CvForge-Online",
        displayUrl: "github.com/JeetInTech/CvForge-Online",
        screenshot: "https://api.microlink.io/?url=https%3A%2F%2Fgithub.com%2FJeetInTech%2FCvForge-Online&screenshot=true&meta=false&embed=screenshot.url",
        tagline: "Early web application prototype for building ATS-friendly resumes with custom LaTeX export templates.",
        metrics: [
            { label: "Templates", value: "4 Formats" },
            { label: "Compiler", value: "LaTeX pdflatex" },
            { label: "Frontend", value: "React 18" },
            { label: "Status", value: "Precursor Project" }
        ],
        desc: "Early full-stack prototype exploring ATS resume scoring and LaTeX compilation. Served as the technological foundation for the dynamic LaTeX tailoring engine now powering the Genesis Job Application Agent.",
        architecture: [
            { step: "01. Resume Form Input", detail: "React 18 form capturing candidate experience, skills, and education." },
            { step: "02. LaTeX Template Injection", detail: "Fills placeholders in LaTeX templates and triggers server-side compilation." }
        ],
        challenges: "Sanitizing user input to prevent LaTeX injection syntax errors. Solved by implementing character escaping for special symbols (&, %, $, #).",
        stack: ["React 18", "TypeScript", "FastAPI", "pdflatex", "Vite"]
    },
    {
        id: "buddyai",
        title: "BuddyAi Desktop",
        subtitle: "Lightweight Desktop Assistant Prototype",
        tier: "experimental",
        tierLabel: "🧪 Experimental Labs & Tooling",
        status: "Desktop Prototype",
        statusType: "experimental",
        isPrivate: true,
        accessNote: "Early Desktop Assistant Prototype",
        url: "https://github.com/JeetInTech",
        displayUrl: "github.com/JeetInTech",
        tagline: "Lightweight floating desktop companion exploring localized assistant interaction and system monitoring.",
        metrics: [
            { label: "GUI", value: "Tkinter / Qt" },
            { label: "Inference", value: "Ollama" },
            { label: "Status", value: "Legacy Prototype" },
            { label: "Language", value: "Python" }
        ],
        desc: "Early desktop companion prototype created prior to Genesis and Sebastian. Explored floating desktop widget UIs, hotkey activation, and quick text summarization using early local models.",
        architecture: [
            { step: "01. Floating Window", detail: "Always-on-top desktop overlay with system tray minimization." },
            { step: "02. Global Hotkey Listener", detail: "Listens for global key combinations to summon the assistant instantaneously." }
        ],
        challenges: "Managing OS-level window focus and transparent backgrounds without flickering.",
        stack: ["Python", "Tkinter", "Ollama", "PyAutoGUI"]
    },
    {
        id: "ai_chess",
        title: "AI Chess Engine",
        subtitle: "Move Evaluation & Position Analyzer",
        tier: "experimental",
        tierLabel: "🧪 Experimental Labs & Tooling",
        status: "Algorithmic Engine",
        statusType: "experimental",
        isPrivate: true,
        accessNote: "Algorithmic Chess Engine & Analyzer",
        url: "https://github.com/JeetInTech",
        displayUrl: "github.com/JeetInTech",
        tagline: "Python chess analysis engine integrating Stockfish position evaluation and heuristic blunder detection.",
        metrics: [
            { label: "Engine Core", value: "python-chess" },
            { label: "Evaluation", value: "Stockfish UCI" },
            { label: "Analysis", value: "Centipawn Score" },
            { label: "Language", value: "Python" }
        ],
        desc: "Algorithmic chess analysis tool. Parses PGN game records, evaluates position quality using the Stockfish UCI engine, graphs centipawn advantage swings, and identifies game-deciding tactical blunders.",
        architecture: [
            { step: "01. PGN Board State Ingestion", detail: "Parses standard chess notation into a digital board representation with python-chess." },
            { step: "02. Stockfish UCI Protocol", detail: "Communicates via sub-process pipes to calculate multi-depth engine evaluations." },
            { step: "03. Blunder & Accuracy Graphing", detail: "Calculates player accuracy percentages and plots advantage swings." }
        ],
        challenges: "Managing asynchronous UCI engine pipe communication without blocking the main analysis script.",
        stack: ["Python", "python-chess", "Stockfish Engine", "Matplotlib"]
    }
];

console.log("[projects-data.js] Loaded " + window.PROJECTS_DATA.length + " engineering projects across 5 tiers.");
