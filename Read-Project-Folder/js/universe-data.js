/**
 * universe-data.js — the single source of truth for the Projects Universe.
 *
 * window.UNIVERSE_DATA = {
 *   worlds:   [{ id, index, title, subtitle, accentVar }],
 *   projects: [{ id, world, name, blurb, what, tech[], status, url|null, repo|null }]
 * }
 *
 * status ∈ 'LIVE' | 'PRIVATE' | 'OPEN SOURCE' | 'EXPERIMENTAL'
 *
 * Sourcing rules honoured here:
 *  - `url` / `repo` / `tech` are lifted from Portfolio/js/projects-data.js
 *    (window.PROJECTS_DATA) wherever the project matches. No URL is invented.
 *  - A project with no verified link carries url: null AND repo: null. The core
 *    detail view then renders the status chip and NO link button.
 *  - `blurb` is locked copy. `what` is factual expansion only — no invented
 *    metrics, users or revenue.
 */
window.UNIVERSE_DATA = {

    worlds: [
        {
            id: 'live',
            index: '01',
            title: 'LIVE PROJECTS',
            subtitle: 'Things that made it out.',
            accentVar: '--u-accent-live'
        },
        {
            id: 'agents',
            index: '02',
            title: 'AI AUTOMATION & AGENTS',
            subtitle: 'Systems that do the work.',
            accentVar: '--u-accent-agents'
        },
        {
            id: 'generators',
            index: '03',
            title: 'LOCAL GENERATORS',
            subtitle: 'AI running on the machine.',
            accentVar: '--u-accent-generators'
        },
        {
            id: 'experiments',
            index: '04',
            title: 'EXPERIMENTS & TOOLS',
            subtitle: 'Where new ideas begin.',
            accentVar: '--u-accent-experiments'
        }
    ],

    projects: [

        /* ================================================================
           WORLD 01 — LIVE PROJECTS
           ================================================================ */
        {
            id: 'neuroviai',
            world: 'live',
            name: 'NEUROVIAI',
            blurb: 'Multi-Service Content Automation SaaS.',
            what: 'A multi-tenant content automation platform built from scratch: a Next.js 14 App Router frontend over six decoupled FastAPI microservices, with a token credit economy and automated syndication to LinkedIn, X, Instagram and WhatsApp. LLM routing cascades through Gemini, Groq, HuggingFace and a local Ollama fallback.',
            tech: ['Next.js 14', 'TypeScript', 'FastAPI', 'PostgreSQL', 'Supabase RLS', 'Celery', 'Redis', 'Razorpay', 'Docker', 'Playwright'],
            status: 'LIVE',
            url: 'https://github.com/JeetInTech',
            repo: 'https://github.com/JeetInTech'
        },
        {
            id: 'memecredible',
            world: 'live',
            name: 'MR. MEMECREDIBLE',
            blurb: 'Published VS Code Extension with 904 installs.',
            what: 'A VS Code extension published on the Microsoft Visual Studio Marketplace. It subscribes to the editor’s diagnostic stream and maps syntax health onto a nine-stage meter rendered in an isolated Webview, with all scoring kept inside a 16ms frame budget so typing never stutters.',
            tech: ['TypeScript', 'VS Code Extension API', 'Node.js', 'Webview IPC', 'HTML5', 'CSS3 Animations'],
            status: 'LIVE',
            url: 'https://marketplace.visualstudio.com/items?itemName=SangramjeetGhosh.mr-memecredible',
            repo: null
        },
        {
            id: 'molars',
            world: 'live',
            name: 'MOLARS NUTRITION PLATFORM',
            blurb: 'Commercial nutrition platform and brand system.',
            what: 'The brand and customer waitlist platform for Molars Nutrition, delivered as founding engineer. React 19 on the Next.js App Router, an interactive molecular canvas with spring physics and cursor repulsion, and serverless Netlify Functions handling waitlist intake.',
            tech: ['React 19', 'Next.js', 'TypeScript', 'Tailwind CSS', 'HTML5 Canvas', 'Netlify Functions', 'Supabase'],
            status: 'LIVE',
            url: 'https://molars.netlify.app/',
            repo: null
        },
        {
            id: 'second-brain',
            world: 'live',
            name: 'SECOND BRAIN',
            blurb: 'AI-powered knowledge management engine.',
            what: 'A deployed knowledge base that ingests notes and documents and makes them retrievable through language rather than folders. Next.js 15 and Prisma over PostgreSQL, with Gemini 2.5 Flash handling summarisation and semantic recall.',
            tech: ['Next.js 15', 'TypeScript', 'Prisma ORM', 'PostgreSQL', 'Gemini 2.5 Flash', 'Tailwind CSS'],
            status: 'LIVE',
            url: 'https://secondbraindev.vercel.app/',
            repo: null
        },
        {
            id: 'craftingbrain',
            world: 'live',
            name: 'CRAFTINGBRAIN',
            blurb: 'Creative agency platform and live client system.',
            what: 'A production client platform for a creative agency: a React 18 single-page application with styled-components, client-side routing and a Vite build pipeline, running on the agency’s own domain.',
            tech: ['React 18', 'styled-components', 'Axios', 'React Router', 'Vite'],
            status: 'LIVE',
            url: 'https://craftingbrain.com/',
            repo: null
        },
        {
            id: 'aiexamtool',
            world: 'live',
            name: 'AIEXAMTOOL',
            blurb: 'Serverless exam evaluation platform and final-year project.',
            what: 'A serverless academic evaluation platform that accepts submitted answer scripts, retrieves reference material through a FAISS index, grades against it with an LLM and emits a report. Flask handlers run on AWS Lambda with DynamoDB for state.',
            tech: ['Python', 'Flask', 'AWS Lambda', 'DynamoDB', 'FAISS', 'OpenAI API', 'ReportLab', 'React'],
            status: 'PRIVATE',
            url: 'https://github.com/JeetInTech',
            repo: 'https://github.com/JeetInTech'
        },
        {
            id: 'virtual-therapist',
            world: 'live',
            name: 'VIRTUAL THERAPIST',
            blurb: 'LangGraph multi-modal AI agent with 24 tools.',
            what: 'A multi-modal conversational agent orchestrated as a LangGraph state machine across 24 registered tools. It reads text, voice and facial signal together, using ChromaDB for session recall and Edge-TTS for spoken replies.',
            tech: ['Python', 'LangGraph', 'ChromaDB', 'OpenCV', 'Librosa', 'Groq LLM', 'Edge-TTS'],
            status: 'OPEN SOURCE',
            url: 'https://github.com/JeetInTech/Virtual-Therapist---LangGraph-Agentic-AI-System',
            repo: 'https://github.com/JeetInTech/Virtual-Therapist---LangGraph-Agentic-AI-System'
        },
        {
            id: 'cnn-summarization',
            world: 'live',
            name: 'CNN TEXT SUMMARIZATION',
            blurb: 'Fine-tuned sequence-to-sequence NLP pipeline.',
            what: 'A transformer sequence-to-sequence model fine-tuned on CNN news data for abstractive summarisation, with the training pipeline containerised and the resulting artefact published to the HuggingFace Hub.',
            tech: ['Python', 'PyTorch', 'Transformers', 'HuggingFace Datasets', 'Docker', 'Flask'],
            status: 'OPEN SOURCE',
            url: 'https://huggingface.co/JeetinTechh/CNN-News-data',
            repo: null
        },
        {
            id: 'pypi-jeet',
            world: 'live',
            name: 'PYPI PACKAGE — JEET',
            blurb: 'Open-source Python utility package.',
            what: 'A Python utility package built, wheeled and published to the Python Package Index, installable with a single pip command.',
            tech: ['Python', 'Setuptools', 'Wheel', 'Twine', 'PyPI'],
            status: 'OPEN SOURCE',
            url: 'https://pypi.org/project/jeet/',
            repo: null
        },
        {
            id: 'autonomous-social',
            world: 'live',
            name: 'AUTONOMOUS SOCIAL MEDIA',
            blurb: '100% privacy-focused autonomous social media platform.',
            what: 'A social media system that runs its own posting loop without handing user data to third-party schedulers. Everything that touches account credentials or content stays inside the operator’s own infrastructure.',
            tech: ['Python', 'FastAPI', 'Playwright', 'PostgreSQL'],
            status: 'PRIVATE',
            url: 'https://github.com/JeetInTech',
            repo: 'https://github.com/JeetInTech'
        },

        /* ================================================================
           WORLD 02 — AI AUTOMATION & AGENTS
           ================================================================ */
        {
            id: 'sebastian',
            world: 'agents',
            name: 'SEBASTIAN',
            blurb: 'Autonomous AI operating system and private AI butler.',
            what: 'A personal AI operating system spanning 25 modules and 92 registered tools, driven by full-duplex Gemini Live voice with barge-in interruption. Tool calls pass through green/yellow/red permission gates; memory is pgvector similarity search over turn-by-turn history.',
            tech: ['Python 3.12', 'Gemini Live API', 'Kokoro TTS', 'PostgreSQL', 'pgvector', 'Model Context Protocol', 'PyAudio', 'FastAPI'],
            status: 'PRIVATE',
            url: 'https://github.com/JeetInTech',
            repo: 'https://github.com/JeetInTech'
        },
        {
            id: 'genesis',
            world: 'agents',
            name: 'GENESIS',
            blurb: 'Master fleet cockpit and process supervisor.',
            what: 'A full-screen PySide6 desktop cockpit supervising ten autonomous background agents. It tracks process trees with psutil, correlates agents through shared entities rather than declared links, auto-restarts on fatal log patterns, and renders a 60,000-particle scalar field face on CPU.',
            tech: ['Python', 'PySide6 (Qt6)', 'psutil', 'NumPy', 'faster-whisper', 'Kokoro TTS', 'Windows Task Scheduler', 'SQLite'],
            status: 'PRIVATE',
            url: 'https://github.com/JeetInTech',
            repo: 'https://github.com/JeetInTech'
        },
        {
            id: 'genesis-job-agent',
            world: 'agents',
            name: 'GENESIS: JOB APPLICATION AGENT',
            blurb: 'Autonomous multi-board recruitment bot.',
            what: 'An end-to-end recruitment agent covering discovery, requirement extraction, LaTeX resume tailoring and multi-step form submission across five job portals. It attaches to a live Chrome session over CDP and records every submission in a SQLite state machine with screenshot verification.',
            tech: ['Python', 'Playwright', 'Chrome CDP', 'Groq LLM', 'SQLite', 'pdflatex', 'BeautifulSoup4', 'Jinja2'],
            status: 'PRIVATE',
            url: 'https://github.com/JeetInTech',
            repo: 'https://github.com/JeetInTech'
        },
        {
            id: 'genesis-yt-auto',
            world: 'agents',
            name: 'GENESIS: VIDEO PIPELINE (YT-AUTO)',
            blurb: 'Autonomous YouTube Shorts generation and publishing engine.',
            what: 'A hands-off short-form pipeline: script generation, a multi-rule "Script Police" pacing validator, Edge-TTS voiceover, FFmpeg assembly into 1080x1920 with burned-in subtitles, then OAuth upload through the YouTube Data API.',
            tech: ['Python', 'Ollama', 'Groq LLM', 'Edge-TTS', 'FFmpeg', 'YouTube Data API v3', 'OAuth 2.0'],
            status: 'PRIVATE',
            url: 'https://github.com/JeetInTech',
            repo: 'https://github.com/JeetInTech'
        },
        {
            id: 'genesis-jobpulse',
            world: 'agents',
            name: 'GENESIS: JOBPULSE',
            blurb: 'Recruitment email intelligence system built with FastAPI.',
            what: 'A FastAPI service that reads the recruitment inbox over the Gmail API, classifies each thread’s stage with an LLM and validates the extraction through Pydantic schemas before writing it to SQLite.',
            tech: ['Python', 'FastAPI', 'Gmail API', 'OAuth 2.0', 'Groq LLM', 'Pydantic v2', 'SQLite'],
            status: 'PRIVATE',
            url: 'https://github.com/JeetInTech',
            repo: 'https://github.com/JeetInTech'
        },
        {
            id: 'openinstaflow',
            world: 'agents',
            name: 'OPENINSTAFLOW',
            blurb: 'Instagram Graph API MCP server.',
            what: 'A Model Context Protocol server that exposes the Instagram Graph API as typed tools, so any MCP-capable assistant can publish, read insights and manage media through an OAuth-scoped connection.',
            tech: ['TypeScript', 'Node.js', '@modelcontextprotocol/sdk', 'Instagram Graph API', 'OAuth 2.0'],
            status: 'PRIVATE',
            url: 'https://github.com/JeetInTech',
            repo: 'https://github.com/JeetInTech'
        },
        {
            id: 'genesis-cold-mails',
            world: 'agents',
            name: 'GENESIS: COLD MAILS ENGINE',
            blurb: 'Autonomous outreach and pitch generation system.',
            what: 'An outreach agent that researches a target from public pages, drafts a pitch grounded in what it found and sends it through the Gmail API, keeping a record so the same contact is never approached twice.',
            tech: ['Python', 'Groq LLM', 'Gmail API', 'OAuth 2.0', 'BeautifulSoup4'],
            status: 'PRIVATE',
            url: 'https://github.com/JeetInTech',
            repo: 'https://github.com/JeetInTech'
        },
        {
            id: 'genesis-linkedin-outreach',
            world: 'agents',
            name: 'GENESIS: LINKEDIN OUTREACH AGENT',
            blurb: 'Headless browser networking automation pipeline.',
            what: 'A Playwright-driven networking pipeline running against a real Edge profile: it works a queue of profiles, sends contextual connection notes generated per target, and persists the whole funnel in SQLite with pacing limits.',
            tech: ['Python', 'Playwright', 'Microsoft Edge', 'SQLite', 'Groq LLM'],
            status: 'PRIVATE',
            url: 'https://github.com/JeetInTech',
            repo: 'https://github.com/JeetInTech'
        },
        {
            id: 'multi-llm-arena',
            world: 'agents',
            name: 'MULTI-LLM DISCUSSION ARENA',
            blurb: 'Cognitive multi-LLM swarm debate system.',
            what: 'A debate harness where several models argue a prompt across rounds under a coordinator that assigns roles, tracks disagreement and synthesises a final position. LangChain handles orchestration; FastAPI exposes the run.',
            tech: ['Python', 'LangChain', 'Groq API', 'Google Gemini', 'FastAPI'],
            status: 'PRIVATE',
            url: 'https://github.com/JeetInTech',
            repo: 'https://github.com/JeetInTech'
        },
        {
            id: 'social-automation',
            world: 'agents',
            name: 'MULTI-PLATFORM SOCIAL AUTOMATION',
            blurb: 'WhatsApp and Instagram messaging automation fleet.',
            what: 'A messaging fleet that drives WhatsApp and Instagram through real browser sessions, generating contextual replies per conversation and throttling itself to stay inside human-plausible pacing.',
            tech: ['Python', 'Selenium', 'Playwright', 'Groq LLM', 'BeautifulSoup4'],
            status: 'PRIVATE',
            url: 'https://github.com/JeetInTech',
            repo: 'https://github.com/JeetInTech'
        },
        {
            id: 'streak-guardian',
            world: 'agents',
            name: 'STREAK GUARDIAN AGENT',
            blurb: 'Git CLI and Windows Task Scheduler automation tool.',
            what: 'A scheduled agent that inspects repository activity through the Git CLI and the GitHub API, then drafts and commits genuine pending work with a locally generated message. Windows Task Scheduler runs it unattended.',
            tech: ['Python', 'Git CLI', 'GitHub API', 'Ollama', 'Windows Task Scheduler'],
            status: 'PRIVATE',
            url: 'https://github.com/JeetInTech',
            repo: 'https://github.com/JeetInTech'
        },

        /* ================================================================
           WORLD 03 — LOCAL GENERATORS
           ================================================================ */
        {
            id: 'ai-video-editor',
            world: 'generators',
            name: 'AI LOCAL VIDEO EDITOR',
            blurb: 'Autonomous vision-guided video editing studio with 4,140 files.',
            what: 'A fully offline editing studio spanning 4,140 files. It transcribes raw recordings on the local GPU, cuts dead air and retakes from audio energy and speech redundancy, then places memes, stingers and overlays using a four-signal weighted score that keeps the presenter’s face and on-screen code clear.',
            tech: ['Python', 'faster-whisper GPU', 'OpenCV', 'FFmpeg', 'Pydub', 'MoviePy', 'NumPy'],
            status: 'PRIVATE',
            url: 'https://github.com/JeetInTech',
            repo: 'https://github.com/JeetInTech'
        },
        {
            id: 'offline-image',
            world: 'generators',
            name: 'OFFLINE IMAGE WORKSTATION',
            blurb: 'Low-VRAM local diffusion system.',
            what: 'A packaged PySide6 desktop front end over a local ComfyUI/Stable Diffusion backend, tuned to generate on low-VRAM consumer GPUs with no cloud call at any point.',
            tech: ['Python', 'PySide6', 'ComfyUI', 'Stable Diffusion', 'PyTorch', 'PyInstaller'],
            status: 'PRIVATE',
            url: 'https://github.com/JeetInTech',
            repo: 'https://github.com/JeetInTech'
        },
        {
            id: 'yt-clip-master',
            world: 'generators',
            name: 'GENESIS: YT-CLIP-MASTER',
            blurb: 'Video repurposing and vertical face-tracking pipeline.',
            what: 'A repurposing pipeline that finds the strongest moments in a long video, reframes them to vertical by tracking the speaker’s face across the crop window, and exports captioned clips through FFmpeg.',
            tech: ['Python', 'OpenCV', 'faster-whisper', 'FFmpeg', 'MoviePy', 'Pydub'],
            status: 'PRIVATE',
            url: 'https://github.com/JeetInTech',
            repo: 'https://github.com/JeetInTech'
        },
        {
            id: 'photo-enhancer',
            world: 'generators',
            name: 'PHOTO ENHANCER & BG REMOVER',
            blurb: 'Real-ESRGAN super-resolution and background-removal system.',
            what: 'A containerised FastAPI microservice that upscales images with Real-ESRGAN and strips backgrounds with Rembg, running both models through ONNX Runtime locally.',
            tech: ['Python', 'FastAPI', 'Real-ESRGAN', 'Rembg', 'ONNX Runtime', 'OpenCV', 'Docker'],
            status: 'PRIVATE',
            url: 'https://github.com/JeetInTech',
            repo: 'https://github.com/JeetInTech'
        },
        {
            id: 'chatterbox',
            world: 'generators',
            name: 'CHATTERBOX AUDIO STUDIO',
            blurb: 'Speech synthesis and audio-processing fork.',
            what: 'A working fork of a speech synthesis stack, extended with a local audio-processing chain for normalisation, trimming and format conversion on generated voice tracks.',
            tech: ['Python', 'Pydub', 'Librosa', 'SoundFile', 'PyAudio'],
            status: 'EXPERIMENTAL',
            url: 'https://github.com/JeetInTech',
            repo: 'https://github.com/JeetInTech'
        },
        {
            id: 'long-video',
            world: 'generators',
            name: 'LONG-FORMAT VIDEO PIPELINE',
            blurb: 'Modular script-to-video assembly system.',
            what: 'A modular pipeline that takes a long-form script, splits it into narrated segments, synthesises each with Edge-TTS and assembles the result through FFmpeg. Each stage is swappable on its own.',
            tech: ['Python', 'FFmpeg', 'MoviePy', 'Edge-TTS', 'Groq LLM'],
            status: 'EXPERIMENTAL',
            url: 'https://github.com/JeetInTech',
            repo: 'https://github.com/JeetInTech'
        },
        {
            id: 'ai-data-analyst',
            world: 'generators',
            name: 'AI DATA ANALYST & AUTOML',
            blurb: 'Out-of-core big-data machine learning engine.',
            what: 'An AutoML engine that works on datasets larger than memory: Dask and PyArrow for out-of-core loading, Pandera for schema validation, Optuna for search over LightGBM and scikit-learn models, MLflow for tracking and LIME for explanation.',
            tech: ['Python', 'Dask', 'PyArrow', 'Pandera', 'Optuna', 'Scikit-Learn', 'LightGBM', 'MLflow', 'LIME'],
            status: 'PRIVATE',
            url: 'https://github.com/JeetInTech/Ai-data-analyst',
            repo: 'https://github.com/JeetInTech/Ai-data-analyst'
        },
        {
            id: 'genesis-linkedin-publisher',
            world: 'generators',
            name: 'GENESIS: LINKEDIN PUBLISHER',
            blurb: 'Autonomous LinkedIn content publishing system with ComfyUI image generation.',
            what: 'A publishing agent that writes the post, generates its accompanying image locally through the ComfyUI API, composes the two with Pillow and ships the result via the LinkedIn REST API.',
            tech: ['Python', 'Groq LLM', 'ComfyUI API', 'LinkedIn REST API', 'Pillow'],
            status: 'PRIVATE',
            url: 'https://github.com/JeetInTech',
            repo: 'https://github.com/JeetInTech'
        },

        /* ================================================================
           WORLD 04 — EXPERIMENTS & TOOLS
           ================================================================ */
        {
            id: 'solo-leveling',
            world: 'experiments',
            name: 'SOLO LEVELING MOBILE APP',
            blurb: 'Gamified fitness and habit platform.',
            what: 'A cross-platform mobile app that frames training and habits as a levelling system. React Native and Expo on the front, with a FastAPI backend running Celery jobs for streaks, quests and progression.',
            tech: ['React Native', 'Expo', 'Kotlin', 'FastAPI', 'Celery', 'Redis', 'SQLite'],
            status: 'PRIVATE',
            url: 'https://github.com/JeetInTech',
            repo: 'https://github.com/JeetInTech'
        },
        {
            id: 'craftbrain-segmentation',
            world: 'experiments',
            name: 'CRAFTBRAIN CUSTOMER SEGMENTATION',
            blurb: 'Unsupervised machine-learning engine.',
            what: 'An unsupervised clustering pipeline over customer behaviour data, producing segment profiles and the plots that explain why each cluster separates.',
            tech: ['Python', 'Scikit-Learn', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Plotly'],
            status: 'PRIVATE',
            url: 'https://github.com/JeetInTech',
            repo: 'https://github.com/JeetInTech'
        },
        {
            id: 'local-cortex',
            world: 'experiments',
            name: 'LOCAL CORTEX',
            blurb: 'Native desktop AI IDE built with Tauri v2 and Rust.',
            what: 'A native desktop AI IDE: a Rust/Tauri v2 shell around a Monaco editor wired to local Ollama models, so chat and code editing share one window with nothing leaving the machine.',
            tech: ['Rust', 'Tauri v2', 'React', 'TypeScript', 'Monaco Editor', 'Ollama'],
            status: 'OPEN SOURCE',
            url: 'https://github.com/JeetInTech/Local-Cortex-your-local-chatgpt-with-built-in-editor',
            repo: 'https://github.com/JeetInTech/Local-Cortex-your-local-chatgpt-with-built-in-editor'
        },
        {
            id: 'cvforge',
            world: 'experiments',
            name: 'CVFORGE ONLINE',
            blurb: 'LaTeX resume-builder prototype.',
            what: 'A browser resume builder that renders structured input into a LaTeX document and compiles it to PDF server-side with pdflatex. React 18 front end, FastAPI compile service.',
            tech: ['React 18', 'TypeScript', 'FastAPI', 'pdflatex', 'Vite'],
            status: 'OPEN SOURCE',
            url: 'https://github.com/JeetInTech/CvForge-Online',
            repo: 'https://github.com/JeetInTech/CvForge-Online'
        },
        {
            id: 'touchless-exp',
            world: 'experiments',
            name: 'TOUCHLESS GESTURES & 3D CONTROL',
            blurb: 'Real-time MediaPipe HCI experiment.',
            what: 'The research side of the touchless control work: measuring how far MediaPipe hand landmarks can be pushed as an input device, and how gesture noise, latency and 3D manipulation behave under real webcam conditions.',
            tech: ['Python', 'OpenCV', 'MediaPipe', 'PyAutoGUI', 'PyOpenGL', 'NumPy'],
            status: 'EXPERIMENTAL',
            url: 'https://www.amazon.com/dp/B0FBLC1RLT',
            repo: null
        }
    ]
};
