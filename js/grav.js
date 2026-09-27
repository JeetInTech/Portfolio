/**
 * grav.js — Gravitational Portfolio Interactions
 * Handles reveals, trajectory, systems inspector, orbit skills,
 * terminal commands, project modals, and contact form.
 */

/* ========================================================
   1. SECTION REVEAL — IntersectionObserver
   ======================================================== */
(function initReveal() {
    var revealEls = document.querySelectorAll('.grav-reveal');
    if (!revealEls.length) return;
    var io = new IntersectionObserver(function(entries) {
        entries.forEach(function(e) {
            if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(function(el) { io.observe(el); });
})();

/* ========================================================
   2. TRAJECTORY — Scroll-activated milestones
   ======================================================== */
(function initTrajectory() {
    var milestones = document.querySelectorAll('.trajectory-milestone');
    var progressBar = document.getElementById('trajectoryProgress');
    if (!milestones.length) return;
    var io = new IntersectionObserver(function(entries) {
        entries.forEach(function(e) { if (e.isIntersecting) e.target.classList.add('active'); });
    }, { threshold: 0.35 });
    milestones.forEach(function(m) { io.observe(m); });
    var track = document.querySelector('.trajectory-track');
    if (track && progressBar) {
        window.addEventListener('scroll', function() {
            var rect = track.getBoundingClientRect();
            var pct = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / rect.height));
            progressBar.style.height = (pct * 100) + '%';
        }, { passive: true });
    }
})();

/* ========================================================
   3. ARCHITECTURE NODE INSPECTOR
   ======================================================== */
/* Every value below is traceable to a real system in the CV.
   No invented latency/uptime figures. */
var gravNodeData = {
    input: {
        title: '01. Multimodal Input',
        desc: 'Captures streaming audio, camera frames and text. Sebastian runs full-duplex audio into Gemini Live at 16 kHz mono, with a Discord bridge resampling 48 kHz stereo down to the pipeline rate. Vision handled by MediaPipe and OpenCV.',
        data: [['Audio Format', '16 kHz mono PCM'], ['Transport', 'Gemini Live (full-duplex)'], ['Vision', 'MediaPipe / OpenCV'], ['Bridge', 'Discord 48k → 16k']],
        stack: ['PyAudio', 'MediaPipe', 'OpenCV', 'Gemini Live API'],
        projects: ['Sebastian AI OS', 'SANA Voice Butler']
    },
    gateway: {
        title: '02. FastAPI Gateway',
        desc: 'Neuroviai runs 6 decoupled FastAPI microservices covering identity, billing, media generation and scheduling. Razorpay webhooks are verified with HMAC-SHA256; a client-side ServerWarmer pattern cut cold starts from 5.2s to sub-150ms.',
        data: [['Microservices', '6 (decoupled)'], ['Auth', 'JWT / OAuth 2.0'], ['Rate Limit', '12k tokens/min'], ['Cold Start', '5.2s → <150 ms']],
        stack: ['FastAPI', 'Pydantic v2', 'Redis', 'Nginx', 'Razorpay'],
        projects: ['Neuroviai']
    },
    orchestrator: {
        title: '03. Agent Orchestration',
        desc: 'Stateful multi-agent routing built on LangGraph StateGraph with ReAct-style reasoning loops. Sebastian is structured as 25 modules; Virtual Therapist layers rule-based safety guardrails that run before any LLM call.',
        data: [['Framework', 'LangGraph StateGraph'], ['Pattern', 'Multi-Agent ReAct'], ['Modules', '25 (Sebastian)'], ['Protocol', 'MCP SDK']],
        stack: ['LangGraph', 'LangChain', 'MCP SDK', 'Python'],
        projects: ['Sebastian AI OS', 'Virtual Therapist']
    },
    memory: {
        title: '04. Vector Memory',
        desc: 'Turn-by-turn semantic recall on PostgreSQL + pgvector cosine similarity, measured at sub-10ms lookups, with a persistent Knowledge Graph correlating entities across sessions. AIExamTool uses FAISS for grounded syllabus retrieval.',
        data: [['Index', 'pgvector (cosine)'], ['Lookup', 'sub-10 ms'], ['Graph', 'Entity correlation'], ['Also', 'ChromaDB / FAISS']],
        stack: ['pgvector', 'PostgreSQL', 'ChromaDB', 'FAISS'],
        projects: ['Sebastian AI OS', 'AIExamTool']
    },
    inference: {
        title: '05. Multi-Tier LLM Gateway',
        desc: 'A 4-tier circuit-breaking cascade: Gemini Pro → Groq Llama-3 → HuggingFace → local Ollama. Keeps Neuroviai at 99.7% uptime under burst traffic, and multi-provider failover plus prompt budgeting cut client inference spend by up to 60%.',
        data: [['Cascade', 'Gemini → Groq → HF → Ollama'], ['Pattern', 'Circuit breaker'], ['Uptime', '99.7% (Neuroviai)'], ['Cost Saving', 'up to 60%']],
        stack: ['Gemini', 'Groq Llama-3', 'HuggingFace', 'Ollama'],
        projects: ['Neuroviai']
    },
    tools: {
        title: '06. Tool Execution Layer',
        desc: '92 registered tools split across Green (read-only) and Yellow (action-required) permission gates, driving dynamic npx child-process MCP servers for GitHub, Playwright and Filesystem access.',
        data: [['Registered Tools', '92'], ['Permission Gates', 'Green / Yellow'], ['MCP Servers', 'GitHub, Playwright, FS'], ['Process', 'npx child-process']],
        stack: ['MCP SDK', 'Playwright', 'Python', 'FFmpeg'],
        projects: ['Sebastian AI OS', 'OpenInstaFlow']
    },
    stream: {
        title: '07. Real-Time Streaming',
        desc: 'Full-duplex bidirectional audio streaming through Gemini Live with roughly 400ms turnaround and barge-in interruption detection, voiced by Kokoro neural TTS.',
        data: [['Mode', 'Full-duplex'], ['Turnaround', '~400 ms'], ['Feature', 'Barge-in detection'], ['Voice', 'Kokoro neural TTS']],
        stack: ['WebSockets', 'Gemini Live', 'Kokoro TTS', 'PyAudio'],
        projects: ['Sebastian AI OS', 'SANA Voice Butler']
    }
};

function selectGravNode(key) {
    document.querySelectorAll('.sys-node').forEach(function(n) { n.classList.remove('active'); });
    var node = document.querySelector('[data-node="' + key + '"]');
    if (node) node.classList.add('active');
    var d = gravNodeData[key];
    if (!d) return;
    var inspector = document.querySelector('.systems-inspector');
    inspector.style.opacity = '0.4';
    inspector.style.transform = 'translateY(8px)';
    inspector.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    setTimeout(function() {
        document.getElementById('gravInspectorTitle').textContent = d.title;
        document.getElementById('gravInspectorDesc').textContent = d.desc;
        var dataEl = document.getElementById('gravInspectorData');
        if (dataEl && d.data) {
            dataEl.innerHTML = d.data.map(function(row) {
                return '<div class="inspector-datum"><div class="datum-key">' + row[0] +
                       '</div><div class="datum-val">' + row[1] + '</div></div>';
            }).join('');
        }
        var tagsEl = document.getElementById('gravInspectorProjects');
        tagsEl.innerHTML = d.projects.map(function(p) { return '<span class="deployment-tag">' + p + '</span>'; }).join('');
        var stackEl = document.getElementById('gravInspectorStack');
        if (stackEl && d.stack) {
            stackEl.innerHTML = d.stack.map(function(s) { return '<span class="cat-skill-chip">' + s + '</span>'; }).join('');
        }
        inspector.style.opacity = '1';
        inspector.style.transform = 'translateY(0)';
    }, 180);
}

/* ========================================================
   4. ARSENAL — ORBIT SKILLS VISUAL
   ======================================================== */
(function initOrbitSkills() {
    var container = document.getElementById('orbitSkills');
    if (!container) return;
    var skills = ['Python', 'FastAPI', 'LangChain', 'Next.js', 'React', 'PyTorch', 'Docker', 'pgvector', 'Gemini', 'LangGraph', 'AWS', 'TypeScript'];
    var total = skills.length;

    // Create dot elements
    skills.forEach(function(s, i) {
        var el = document.createElement('span');
        el.className = 'orbit-skill-dot';
        el.textContent = s;
        container.appendChild(el);
    });
    var dots = Array.from(container.querySelectorAll('.orbit-skill-dot'));
    var deg = 0;

    function getSize() {
        var rect = container.parentElement ? container.parentElement.getBoundingClientRect() : container.getBoundingClientRect();
        return Math.min(rect.width, rect.height) || 320;
    }

    function spin() {
        deg += 0.018;
        var size = getSize();
        var outerRadius = size * 0.44; // 88% of half width
        var innerRadius = size * 0.30; // 60% of half width

        dots.forEach(function(dot, i) {
            var radius = i % 2 === 0 ? outerRadius : innerRadius;
            var baseAngle = (i / total) * 2 * Math.PI;
            var a = baseAngle + (deg * Math.PI / 180);
            var cx = size / 2;
            var cy = size / 2;
            var x = cx + radius * Math.cos(a);
            var y = cy + radius * Math.sin(a);
            // Translate from top-left = 50%/50%
            dot.style.transform = 'translate(' + (x - (size / 2)) + 'px, ' + (y - (size / 2)) + 'px) translate(-50%, -50%)';
        });
        requestAnimationFrame(spin);
    }
    spin();
})();

/* ========================================================
   5. TERMINAL
   ======================================================== */
(function initGravTerminal() {
    var output = document.getElementById('terminalOutput');
    var input = document.getElementById('terminalInput');
    var submit = document.getElementById('terminalSubmit');
    if (!output || !input) return;

    var cmds = {
        help: '<span class="term-grav-sys">available commands:</span>\n<span class="term-grav-key">  whoami   </span><span class="term-grav-val">  Identity profile</span>\n<span class="term-grav-key">  neurovia </span><span class="term-grav-val">  Flagship SaaS details</span>\n<span class="term-grav-key">  projects </span><span class="term-grav-val">  Engineering projects</span>\n<span class="term-grav-key">  skills   </span><span class="term-grav-val">  Technology arsenal</span>\n<span class="term-grav-key">  resume   </span><span class="term-grav-val">  CV download links</span>\n<span class="term-grav-key">  contact  </span><span class="term-grav-val">  Contact channels</span>\n<span class="term-grav-key">  clear    </span><span class="term-grav-val">  Clear terminal</span>',
        whoami: '<span class="term-grav-key">Name    </span> <span class="term-grav-val">Sangramjeet Ghosh</span>\n<span class="term-grav-key">Role    </span> <span class="term-grav-val">AI Engineer &amp; Founder @ Neuroviai</span>\n<span class="term-grav-key">Degree  </span> <span class="term-grav-val">B.Tech CSE (AI/ML) · GPA 8.0/10</span>\n<span class="term-grav-key">Stack   </span> <span class="term-grav-val">Python · FastAPI · LangGraph · Next.js · pgvector · AWS</span>\n<span class="term-grav-key">Status  </span> <span class="term-grav-val">OPEN TO HIRE · OPEN TO COLLABORATE</span>',
        neurovia: '<span class="term-grav-sys">// NEUROVIAI — LIVE SaaS</span>\n<span class="term-grav-key">URL     </span> <span class="term-grav-val">https://neuroviai.dev/</span>\n<span class="term-grav-key">Users   </span> <span class="term-grav-val">1.2K+ monthly visitors, paying users</span>\n<span class="term-grav-key">Uptime  </span> <span class="term-grav-val">99.7% SLA</span>\n<span class="term-grav-key">LLM     </span> <span class="term-grav-val">4-tier: Gemini -> GPT-4 -> Groq -> Claude</span>',
        projects: '<span class="term-grav-sys">// 40+ PROJECTS</span>\n<span class="term-grav-val">1. Neuroviai</span>   — Live SaaS, Next.js 14 + FastAPI\n<span class="term-grav-val">2. Second Brain</span>  — Knowledge mgmt, pgvector + Gemini\n<span class="term-grav-val">3. SANA</span>          — Voice AI, React 19 + Three.js\n<span class="term-grav-val">4. Sebastian</span>     — Autonomous AI OS, 92 tools\n<span class="term-grav-val">5. Crafting Brain</span>— Creative agency platform',
        skills: '<span class="term-grav-sys">// ARSENAL</span>\n<span class="term-grav-key">AI/LLMs </span> <span class="term-grav-val">LangChain · LangGraph · RAG · Gemini · GPT-4 · Groq</span>\n<span class="term-grav-key">ML/CV   </span> <span class="term-grav-val">PyTorch · TensorFlow · OpenCV · MediaPipe · BERT</span>\n<span class="term-grav-key">Backend </span> <span class="term-grav-val">Python · FastAPI · PostgreSQL · pgvector · Supabase</span>\n<span class="term-grav-key">Frontend</span> <span class="term-grav-val">React 19 · Next.js 15 · TypeScript · Three.js</span>\n<span class="term-grav-key">Cloud   </span> <span class="term-grav-val">AWS (Certified) · Docker · GitHub Actions · Vercel</span>',
        resume: '<span class="term-grav-sys">// DOWNLOADS (7 PROFILES)</span>\n<span class="term-grav-key">AI/AGENT</span> <span class="term-grav-val">../resumes/AI_Agentic_Systems_Engineer.pdf</span>\n<span class="term-grav-key">FULLSTACK</span><span class="term-grav-val">../resumes/Full_Stack_Software_Engineer.pdf</span>\n<span class="term-grav-key">ML/DATA </span> <span class="term-grav-val">../resumes/Data_Scientist_Machine_Learning.pdf</span>\n<span class="term-grav-key">BACKEND </span> <span class="term-grav-val">../resumes/Backend_Software_Engineer.pdf</span>\n<span class="term-grav-key">FRONTEND</span> <span class="term-grav-val">../resumes/Frontend_Software_Engineer.pdf</span>\n<span class="term-grav-key">DESKTOP </span> <span class="term-grav-val">../resumes/Desktop_Systems_Automation_Engineer.pdf</span>\n<span class="term-grav-key">MASTER CV</span><span class="term-grav-val">../resumes/Sangramjeet_Ghosh_UK_CV.pdf</span>',
        contact: '<span class="term-grav-sys">// CONTACT</span>\n<span class="term-grav-key">Email   </span> <span class="term-grav-val">sangramjeet47@gmail.com</span>\n<span class="term-grav-key">LinkedIn</span> <span class="term-grav-val">linkedin.com/in/sangramjeetghosh</span>\n<span class="term-grav-key">GitHub  </span> <span class="term-grav-val">github.com/JeetInTech</span>\n<span class="term-grav-key">Twitter </span> <span class="term-grav-val">@SangramJee97448</span>'
    };

    function printLine(html, isCmd) {
        var p = document.createElement('p');
        p.className = 'term-grav-line';
        p.innerHTML = isCmd
            ? '<span class="term-grav-prompt">JEET@SYSTEM ~$</span> <span class="term-grav-cmd">' + html + '</span>'
            : html;
        output.appendChild(p);
        output.scrollTop = output.scrollHeight;
    }

    function runCmd(cmd) {
        var t = (cmd || '').trim().toLowerCase();
        printLine(cmd || '', true);
        if (!t) return;
        if (t === 'clear') {
            output.innerHTML = '';
            printLine('<span class="term-grav-sys">system:</span> Cleared. Type <span class="term-grav-cmd">help</span>.');
            return;
        }
        var result = cmds[t];
        if (result) {
            printLine(result);
        } else {
            printLine('<span class="term-grav-sys">error:</span> Unknown: <span class="term-grav-cmd">' + t + '</span>. Type <span class="term-grav-cmd">help</span>.');
        }
    }

    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') { runCmd(input.value); input.value = ''; }
    });
    if (submit) {
        submit.addEventListener('click', function() { runCmd(input.value); input.value = ''; input.focus(); });
    }
    window._runGravCmd = runCmd;
})();

