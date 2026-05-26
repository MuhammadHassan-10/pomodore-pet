import React, { useEffect, useRef, useState } from 'react';

const RADIUS = 112;
const STROKE = 11;
const SIZE = (RADIUS + STROKE + 16) * 2;
const CX = SIZE / 2;
const CY = SIZE / 2;
const CIRC = 2 * Math.PI * RADIUS;

export const TimerRing = ({ progress, display, phase, currentMode, sessionCount, secondsLeft }) => {
  const prevDisplay = useRef(display);
  const [numAnim, setNumAnim] = useState(false);

  useEffect(() => {
    if (prevDisplay.current !== display) {
      setNumAnim(true);
      const t = setTimeout(() => setNumAnim(false), 250);
      prevDisplay.current = display;
      return () => clearTimeout(t);
    }
  }, [display]);

  const isBreak = currentMode === 'break';
  const isPaused = phase === 'paused';
  const isIdle = phase === 'idle';
  const isCelebrating = phase === 'idle' && sessionCount > 0 && progress >= 1;
  const isLastFive = secondsLeft <= 5 && secondsLeft > 0 && (phase === 'focus' || phase === 'break');

  const dashOffset = CIRC * (1 - Math.max(0, Math.min(1, progress)));

  const ringColor = isPaused ? 'rgba(184,225,221,0.5)' : isBreak ? '#b8e1dd' : '#3a9188';
  const ringAnim = isPaused ? '' : isBreak ? 'ringGlowBreak 2.5s ease-in-out infinite' : 'ringGlowFocus 2s ease-in-out infinite';

  const modeLabel = isIdle ? 'ready' : isPaused ? 'paused' : isBreak ? 'break time' : 'focus';
  const modeColor = isBreak ? '#b8e1dd' : isPaused ? 'rgba(184,225,221,0.55)' : '#3a9188';

  // Arc segment tick marks
  const ticks = Array.from({ length: 60 }, (_, i) => {
    const angle = (i / 60) * 2 * Math.PI - Math.PI / 2;
    const isMajor = i % 5 === 0;
    const innerR = RADIUS + STROKE / 2 + (isMajor ? 7 : 4);
    const outerR = RADIUS + STROKE / 2 + (isMajor ? 13 : 7);
    const x1 = CX + Math.cos(angle) * innerR;
    const y1 = CY + Math.sin(angle) * innerR;
    const x2 = CX + Math.cos(angle) * outerR;
    const y2 = CY + Math.sin(angle) * outerR;
    const active = i / 60 <= progress;
    return { x1, y1, x2, y2, isMajor, active };
  });

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg
        width={SIZE} height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        style={{ maxWidth: '100%', display: 'block', animation: ringAnim }}
      >
        {/* Outer glow ring */}
        <circle cx={CX} cy={CY} r={RADIUS + STROKE + 20}
          fill="none" stroke={isBreak ? 'rgba(184,225,221,0.04)' : 'rgba(58,145,136,0.04)'} strokeWidth="28"/>

        {/* Tick marks */}
        {ticks.map((t, i) => (
          <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
            stroke={t.active ? (isBreak ? 'rgba(184,225,221,0.5)' : 'rgba(58,145,136,0.5)') : 'rgba(184,225,221,0.06)'}
            strokeWidth={t.isMajor ? 2 : 1}
            strokeLinecap="round"
          />
        ))}

        {/* Track */}
        <circle cx={CX} cy={CY} r={RADIUS} fill="none"
          stroke={isBreak ? 'rgba(184,225,221,0.07)' : 'rgba(58,145,136,0.08)'}
          strokeWidth={STROKE}/>

        {/* Progress arc */}
        <circle cx={CX} cy={CY} r={RADIUS} fill="none"
          stroke={ringColor}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${CX} ${CY})`}
          style={{ transition: `stroke-dashoffset ${isLastFive ? '0.3s' : '0.5s'} linear, stroke 0.8s ease` }}
        />

        {/* Inner circle glow */}
        <circle cx={CX} cy={CY} r={RADIUS - STROKE - 10} fill="none"
          stroke={isBreak ? 'rgba(184,225,221,0.04)' : 'rgba(58,145,136,0.05)'}
          strokeWidth="1.5"/>

        {/* Mode label */}
        <text x={CX} y={CY - 50} textAnchor="middle"
          fontSize="11" fontFamily="'Bricolage Grotesque', sans-serif"
          fontWeight="500" letterSpacing="5"
          fill={modeColor}
          style={{ textTransform:'uppercase', animation: 'subtlePulse 3s ease-in-out infinite' }}>
          {modeLabel.toUpperCase()}
        </text>

        {/* Countdown */}
        <text x={CX} y={CY + 24} textAnchor="middle"
          fontSize="72" fontFamily="'DM Mono', monospace"
          fontWeight="500" fill={isPaused ? 'rgba(184,225,221,0.45)' : '#b8e1dd'}
          letterSpacing="-3"
          style={{
            transition: 'fill 0.5s ease',
            animation: isLastFive ? 'tickPop 0.4s ease' : numAnim ? 'numberPop 0.25s ease' : 'none',
          }}>
          {display}
        </text>

        {/* Session dots */}
        <g>
          {[0,1,2,3].map(i => (
            <circle key={i}
              cx={CX - 27 + i * 18} cy={CY + 52} r={5.5}
              fill={i < (sessionCount % 4) ? ringColor : 'none'}
              stroke={ringColor} strokeWidth="1.5"
              opacity={isPaused ? 0.4 : 0.9}
              style={{ transition: 'fill 0.3s ease' }}
            />
          ))}
          {sessionCount >= 4 && (
            <text x={CX + 48} y={CY + 58} fontSize="10"
              fontFamily="'DM Mono', monospace" fill={modeColor} opacity="0.6">
              ×{Math.ceil(sessionCount / 4)}
            </text>
          )}
        </g>

        {/* Last-5-seconds pulse dot at tip of arc */}
        {isLastFive && (() => {
          const angle = -Math.PI / 2 + 2 * Math.PI * progress;
          const px = CX + Math.cos(angle) * RADIUS;
          const py = CY + Math.sin(angle) * RADIUS;
          return <circle cx={px} cy={py} r="7" fill={ringColor} style={{ animation: 'subtlePulse 0.4s ease-in-out infinite' }}/>;
        })()}
      </svg>
    </div>
  );
};
