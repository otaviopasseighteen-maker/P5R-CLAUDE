/* ==========================================================================
   Persona 5 Royal - Confidants Page JavaScript
   ========================================================================== */

const ConfidantsPage = {
    confidants: [],
    filteredConfidants: [],
    currentFilter: 'all',
    searchQuery: '',

    // Filter categories
    categories: {
        party: ['magician', 'priestess', 'empress', 'emperor', 'lovers', 'chariot', 'hermit', 'fortune', 'faith'],
        nonParty: ['hierophant', 'strength', 'hanged', 'death', 'temperance', 'devil', 'tower', 'star', 'moon', 'sun', 'judgement'],
        royal: ['councillor', 'faith'],
        auto: ['fool', 'magician', 'judgement']
    },

    init: function() {
        this.confidants = window.P5RApp.data?.confidants || [];
        this.filteredConfidants = [...this.confidants];
        this.cacheElements();
        this.bindEvents();
        this.render();
    },

    cacheElements: function() {
        this.grid = document.getElementById('confidants-grid');
        this.searchInput = document.getElementById('conf-search');
        this.filterTabs = document.querySelectorAll('.filter-tab');
        this.noResults = document.getElementById('no-results');
    },

    bindEvents: function() {
        this.searchInput?.addEventListener('input', Utils.debounce((e) => {
            this.searchQuery = e.target.value.toLowerCase().trim();
            this.applyFilters();
        }, 300));

        this.filterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this.filterTabs.forEach(t => {
                    t.classList.remove('active');
                    t.setAttribute('aria-selected', 'false');
                });
                tab.classList.add('active');
                tab.setAttribute('aria-selected', 'true');
                this.currentFilter = tab.dataset.filter;
                this.applyFilters();
            });
        });
    },

    applyFilters: function() {
        const categoryIds = this.categories[this.currentFilter] || [];

        this.filteredConfidants = this.confidants.filter(conf => {
            const matchesSearch = !this.searchQuery ||
                conf.name.toLowerCase().includes(this.searchQuery) ||
                conf.arcana.toLowerCase().includes(this.searchQuery) ||
                conf.ability.toLowerCase().includes(this.searchQuery);

            let matchesFilter = true;
            if (this.currentFilter !== 'all') {
                matchesFilter = categoryIds.includes(conf.id);
            }

            return matchesSearch && matchesFilter;
        });

        this.render();
    },

    getCategoryLabel: function(conf) {
        if (this.categories.party.includes(conf.id)) return 'party';
        if (this.categories.royal.includes(conf.id)) return 'royal';
        if (this.categories.auto.includes(conf.id)) return 'auto';
        return 'non-party';
    },

    getCategoryColor: function(category) {
        const colors = {
            party: 'var(--color-accent-primary)',
            royal: 'var(--color-accent-gold)',
            auto: 'var(--color-info)',
            'non-party': 'var(--color-fg-tertiary)'
        };
        return colors[category] || colors['non-party'];
    },

    getCategoryName: function(category) {
        const names = {
            party: 'Phantom Thief',
            royal: 'Royal Exclusivo',
            auto: 'Automático',
            'non-party': 'Confidente'
        };
        return names[category] || names['non-party'];
    },

    render: function() {
        if (!this.grid) return;

        if (this.filteredConfidants.length === 0) {
            this.grid.innerHTML = '';
            this.grid.hidden = true;
            this.noResults.hidden = false;
            return;
        }

        this.grid.hidden = false;
        this.noResults.hidden = true;

        this.grid.innerHTML = this.filteredConfidants.map((conf, index) => {
            const category = this.getCategoryLabel(conf);
            const categoryColor = this.getCategoryColor(category);
            const categoryName = this.getCategoryName(category);

            return `
                <article class="confidant-card reveal" data-reveal style="transition-delay: ${index * 40}ms" role="listitem">
                    <a href="#" class="confidant-card-link" data-confidant-id="${conf.id}">
                        <div class="confidant-card-header">
                            <div class="confidant-card-avatar" style="background: ${categoryColor}20; border-color: ${categoryColor};">
                                ${this.getArcanaIcon(conf.arcana)}
                            </div>
                            <div class="confidant-card-info">
                                <h3 class="confidant-card-name">${conf.name}</h3>
                                <span class="confidant-card-arcana">${conf.arcana}</span>
                            </div>
                            <div class="confidant-card-rank" style="background: ${categoryColor}20; color: ${categoryColor}; border: 1px solid ${categoryColor}40;">
                                Rank ${conf.maxRank}
                            </div>
                        </div>
                        <div class="confidant-card-body">
                            <p class="confidant-card-desc">${conf.ability.split(', ')[0]}${conf.ability.split(', ').length > 1 ? '...' : ''}</p>
                            <div class="confidant-card-meta">
                                <span class="confidant-location"><svg viewBox="0 0 24 24" width="14" height="14"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> ${conf.location}</span>
                                <span class="confidant-availability"><svg viewBox="0 0 24 24" width="14" height="14"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> ${conf.availability}</span>
                            </div>
                            <div class="confidant-card-tags">
                                <span class="confidant-tag" style="background: ${categoryColor}20; color: ${categoryColor}; border-color: ${categoryColor}40;">${categoryName}</span>
                            </div>
                        </div>
                    </a>
                </article>
            `;
        }).join('');

        // Bind click events
        this.grid.querySelectorAll('.confidant-card-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const confId = link.dataset.confidantId;
                window.P5RComponents.ConfidantDetail.open(confId);
            });
        });

        // Trigger reveal animations
        requestAnimationFrame(() => {
            this.grid.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('revealed'));
        });
    },

    getArcanaIcon: function(arcana) {
        const icons = {
            'Fool': '<svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/></svg>',
            'Magician': '<svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><line x1="12" y1="22" x2="12" y2="12"/></svg>',
            'Priestess': '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="2"/><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/></svg>',
            'Empress': '<svg viewBox="0 0 24 24"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/></svg>',
            'Emperor': '<svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>',
            'Hierophant': '<svg viewBox="0 0 24 24"><path d="M12 2v20M17 20H7M17 10H7M17 4H7"/></svg>',
            'Lovers': '<svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/></svg>',
            'Chariot': '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83"/></svg>',
            'Justice': '<svg viewBox="0 0 24 24"><path d="M12 2v20M17 20H7M17 10H7M17 4H7"/></svg>',
            'Hermit': '<svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><line x1="12" y1="22" x2="12" y2="14"/></svg>',
            'Fortune': '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
            'Strength': '<svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><circle cx="12" cy="12" r="3"/></svg>',
            'Hanged Man': '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M12 12v8M8 16h8"/></svg>',
            'Death': '<svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><line x1="12" y1="22" x2="12" y2="16"/></svg>',
            'Temperance': '<svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><line x1="12" y1="22" x2="12" y2="14"/><line x1="8" y1="18" x2="16" y2="18"/></svg>',
            'Devil': '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 2v4M12 18v4"/></svg>',
            'Tower': '<svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M12 22V14"/></svg>',
            'Star': '<svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
            'Moon': '<svg viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
            'Sun': '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><g stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></g></svg>',
            'Judgement': '<svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M8 16l4 4 4-4"/></svg>',
            'Councillor': '<svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><circle cx="12" cy="16" r="4"/></svg>',
            'Faith': '<svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/><circle cx="12" cy="12" r="3"/></svg>'
        };
        return icons[arcana] || icons['Fool'];
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('confidants-grid')) {
        ConfidantsPage.init();
    }
});

// Export
window.P5RConfidantsPage = ConfidantsPage;