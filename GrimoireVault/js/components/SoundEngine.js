
export const SoundEngine = {
    audioContext: null,
    currentTrack: null,
    bgmElement: null,

    tracks: {
        'tavern': 'https://cdn.pixabay.com/download/audio/2022/02/10/audio_55a2aa982c.mp3', // Medieval Tavern
        'combat': 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_03e05a5a67.mp3',   // Battle theme
        'exploration': 'https://cdn.pixabay.com/download/audio/2022/08/30/audio_ee66a505f5.mp3'// Dungeon ambiance
    },

    init() {
        if (!this.bgmElement) {
            this.bgmElement = new Audio();
            this.bgmElement.loop = true;
            this.bgmElement.volume = 0.3; // Default 30% volume
        }
    },

    playTrack(trackName) {
        if (!this.tracks[trackName]) return;
        this.init();

        if (this.currentTrack === trackName && !this.bgmElement.paused) return;

        this.currentTrack = trackName;
        this.bgmElement.src = this.tracks[trackName];
        this.bgmElement.play().catch(e => console.warn('Bloqueio do navegador para Autoplay:', e));
    },

    stopBGM() {
        if (this.bgmElement) {
            this.bgmElement.pause();
            this.bgmElement.currentTime = 0;
            this.currentTrack = null;
        }
    },

    playSFX(type) {

        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        const ctx = this.audioContext;
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        if (type === 'dice') {

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(800, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
            gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.1);
        } else if (type === 'sword') {

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(400, ctx.currentTime);
            osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.2);
            gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.2);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.2);
        }
    }
};

