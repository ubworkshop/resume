/**
 * Interactive Scripts for Wulan Bateer's English Resume
 * Implements: 
 *  1. Canvas Interactive Particles Background
 *  2. Multi-role Typewriter Effect
 *  3. Dynamic Stats Counters (Incremental)
 *  4. SVG Language Ring Progress Animations
 *  5. Smooth Collapse/Expand for Project Details
 *  6. Theme Toggling (Light / Dark) & Persistent Storage
 *  7. Scroll Reveal Triggering
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       1. Light / Dark Theme Toggle
       ========================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');
    
    // Check local storage or system preferences
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const setTargetTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        if (theme === 'light') {
            themeIcon.className = 'fa-solid fa-sun';
        } else {
            themeIcon.className = 'fa-solid fa-moon';
        }
    };

    if (savedTheme) {
        setTargetTheme(savedTheme);
    } else {
        setTargetTheme(systemPrefersDark ? 'dark' : 'light');
    }

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        setTargetTheme(currentTheme === 'light' ? 'dark' : 'light');
    });


    /* ==========================================
       2. Typewriter Effect (Hero Section)
       ========================================== */
    const roles = [
        'Hybrid Cloud Architect',
        'Senior SRE Engineer',
        'DevOps Specialist',
        'Multilingual Communicator'
    ];
    const typewriterSpan = document.getElementById('typewriter-text');
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingDelay = 100;
    let erasingDelay = 50;
    let newWordDelay = 2000; // Delay before starting to erase

    const typeRole = () => {
        const currentText = roles[roleIndex];
        
        if (isDeleting) {
            typewriterSpan.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingDelay = erasingDelay;
        } else {
            typewriterSpan.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingDelay = 100;
        }

        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            typingDelay = newWordDelay; // pause at peak
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingDelay = 500; // quick pause before typing next
        }

        setTimeout(typeRole, typingDelay);
    };

    if (typewriterSpan) {
        setTimeout(typeRole, 1000);
    }


    /* ==========================================
       3. Interactive Particles Background (Canvas)
       ========================================== */
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    
    let particlesArray = [];
    let particleCount = 70; // Optimized count for smooth frame rates

    // Dynamically resize canvas to fit viewport
    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Particle Object
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1; // Small elegant nodes
            this.speedX = Math.random() * 0.4 - 0.2; // Slow floating speeds
            this.speedY = Math.random() * 0.4 - 0.2;
            this.alpha = Math.random() * 0.5 + 0.1;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Bounce back on border collide
            if (this.x < 0 || this.x > canvas.width) this.speedX = -this.speedX;
            if (this.y < 0 || this.y > canvas.height) this.speedY = -this.speedY;
        }

        draw() {
            // Adapt color based on active dark/light mode
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const colorRgb = currentTheme === 'light' ? '15, 118, 110' : '0, 242, 254'; // primary brand tint

            ctx.fillStyle = `rgba(${colorRgb}, ${this.alpha})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    const initParticles = () => {
        particlesArray = [];
        for (let i = 0; i < particleCount; i++) {
            particlesArray.push(new Particle());
        }
    };
    initParticles();

    // Draw lines between adjacent nodes
    const connectParticles = () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const colorRgb = currentTheme === 'light' ? '15, 118, 110' : '0, 242, 254';
        
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let dx = particlesArray[a].x - particlesArray[b].x;
                let dy = particlesArray[a].y - particlesArray[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                // Connect if nodes are within close proximity
                if (distance < 120) {
                    const lineAlpha = (1 - distance / 120) * 0.15;
                    ctx.strokeStyle = `rgba(${colorRgb}, ${lineAlpha})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    };

    const animateParticles = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        connectParticles();
        requestAnimationFrame(animateParticles);
    };
    animateParticles();

    // Re-initialize particles if window is resized to keep grid density consistent
    window.addEventListener('resize', () => {
        initParticles();
    });


    /* ==========================================
       4. Collapsible Project Details (Timeline)
       ========================================== */
    const toggleButtons = document.querySelectorAll('.btn-toggle-projects');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const timelineContent = button.closest('.timeline-content');
            const projectsDiv = timelineContent.querySelector('.experience-projects');
            
            button.classList.toggle('active');
            projectsDiv.classList.toggle('collapsed');
            
            if (projectsDiv.classList.contains('collapsed')) {
                button.innerHTML = '<i class="fa-solid fa-chevron-down"></i> Show Details';
            } else {
                button.innerHTML = '<i class="fa-solid fa-chevron-up"></i> Hide Details';
            }
        });
    });


    /* ==========================================
       5. Stats Accumulator & Skill/Language Animations
       ========================================== */
    
    // Increments standard numbers up to targets on viewport intersection
    const runNumberAnimation = (entry) => {
        const targetElement = entry.target;
        const targetValue = parseInt(targetElement.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const startTime = performance.now();

        const updateNumber = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            
            // Ease-out calculation
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(easeProgress * targetValue);
            
            targetElement.textContent = currentValue;
            
            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            } else {
                targetElement.textContent = targetValue; // Ensure exact final value
            }
        };

        requestAnimationFrame(updateNumber);
    };

    // Animates Circular SVG gauges for languages
    const runLanguageAnimation = (entry) => {
        const ringItem = entry.target;
        const progressCircle = ringItem.querySelector('.ring-fill');
        const percentage = parseInt(ringItem.getAttribute('data-percentage'));
        
        const radius = progressCircle.r.baseVal.value;
        const circumference = 2 * Math.PI * radius; // ~314.16
        
        // Calculate offset (progress is subtracted from full outline)
        const offset = circumference - (percentage / 100) * circumference;
        
        // Apply dashoffset which triggers the CSS transition property
        progressCircle.style.strokeDasharray = `${circumference}`;
        progressCircle.style.strokeDashoffset = offset;
    };

    // Stretches linear progress bar width inside skills segment
    const runSkillAnimation = (entry) => {
        const skillCategory = entry.target;
        const progressBars = skillCategory.querySelectorAll('.progress');
        
        progressBars.forEach(bar => {
            // Retrieve default width set inside inline style and force it
            const targetWidth = bar.parentElement.previousElementSibling.querySelector('span:last-child').textContent;
            bar.style.width = targetWidth;
        });
    };

    // Generic setup using IntersectionObserver
    const observerOptions = {
        threshold: 0.15, // trigger when 15% visible
        rootMargin: '0px 0px -50px 0px'
    };

    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                runNumberAnimation(entry);
                observer.unobserve(entry.target); // Trigger only once
            }
        });
    }, observerOptions);

    const langObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                runLanguageAnimation(entry);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const skillsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                runSkillAnimation(entry);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Bind counters
    document.querySelectorAll('.stat-number').forEach(elem => {
        statsObserver.observe(elem);
    });

    // Bind language rings
    document.querySelectorAll('.ring-progress').forEach(elem => {
        langObserver.observe(elem);
    });

    // Bind skills categories
    document.querySelectorAll('.skill-category').forEach(elem => {
        // We set inline style width to 0 first to let it grow dynamically
        elem.querySelectorAll('.progress').forEach(bar => bar.style.width = '0');
        skillsObserver.observe(elem);
    });

    // Bind reveal sections
    document.querySelectorAll('.scroll-reveal').forEach(elem => {
        revealObserver.observe(elem);
    });

    
    /* ==========================================
       6. Smooth Navigation Link Active Styling
       ========================================== */
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            // Adjust offset to trigger active state earlier
            if (pageYOffset >= (sectionTop - 150)) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
        
        // Show/hide scroll-to-top button
        const scrollTopBtn = document.getElementById('scroll-to-top');
        if (scrollTopBtn) {
            if (pageYOffset > 500) {
                scrollTopBtn.style.opacity = '1';
                scrollTopBtn.style.pointerEvents = 'auto';
            } else {
                scrollTopBtn.style.opacity = '0';
                scrollTopBtn.style.pointerEvents = 'none';
            }
        }
    });

    // Initial setup for back to top button invisibility
    const scrollTopBtn = document.getElementById('scroll-to-top');
    if (scrollTopBtn) {
        scrollTopBtn.style.opacity = '0';
        scrollTopBtn.style.pointerEvents = 'none';
        scrollTopBtn.style.transition = 'opacity 0.3s, transform 0.3s';
    }

    /* ==========================================
       7. PDF Export Trigger Logic
       ========================================== */
    const triggerPDFExport = () => {
        // Force expand all projects and responsibilities so no hidden text gets cut off in PDF
        const projectPanels = document.querySelectorAll('.experience-projects');
        const toggleBtns = document.querySelectorAll('.btn-toggle-projects');
        
        projectPanels.forEach(panel => {
            panel.classList.remove('collapsed');
        });
        
        toggleBtns.forEach(btn => {
            btn.classList.add('active');
            btn.innerHTML = '<i class="fa-solid fa-chevron-up"></i> Hide Details';
        });

        // Delay marginally to ensure reflow completes before launching print
        setTimeout(() => {
            window.print();
        }, 200);
    };

    const pdfBtnNav = document.getElementById('nav-export-pdf');
    if (pdfBtnNav) {
        pdfBtnNav.addEventListener('click', (e) => {
            e.preventDefault();
            triggerPDFExport();
        });
    }
});
