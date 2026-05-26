import React, { useEffect, useState, useRef } from 'react';

const NUM_PARTICLES = 8;

const Particles = ({ mood }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (mood !== 'celebrate' && mood !== 'focused') {
      setParticles([]);
      return;
    }
    const spawn = () => {
      const id = Date.now() + Math.random();
      const angle = Math.random() * 360;
      const dist = 40 + Math.random() * 50;
      const px = Math.cos(angle) * dist;
      const py = -Math.abs(Math.sin(angle) * dist) - 10;
      setParticles(p => [
        ...p.slice(-12),
        { id, px, py, pr: Math.random() * 360, color: Math.random() > 0.5 ? '#b8e1dd' : '#3a9188', size: 4 + Math.random() * 6 }
      ]);
      setTimeout(() => setParticles(p => p.filter(x => x.id !== id)), 1100);
    };
    const iv = setInterval(spawn, mood === 'celebrate' ? 140 : 300);
    return () => clearInterval(iv);
  }, [mood]);

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {particles.map(p => (
        <div key={p.id} style={{
          position: 'absolute',
          left: '50%', top: '45%',
          width: p.size, height: p.size,
          background: p.color,
          borderRadius: '50%',
          '--px': `${p.px}px`,
          '--py': `${p.py}px`,
          '--pr': `${p.pr}deg`,
          animation: 'particleFloat 1.1s ease-out forwards',
          marginLeft: -p.size/2,
          marginTop: -p.size/2,
        }} />
      ))}
    </div>
  );
};

const ZzzParticles = () => {
  const chars = ['z','z','Z'];
  return (
    <>
      {chars.map((c, i) => (
        <text key={i}
          x={125 + i * 8} y={68 - i * 12}
          fontSize={10 + i * 4}
          fill="#b8e1dd"
          opacity="0.85"
          style={{
            '--zx': `${6 + i * 4}px`,
            animation: `zzFloat ${1.8 + i * 0.4}s ease-out infinite`,
            animationDelay: `${i * 0.6}s`,
          }}
        >{c}</text>
      ))}
    </>
  );
};

const PetFace = ({ mood }) => {
  const cheeks = (
    <>
      <ellipse cx="52" cy="102" rx="10" ry="7" fill="#3a9188" opacity="0.35"/>
      <ellipse cx="112" cy="102" rx="10" ry="7" fill="#3a9188" opacity="0.35"/>
    </>
  );

  if (mood === 'focused') return (
    <>
      {/* Determined squint eyes */}
      <ellipse cx="66" cy="88" rx="9" ry="5.5" fill="#b8e1dd"/>
      <ellipse cx="66" cy="88" rx="5.5" ry="3.5" fill="#062925"/>
      <circle cx="69" cy="86" r="1.5" fill="#b8e1dd"/>
      <path d="M57,80 Q66,76 75,80" stroke="#b8e1dd" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <ellipse cx="98" cy="88" rx="9" ry="5.5" fill="#b8e1dd"/>
      <ellipse cx="98" cy="88" rx="5.5" ry="3.5" fill="#062925"/>
      <circle cx="101" cy="86" r="1.5" fill="#b8e1dd"/>
      <path d="M89,80 Q98,76 107,80" stroke="#b8e1dd" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      {/* Tight determined mouth */}
      <path d="M72,108 Q82,105 93,108" stroke="#b8e1dd" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      {/* sweat drop */}
      <ellipse cx="118" cy="72" rx="4.5" ry="7" fill="#3a9188" opacity="0.75" style={{ animation: 'zzFloat 2s ease-out infinite' }}/>
      {cheeks}
    </>
  );

  if (mood === 'sleepy') return (
    <>
      <ellipse cx="66" cy="88" rx="9" ry="9" fill="#b8e1dd"/>
      <ellipse cx="66" cy="88" rx="6" ry="6" fill="#062925"/>
      <rect x="57" y="82" width="18" height="7" rx="3" fill="#044a42"/>
      <ellipse cx="98" cy="88" rx="9" ry="9" fill="#b8e1dd"/>
      <ellipse cx="98" cy="88" rx="6" ry="6" fill="#062925"/>
      <rect x="89" y="82" width="18" height="7" rx="3" fill="#044a42"/>
      <path d="M69,108 Q82,119 95,108" stroke="#b8e1dd" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <ZzzParticles/>
      {cheeks}
    </>
  );

  if (mood === 'curious') return (
    <>
      <ellipse cx="66" cy="88" rx="9" ry="9" fill="#b8e1dd"/>
      <ellipse cx="66" cy="88" rx="6" ry="6" fill="#062925"/>
      <circle cx="69" cy="85" r="2" fill="#b8e1dd"/>
      {/* big surprised right eye */}
      <ellipse cx="99" cy="87" rx="12" ry="12" fill="#b8e1dd"/>
      <ellipse cx="99" cy="87" rx="8" ry="8" fill="#062925"/>
      <circle cx="103" cy="83" r="3" fill="#b8e1dd"/>
      <path d="M90,73 Q99,68 108,72" stroke="#b8e1dd" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <ellipse cx="82" cy="110" rx="7" ry="5.5" fill="none" stroke="#b8e1dd" strokeWidth="2.5"/>
      {cheeks}
    </>
  );

  if (mood === 'celebrate') return (
    <>
      <text x="54" y="100" fontSize="24" fill="#b8e1dd">★</text>
      <text x="83" y="100" fontSize="24" fill="#b8e1dd">★</text>
      <path d="M64,111 Q82,126 100,111" stroke="#b8e1dd" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      <path d="M68,114 Q82,124 96,114" fill="#3a9188" opacity="0.3"/>
      {cheeks}
    </>
  );

  // idle/calm
  return (
    <>
      <ellipse cx="66" cy="88" rx="9" ry="10" fill="#b8e1dd"/>
      <ellipse cx="66" cy="88" rx="6" ry="7" fill="#062925"/>
      <circle cx="69" cy="85" r="2.5" fill="#b8e1dd"/>
      <ellipse cx="98" cy="88" rx="9" ry="10" fill="#b8e1dd"/>
      <ellipse cx="98" cy="88" rx="6" ry="7" fill="#062925"/>
      <circle cx="101" cy="85" r="2.5" fill="#b8e1dd"/>
      <path d="M68,108 Q82,118 96,108" stroke="#b8e1dd" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      {cheeks}
    </>
  );
};

