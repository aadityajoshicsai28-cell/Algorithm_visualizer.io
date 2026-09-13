import React, { useState, useEffect } from 'react';
import { Plus, Search, Trash2, RotateCw, CornerDownLeft } from 'lucide-react';
import { useEngine } from '../engine/useEngine';
import ControlBar from '../components/ControlBar';
import ComplexityTable from '../components/ComplexityTable';
import StatusLine from '../components/StatusLine';
import CategorySidebar from '../components/CategorySidebar';
import LinkedListView from '../renderers/LinkedListView';
import TreeCanvas from '../renderers/TreeCanvas';
import { fetchAlgorithmById } from '../services/metadataService';
import {
  insertHeadList,
  insertTailList,
  searchList,
  deleteList,
  reverseList,
  insertBST,
  searchBST,
  deleteBST
} from '../algorithms/dataStructures';

const DS_MODES = [
  { id: 'singly-linked-list', name: 'Singly Linked List' },
  { id: 'binary-search-tree', name: 'Binary Search Tree (BST)' },
];

const INITIAL_LIST = [
  { id: 'n-1', value: 12, status: 'default' },
  { id: 'n-2', value: 27, status: 'default' },
  { id: 'n-3', value: 45, status: 'default' },
  { id: 'n-4', value: 68, status: 'default' },
];

const INITIAL_BST = {
  id: 'root-40',
  value: 40,
  label: '40',
  status: 'default',
  left: {
    id: 'l-20',
    value: 20,
    label: '20',
    status: 'default',
    left: { id: 'll-10', value: 10, label: '10', status: 'default' },
    right: { id: 'lr-30', value: 30, label: '30', status: 'default' }
  },
  right: {
    id: 'r-60',
    value: 60,
    label: '60',
    status: 'default',
    left: { id: 'rl-50', value: 50, label: '50', status: 'default' },
    right: { id: 'rr-75', value: 75, label: '75', status: 'default' }
  }
};

