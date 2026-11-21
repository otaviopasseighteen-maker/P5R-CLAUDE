/* ==========================================================================
   Persona 5 Royal - OST Page JavaScript
   ========================================================================== */

const OSTPage = {
    tracks: [],
    filteredTracks: [],
    currentFilter: 'all',
    searchQuery: '',
    currentTrackIndex: 0,
    isPlaying: false,
    audio: null,

    init: function() {
        this.tracks = window.P5RApp.data?.ost || [];
        this.filteredTracks = [...this.tracks];
        this.cacheElements();
        this.bindEvents();
        this.render();
        this.initAudioPlayer();
    },

    cacheElements: function() {
        this.container = document.getElementById('tracklist-container');
        this.searchInput = document.getElementById('ost-search');
        this.filterTabs = document.querySelectorAll('.filter-tab');
        this.trackCount = document.getElementById('track-count');

        // Player elements
        this.playBtn = document.getElementById('btn-play');
        this.pauseIcon = document.getElementById('pause-icon');
        this.playIcon = document.getElementById('play-icon');
        this.prevBtn = document.getElementById('btn-prev');
        this.nextBtn = document.getElementById('btn-next');
        this.progressFill = document.getElementById('progress-fill');
        this.currentTimeEl = document.getElementById('current-time');
        this.totalTimeEl = document.getElementById('total-time');
        this.volumeSlider = document.getElementById('volume-slider');
        this.trackTitle = document.getElementById('track-title');
        this.trackArtist = document.getElementById('track-artist');
        this.trackArtwork = document.getElementById('track-artwork');
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

        // Player controls
        this.playBtn?.addEventListener('click', () => this.togglePlay());
        this.prevBtn?.addEventListener('click', () => this.prevTrack());
        this.nextBtn?.addEventListener('click', () => this.nextTrack());
        this.volumeSlider?.addEventListener('input', (e) => this.setVolume(e.target.value));
    },

    applyFilters: function() {
        this.filteredTracks = this.tracks.filter(track => {
            const matchesSearch = !this.searchQuery ||
                track.title.toLowerCase().includes(this.searchQuery) ||
                track.composer.toLowerCase().includes(this.searchQuery) ||
                track.category.toLowerCase().includes(this.searchQuery);

            const matchesFilter = this.currentFilter === 'all' || track.category === this.currentFilter;

            return matchesSearch && matchesFilter;
        });

        this.render();
    },

    render: function() {
        if (!this.container) return;

        this.trackCount.textContent = `${this.filteredTracks.length} de ${this.tracks.length} faixas`;

        this.container.innerHTML = this.filteredTracks.map((track, index) => `
            <div class="track-card" data-track-index="${this.tracks.indexOf(track)}" role="listitem">
                <span class="track-number">${this.tracks.indexOf(track) + 1}</span>
                <div class="track-info">
                    <h4 class="track-title">${track.title}</h4>
                    <div class="track-meta">
                        <span class="track-composer">${track.composer}</span>
                        <span class="track-category badge badge-outline">${track.category}</span>
                        <span class="track-duration">${track.duration}</span>
                    </div>
                </div>
                <button class="track-play" data-track-index="${this.tracks.indexOf(track)}" aria-label="Selecionar ${track.title}">
                    <span>Selecionar</span>
                </button>
            </div>
        `).join('');

        // Bind track play buttons
        this.container.querySelectorAll('.track-play').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = parseInt(btn.dataset.trackIndex, 10);
                this.playTrack(index);
            });
        });

        // Bind track card click
        this.container.querySelectorAll('.track-card').forEach(card => {
            card.addEventListener('click', () => {
                const index = parseInt(card.dataset.trackIndex, 10);
                this.playTrack(index);
            });
        });
    },

    initAudioPlayer: function() {
        // The repository does not include licensed audio files or stream URLs.
        // Keep the UI honest: metadata browsing is available, playback is not simulated.
        this.audio = null;
        if (this.playBtn) {
            this.playBtn.disabled = true;
            this.playBtn.setAttribute('aria-label', 'Player indisponível: áudio não incluído');
        }
        if (this.volumeSlider) this.volumeSlider.disabled = true;
        ['btn-shuffle', 'btn-repeat'].forEach(id => {
            const button = document.getElementById(id);
            if (button) button.hidden = true;
        });
        const status = document.createElement('p');
        status.className = 'player-unavailable-note';
        status.textContent = 'Este projeto contém metadados da trilha sonora; arquivos de áudio não estão incluídos.';
        this.trackArtist?.parentElement?.appendChild(status);
    },

    playTrack: function(index) {
        const track = this.tracks[index];
        if (!track) return;

        this.currentTrackIndex = index;

        // Update UI
        this.trackTitle.textContent = track.title;
        this.trackArtist.textContent = `${track.composer}${track.vocals ? ` ft. ${track.vocals}` : ''}`;
        this.trackArtwork.innerHTML = '<svg viewBox="0 0 24 24" width="64" height="64"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';

        // Update track cards
        this.container.querySelectorAll('.track-card').forEach((card, i) => {
            card.classList.toggle('playing', i === index);
        });

        // Select metadata only; no audio files or streaming sources are shipped.
        this.isPlaying = false;
        this.updatePlayButton(false);
    },

    togglePlay: function() {
        // Playback intentionally unavailable until licensed audio sources are added.
        this.updatePlayButton(false);
    },

    prevTrack: function() {
        if (!this.tracks.length) return;
        const newIndex = (this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length;
        this.playTrack(newIndex);
    },

    nextTrack: function() {
        if (!this.tracks.length) return;
        const newIndex = (this.currentTrackIndex + 1) % this.tracks.length;
        this.playTrack(newIndex);
    },

    setVolume: function() {
        // No audio engine is initialized in this metadata-only player.
    },

    updateProgress: function() {
        if (!this.audio || !this.progressFill || !this.currentTimeEl) return;
        if (this.audio.duration) {
            const progress = (this.audio.currentTime / this.audio.duration) * 100;
            this.progressFill.style.width = `${progress}%`;
            this.currentTimeEl.textContent = this.formatTime(this.audio.currentTime);
        }
    },

    updateTotalTime: function() {
        if (!this.audio || !this.totalTimeEl) return;
        this.totalTimeEl.textContent = this.formatTime(this.audio.duration);
    },

    updatePlayButton: function(playing) {
        this.isPlaying = playing;
        if (this.playIcon) this.playIcon.hidden = playing;
        if (this.pauseIcon) this.pauseIcon.hidden = !playing;
        this.playBtn?.setAttribute('aria-label', 'Player indisponível: áudio não incluído');

        // Update track card play buttons
        this.container?.querySelectorAll('.track-play').forEach((btn, i) => {
            const isCurrent = i === this.currentTrackIndex;
            btn.textContent = isCurrent ? 'Selecionada' : 'Selecionar';
        });
    },

    handleAudioError: function() {
        console.warn('Audio playback failed - using placeholder');
        this.updatePlayButton(false);
    },

    formatTime: function(seconds) {
        if (!seconds || isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('tracklist-container')) {
        OSTPage.init();
    }
});

// Export
window.P5ROSTPage = OSTPage;