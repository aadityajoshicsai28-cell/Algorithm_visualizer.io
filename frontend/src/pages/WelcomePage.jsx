import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3,
  Compass,
  Binary,
  Share2,
  Cpu,
  ArrowRight,
  Sparkles,
  Zap,
  Code2,
  BookOpen
} from 'lucide-react';
import { fetchCategories } from '../services/metadataService';

export default function WelcomePage() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadCategories() {
      setIsLoading(true);
      setError('');

      try {
        const data = await fetchCategories();
        if (active) {
          setCategories(data);
        }
      } catch (err) {
        if (active) {
          setError('Unable to load algorithm categories right now. Showing offline fallback data.');
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadCategories();
    return () => {
      active = false;
    };
  }, []);

  const iconMap = {
    BarChart3: BarChart3,
    Compass: Compass,
    Binary: Binary,
    Share2: Share2,
    Cpu: Cpu,
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-pill">
          <Sparkles size={14} />
          <span>Interactive Computer Science Laboratory</span>
        </div>
        <h1 className="hero-title">
          Master Complex Algorithms <span>Step-by-Step</span>
        </h1>
        <p className="hero-subtitle">
          Explore intuitive, multi-page visual simulations of sorting routines, graph traversals,
          geometric hulls, tree structures, and discrete mathematics with total execution control.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/sorting" className="btn btn-primary" style={{ padding: '0.75rem 1.4rem', fontSize: '0.95rem' }}>
            <span>Explore Visualizers</span>
            <ArrowRight size={18} />
          </Link>
          <Link to="/about" className="btn btn-secondary" style={{ padding: '0.75rem 1.4rem', fontSize: '0.95rem' }}>
            <BookOpen size={18} />
            <span>Complexity Guide</span>
          </Link>
        </div>
      </section>

      {/* Feature Badges Banner */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '2rem',
        flexWrap: 'wrap',
        margin: '0 auto 3rem',
        padding: '1rem 1.5rem',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        maxWidth: '960px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Zap size={18} color="var(--color-primary)" />
          <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>Play, Pause & Single-Step</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Code2 size={18} color="var(--color-success)" />
          <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>17+ Core Algorithms</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Sparkles size={18} color="var(--color-warning)" />
          <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>Real-Time Complexity Profiles</span>
        </div>
      </div>

      {/* Category Grid Section */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Algorithm Categories
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Choose an area of computation to launch its dedicated visualizer environment.
          </p>
        </div>
      </div>

      {isLoading && (
        <div className="status-card" aria-live="polite">
          Loading algorithm categories...
        </div>
      )}

      {!isLoading && error && (
        <div className="status-card status-card-warning" role="alert">
          {error}
        </div>
      )}

      {!isLoading && categories.length > 0 && (
        <div className="category-grid">
          {categories.map((cat) => {
            const Icon = iconMap[cat.icon] || BarChart3;
            return (
              <Link key={cat.id} to={cat.route} className="category-card">
                <div className="category-card-header">
                  <div className="category-card-icon">
                    <Icon size={24} />
                  </div>
                  <span className="category-card-badge">
                    {cat.badge || `${cat.count} Algorithms`}
                  </span>
                </div>

                <h3 className="category-card-title">{cat.name}</h3>
                <p className="category-card-desc">{cat.description}</p>

                <div className="category-card-footer">
                  <span>Launch Interactive Page</span>
                  <ArrowRight size={16} />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