function executeTermCommand(cmd) {
    if (window._runGravCmd) window._runGravCmd(cmd);
}

/* ========================================================
   6. PROJECT POPUP
   Live sites can't be iframed (neuroviai.dev sends
   X-Frame-Options: SAMEORIGIN), so the popup shows details and
   any click inside it opens the real site in a new tab.
   ======================================================== */
var PROJECTS = {
    neurovia: {
        title: 'Neuroviai',
        url: 'https://neuroviai.dev/',
        tagline: 'Next-gen AI content automation SaaS — live and in production.',
        desc: 'Flagship platform with paying customers and 1.2K+ monthly visitors at 99.7% uptime. Six FastAPI microservices behind a JWT gateway, a 4-tier LLM fallback chain, and Razorpay checkout with credit-deduction middleware.',
        stack: ['Next.js 14', 'TypeScript', 'FastAPI', 'PostgreSQL', 'Gemini AI', 'Razorpay'],
        meta: [['Status', 'Live · Flagship SaaS'], ['Users', '1.2K+ monthly'], ['Uptime', '99.7%'], ['Role', 'Founder · Full build']]
    },
    secondbrain: {
        title: 'Second Brain',
        url: 'https://secondbraindev.vercel.app/',
        tagline: 'AI-powered knowledge management engine.',
        desc: 'Semantic search, automatic summarisation, and conversational Q&A over your own notes. Hybrid retrieval combines dense vector embeddings with metadata filtering.',
        stack: ['Next.js 15', 'TypeScript', 'Prisma ORM', 'PostgreSQL', 'Gemini 2.5'],
        meta: [['Status', 'Live web app'], ['Retrieval', 'pgvector + metadata'], ['Source', 'github.com/JeetInTech/Second-Brain']]
    },
    sana: {
        title: 'SANA',
        url: 'https://github.com/JeetInTech/SANA-MULTILINGUAL-AI-ASSISTANT',
        tagline: 'Multilingual AI voice butler with a holographic face visualiser.',
        desc: 'English and Hindi, sub-second latency. Bidirectional PCM 16kHz streaming over WebSockets into Gemini Live, rendered through a Three.js visualiser driven by the live audio buffer.',
        stack: ['React 19', 'TypeScript', 'Vite 6', 'Gemini Live', 'Three.js', 'Web Audio'],
        meta: [['Status', 'Voice-first AI'], ['Latency', 'Sub-second TTFB'], ['Languages', 'English · Hindi']]
    },
    crafting: {
        title: 'Crafting Brain',
        url: 'https://craftingbrain.com/',
        tagline: 'Creative agency web platform.',
        desc: 'Client platform with interactive animations and optimised responsive layouts across the full breakpoint range.',
        stack: ['React 18', 'styled-components', 'Axios', 'React Router'],
        meta: [['Status', 'Live client platform'], ['Role', 'Frontend build']]
    }
};

