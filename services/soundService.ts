import { getAppSettings } from './userService';

const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
let ctx: AudioContext | null = null;

const initAudio = () => {
  if (!ctx) {
    ctx = new AudioContext();
  }
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
  return ctx;
};

// --- SOUND EFFECTS ---

export const playSound = (type: 'correct' | 'wrong' | 'click' | 'success' | 'flip' | 'pop') => {
  const settings = getAppSettings();
  if (!settings.soundEnabled) return;

  try {
    const context = initAudio();
    const osc = context.createOscillator();
    const gain = context.createGain();

    osc.connect(gain);
    gain.connect(context.destination);

    const now = context.currentTime;

    if (type === 'correct') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); 
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.1); 
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === 'wrong') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.linearRampToValueAtTime(100, now + 0.2);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    } else if (type === 'click') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, now);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'flip') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.15);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === 'success') {
      const frequencies = [523.25, 659.25, 783.99, 1046.50]; 
      frequencies.forEach((freq, i) => {
        const o = context.createOscillator();
        const g = context.createGain();
        o.connect(g);
        g.connect(context.destination);
        o.type = 'sine';
        o.frequency.value = freq;
        const startTime = now + i * 0.08;
        g.gain.setValueAtTime(0, startTime);
        g.gain.linearRampToValueAtTime(0.1, startTime + 0.05);
        g.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);
        o.start(startTime);
        o.stop(startTime + 0.4);
      });
    } else if (type === 'pop') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    }
  } catch (e) {
    console.error("Audio play failed", e);
  }
};