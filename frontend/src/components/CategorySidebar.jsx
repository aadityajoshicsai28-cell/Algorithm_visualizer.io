import React from 'react';

export default function CategorySidebar({ algorithms = [], selectedId, onSelect }) {
  return (
    <div className="algo-tabs" role="tablist" aria-label="Visualization algorithms">
      {algorithms.map((algo) => {
        const isActive = algo.id === selectedId;
        return (
          <button
            key={algo.id}
            className={`algo-tab-btn ${isActive ? 'active' : ''}`}
            onClick={() => onSelect(algo.id)}
            role="tab"
            aria-selected={isActive}
          >
            {algo.name}
          </button>
        );
      })}
    </div>
  );
}
