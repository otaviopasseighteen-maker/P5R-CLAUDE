/* ==========================================================================
   Persona 5 Royal Fan Site - Component JavaScript
   Reusable UI components and interactions
   ========================================================================== */

// --- Modal System ---
const Modal = {
    activeModal: null,

    open: function(modalId) {
        const modal = document.getElementById(modalId);
        const overlay = document.getElementById('modal-overlay') || this.createOverlay();

        if (!modal) return;

        this.activeModal = modal;
        document.body.style.overflow = 'hidden';

        overlay.classList.add('active');
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');

        // Focus trap
        this.trapFocus(modal);

        // Close on overlay click
        overlay.onclick = () => this.close();

        // Close on Escape
        document.addEventListener('keydown', this.handleKeydown);
    },

    close: function() {
        if (!this.activeModal) return;

        const overlay = document.getElementById('modal-overlay');
        this.activeModal.classList.remove('active');
        this.activeModal.setAttribute('aria-hidden', 'true');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        document.removeEventListener('keydown', this.handleKeydown);
        this.activeModal = null;
    },

    createOverlay: function() {
        const overlay = document.createElement('div');
        overlay.id = 'modal-overlay';
        overlay.className = 'modal-overlay';
        document.body.appendChild(overlay);
        return overlay;
    },

    trapFocus: function(modal) {
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        modal.addEventListener('keydown', (e) => {
            if (e.key !== 'Tab') return;

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });

        firstElement?.focus();
    },

    handleKeydown: function(e) {
        if (e.key === 'Escape') {
            Modal.close();
        }
    }
};

// --- Tooltip System ---
const Tooltip = {
    tooltip: null,

    init: function() {
        this.tooltip = document.createElement('div');
        this.tooltip.className = 'tooltip';
        this.tooltip.setAttribute('role', 'tooltip');
        document.body.appendChild(this.tooltip);
    },

    show: function(element, text, position = 'top') {
        if (!this.tooltip) this.init();

        this.tooltip.textContent = text;
        this.tooltip.classList.add('visible');

        const rect = element.getBoundingClientRect();
        const tooltipRect = this.tooltip.getBoundingClientRect();

        let top, left;

        switch (position) {
            case 'top':
                top = rect.top - tooltipRect.height - 8;
                left = rect.left + (rect.width - tooltipRect.width) / 2;
                break;
            case 'bottom':
                top = rect.bottom + 8;
                left = rect.left + (rect.width - tooltipRect.width) / 2;
                break;
            case 'left':
                top = rect.top + (rect.height - tooltipRect.height) / 2;
                left = rect.left - tooltipRect.width - 8;
                break;
            case 'right':
                top = rect.top + (rect.height - tooltipRect.height) / 2;
                left = rect.right + 8;
                break;
        }

        this.tooltip.style.top = `${top + window.scrollY}px`;
        this.tooltip.style.left = `${left + window.scrollX}px`;
    },

    hide: function() {
        if (this.tooltip) {
            this.tooltip.classList.remove('visible');
        }
    },

    bind: function(element, text, position) {
        element.addEventListener('mouseenter', () => this.show(element, text, position));
        element.addEventListener('mouseleave', () => this.hide());
        element.addEventListener('focus', () => this.show(element, text, position));
        element.addEventListener('blur', () => this.hide());
    }
};

// --- Tabs Component ---
const Tabs = {
    init: function(container) {
        const triggers = container.querySelectorAll('[role="tab"]');
        const panels = container.querySelectorAll('[role="tabpanel"]');

        triggers.forEach(trigger => {
            trigger.addEventListener('click', () => this.switchTab(container, trigger, panels));
            trigger.addEventListener('keydown', (e) => this.handleKeydown(e, triggers));
        });
    },

    switchTab: function(container, trigger, panels) {
        const targetId = trigger.getAttribute('aria-controls');

        // Update triggers
        container.querySelectorAll('[role="tab"]').forEach(t => {
            t.classList.remove('active');
            t.setAttribute('aria-selected', 'false');
        });
        trigger.classList.add('active');
        trigger.setAttribute('aria-selected', 'true');

        // Update panels
        panels.forEach(p => p.classList.remove('active'));
        document.getElementById(targetId)?.classList.add('active');
    },

    handleKeydown: function(e, triggers) {
        const index = Array.from(triggers).findIndex(t => t === e.target);
        let newIndex = index;

        switch (e.key) {
            case 'ArrowLeft':
                newIndex = (index - 1 + triggers.length) % triggers.length;
                break;
            case 'ArrowRight':
                newIndex = (index + 1) % triggers.length;
                break;
            case 'Home':
                newIndex = 0;
                break;
            case 'End':
                newIndex = triggers.length - 1;
                break;
            default:
                return;
        }

        e.preventDefault();
        triggers[newIndex].focus();
        triggers[newIndex].click();
    }
};

