import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Heart, Layers } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div style={{ maxWidth: '420px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
              <Layers size={18} color="var(--color-primary)" />
              <span>AlgoLens — Algorithm Visualizer</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5 }}>
              An interactive multi-page laboratory for stepping through sorting, pathfinding, data structures, graph traversals, and mathematical computations.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Categories
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.82rem' }}>
                <li><Link to="/sorting" style={{ color: 'var(--text-secondary)' }}>Sorting Algorithms</Link></li>
                <li><Link to="/pathfinding" style={{ color: 'var(--text-secondary)' }}>Pathfinding & Mazes</Link></li>
                <li><Link to="/data-structures" style={{ color: 'var(--text-secondary)' }}>Data Structures</Link></li>
                <li><Link to="/graph" style={{ color: 'var(--text-secondary)' }}>Graph Algorithms</Link></li>
                <li><Link to="/math-recursion" style={{ color: 'var(--text-secondary)' }}>Math & Recursion</Link></li>
              </ul>
            </div>

            <div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Reference & Credits
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.82rem' }}>
                <li>
                  <a
                    href="https://tamimehsan.github.io/AlgorithmVisualizer/"
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: 'var(--color-primary)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    Structural Inspiration (Tamim Ehsan) <ExternalLink size={12} />
                  </a>
                </li>
                <li><Link to="/about" style={{ color: 'var(--text-secondary)' }}>Complexity Guide & Theory</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} AlgoLens. Designed with precision & light theme.</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            Built with React, Vite & pure algorithmic state engine
          </span>
        </div>
      </div>
    </footer>
  );
}