export const Pet = ({ mood }) => {
  const animMap = {
    idle:      { animation: 'petBob 3.2s ease-in-out infinite' },
    focused:   { animation: 'petFocusPulse 2s ease-in-out infinite' },
    sleepy:    { animation: 'petSway 4.5s ease-in-out infinite' },
    curious:   { animation: 'petWobble 2.2s ease-in-out infinite' },
    celebrate: { animation: 'petCelebrate 0.65s ease-out 3' },
  };

  const bodyFill = {
    idle:      '#044a42',
    focused:   '#062925',
    sleepy:    '#044a42',
    curious:   '#044a42',
    celebrate: '#3a9188',
  }[mood] || '#044a42';

  const strokeCol = {
    focused:   '#3a9188',
    celebrate: '#b8e1dd',
  }[mood] || '#3a9188';

  const glowColor = mood === 'celebrate'
    ? 'rgba(184,225,221,0.6)'
    : mood === 'focused'
    ? 'rgba(58,145,136,0.5)'
    : 'rgba(58,145,136,0.2)';

  return (
    <div style={{ position: 'relative', display: 'inline-block', filter: `drop-shadow(0 8px 24px ${glowColor})` }}>
      <Particles mood={mood} />
      <svg
        width="164" height="164"
        viewBox="0 0 164 164"
        style={{ display: 'block', ...(animMap[mood] || {}) }}
        aria-label={`Pet mood: ${mood}`}
        role="img"
      >
        {/* Shadow */}
        <ellipse cx="82" cy="158" rx="44" ry="6" fill="#021815" opacity="0.5"/>
        {/* Body */}
        <ellipse cx="82" cy="100" rx="62" ry="58" fill={bodyFill} stroke={strokeCol} strokeWidth="2"/>
        {/* Ear left */}
        <ellipse cx="38" cy="60" rx="15" ry="20" fill={bodyFill} stroke={strokeCol} strokeWidth="2"/>
        <ellipse cx="38" cy="60" rx="8" ry="12" fill={strokeCol} opacity="0.35"/>
        {/* Ear right */}
        <ellipse cx="126" cy="60" rx="15" ry="20" fill={bodyFill} stroke={strokeCol} strokeWidth="2"/>
        <ellipse cx="126" cy="60" rx="8" ry="12" fill={strokeCol} opacity="0.35"/>
        {/* Belly */}
        <ellipse cx="82" cy="114" rx="36" ry="30" fill={strokeCol} opacity="0.12"/>
        {/* Shine spot */}
        <ellipse cx="62" cy="72" rx="10" ry="7" fill="white" opacity="0.06" transform="rotate(-20 62 72)"/>
        <PetFace mood={mood}/>
      </svg>
    </div>
  );
};
