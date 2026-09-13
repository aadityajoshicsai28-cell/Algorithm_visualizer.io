import React from 'react';
import { Clock, HardDrive, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ComplexityTable({ complexity, name }) {
  if (!complexity) return null;

  return (
    <div className="complexity-box">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Clock size={14} color="var(--color-primary)" />
          <span>Complexity Profile: {name || 'Algorithm'}</span>
        </span>
        {complexity.stable !== undefined && (
          <span style={{
            fontSize: '0.72rem',
            fontWeight: 600,
            padding: '0.15rem 0.5rem',
            borderRadius: 'var(--radius-full)',
            background: complexity.stable ? 'var(--color-success-bg)' : 'var(--color-warning-bg)',
            color: complexity.stable ? 'var(--color-success)' : 'var(--color-warning)',
            border: `1px solid ${complexity.stable ? 'var(--color-success-border)' : 'var(--color-warning-border)'}`
          }}>
            {complexity.stable ? 'Stable Sort' : 'Unstable Sort'}
          </span>
        )}
      </div>

      <div className="complexity-grid">
        <div className="complexity-item">
          <span className="complexity-label">Best Time</span>
          <span className="complexity-value">{complexity.timeBest || '—'}</span>
        </div>

        <div className="complexity-item">
          <span className="complexity-label">Average Time</span>
          <span className="complexity-value">{complexity.timeAvg || '—'}</span>
        </div>

        <div className="complexity-item">
          <span className="complexity-label">Worst Time</span>
          <span className="complexity-value">{complexity.timeWorst || '—'}</span>
        </div>

        <div className="complexity-item">
          <span className="complexity-label">Space</span>
          <span className="complexity-value" style={{ color: 'var(--color-purple)' }}>
            {complexity.space || '—'}
          </span>
        </div>
      </div>
    </div>
  );
}
