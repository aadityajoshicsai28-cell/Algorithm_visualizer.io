import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Eraser, Grid as GridIcon, Sparkles } from 'lucide-react';
import { useEngine } from '../engine/useEngine';
import ControlBar from '../components/ControlBar';
import ComplexityTable from '../components/ComplexityTable';
import StatusLine from '../components/StatusLine';
import CategorySidebar from '../components/CategorySidebar';
import Grid from '../renderers/Grid';
import { fetchAlgorithmById } from '../services/metadataService';
import {
  createInitialGrid,
  bfsPath,
  dfsPath,
  dijkstraPath,
  generateRandomMaze
} from '../algorithms/pathfinding';

const PATHFINDING_ALGORITHMS = [
  { id: 'bfs-path', name: 'Breadth-First Search (BFS)', fn: bfsPath },
  { id: 'dijkstra-path', name: "Dijkstra's Algorithm", fn: dijkstraPath },
  { id: 'dfs-path', name: 'Depth-First Search (DFS)', fn: dfsPath },
];

export default function PathfindingPage() {
  const [selectedAlgoId, setSelectedAlgoId] = useState('bfs-path');
  const [grid, setGrid] = useState(() => createInitialGrid(16, 32));
  const [metadata, setMetadata] = useState(null);
  const [statsText, setStatsText] = useState(null);

  // Dragging state for walls and markers
  const dragModeRef = useRef(null); // 'wall' | 'erase' | 'moveStart' | 'moveTarget'

  const {
    running,
    paused,
    delay,
    statusText,
    setStatusText,
    play,
    pause,
    step,
    setSpeed,
    reset,
    startRun,
  } = useEngine(35);

  useEffect(() => {
    fetchAlgorithmById(selectedAlgoId).then(setMetadata);
    reset();
    clearPath();
    const algoName = PATHFINDING_ALGORITHMS.find(a => a.id === selectedAlgoId)?.name;
    setStatusText(`Selected ${algoName}. Click and drag on grid to draw walls, or press Play to search.`);
  }, [selectedAlgoId]);

  const clearPath = useCallback(() => {
    setGrid(prev => prev.map(row => row.map(cell => ({
      ...cell,
      isVisited: false,
      isVisiting: false,
      isPath: false,
      distance: Infinity,
      fScore: Infinity,
      previous: null
    }))));
    setStatsText(null);
  }, []);

  const clearAllWalls = useCallback(() => {
    reset();
    setGrid(prev => prev.map(row => row.map(cell => ({
      ...cell,
      isWall: false,
      isVisited: false,
      isVisiting: false,
      isPath: false,
      distance: Infinity,
      fScore: Infinity,
      previous: null
    }))));
    setStatsText(null);
    setStatusText('All walls cleared. Grid is open.');
  }, [reset, setStatusText]);

  const handleGenerateMaze = () => {
    if (running) return;
    reset();
    setGrid(previous => generateRandomMaze(previous));
    setStatsText(null);
    setStatusText('Random obstacle maze generated. Press Play to search from both endpoints.');
  };

  // Interactive Grid Mouse Event Handlers
  const handleCellMouseDown = (r, c) => {
    if (running) return;
    const cell = grid[r][c];

    if (cell.isStart) {
      dragModeRef.current = 'moveStart';
    } else if (cell.isTarget) {
      dragModeRef.current = 'moveTarget';
    } else if (cell.isWall) {
      dragModeRef.current = 'erase';
      toggleWall(r, c, false);
    } else {
      dragModeRef.current = 'wall';
      toggleWall(r, c, true);
    }
  };

  const handleCellMouseEnter = (r, c) => {
    if (running || !dragModeRef.current) return;
    const mode = dragModeRef.current;

    if (mode === 'wall') {
      toggleWall(r, c, true);
    } else if (mode === 'erase') {
      toggleWall(r, c, false);
    } else if (mode === 'moveStart') {
      moveMarker('isStart', r, c);
    } else if (mode === 'moveTarget') {
      moveMarker('isTarget', r, c);
    }
  };

  const handleCellMouseUp = () => {
    dragModeRef.current = null;
  };

  const toggleWall = (r, c, isWall) => {
    setGrid(prev => {
      const next = prev.map(row => [...row]);
      if (!next[r][c].isStart && !next[r][c].isTarget) {
        next[r][c] = { ...next[r][c], isWall, isVisited: false, isPath: false };
      }
      return next;
    });
  };

  const moveMarker = (type, r, c) => {
    setGrid(prev => {
      const next = prev.map(row => row.map(cell => {
        if (cell[type]) return { ...cell, [type]: false };
        if (cell.r === r && cell.c === c) return { ...cell, [type]: true, isWall: false };
        return cell;
      }));
      return next;
    });
  };

  const handleStart = () => {
    const algo = PATHFINDING_ALGORITHMS.find(a => a.id === selectedAlgoId);
    if (!algo) return;

    clearPath();

    startRun(async (wait) => {
      await algo.fn(grid, wait, (stepData) => {
        if (stepData.grid) setGrid(stepData.grid);
        if (stepData.status) setStatusText(stepData.status);
        if (stepData.stats) setStatsText(stepData.stats);
      });
    });
  };

  const handlePlayPause = () => {
    if (!running) {
      handleStart();
    } else if (paused) {
      play();
    } else {
      pause();
    }
  };

  const handleStep = () => {
    if (!running) {
      handleStart();
      setTimeout(() => pause(), 0);
    } else {
      step();
    }
  };

  return (
    <div className="page-shell">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-top">
          <div>
            <h1 className="page-title">Pathfinding & Maze Exploration</h1>
            <p className="page-desc">
              Draw custom walls and watch bidirectional BFS, DFS, and Dijkstra expand from both endpoints until their frontiers meet.
            </p>
          </div>
        </div>

        {/* Algorithm Tabs */}
        <CategorySidebar
          algorithms={PATHFINDING_ALGORITHMS}
          selectedId={selectedAlgoId}
          onSelect={(id) => {
            if (running) reset();
            setSelectedAlgoId(id);
          }}
        />

        {/* Complexity Profile */}
        <ComplexityTable
          complexity={metadata?.complexity}
          name={metadata?.name || 'Pathfinding Algorithm'}
        />
      </div>

      {/* Controls */}
      <ControlBar
        running={running}
        paused={paused}
        delay={delay}
        onPlay={handlePlayPause}
        onPause={pause}
        onStep={handleStep}
        onReset={() => {
          reset();
          clearPath();
        }}
        onSpeedChange={setSpeed}
        extraControls={
          <>
            <button
              className="btn btn-secondary"
              onClick={handleGenerateMaze}
              disabled={running}
              title="Generate a random obstacle maze"
            >
              <Sparkles size={14} />
              <span>Maze</span>
            </button>
            <button
              className="btn btn-secondary"
              onClick={clearPath}
              disabled={running}
              title="Clear visited paths"
            >
              <Eraser size={14} />
              <span>Clear Path</span>
            </button>
            <button
              className="btn btn-secondary"
              onClick={clearAllWalls}
              disabled={running}
              title="Remove all obstacle walls"
            >
              <GridIcon size={14} />
              <span>Clear Walls</span>
            </button>
          </>
        }
      />

      {/* Status Line */}
      <StatusLine text={statusText} running={running && !paused} stats={statsText} />

      {/* Interactive Grid Stage */}
      <div className="stage-card" style={{ alignItems: 'center' }}>
        <div style={{
          marginBottom: '0.5rem',
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span>Tip: Click & drag to draw obstacle walls, use Maze for a random layout, or drag S/T to reposition endpoints.</span>
        </div>

        <Grid
          grid={grid}
          onCellMouseDown={handleCellMouseDown}
          onCellMouseEnter={handleCellMouseEnter}
          onCellMouseUp={handleCellMouseUp}
          cellSize={24}
        />

        {/* Legend */}
        <div className="legend-strip">
          <div className="legend-item">
            <div className="legend-swatch" style={{ background: '#10b981' }}></div>
            <span>Start Node (S)</span>
          </div>
          <div className="legend-item">
            <div className="legend-swatch" style={{ background: '#ef4444' }}></div>
            <span>Target Node (T)</span>
          </div>
          <div className="legend-item">
            <div className="legend-swatch" style={{ background: '#1e293b' }}></div>
            <span>Obstacle Wall</span>
          </div>
          <div className="legend-item">
            <div className="legend-swatch" style={{ background: '#fef08a' }}></div>
            <span>Currently Visiting</span>
          </div>
          <div className="legend-item">
            <div className="legend-swatch" style={{ background: '#e0f2fe' }}></div>
            <span>Visited Nodes</span>
          </div>
          <div className="legend-item">
            <div className="legend-swatch" style={{ background: '#8b5cf6' }}></div>
            <span>Shortest Path</span>
          </div>
        </div>
      </div>
    </div>
  );
}
