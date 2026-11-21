/* ==========================================================================
   Persona 5 Royal - Characters Page JavaScript
   ========================================================================== */

const CharactersPage = {
    characters: [],
    filteredCharacters: [],
    currentFilter: 'all',
    searchQuery: '',

    init: function() {
        this.characters = window.P5RApp.data?.characters || [];
        this.filteredCharacters = [...this.characters];
        this.cacheElements();
        this.bindEvents();
        this.render();
    },

    cacheElements: function() {
        this.grid = document.getElementById('characters-grid');
        this.searchInput = document.getElementById('char-search');
        this.filterTabs = document.querySelectorAll('.filter-tab');
        this.noResults = document.getElementById('no-results');
        this.partySlots = document.querySelectorAll('.party-slot:not(.active)');
    },

    bindEvents: function() {
        // Search
        this.searchInput?.addEventListener('input', Utils.debounce((e) => {
            this.searchQuery = e.target.value.toLowerCase().trim();
            this.applyFilters();
        }, 300));

        // Filter tabs
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

        // Party slots
        this.partySlots.forEach(slot => {
            slot.addEventListener('click', () => this.openCharacterPicker(slot));
        });
    },

    applyFilters: function() {
        this.filteredCharacters = this.characters.filter(char => {
            const matchesSearch = !this.searchQuery ||
                char.name.toLowerCase().includes(this.searchQuery) ||
                char.codename.toLowerCase().includes(this.searchQuery) ||
                char.arcana.toLowerCase().includes(this.searchQuery);

            const matchesFilter = this.currentFilter === 'all' || this.getRole(char) === this.currentFilter;

            return matchesSearch && matchesFilter;
        });

        this.render();
    },

    getRole: function(char) {
        const roles = {
            'joker': 'leader',
            'ryuji': 'physical',
            'ann': 'magic',
            'morgana': 'support',
            'yusuji': 'physical',
            'yusuke': 'magic',
            'makoto': 'magic',
            'futaba': 'support',
            'haru': 'magic',
            'akechi': 'leader',
            'kasumi': 'physical'
        };
        return roles[char.id] || 'support';
    },

    render: function() {
        if (!this.grid) return;

        if (this.filteredCharacters.length === 0) {
            this.grid.innerHTML = '';
            this.grid.hidden = true;
            this.noResults.hidden = false;
            return;
        }

        this.grid.hidden = false;
        this.noResults.hidden = true;

        this.grid.innerHTML = this.filteredCharacters.map((char, index) => `
            <article class="character-card reveal" data-reveal style="transition-delay: ${index * 50}ms" role="listitem">
                <a href="#" class="character-card-link" data-character-id="${char.id}">
                    <div class="character-card-image">
                        <img src="${char.image}" alt="${char.name} (${char.codename})" loading="lazy" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMDAgNDAwIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzE2MTYxNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMzMzIiBmb250LXNpemU9IjI0Ij5JbWFnZW0gbmFvIGRpc3BvbmlibGU8L3RleHQ+PC9zdmc+'">
                        <div class="character-card-overlay"></div>
                        <span class="character-card-badge">${char.arcana}</span>
                    </div>
                    <div class="character-card-content">
                        <h3 class="character-card-name">${char.name}</h3>
                        <p class="character-card-persona"><span></span>${char.codename} / ${char.persona}</p>
                        <div class="character-card-stats">
                            <div class="character-stat"><span class="character-stat-value">${char.stats.strength}</span><span class="character-stat-label">For</span></div>
                            <div class="character-stat"><span class="character-stat-value">${char.stats.magic}</span><span class="character-stat-label">Mag</span></div>
                            <div class="character-stat"><span class="character-stat-value">${char.stats.endurance}</span><span class="character-stat-label">Vit</span></div>
                            <div class="character-stat"><span class="character-stat-value">${char.stats.agility}</span><span class="character-stat-label">Agi</span></div>
                            <div class="character-stat"><span class="character-stat-value">${char.stats.luck}</span><span class="character-stat-label">Sor</span></div>
                        </div>
                    </div>
                </a>
            </article>
        `).join('');

        // Bind click events for character cards
        this.grid.querySelectorAll('.character-card-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const charId = link.dataset.characterId;
                window.P5RComponents.CharacterDetail.open(charId);
            });
        });

        // Trigger reveal animations
        requestAnimationFrame(() => {
            this.grid.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('revealed'));
        });
    },

    openCharacterPicker: function(slot) {
        const availableChars = this.characters.filter(c => c.id !== 'joker');
        const modalHtml = `
            <div class="modal" id="party-picker-modal" role="dialog" aria-modal="true" aria-labelledby="picker-title">
                <div class="modal-header">
                    <h2 id="picker-title" class="modal-title">Selecionar Personagem - Slot ${slot.dataset.slot}</h2>
                    <button class="modal-close" aria-label="Fechar"><svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
                </div>
                <div class="modal-body">
                    <div class="character-picker-grid">
                        ${availableChars.map(char => `
                            <button class="picker-card" data-character-id="${char.id}" data-slot="${slot.dataset.slot}">
                                <img src="${char.image}" alt="${char.name}" loading="lazy" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzE2MTYxNiIvPjwvc3ZnPg=='">
                                <span class="picker-name">${char.name}</span>
                                <span class="picker-codename">${char.codename}</span>
                            </button>
                        `).join('')}
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

        window.P5RComponents.Modal.open('party-picker-modal');

        // Handle selection
        modalContainer.querySelectorAll('.picker-card').forEach(card => {
            card.addEventListener('click', () => {
                const charId = card.dataset.characterId;
                const char = this.characters.find(c => c.id === charId);
                this.assignToSlot(slot, char);
                window.P5RComponents.Modal.close();
            });
        });

        modalContainer.querySelector('.modal-close')?.addEventListener('click', () => window.P5RComponents.Modal.close());
    },

    assignToSlot: function(slot, character) {
        slot.classList.add('filled');
        slot.querySelector('.slot-content').innerHTML = `
            <img src="${character.image}" alt="${character.name}" class="slot-avatar" loading="lazy" onerror="this.style.display='none'">
            <span>${character.name} (${character.codename})</span>
        `;
        slot.dataset.characterId = character.id;
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('characters-grid')) {
        CharactersPage.init();
    }
});

// Export
window.P5RCharactersPage = CharactersPage;