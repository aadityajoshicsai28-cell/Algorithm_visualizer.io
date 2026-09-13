import React, { useCallback, useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useEngine } from '../engine/useEngine';
import ControlBar from '../components/ControlBar';
import ComplexityTable from '../components/ComplexityTable';
import StatusLine from '../components/StatusLine';
import CategorySidebar from '../components/CategorySidebar';
import GraphCanvas from '../renderers/GraphCanvas';
import { fetchAlgorithmById } from '../services/metadataService';
import { generateRandomGraph, recalculateEdgeWeights, runConnectedComponents, runDijkstraGraph, runWeaklyConnected } from '../algorithms/graphAlgorithms';

const GRAPH_ALGORITHMS = [
  { id: 'graph-dijkstra', name: 'Dijkstra (Weighted)', fn: runDijkstraGraph, directed: false },
  { id: 'graph-connected-components', name: 'Connected Components', fn: runConnectedComponents, directed: false },
  { id: 'graph-weakly-connected', name: 'Weakly Connected', fn: runWeaklyConnected, directed: true },
];
export default function GraphAlgorithmsPage() {
  const [selectedAlgoId, setSelectedAlgoId] = useState('graph-dijkstra'); const [nodeCount, setNodeCount] = useState(6); const [metadata, setMetadata] = useState(null); const [activeEdge, setActiveEdge] = useState(null);
  const current = GRAPH_ALGORITHMS.find(a => a.id === selectedAlgoId) || GRAPH_ALGORITHMS[0]; const [graphData, setGraphData] = useState(() => generateRandomGraph(6, .45, false));
  const { running, paused, delay, statusText, setStatusText, play, pause, step, setSpeed, reset, startRun } = useEngine(150);
  const regenerate = useCallback((count = nodeCount) => { reset(); setActiveEdge(null); setGraphData(generateRandomGraph(count, .45, current.directed)); setStatusText(`Generated a ${count}-vertex graph. Drag a node to update its edge weights.`); }, [nodeCount, current, reset, setStatusText]);
  useEffect(() => { fetchAlgorithmById(selectedAlgoId).then(setMetadata); regenerate(nodeCount); }, [selectedAlgoId]);
  const onStep = (data) => { if (data.nodes && data.edges) setGraphData({ nodes: data.nodes, edges: data.edges }); if (data.activeEdge !== undefined) setActiveEdge(data.activeEdge); if (data.status) setStatusText(data.status); };
  const runWithGraph = useCallback((data) => { const input = { nodes: data.nodes.map(n => ({ ...n, status: 'default', dist: Infinity, color: null })), edges: data.edges.map(e => ({ ...e, status: 'default' })) }; setGraphData(input); setActiveEdge(null); startRun(async wait => { if (selectedAlgoId === 'graph-dijkstra') await runDijkstraGraph(input.nodes, input.edges, input.nodes[0].id, wait, onStep); else await current.fn(input.nodes, input.edges, wait, onStep); }); }, [selectedAlgoId, current, startRun]);
  const handleStart = useCallback(() => runWithGraph(graphData), [graphData, runWithGraph]);
  const handleNodeMove = (id, x, y, finished) => { if (running) reset(); setGraphData(previous => { const nodes = previous.nodes.map(node => node.id === id ? { ...node, x, y } : node); const updated = { nodes, edges: recalculateEdgeWeights(nodes, previous.edges).map(edge => ({ ...edge, status: 'default' })) }; if (finished) { setStatusText(`Node ${id} moved. Re-running ${current.name} with recalculated edge weights.`); setTimeout(() => runWithGraph(updated), 0); } return updated; }); };
  return <div className="page-shell"><div className="page-header"><div className="page-header-top"><div><h1 className="page-title">Graph Algorithms</h1><p className="page-desc">Drag nodes to reposition the graph. Connected edges redraw live and their Euclidean weights update automatically.</p></div></div><CategorySidebar algorithms={GRAPH_ALGORITHMS} selectedId={selectedAlgoId} onSelect={id => { if (running) reset(); setSelectedAlgoId(id); }} /><ComplexityTable complexity={metadata?.complexity} name={metadata?.name || 'Graph Algorithm'} /></div>
    <ControlBar running={running} paused={paused} delay={delay} onPlay={() => !running ? handleStart() : paused ? play() : pause()} onPause={pause} onStep={() => { if (!running) { handleStart(); setTimeout(() => pause(), 0); } else step(); }} onReset={() => regenerate(nodeCount)} onSpeedChange={setSpeed} extraControls={<><div className="slider-group"><span>Nodes: {nodeCount}</span><input type="range" min="4" max="8" value={nodeCount} disabled={running} onChange={e => { const count = Number(e.target.value); setNodeCount(count); regenerate(count); }} /></div><button className="btn btn-secondary" onClick={() => regenerate(nodeCount)} disabled={running}><RefreshCw size={14} /><span>Regenerate</span></button></>} />
    <StatusLine text={statusText} running={running && !paused} /><div className="stage-card"><GraphCanvas nodes={graphData.nodes} edges={graphData.edges} isDirected={current.directed} activeEdge={activeEdge} width={800} height={420} onNodeMove={handleNodeMove} /></div>
  </div>;
}
