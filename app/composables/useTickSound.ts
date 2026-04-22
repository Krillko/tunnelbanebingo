export function useTickSound() {
  let ctx: AudioContext | null = null;

  // Must be called synchronously from a user-gesture handler (button click)
  // so Safari's autoplay policy allows subsequent audio
  function unlock() {
    if (!ctx) ctx = new AudioContext();
    ctx.resume();
  }

  function playTick(pitch: number = 880) {
    if (!ctx || ctx.state !== 'running') return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.value = pitch;

    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  return { unlock, playTick };
}
