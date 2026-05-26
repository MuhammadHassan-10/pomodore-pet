import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTimer } from './useTimer.js';
import { useAudio } from './useAudio.js';
import { Pet } from './Pet.jsx';
import { TimerRing } from './TimerRing.jsx';
import { Controls } from './Controls.jsx';
import { Settings } from './Settings.jsx';
import { History } from './History.jsx';

// Ambient floating orbs in background
const AmbientOrbs = ({ phase, currentMode }) => {
  const isBreak = currentMode === 'break';
  const isPaused = phase === 'paused';
  const isRunning = phase === 'focus' || phase === 'break';
  const baseOpacity = isPaused ? 0.4 : isRunning ? 1 : 0.6;

  return (
    <>
      <div className="bg-orb" style={{
        width: 480, height: 480,
        left: '-120px', top: '-80px',
        background: isBreak ? 'rgba(184,225,221,0.06)' : 'rgba(58,145,136,0.07)',
        opacity: baseOpacity,
        animationDuration: '12s',
      }}/>
      <div className="bg-orb" style={{
        width: 360, height: 360,
        right: '-80px', top: '30%',
        background: isBreak ? 'rgba(58,145,136,0.05)' : 'rgba(4,74,66,0.8)',
        opacity: baseOpacity * 0.8,
        animationDuration: '9s',
        animationDelay: '3s',
      }}/>
      <div className="bg-orb" style={{
        width: 300, height: 300,
        left: '10%', bottom: '-60px',
        background: 'rgba(58,145,136,0.04)',
        opacity: baseOpacity * 0.6,
        animationDuration: '15s',
        animationDelay: '6s',
      }}/>
      {/* Radial light from top */}
      <div style={{
        position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: '600px', height: '300px', pointerEvents: 'none',
        background: `radial-gradient(ellipse at 50% 0%, ${isBreak ? 'rgba(184,225,221,0.07)' : 'rgba(58,145,136,0.08)'} 0%, transparent 70%)`,
        transition: 'background 1.2s ease',
      }}/>
    </>
  );
};

// Confetti burst on celebrate
const ConfettiBurst = ({ active }) => {
  const pieces = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: 35 + Math.random() * 30,
    delay: Math.random() * 0.4,
    color: i % 3 === 0 ? '#b8e1dd' : i % 3 === 1 ? '#3a9188' : '#044a42',
    size: 4 + Math.random() * 6,
    angle: Math.random() * 360,
  }));

  if (!active) return null;
  return (
    <div style={{ position: 'fixed', top: '30%', left: 0, right: 0, pointerEvents: 'none', zIndex: 50, height: 0, overflow: 'visible' }}>
      {pieces.map(p => (
        <div key={p.id} style={{
          position: 'absolute',
          left: `${p.x}%`,
          width: p.size, height: p.size,
          background: p.color,
          borderRadius: p.id % 2 === 0 ? '50%' : '2px',
          animation: `confetti 1.2s ease-out ${p.delay}s forwards`,
          opacity: 0,
          transform: `rotate(${p.angle}deg)`,
        }}/>
      ))}
    </div>
  );
};

const usePetMood = ({ phase, currentMode, celebrating }) => {
  if (celebrating) return 'celebrate';
  if (phase === 'idle') return 'idle';
  if (phase === 'paused') return 'curious';
  if (phase === 'focus') return 'focused';
  if (phase === 'break') return 'sleepy';
  return 'idle';
};

const PET_CAPTIONS = {
  celebrate: ['✦ nailed it! ✦', '✦ session done ✦', '✦ you crushed it ✦'],
  focused:   ['— deep in the zone —', '— stay on it —', '— locked in —'],
  sleepy:    ['— take it easy —', '— rest up —', '— you earned this —'],
  curious:   ['— still there? —', '— come back! —', '— ready when you are —'],
  idle:      ['', '', ''],
};

