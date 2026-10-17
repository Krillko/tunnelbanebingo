import { useSoundEnabled } from '~/composables/useSoundEnabled';

// Shared across every caller: the context has to be the same one the unlocking
// user gesture touched, or iOS will not consider it unlocked.
let ctx: AudioContext | null = null;

type WebkitWindow = typeof globalThis & { webkitAudioContext?: typeof AudioContext };
type AudioSessionNavigator = Navigator & { audioSession?: { type: string } };

function getContext(): AudioContext | null {
  if (ctx) return ctx;
  const Ctor = window.AudioContext ?? (window as WebkitWindow).webkitAudioContext;
  if (!Ctor) return null;
  ctx = new Ctor();
  return ctx;
}

// iOS 16.4+: Web Audio defaults to the "ambient" audio session, which the
// hardware ring/silent switch mutes. 'playback' plays regardless of the switch.
function claimPlaybackSession() {
  const session = (navigator as AudioSessionNavigator).audioSession;
  if (!session) return;
  try {
    session.type = 'playback';
  } catch {
    // Older/partial implementations may reject the value — not fatal.
  }
}

export function useTickSound() {
  const { soundEnabled } = useSoundEnabled();

  // Must be called synchronously from a user-gesture handler (button click,
  // checkbox) so Safari's autoplay policy allows subsequent audio.
  function unlock(): Promise<void> {
    if (!soundEnabled.value) return Promise.resolve();
    claimPlaybackSession();
    const audio = getContext();
    if (!audio) return Promise.resolve();

    // iOS only treats the context as unlocked once something has actually been
    // played from inside the gesture — a one-sample silent buffer is enough.
    try {
      const src = audio.createBufferSource();
      src.buffer = audio.createBuffer(1, 1, audio.sampleRate);
      src.connect(audio.destination);
      src.start(0);
    } catch {
      // Context may be in a bad state; resume() below is the real attempt.
    }

    return audio.resume().catch(() => {});
  }

  function playTick(pitch: number = 880) {
    if (!soundEnabled.value || !ctx) return;

    // Safari suspends the context when the tab backgrounds; nudge it awake.
    if (ctx.state === 'suspended') void ctx.resume();
    if (ctx.state !== 'running') return;

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
