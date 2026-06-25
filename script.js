/* ==========================================
   PORTFOLIO — JavaScript
   Neural network canvas, boot sequence, typing,
   smooth scroll, mobile nav, scroll reveal,
   active nav, card hover effects
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

    // =============================================
    // NEURAL NETWORK CANVAS
    // =============================================
    const canvas = document.getElementById('neuralCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null };
    let animationId;
    const PARTICLE_COUNT = 70;
    const CONNECTION_DISTANCE = 160;
    const MOUSE_RADIUS = 200;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    });

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2 + 1;
            this.baseRadius = this.radius;
            this.opacity = Math.random() * 0.5 + 0.2;
            this.baseOpacity = this.opacity;
            // random hue between cyan (180) and purple (270)
            this.hue = Math.random() * 90 + 180;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off edges
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

            // Mouse interaction
            if (mouse.x !== null && mouse.y !== null) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < MOUSE_RADIUS) {
                    const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
                    this.x += dx * force * 0.02;
                    this.y += dy * force * 0.02;
                    this.radius = this.baseRadius + force * 2;
                    this.opacity = Math.min(this.baseOpacity + force * 0.4, 1);
                } else {
                    this.radius += (this.baseRadius - this.radius) * 0.05;
                    this.opacity += (this.baseOpacity - this.opacity) * 0.05;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 100%, 70%, ${this.opacity})`;
            ctx.fill();

            // Glow effect
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius * 3, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 100%, 70%, ${this.opacity * 0.1})`;
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        const count = window.innerWidth < 768 ? Math.floor(PARTICLE_COUNT * 0.5) : PARTICLE_COUNT;
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < CONNECTION_DISTANCE) {
                    const opacity = (1 - dist / CONNECTION_DISTANCE) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);

                    const gradient = ctx.createLinearGradient(
                        particles[i].x, particles[i].y,
                        particles[j].x, particles[j].y
                    );
                    gradient.addColorStop(0, `hsla(${particles[i].hue}, 100%, 70%, ${opacity})`);
                    gradient.addColorStop(1, `hsla(${particles[j].hue}, 100%, 70%, ${opacity})`);
                    ctx.strokeStyle = gradient;
                    ctx.lineWidth = 0.6;
                    ctx.stroke();
                }
            }
        }

        // Mouse connections
        if (mouse.x !== null && mouse.y !== null) {
            particles.forEach(p => {
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < MOUSE_RADIUS) {
                    const opacity = (1 - dist / MOUSE_RADIUS) * 0.25;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `hsla(190, 100%, 60%, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            });
        }
    }

    function animateCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        drawConnections();
        animationId = requestAnimationFrame(animateCanvas);
    }

    // Track mouse on hero section only
    const heroSection = document.getElementById('home');
    heroSection.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    heroSection.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Touch support for mobile
    heroSection.addEventListener('touchmove', (e) => {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
    }, { passive: true });

    heroSection.addEventListener('touchend', () => {
        mouse.x = null;
        mouse.y = null;
    });

    initParticles();
    animateCanvas();

    // Pause animation when hero is not visible
    const canvasObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!animationId) animateCanvas();
            } else {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        });
    }, { threshold: 0.1 });
    canvasObserver.observe(heroSection);


    // =============================================
    // BOOT SEQUENCE
    // =============================================
    const bootLines = [
        { id: 'bootLine1', cursor: 'bootCursor1', delay: 300 },
        { id: 'bootLine2', cursor: 'bootCursor2', delay: 1000 },
        { id: 'bootLine3', cursor: 'bootCursor3', delay: 1800 },
    ];

    function runBootSequence() {
        bootLines.forEach((line, index) => {
            const el = document.getElementById(line.id);
            const cursor = document.getElementById(line.cursor);

            setTimeout(() => {
                el.classList.add('visible');
                // Hide previous cursor
                if (index > 0) {
                    const prevCursor = document.getElementById(bootLines[index - 1].cursor);
                    if (prevCursor) prevCursor.style.display = 'none';
                    // Dim previous line
                    const prevLine = document.getElementById(bootLines[index - 1].id);
                    if (prevLine) prevLine.classList.add('dim');
                }
            }, line.delay);
        });

        // Hide last cursor after a bit
        setTimeout(() => {
            const lastCursor = document.getElementById(bootLines[bootLines.length - 1].cursor);
            if (lastCursor) lastCursor.style.display = 'none';
        }, 2500);
    }

    runBootSequence();


    // =============================================
    // TYPING ANIMATION (starts after boot)
    // =============================================
    const typedText = document.getElementById('typedText');
    const roles = [
        'Machine Learning Engineer.',
        'Full-Stack Developer.',
        'Builder.',
        'Problem Solver.',
        'Researcher.',
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 80;

    function type() {
        const current = roles[roleIndex];

        if (isDeleting) {
            typedText.textContent = current.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 40;
        } else {
            typedText.textContent = current.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 80;
        }

        if (!isDeleting && charIndex === current.length) {
            typingSpeed = 2200;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 400;
        }

        setTimeout(type, typingSpeed);
    }

    // Start typing after boot sequence completes
    setTimeout(type, 3200);


    // =============================================
    // NAVBAR SCROLL EFFECT
    // =============================================
    const navbar = document.getElementById('navbar');

    function handleNavScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();


    // =============================================
    // MOBILE NAVIGATION
    // =============================================
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const mobileOverlay = document.getElementById('mobileOverlay');

    function toggleMobileMenu() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('open');
        mobileOverlay.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    }

    function closeMobileMenu() {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', toggleMobileMenu);
    mobileOverlay.addEventListener('click', closeMobileMenu);

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });


    // =============================================
    // SMOOTH SCROLL
    // =============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = navbar.offsetHeight + 10;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });


    // =============================================
    // ACTIVE NAV HIGHLIGHT
    // =============================================
    const sections = document.querySelectorAll('section[id]');
    const navLinksAll = document.querySelectorAll('.nav-link');

    function highlightNav() {
        const scrollY = window.scrollY + 140;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollY >= top && scrollY < top + height) {
                navLinksAll.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNav, { passive: true });
    highlightNav();


    // =============================================
    // SCROLL REVEAL ANIMATION
    // =============================================
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
    });

    revealElements.forEach(el => revealObserver.observe(el));


    // =============================================
    // STAGGERED CARD ANIMATIONS
    // =============================================
    const cardContainers = document.querySelectorAll('.skills-grid, .projects-grid, .achievements-grid, .contact-grid');

    cardContainers.forEach(container => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const cards = entry.target.children;
                    Array.from(cards).forEach((card, i) => {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(30px)';
                        card.style.transition = `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.1}s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.1}s`;
                        requestAnimationFrame(() => {
                            requestAnimationFrame(() => {
                                card.style.opacity = '1';
                                card.style.transform = 'translateY(0)';
                            });
                        });
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08 });

        observer.observe(container);
    });


    // =============================================
    // ABOUT SECTION — AVATAR SCANNER ANIMATION
    // =============================================
    const scannerLayout = document.getElementById('aboutScannerLayout');

    if (scannerLayout) {
        const scannerBeam = document.getElementById('scannerBeam');
        const scannerAvatar = document.getElementById('scannerAvatar');
        const scannerCrosshair = scannerLayout.querySelector('.scanner-crosshair');
        const scannerStatusFill = document.getElementById('scannerStatusFill');
        const scannerStatusText = document.getElementById('scannerStatusText');
        const hudStatus = document.getElementById('hudStatus');
        const hudProgress = document.getElementById('hudProgress');
        const scanBadge = document.getElementById('scanBadge');
        const scanTerminalBody = document.getElementById('scanTerminalBody');
        const scanInterests = document.getElementById('scanInterests');
        const outputLines = scanTerminalBody ? scanTerminalBody.querySelectorAll('.scan-output-line') : [];

        const scanObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    runScannerAnimation();
                    scanObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.25 });

        scanObserver.observe(scannerLayout);

        function runScannerAnimation() {
            // 1. Activate crosshair
            if (scannerCrosshair) scannerCrosshair.classList.add('active');

            // 2. Update HUD status
            if (hudStatus) hudStatus.textContent = 'SCANNING';
            if (scannerStatusText) scannerStatusText.textContent = 'scanning_subject...';

            // 3. Start beam sweep
            if (scannerBeam) scannerBeam.classList.add('active');

            // 4. Start progress bar fill
            if (scannerStatusFill) {
                requestAnimationFrame(() => scannerStatusFill.classList.add('active'));
            }

            // 5. Animate progress counter
            let progress = 0;
            const progressInterval = setInterval(() => {
                progress += 1;
                if (hudProgress) hudProgress.textContent = `${Math.min(progress, 100)}%`;
                if (progress >= 100) clearInterval(progressInterval);
            }, 24);

            // 6. Reveal terminal output lines sequentially
            outputLines.forEach((line, i) => {
                const delay = parseInt(line.dataset.delay) || (i * 250);
                setTimeout(() => {
                    line.classList.add('visible');
                }, delay);
            });

            // 7. After beam reaches bottom — avatar colour pop
            setTimeout(() => {
                if (scannerAvatar) scannerAvatar.classList.add('scanned');
                if (scannerCrosshair) scannerCrosshair.classList.remove('active');
            }, 2400);

            // 8. Scan complete
            setTimeout(() => {
                if (hudStatus) {
                    hudStatus.textContent = 'COMPLETE';
                    hudStatus.style.color = '#28c840';
                }
                if (scannerStatusText) {
                    scannerStatusText.textContent = 'scan_complete ✓';
                    scannerStatusText.style.color = 'var(--cyan)';
                }
                if (scanBadge) {
                    scanBadge.textContent = 'COMPLETE';
                    scanBadge.classList.add('complete');
                }
                if (scanInterests) scanInterests.classList.add('visible');
            }, 2600);
        }
    }


    // =============================================
    // PARALLAX ON HERO ORBS
    // =============================================
    const orbs = document.querySelectorAll('.hero-orb');
    let ticking = false;

    window.addEventListener('mousemove', (e) => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const x = (e.clientX / window.innerWidth - 0.5) * 2;
                const y = (e.clientY / window.innerHeight - 0.5) * 2;

                orbs.forEach((orb, i) => {
                    const speed = (i + 1) * 10;
                    orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
                });

                ticking = false;
            });
            ticking = true;
        }
    });


    // =============================================
    // TIMELINE ANIMATION
    // =============================================
    const timelineItems = document.querySelectorAll('.timeline-item');

    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
                timelineObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });

    timelineItems.forEach((item, i) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-30px)';
        item.style.transition = `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.15}s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.15}s`;
        timelineObserver.observe(item);
    });

});
