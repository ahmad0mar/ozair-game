// Web Audio API Synthesized Sound Engine for Space Explore
// Zero external dependencies, 0ms latency, zero 404s/CORS issues.

class SoundManager {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.ambientGain = null;
    this.ambientNodes = null;
    this.muted = false;
    this.ambientEnabled = false;
    this.listeners = new Set();
    this.lastLaserTime = 0;

    if (typeof window !== "undefined") {
      try {
        const savedMute = localStorage.getItem("space_audio_muted");
        this.muted = savedMute ? JSON.parse(savedMute) : false;
        const savedAmbient = localStorage.getItem("space_ambient_enabled");
        this.ambientEnabled = savedAmbient ? JSON.parse(savedAmbient) : false;
      } catch {}

      const unlock = () => {
        this.init();
        if (this.ctx && this.ctx.state === "suspended") {
          this.ctx.resume();
        }
        window.removeEventListener("pointerdown", unlock);
        window.removeEventListener("keydown", unlock);
        window.removeEventListener("touchstart", unlock);
      };
      window.addEventListener("pointerdown", unlock, { once: true });
      window.addEventListener("keydown", unlock, { once: true });
      window.addEventListener("touchstart", unlock, { once: true });
    }
  }

  init() {
    if (this.ctx || typeof window === "undefined") return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    this.ctx = new AudioContextClass();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.muted ? 0 : 0.6, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    if (this.ambientEnabled && !this.muted) {
      this.startAmbientDrone();
    }
  }

  ensureContext() {
    this.init();
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return !!this.ctx && !this.muted;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    for (const l of this.listeners) {
      try {
        l({ muted: this.muted, ambientEnabled: this.ambientEnabled });
      } catch {}
    }
  }

  toggleMute() {
    this.setMuted(!this.muted);
    return this.muted;
  }

  setMuted(muted) {
    this.muted = muted;
    try {
      localStorage.setItem("space_audio_muted", JSON.stringify(this.muted));
    } catch {}

    if (this.masterGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.linearRampToValueAtTime(this.muted ? 0 : 0.6, now + 0.05);
    }

    if (this.muted && this.ambientNodes) {
      this.stopAmbientDrone();
    } else if (!this.muted && this.ambientEnabled) {
      this.startAmbientDrone();
    }

    this.notify();
  }

  toggleAmbient() {
    this.ambientEnabled = !this.ambientEnabled;
    try {
      localStorage.setItem("space_ambient_enabled", JSON.stringify(this.ambientEnabled));
    } catch {}

    if (this.ambientEnabled && !this.muted) {
      this.startAmbientDrone();
    } else {
      this.stopAmbientDrone();
    }
    this.notify();
    return this.ambientEnabled;
  }

  /* ─── PROCEDURAL SOUND EFFECTS ──────────────────────────── */

  // Laser blaster sound for ship
  playLaser() {
    if (!this.ensureContext()) return;
    const now = this.ctx.currentTime;
    // Throttle slightly to prevent ear fatigue during intense spam
    if (now - this.lastLaserTime < 0.08) return;
    this.lastLaserTime = now;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = "sawtooth";
    // Rapid downward chirp
    const startFreq = 880 + (Math.random() - 0.5) * 80;
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.13);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(3200, now);
    filter.frequency.exponentialRampToValueAtTime(400, now + 0.13);

    gain.gain.setValueAtTime(0.28, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.14);
  }

  // Explosion sound (asteroids, ship damage)
  playExplosion(intensity = "medium") {
    if (!this.ensureContext()) return;
    const now = this.ctx.currentTime;
    const duration = intensity === "large" ? 0.65 : 0.38;

    // 1. Noise buffer for rumble & blast
    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 1.4);
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    const startCutoff = intensity === "large" ? 900 : 1400;
    filter.frequency.setValueAtTime(startCutoff, now);
    filter.frequency.exponentialRampToValueAtTime(60, now + duration);

    const noiseGain = this.ctx.createGain();
    const vol = intensity === "large" ? 0.75 : 0.45;
    noiseGain.gain.setValueAtTime(vol, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.masterGain);

    // 2. Sub-bass sine boom for physical punch
    const sub = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    sub.type = "sine";
    const subStart = intensity === "large" ? 110 : 80;
    sub.frequency.setValueAtTime(subStart, now);
    sub.frequency.exponentialRampToValueAtTime(28, now + duration);

    subGain.gain.setValueAtTime(vol * 0.9, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    sub.connect(subGain);
    subGain.connect(this.masterGain);

    noise.start(now);
    sub.start(now);
    noise.stop(now + duration);
    sub.stop(now + duration);
  }

  // Ship takes damage
  playShipHit() {
    if (!this.ensureContext()) return;
    const now = this.ctx.currentTime;
    this.playExplosion("large");

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.25);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.26);
  }

  // Target hit in Scan Mode (scales pitch up with combo)
  playTargetHit(combo = 1) {
    if (!this.ensureContext()) return;
    const now = this.ctx.currentTime;

    // Pentatonic scale pitch stepping based on combo
    const scale = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5, 1174.66, 1318.51, 1567.98];
    const noteIdx = Math.min(Math.max(0, combo - 1), scale.length - 1);
    const freq = scale[noteIdx];

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = "sine";
    osc1.frequency.setValueAtTime(freq, now);
    osc1.frequency.exponentialRampToValueAtTime(freq * 1.05, now + 0.16);

    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(freq * 2, now);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.masterGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.19);
    osc2.stop(now + 0.19);
  }

  // High combo milestone sparkle
  playComboMilestone() {
    if (!this.ensureContext()) return;
    const now = this.ctx.currentTime;
    const notes = [659.25, 830.61, 987.77, 1318.51]; // E major arpeggio
    notes.forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const start = now + i * 0.05;

      osc.type = "sine";
      osc.frequency.setValueAtTime(f, start);

      gain.gain.setValueAtTime(0.22, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.22);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(start);
      osc.stop(start + 0.23);
    });
  }

  // Scan beam radar pulse / telemetry
  playScanBeam() {
    if (!this.ensureContext()) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = "sine";
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(840, now + 0.35);

    filter.type = "bandpass";
    filter.frequency.setValueAtTime(600, now);
    filter.Q.setValueAtTime(8, now);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.4);
  }

  // Planetary facts decrypted
  playDecrypt() {
    if (!this.ensureContext()) return;
    const now = this.ctx.currentTime;
    const blips = [720, 880, 1100, 1400];
    blips.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + idx * 0.04;

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + 0.09);
    });
  }

  // Telemetry unlocked
  playTelemetry() {
    if (!this.ensureContext()) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(540, now);
    osc.frequency.exponentialRampToValueAtTime(1080, now + 0.18);
    osc.frequency.exponentialRampToValueAtTime(1620, now + 0.3);

    gain.gain.setValueAtTime(0.24, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.33);
  }

  // Warp transition into Space Dive
  playWarp() {
    if (!this.ensureContext()) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.5);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(200, now);
    filter.frequency.exponentialRampToValueAtTime(2400, now + 0.5);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.linearRampToValueAtTime(0.35, now + 0.35);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.56);
  }

  // Rocket launch ignition & atmospheric thrust
  playLaunch() {
    if (!this.ensureContext()) return;
    const now = this.ctx.currentTime;
    const duration = 2.4;

    // Rumble noise
    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(100, now);
    filter.frequency.exponentialRampToValueAtTime(450, now + duration * 0.6);
    filter.frequency.exponentialRampToValueAtTime(120, now + duration);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.02, now);
    noiseGain.gain.linearRampToValueAtTime(0.5, now + 0.8);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.masterGain);

    // Deep sine thruster
    const sub = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    sub.type = "sawtooth";
    sub.frequency.setValueAtTime(55, now);
    sub.frequency.linearRampToValueAtTime(110, now + duration * 0.7);

    subGain.gain.setValueAtTime(0.05, now);
    subGain.gain.linearRampToValueAtTime(0.35, now + 0.7);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    sub.connect(subGain);
    subGain.connect(this.masterGain);

    noise.start(now);
    sub.start(now);
    noise.stop(now + duration);
    sub.stop(now + duration);
  }

  // Grand achievement fanfare
  playAchievement() {
    if (!this.ensureContext()) return;
    const now = this.ctx.currentTime;
    const chords = [
      { f: 523.25, t: 0.0 }, // C5
      { f: 659.25, t: 0.1 }, // E5
      { f: 783.99, t: 0.2 }, // G5
      { f: 1046.5, t: 0.3 }, // C6
      { f: 1318.51, t: 0.45 }, // E6
    ];

    chords.forEach(({ f, t }) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = now + t;

      osc.type = "triangle";
      osc.frequency.setValueAtTime(f, startTime);

      gain.gain.setValueAtTime(0.28, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.6);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(startTime);
      osc.stop(startTime + 0.62);
    });
  }

  // Level up futuristic chime
  playLevelUp() {
    if (!this.ensureContext()) return;
    const now = this.ctx.currentTime;
    const freqs = [440, 554.37, 659.25, 880, 1108.73];
    freqs.forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const st = now + i * 0.07;
      osc.type = "sine";
      osc.frequency.setValueAtTime(f, st);
      gain.gain.setValueAtTime(0.25, st);
      gain.gain.exponentialRampToValueAtTime(0.001, st + 0.25);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(st);
      osc.stop(st + 0.26);
    });
  }

  // Easter egg / cosmic secret sparkle
  playEasterEgg() {
    if (!this.ensureContext()) return;
    const now = this.ctx.currentTime;
    const notes = [1046.5, 1318.51, 1567.98, 2093.0, 2637.02];
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const start = now + idx * 0.055;

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.22, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(start);
      osc.stop(start + 0.36);
    });
  }

  // Quiz correct answer
  playQuizCorrect() {
    if (!this.ensureContext()) return;
    const now = this.ctx.currentTime;
    [1046.5, 1567.98].forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + i * 0.09;
      osc.type = "sine";
      osc.frequency.setValueAtTime(f, t);
      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + 0.32);
    });
  }

  // Quiz wrong answer
  playQuizWrong() {
    if (!this.ensureContext()) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.linearRampToValueAtTime(130, now + 0.22);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.25);
  }

  // Sector Clear / Dive Complete Victory
  playVictory() {
    if (!this.ensureContext()) return;
    const now = this.ctx.currentTime;
    const notes = [
      { f: 523.25, d: 0.12 }, // C5
      { f: 659.25, d: 0.12 }, // E5
      { f: 783.99, d: 0.12 }, // G5
      { f: 1046.5, d: 0.4 },  // C6
    ];

    let t = now;
    notes.forEach(({ f, d }) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(f, t);

      gain.gain.setValueAtTime(0.32, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + d);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + d + 0.02);
      t += d * 0.85;
    });
  }

  // Ship Destroyed / Time Up Defeat
  playGameOver() {
    if (!this.ensureContext()) return;
    const now = this.ctx.currentTime;
    const notes = [392.0, 369.99, 349.23, 311.13]; // Descending
    notes.forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const st = now + i * 0.14;
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(f, st);

      gain.gain.setValueAtTime(0.2, st);
      gain.gain.exponentialRampToValueAtTime(0.001, st + 0.22);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(st);
      osc.stop(st + 0.24);
    });
  }

  // Countdown warning tick (e.g. last 5 seconds)
  playCountdownTick() {
    if (!this.ensureContext()) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, now);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.07);
  }

  // Subtle UI click / pop
  playClick() {
    if (!this.ensureContext()) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.035);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.04);
  }

  /* ─── AMBIENT COSMIC DRONE ──────────────────────────────── */

  startAmbientDrone() {
    if (!this.ctx || this.ambientNodes || this.muted) return;
    const now = this.ctx.currentTime;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    // Warm, deep celestial chord (sub drone)
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(55, now); // A1

    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(55.4, now); // Slight binaural beat

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(160, now);

    // LFO for slow breathing filter sweep
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.type = "sine";
    lfo.frequency.setValueAtTime(0.08, now); // 12.5s cycle
    lfoGain.gain.setValueAtTime(60, now);
    lfo.connect(filter.frequency);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 2.5); // Gentle fade in

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc1.start(now);
    osc2.start(now);
    lfo.start(now);

    this.ambientNodes = { osc1, osc2, lfo, gain, filter };
  }

  stopAmbientDrone() {
    if (!this.ambientNodes || !this.ctx) return;
    const { osc1, osc2, lfo, gain } = this.ambientNodes;
    const now = this.ctx.currentTime;
    try {
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(gain.gain.value, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 1.2);
      setTimeout(() => {
        try {
          osc1.stop();
          osc2.stop();
          lfo.stop();
        } catch {}
      }, 1300);
    } catch {}
    this.ambientNodes = null;
  }
}

export const sound = new SoundManager();
export default sound;