(function initProjectPopup() {
    var modal = document.getElementById('projectModal');
    var content = document.getElementById('modalContent');
    if (!modal || !content) return;

    var current = null;

    function open(key) {
        var d = PROJECTS[key];
        if (!d) return;
        current = d;

        document.getElementById('modalTitle').textContent = d.title;
        document.getElementById('modalTagline').textContent = d.tagline;
        document.getElementById('modalDesc').textContent = d.desc;
        document.getElementById('modalHost').textContent = d.url.replace(/^https?:\/\//, '').replace(/\/$/, '');
        var stackEl = document.getElementById('modalStack');
        stackEl.innerHTML = '';
        d.stack.forEach(function(s) {
            var chip = document.createElement('span');
            chip.className = 'modal-stack-chip';
            chip.textContent = s;
            stackEl.appendChild(chip);
        });

        var metaEl = document.getElementById('modalMeta');
        metaEl.innerHTML = '';
        d.meta.forEach(function(pair) {
            var row = document.createElement('div');
            row.className = 'modal-meta-row';
            var k = document.createElement('span');
            k.className = 'modal-meta-key';
            k.textContent = pair[0];
            var v = document.createElement('span');
            v.className = 'modal-meta-val';
            v.textContent = pair[1];
            row.appendChild(k);
            row.appendChild(v);
            metaEl.appendChild(row);
        });

        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function close() {
        modal.classList.remove('open');
        document.body.style.overflow = '';
        current = null;
    }

    // Any element carrying data-open-project opens the popup
    document.addEventListener('click', function(e) {
        var trigger = e.target.closest('[data-open-project]');
        if (trigger) {
            e.preventDefault();
            open(trigger.getAttribute('data-open-project'));
        }
    });

    // Keyboard access for the card visuals
    document.addEventListener('keydown', function(e) {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        var trigger = e.target.closest && e.target.closest('[data-open-project]');
        if (trigger) { e.preventDefault(); open(trigger.getAttribute('data-open-project')); }
    });

    // Click anywhere inside the popup → open the live site in a new tab
    content.addEventListener('click', function(e) {
        if (e.target.closest('#modalClose')) { close(); return; }
        if (!current) return;
        window.open(current.url, '_blank', 'noopener');
        close();
    });

    // Backdrop click / Escape closes
    modal.addEventListener('click', function(e) { if (e.target === modal) close(); });
    document.addEventListener('keydown', function(e) { if (e.key === 'Escape') close(); });

    window.openProjectPopup = open;
})();

/* ========================================================
   6b. INFO POPUP
   Replaces the old about / skills / projects pages. Content lives as
   hidden markup in the page; a [data-popup="id"] trigger clones
   #popup-<id> into the modal body.
   ======================================================== */
(function initInfoPopup() {
    var modal = document.getElementById('infoModal');
    var body = document.getElementById('infoModalBody');
    var titleEl = document.getElementById('infoModalTitle');
    if (!modal || !body) return;

    function open(id) {
        var source = document.getElementById('popup-' + id);
        if (!source) return;
        titleEl.textContent = source.getAttribute('data-popup-title') || 'Details';
        body.innerHTML = '';
        body.appendChild(source.cloneNode(true));
        body.scrollTop = 0;
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function close() {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }

    document.addEventListener('click', function(e) {
        var trigger = e.target.closest('[data-popup]');
        if (trigger) {
            e.preventDefault();
            open(trigger.getAttribute('data-popup'));
            return;
        }
        if (e.target === modal || e.target.closest('#infoModalClose')) close();
    });

    document.addEventListener('keydown', function(e) { if (e.key === 'Escape') close(); });
})();

/* ========================================================
   7. CONTACT FORM
   ======================================================== */
(function initContactForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        var btn = document.getElementById('submitBtn');
        var btnText = btn ? btn.querySelector('.btn-text') : null;
        var btnLoader = btn ? btn.querySelector('.btn-loader') : null;
        if (btn) btn.disabled = true;
        if (btnText) btnText.style.display = 'none';
        if (btnLoader) btnLoader.style.display = 'inline';
        var data = {
            name: (document.getElementById('form-name') || {}).value || '',
            email: (document.getElementById('form-email') || {}).value || '',
            designation: (document.getElementById('form-role') || {}).value || '',
            subject: (document.getElementById('form-subject') || {}).value || '',
            message: (document.getElementById('form-message') || {}).value || ''
        };
        function showSuccess() {
            if (btn) btn.disabled = false;
            if (btnText) { btnText.style.display = 'inline'; btnText.textContent = 'Transmitted \u2713'; }
            if (btnLoader) btnLoader.style.display = 'none';
            setTimeout(function() { form.reset(); if (btnText) btnText.textContent = 'Transmit Message \u2197'; }, 3500);
        }
        fetch('https://portfolio-server-eysf.onrender.com/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
            .then(function(r) { return r.ok ? r.json() : Promise.reject(); })
            .then(function(res) { if (!res.success) return Promise.reject(); showSuccess(); })
            .catch(function() {
                var body = encodeURIComponent('Name: ' + data.name + '\nEmail: ' + data.email + '\nDesignation: ' + data.designation + '\n\n' + data.message);
                window.open('mailto:sangramjeet47@gmail.com?subject=' + encodeURIComponent(data.subject) + '&body=' + body);
                showSuccess();
            });
    });
})();
