// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    
    // --- Custom Cursor ---
    const cursor = document.querySelector('.cursor');
    const cursorDot = document.querySelector('.cursor-dot');
    
    let mouseX = -100;
    let mouseY = -100;

    // Check if device supports hover
    if (window.matchMedia('(pointer: fine)').matches && cursor && cursorDot) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
            
            cursorDot.style.left = mouseX + 'px';
            cursorDot.style.top = mouseY + 'px';
        });

        // Add hover effect to interactive elements
        const hoverElements = document.querySelectorAll('a, button, .icon-link, .social-icon, .profile-frame, .floating-badge, .credential-card, .cert-card, .stat-card, .role-pill, .project-card, .skill-category-card, .subskill-pill, .sv-logo');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
            });
        });
    }

    // --- Interactive Background Particle Canvas System ---
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        let particles = [];

        const colors = {
            primary: '127, 90, 240',
            secondary: '44, 182, 125'
        };

        // Particle Class
        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.radius = Math.random() * 1.8 + 1.2;
                this.vx = (Math.random() - 0.5) * 0.6;
                this.vy = (Math.random() - 0.5) * 0.6;
                this.alpha = Math.random() * 0.5 + 0.25;
                this.colorType = Math.random() > 0.4 ? 'primary' : 'secondary';
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Bounce at edges
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;

                // Gentle mouse repulsion
                if (mouseX > 0 && mouseY > 0) {
                    const dx = mouseX - this.x;
                    const dy = mouseY - this.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const maxDist = 130;

                    if (dist < maxDist && dist > 0) {
                        const force = (maxDist - dist) / maxDist;
                        this.x -= (dx / dist) * force * 1.5;
                        this.y -= (dy / dist) * force * 1.5;
                    }
                }
            }

            draw() {
                const rgb = this.colorType === 'primary' ? colors.primary : colors.secondary;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${rgb}, ${this.alpha})`;
                ctx.shadowBlur = 10;
                ctx.shadowColor = `rgba(${rgb}, ${this.alpha * 0.8})`;
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }

        function initParticles() {
            const count = Math.min(Math.floor((width * height) / 18000), 75);
            particles = [];
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        }

        initParticles();

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initParticles();
        });

        // Animation Loop
        function animate() {
            ctx.clearRect(0, 0, width, height);

            // Draw connection lines
            const connectionDistance = 115;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < connectionDistance) {
                        const alpha = (1 - dist / connectionDistance) * 0.18;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(${colors.primary}, ${alpha})`;
                        ctx.lineWidth = 0.85;
                        ctx.stroke();
                    }
                }
            }

            // Draw mouse connection lines
            if (mouseX > 0 && mouseY > 0) {
                for (let i = 0; i < particles.length; i++) {
                    const dx = mouseX - particles[i].x;
                    const dy = mouseY - particles[i].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 140) {
                        const alpha = (1 - dist / 140) * 0.28;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(mouseX, mouseY);
                        ctx.strokeStyle = `rgba(${colors.secondary}, ${alpha})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }

            // Update & draw particles
            particles.forEach(p => {
                p.update();
                p.draw();
            });

            requestAnimationFrame(animate);
        }

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initParticles();
        });

        animate();
    }

    // --- Skills & Expertise Interactive Accordion Drawers ---
    const skillCards = document.querySelectorAll('.skill-category-card');
    skillCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('active');
        });
    });

    // --- Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Mobile Navigation Menu Toggle (Android & iOS Touch Support) ---
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = navLinks.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (icon) {
                icon.className = isOpen ? 'fas fa-xmark' : 'fas fa-bars';
            }
        });

        // Close mobile drawer on link tap
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                if (icon) icon.className = 'fas fa-bars';
            });
        });

        // Close when clicking/touching outside
        document.addEventListener('click', (e) => {
            if (navbar && !navbar.contains(e.target)) {
                navLinks.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                if (icon) icon.className = 'fas fa-bars';
            }
        });
    }

    // --- Smooth Scrolling for Navigation Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Active Link Switching on Scroll ---
    const sections = document.querySelectorAll('section');
    const navLinksList = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= (sectionTop - navbar.offsetHeight - 50)) {
                current = section.getAttribute('id');
            }
        });

        navLinksList.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    };

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);
    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // Utility function for safe HTML rendering
    function escapeHtml(str) {
        if (!str) return '';
        return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }

    // --- Contact Form Submission Handler ---
    const contactForm = document.getElementById('contact-form') || document.querySelector('.contact-form');
    const contactAlert = document.getElementById('contact-alert');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]') || contactForm.querySelector('button');
            const originalBtnContent = submitBtn.innerHTML;

            const nameInput = contactForm.querySelector('#name') || document.getElementById('name');
            const emailInput = contactForm.querySelector('#email') || document.getElementById('email');
            const messageInput = contactForm.querySelector('#message') || document.getElementById('message');

            const name = nameInput ? nameInput.value.trim() : '';
            const email = emailInput ? emailInput.value.trim() : '';
            const message = messageInput ? messageInput.value.trim() : '';

            if (!name || !email || !message) {
                alert("Please fill in Name, Email, and Message before submitting!");
                return;
            }

            // Visual loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span>Sending...</span> <span class="submit-spinner"></span>`;
            if (contactAlert) {
                contactAlert.style.display = 'none';
            }

            try {
                if (window.saveContactMessage) {
                    await window.saveContactMessage({ name, email, message });
                } else {
                    const localMsgs = JSON.parse(localStorage.getItem('sv_portfolio_messages') || '[]');
                    localMsgs.unshift({
                        name,
                        email,
                        message,
                        createdAt: new Date().toISOString(),
                        displayDate: new Date().toLocaleString()
                    });
                    localStorage.setItem('sv_portfolio_messages', JSON.stringify(localMsgs));
                }

                // Clean "Message Sent!" feedback
                submitBtn.innerHTML = `<span>Message Sent!</span> <i class="fas fa-check"></i>`;
                submitBtn.style.background = 'var(--secondary)';

                if (contactAlert) {
                    contactAlert.className = 'contact-alert success';
                    contactAlert.innerHTML = `<i class="fas fa-circle-check"></i> <div><strong>Message Sent!</strong> Thank you ${escapeHtml(name)}, Sakthi will reach out to you soon.</div>`;
                    contactAlert.style.display = 'flex';
                }

                contactForm.reset();

                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnContent;
                    submitBtn.style.background = '';
                }, 3500);
            } catch (err) {
                console.error("Save error:", err);
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnContent;

                if (contactAlert) {
                    contactAlert.className = 'contact-alert error';
                    contactAlert.innerHTML = `<i class="fas fa-circle-exclamation"></i> <span>Something went wrong. Please email directly to <a href="mailto:sakthivigneshvcsemec@gmail.com" style="text-decoration:underline;">sakthivigneshvcsemec@gmail.com</a></span>`;
                    contactAlert.style.display = 'flex';
                }
            }
        });
    }

    // --- 3D Tilt Effect on Profile Image ---
    const profileContainer = document.querySelector('.profile-card-container');
    const profileFrame = document.querySelector('.profile-frame');
    if (profileContainer && profileFrame && window.matchMedia('(pointer: fine)').matches) {
        profileContainer.addEventListener('mousemove', (e) => {
            const rect = profileContainer.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            const rotateX = -(y / (rect.height / 2)) * 12;
            const rotateY = (x / (rect.width / 2)) * 12;
            
            profileFrame.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        profileContainer.addEventListener('mouseleave', () => {
            profileFrame.style.transform = '';
        });
    }

    // --- SV Portfolio AI Agent System ---
    const aiWidget = document.getElementById('ai-agent-widget');
    const aiLauncher = document.getElementById('ai-agent-launcher');
    const aiChatWindow = document.getElementById('ai-chat-window');
    const aiCloseBtn = document.getElementById('ai-close-btn');
    const aiClearBtn = document.getElementById('ai-clear-btn');
    const aiMessages = document.getElementById('ai-chat-messages');
    const aiForm = document.getElementById('ai-chat-form');
    const aiInput = document.getElementById('ai-chat-input');

    if (aiWidget && aiLauncher && aiChatWindow) {
        // Toggle Chat Window
        aiLauncher.addEventListener('click', () => {
            const isOpen = aiChatWindow.classList.toggle('open');
            aiChatWindow.setAttribute('aria-hidden', !isOpen);
            if (isOpen) {
                setTimeout(() => aiInput.focus(), 300);
            }
        });

        aiCloseBtn.addEventListener('click', () => {
            aiChatWindow.classList.remove('open');
            aiChatWindow.setAttribute('aria-hidden', 'true');
        });

        // Clear Chat
        aiClearBtn.addEventListener('click', () => {
            aiMessages.innerHTML = `
                <div class="ai-msg ai-msg-bot">
                    <div class="ai-msg-avatar"><i class="fas fa-robot"></i></div>
                    <div class="ai-msg-bubble">
                        <p>👋 Conversation reset! How can I assist you with Sakthi's portfolio?</p>
                        <div class="ai-quick-prompts">
                            <button class="ai-prompt-chip" data-query="Tell me about Sakthi">👤 About Sakthi</button>
                            <button class="ai-prompt-chip" data-query="What internships has he done?">💼 Internships</button>
                            <button class="ai-prompt-chip" data-query="What are his technical skills?">⚡ Tech Stack</button>
                            <button class="ai-prompt-chip" data-query="Show me his featured projects">🚀 Projects</button>
                            <button class="ai-prompt-chip" data-query="How can I contact Sakthi?">📬 Contact & Hire</button>
                        </div>
                    </div>
                </div>
            `;
        });

        // --- Structured Response Builders for Sakthi Vignesh ---
        function getAboutResponse() {
            return {
                text: "👤 <strong>About Sakthi Vignesh V:</strong><br><br>" +
                      "Sakthi is a Computer Science and Engineering student at <strong>Mahendra Engineering College</strong> (2024–2028 Batch).<br><br>" +
                      "• <strong>Core Focus:</strong> Machine Learning, Full-Stack Web Development, and human-centric UI/UX Design.<br>" +
                      "• <strong>Industry Experience:</strong> Web Development Intern (Star Performer) at <strong>Infobyte</strong>.<br>" +
                      "• <strong>Verified Credential:</strong> <strong>NASSCOM SkillWallet</strong> emerging tech credential.<br>" +
                      "• <strong>Current Status:</strong> 🟢 <strong>Actively Open to Work</strong> for Internships & Entry-Level Roles!",
                prompts: ["⚡ Tech Stack", "💼 Internships", "🚀 Featured Projects", "📬 Contact & Hire"]
            };
        }

        function getInternshipsResponse() {
            return {
                text: "💼 <strong>Industry Experience & Credentials:</strong><br><br>" +
                      "🌟 <strong>Infobyte – Web Development Intern</strong> (Remote)<br>" +
                      "• Awarded <strong>Star Performer</strong> for architectural speed, scalability, and responsiveness.<br>" +
                      "• Developed scalable, mobile-first client applications.<br><br>" +
                      "🛡️ <strong>NASSCOM SkillWallet Credential</strong> (FutureSkills Prime)<br>" +
                      "• Verified experiential learning & emerging technologies credential.<br>" +
                      "• Validated competencies in Software Engineering, Cloud workflows, and modern architectures.",
                prompts: ["🚀 Featured Projects", "⚡ Tech Stack", "📬 Contact & Hire"]
            };
        }

        function getTechStackResponse() {
            return {
                text: "⚡ <strong>Sakthi's Core Technical Capabilities:</strong><br><br>" +
                      "1. <strong>AI & Machine Learning:</strong> TensorFlow, PyTorch, Generative AI, Prompt Engineering, Scikit-Learn.<br>" +
                      "2. <strong>Full-Stack Web Dev:</strong> HTML5, CSS3, JavaScript (ES6+), Node.js, MongoDB, REST APIs, Firebase.<br>" +
                      "3. <strong>Languages:</strong> Python, JavaScript, Java (NPTEL Certified), C.<br>" +
                      "4. <strong>UI/UX Design:</strong> Figma, Design Systems, Mobile-First Prototyping (Competition Winner).<br>" +
                      "5. <strong>DevOps & Systems:</strong> Git/GitHub, Linux (Red Hat Certified), Cloud Datastores.",
                prompts: ["💼 Internships", "🚀 Featured Projects", "📜 Certifications", "📬 Contact & Hire"]
            };
        }

        function getProjectsResponse() {
            return {
                text: "🚀 <strong>Top Featured Projects:</strong><br><br>" +
                      "1. 🛒 <strong>E-Commerce Marketplace:</strong> Full-stack web application with cart management and sleek checkout.<br>" +
                      "2. 📈 <strong>Stock Market Platform:</strong> Financial analytics platform tracking live market movements & portfolio trends.<br>" +
                      "3. 🤖 <strong>Sofi AI:</strong> Intelligent conversational AI assistant with NLP query processing.<br>" +
                      "4. 🌡️ <strong>Temperature Converter:</strong> High-precision conversion utility between Celsius, Fahrenheit & Kelvin.",
                prompts: ["🤖 Tell me about Sofi AI", "⚡ Tech Stack", "💼 Internships", "📬 Contact & Hire"]
            };
        }

        function getSofiAIResponse() {
            return {
                text: "🤖 <strong>Sofi AI – Conversational AI Assistant:</strong><br><br>" +
                      "• Intelligent conversational assistant designed with natural language processing (NLP) pipelines.<br>" +
                      "• Features contextual conversation memory, smart suggestion chips, and responsive fallback mechanisms.<br>" +
                      "• Built with clean JavaScript logic and modern glassmorphic interface.",
                prompts: ["🚀 Other Projects", "⚡ AIML Skills", "📬 Contact & Hire"]
            };
        }

        function getUIUXResponse() {
            return {
                text: "🎨 <strong>UI/UX Design & Product Aesthetics:</strong><br><br>" +
                      "• <strong>Tools:</strong> Figma, FigJam, Adobe XD.<br>" +
                      "• <strong>Specialization:</strong> User-centered design (UCD), design systems, typography hierarchy, interactive micro-animations, glassmorphism.<br>" +
                      "• <strong>Achievement:</strong> 🏆 <strong>UI/UX Competition Winner</strong> for creating high-conversion, intuitive digital interfaces.",
                prompts: ["⚡ Tech Stack", "🚀 Featured Projects", "📬 Contact & Hire"]
            };
        }

        function getCertificationsResponse() {
            return {
                text: "📜 <strong>Verified Industry Certifications:</strong><br><br>" +
                      "• 🛡️ <strong>NASSCOM SkillWallet:</strong> Verified Tech Credential<br>" +
                      "• ☁️ <strong>Microsoft Learn:</strong> AI Fundamentals & Copilot<br>" +
                      "• 🧠 <strong>Infosys Springboard:</strong> Data Structures, Python, C<br>" +
                      "• ☕ <strong>NPTEL:</strong> Programming in Java<br>" +
                      "• 🐧 <strong>Red Hat:</strong> Linux Fundamentals<br>" +
                      "• 🌐 <strong>Hedera Technologies:</strong> Certified Foundation (HCF) & Developer Associate (HCDA).",
                prompts: ["💼 Internships", "⚡ Tech Stack", "📬 Contact & Hire"]
            };
        }

        function getEducationResponse() {
            return {
                text: "🎓 <strong>Academic Background:</strong><br><br>" +
                      "• <strong>Degree:</strong> Bachelor of Engineering (B.E.) in <strong>Computer Science & Engineering (CSE)</strong><br>" +
                      "• <strong>Institution:</strong> Mahendra Engineering College<br>" +
                      "• <strong>Batch:</strong> 2024–2028<br>" +
                      "• <strong>Focus Areas:</strong> Data Structures & Algorithms, Object-Oriented Programming, AI/ML Foundations, Operating Systems, Database Management.",
                prompts: ["💼 Internships", "⚡ Tech Stack", "📬 Contact & Hire"]
            };
        }

        function getAchievementsResponse() {
            return {
                text: "🏆 <strong>Key Honors & Leadership:</strong><br><br>" +
                      "• 🥇 <strong>UI/UX Competition Winner:</strong> Awarded top prize for creating human-centered, responsive digital interfaces.<br>" +
                      "• 👥 <strong>Campus Event Coordinator:</strong> Organised technical symposiums, coding competitions, and hands-on workshops.",
                prompts: ["🎨 UI/UX Design Skills", "🚀 Featured Projects", "📬 Contact & Hire"]
            };
        }

        function getAvailabilityResponse() {
            return {
                text: "🟢 <strong>Yes! Sakthi is actively OPEN TO WORK!</strong><br><br>" +
                      "• <strong>Available For:</strong> Internships & Entry-Level Roles.<br>" +
                      "• <strong>Target Positions:</strong> Software Developer, ML/AI Engineer, Frontend/Full-Stack Developer, UI/UX Designer.<br>" +
                      "• <strong>Joining:</strong> Immediate / Flexible.<br>" +
                      "• <strong>Work Mode:</strong> Remote, Hybrid, or On-site.",
                prompts: ["📬 Contact & Hire", "📄 Resume details", "⚡ Tech Stack"]
            };
        }

        function getContactResponse() {
            return {
                text: "📬 <strong>Get In Touch with Sakthi Vignesh:</strong><br><br>" +
                      "• 📧 <strong>Email:</strong> <a href='mailto:sakthivigneshvcsemec@gmail.com' style='color:var(--secondary); text-decoration:underline;'>sakthivigneshvcsemec@gmail.com</a><br>" +
                      "• 📱 <strong>Phone:</strong> <a href='tel:+91735840936' style='color:var(--secondary); text-decoration:underline;'>+91 73584 0936</a><br>" +
                      "• 📍 <strong>Location:</strong> Jalakandapuram, Salem, Tamil Nadu, India<br>" +
                      "• 💼 <strong>LinkedIn:</strong> <a href='https://www.linkedin.com/in/sakthi-vignesh-v-67b7a2313' target='_blank' style='color:var(--secondary); text-decoration:underline;'>linkedin.com/in/sakthi-vignesh-v</a><br>" +
                      "• 🐙 <strong>GitHub:</strong> <a href='https://github.com/sakthivigneshv' target='_blank' style='color:var(--secondary); text-decoration:underline;'>github.com/sakthivigneshv</a>",
                prompts: ["🟢 Job Availability", "🚀 Featured Projects", "📄 Resume details"]
            };
        }

        function getResumeResponse() {
            return {
                text: "📄 <strong>Sakthi's Resume Summary:</strong><br><br>" +
                      "• <strong>Education:</strong> B.E. Computer Science & Engineering (2024–2028), Mahendra Engineering College.<br>" +
                      "• <strong>Experience:</strong> Web Development Intern (Star Performer) at Infobyte; NASSCOM SkillWallet Credential.<br>" +
                      "• <strong>Projects:</strong> E-Commerce, Stock Market App, Sofi AI, Temp Converter.<br>" +
                      "• <strong>Get Resume PDF:</strong> Email Sakthi directly at <a href='mailto:sakthivigneshvcsemec@gmail.com' style='color:var(--secondary); text-decoration:underline;'>sakthivigneshvcsemec@gmail.com</a> to receive the latest PDF copy!",
                prompts: ["📬 Contact Sakthi", "⚡ Tech Stack", "🚀 Featured Projects"]
            };
        }

        // --- High-Precision Multi-Intent AI Knowledge Base & Matcher ---
        function generateAgentResponse(rawQuery) {
            const query = (rawQuery || '').trim();
            const lower = query.toLowerCase();

            // Normalized alphanumeric string with single spaces
            const clean = lower.replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
            const words = clean.split(' ').filter(Boolean);
            const wordSet = new Set(words);

            // Helpers for accurate matching:
            // 1. Matches whole words only (prevents 'email' triggering 'ai', or 'html' triggering 'ml', or 'sakthi' triggering 'hi')
            const hasWord = (...tokens) => tokens.some(t => wordSet.has(t.toLowerCase().trim()));

            // 2. Matches phrases anywhere in clean query
            const hasPhrase = (...phrases) => phrases.some(p => {
                const normP = p.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
                return clean.includes(normP);
            });

            // 3. Exact chip check (matches data-query or button label)
            const isChip = (...chipTexts) => chipTexts.some(c => {
                const normC = c.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
                return clean === normC || clean.startsWith(normC);
            });

            // --- 1. DIRECT PROMPT CHIP MATCHES (100% Guaranteed response on click) ---
            if (isChip('tell me about sakthi', 'about sakthi')) {
                return getAboutResponse();
            }
            if (isChip('what internships has he done', 'internships', 'internship', 'infobyte internship details')) {
                return getInternshipsResponse();
            }
            if (isChip('what are his technical skills', 'tech stack', 'full tech stack', 'technical skills')) {
                return getTechStackResponse();
            }
            if (isChip('show me his featured projects', 'projects', 'featured projects', 'show web projects', 'other projects')) {
                return getProjectsResponse();
            }
            if (isChip('how can i contact sakthi', 'contact hire', 'contact sakthi', 'contact')) {
                return getContactResponse();
            }
            if (isChip('tell me about sofi ai', 'sofi ai', 'sofi')) {
                return getSofiAIResponse();
            }
            if (isChip('ui ux design skills', 'ui ux')) {
                return getUIUXResponse();
            }
            if (isChip('red hat certification', 'certifications', 'certification')) {
                return getCertificationsResponse();
            }
            if (isChip('job availability', 'open to work')) {
                return getAvailabilityResponse();
            }
            if (isChip('resume details', 'resume')) {
                return getResumeResponse();
            }
            if (isChip('college details', 'education')) {
                return getEducationResponse();
            }
            if (isChip('achievements')) {
                return getAchievementsResponse();
            }

            // --- 2. CONTACT, SOCIALS & REACH OUT ---
            if (hasWord('email', 'mail', 'phone', 'mobile', 'call', 'number', 'address', 'location', 'salem', 'linkedin', 'github', 'instagram') ||
                hasPhrase('contact', 'reach him', 'talk to him', 'how to reach', 'how to contact', 'contact details', 'contact number', 'phone number', 'email id', 'contact info', 'epdi contact', 'contact panradhu', 'call panradhu', 'enga irukaru', 'where is he', 'hire him', 'reach out')) {
                return getContactResponse();
            }

            // --- 3. RESUME / CV ---
            if (hasWord('resume', 'cv', 'biodata', 'curriculum') ||
                hasPhrase('resume summary', 'resume details', 'get resume', 'download resume', 'send resume', 'resume venum', 'resume kudu', 'cv venum', 'resume anupu', 'share resume')) {
                return getResumeResponse();
            }

            // --- 4. JOB AVAILABILITY & HIRING (OPEN TO WORK) ---
            if (hasWord('hire', 'hiring', 'available', 'availability', 'opportunity', 'fresher') ||
                hasPhrase('open to work', 'job', 'jobs', 'role', 'roles', 'join', 'joining', 'immediate joiner', 'entry level', 'intern role', 'can i hire', 'can we hire', 'job theduraara', 'hire panna', 'velai theduraara', 'available ah', 'eppo join', 'looking for job')) {
                return getAvailabilityResponse();
            }

            // --- 5. SPECIFIC PROJECT DRILL-DOWNS ---
            if (hasWord('sofi') || hasPhrase('sofi ai', 'about sofi', 'conversational ai')) {
                return getSofiAIResponse();
            }
            if (hasWord('stock') || hasPhrase('stock market', 'stock app', 'financial app', 'equities')) {
                return {
                    text: "📈 <strong>Stock Market Platform:</strong><br><br>" +
                          "• Real-time financial analytics web application tracking live stock prices, indices, and asset trends.<br>" +
                          "• Interactive charting, portfolio performance tracking, and sleek dark financial UI architecture.",
                    prompts: ["🚀 Other Projects", "⚡ Tech Stack", "📬 Contact & Hire"]
                };
            }
            if (hasWord('ecommerce', 'shop') || hasPhrase('e commerce', 'shopping cart', 'shop app', 'online store', 'ecommerce marketplace')) {
                return {
                    text: "🛒 <strong>E-Commerce Marketplace:</strong><br><br>" +
                          "• Full-stack digital shopping experience with dynamic product catalog, live cart calculations, filter drawers, and responsive checkout UI.",
                    prompts: ["🚀 Other Projects", "⚡ Tech Stack", "📬 Contact & Hire"]
                };
            }
            if (hasWord('temperature', 'converter', 'kelvin', 'celsius', 'fahrenheit') || hasPhrase('temp converter', 'temperature converter')) {
                return {
                    text: "🌡️ <strong>Temperature Converter:</strong><br><br>" +
                          "• High-precision thermal conversion utility supporting instant bidirectional calculations between Celsius, Fahrenheit, and Kelvin.",
                    prompts: ["🚀 Other Projects", "⚡ Tech Stack", "📬 Contact & Hire"]
                };
            }

            // --- 6. INTERNSHIPS & INDUSTRY EXPERIENCE ---
            if (hasWord('internship', 'internships', 'intern', 'infobyte', 'nasscom', 'skillwallet') ||
                hasPhrase('work experience', 'internship details', 'job experience', 'worked at', 'companies worked', 'star performer', 'internship pannirukara', 'work experience iruka', 'infobyte la enna')) {
                return getInternshipsResponse();
            }

            // --- 7. CERTIFICATIONS & CREDENTIALS ---
            if (hasWord('certification', 'certifications', 'certificate', 'certificates', 'credential', 'credentials', 'course', 'courses', 'nptel', 'infosys', 'springboard', 'hedera', 'redhat') ||
                hasPhrase('red hat', 'microsoft learn', 'future skills', 'certified in', 'license', 'certificate iruka', 'certifications enna')) {
                return getCertificationsResponse();
            }

            // --- 8. EDUCATION & COLLEGE ---
            if (hasWord('college', 'education', 'degree', 'studying', 'university', 'mahendra', 'academics', 'academic', 'cgpa', 'school') ||
                hasPhrase('b e', 'be cse', 'b e cse', 'computer science engineering', 'which college', 'college enga', 'enna padikraru', 'degree enna', 'engineering college', 'batch', 'qualification')) {
                return getEducationResponse();
            }

            // --- 9. ACHIEVEMENTS & AWARDS ---
            if (hasWord('achievement', 'achievements', 'award', 'awards', 'winner', 'competition', 'hackathon', 'symposium') ||
                hasPhrase('ui ux winner', 'event coordinator', 'honors', 'achievements enna', 'awards iruka', 'prize vaangirukara')) {
                return getAchievementsResponse();
            }

            // --- 10. AI & MACHINE LEARNING (AIML) ---
            if (hasWord('aiml', 'ai', 'ml', 'tensorflow', 'pytorch', 'deeplearning', 'nlp', 'llm') ||
                hasPhrase('machine learning', 'deep learning', 'generative ai', 'gen ai', 'prompt engineering', 'scikit learn', 'neural network', 'data science', 'ai theriyuma', 'ml theriyuma')) {
                return {
                    text: "🤖 <strong>Artificial Intelligence & Machine Learning Expertise:</strong><br><br>" +
                          "• <strong>Generative AI & LLMs:</strong> Prompt Engineering, OpenAI/Gemini API integration, contextual prompting.<br>" +
                          "• <strong>Frameworks:</strong> TensorFlow, PyTorch, Scikit-Learn.<br>" +
                          "• <strong>Core Domains:</strong> Predictive modeling, Neural Networks, Natural Language Processing (NLP), Data Analytics.<br>" +
                          "• <strong>Featured AI Project:</strong> Built <strong>Sofi AI</strong>, a conversational intelligent agent.",
                    prompts: ["🚀 Tell me about Sofi AI", "⚡ Tech Stack", "💼 Internships", "📬 Contact & Hire"]
                };
            }

            // --- 11. WEB DEVELOPMENT & FULL-STACK ---
            if (hasWord('frontend', 'backend', 'fullstack', 'html', 'css', 'javascript', 'react', 'node', 'express', 'mongodb', 'sql', 'firebase') ||
                hasPhrase('web dev', 'web development', 'full stack', 'front end', 'back end', 'rest api', 'rest apis', 'database', 'web design', 'website pannuvara', 'web projects')) {
                return {
                    text: "💻 <strong>Full-Stack & Web Development:</strong><br><br>" +
                          "• <strong>Frontend:</strong> Responsive HTML5, Modern CSS3 (Grid/Flexbox/Animations), Vanilla JavaScript (ES6+), React foundations.<br>" +
                          "• <strong>Backend & APIs:</strong> RESTful API design, Node.js, Express, Firebase Cloud Firestore integration.<br>" +
                          "• <strong>Databases:</strong> Firebase Cloud Firestore with real-time sync, MongoDB, SQL.<br>" +
                          "• <strong>Industry Recognition:</strong> Awarded <em>Star Performer</em> at <strong>Infobyte Web Development Internship</strong>.",
                    prompts: ["💼 Infobyte Internship details", "🚀 Show Web Projects", "⚡ Tech Stack"]
                };
            }

            // --- 12. UI/UX DESIGN ---
            if (hasWord('figma', 'figjam', 'wireframe', 'wireframing', 'prototype', 'prototyping') ||
                hasPhrase('ui ux', 'ui/ux', 'user interface', 'user experience', 'design system', 'design systems', 'ui design', 'ux design', 'figma design', 'ui ux theriyuma', 'design pannuvara')) {
                return getUIUXResponse();
            }

            // --- 13. PROGRAMMING LANGUAGES ---
            if (hasWord('python', 'java') ||
                hasPhrase('c language', 'c programming', 'c plus plus', 'c++', 'cpp', 'programming languages', 'coding languages', 'which languages', 'python theriyuma', 'java theriyuma')) {
                return {
                    text: "⌨️ <strong>Core Programming Languages:</strong><br><br>" +
                          "• <strong>Python:</strong> Primary language for Machine Learning, Data Analytics, Prompt Engineering & Automation.<br>" +
                          "• <strong>JavaScript (ES6+):</strong> Modern web applications, DOM manipulation, asynchronous REST handling.<br>" +
                          "• <strong>Java:</strong> Object-Oriented Programming (OOP), Data Structures — Certified by <strong>NPTEL</strong>.<br>" +
                          "• <strong>C:</strong> Foundational algorithmic problem solving, memory architecture.",
                    prompts: ["⚡ Full Tech Stack", "📜 Certifications", "🚀 Projects"]
                };
            }

            // --- 14. DEVOPS & LINUX ---
            if (hasWord('devops', 'git', 'github', 'linux', 'redhat', 'docker', 'bash', 'terminal') ||
                hasPhrase('red hat', 'version control', 'operating system', 'linux administration', 'linux theriyuma')) {
                return {
                    text: "🛠️ <strong>DevOps & System Architecture:</strong><br><br>" +
                          "• <strong>Version Control:</strong> Git & GitHub (collaborative branching, PRs, git workflow).<br>" +
                          "• <strong>Operating Systems:</strong> Linux environment administration — Certified in <strong>Red Hat Linux Fundamentals</strong>.<br>" +
                          "• <strong>Cloud & Hosting:</strong> Firebase Cloud Firestore, Vercel, Netlify, GitHub Pages, REST endpoints.",
                    prompts: ["📜 Red Hat Certification", "⚡ Tech Stack", "📬 Contact & Hire"]
                };
            }

            // --- 15. GAME DEVELOPMENT ---
            if (hasWord('unity', 'unreal', 'gaming') || hasPhrase('game dev', 'game development', 'game programming')) {
                return {
                    text: "🎮 <strong>Game Development & Interactive Mechanics:</strong><br><br>" +
                          "• <strong>Focus:</strong> Gameplay mechanics, player physics logic, state machines, and interactive world prototyping.<br>" +
                          "• <strong>Engines & Concepts:</strong> Unity mechanics, 2D/3D coordinate systems, collision handling, and performance optimization.",
                    prompts: ["⚡ Tech Stack", "🚀 Featured Projects", "📬 Contact & Hire"]
                };
            }

            // --- 16. SKILLS / TECH STACK OVERVIEW ---
            if (hasWord('skill', 'skills', 'stack', 'tools', 'technologies', 'technology') ||
                hasPhrase('tech stack', 'technical skills', 'what can he do', 'what can you do', 'what does he know', 'enna skills', 'skills enna', 'technologies enna')) {
                return getTechStackResponse();
            }

            // --- 17. GENERAL PROJECTS ---
            if (hasWord('project', 'projects', 'portfolio') ||
                hasPhrase('show projects', 'what did he build', 'works', 'applications', 'apps', 'project enna', 'projects sollu')) {
                return getProjectsResponse();
            }

            // --- 18. ABOUT SAKTHI / BIO / GENERAL PROFILE ---
            if (hasWord('about', 'bio', 'profile', 'sakthi', 'vignesh') ||
                hasPhrase('who is', 'tell me about', 'who is sakthi', 'about sakthi', 'who are you', 'tell me about yourself', 'sakthi pathi', 'unga pathi', 'yaar ivaru', 'ivaru yaar', 'intro', 'details sollu')) {
                return getAboutResponse();
            }

            // --- 19. APPRECIATION & PRAISE ---
            if (hasWord('thanks', 'nandri', 'super', 'awesome', 'mass') ||
                hasPhrase('thank you', 'nalla iruku', 'vera level', 'great work')) {
                return {
                    text: "😊 Romba nandri! Sakthi-oda portfolio ungaluku pudichirukum nu namburen. Ungaluku edhavadhu project collaboration illa hiring pathi pesa venumna, kela irukura options-ah click pannunga!",
                    prompts: ["📬 Contact & Hire", "🚀 Featured Projects", "⚡ Tech Stack"]
                };
            }

            // --- 20. GREETINGS (STANDALONE ONLY) ---
            if (hasWord('hi', 'hello', 'hey', 'vanakkam', 'namaste', 'greetings', 'morning', 'evening', 'afternoon')) {
                return {
                    text: "👋 <strong>Hello!</strong> I am Sakthi Vignesh's personal portfolio AI Agent. I can answer any questions about his skills, projects, internships (Infobyte & NASSCOM), certifications, or contact details. What would you like to know?",
                    prompts: ["👤 About Sakthi", "⚡ Tech Stack", "💼 Internships", "🚀 Featured Projects", "📬 Contact & Hire"]
                };
            }

            // --- 21. INTELLIGENT FALLBACK ---
            return {
                text: "Thank you for asking! Sakthi Vignesh is a versatile Computer Science developer skilled in <strong>Machine Learning, Full-Stack Web Development, and UI/UX Design</strong>.<br><br>Here are the quickest ways to learn more about him:",
                prompts: ["👤 About Sakthi", "⚡ Tech Stack", "💼 Internships", "🚀 Featured Projects", "📬 Contact & Hire"]
            };
        }

        let isAITyping = false;

        // Send Query Function
        function handleUserMessage(queryText) {
            const query = (queryText || '').trim();
            if (!query || isAITyping) return;

            isAITyping = true;

            // Append User Message
            const userMsgDiv = document.createElement('div');
            userMsgDiv.className = 'ai-msg ai-msg-user';
            userMsgDiv.innerHTML = `<div class="ai-msg-bubble"><p>${escapeHtml(query)}</p></div>`;
            aiMessages.appendChild(userMsgDiv);
            aiMessages.scrollTop = aiMessages.scrollHeight;

            if (aiInput) aiInput.value = '';

            // Show Typing Indicator
            const typingDiv = document.createElement('div');
            typingDiv.className = 'ai-msg ai-msg-bot ai-typing-wrapper';
            typingDiv.innerHTML = `
                <div class="ai-msg-avatar"><i class="fas fa-robot"></i></div>
                <div class="ai-typing-indicator">
                    <span></span><span></span><span></span>
                </div>
            `;
            aiMessages.appendChild(typingDiv);
            aiMessages.scrollTop = aiMessages.scrollHeight;

            // Natural AI response delay (400ms)
            setTimeout(() => {
                typingDiv.remove();

                const response = generateAgentResponse(query);
                const botMsgDiv = document.createElement('div');
                botMsgDiv.className = 'ai-msg ai-msg-bot';

                let promptsHtml = '';
                if (response.prompts && response.prompts.length > 0) {
                    promptsHtml = `<div class="ai-quick-prompts">` + 
                        response.prompts.map(p => `<button class="ai-prompt-chip" data-query="${p}">${p}</button>`).join('') +
                        `</div>`;
                }

                botMsgDiv.innerHTML = `
                    <div class="ai-msg-avatar"><i class="fas fa-robot"></i></div>
                    <div class="ai-msg-bubble">
                        <p>${response.text}</p>
                        ${promptsHtml}
                    </div>
                `;

                aiMessages.appendChild(botMsgDiv);
                aiMessages.scrollTop = aiMessages.scrollHeight;
                isAITyping = false;
            }, 400);
        }

        // Global Event Delegation for all Quick Prompt Chips (Guarantees 100% click reliability)
        aiMessages.addEventListener('click', (e) => {
            const chip = e.target.closest('.ai-prompt-chip');
            if (chip) {
                e.preventDefault();
                const q = chip.getAttribute('data-query') || chip.innerText.trim();
                if (q) {
                    handleUserMessage(q);
                }
            }
        });

        // Form Submit
        if (aiForm) {
            aiForm.addEventListener('submit', (e) => {
                e.preventDefault();
                if (aiInput) {
                    handleUserMessage(aiInput.value);
                }
            });
        }
    }

    // --- Dynamic Year ---
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
});
