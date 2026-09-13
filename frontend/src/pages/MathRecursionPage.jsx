import React, { useEffect, useState } from 'react';
import { useEngine } from '../engine/useEngine';
import ControlBar from '../components/ControlBar';
import ComplexityTable from '../components/ComplexityTable';
import StatusLine from '../components/StatusLine';
import CategorySidebar from '../components/CategorySidebar';
import BarChart from '../renderers/BarChart';
import TreeCanvas from '../renderers/TreeCanvas';
import TableView from '../renderers/TableView';
import { fetchAlgorithmById } from '../services/metadataService';
import { runBinarySearch, runLinearSearch, runFibonacciTree, runTuringMachine } from '../algorithms/mathRecursion';

const MATH_ALGORITHMS = [
  { id: 'binary-search', name: 'Binary Search', renderer: 'bars' },
  { id: 'linear-search', name: 'Linear Search', renderer: 'bars' },
  { id: 'fibonacci-tree', name: 'Fibonacci Recursion Tree', renderer: 'tree' },
  { id: 'turing-machine', name: 'Turing Machine', renderer: 'tape' },
];
const SEARCH_DATA = { items: [5, 12, 18, 23, 31, 44, 56, 67, 72, 85, 93], target: 56 };

export default function MathRecursionPage() {
  const [selectedAlgoId, setSelectedAlgoId] = useState('binary-search');
  const [metadata, setMetadata] = useState(null);
  const [searchData, setSearchData] = useState({ ...SEARCH_DATA, comparingIndices: [], sortedIndices: [], pointerIndices: {} });
  const [fibTree, setFibTree] = useState(null);
  const [tapeData, setTapeData] = useState({ tape: ['B', '1', '0', '1', '1', 'B'], headIndex: 1, machineState: 'q_seek_end' });
  const current = MATH_ALGORITHMS.find(a => a.id === selectedAlgoId) || MATH_ALGORITHMS[0];
  const { running, paused, delay, statusText, setStatusText, play, pause, step, setSpeed, reset, startRun } = useEngine(80);

  const resetView = (id = selectedAlgoId) => {
    reset(); setSearchData({ ...SEARCH_DATA, comparingIndices: [], sortedIndices: [], pointerIndices: {} });
    if (id === 'fibonacci-tree') setFibTree(null);
    if (id === 'turing-machine') setTapeData({ tape: ['B', '1', '0', '1', '1', 'B'], headIndex: 1, machineState: 'q_seek_end' });
  };
  useEffect(() => { fetchAlgorithmById(selectedAlgoId).then(setMetadata); resetView(selectedAlgoId); setStatusText(`Selected ${current.name}. Press Play or Step to run the visualizer.`); }, [selectedAlgoId]);
  const handleStart = () => {
    resetView();
    startRun(async (wait) => {
      const searchStep = (state) => { setSearchData(prev => ({ ...prev, comparingIndices: state.comparingIndices || [], sortedIndices: state.sortedIndices || [], pointerIndices: state.pointerIndices || {} })); if (state.status) setStatusText(state.status); };
      if (selectedAlgoId === 'binary-search') await runBinarySearch(SEARCH_DATA.items, SEARCH_DATA.target, wait, searchStep);
      else if (selectedAlgoId === 'linear-search') await runLinearSearch(SEARCH_DATA.items, SEARCH_DATA.target, wait, searchStep);
      else if (selectedAlgoId === 'fibonacci-tree') await runFibonacciTree(4, wait, state => { setFibTree(state.tree); setStatusText(state.status); });
      else await runTuringMachine(wait, state => { setTapeData({ tape: state.tape, headIndex: state.headIndex, machineState: state.state }); setStatusText(state.status); });
    });
  };
  return <div className="page-shell">
    <div className="page-header"><div className="page-header-top"><div><h1 className="page-title">Math & Recursion Visualizers</h1><p className="page-desc">Explore binary and linear search, Fibonacci recursion trees, and a step-by-step Turing machine.</p></div></div>
      <CategorySidebar algorithms={MATH_ALGORITHMS} selectedId={selectedAlgoId} onSelect={id => { if (running) reset(); setSelectedAlgoId(id); }} />
      <ComplexityTable complexity={metadata?.complexity} name={metadata?.name || 'Math & Recursion'} />
    </div>
    <ControlBar running={running} paused={paused} delay={delay} onPlay={() => !running ? handleStart() : paused ? play() : pause()} onPause={pause} onStep={() => { if (!running) { handleStart(); setTimeout(() => pause(), 0); } else step(); }} onReset={() => resetView()} onSpeedChange={setSpeed} />
    <StatusLine text={statusText} running={running && !paused} />
    <div className="stage-card" style={{ alignItems: 'center' }}>
      {current.renderer === 'bars' && <BarChart items={searchData.items} comparingIndices={searchData.comparingIndices} sortedIndices={searchData.sortedIndices} pointerIndices={searchData.pointerIndices} />}
      {current.renderer === 'tree' && <TreeCanvas root={fibTree} width={820} height={420} />}
      {current.renderer === 'tape' && <TableView type="tape" tape={tapeData.tape} headIndex={tapeData.headIndex} machineState={tapeData.machineState} />}
    </div>
  </div>;
}
