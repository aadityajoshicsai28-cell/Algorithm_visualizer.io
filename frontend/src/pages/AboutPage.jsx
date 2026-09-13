import React from 'react';
import { Layers, CheckCircle2, Clock, Zap, BookOpen, ExternalLink } from 'lucide-react';

export default function AboutPage() {
  const complexities = [
    { notation: 'O(1)', name: 'Constant Time', desc: 'Array index lookup, linked list head insert', color: '#10b981' },
    { notation: 'O(log n)', name: 'Logarithmic Time', desc: 'Binary search, balanced BST operations', color: '#059669' },
    { notation: 'O(n)', name: 'Linear Time', desc: 'Linear search, single traversal, linked list reversal', color: '#0284c7' },
    { notation: 'O(n log n)', name: 'Linearithmic Time', desc: 'Merge Sort, Heap Sort, Quick Sort (average)', color: '#2563eb' },
    { notation: 'O(n²)', name: 'Quadratic Time', desc: 'Bubble Sort, Selection Sort, Insertion Sort (worst)', color: '#f59e0b' },
    { notation: 'O(2ⁿ)', name: 'Exponential Time', desc: 'Recursive Fibonacci without memoization', color: '#ef4444' },
  ];

  return (
    <div className="page-shell" style={{ maxWidth: '960px', margin: '0 auto' }}>
      <div className="page-header">
        <h1 className="page-title">About AlgoLens Visualizer</h1>
        <p className="page-desc">
          An interactive laboratory designed to make abstract computational patterns visible, tangible, and intuitive.
        </p>
      </div>

      <div className="stage-card" style={{ minHeight: 'auto', gap: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            Core Engine & Asynchronous Architecture
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
            Unlike naive visualizers that rely on fixed timer loops or cluttered DOM queries, AlgoLens is powered
            by a decoupled <strong>Player Engine</strong>. Every algorithm is written as pure algorithmic logic
            that yields state and awaits an asynchronous <code style={{ fontFamily: 'var(--font-mono)', background: 'var(--bg-surface-subtle)', padding: '2px 6px', borderRadius: '4px' }}>wait(token)</code> barrier.
          </p>
          <ul style={{ marginTop: '0.75rem', paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.7 }}>
            <li><strong>Run-Token Cancellation:</strong> Instantly aborts in-flight animations when resetting or switching algorithms with zero memory leaks.</li>
            <li><strong>Step-by-Step Execution:</strong> In paused mode, execution blocks seamlessly until the user triggers single-step increments.</li>
            <li><strong>Centralized Complexity Profiles:</strong> Loaded asynchronously from backend JSON endpoints or local cache, keeping specifications consistent.</li>
          </ul>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)' }} />

        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
            Big-O Computational Complexity Reference
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1rem'
          }}>
            {complexities.map((item, idx) => (
              <div
                key={idx}
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface-subtle)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '1rem', color: item.color }}>
                    {item.notation}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                    {item.name}
                  </span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)' }} />

        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            Structural Inspiration
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
            This project draws architectural inspiration from Tamim Ehsan's classic{' '}
            <a
              href="https://tamimehsan.github.io/AlgorithmVisualizer/"
              target="_blank"
              rel="noreferrer"
              style={{ color: 'var(--color-primary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
            >
              AlgorithmVisualizer <ExternalLink size={14} />
            </a>
            , reimagined with a modern, high-contrast light theme, modular React Router multi-page routing, and reusable canvas renderers.
          </p>
        </div>
      </div>
    </div>
  );
}
