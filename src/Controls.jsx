import React, { useRef, useCallback } from 'react';

// Haptic feedback helper
const haptic = (style = 'light') => {
  if (!navigator.vibrate) return;
  const patterns = { light: 8, medium: 25, heavy: [20, 10, 20] };
  navigator.vibrate(patterns[style] || 8);
};

const RippleBtn = ({ onClick, children, variant = 'primary', disabled = false, hapticStyle = 'light', style: extraStyle = {} }) => {
  const btnRef = useRef(null);

  const handleClick = useCallback((e) => {
    if (disabled) return;
    haptic(hapticStyle);

    // Ripple
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position:absolute; border-radius:50%; pointer-events:none;
      width:14px; height:14px;
      left:${x - 7}px; top:${y - 7}px;
      background:rgba(255,255,255,0.25);
      animation: btnRipple 0.55s ease-out forwards;
      z-index:0;
    `;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);

    onClick?.();
  }, [disabled, hapticStyle, onClick]);

  const base = {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '10px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.35 : 1,
    transition: 'all 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)',
    fontFamily: "'Bricolage Grotesque', sans-serif",
    textTransform: 'uppercase',
    letterSpacing: '2px',
    userSelect: 'none',
    WebkitTapHighlightColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    fontWeight: '700',
    zIndex: 0,
  };

  const variants = {
    primary: {
      background: 'linear-gradient(135deg, #3a9188 0%, #2d7a72 100%)',
      color: '#062925',
      padding: '15px 44px',
      fontSize: '15px',
      boxShadow: '0 4px 20px rgba(58,145,136,0.35), 0 2px 8px rgba(58,145,136,0.2), inset 0 1px 0 rgba(255,255,255,0.15)',
    },
    secondary: {
      background: 'rgba(58,145,136,0.1)',
      color: '#3a9188',
      border: '1.5px solid rgba(58,145,136,0.4)',
      padding: '13px 30px',
      fontSize: '13px',
      boxShadow: '0 2px 12px rgba(58,145,136,0.1)',
    },
    danger: {
      background: 'rgba(184,225,221,0.05)',
      color: 'rgba(184,225,221,0.4)',
      border: '1px solid rgba(184,225,221,0.12)',
      padding: '11px 22px',
      fontSize: '12px',
    },
  };

  return (
    <button
      ref={btnRef}
      onClick={handleClick}
      disabled={disabled}
      style={{ ...base, ...variants[variant], ...extraStyle }}
      onMouseEnter={e => { if (!disabled) { e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)'; } }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; }}
      onMouseDown={e => { if (!disabled) e.currentTarget.style.transform = 'translateY(1px) scale(0.97)'; }}
      onMouseUp={e => { if (!disabled) e.currentTarget.style.transform = 'translateY(-1px) scale(1.01)'; }}
      onTouchStart={e => { if (!disabled) e.currentTarget.style.transform = 'scale(0.96)'; }}
      onTouchEnd={e => { if (!disabled) e.currentTarget.style.transform = 'scale(1)'; }}
    >
      <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
    </button>
  );
};

export const Controls = ({ phase, onStart, onPause, onResume, onReset }) => {
  const isIdle    = phase === 'idle';
  const isRunning = phase === 'focus' || phase === 'break';
  const isPaused  = phase === 'paused';

  return (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
      {isIdle && (
        <RippleBtn onClick={onStart} variant="primary" hapticStyle="medium">
          ▶ Start Focus
        </RippleBtn>
      )}
      {isRunning && (
        <RippleBtn onClick={onPause} variant="secondary" hapticStyle="light">
          ⏸ Pause
        </RippleBtn>
      )}
      {isPaused && (
        <RippleBtn onClick={onResume} variant="primary" hapticStyle="medium">
          ▶ Resume
        </RippleBtn>
      )}
      {!isIdle && (
        <RippleBtn onClick={onReset} variant="danger" hapticStyle="heavy">
          ↺ Reset
        </RippleBtn>
      )}
    </div>
  );
};
