import React, { useState, useEffect, useCallback } from 'react';
import { Shuffle, RefreshCw } from 'lucide-react';
import { useEngine } from '../engine/useEngine';
import ControlBar from '../components/ControlBar';
import ComplexityTable from '../components/ComplexityTable';
import StatusLine from '../components/StatusLine';
import CategorySidebar from '../components/CategorySidebar';
import BarChart from '../renderers/BarChart';
import { fetchAlgorithmById } from '../services/metadataService';
import {
  bubbleSort,
  selectionSort,
  insertionSort,
  mergeSort,
  quickSort,
  heapSort
} from '../algorithms/sorting';

const SORTING_ALGORITHMS = [
  { id: 'bubble-sort', name: 'Bubble Sort', fn: bubbleSort },
  { id: 'selection-sort', name: 'Selection Sort', fn: selectionSort },
  { id: 'insertion-sort', name: 'Insertion Sort', fn: insertionSort },
  { id: 'merge-sort', name: 'Merge Sort', fn: mergeSort },
  { id: 'quick-sort', name: 'Quick Sort', fn: quickSort },
  { id: 'heap-sort', name: 'Heap Sort', fn: heapSort },
];

function generateRandomArray(size = 20) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 85) + 10);
}

export default function SortingPage() {
  const [selectedAlgoId, setSelectedAlgoId] = useState('bubble-sort');
  const [arraySize, setArraySize] = useState(20);
  const [items, setItems] = useState(() => generateRandomArray(20));
  const [metadata, setMetadata] = useState(null);

  // Visual state
  const [visualState, setVisualState] = useState({
    items: [],
    comparingIndices: [],
    swappedIndices: [],
    sortedIndices: [],
    pivotIndex: -1,
  });

  const {
    engine,
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
  } = useEngine(90);

  // Reset visual state when array changes
  const resetArray = useCallback((newSize = arraySize) => {
    reset();
    const newItems = generateRandomArray(newSize);
    setItems(newItems);
    setVisualState({
      items: newItems,
      comparingIndices: [],
      swappedIndices: [],
      sortedIndices: [],
      pivotIndex: -1,
    });
    setStatusText('Generated new randomized array.');
  }, [arraySize, reset, setStatusText]);

  useEffect(() => {
    resetArray(arraySize);
  }, [arraySize]);

  // Fetch metadata when selected algorithm changes
  useEffect(() => {
    fetchAlgorithmById(selectedAlgoId).then(setMetadata);
    reset();
    setVisualState(prev => ({
      ...prev,
      items: [...items],
      comparingIndices: [],
      swappedIndices: [],
      sortedIndices: [],
      pivotIndex: -1,
    }));
    const algoName = SORTING_ALGORITHMS.find(a => a.id === selectedAlgoId)?.name;
    setStatusText(`Selected ${algoName}. Press Play or Step to begin.`);
  }, [selectedAlgoId]);

  const handleStart = () => {
    const algo = SORTING_ALGORITHMS.find(a => a.id === selectedAlgoId);
    if (!algo) return;

    // Reset highlights before starting
    setVisualState(prev => ({
      ...prev,
      items: [...items],
      comparingIndices: [],
      swappedIndices: [],
      sortedIndices: [],
      pivotIndex: -1,
    }));

    startRun(async (wait) => {
      await algo.fn(items, wait, (stepData) => {
        if (engine?.activeToken?.cancelled) return;
        setVisualState({
          items: stepData.items,
          comparingIndices: stepData.comparingIndices || [],
          swappedIndices: stepData.swappedIndices || [],
          sortedIndices: stepData.sortedIndices || [],
          pivotIndex: stepData.pivotIndex !== undefined ? stepData.pivotIndex : -1,
        });
        if (stepData.status) setStatusText(stepData.status);
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

  const handleAlgoSelect = (id) => {
    if (running) reset();
    setSelectedAlgoId(id);
  };

  return (
    <div className="page-shell">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-top">
          <div>
            <h1 className="page-title">Sorting Algorithms</h1>
            <p className="page-desc">
              Observe how elements are compared, exchanged, partitioned, and placed into ordered positions.
            </p>
          </div>
        </div>

        {/* Algorithm Tabs */}
        <CategorySidebar
          algorithms={SORTING_ALGORITHMS}
          selectedId={selectedAlgoId}
          onSelect={handleAlgoSelect}
        />

        {/* Complexity Profile */}
        <ComplexityTable
          complexity={metadata?.complexity}
          name={metadata?.name || 'Sorting Algorithm'}
        />
      </div>

      {/* Control Bar */}
      <ControlBar
        running={running}
        paused={paused}
        delay={delay}
        onPlay={handlePlayPause}
        onPause={pause}
        onStep={handleStep}
        onReset={() => resetArray(arraySize)}
        onSpeedChange={setSpeed}
        extraControls={
          <>
            <div className="slider-group">
              <span>Size: {arraySize}</span>
              <input
                type="range"
                aria-label="Array size"
                min="8"
                max="42"
                value={arraySize}
                disabled={running}
                onChange={(e) => setArraySize(Number(e.target.value))}
                style={{ width: '90px' }}
              />
            </div>
            <button
              className="btn btn-secondary"
              onClick={() => resetArray(arraySize)}
              disabled={running}
              title="Generate new random numbers"
            >
              <Shuffle size={14} />
              <span>Randomize</span>
            </button>
          </>
        }
      />

      {/* Status Line */}
      <StatusLine text={statusText} running={running && !paused} />

      {/* Visualizer Stage */}
      <div className="stage-card">
        <BarChart
          items={visualState.items.length > 0 ? visualState.items : items}
          comparingIndices={visualState.comparingIndices}
          swappedIndices={visualState.swappedIndices}
          sortedIndices={visualState.sortedIndices}
          pivotIndex={visualState.pivotIndex}
        />

        {/* Legend */}
        <div className="legend-strip">
          <div className="legend-item">
            <div className="legend-swatch" style={{ background: '#3b82f6' }}></div>
            <span>Default</span>
          </div>
          <div className="legend-item">
            <div className="legend-swatch" style={{ background: '#f59e0b' }}></div>
            <span>Comparing</span>
          </div>
          <div className="legend-item">
            <div className="legend-swatch" style={{ background: '#ef4444' }}></div>
            <span>Swapping</span>
          </div>
          <div className="legend-item">
            <div className="legend-swatch" style={{ background: '#8b5cf6' }}></div>
            <span>Pivot</span>
          </div>
          <div className="legend-item">
            <div className="legend-swatch" style={{ background: '#10b981' }}></div>
            <span>Sorted</span>
          </div>
        </div>
      </div>
    </div>
  );
}