// --- Accordion Component ---
const Accordion = {
    init: function(container) {
        const triggers = container.querySelectorAll('.accordion-trigger');

        triggers.forEach(trigger => {
            trigger.addEventListener('click', () => this.toggle(trigger));
        });
    },

    toggle: function(trigger) {
        const item = trigger.closest('.accordion-item');
        const content = item.querySelector('.accordion-content');
        const isActive = item.classList.contains('active');

        // Close all others in same container
        const container = item.closest('.accordion');
        if (container) {
            container.querySelectorAll('.accordion-item').forEach(i => {
                if (i !== item) {
                    i.classList.remove('active');
                    const c = i.querySelector('.accordion-content');
                    if (c) c.style.maxHeight = '0';
                }
            });
        }

        if (isActive) {
            item.classList.remove('active');
            content.style.maxHeight = '0';
            trigger.setAttribute('aria-expanded', 'false');
        } else {
            item.classList.add('active');
            content.style.maxHeight = content.scrollHeight + 'px';
            trigger.setAttribute('aria-expanded', 'true');
        }
    }
};

// --- Carousel/Slider Component ---
const Carousel = {
    init: function(container, options = {}) {
        const track = container.querySelector('.carousel-track');
        const slides = container.querySelectorAll('.carousel-slide');
        const prevBtn = container.querySelector('.carousel-prev');
        const nextBtn = container.querySelector('.carousel-next');
        const dotsContainer = container.querySelector('.carousel-dots');

        let currentIndex = 0;
        let slideWidth = 0;
        let autoPlayInterval = null;
        const autoPlayDelay = options.autoPlay || 5000;

        const updateSlideWidth = () => {
            slideWidth = slides[0]?.offsetWidth || 0;
        };

        const goToSlide = (index) => {
            currentIndex = Math.max(0, Math.min(index, slides.length - 1));
            track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
            updateDots();
        };

        const updateDots = () => {
            if (dotsContainer) {
                dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, i) => {
                    dot.classList.toggle('active', i === currentIndex);
                });
            }
        };

        const createDots = () => {
            if (!dotsContainer) return;
            dotsContainer.innerHTML = slides.map((_, i) => `
                <button class="carousel-dot${i === 0 ? ' active' : ''}" data-index="${i}" aria-label="Slide ${i + 1}"></button>
            `).join('');

            dotsContainer.querySelectorAll('.carousel-dot').forEach(dot => {
                dot.addEventListener('click', () => goToSlide(parseInt(dot.dataset.index)));
            });
        };

        const startAutoPlay = () => {
            if (autoPlayDelay && slides.length > 1) {
                autoPlayInterval = setInterval(() => {
                    goToSlide((currentIndex + 1) % slides.length);
                }, autoPlayDelay);
            }
        };

        const stopAutoPlay = () => {
            clearInterval(autoPlayInterval);
        };

        // Event listeners
        prevBtn?.addEventListener('click', () => goToSlide(currentIndex - 1));
        nextBtn?.addEventListener('click', () => goToSlide(currentIndex + 1));

        container.addEventListener('mouseenter', stopAutoPlay);
        container.addEventListener('mouseleave', startAutoPlay);

        // Touch swipe
        let touchStartX = 0;
        track?.addEventListener('touchstart', (e) => touchStartX = e.touches[0].clientX, { passive: true });
        track?.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                goToSlide(currentIndex + (diff > 0 ? 1 : -1));
            }
        });

        // Resize handler
        window.addEventListener('resize', Utils.debounce(() => {
            updateSlideWidth();
            goToSlide(currentIndex);
        }, 250));

        // Keyboard
        container.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') goToSlide(currentIndex - 1);
            if (e.key === 'ArrowRight') goToSlide(currentIndex + 1);
        });

        // Initialize
        updateSlideWidth();
        createDots();
        startAutoPlay();

        return { goToSlide, next: () => goToSlide(currentIndex + 1), prev: () => goToSlide(currentIndex - 1) };
    }
};

// --- Search/Filter Component ---
const SearchFilter = {
    init: function(searchInput, itemsContainer, options = {}) {
        const { searchFields = ['textContent'], filterButtons = null, debounceMs = 300 } = options;
        let currentFilter = 'all';

        const filterItems = Utils.debounce(() => {
            const query = searchInput.value.toLowerCase().trim();
            const items = itemsContainer.querySelectorAll('[data-searchable]');

            items.forEach(item => {
                const searchText = searchFields.map(field => {
                    if (field === 'textContent') return item.textContent.toLowerCase();
                    return item.dataset[field]?.toLowerCase() || '';
                }).join(' ');

                const matchesSearch = !query || searchText.includes(query);
                const matchesFilter = currentFilter === 'all' || item.dataset.category === currentFilter;

                item.style.display = (matchesSearch && matchesFilter) ? '' : 'none';
            });

            // Trigger custom event for "no results" handling
            const visibleCount = itemsContainer.querySelectorAll('[data-searchable]:not([style*="display: none"])').length;
            itemsContainer.dispatchEvent(new CustomEvent('filtercomplete', { detail: { visibleCount, query, filter: currentFilter } }));
        }, debounceMs);

        searchInput.addEventListener('input', filterItems);

        if (filterButtons) {
            filterButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    filterButtons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    currentFilter = btn.dataset.filter;
                    filterItems();
                });
            });
        }

        return { filterItems };
    }
};

