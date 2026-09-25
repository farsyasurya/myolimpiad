// Web Audio API sound synthesizer for interactive game audio effects
// Safe, cross-browser, no external audio files required!

class SoundSystem {
  constructor() {
    this.ctx = null;
    this.enabled = this.getStoredSoundSetting();
  }

  getStoredSoundSetting() {
    try {
      const saved = localStorage.getItem('gameSoundEnabled');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  }

  setSoundEnabled(enabled) {
    this.enabled = enabled;
    try {
      localStorage.setItem('gameSoundEnabled', JSON.stringify(enabled));
    } catch (e) {
      console.error(e);
    }
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTone(freq, type = 'sine', duration = 0.1, gainVal = 0.15) {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio context might fail before user interaction
    }
  }

  playPop() {
    this.playTone(480, 'sine', 0.08, 0.2);
  }

  playCorrect() {
    if (!this.enabled) return;
    try {
      this.init();
      const now = this.ctx.currentTime;
      // Arpeggio chime
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        setTimeout(() => {
          this.playTone(freq, 'triangle', 0.2, 0.2);
        }, i * 90);
      });
    } catch (e) {
      console.error(e);
    }
  }

  playWrong() {
    if (!this.enabled) return;
    try {
      this.init();
      [220, 185].forEach((freq, i) => {
        setTimeout(() => {
          this.playTone(freq, 'sawtooth', 0.18, 0.15);
        }, i * 110);
      });
    } catch (e) {
      console.error(e);
    }
  }

  playStar() {
    if (!this.enabled) return;
    try {
      this.init();
      [659.25, 880, 1174.66].forEach((freq, i) => {
        setTimeout(() => {
          this.playTone(freq, 'sine', 0.25, 0.2);
        }, i * 120);
      });
    } catch (e) {
      console.error(e);
    }
  }

  playVictory() {
    if (!this.enabled) return;
    try {
      this.init();
      const notes = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5];
      notes.forEach((freq, i) => {
        setTimeout(() => {
          this.playTone(freq, 'triangle', 0.28, 0.25);
        }, i * 140);
      });
    } catch (e) {
      console.error(e);
    }
  }
}

export const sound = new SoundSystem();
