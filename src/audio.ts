/**
 * Dynamic sound synthesis for Card Game Hub using the Web Audio API.
 * No external audio files required, ensuring instant loading and perfect offline reliability.
 */

class SoundEffectsManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Load mute preference
    if (typeof window !== "undefined") {
      const savedMute = localStorage.getItem("card_game_muted");
      this.isMuted = savedMute === "true";
    }
  }

  private initContext() {
    if (!this.ctx) {
      // @ts-ignore
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    // Resume context if suspended (browser security policy)
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    return this.ctx;
  }

  toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    localStorage.setItem("card_game_muted", String(this.isMuted));
    return this.isMuted;
  }

  getMuteState(): boolean {
    return this.isMuted;
  }

  /** Play standard card deal sound */
  playDeal() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(140, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.16);
  }

  /** Play card shuffle sound */
  playShuffle() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    // Create rapid repeating deck ticks for shuffle
    const playTick = (delay: number, volume: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(250 + Math.random() * 80, ctx.currentTime + delay);
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + delay + 0.05);

      gain.gain.setValueAtTime(volume, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.06);
    };

    for (let i = 0; i < 6; i++) {
      playTick(i * 0.08, 0.12 - i * 0.01);
    }
  }

  /** Play clinking casino chips sound */
  playChip() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    // Dual high-pitch oscillators for coin clink sound
    const playCoinClink = (timeOffset: number, pitchOffset: number) => {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "sine";
      osc1.frequency.setValueAtTime(1200 + pitchOffset, ctx.currentTime + timeOffset);
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(1900 + pitchOffset, ctx.currentTime + timeOffset);

      gain.gain.setValueAtTime(0.15, ctx.currentTime + timeOffset);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + timeOffset + 0.08);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(ctx.currentTime + timeOffset);
      osc1.stop(ctx.currentTime + timeOffset + 0.09);
      osc2.start(ctx.currentTime + timeOffset);
      osc2.stop(ctx.currentTime + timeOffset + 0.09);
    };

    playCoinClink(0, 0);
    playCoinClink(0.03, -120);
  }

  /** Casual interface click */
  playClick() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.setValueAtTime(250, ctx.currentTime + 0.02);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.06);
  }

  /** Victory chime chord */
  playWin() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const playTone = (freq: number, start: number, duration: number, vol: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + start);

      gain.gain.setValueAtTime(vol * 0.15, ctx.currentTime + start);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + duration + 0.02);
    };

    // Major Triad Chord sweep (C4, E4, G4, C5)
    playTone(261.63, 0.00, 0.4, 0.8);
    playTone(329.63, 0.08, 0.4, 0.8);
    playTone(392.00, 0.16, 0.4, 0.8);
    playTone(523.25, 0.24, 0.6, 1.0);
  }

  /** Defeat minor chord descending */
  playLose() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const playTone = (freq: number, start: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
      osc.frequency.linearRampToValueAtTime(freq - 40, ctx.currentTime + start + duration);

      gain.gain.setValueAtTime(0.08, ctx.currentTime + start);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + duration + 0.02);
    };

    // Sombre Descending Minor chord (G#3 -> E3 -> C3)
    playTone(207.65, 0.00, 0.35);
    playTone(164.81, 0.15, 0.35);
    playTone(130.81, 0.30, 0.55);
  }

  /** Dungeon attack/hitting monster sound */
  playSlash() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    // Use noise and filter sweep to synthesize a sword slash
    try {
      const bufferSize = ctx.sampleRate * 0.15; // 0.15 seconds
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Populate file channel with White Noise
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noiseNode = ctx.createBufferSource();
      noiseNode.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1400, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.12);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);

      noiseNode.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noiseNode.start();
      noiseNode.stop(ctx.currentTime + 0.15);
    } catch (e) {
      // Fallback simple square pitch drop if noise node fails
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(260, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(70, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.11);
    }
  }

  /** Shield Block thump/impact */
  playShieldBlock() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(180, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.40, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.13);
  }

  /** Drink potion health recovery */
  playPotion() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const playBloop = (time: number, freq: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + time);
      osc.frequency.exponentialRampToValueAtTime(freq + 300, ctx.currentTime + time + 0.08);

      gain.gain.setValueAtTime(0.1, ctx.currentTime + time);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + time + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + time);
      osc.stop(ctx.currentTime + time + 0.09);
    };

    playBloop(0, 320);
    playBloop(0.06, 420);
    playBloop(0.12, 580);
  }

  /** Pickup Gold coins */
  playGoldCoins() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const playCoin = (time: number, pitch: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(pitch, ctx.currentTime + time);

      gain.gain.setValueAtTime(0.14, ctx.currentTime + time);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + time + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + time);
      osc.stop(ctx.currentTime + time + 0.22);
    };

    playCoin(0.0, 987.77);  // B5
    playCoin(0.06, 1318.51); // E6
  }
}

export const soundEffects = new SoundEffectsManager();
