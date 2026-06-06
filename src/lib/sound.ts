"use client";

/* ═══════════════════════════════════════════════════════════════
   Premium Sound Engine — Web Audio API
   Apple Pro-quality crisp keyboard clicks + UI sounds
   Typing sounds ONLY fire on the Hero typewriter & About terminal
═══════════════════════════════════════════════════════════════ */

type PanValue = number; // -1 (left) → 0 (center) → 1 (right)

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private _enabled = true;
  private _initialized = false;

  /* ── Lazily create AudioContext on first user interaction ── */
  initSound() {
    if (this._initialized || typeof window === "undefined") return;
    try {
      this.ctx = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext)();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.55;
      this.masterGain.connect(this.ctx.destination);
      this._initialized = true;

      /* Resume suspended context (Chrome autoplay policy) */
      if (this.ctx.state === "suspended") {
        this.ctx.resume();
      }

      /* Restore saved preference */
      try {
        const saved = localStorage.getItem("mahad-sound-enabled");
        if (saved === "false") {
          this._enabled = false;
          if (this.masterGain) this.masterGain.gain.value = 0;
        }
      } catch {
        /* ignore */
      }
    } catch {
      /* Web Audio not available */
    }
  }

  init() {
    this.initSound();
  }

  /* ── Toggle mute ── */
  toggle() {
    this._enabled = !this._enabled;
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(
        this._enabled ? 0.55 : 0,
        this.ctx!.currentTime,
        0.08
      );
    }
    try {
      localStorage.setItem("mahad-sound-enabled", String(this._enabled));
    } catch {
      /* ignore */
    }
  }

  isEnabled() {
    return this._enabled;
  }

  /* ── Private: ensure the AudioContext is running ── */
  private ensureReady(): boolean {
    if (!this.ctx || !this.masterGain) return false;
    if (this.ctx.state === "suspended") {
      // Best-effort resume — will only succeed inside a user gesture
      this.ctx.resume().catch(() => {});
    }
    return this.ctx.state === "running";
  }

  /* ────────────────────────────────────────────────────────────
     INTERNAL helpers
  ──────────────────────────────────────────────────────────── */
  private get ac(): AudioContext | null {
    return this.ctx;
  }

  private panner(pan: PanValue): StereoPannerNode | null {
    if (!this.ac) return null;
    const node = this.ac.createStereoPanner();
    node.pan.value = Math.max(-1, Math.min(1, pan));
    return node;
  }

  private connect(
    source: AudioNode,
    pan: PanValue,
    gainVal: number,
    dest?: AudioNode
  ) {
    if (!this.ac || !this.masterGain) return;
    const g = this.ac.createGain();
    g.gain.value = gainVal;
    const p = this.panner(pan);
    if (p) {
      source.connect(p);
      p.connect(g);
    } else {
      source.connect(g);
    }
    g.connect(dest ?? this.masterGain);
  }

  private noise(
    duration: number,
    gainVal: number,
    pan: PanValue,
    freq?: { low: number; high: number }
  ) {
    if (!this.ac || !this.masterGain) return;
    const sampleRate = this.ac.sampleRate;
    const bufLen = Math.floor(sampleRate * duration);
    const buf = this.ac.createBuffer(1, bufLen, sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;

    const src = this.ac.createBufferSource();
    src.buffer = buf;

    if (freq) {
      const bpf = this.ac.createBiquadFilter();
      bpf.type = "bandpass";
      bpf.frequency.value = (freq.low + freq.high) / 2;
      bpf.Q.value = 0.8;
      src.connect(bpf);
      this.connect(bpf, pan, gainVal);
    } else {
      this.connect(src, pan, gainVal);
    }

    const g = this.ac.createGain();
    g.gain.setValueAtTime(gainVal, this.ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, this.ac.currentTime + duration);

    src.start(this.ac.currentTime);
    src.stop(this.ac.currentTime + duration);
  }

  private tone(
    freq: number,
    duration: number,
    gainVal: number,
    pan: PanValue,
    type: OscillatorType = "sine",
    fadeIn = 0.002,
    fadeOut?: number
  ) {
    if (!this.ac || !this.masterGain) return;
    const osc = this.ac.createOscillator();
    const env = this.ac.createGain();
    const now = this.ac.currentTime;
    const fo = fadeOut ?? duration;

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    env.gain.setValueAtTime(0, now);
    env.gain.linearRampToValueAtTime(gainVal, now + fadeIn);
    env.gain.exponentialRampToValueAtTime(0.0001, now + fo);

    osc.connect(env);
    this.connect(env, pan, 1);
    osc.start(now);
    osc.stop(now + duration + 0.01);
  }

  /* ════════════════════════════════════════════════════════════
     PUBLIC SOUNDS
  ════════════════════════════════════════════════════════════ */

  /**
   * Premium Apple-quality keyboard click.
   * Called per character in the Hero Typewriter & About terminal.
   * Two layers: a crisp transient click + subtle resonance tone.
   */
  tick(pan: PanValue = 0) {
    if (!this.ac || !this._enabled) return;
    if (!this.ensureReady()) return;
    const now = this.ac.currentTime;

    /* Layer 1 — Sharp transient (noise burst, high-passed) */
    const sampleRate = this.ac.sampleRate;
    const bufLen = Math.floor(sampleRate * 0.025);
    const buf = this.ac.createBuffer(1, bufLen, sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufLen * 0.15));
    }
    const src = this.ac.createBufferSource();
    src.buffer = buf;

    const hpf = this.ac.createBiquadFilter();
    hpf.type = "highpass";
    hpf.frequency.value = 4800 + Math.random() * 600;
    hpf.Q.value = 0.7;

    const clickEnv = this.ac.createGain();
    clickEnv.gain.setValueAtTime(0.22, now);
    clickEnv.gain.exponentialRampToValueAtTime(0.0001, now + 0.022);

    src.connect(hpf);
    hpf.connect(clickEnv);
    const p1 = this.panner(pan * 0.3);
    if (p1 && this.masterGain) {
      clickEnv.connect(p1);
      p1.connect(this.masterGain);
    } else if (this.masterGain) {
      clickEnv.connect(this.masterGain);
    }
    src.start(now);
    src.stop(now + 0.03);

    /* Layer 2 — Subtle resonance (short sine ping, mimics key switch spring) */
    const osc = this.ac.createOscillator();
    const oscEnv = this.ac.createGain();
    const resFreq = 1100 + Math.random() * 300;

    osc.type = "sine";
    osc.frequency.setValueAtTime(resFreq, now);
    osc.frequency.exponentialRampToValueAtTime(resFreq * 0.6, now + 0.018);

    oscEnv.gain.setValueAtTime(0.06, now);
    oscEnv.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

    osc.connect(oscEnv);
    const p2 = this.panner(pan * 0.2);
    if (p2 && this.masterGain) {
      oscEnv.connect(p2);
      p2.connect(this.masterGain);
    } else if (this.masterGain) {
      oscEnv.connect(this.masterGain);
    }
    osc.start(now);
    osc.stop(now + 0.03);
  }

  /** Hover — soft, airy high-frequency whisper */
  hover(pan: PanValue = 0) {
    if (!this.ac || !this._enabled) return;
    if (!this.ensureReady()) return;
    const now = this.ac.currentTime;
    const osc = this.ac.createOscillator();
    const env = this.ac.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(2400, now);
    osc.frequency.exponentialRampToValueAtTime(2800, now + 0.04);

    env.gain.setValueAtTime(0, now);
    env.gain.linearRampToValueAtTime(0.04, now + 0.01);
    env.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

    osc.connect(env);
    this.connect(env, pan, 1);
    osc.start(now);
    osc.stop(now + 0.07);
  }

  /** Click — satisfying tactile click for button presses */
  click(pan: PanValue = 0) {
    if (!this.ac || !this._enabled) return;
    if (!this.ensureReady()) return;
    const now = this.ac.currentTime;

    /* Body — low thud */
    const osc = this.ac.createOscillator();
    const env = this.ac.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.06);
    env.gain.setValueAtTime(0.35, now);
    env.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
    osc.connect(env);
    this.connect(env, pan, 1);
    osc.start(now);
    osc.stop(now + 0.09);

    /* Top — crisp snap */
    this.noise(0.012, 0.18, pan, { low: 5000, high: 10000 });
  }

  /** Success — ascending two-tone chime (Apple-like) */
  success() {
    if (!this.ac || !this._enabled) return;
    if (!this.ensureReady()) return;
    this.tone(880, 0.18, 0.12, 0, "sine", 0.003, 0.18);
    setTimeout(() => this.tone(1320, 0.22, 0.1, 0, "sine", 0.003, 0.22), 100);
  }

  /** Error — short descending buzz */
  error() {
    if (!this.ac || !this._enabled) return;
    if (!this.ensureReady()) return;
    this.tone(220, 0.12, 0.15, 0, "sawtooth", 0.002, 0.12);
    setTimeout(() => this.tone(180, 0.1, 0.12, 0, "sawtooth", 0.002, 0.1), 80);
  }

  /** Whoosh — fast filtered noise sweep */
  whoosh() {
    if (!this.ac || !this._enabled) return;
    if (!this.ensureReady()) return;
    const now = this.ac.currentTime;
    const sampleRate = this.ac.sampleRate;
    const bufLen = Math.floor(sampleRate * 0.18);
    const buf = this.ac.createBuffer(1, bufLen, sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) d[i] = Math.random() * 2 - 1;

    const src = this.ac.createBufferSource();
    src.buffer = buf;

    const bpf = this.ac.createBiquadFilter();
    bpf.type = "bandpass";
    bpf.frequency.setValueAtTime(800, now);
    bpf.frequency.exponentialRampToValueAtTime(3200, now + 0.18);
    bpf.Q.value = 1.5;

    const env = this.ac.createGain();
    env.gain.setValueAtTime(0.0001, now);
    env.gain.linearRampToValueAtTime(0.18, now + 0.04);
    env.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

    src.connect(bpf);
    bpf.connect(env);
    if (this.masterGain) env.connect(this.masterGain);
    src.start(now);
    src.stop(now + 0.2);
  }

  /** Sparkle — high, airy shimmer */
  sparkle() {
    if (!this.ac || !this._enabled) return;
    if (!this.ensureReady()) return;
    [0, 60, 120].forEach((delay) => {
      setTimeout(() => {
        const pan = (Math.random() - 0.5) * 0.8;
        const freq = 2000 + Math.random() * 2000;
        this.tone(freq, 0.1, 0.07, pan, "sine", 0.002, 0.1);
      }, delay);
    });
  }

  /** Page transition whoosh */
  pageTransition() {
    this.whoosh();
  }

  /** Page enter — subtle ascending tone */
  pageEnter() {
    if (!this.ac || !this._enabled) return;
    this.tone(440, 0.15, 0.08, 0, "sine", 0.01, 0.15);
  }

  /** Section enter — brief breath */
  sectionEnter() {
    if (!this.ac || !this._enabled) return;
    this.noise(0.06, 0.06, 0, { low: 1000, high: 4000 });
  }

  /** Ambient drone — very subtle background hum (disabled to avoid annoyance) */
  ambientDrone() {
    return null;
  }

  stopDrone() {}
}

export const soundManager = new SoundEngine();
