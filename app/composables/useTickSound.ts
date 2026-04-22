export function useTickSound() {
  let ctx: AudioContext | null = null;

  function ensureContext() {
    if (!ctx) ctx = new AudioContext();
  }

  function playTick(pitch: number = 880) {
    ensureContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.value = pitch;

    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

    ctx.resume().then(() => {
      osc.start(now);
      osc.stop(now + 0.08);
    });
  }

  return { playTick };
}
