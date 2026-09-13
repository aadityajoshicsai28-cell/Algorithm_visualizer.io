import React from 'react';

export default function BarChart({
  items = [],
  comparingIndices = [],
  swappedIndices = [],
  sortedIndices = [],
  pivotIndex = -1,
  pointerIndices = {},
  maxVal = null
}) {
  const maximum = maxVal || Math.max(...items.map(it => typeof it === 'object' ? it.value : it), 1);

  return (
    <div className="bar-chart-container">
      {items.map((item, idx) => {
        const value = typeof item === 'object' ? item.value : item;
        const heightPct = Math.max(8, (value / maximum) * 94);

        let colorClass = 'bar-default';
        if (sortedIndices.includes(idx)) {
          colorClass = 'bar-sorted';
        } else if (idx === pivotIndex) {
          colorClass = 'bar-pivot';
        } else if (swappedIndices.includes(idx)) {
          colorClass = 'bar-swapped';
        } else if (comparingIndices.includes(idx)) {
          colorClass = 'bar-comparing';
        }

        // Check if there are pointers (e.g. low, mid, high for binary search)
        const pointers = Object.entries(pointerIndices)
          .filter(([_, ptrIdx]) => ptrIdx === idx)
          .map(([name]) => name);

        return (
          <div
            key={idx}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flex: 1,
              maxWidth: '48px',
              height: '100%',
              justifyContent: 'flex-end',
              position: 'relative'
            }}
          >
            {pointers.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '4px',
                fontSize: '0.7rem',
                fontWeight: 700,
                background: 'var(--color-primary)',
                color: '#fff',
                padding: '1px 5px',
                borderRadius: '4px',
                whiteSpace: 'nowrap'
              }}>
                {pointers.join('/')}
              </div>
            )}

            <div
              className={`bar-item ${colorClass}`}
              style={{
                height: `${heightPct}%`,
                width: '100%',
              }}
            >
              {items.length <= 32 ? value : ''}
            </div>
            <span style={{
              fontSize: '0.65rem',
              color: 'var(--text-muted)',
              marginTop: '4px',
              fontFamily: 'var(--font-mono)'
            }}>
              {idx}
            </span>
          </div>
        );
      })}
    </div>
  );
}
