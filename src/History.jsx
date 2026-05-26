import React from 'react';

export const History = ({ history }) => {
  const totalMins = Math.floor(
    (history || []).reduce((s, e) => s + (e.durationSecs || 0), 0) / 60
  );

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <span style={{
          fontSize: '10px', color: '#3a9188', letterSpacing: '3px',
          fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: '700', textTransform: 'uppercase',
        }}>Today's Sessions</span>
        {history?.length > 0 && (
          <span style={{ fontSize: '12px', color: 'rgba(184,225,221,0.4)', fontFamily: "'DM Mono', monospace" }}>
            {history.length}× · {totalMins}m total
          </span>
        )}
      </div>

      {(!history || history.length === 0) ? (
        <div style={{
          textAlign: 'center', padding: '28px 0',
          color: 'rgba(58,145,136,0.35)', fontSize: '12px',
          fontFamily: "'Bricolage Grotesque', sans-serif", letterSpacing: '2px',
          border: '1px dashed rgba(58,145,136,0.1)', borderRadius: '10px',
        }}>
          No sessions yet — start your first!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '230px', overflowY: 'auto', paddingRight: '3px' }}>
          {history.map((entry, i) => (
            <div key={entry.id || i} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '11px 16px',
              background: i === 0 ? 'rgba(58,145,136,0.1)' : 'rgba(4,74,66,0.3)',
              borderRadius: '8px',
              border: `1px solid ${i === 0 ? 'rgba(58,145,136,0.25)' : 'rgba(58,145,136,0.07)'}`,
              animation: i === 0 ? 'sessionPop 0.4s cubic-bezier(0.34,1.56,0.64,1)' : 'none',
              transition: 'background 0.2s',
            }}>
              <div style={{
                width: '24px', height: '24px', borderRadius: '50%',
                background: 'rgba(58,145,136,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '11px', color: '#3a9188', flexShrink: 0,
                fontWeight: '700',
              }}>✓</div>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '14px', color: '#b8e1dd', flex: 1, fontWeight: '500' }}>
                {entry.durationLabel} focus
              </span>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: 'rgba(184,225,221,0.35)', flexShrink: 0 }}>
                {entry.timeLabel}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
