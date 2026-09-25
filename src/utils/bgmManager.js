// BGM (Background Music) Audio System using HTML5 Audio & Procedural Synthesized Adventure Loop
// Works completely offline, automatically autoplays upon open/interaction, and persists across pages.

import { sound } from './soundEffects';

class BGMManager {
  constructor() {
    this.audio = null;
    this.isPlaying = false;
    this.blobUrl = null;
    this.initialized = false;
    this.targetVolume = 0.28;
    this.autoPlayTriggered = false;

    if (typeof window !== 'undefined') {
      window.addEventListener('gameSoundChanged', (e) => {
        const enabled = e.detail?.enabled;
        this.setMuted(!enabled);
      });
    }
  }

  isSoundEnabled() {
    try {
      const saved = localStorage.getItem('gameSoundEnabled');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  }

  // Generates a cheerful, upbeat adventure game music loop in WAV format (PCM 16-bit 22050Hz)
  createAdventureWavBlob() {
    const sampleRate = 22050;
    const bpm = 124;
    const beatDuration = 60 / bpm; // ~0.4838s
    const totalBars = 8;
    const totalBeats = totalBars * 4; // 32 beats
    const totalDuration = totalBeats * beatDuration; // ~15.48s
    const totalSamples = Math.floor(sampleRate * totalDuration);

    const buffer = new Float32Array(totalSamples);

    // Note frequencies in Hz
    const N = {
      C2: 65.41, G2: 98.00, A2: 110.00, F2: 87.31,
      C3: 130.81, G3: 196.00, A3: 220.00, F3: 174.61, E3: 164.81, D3: 146.83, B2: 123.47,
      C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
      C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, B5: 987.77,
      C6: 1046.50
    };

    // Progression: C - G - Am - F (2 bars each or 1 bar each repeated)
    // 8 Bars: [C, G, Am, F, C, G, F, G]
    const chordProgressions = [
      { bass: N.C2, chord: [N.C4, N.E4, N.G4] },
      { bass: N.G2, chord: [N.B3, N.D4, N.G4] },
      { bass: N.A2, chord: [N.A3, N.C4, N.E4] },
      { bass: N.F2, chord: [N.F3, N.A3, N.C4] },
      { bass: N.C2, chord: [N.C4, N.E4, N.G4] },
      { bass: N.G2, chord: [N.B3, N.D4, N.G4] },
      { bass: N.F2, chord: [N.F3, N.A3, N.C4] },
      { bass: N.G2, chord: [N.G3, N.B3, N.D4] }
    ];

    // Cheerful Catchy Melody Notes: [freq, beatStart, beatLength]
    const melody = [
      // Bar 1 (C)
      [N.C5, 0, 1], [N.E5, 1, 1], [N.G5, 2, 1], [N.A5, 3, 1],
      // Bar 2 (G)
      [N.G5, 4, 1.5], [N.E5, 5.5, 0.5], [N.D5, 6, 1], [N.E5, 7, 1],
      // Bar 3 (Am)
      [N.A5, 8, 1], [N.G5, 9, 1], [N.E5, 10, 1], [N.C5, 11, 1],
      // Bar 4 (F)
      [N.D5, 12, 1], [N.E5, 13, 1], [N.F5, 14, 1], [N.G5, 15, 1],
      // Bar 5 (C)
      [N.E5, 16, 1], [N.G5, 17, 1], [N.C6, 18, 1.5], [N.B5, 19.5, 0.5],
      // Bar 6 (G)
      [N.A5, 20, 1], [N.G5, 21, 1], [N.E5, 22, 1], [N.D5, 23, 1],
      // Bar 7 (F)
      [N.F5, 24, 1], [N.A5, 25, 1], [N.G5, 26, 1], [N.F5, 27, 1],
      // Bar 8 (G -> resolve)
      [N.E5, 28, 1], [N.D5, 29, 1], [N.C5, 30, 2]
    ];

    // Render Audio
    for (let i = 0; i < totalSamples; i++) {
      const t = i / sampleRate;
      const beat = t / beatDuration;
      const bar = Math.floor(beat / 4) % totalBars;
      const barBeat = beat % 4;
      const currentChord = chordProgressions[bar];

      let sample = 0;

      // 1. Bassline (Bouncy plucked sine + soft 2nd harmonic)
      const bassBeatFract = barBeat % 1;
      const bassNoteActive = barBeat < 1 || (barBeat >= 2 && barBeat < 3);
      if (bassNoteActive) {
        const bassEnv = Math.exp(-bassBeatFract * 4.5);
        const bassFreq = (barBeat >= 2 ? currentChord.bass * 1.5 : currentChord.bass);
        const bassWave = Math.sin(2 * Math.PI * bassFreq * t) * 0.7 +
          Math.sin(4 * Math.PI * bassFreq * t) * 0.3;
        sample += bassWave * bassEnv * 0.35;
      }

      // 2. Harmony Arpeggio (Soft triangle bells)
      const arpIndex = Math.floor(barBeat * 2) % currentChord.chord.length;
      const arpFreq = currentChord.chord[arpIndex];
      const arpFract = (barBeat * 2) % 1;
      const arpEnv = Math.exp(-arpFract * 6);
      const arpPhase = (t * arpFreq) % 1;
      const arpWave = (Math.abs(arpPhase - 0.5) - 0.25) * 4; // triangle
      sample += arpWave * arpEnv * 0.18;

      // 3. Cheerful Lead Melody (Bright vibraphone / marimba style)
      for (let m = 0; m < melody.length; m++) {
        const [mFreq, mStart, mLen] = melody[m];
        if (beat >= mStart && beat < mStart + mLen) {
          const mBeatOffset = beat - mStart;
          const mEnv = Math.exp(-mBeatOffset * 2.8) * Math.min(mBeatOffset * 30, 1);
          const mPhase = 2 * Math.PI * mFreq * t;
          const mWave = Math.sin(mPhase) * 0.65 +
            Math.sin(mPhase * 2) * 0.25 +
            Math.sin(mPhase * 3) * 0.1;
          sample += mWave * mEnv * 0.38;
          break;
        }
      }

      // 4. Subtle Percussion / Rhythm Shaker (Soft noise taps on upbeat)
      const drumFract = (barBeat * 2) % 1;
      if (drumFract < 0.1) {
        const noise = (Math.random() * 2 - 1) * Math.exp(-drumFract * 30);
        sample += noise * 0.08;
      }

      buffer[i] = Math.max(-1, Math.min(1, sample));
    }

    // Convert to 16-bit PCM WAV container
    const wavBytes = new Uint8Array(44 + totalSamples * 2);
    const view = new DataView(wavBytes.buffer);

    // RIFF Chunk
    this.writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + totalSamples * 2, true);
    this.writeString(view, 8, 'WAVE');

    // fmt subchunk
    this.writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true); // PCM format size
    view.setUint16(20, 1, true); // Linear PCM
    view.setUint16(22, 1, true); // Mono channel
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true); // byte rate
    view.setUint16(32, 2, true); // block align
    view.setUint16(34, 16, true); // bits per sample

    // data subchunk
    this.writeString(view, 36, 'data');
    view.setUint32(40, totalSamples * 2, true);

    // Write samples
    let offset = 44;
    for (let i = 0; i < totalSamples; i++) {
      const s = Math.max(-1, Math.min(1, buffer[i]));
      const val = s < 0 ? s * 0x8000 : s * 0x7fff;
      view.setInt16(offset, val, true);
      offset += 2;
    }

    return new Blob([wavBytes], { type: 'audio/wav' });
  }

  writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  init(customSrc = null) {
    if (this.initialized && !customSrc) return;
    try {
      if (customSrc) {
        if (this.audio) {
          this.audio.pause();
        }
        this.audio = new Audio(customSrc);
      } else {
        // Cek file audio custom di public/audio/bgm.mp3
        const customFile = '/audio/bgm.mp3';
        this.audio = new Audio(customFile);

        // Jika file audio custom belum ada di public/audio/bgm.mp3,
        // otomatis fallback ke procedural synthesizer bawaan!
        this.audio.onerror = () => {
          if (!this.blobUrl) {
            const blob = this.createAdventureWavBlob();
            this.blobUrl = URL.createObjectURL(blob);
          }
          if (this.audio.src !== this.blobUrl) {
            this.audio.src = this.blobUrl;
            if (this.isPlaying) {
              this.audio.play().catch(() => { });
            }
          }
        };
      }

      this.audio.loop = true;
      this.audio.volume = this.targetVolume;
      this.initialized = true;
    } catch (e) {
      console.error('Failed to initialize BGM audio:', e);
    }
  }

  // Method untuk mengganti lagu secara dinamis dengan URL atau path file audio lain
  setCustomTrack(src) {
    this.init(src);
    if (this.isSoundEnabled()) {
      this.audio.play().then(() => {
        this.isPlaying = true;
      }).catch(() => { });
    }
  }

  // Starts playing BGM immediately, handles browser autoplay restrictions gracefully
  start() {
    if (!this.isSoundEnabled()) return;

    this.init();
    if (!this.audio) return;

    this.audio.volume = this.targetVolume;
    const playPromise = this.audio.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          this.isPlaying = true;
          // Successfully playing automatically!
        })
        .catch(() => {
          // Browser autoplay restriction encountered
          // Attach automatic trigger on first user touch/click anywhere on page
          if (!this.autoPlayTriggered) {
            this.autoPlayTriggered = true;
            const unlockAudio = () => {
              if (this.isSoundEnabled() && this.audio) {
                this.audio.play().then(() => {
                  this.isPlaying = true;
                  sound.init(); // Also unlock Web Audio SFX context
                }).catch(() => { });
              }
              window.removeEventListener('pointerdown', unlockAudio);
              window.removeEventListener('click', unlockAudio);
              window.removeEventListener('touchstart', unlockAudio);
              window.removeEventListener('keydown', unlockAudio);
            };

            window.addEventListener('pointerdown', unlockAudio, { once: true, passive: true });
            window.addEventListener('click', unlockAudio, { once: true, passive: true });
            window.addEventListener('touchstart', unlockAudio, { once: true, passive: true });
            window.addEventListener('keydown', unlockAudio, { once: true, passive: true });
          }
        });
    }
  }

  pause() {
    if (this.audio) {
      this.audio.pause();
      this.isPlaying = false;
    }
  }

  setMuted(muted) {
    if (muted) {
      this.pause();
    } else {
      this.start();
    }
  }

  toggle() {
    if (this.isPlaying) {
      this.pause();
      return false;
    } else {
      this.start();
      return true;
    }
  }
}

export const bgm = new BGMManager();
