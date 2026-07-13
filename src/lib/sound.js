let audioCtx = null;

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playTone(freq, duration, type = 'sine', volume = 0.15, startTime = 0) {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  const t = ctx.currentTime + startTime;
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(volume, t + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + duration);
}

export function playSound(type) {
  try {
    switch (type) {
      case 'move':
        playTone(200, 0.08, 'triangle', 0.12);
        break;
      case 'capture':
        playTone(120, 0.12, 'sawtooth', 0.15);
        playTone(80, 0.15, 'sine', 0.1, 0.02);
        break;
      case 'check':
        playTone(600, 0.1, 'square', 0.1);
        playTone(800, 0.12, 'square', 0.08, 0.08);
        break;
      case 'checkmate':
        playTone(400, 0.15, 'sawtooth', 0.15);
        playTone(300, 0.2, 'sawtooth', 0.12, 0.1);
        playTone(200, 0.4, 'sine', 0.15, 0.2);
        break;
      case 'correct':
        playTone(523, 0.1, 'sine', 0.12);
        playTone(659, 0.1, 'sine', 0.12, 0.08);
        playTone(784, 0.2, 'sine', 0.14, 0.16);
        break;
      case 'wrong':
        playTone(200, 0.15, 'sawtooth', 0.12);
        playTone(150, 0.25, 'sawtooth', 0.1, 0.1);
        break;
      case 'select':
        playTone(400, 0.04, 'sine', 0.06);
        break;
      case 'achievement':
        playTone(523, 0.1, 'triangle', 0.12);
        playTone(659, 0.1, 'triangle', 0.12, 0.1);
        playTone(784, 0.1, 'triangle', 0.12, 0.2);
        playTone(1047, 0.3, 'triangle', 0.15, 0.3);
        break;
      case 'promote':
        playTone(659, 0.1, 'sine', 0.12);
        playTone(880, 0.3, 'sine', 0.15, 0.1);
        break;
    }
  } catch (e) {
    // Audio not available
  }
}