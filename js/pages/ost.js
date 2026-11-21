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
                <button class="track-play" data-track-index="${this.tracks.indexOf(track)}" aria-label="Tocar ${track.title}">
                    <svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
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
        this.audio = new Audio();
        this.audio.volume = 0.7;

        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('loadedmetadata', () => this.updateTotalTime());
        this.audio.addEventListener('ended', () => this.nextTrack());
        this.audio.addEventListener('play', () => this.updatePlayButton(true));
        this.audio.addEventListener('pause', () => this.updatePlayButton(false));
        this.audio.addEventListener('error', () => this.handleAudioError());
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

        // Load and play (using placeholder - in real implementation would use actual audio files)
        this.audio.src = `data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAA==`; // Silent 1s WAV
        this.audio.play().catch(() => {
            // Autoplay blocked - show play button
            this.updatePlayButton(false);
        });

        this.isPlaying = true;
        this.updatePlayButton(true);
    },

    togglePlay: function() {
        if (this.audio.paused) {
            this.audio.play().catch(() => {});
        } else {
            this.audio.pause();
        }
    },

    prevTrack: function() {
        const newIndex = (this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length;
        this.playTrack(newIndex);
    },

    nextTrack: function() {
        const newIndex = (this.currentTrackIndex + 1) % this.tracks.length;
        this.playTrack(newIndex);
    },

    setVolume: function(value) {
        this.audio.volume = parseFloat(value);
    },

    updateProgress: function() {
        if (this.audio.duration) {
            const progress = (this.audio.currentTime / this.audio.duration) * 100;
            this.progressFill.style.width = `${progress}%`;
            this.currentTimeEl.textContent = this.formatTime(this.audio.currentTime);
        }
    },

    updateTotalTime: function() {
        this.totalTimeEl.textContent = this.formatTime(this.audio.duration);
    },

    updatePlayButton: function(playing) {
        this.isPlaying = playing;
        this.playIcon.hidden = playing;
        this.pauseIcon.hidden = !playing;
        this.playBtn.setAttribute('aria-label', playing ? 'Pausar' : 'Tocar');

        // Update track card play buttons
        this.container?.querySelectorAll('.track-play').forEach((btn, i) => {
            const isCurrent = i === this.currentTrackIndex;
            btn.innerHTML = isCurrent && playing
                ? '<svg viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>'
                : '<svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
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