// --- Character Detail Modal ---
const CharacterDetail = {
    open: function(characterId) {
        const char = window.P5RApp.data?.characters?.find(c => c.id === characterId);
        if (!char) return;

        const modalHtml = `
            <div class="modal" id="character-modal" role="dialog" aria-modal="true" aria-labelledby="char-modal-title">
                <div class="modal-header">
                    <h2 id="char-modal-title" class="modal-title">${char.name} <span style="color: var(--color-accent-gold);">(${char.codename})</span></h2>
                    <button class="modal-close" aria-label="Fechar"><svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
                </div>
                <div class="modal-body">
                    <div class="character-detail">
                        <div class="character-detail-header">
                            <img src="${char.image}" alt="${char.name}" class="character-detail-image" loading="lazy">
                            <div class="character-detail-meta">
                                <div class="meta-item"><strong>Arcano:</strong> ${char.arcana}</div>
                                <div class="meta-item"><strong>Persona Inicial:</strong> ${char.persona}</div>
                                <div class="meta-item"><strong>Persona Final:</strong> ${char.ultimatePersona}</div>
                                <div class="meta-item"><strong>Confidente:</strong> ${char.confidant}</div>
                                <div class="meta-item"><strong>Voice Actor:</strong> ${char.voiceActor}</div>
                            </div>
                        </div>
                        <p class="character-detail-desc">${char.description}</p>
                        <div class="character-detail-stats">
                            <h4>Estatísticas Base</h4>
                            <div class="stats-grid">
                                ${Object.entries(char.stats).map(([stat, value]) => `
                                    <div class="stat-bar">
                                        <span class="stat-name">${stat.charAt(0).toUpperCase() + stat.slice(1)}</span>
                                        <div class="stat-bar-track"><div class="stat-bar-fill" style="width: ${value * 10}%"></div></div>
                                        <span class="stat-value">${value}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Inject modal if not exists
        let modalContainer = document.getElementById('modal-container');
        if (!modalContainer) {
            modalContainer = document.createElement('div');
            modalContainer.id = 'modal-container';
            document.body.appendChild(modalContainer);
        }
        modalContainer.innerHTML = modalHtml;

        Modal.open('character-modal');

        // Close handler
        modalContainer.querySelector('.modal-close')?.addEventListener('click', () => Modal.close());
    }
};

// --- Confidant Detail ---
const ConfidantDetail = {
    open: function(confidantId) {
        const conf = window.P5RApp.data?.confidants?.find(c => c.id === confidantId);
        if (!conf) return;

        const modalHtml = `
            <div class="modal" id="confidant-modal" role="dialog" aria-modal="true" aria-labelledby="conf-modal-title">
                <div class="modal-header">
                    <h2 id="conf-modal-title" class="modal-title">${conf.name} <span class="badge badge-gold">${conf.arcana}</span></h2>
                    <button class="modal-close" aria-label="Fechar"><svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
                </div>
                <div class="modal-body">
                    <div class="confidant-detail">
                        <div class="confidant-detail-header">
                            <img src="assets/images/confidants/${conf.id}.jpg" alt="${conf.name}" class="confidant-detail-image" loading="lazy">
                            <div class="confidant-detail-info">
                                <div class="meta-item"><strong>Local:</strong> ${conf.location}</div>
                                <div class="meta-item"><strong>Disponibilidade:</strong> ${conf.availability}</div>
                                <div class="meta-item"><strong>Rank Máximo:</strong> ${conf.maxRank}</div>
                            </div>
                        </div>
                        <h4>Habilidades Desbloqueadas</h4>
                        <ul class="confidant-abilities">
                            ${conf.ability.split(', ').map(a => `<li>${a.trim()}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        `;

        let modalContainer = document.getElementById('modal-container');
        if (!modalContainer) {
            modalContainer = document.createElement('div');
            modalContainer.id = 'modal-container';
            document.body.appendChild(modalContainer);
        }
        modalContainer.innerHTML = modalHtml;

        Modal.open('confidant-modal');
        modalContainer.querySelector('.modal-close')?.addEventListener('click', () => Modal.close());
    }
};

// --- Initialize Components on DOM Ready ---
document.addEventListener('DOMContentLoaded', () => {
    // Initialize tooltips
    Tooltip.init();

    // Bind tooltips to elements with data-tooltip
    document.querySelectorAll('[data-tooltip]').forEach(el => {
        Tooltip.bind(el, el.dataset.tooltip, el.dataset.tooltipPosition || 'top');
    });

    // Initialize tabs
    document.querySelectorAll('[role="tablist"]').forEach(Tabs.init);

    // Initialize accordions
    document.querySelectorAll('.accordion').forEach(Accordion.init);

    // Initialize carousels
    document.querySelectorAll('.carousel').forEach(c => Carousel.init(c));

    // Close modals on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') Modal.close();
    });
});

// Export
window.P5RComponents = { Modal, Tooltip, Tabs, Accordion, Carousel, SearchFilter, CharacterDetail, ConfidantDetail };