import React, { useState } from 'react';

export default function Grid({
  grid = [],
  onCellMouseDown = null,
  onCellMouseEnter = null,
  onCellMouseUp = null,
  cellSize = 26,
  renderCellContent = null,
  customCellClass = null,
}) {
  const [isMouseDown, setIsMouseDown] = useState(false);

  const handleMouseDown = (r, c) => {
    setIsMouseDown(true);
    if (onCellMouseDown) onCellMouseDown(r, c);
  };

  const handleMouseEnter = (r, c) => {
    if (isMouseDown && onCellMouseEnter) {
      onCellMouseEnter(r, c);
    }
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
    if (onCellMouseUp) onCellMouseUp();
  };

  return (
    <div
      className="grid-container"
      role="grid"
      aria-label="Pathfinding grid"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {grid.map((row, rIdx) => (
        <div key={rIdx} className="grid-row">
          {row.map((cell, cIdx) => {
            let className = 'grid-cell';

            if (customCellClass) {
              className += ` ${customCellClass(cell, rIdx, cIdx)}`;
            } else {
              // Default pathfinding cell states
              if (cell.isStart) className += ' cell-start';
              else if (cell.isTarget) className += ' cell-target';
              else if (cell.isWall) className += ' cell-wall';
              else if (cell.isPath) className += ' cell-path';
              else if (cell.searchSide === 'collision') className += ' cell-collision';
              else if (cell.searchSide === 'target') className += ' cell-target-frontier';
              else if (cell.isVisiting) className += ' cell-visiting';
              else if (cell.isVisited) className += ' cell-visited';
              else className += ' cell-empty';
            }

            return (
              <div
                key={`${rIdx}-${cIdx}`}
                className={className}
                role="gridcell"
                tabIndex="0"
                aria-label={`Row ${rIdx + 1}, column ${cIdx + 1}${cell.isStart ? ', start' : cell.isTarget ? ', target' : cell.isWall ? ', wall' : ''}`}
                style={{
                  width: `${cellSize}px`,
                  height: `${cellSize}px`,
                }}
                onMouseDown={() => handleMouseDown(rIdx, cIdx)}
                onMouseEnter={() => handleMouseEnter(rIdx, cIdx)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    handleMouseDown(rIdx, cIdx);
                    handleMouseUp();
                  }
                }}
              >
                {renderCellContent ? renderCellContent(cell, rIdx, cIdx) : (
                  cell.isStart ? 'S' : cell.isTarget ? 'T' : ''
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
