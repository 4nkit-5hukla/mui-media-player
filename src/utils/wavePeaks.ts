/**
 * Generates natural, music-like waveform peaks.
 * Used for precomputed WaveSurfer peaks and fallback canvas waveform rendering
 * when audio files lack CORS headers or offline.
 */
export function generateDeterministicPeaks(
  seed: string | number = 42,
  count: number = 128
): number[] {
  let numSeed = 0;
  if (typeof seed === "number") {
    numSeed = Math.floor(Math.abs(seed));
  } else {
    for (let i = 0; i < seed.length; i++) {
      numSeed = (numSeed * 31 + seed.charCodeAt(i)) >>> 0;
    }
  }

  // Simple LCG PRNG for consistent peaks per track
  let state = numSeed || 123456789;
  const nextRand = () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };

  const peaks: number[] = [];
  const baseFreq = 0.08 + (numSeed % 5) * 0.02;
  const beatFreq = 0.25 + (numSeed % 3) * 0.05;

  for (let i = 0; i < count; i++) {
    const progress = i / count;
    // Envelope: intro build-up, steady verses, chorus swells, outro fade
    let envelope = 1;
    if (progress < 0.08) {
      envelope = 0.3 + (progress / 0.08) * 0.7;
    } else if (progress > 0.92) {
      envelope = 0.3 + ((1 - progress) / 0.08) * 0.7;
    }

    // Melodic sine waves + beat modulation + randomized dynamics
    const wave1 = Math.sin(i * baseFreq) * 0.3;
    const wave2 = Math.sin(i * beatFreq) * 0.25;
    const noise = (nextRand() - 0.5) * 0.35;
    const peak = (0.45 + wave1 + wave2 + noise) * envelope;

    peaks.push(Math.max(0.12, Math.min(0.98, Math.round(peak * 100) / 100)));
  }

  return peaks;
}
