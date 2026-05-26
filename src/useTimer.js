import { useState, useEffect, useRef, useCallback } from 'react';
import { saveSession, loadHistory } from './storage.js';

export const useTimer = ({ focusMins, breakMins, onFocusEnd, onBreakEnd }) => {
  const [phase, setPhase] = useState('idle');
  const [secondsLeft, setSecondsLeft] = useState(focusMins * 60);
  const [currentMode, setCurrentMode] = useState('focus');
  const [pausedFrom, setPausedFrom] = useState(null);
  const [history, setHistory] = useState(() => loadHistory());
  const [sessionCount, setSessionCount] = useState(0);
  const [celebrating, setCelebrating] = useState(false);

  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);
  const startSecondsRef = useRef(null);
  
  // We use this ref to break the circular dependency between our two main functions
  const handleCycleEndRef = useRef(null);

  useEffect(() => {
    if (phase === 'idle') {
      setSecondsLeft(focusMins * 60);
      setCurrentMode('focus');
    }
  }, [focusMins, phase]);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // 1. Define startInterval FIRST
  const startInterval = useCallback((fromSeconds, mode) => {
    clearTimer();
    startTimeRef.current = Date.now();
    startSecondsRef.current = fromSeconds;

    intervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const remaining = startSecondsRef.current - elapsed;

      if (remaining <= 0) {
        setSecondsLeft(0);
        // Call the cycle end function safely via the ref
        if (handleCycleEndRef.current) handleCycleEndRef.current(mode);
      } else {
        setSecondsLeft(remaining);
      }
    }, 250);
  }, [clearTimer]);

  // 2. Define handleCycleEnd SECOND
  const handleCycleEnd = useCallback((mode) => {
    clearTimer();

    if (mode === 'focus') {
      saveSession(focusMins * 60);
      setHistory(loadHistory());
      setSessionCount(c => c + 1);
      setCelebrating(true);
      setTimeout(() => setCelebrating(false), 2000);
      onFocusEnd?.();
      
      // transition to break
      setTimeout(() => {
        const nextSecs = breakMins * 60;
        setCurrentMode('break');
        setSecondsLeft(nextSecs);
        setPhase('break');
        startInterval(nextSecs, 'break'); // Automatically start the break
      }, 400);
    } else {
      onBreakEnd?.();
      
      // transition back to focus
      setTimeout(() => {
        const nextSecs = focusMins * 60;
        setCurrentMode('focus');
        setSecondsLeft(nextSecs);
        setPhase('focus');
        startInterval(nextSecs, 'focus'); // Automatically start the focus
      }, 400);
    }
  }, [focusMins, breakMins, onFocusEnd, onBreakEnd, clearTimer, startInterval]);

  // 3. Keep the ref updated with the latest handleCycleEnd function
  useEffect(() => {
    handleCycleEndRef.current = handleCycleEnd;
  }, [handleCycleEnd]);

  const start = useCallback(() => {
    const secs = focusMins * 60;
    setCurrentMode('focus');
    setSecondsLeft(secs);
    setPhase('focus');
    startInterval(secs, 'focus');
  }, [focusMins, startInterval]);

  const pause = useCallback(() => {
    clearTimer();
    setPausedFrom(phase);
    setPhase('paused');
  }, [phase, clearTimer]);

  const resume = useCallback(() => {
    const mode = pausedFrom === 'focus' ? 'focus' : 'break';
    setPhase(mode);
    startInterval(secondsLeft, mode);
    setPausedFrom(null);
  }, [pausedFrom, secondsLeft, startInterval]);

  const reset = useCallback(() => {
    clearTimer();
    setPhase('idle');
    setCurrentMode('focus');
    setSecondsLeft(focusMins * 60);
    setPausedFrom(null);
  }, [focusMins, clearTimer]);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const totalSeconds = currentMode === 'focus' ? focusMins * 60 : breakMins * 60;
  const progress = totalSeconds > 0 ? secondsLeft / totalSeconds : 1;
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const ss = String(secondsLeft % 60).padStart(2, '0');

  return {
    phase,
    currentMode,
    secondsLeft,
    progress,
    display: `${mm}:${ss}`,
    history,
    sessionCount,
    celebrating,
    start,
    pause,
    resume,
    reset,
    isRunning: phase === 'focus' || phase === 'break',
    isPaused: phase === 'paused',
    isIdle: phase === 'idle',
  };
};