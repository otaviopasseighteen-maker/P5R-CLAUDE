/* ==========================================================================
   Persona 5 Royal - Royal Page JavaScript
   ========================================================================== */

const RoyalPage = {
    init: function() {
        this.cacheElements();
        this.bindEvents();
        this.initChecklist();
    },

    cacheElements: function() {
        this.checklistTabs = document.querySelectorAll('.checklist-tab');
        this.checklistPanels = document.querySelectorAll('.checklist-panel');
        this.checklistItems = document.querySelectorAll('.checklist-items input[type="checkbox"]');
    },

    bindEvents: function() {
        // Checklist tabs
        this.checklistTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this.checklistTabs.forEach(t => {
                    t.classList.remove('active');
                    t.setAttribute('aria-selected', 'false');
                });
                this.checklistPanels.forEach(p => p.classList.remove('active'));

                tab.classList.add('active');
                tab.setAttribute('aria-selected', 'true');
                const targetId = `checklist-${tab.dataset.checklist}`;
                document.getElementById(targetId)?.classList.add('active');
            });
        });

        // Checklist persistence
        this.checklistItems.forEach(checkbox => {
            const key = `p5r_checklist_${checkbox.closest('.checklist-panel').id}_${checkbox.parentElement.textContent.trim()}`;
            const saved = window.P5RUtils?.storageGet(key) ?? null;
            if (saved === 'true') checkbox.checked = true;

            checkbox.addEventListener('change', () => {
                window.P5RUtils?.storageSet(key, checkbox.checked);
                this.updateProgress();
            });
        });
    },

    initChecklist: function() {
        this.updateProgress();
    },

    updateProgress: function() {
        this.checklistPanels.forEach(panel => {
            const checkboxes = panel.querySelectorAll('input[type="checkbox"]');
            const checked = panel.querySelectorAll('input[type="checkbox"]:checked').length;
            const total = checkboxes.length;
            const percentage = total > 0 ? Math.round((checked / total) * 100) : 0;

            // Update tab badge if exists
            const tab = document.querySelector(`.checklist-tab[data-checklist="${panel.id.replace('checklist-', '')}"]`);
            if (tab) {
                let badge = tab.querySelector('.progress-badge');
                if (!badge) {
                    badge = document.createElement('span');
                    badge.className = 'progress-badge';
                    badge.style.cssText = 'margin-left: 8px; font-size: 0.7em; background: var(--color-accent-gold); color: var(--color-fg-inverse); padding: 2px 6px; border-radius: 999px;';
                    tab.appendChild(badge);
                }
                badge.textContent = `${percentage}%`;
            }
        });
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.checklist-tab')) {
        RoyalPage.init();
    }
});

// Export
window.P5RRoyalPage = RoyalPage;