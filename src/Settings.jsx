import React, { useState } from 'react';

export const Settings = ({ focusMins, breakMins, onFocusChange, onBreakChange, disabled }) => {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ width: '100%', maxWidth: '380px', margin: '0 auto' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%',
          background: open ? 'rgba(58,145,136,0.08)' : 'transparent',
          border: `1px solid ${open ? 'rgba(58,145,136,0.3)' : 'rgba(58,145,136,0.15)'}`,
          borderRadius: '10px',
          color: '#3a9188',
          padding: '11px 20px',
          fontSize: '11px',
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontWeight: '700',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        <span>⚙ Settings</span>
        <span style={{
          transition: 'transform 0.25s ease',
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          display: 'inline-block',
          fontSize: '14px',
        }}>▾</span>
      </button>

      {open && (
        <div style={{
          marginTop: '3px',
          background: 'rgba(4,74,66,0.35)',
          border: '1px solid rgba(58,145,136,0.12)',
          borderRadius: '10px',
          padding: '22px 26px 20px',
          animation: 'fadeSlideUp 0.22s ease',
          backdropFilter: 'blur(8px)',
        }}>
          {disabled && (
            <p style={{
              fontSize: '10px', color: 'rgba(58,145,136,0.6)',
              marginBottom: '16px', textAlign: 'center',
              letterSpacing: '2px', fontFamily: "'Bricolage Grotesque', sans-serif",
              fontWeight: '600',
            }}>
              RESET TIMER TO CHANGE
            </p>
          )}
          <SliderRow label="Focus" value={focusMins} min={1} max={90}
            onChange={onFocusChange} disabled={disabled} unit="min" color="#3a9188"/>
          <div style={{ height: '18px' }}/>
          <SliderRow label="Break" value={breakMins} min={1} max={30}
            onChange={onBreakChange} disabled={disabled} unit="min" color="#b8e1dd"/>
        </div>
      )}
    </div>
  );
};

const SliderRow = ({ label, value, min, max, onChange, disabled, unit, color }) => {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <span style={{ fontSize: '11px', color: '#b8e1dd', letterSpacing: '2.5px',
          fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: '700', textTransform: 'uppercase' }}>
          {label}
        </span>
        <span style={{ fontSize: '16px', color, fontFamily: "'DM Mono', monospace", fontWeight: '500' }}>
          {value}<span style={{ fontSize: '11px', opacity: 0.6, marginLeft: '3px' }}>{unit}</span>
        </span>
      </div>
      <div style={{ position: 'relative', height: '6px', background: 'rgba(184,225,221,0.08)', borderRadius: '3px', overflow: 'visible' }}>
        <div style={{
          position: 'absolute', left: 0, top: 0, height: '100%',
          width: `${pct}%`, background: color, borderRadius: '3px',
          transition: 'width 0.15s ease', opacity: disabled ? 0.4 : 1,
        }}/>
        <input type="range" min={min} max={max} value={value} step={1}
          disabled={disabled}
          onChange={e => onChange(Number(e.target.value))}
          style={{
            position: 'absolute', top: '50%', left: 0,
            width: '100%', height: '20px', margin: 0,
            transform: 'translateY(-50%)',
            opacity: 0, cursor: disabled ? 'not-allowed' : 'pointer',
          }}
        />
      </div>
    </div>
  );
};
