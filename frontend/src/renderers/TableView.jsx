import React from 'react';
import { ArrowDown } from 'lucide-react';

export default function TableView({
  type = 'table', // 'table' | 'tape' | 'triangle'
  headers = [],
  rows = [],
  activeCell = null, // { r, c }
  tape = [],
  headIndex = 0,
  machineState = 'q0'
}) {
  if (type === 'tape') {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '2rem 1rem',
        width: '100%',
        overflowX: 'auto'
      }}>
        {/* Machine Head indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '0.5rem',
          fontWeight: 700,
          color: 'var(--color-primary)'
        }}>
          <span>State: <strong style={{ fontFamily: 'var(--font-mono)' }}>{machineState}</strong></span>
        </div>

        {/* Arrow pointing down at active tape cell */}
        <div style={{
          display: 'flex',
          gap: '4px',
          marginBottom: '4px',
        }}>
          {tape.map((_, idx) => (
            <div
              key={idx}
              style={{
                width: '44px',
                display: 'flex',
                justifyContent: 'center',
                color: idx === headIndex ? 'var(--color-primary)' : 'transparent',
              }}
            >
              <ArrowDown size={20} strokeWidth={2.5} />
            </div>
          ))}
        </div>

        {/* Tape cells */}
        <div style={{
          display: 'flex',
          border: '2px solid var(--border-medium)',
          borderRadius: 'var(--radius-md)',
          background: 'var(--bg-surface)',
          boxShadow: 'var(--shadow-md)',
          overflow: 'hidden'
        }}>
          {tape.map((symbol, idx) => {
            const isHead = idx === headIndex;
            return (
              <div
                key={idx}
                style={{
                  width: '44px',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                  borderRight: idx < tape.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                  background: isHead ? 'var(--color-primary-subtle)' : '#ffffff',
                  color: isHead ? 'var(--color-primary)' : 'var(--text-primary)',
                  transition: 'background-color 0.15s ease'
                }}
              >
                {symbol}
              </div>
            );
          })}
        </div>

        {/* Indices */}
        <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
          {tape.map((_, idx) => (
            <div
              key={idx}
              style={{
                width: '44px',
                textAlign: 'center',
                fontSize: '0.7rem',
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-mono)'
              }}
            >
              {idx}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'triangle') {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '1.5rem',
        overflowX: 'auto',
        width: '100%'
      }}>
        {rows.map((row, rIdx) => (
          <div key={rIdx} style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
            {row.map((val, cIdx) => {
              const isActive = activeCell && activeCell.r === rIdx && activeCell.c === cIdx;
              const isParent = activeCell && (
                (activeCell.r - 1 === rIdx && activeCell.c - 1 === cIdx) ||
                (activeCell.r - 1 === rIdx && activeCell.c === cIdx)
              );

              return (
                <div
                  key={cIdx}
                  style={{
                    minWidth: '38px',
                    height: '36px',
                    padding: '0 6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                    border: `1px solid ${isActive ? 'var(--color-primary)' : isParent ? 'var(--color-warning)' : 'var(--border-subtle)'}`,
                    background: isActive ? 'var(--color-primary-subtle)' : isParent ? 'var(--color-warning-bg)' : '#ffffff',
                    color: isActive ? 'var(--color-primary)' : isParent ? 'var(--color-warning)' : 'var(--text-primary)',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {val}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  }

  // Standard Table / DP Matrix / Trace Table
  return (
    <div style={{
      width: '100%',
      overflowX: 'auto',
      padding: '0.5rem 0'
    }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        textAlign: 'left',
        fontSize: '0.88rem',
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        border: '1px solid var(--border-subtle)'
      }}>
        {headers.length > 0 && (
          <thead style={{ background: 'var(--bg-surface-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
            <tr>
              {headers.map((h, i) => (
                <th
                  key={i}
                  style={{
                    padding: '0.75rem 1rem',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em'
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {rows.map((row, rIdx) => (
            <tr
              key={rIdx}
              style={{
                borderBottom: rIdx < rows.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                background: activeCell && activeCell.r === rIdx ? 'var(--color-primary-subtle)' : 'transparent'
              }}
            >
              {row.map((cell, cIdx) => {
                const isCellActive = activeCell && activeCell.r === rIdx && activeCell.c === cIdx;
                return (
                  <td
                    key={cIdx}
                    style={{
                      padding: '0.65rem 1rem',
                      fontFamily: typeof cell === 'number' ? 'var(--font-mono)' : 'inherit',
                      color: isCellActive ? 'var(--color-primary)' : 'var(--text-primary)',
                      fontWeight: isCellActive ? 700 : 500,
                      background: isCellActive ? '#e0e7ff' : 'transparent'
                    }}
                  >
                    {cell !== null && cell !== undefined ? String(cell) : '—'}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
