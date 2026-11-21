/* ==========================================================================
   Persona 5 Royal - Palaces Page JavaScript
   ========================================================================== */

const PalacesPage = {
    palaces: [],
    currentTab: 'main',

    init: function() {
        this.palaces = window.P5RApp.data?.palaces || [];
        this.cacheElements();
        this.bindEvents();
        this.renderTab('main');
    },

    cacheElements: function() {
        this.tabs = document.querySelectorAll('.palace-tab');
        this.panels = document.querySelectorAll('.tab-panel');
        this.mainGrid = document.getElementById('palaces-main-grid');
        this.royalGrid = document.getElementById('palaces-royal-grid');
        this.mementosPanel = document.getElementById('panel-mementos');
    },

    bindEvents: function() {
        this.tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this.tabs.forEach(t => {
                    t.classList.remove('active');
                    t.setAttribute('aria-selected', 'false');
                });
                this.panels.forEach(p => p.classList.remove('active'));

                tab.classList.add('active');
                tab.setAttribute('aria-selected', 'true');
                const targetId = tab.getAttribute('aria-controls') || `panel-${tab.dataset.palace}`;
                document.getElementById(targetId)?.classList.add('active');

                this.currentTab = tab.dataset.palace;
                this.renderTab(this.currentTab);
            });
        });
    },

    renderTab: function(tab) {
        switch (tab) {
            case 'main':
                this.renderPalaces(this.mainGrid, this.palaces.filter(p => !p.id.includes('mementos') && !p.id.includes('maruki')));
                break;
            case 'royal':
                this.renderPalaces(this.royalGrid, this.palaces.filter(p => p.id === 'maruki'));
                this.renderMementosDetail();
                break;
            case 'mementos':
                this.renderMementosDetail();
                break;
        }
    },

    renderPalaces: function(grid, palaces) {
        if (!grid) return;

        grid.innerHTML = palaces.map((palace, index) => `
            <article class="palace-card reveal" data-reveal style="transition-delay: ${index * 60}ms" role="listitem">
                <div class="palace-card-image">
                    <img src="${palace.image}" alt="${palace.name}" loading="lazy" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgMjI1Ij48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIyNSIgZmlsbD0iIzE2MTYxNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMzMzIiBmb250LXNpemU9IjI0Ij5JbWFnZW0gZG8gUGFsYWNpbyBuw6NvIGRpc3BvbmlibGU8L3RleHQ+PC9zdmc+'">
                    <div class="palace-card-overlay"></div>
                    <span class="palace-card-progress">${palace.recommendedLevel}+</span>
                </div>
                <div class="palace-card-info">
                    <h3 class="palace-card-name">${palace.name}</h3>
                    <p class="palace-card-ruler"><strong>Governante:</strong> ${palace.ruler}</p>
                </div>
                <div class="palace-card-body">
                    <div class="palace-card-meta">
                        <span class="palace-meta-item"><svg viewBox="0 0 24 24" width="14" height="14"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg> <strong>Pecado:</strong> ${palace.sin}</span>
                        <span class="palace-meta-item"><svg viewBox="0 0 24 24" width="14" height="14"><path d="M12 2L2 7l10 5 10-5-10-5z"/></svg> <strong>Arcano:</strong> ${palace.arcana}</span>
                        <span class="palace-meta-item"><svg viewBox="0 0 24 24" width="14" height="14"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> <strong>Local:</strong> ${palace.location}</span>
                        <span class="palace-meta-item"><svg viewBox="0 0 24 24" width="14" height="14"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> <strong>Prazo:</strong> ${palace.deadline}</span>
                    </div>
                    <p class="palace-card-desc">${palace.description}</p>
                    <div class="palace-card-stats">
                        <div class="palace-stat"><span class="palace-stat-value">${palace.keyFeatures.length}</span><span class="palace-stat-label">Features</span></div>
                        <div class="palace-stat"><span class="palace-stat-value">${palace.willSeeds.length}</span><span class="palace-stat-label">Will Seeds</span></div>
                        <div class="palace-stat"><span class="palace-stat-value">${palace.recommendedLevel}</span><span class="palace-stat-label">Nível Rec.</span></div>
                    </div>
                    <div class="palace-card-tags">
                        ${palace.keyFeatures.map(f => `<span class="palace-tag">${f}</span>`).join('')}
                    </div>
                </div>
            </article>
        `).join('');

        // Trigger reveal
        requestAnimationFrame(() => {
            grid.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('revealed'));
        });
    },

    renderMementosDetail: function() {
        if (!this.mementosPanel || this.mementosPanel.dataset.rendered) return;

        const mementos = this.palaces.find(p => p.id === 'mementos');
        if (!mementos) return;

        this.mementosPanel.innerHTML = `
            <div class="mementos-detail">
                <div class="mementos-header" data-reveal>
                    <div class="mementos-icon" style="background: var(--gradient-primary);"><svg viewBox="0 0 24 24" width="48" height="48"><path d="M12 2L2 7l10 5 10-5-10-5z"/></svg></div>
                    <div>
                        <h3>${mementos.name}</h3>
                        <p class="mementos-subtitle">${mementos.ruler} • ${mementos.sin}</p>
                    </div>
                </div>

                <div class="mementos-content" data-reveal>
                    <div class="mementos-section">
                        <h4>Visão Geral</h4>
                        <p>${mementos.description}</p>
                    </div>

                    <div class="mementos-section">
                        <h4>Características Principais</h4>
                        <ul class="feature-list">
                            ${mementos.keyFeatures.map(f => `<li>${f}</li>`).join('')}
                        </ul>
                    </div>

                    <div class="mementos-section">
                        <h4>Chefes Principais</h4>
                        <div class="boss-list">
                            <div class="boss-item"><strong>Reaper (Ceifador):</strong> Aparece após 2 min no mesmo andar. Dá muito XP. Pode ser derrotado para trophy.</div>
                            <div class="boss-item"><strong>Yaldabaoth (Original):</strong> Boss final do jogo base. Forma do Santo Graal.</div>
                            <div class="boss-item"><strong>Adam Kadmon (Royal):</strong> Boss final do 3º Semestre. Requer Maruki rank 9.</div>
                        </div>
                    </div>

                    <div class="mementos-section">
                        <h4>Dicas de Mementos</h4>
                        <div class="tips-grid">
                            <div class="tip-card"><strong>José (Royal):</strong> Colete flores para ele trocar por itens, XP boost, money boost.</div>
                            <div class="tip-card"><strong>Requests:</strong> Complete requests de confidantes para desbloquear áreas.</div>
                            <div class="tip-card"><strong>Chuva:</strong> Mais sombras raras (Treasure Demons) e melhor drop rate.</div>
                            <div class="tip-card"><strong>Stamp Rally:</strong> Carimbe todos os andares para recompensas.</div>
                        </div>
                    </div>

                    <div class="mementos-section">
                        <h4>Estrutura de Andares</h4>
                        <div class="floors-info">
                            <div class="floor-block"><strong>Qliphoth World (1-10):</strong> Início, sombras fracas</div>
                            <div class="floor-block"><strong>Qliphoth World (11-20):</strong> Dificuldade média</div>
                            <div class="floor-block"><strong>Qliphoth World (21-30):</strong> Sombras fortes, Treasure Demons</div>
                            <div class="floor-block"><strong>Qliphoth World (31-40):</strong> Preparação para boss</div>
                            <div class="floor-block"><strong>Depths (41-50+):</strong> Área final, Yaldabaoth/Adam Kadmon</div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.mementosPanel.dataset.rendered = 'true';

        // Trigger reveal
        requestAnimationFrame(() => {
            this.mementosPanel.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('revealed'));
        });
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('palaces-main-grid')) {
        PalacesPage.init();
    }
});

// Export
window.P5RPalacesPage = PalacesPage;