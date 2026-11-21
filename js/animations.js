/* ==========================================================================
   Persona 5 Royal Fan Site - Animation JavaScript
   Particle system, scroll effects, and advanced animations
   ========================================================================== */

// --- Particle System ---
const ParticleSystem = {
    canvas: null,
    ctx: null,
    particles: [],
    animationId: null,
    config: {
        particleCount: 80,
        colors: ['#c70000', '#e50914', '#ff1744', '#ffd700', '#c9a800'],
        minSize: 1,
        maxSize: 3,
        minSpeed: 0.2,
        maxSpeed: 0.8,
        connectionDistance: 120
    },

    init: function() {
        this.canvas = document.getElementById('particle-canvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.resize();
        this.createParticles();
        this.animate();

        window.addEventListener('resize', Utils.debounce(() => this.resize(), 250));

        // Pause when tab hidden
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) this.pause();
            else this.resume();
        });
    },

    resize: function() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        this.canvas.width = hero.offsetWidth;
        this.canvas.height = hero.offsetHeight;
    },

    createParticles: function() {
        this.particles = [];
        for (let i = 0; i < this.config.particleCount; i++) {
            this.particles.push(this.createParticle());
        }
    },

    createParticle: function() {
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            size: Math.random() * (this.config.maxSize - this.config.minSize) + this.config.minSize,
            speedX: (Math.random() - 0.5) * (this.config.maxSpeed - this.config.minSpeed) + this.config.minSpeed,
            speedY: (Math.random() - 0.5) * (this.config.maxSpeed - this.config.minSpeed) + this.config.minSpeed,
            color: this.config.colors[Math.floor(Math.random() * this.config.colors.length)],
            opacity: Math.random() * 0.5 + 0.1,
            pulsePhase: Math.random() * Math.PI * 2,
            pulseSpeed: Math.random() * 0.02 + 0.005
        };
    },

    animate: function() {
        this.animationId = requestAnimationFrame(() => this.animate());

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw particles
        this.particles.forEach(particle => this.updateParticle(particle));
        this.particles.forEach(particle => this.drawParticle(particle));

        // Draw connections
        this.drawConnections();
    },

    updateParticle: function(particle) {
        // Pulse animation
        particle.pulsePhase += particle.pulseSpeed;
        particle.opacity = 0.1 + Math.sin(particle.pulsePhase) * 0.15 + 0.15;

        // Movement
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap around
        if (particle.x < -particle.size) particle.x = this.canvas.width + particle.size;
        if (particle.x > this.canvas.width + particle.size) particle.x = -particle.size;
        if (particle.y < -particle.size) particle.y = this.canvas.height + particle.size;
        if (particle.y > this.canvas.height + particle.size) particle.y = -particle.size;
    },

    drawParticle: function(particle) {
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fillStyle = this.hexToRgba(particle.color, particle.opacity);
        this.ctx.fill();
    },

    drawConnections: function() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.config.connectionDistance) {
                    const opacity = (1 - distance / this.config.connectionDistance) * 0.15;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = this.hexToRgba('#c70000', opacity);
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }
        }
    },

    hexToRgba: function(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    },

    pause: function() {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
    },

    resume: function() {
        if (!this.animationId) this.animate();
    },

    destroy: function() {
        this.pause();
        this.particles = [];
    }
};