export default function App() {
  const [focusMins, setFocusMins] = useState(25);
  const [breakMins, setBreakMins] = useState(5);
  const [captionIdx] = useState(() => Math.floor(Math.random() * 3));
  const prevSeconds = useRef(null);

  const {
    playClick, playStart, playPause, playResume, playReset,
    playFocusEnd, playBreakEnd, playTick, initAudio
  } = useAudio();

  const timer = useTimer({
    focusMins, breakMins,
    onFocusEnd: playFocusEnd,
    onBreakEnd: playBreakEnd,
  });

  const mood = usePetMood({ phase: timer.phase, currentMode: timer.currentMode, celebrating: timer.celebrating });

  // Tick sound for last 5 seconds
  useEffect(() => {
    if ((timer.phase === 'focus' || timer.phase === 'break') &&
        timer.secondsLeft <= 5 && timer.secondsLeft > 0) {
      if (prevSeconds.current !== timer.secondsLeft) {
        playTick();
        prevSeconds.current = timer.secondsLeft;
      }
    }
  }, [timer.secondsLeft, timer.phase, playTick]);

  // Page title
  useEffect(() => {
    if (timer.isIdle) {
      document.title = 'Pomodoro Pet';
    } else {
      const em = timer.currentMode === 'focus' ? '🍅' : '☕';
      const st = timer.phase === 'paused' ? '⏸ ' : '';
      document.title = `${st}${em} ${timer.display} — ${timer.currentMode}`;
    }
  }, [timer.display, timer.isIdle, timer.currentMode, timer.phase]);

  const handleStart = useCallback(() => {
    initAudio();
    playStart();
    timer.start();
  }, [initAudio, playStart, timer]);

  const handlePause = useCallback(() => {
    playPause();
    timer.pause();
  }, [playPause, timer]);

  const handleResume = useCallback(() => {
    playResume();
    timer.resume();
  }, [playResume, timer]);

  const handleReset = useCallback(() => {
    playReset();
    timer.reset();
  }, [playReset, timer]);

  const caption = PET_CAPTIONS[mood]?.[captionIdx] || '';
  const isBreak = timer.currentMode === 'break';

  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '24px 16px 48px',
      position: 'relative',
      background: '#062925',
      zIndex: 0,
    }}>
      {/* Ambient background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <AmbientOrbs phase={timer.phase} currentMode={timer.currentMode} />
      </div>

      {/* Confetti */}
      <ConfettiBurst active={timer.celebrating} />

      {/* Flash overlay on session end */}
      {timer.celebrating && (
        <div style={{
          position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 20,
          background: 'rgba(58,145,136,0.07)',
          animation: 'modeFlash 0.8s ease forwards',
        }}/>
      )}

      {/* All content above bg */}
      <div style={{ position: 'relative', zIndex: 1, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        {/* Header */}
        <header style={{ textAlign: 'center', marginBottom: '4px', animation: 'fadeSlideUp 0.5s ease' }}>
          <h1 style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: 'clamp(20px, 5vw, 30px)',
            fontWeight: '800', color: '#b8e1dd',
            letterSpacing: '8px', textTransform: 'uppercase',
            textShadow: '0 0 40px rgba(184,225,221,0.2)',
          }}>
            Pomodoro Pet
          </h1>
          <p style={{
            fontSize: '10px', color: 'rgba(58,145,136,0.6)',
            letterSpacing: '4px', marginTop: '5px',
            fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: '500',
          }}>
            focus · rest · repeat
          </p>
        </header>

        {/* Main card */}
        <main style={{
          width: '100%', maxWidth: '460px',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}>

          {/* Pet + caption */}
          <div style={{ marginBottom: '-8px', zIndex: 2, animation: 'fadeSlideUp 0.55s ease 0.05s both', textAlign: 'center' }}>
            <Pet mood={mood}/>
            <div style={{
              marginTop: '2px', fontSize: '11px',
              color: isBreak ? 'rgba(184,225,221,0.55)' : 'rgba(58,145,136,0.65)',
              fontFamily: "'Bricolage Grotesque', sans-serif",
              letterSpacing: '2px', minHeight: '20px',
              transition: 'color 0.6s ease',
              fontWeight: '500',
            }}>
              {caption}
            </div>
          </div>

          {/* Timer ring */}
          <div style={{ animation: 'fadeSlideUp 0.55s ease 0.12s both', width: '100%', display: 'flex', justifyContent: 'center' }}>
            <TimerRing
              progress={timer.progress}
              display={timer.display}
              phase={timer.phase}
              currentMode={timer.currentMode}
              sessionCount={timer.sessionCount}
              secondsLeft={timer.secondsLeft}
            />
          </div>

          {/* Controls */}
          <div style={{ animation: 'fadeSlideUp 0.55s ease 0.2s both', marginTop: '8px' }}>
            <Controls
              phase={timer.phase}
              onStart={handleStart}
              onPause={handlePause}
              onResume={handleResume}
              onReset={handleReset}
            />
          </div>

          {/* Divider */}
          <div style={{
            width: '100%', height: '1px', margin: '28px 0 22px',
            background: 'linear-gradient(90deg, transparent, rgba(58,145,136,0.2), transparent)',
          }}/>

          {/* Settings */}
          <div style={{ width: '100%', animation: 'fadeSlideUp 0.55s ease 0.3s both' }}>
            <Settings
              focusMins={focusMins} breakMins={breakMins}
              onFocusChange={setFocusMins} onBreakChange={setBreakMins}
              disabled={!timer.isIdle}
            />
          </div>

          {/* Divider */}
          <div style={{
            width: '100%', height: '1px', margin: '22px 0 20px',
            background: 'linear-gradient(90deg, transparent, rgba(58,145,136,0.15), transparent)',
          }}/>

          {/* History */}
          <div style={{ width: '100%', animation: 'fadeSlideUp 0.55s ease 0.38s both' }}>
            <History history={timer.history}/>
          </div>

        </main>
      </div>
    </div>
  );
}
