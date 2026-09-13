import React from 'react';
import { ArrowRight, CornerDownRight } from 'lucide-react';

export default function LinkedListView({
  nodes = [],
  highlightId = null,
  activePointer = null, // { name: 'curr', index: 2 }
  pointers = [],        // [{ name: 'HEAD', index: 0 }, { name: 'TAIL', index: 4 }]
}) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '2.5rem 1rem',
      overflowX: 'auto',
      minHeight: '260px',
      width: '100%'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '1.5rem 0.5rem',
      }}>
        {nodes.length === 0 ? (
          <div style={{
            padding: '2rem',
            border: '2px dashed var(--border-medium)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-muted)',
            fontWeight: 600
          }}>
            List is currently empty. Insert a node to start!
          </div>
        ) : (
          nodes.map((node, idx) => {
            const isHighlighted = node.id === highlightId || node.highlight;
            const nodePointers = pointers.filter(p => p.index === idx);

            return (
              <React.Fragment key={node.id || idx}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                  {/* Pointer badges above the node */}
                  <div style={{
                    display: 'flex',
                    gap: '4px',
                    marginBottom: '8px',
                    minHeight: '22px',
                    alignItems: 'flex-end'
                  }}>
                    {nodePointers.map((p, pIdx) => (
                      <span
                        key={pIdx}
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: p.color || 'var(--color-primary)',
                          color: '#fff',
                          letterSpacing: '0.04em',
                          boxShadow: 'var(--shadow-sm)'
                        }}
                      >
                        {p.name}
                      </span>
                    ))}
                  </div>

                  {/* Node Box */}
                  <div
                    style={{
                      display: 'flex',
                      border: `2px solid ${
                        node.status === 'found' ? 'var(--color-success)' :
                        node.status === 'visiting' ? 'var(--color-warning)' :
                        node.status === 'deleting' ? 'var(--color-danger)' :
                        isHighlighted ? 'var(--color-primary)' : 'var(--border-medium)'
                      }`,
                      borderRadius: 'var(--radius-md)',
                      background: node.status === 'found' ? 'var(--color-success-bg)' :
                                  node.status === 'visiting' ? 'var(--color-warning-bg)' :
                                  node.status === 'deleting' ? 'var(--color-danger-bg)' : 'var(--bg-surface)',
                      boxShadow: 'var(--shadow-md)',
                      overflow: 'hidden',
                      transition: 'all 0.2s ease',
                      transform: isHighlighted ? 'scale(1.05)' : 'scale(1)'
                    }}
                  >
                    <div style={{
                      padding: '0.75rem 1.1rem',
                      fontSize: '1.05rem',
                      fontWeight: 700,
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--text-primary)',
                      borderRight: '1px solid var(--border-medium)',
                      minWidth: '46px',
                      textAlign: 'center'
                    }}>
                      {node.value}
                    </div>
                    <div style={{
                      padding: '0.75rem 0.65rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: 'var(--text-muted)',
                      background: 'var(--bg-surface-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      • next
                    </div>
                  </div>

                  {/* Index subscript */}
                  <span style={{
                    marginTop: '6px',
                    fontSize: '0.7rem',
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-mono)'
                  }}>
                    [{idx}]
                  </span>
                </div>

                {/* Arrow to next node */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  color: isHighlighted ? 'var(--color-primary)' : 'var(--text-muted)',
                  marginTop: '10px'
                }}>
                  <ArrowRight size={22} strokeWidth={2.5} />
                </div>
              </React.Fragment>
            );
          })
        )}

        {/* Null terminator */}
        {nodes.length > 0 && (
          <div style={{
            marginTop: '10px',
            padding: '0.6rem 0.9rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-surface-subtle)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-muted)',
            fontWeight: 700,
            fontSize: '0.85rem',
            fontFamily: 'var(--font-mono)'
          }}>
            NULL
          </div>
        )}
      </div>
    </div>
  );
}
