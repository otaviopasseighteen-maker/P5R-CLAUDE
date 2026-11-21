/* ==========================================================================
   Persona 5 Royal - Mechanics Page JavaScript
   ========================================================================== */

const MechanicsPage = {
    mechanics: [],

    init: function() {
        this.mechanics = window.P5RApp.data?.mechanics || [];
        this.cacheElements();
        this.bindEvents();
        this.render();
    },

    cacheElements: function() {
        this.grid = document.getElementById('mechanics-grid');
        this.tabs = document.querySelectorAll('.tabs[role="tablist"] .tab-btn');
        this.panels = document.querySelectorAll('.tab-panels .tab-panel');
    },

    bindEvents: function() {
        // Tab switching for fusion guide
        this.tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this.tabs.forEach(t => {
                    t.classList.remove('active');
                    t.setAttribute('aria-selected', 'false');
                });
                this.panels.forEach(p => p.classList.remove('active'));

                tab.classList.add('active');
                tab.setAttribute('aria-selected', 'true');
                const targetId = tab.getAttribute('aria-controls');
                document.getElementById(targetId)?.classList.add('active');
            });
        });
    },

    render: function() {
        if (!this.grid) return;

        const icons = {
            sword: '<svg viewBox="0 0 24 24"><path d="M18 12H2M12 6l6 6-6 6"/></svg>',
            flask: '<svg viewBox="0 0 24 24"><path d="M10 2v7.31M14 2v7.31M6 9h12v11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9zM8 9h8"/></svg>',
            chart: '<svg viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
            clock: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
            comments: '<svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
            star: '<svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>'
        };

        this.grid.innerHTML = this.mechanics.map((mech, index) => `
            <article class="mechanic-card reveal" data-reveal style="transition-delay: ${index * 60}ms" role="listitem">
                <div class="mechanic-card-icon">${icons[mech.icon] || icons.sword}</div>
                <h3 class="mechanic-card-title">${mech.title}</h3>
                <p class="mechanic-card-desc">${mech.description}</p>
                <div class="mechanic-card-tags">
                    ${mech.tags.map(tag => `<span class="mechanic-tag">${tag}</span>`).join('')}
                </div>
            </article>
        `).join('');

        // Trigger reveal
        requestAnimationFrame(() => {
            this.grid.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('revealed'));
        });
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('mechanics-grid')) {
        MechanicsPage.init();
    }
});

// Export
window.P5RMechanicsPage = MechanicsPage;