// --- Scroll Progress Indicator ---
const ScrollProgress = {
    bar: null,

    init: function() {
        this.bar = document.createElement('div');
        this.bar.className = 'scroll-progress-bar';
        this.bar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: linear-gradient(90deg, var(--color-accent-primary), var(--color-accent-gold));
            z-index: 9999;
            transform-origin: left;
            transform: scaleX(0);
            pointer-events: none;
        `;
        document.body.appendChild(this.bar);

        window.addEventListener('scroll', () => this.update(), { passive: true });
    },

    update: function() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollTop / docHeight;
        this.bar.style.transform = `scaleX(${Math.min(progress, 1)})`;
    }
};

// --- Text Scramble Effect ---
const TextScramble = {
    chars: '!<>-_\\/[]{}—=+*^?#________',
    frames: [],

    scramble: function(element, targetText, duration = 1000) {
        const originalText = element.textContent;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            if (progress < 1) {
                let displayText = '';
                for (let i = 0; i < targetText.length; i++) {
                    if (i < targetText.length * progress) {
                        displayText += targetText[i];
                    } else {
                        displayText += this.chars[Math.floor(Math.random() * this.chars.length)];
                    }
                }
                element.textContent = displayText;
                requestAnimationFrame(animate);
            } else {
                element.textContent = targetText;
            }
        };

        requestAnimationFrame(animate);
    }
};

// --- Counter Animation (Enhanced) ---
const Counter = {
    animate: function(element, target, options = {}) {
        const {
            duration = 2000,
            easing = 'easeOutCubic',
            formatter = (n) => n.toLocaleString('pt-BR'),
            onComplete = null
        } = options;

        const start = performance.now();
        const startValue = 0;

        const easings = {
            linear: t => t,
            easeOutCubic: t => 1 - Math.pow(1 - t, 3),
            easeOutExpo: t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
            easeOutBounce: t => {
                const n1 = 7.5625;
                const d1 = 2.75;
                if (t < 1 / d1) return n1 * t * t;
                if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
                if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
                return n1 * (t -= 2.625 / d1) * t + 0.984375;
            }
        };

        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easings[easing](progress);
            const current = startValue + (target - startValue) * eased;

            element.textContent = formatter(Math.round(current));

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = formatter(target);
                onComplete?.();
            }
        };

        requestAnimationFrame(animate);
    },

    initCounters: function(selector = '[data-counter]') {
        const counters = document.querySelectorAll(selector);

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.dataset.counter, 10);
                    const duration = parseInt(entry.target.dataset.duration, 10) || 2000;
                    this.animate(entry.target, target, { duration });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
    }
};

// --- Staggered Animation Controller ---
const StaggerAnimation = {
    animate: function(elements, options = {}) {
        const {
            animation = 'fadeInUp',
            delay = 100,
            duration = 600,
            easing = 'cubic-bezier(0.4, 0, 0.2, 1)',
            onComplete = null
        } = options;

        const keyframes = this.getKeyframes(animation);

        elements.forEach((el, index) => {
            el.style.animation = `${animation} ${duration}ms ${easing} ${index * delay}ms both`;
        });

        if (onComplete) {
            setTimeout(onComplete, elements.length * delay + duration);
        }
    },

    getKeyframes: function(name) {
        // Keyframes are defined in CSS
        return name;
    },

    reset: function(elements) {
        elements.forEach(el => {
            el.style.animation = '';
        });
    }
};

// --- Page Transition ---
const PageTransition = {
    overlay: null,
    isTransitioning: false,

    init: function() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'page-transition';
        this.overlay.innerHTML = '<div class="page-transition-overlay"></div>';
        document.body.appendChild(this.overlay);

        // Intercept internal links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="/"], a[href^="./"], a[href^="../"]');
            if (link && !link.target && !link.href.includes('#') && this.isSameOrigin(link.href)) {
                e.preventDefault();
                this.navigate(link.href);
            }
        });
    },

    isSameOrigin: function(url) {
        try {
            return new URL(url).origin === window.location.origin;
        } catch {
            return false;
        }
    },

    navigate: async function(url) {
        if (this.isTransitioning) return;
        this.isTransitioning = true;

        const transitionOverlay = this.overlay.querySelector('.page-transition-overlay');

        // Exit animation
        transitionOverlay.classList.add('active');
        await this.wait(300);

        // Navigate
        window.location.href = url;
    },

    wait: function(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};

// --- Magnetic Button Effect ---
const MagneticButton = {
    init: function(selector = '.btn-magnetic') {
        document.querySelectorAll(selector).forEach(btn => {
            btn.addEventListener('mousemove', (e) => this.handleMove(btn, e));
            btn.addEventListener('mouseleave', () => this.handleLeave(btn));
        });
    },

    handleMove: function(btn, e) {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    },

    handleLeave: function(btn) {
        btn.style.transform = 'translate(0, 0)';
        btn.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        setTimeout(() => btn.style.transition = '', 300);
    }
};

// --- Reveal on Scroll (Enhanced) ---
const ScrollReveal = {
    init: function(selector = '.reveal') {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.querySelectorAll(selector).forEach(el => el.classList.add('visible'));
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        document.querySelectorAll(selector).forEach(el => observer.observe(el));
    }
};

// --- Parallax Elements ---
const Parallax = {
    elements: [],

    init: function(selector = '[data-parallax]') {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        this.elements = Array.from(document.querySelectorAll(selector)).map(el => ({
            element: el,
            speed: parseFloat(el.dataset.parallax) || 0.5,
            offset: el.dataset.parallaxOffset ? parseFloat(el.dataset.parallaxOffset) : 0
        }));

        window.addEventListener('scroll', () => this.update(), { passive: true });
    },

    update: function() {
        const scrollY = window.scrollY;

        this.elements.forEach(({ element, speed, offset }) => {
            const rect = element.getBoundingClientRect();
            const elementTop = rect.top + scrollY;
            const elementHeight = rect.height;

            // Only animate when element is near viewport
            if (scrollY + window.innerHeight > elementTop - 100 && scrollY < elementTop + elementHeight + 100) {
                const yPos = (scrollY - elementTop + window.innerHeight) * speed + offset;
                element.style.transform = `translateY(${yPos}px)`;
            }
        });
    }
};

// --- Typing Animation ---
const TypingAnimation = {
    type: function(element, texts, options = {}) {
        const {
            typeSpeed = 50,
            deleteSpeed = 30,
            pauseDuration = 2000,
            loop = true,
            cursor = true
        } = options;

        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let isPaused = false;

        if (cursor) {
            element.style.borderRight = '2px solid var(--color-accent-primary)';
            element.style.animation = 'blink 0.8s infinite';
        }

        const type = () => {
            const currentText = texts[textIndex];

            if (isPaused) {
                isPaused = false;
                setTimeout(type, pauseDuration);
                return;
            }

            if (!isDeleting && charIndex < currentText.length) {
                element.textContent = currentText.slice(0, charIndex + 1);
                charIndex++;
                setTimeout(type, typeSpeed + Math.random() * 50);
            } else if (isDeleting && charIndex > 0) {
                element.textContent = currentText.slice(0, charIndex - 1);
                charIndex--;
                setTimeout(type, deleteSpeed);
            } else if (!isDeleting && charIndex === currentText.length) {
                isPaused = true;
                isDeleting = true;
                setTimeout(type, pauseDuration);
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                if (loop || textIndex < texts.length) {
                    setTimeout(type, 500);
                }
            }
        };

        type();
    }
};

// --- Initialize Animations ---
document.addEventListener('DOMContentLoaded', () => {
    // Initialize particle system
    ParticleSystem.init();

    // Initialize scroll progress
    ScrollProgress.init();

    // Initialize counters
    Counter.initCounters();

    // Initialize scroll reveal
    ScrollReveal.init();

    // Initialize parallax
    Parallax.init();

    // Initialize magnetic buttons
    MagneticButton.init();

    // Initialize page transitions (optional - can be heavy)
    // PageTransition.init();
});

// Handle page hide/show for particle system
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        ParticleSystem.pause();
    } else {
        ParticleSystem.resume();
    }
});

// Export
window.P5RAnimations = { ParticleSystem, ScrollProgress, TextScramble, Counter, StaggerAnimation, PageTransition, MagneticButton, ScrollReveal, Parallax, TypingAnimation };