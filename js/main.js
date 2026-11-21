/* ==========================================================================
   Persona 5 Royal Fan Site - Main JavaScript
   ========================================================================== */

// --- Global State ---
const App = {
    data: null,
    currentTheme: 'dark',
    isLoading: true,
    init: async function() {
        await this.loadData();
        this.initTheme();
        this.initNavigation();
        this.initLoadingScreen();
        this.initCursorTrail();
        this.initBackToTop();
        this.initRevealAnimations();
        this.initParallax();
        this.populateFeaturedContent();
        this.populateQuotes();
        this.populateUpdates();
        this.initTabs();
        this.initCounters();
        this.registerServiceWorker();
    },

    // --- Data Loading ---
    loadData: async function() {
        try {
            const response = await fetch('data/game-data.json');
            this.data = await response.json();
        } catch (error) {
            console.error('Failed to load game data:', error);
            // Fallback minimal data
            this.data = { characters: [], confidants: [], palaces: [], mechanics: [], ost: [], quotes: [], updates: [] };
        }
    },

    // --- Theme Management ---
    initTheme: function() {
        const savedTheme = SafeStorage.get('p5r-theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');
        this.applyTheme(this.currentTheme);

        const toggle = document.getElementById('theme-toggle');
        if (toggle) {
            toggle.addEventListener('click', () => this.toggleTheme());
        }
    },

    applyTheme: function(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        SafeStorage.set('p5r-theme', theme);
        this.currentTheme = theme;
    },

    toggleTheme: function() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
    },

    // --- Navigation ---
    initNavigation: function() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                const expanded = navToggle.getAttribute('aria-expanded') === 'true';
                navToggle.setAttribute('aria-expanded', !expanded);
                navMenu.classList.toggle('open');
            });

            // Close menu on link click
            navMenu.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    navToggle.setAttribute('aria-expanded', 'false');
                    navMenu.classList.remove('open');
                });
            });

            // Close on outside click
            document.addEventListener('click', (e) => {
                if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                    navToggle.setAttribute('aria-expanded', 'false');
                    navMenu.classList.remove('open');
                }
            });
        }

        // Active link highlighting
        this.updateActiveNavLink();

        // Nav scroll effect
        window.addEventListener('scroll', () => this.handleNavScroll(), { passive: true });
    },

    updateActiveNavLink: function() {
        const currentPath = window.location.pathname;
        const pageMap = {
            '/': 'home',
            '/index.html': 'home',
            '/pages/characters.html': 'characters',
            '/pages/confidants.html': 'confidants',
            '/pages/palaces.html': 'palaces',
            '/pages/mechanics.html': 'mechanics',
            '/pages/ost.html': 'ost',
            '/pages/royal.html': 'royal'
        };

        const currentPage = pageMap[currentPath] || 'home';
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.dataset.page === currentPage);
        });
    },

    handleNavScroll: function() {
        const nav = document.getElementById('main-nav');
        if (nav) {
            nav.classList.toggle('scrolled', window.scrollY > 50);
        }
    },

    // --- Loading Screen ---
    initLoadingScreen: function() {
        const loadingScreen = document.getElementById('loading-screen');
        const progressBar = document.getElementById('loading-progress');
        const percentageText = document.getElementById('loading-percentage');

        if (!loadingScreen) return;

        // Simulate loading progress
        let progress = 0;
        const targetProgress = 100;
        const duration = 1500; // ms
        const startTime = performance.now();

        const animateProgress = (currentTime) => {
            const elapsed = currentTime - startTime;
            progress = Math.min(targetProgress, (elapsed / duration) * targetProgress);

            if (progressBar) progressBar.style.width = `${progress}%`;
            if (percentageText) percentageText.textContent = `${Math.round(progress)}%`;

            if (progress < targetProgress) {
                requestAnimationFrame(animateProgress);
            } else {
                // Complete
                setTimeout(() => {
                    loadingScreen.classList.add('loaded');
                    this.isLoading = false;
                    // Trigger reveal animations
                    document.querySelectorAll('[data-reveal]').forEach((el, i) => {
                        setTimeout(() => el.classList.add('revealed'), i * 80);
                    });
                }, 300);
            }
        };

        requestAnimationFrame(animateProgress);
    },

    // --- Cursor Trail ---
    initCursorTrail: function() {
        const trail = document.getElementById('cursor-trail');
        if (!trail) return;

        let mouseX = 0, mouseY = 0;
        let trailX = 0, trailY = 0;
        let isActive = false;

        const animate = () => {
            trailX += (mouseX - trailX) * 0.15;
            trailY += (mouseY - trailY) * 0.15;

            trail.style.transform = `translate(${trailX - 10}px, ${trailY - 10}px)`;

            if (isActive) {
                requestAnimationFrame(animate);
            }
        };

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            if (!isActive) {
                isActive = true;
                trail.classList.add('active');
                animate();
            }
        });

        document.addEventListener('mouseleave', () => {
            isActive = false;
            trail.classList.remove('active');
        });

        // Reduce motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            trail.style.display = 'none';
        }
    },

    // --- Back to Top ---
    initBackToTop: function() {
        const btn = document.getElementById('back-to-top');
        if (!btn) return;

        window.addEventListener('scroll', () => {
            btn.hidden = window.scrollY < 300;
        }, { passive: true });

        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    },

    // --- Reveal Animations (Intersection Observer) ---
    initRevealAnimations: function() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('revealed'));
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
    },

    // --- Parallax Effect ---
    initParallax: function() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const hero = document.querySelector('.hero');
        if (!hero) return;

        const layers = hero.querySelectorAll('[data-parallax]');

        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const heroHeight = hero.offsetHeight;

            if (scrollY <= heroHeight) {
                layers.forEach(layer => {
                    const speed = parseFloat(layer.dataset.parallax) || 0.5;
                    const yPos = scrollY * speed;
                    layer.style.transform = `translateY(${yPos}px)`;
                });
            }
        }, { passive: true });
    },

    // --- Featured Content Population ---
    populateFeaturedContent: function() {
        if (!this.data) return;

        // Characters
        const charContainer = document.getElementById('featured-characters');
        if (charContainer && this.data.characters) {
            const featuredChars = this.data.characters.slice(0, 6);
            charContainer.innerHTML = featuredChars.map(char => this.createCharacterCard(char)).join('');
        }

        // Confidants
        const confContainer = document.getElementById('featured-confidants');
        if (confContainer && this.data.confidants) {
            const featuredConfs = this.data.confidants.filter(c => c.maxRank === 10).slice(0, 6);
            confContainer.innerHTML = featuredConfs.map(conf => this.createConfidantCard(conf)).join('');
        }

        // Tips/Mechanics
        const tipsContainer = document.getElementById('featured-tips');
        if (tipsContainer && this.data.mechanics) {
            const featuredTips = this.data.mechanics.slice(0, 6);
            tipsContainer.innerHTML = featuredTips.map(tip => this.createMechanicCard(tip)).join('');
        }
    },

    createCharacterCard: function(char) {
        return `
            <article class="character-card reveal" data-reveal>
                <a href="pages/characters.html#${char.id}" class="character-card-link">
                    <div class="character-card-image">
                        <img src="${char.image}" alt="${char.name} (${char.codename})" loading="lazy">
                        <div class="character-card-overlay"></div>
                        <span class="character-card-badge">${char.arcana}</span>
                    </div>
                    <div class="character-card-content">
                        <h3 class="character-card-name">${char.name}</h3>
                        <p class="character-card-persona"><span></span>${char.codename} / ${char.persona}</p>
                        <div class="character-card-stats">
                            <div class="character-stat">
                                <span class="character-stat-value">${char.stats.strength}</span>
                                <span class="character-stat-label">For</span>
                            </div>
                            <div class="character-stat">
                                <span class="character-stat-value">${char.stats.magic}</span>
                                <span class="character-stat-label">Mag</span>
                            </div>
                            <div class="character-stat">
                                <span class="character-stat-value">${char.stats.endurance}</span>
                                <span class="character-stat-label">Vit</span>
                            </div>
                            <div class="character-stat">
                                <span class="character-stat-value">${char.stats.agility}</span>
                                <span class="character-stat-label">Agi</span>
                            </div>
                            <div class="character-stat">
                                <span class="character-stat-value">${char.stats.luck}</span>
                                <span class="character-stat-label">Sor</span>
                            </div>
                        </div>
                    </div>
                </a>
            </article>
        `;
    },

    createConfidantCard: function(conf) {
        return `
            <article class="confidant-card reveal" data-reveal>
                <a href="pages/confidants.html#${conf.id}" class="confidant-card-link">
                    <div class="confidant-card-header">
                        <img src="assets/images/confidants/${conf.id}.jpg" alt="${conf.name}" class="confidant-card-portrait" loading="lazy">
                        <div class="confidant-card-info">
                            <h3 class="confidant-card-name">${conf.name}</h3>
                            <span class="confidant-card-arcana">${conf.arcana}</span>
                        </div>
                        <div class="confidant-card-rank">Rank ${conf.maxRank}</div>
                    </div>
                    <div class="confidant-card-body">
                        <p class="confidant-card-desc">${conf.ability.split(',')[0]}</p>
                        <div class="confidant-card-benefits">
                            ${conf.ability.split(', ').slice(0, 3).map(a => `<span class="confidant-benefit">${a.trim()}</span>`).join('')}
                        </div>
                    </div>
                </a>
            </article>
        `;
    },

    createMechanicCard: function(mechanic) {
        const icons = {
            sword: '<svg viewBox="0 0 24 24"><path d="M18 12H2M12 6l6 6-6 6"/></svg>',
            flask: '<svg viewBox="0 0 24 24"><path d="M10 2v7.31M14 2v7.31M6 9h12v11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9zM8 9h8"/></svg>',
            chart: '<svg viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
            clock: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
            comments: '<svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
            star: '<svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>'
        };

        return `
            <article class="mechanic-card reveal" data-reveal>
                <div class="mechanic-card-icon">${icons[mechanic.icon] || icons.sword}</div>
                <h3 class="mechanic-card-title">${mechanic.title}</h3>
                <p class="mechanic-card-desc">${mechanic.description}</p>
                <div class="mechanic-card-tags">
                    ${mechanic.tags.map(tag => `<span class="mechanic-tag">${tag}</span>`).join('')}
                </div>
            </article>
        `;
    },

    // --- Quotes Carousel ---
    populateQuotes: function() {
        const track = document.getElementById('quotes-track');
        if (!track || !this.data?.quotes) return;

        // Duplicate quotes for seamless loop
        const quotes = [...this.data.quotes, ...this.data.quotes];
        track.innerHTML = quotes.map(q => `
            <div class="quote-card">
                <blockquote class="quote-text">"${q.text}"</blockquote>
                <cite class="quote-author">— ${q.author}${q.context ? ` (${q.context})` : ''}</cite>
            </div>
        `).join('');
    },

    // --- Updates ---
    populateUpdates: function() {
        const grid = document.getElementById('updates-grid');
        if (!grid || !this.data?.updates) return;

        grid.innerHTML = this.data.updates.map(update => `
            <article class="update-card reveal" data-reveal>
                <time class="update-date" datetime="${update.date}">${this.formatDate(update.date)}</time>
                <h3 class="update-title">${update.title}</h3>
                <p class="update-excerpt">${update.excerpt}</p>
            </article>
        `).join('');
    },

    formatDate: function(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
    },

    // --- Tabs ---
    initTabs: function() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabPanels = document.querySelectorAll('.tab-panel');

        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.getAttribute('aria-controls');

                tabButtons.forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-selected', 'false');
                });
                tabPanels.forEach(p => p.classList.remove('active'));

                btn.classList.add('active');
                btn.setAttribute('aria-selected', 'true');
                document.getElementById(targetId)?.classList.add('active');
            });
        });
    },

    // --- Counter Animation ---
    initCounters: function() {
        const counters = document.querySelectorAll('[data-count]');
        if (!counters.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
    },

    animateCounter: function(element) {
        const target = parseInt(element.dataset.count, 10);
        const duration = 2000;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
            const current = Math.round(target * eased);
            element.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    },

    // --- Service Worker ---
    registerServiceWorker: function() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register(new URL('./sw.js', document.baseURI)).catch(() => {
                    // SW registration failed; the site remains usable without offline support.
                });
            });
        }
    }
};

// --- Safe storage helpers (storage can be disabled or quota-limited) ---
const SafeStorage = {
    get: function(key) { try { return window.localStorage.getItem(key); } catch (_) { return null; } },
    set: function(key, value) { try { window.localStorage.setItem(key, value); return true; } catch (_) { return false; } }
};

// --- Utility Functions ---
const Utils = {
    storageGet: function(key) { return SafeStorage.get(key); },
    storageSet: function(key, value) { return SafeStorage.set(key, value); },
    debounce: function(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    },

    throttle: function(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    formatNumber: function(num) {
        return new Intl.NumberFormat('pt-BR').format(num);
    },

    getInitials: function(name) {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
};

// --- Initialize App ---
document.addEventListener('DOMContentLoaded', () => App.init());

// Export for other modules
window.P5RApp = App;
window.P5RUtils = Utils;