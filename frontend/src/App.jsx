import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import WelcomePage from './pages/WelcomePage';
import SortingPage from './pages/SortingPage';
import PathfindingPage from './pages/PathfindingPage';
import DataStructuresPage from './pages/DataStructuresPage';
import GraphAlgorithmsPage from './pages/GraphAlgorithmsPage';
import MathRecursionPage from './pages/MathRecursionPage';
import AboutPage from './pages/AboutPage';

export default function App() {
  return (
    <div className="app-container">
      <Navbar />
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <main id="main-content" className="main-content">
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/sorting" element={<SortingPage />} />
          <Route path="/pathfinding" element={<PathfindingPage />} />
          <Route path="/data-structures" element={<DataStructuresPage />} />
          <Route path="/graph" element={<GraphAlgorithmsPage />} />
          <Route path="/math-recursion" element={<MathRecursionPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
