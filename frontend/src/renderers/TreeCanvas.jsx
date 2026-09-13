import React, { useMemo } from 'react';

export default function TreeCanvas({
  root = null,
  highlightIds = [],
  activeNodeId = null,
  width = 800,
  height = 420
}) {
  // Compute positions for tree layout
  const { nodes, edges } = useMemo(() => {
    if (!root) return { nodes: [], edges: [] };

    const nodeList = [];
    const edgeList = [];

    // Helper to calculate subtree width
    function assignPositions(node, depth = 0, leftBound = 50, rightBound = width - 50) {
      if (!node) return;

      const x = (leftBound + rightBound) / 2;
      const y = 50 + depth * 70;

      const current = {
        id: node.id || `${node.value}-${depth}-${x}`,
        value: node.value,
        label: node.label || String(node.value),
        x,
        y,
        status: node.status || 'default',
        highlight: node.highlight || false,
      };
      nodeList.push(current);

      if (node.left) {
        const leftChildX = (leftBound + x) / 2;
        const leftChildY = 50 + (depth + 1) * 70;
        edgeList.push({
          fromX: x,
          fromY: y + 16,
          toX: leftChildX,
          toY: leftChildY - 16,
          id: `${current.id}-left`,
          dir: 'L'
        });
        assignPositions(node.left, depth + 1, leftBound, x);
      }

      if (node.right) {
        const rightChildX = (x + rightBound) / 2;
        const rightChildY = 50 + (depth + 1) * 70;
        edgeList.push({
          fromX: x,
          fromY: y + 16,
          toX: rightChildX,
          toY: rightChildY - 16,
          id: `${current.id}-right`,
          dir: 'R'
        });
        assignPositions(node.right, depth + 1, x, rightBound);
      }
    }

    assignPositions(root);
    return { nodes: nodeList, edges: edgeList };
  }, [root, width]);

  return (
    <div style={{
      width: '100%',
      overflowX: 'auto',
      display: 'flex',
      justifyContent: 'center',
      padding: '1rem 0'
    }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{
          width: '100%',
          maxWidth: `${width}px`,
          height: `${height}px`,
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)'
        }}
      >
        {/* Render Edges */}
        {edges.map((edge) => (
          <g key={edge.id}>
            <line
              x1={edge.fromX}
              y1={edge.fromY}
              x2={edge.toX}
              y2={edge.toY}
              stroke="#94a3b8"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </g>
        ))}

        {/* Render Nodes */}
        {nodes.map((node) => {
          const isActive = node.id === activeNodeId || node.highlight;
          let fill = '#ffffff';
          let stroke = '#64748b';
          let textFill = 'var(--text-primary)';

          if (node.status === 'found' || node.status === 'success') {
            fill = '#10b981';
            stroke = '#059669';
            textFill = '#ffffff';
          } else if (node.status === 'visiting' || node.status === 'active' || isActive) {
            fill = '#f59e0b';
            stroke = '#d97706';
            textFill = '#ffffff';
          } else if (node.status === 'inserting') {
            fill = '#3b82f6';
            stroke = '#2563eb';
            textFill = '#ffffff';
          } else if (node.status === 'deleting') {
            fill = '#ef4444';
            stroke = '#dc2626';
            textFill = '#ffffff';
          }

          return (
            <g
              key={node.id}
              transform={`translate(${node.x}, ${node.y})`}
              style={{ transition: 'all 0.25s ease' }}
            >
              <circle
                r="20"
                fill={fill}
                stroke={stroke}
                strokeWidth={isActive ? '3.5' : '2'}
                filter="drop-shadow(0 2px 4px rgba(0,0,0,0.08))"
              />
              <text
                textAnchor="middle"
                dy="5"
                fontSize="12"
                fontWeight="700"
                fontFamily="var(--font-mono)"
                fill={textFill}
              >
                {node.label}
              </text>
            </g>
          );
        })}

        {nodes.length === 0 && (
          <text
            x={width / 2}
            y={height / 2}
            textAnchor="middle"
            fill="var(--text-muted)"
            fontSize="14"
            fontWeight="600"
          >
            Tree is empty. Insert a value to start.
          </text>
        )}
      </svg>
    </div>
  );
}
