import { useRef, useCallback } from 'react';

export const useAudio = () => {
  const ctxRef = useRef(null);

  const getCtx = () => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (ctxRef.current.state === 'suspended') ctxRef.current.resume();
    return ctxRef.current;
  };

  const playTone = useCallback((freqs, duration = 1.2, type = 'sine', reverbAmount = 0) => {
    try {
      const ctx = getCtx();

      let destination = ctx.destination;

      // Simple convolver reverb for richness
      if (reverbAmount > 0) {
        const convolver = ctx.createConvolver();
        const bufferSize = ctx.sampleRate * 1.5;
        const buffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate);
        for (let ch = 0; ch < 2; ch++) {
          const data = buffer.getChannelData(ch);
          for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
          }
        }
        convolver.buffer = buffer;
        const reverbGain = ctx.createGain();
        reverbGain.gain.value = reverbAmount;
        convolver.connect(reverbGain);
        reverbGain.connect(ctx.destination);
        destination = convolver;
      }

      freqs.forEach(({ freq, delay = 0, vol = 0.2, type: t }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(destination);
        gain.connect(ctx.destination);
        osc.type = t || type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
        gain.gain.setValueAtTime(0, ctx.currentTime + delay);
        gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + delay + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + duration);
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + duration + 0.05);
      });
    } catch (e) {}
  }, []);

  // 1. Button click - crisp soft tick
  const playClick = useCallback(() => {
    playTone([{ freq: 800, delay: 0, vol: 0.08, type: 'sine' }], 0.06);
  }, [playTone]);

  // 2. Start - energetic rising arpeggio
  const playStart = useCallback(() => {
    playTone([
      { freq: 440, delay: 0,    vol: 0.15, type: 'triangle' },
      { freq: 554, delay: 0.07, vol: 0.15, type: 'triangle' },
      { freq: 659, delay: 0.14, vol: 0.18, type: 'triangle' },
    ], 0.5, 'triangle');
  }, [playTone]);

  // 3. Pause - soft descending two-note
  const playPause = useCallback(() => {
    playTone([
      { freq: 528, delay: 0,    vol: 0.12, type: 'sine' },
      { freq: 440, delay: 0.12, vol: 0.10, type: 'sine' },
    ], 0.4);
  }, [playTone]);

  // 4. Resume - mirror of pause, ascending
  const playResume = useCallback(() => {
    playTone([
      { freq: 440, delay: 0,    vol: 0.10, type: 'sine' },
      { freq: 528, delay: 0.12, vol: 0.13, type: 'sine' },
    ], 0.4);
  }, [playTone]);

  // 5. Reset - short descending thud
  const playReset = useCallback(() => {
    playTone([
      { freq: 300, delay: 0,    vol: 0.10, type: 'triangle' },
      { freq: 200, delay: 0.08, vol: 0.08, type: 'triangle' },
    ], 0.25);
  }, [playTone]);

  // 6. Focus end - triumphant ascending 4-note chord with reverb
  const playFocusEnd = useCallback(() => {
    playTone([
      { freq: 523.25, delay: 0,    vol: 0.18 },
      { freq: 659.25, delay: 0.14, vol: 0.18 },
      { freq: 783.99, delay: 0.28, vol: 0.22 },
      { freq: 1046.5, delay: 0.45, vol: 0.18 },
    ], 2.0, 'sine', 0.25);
  }, [playTone]);

  // 7. Break end - gentle mellow wake-up
  const playBreakEnd = useCallback(() => {
    playTone([
      { freq: 392, delay: 0,    vol: 0.15, type: 'sine' },
      { freq: 494, delay: 0.2,  vol: 0.15, type: 'sine' },
      { freq: 587, delay: 0.4,  vol: 0.18, type: 'sine' },
    ], 1.4, 'sine', 0.15);
  }, [playTone]);

  // 8. Tick sound - ultra-subtle heartbeat each second (optional, used for last 5s)
  const playTick = useCallback(() => {
    playTone([{ freq: 1200, delay: 0, vol: 0.04, type: 'sine' }], 0.05);
  }, [playTone]);

  const initAudio = useCallback(() => { getCtx(); }, []);

  return { playClick, playStart, playPause, playResume, playReset, playFocusEnd, playBreakEnd, playTick, initAudio };
};
