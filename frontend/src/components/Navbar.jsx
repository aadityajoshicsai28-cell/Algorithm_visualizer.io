import React, { useEffect, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  BarChart3,
  Compass,
  Binary,
  Share2,
  Cpu,
  Info,
  Menu,
  X,
  Layers
} from 'lucide-react';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') setMobileOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const navItems = [
    { label: 'Sorting', path: '/sorting', icon: BarChart3 },
    { label: 'Pathfinding', path: '/pathfinding', icon: Compass },
    { label: 'Data Structures', path: '/data-structures', icon: Binary },
    { label: 'Graph', path: '/graph', icon: Share2 },
    { label: 'Math & Recursion', path: '/math-recursion', icon: Cpu },
    { label: 'About', path: '/about', icon: Info },
  ];

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="nav-brand" onClick={() => setMobileOpen(false)}>
          <div className="nav-brand-logo">
            <Layers size={18} />
          </div>
          <span>AlgoLens</span>
        </Link>

        {/* Desktop & Mobile Links */}
        <nav id="primary-navigation" className={`nav-links ${mobileOpen ? 'mobile-open' : ''}`} aria-label="Primary navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Mobile toggle */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileOpen}
          aria-controls="primary-navigation"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  );
}