export default function DataStructuresPage() {
  const [selectedDsId, setSelectedDsId] = useState('singly-linked-list');
  const [metadata, setMetadata] = useState(null);

  // Input states
  const [inputValue, setInputValue] = useState('35');

  // List State
  const [nodes, setNodes] = useState(INITIAL_LIST);
  const [pointers, setPointers] = useState([
    { name: 'HEAD', index: 0, color: 'var(--color-primary)' },
    { name: 'TAIL', index: 3, color: 'var(--color-warning)' }
  ]);

  // Tree State
  const [bstRoot, setBstRoot] = useState(INITIAL_BST);

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
  } = useEngine(140);

  const getValidatedValue = () => {
    if (inputValue.trim() === '') {
      setStatusText('Enter a valid number before running this operation.');
      return null;
    }
    const value = Number(inputValue);
    if (!Number.isFinite(value)) {
      setStatusText('Enter a valid number before running this operation.');
      return null;
    }
    return value;
  };

  useEffect(() => {
    fetchAlgorithmById(selectedDsId).then(setMetadata);
    reset();
    setStatusText(`Loaded ${selectedDsId === 'singly-linked-list' ? 'Singly Linked List' : 'Binary Search Tree'}. Choose an operation.`);
  }, [selectedDsId]);

  // Linked List Actions
  const handleInsertHead = () => {
    const value = getValidatedValue();
    if (value === null) return;
    startRun(async (wait) => {
      const updated = await insertHeadList(nodes, value, wait, (s) => {
        if (s.nodes) setNodes(s.nodes);
        if (s.pointers) setPointers(s.pointers);
        if (s.status) setStatusText(s.status);
      });
      setNodes(updated);
    });
  };

  const handleInsertTail = () => {
    const value = getValidatedValue();
    if (value === null) return;
    startRun(async (wait) => {
      const updated = await insertTailList(nodes, value, wait, (s) => {
        if (s.nodes) setNodes(s.nodes);
        if (s.pointers) setPointers(s.pointers);
        if (s.status) setStatusText(s.status);
      });
      setNodes(updated);
    });
  };

  const handleSearchList = () => {
    const value = getValidatedValue();
    if (value === null) return;
    startRun(async (wait) => {
      await searchList(nodes, value, wait, (s) => {
        if (s.nodes) setNodes(s.nodes);
        if (s.pointers) setPointers(s.pointers);
        if (s.status) setStatusText(s.status);
      });
    });
  };

  const handleDeleteList = () => {
    const value = getValidatedValue();
    if (value === null) return;
    startRun(async (wait) => {
      const updated = await deleteList(nodes, value, wait, (s) => {
        if (s.nodes) setNodes(s.nodes);
        if (s.pointers) setPointers(s.pointers);
        if (s.status) setStatusText(s.status);
      });
      setNodes(updated);
    });
  };

  const handleReverseList = () => {
    startRun(async (wait) => {
      const updated = await reverseList(nodes, wait, (s) => {
        if (s.nodes) setNodes(s.nodes);
        if (s.pointers) setPointers(s.pointers);
        if (s.status) setStatusText(s.status);
      });
      setNodes(updated);
    });
  };

  // BST Actions
  const handleInsertBST = () => {
    const value = getValidatedValue();
    if (value === null) return;
    startRun(async (wait) => {
      const newRoot = await insertBST(bstRoot, value, wait, (s) => {
        if (s.tree !== undefined) setBstRoot(s.tree);
        if (s.status) setStatusText(s.status);
      });
      setBstRoot(newRoot);
    });
  };

  const handleSearchBST = () => {
    const value = getValidatedValue();
    if (value === null) return;
    startRun(async (wait) => {
      await searchBST(bstRoot, value, wait, (s) => {
        if (s.tree !== undefined) setBstRoot(s.tree);
        if (s.status) setStatusText(s.status);
      });
    });
  };

  const handleDeleteBST = () => {
    const value = getValidatedValue();
    if (value === null) return;
    startRun(async (wait) => {
      const newRoot = await deleteBST(bstRoot, value, wait, (s) => {
        if (s.tree !== undefined) setBstRoot(s.tree);
        if (s.status) setStatusText(s.status);
      });
      setBstRoot(newRoot);
    });
  };

  const handleResetSample = () => {
    reset();
    if (selectedDsId === 'singly-linked-list') {
      setNodes(INITIAL_LIST);
      setPointers([
        { name: 'HEAD', index: 0, color: 'var(--color-primary)' },
        { name: 'TAIL', index: 3, color: 'var(--color-warning)' }
      ]);
      setStatusText('Reset linked list to default 4-node sequence.');
    } else {
      setBstRoot(INITIAL_BST);
      setStatusText('Reset BST to standard balanced sample tree.');
    }
  };

  return (
    <div className="page-shell">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-top">
          <div>
            <h1 className="page-title">Data Structures in Action</h1>
            <p className="page-desc">
              Inspect pointer manipulations across Singly Linked Lists and dynamic tree restructuring in Binary Search Trees.
            </p>
          </div>
        </div>

        {/* Mode Selector */}
        <CategorySidebar
          algorithms={DS_MODES}
          selectedId={selectedDsId}
          onSelect={(id) => {
            if (running) reset();
            setSelectedDsId(id);
          }}
        />

        {/* Complexity Profile */}
        <ComplexityTable
          complexity={metadata?.complexity}
          name={metadata?.name || 'Data Structure'}
        />
      </div>

      {/* Control Bar with Operation Buttons */}
      <ControlBar
        running={running}
        paused={paused}
        delay={delay}
        onPlay={() => { if (paused) play(); }}
        onPause={pause}
        onStep={step}
        onReset={handleResetSample}
        onSpeedChange={setSpeed}
        extraControls={
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Val:</span>
              <input
                type="number"
                min="-1000000"
                max="1000000"
                step="1"
                aria-label="Data structure value"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                style={{
                  width: '65px',
                  padding: '0.35rem 0.5rem',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem',
                  fontFamily: 'var(--font-mono)'
                }}
              />
            </div>

            {selectedDsId === 'singly-linked-list' ? (
              <>
                <button className="btn btn-primary" onClick={handleInsertHead} disabled={running}>
                  <Plus size={14} /> <span>Head</span>
                </button>
                <button className="btn btn-primary" onClick={handleInsertTail} disabled={running}>
                  <Plus size={14} /> <span>Tail</span>
                </button>
                <button className="btn btn-secondary" onClick={handleSearchList} disabled={running}>
                  <Search size={14} /> <span>Search</span>
                </button>
                <button className="btn btn-danger" onClick={handleDeleteList} disabled={running}>
                  <Trash2 size={14} /> <span>Delete</span>
                </button>
                <button className="btn btn-secondary" onClick={handleReverseList} disabled={running}>
                  <RotateCw size={14} /> <span>Reverse</span>
                </button>
              </>
            ) : (
              <>
                <button className="btn btn-primary" onClick={handleInsertBST} disabled={running}>
                  <Plus size={14} /> <span>Insert</span>
                </button>
                <button className="btn btn-secondary" onClick={handleSearchBST} disabled={running}>
                  <Search size={14} /> <span>Search</span>
                </button>
                <button className="btn btn-danger" onClick={handleDeleteBST} disabled={running}>
                  <Trash2 size={14} /> <span>Delete</span>
                </button>
              </>
            )}
          </div>
        }
      />

      {/* Status Line */}
      <StatusLine text={statusText} running={running && !paused} />

      {/* Visualizer Stage */}
      <div className="stage-card">
        {selectedDsId === 'singly-linked-list' ? (
          <LinkedListView nodes={nodes} pointers={pointers} />
        ) : (
          <TreeCanvas root={bstRoot} width={800} height={400} />
        )}

        {/* Legend */}
        <div className="legend-strip">
          <div className="legend-item">
            <div className="legend-swatch" style={{ background: '#ffffff', border: '1px solid #94a3b8' }}></div>
            <span>Standard Node</span>
          </div>
          <div className="legend-item">
            <div className="legend-swatch" style={{ background: '#fef08a' }}></div>
            <span>Traversing / Inspecting</span>
          </div>
          <div className="legend-item">
            <div className="legend-swatch" style={{ background: '#ecfdf5', border: '1px solid #059669' }}></div>
            <span>Found / Target Match</span>
          </div>
          <div className="legend-item">
            <div className="legend-swatch" style={{ background: '#fef2f2', border: '1px solid #dc2626' }}></div>
            <span>Deleting Target</span>
          </div>
        </div>
      </div>
    </div>
  );
}
