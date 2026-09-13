import React from 'react';
import { Terminal, Activity } from 'lucide-react';

export default function StatusLine({ text, running, stats = null }) {
  return (
    <div className="status-line">
      <div className="status-icon">
        {running ? (
          <Activity size={18} className="spin-slow" />
        ) : (
          <Terminal size={18} />
        )}
      </div>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <span>{text || 'Ready'}</span>
        {stats && (
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
            {stats}
          </div>
        )}
      </div>
    </div>
  );
}
