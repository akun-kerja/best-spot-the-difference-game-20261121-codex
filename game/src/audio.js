// Lantern Garden — Spot the Difference: sound effects.
// Every sound is synthesised with the Web Audio API — no audio files, no
// network. The context is created lazily on the first user gesture, so the
// page never tries to play sound before the player has interacted.

export class SoundBank {
  constructor() {
    this.context = null;
    this.muted = false;
  }

  ensure() {
    if (!this.context) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return null;
      this.context = new AudioContext();
    }
    if (this.context.state === 'suspended') void this.context.resume();
    return this.context;
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  tone(freq, startAt, length, type, volume) {
    if (this.muted) return;
    const ctx = this.ensure();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + startAt);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime + startAt);
    gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + startAt + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + startAt + length);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + startAt);
    osc.stop(ctx.currentTime + startAt + length + 0.05);
  }

  // A bright two-note chime when a difference is found.
  playFind() {
    this.tone(660, 0, 0.16, 'sine', 0.25);
    this.tone(990, 0.09, 0.24, 'sine', 0.22);
  }

  // A dull thud for a wrong click.
  playMiss() {
    this.tone(160, 0, 0.18, 'triangle', 0.2);
  }

  // A soft sparkle when a hint is spent.
  playHint() {
    this.tone(880, 0, 0.1, 'sine', 0.15);
    this.tone(1174, 0.07, 0.14, 'sine', 0.15);
  }

  // A little rising arpeggio for finishing a scene.
  playWin() {
    [523, 659, 784, 1046].forEach((freq, i) => {
      this.tone(freq, i * 0.11, 0.22, 'sine', 0.22);
    });
  }

  // A short tick when the clock drops under ten seconds.
  playTick() {
    this.tone(1200, 0, 0.05, 'square', 0.08);
  }

  // A welcoming two-note chime when a new scene starts.
  playStart() {
    this.tone(523, 0, 0.14, 'sine', 0.18);
    this.tone(784, 0.1, 0.2, 'sine', 0.18);
  }
}
