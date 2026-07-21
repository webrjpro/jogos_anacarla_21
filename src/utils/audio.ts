let audioCtx: AudioContext | null = null;

function getAudioCtx(): AudioContext | null {
  try {
    if (!audioCtx) {
      // @ts-ignore
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return null;
      audioCtx = new AudioContextClass();
    }
    return audioCtx;
  } catch {
    return null;
  }
}

export const playTone = (freq: number, dur: number, vol = 0.15, type: OscillatorType = 'sine') => {
  const ctx = getAudioCtx();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + dur);
  } catch(e) {
    // Silently fail - audio is optional
  }
};

// Play a chord (multiple notes at once)
const playChord = (freqs: number[], dur: number, vol = 0.08, type: OscillatorType = 'sine') => {
  freqs.forEach(f => playTone(f, dur, vol / freqs.length, type));
};

export const playSound = {
  correct: () => {
    // Happy ascending arpeggio (C-E-G)
    playTone(523, 0.12, 0.10);
    setTimeout(() => playTone(659, 0.12, 0.10), 80);
    setTimeout(() => playTone(784, 0.18, 0.12), 160);
  },
  wrong: () => {
    // Dissonant buzzer
    playTone(300, 0.12, 0.08, 'sawtooth');
    setTimeout(() => playTone(220, 0.20, 0.08, 'sawtooth'), 100);
  },
  click: () => {
    // Soft pop
    playTone(880, 0.04, 0.06);
  },
  win: () => {
    // Triumphant fanfare C-E-G-C
    const notes = [523, 659, 784, 1047];
    notes.forEach((f, i) => setTimeout(() => playTone(f, 0.25, 0.10), i * 120));
    // Add a chord at the end
    setTimeout(() => playChord([523, 659, 784, 1047], 0.5, 0.12), notes.length * 120);
  },
  bigWin: () => {
    // Epic ascending scale with harmonics
    const notes = [523, 587, 659, 698, 784, 880, 988, 1047];
    notes.forEach((f, i) => {
      setTimeout(() => {
        playTone(f, 0.3, 0.08);
        playTone(f * 1.5, 0.3, 0.04); // Fifth harmony
      }, i * 100);
    });
    // Grand final chord
    setTimeout(() => playChord([523, 659, 784, 1047, 1319], 0.8, 0.15), notes.length * 100);
  },
  drop: () => {
    // Soft thud for drag and drop
    playTone(200, 0.08, 0.06, 'triangle');
  },
  star: () => {
    // Sparkle sound for earning stars
    playTone(1200, 0.1, 0.06);
    setTimeout(() => playTone(1400, 0.1, 0.06), 80);
    setTimeout(() => playTone(1800, 0.15, 0.08), 160);
  }
};
