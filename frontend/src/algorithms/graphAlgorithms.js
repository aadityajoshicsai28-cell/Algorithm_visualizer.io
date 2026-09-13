export function recalculateEdgeWeights(nodes, edges) {
  const byId = new Map(nodes.map(node => [node.id, node]));
  return edges.map(edge => { const u = byId.get(edge.u); const v = byId.get(edge.v); return !u || !v ? edge : { ...edge, weight: Math.max(1, Math.round(Math.hypot(u.x - v.x, u.y - v.y) / 40)) }; });
}
export function generateRandomGraph(numNodes = 6, edgeDensity = 0.45, isDirected = false) {
  const nodes = Array.from({ length: numNodes }, (_, i) => { const angle = (2 * Math.PI * i) / numNodes - Math.PI / 2; return { id: String.fromCharCode(65 + i), label: String.fromCharCode(65 + i), x: Math.round(400 + 170 * Math.cos(angle)), y: Math.round(230 + 170 * Math.sin(angle)), dist: Infinity, status: 'default', color: null }; });
  const edges = []; for (let i = 0; i < numNodes - 1; i++) edges.push({ u: nodes[i].id, v: nodes[i + 1].id, status: 'default' });
  for (let i = 0; i < numNodes; i++) for (let j = isDirected ? 0 : i + 1; j < numNodes; j++) if (i !== j && Math.random() < edgeDensity && !edges.some(e => (e.u === nodes[i].id && e.v === nodes[j].id) || (!isDirected && e.u === nodes[j].id && e.v === nodes[i].id))) edges.push({ u: nodes[i].id, v: nodes[j].id, status: 'default' });
  return { nodes, edges: recalculateEdgeWeights(nodes, edges) };
}
const clone = (nodes, edges) => ({ nodes: nodes.map(n => ({ ...n })), edges: edges.map(e => ({ ...e })) });
export async function runDijkstraGraph(rawNodes, rawEdges, startId, wait, onStep) {
  const { nodes, edges } = clone(rawNodes, rawEdges); const start = nodes.find(n => n.id === startId) || nodes[0]; start.dist = 0; const unvisited = new Set(nodes.map(n => n.id));
  while (unvisited.size) { let current; for (const node of nodes) if (unvisited.has(node.id) && (!current || node.dist < current.dist)) current = node; if (!current || current.dist === Infinity) break; unvisited.delete(current.id); current.status = 'current'; onStep({ nodes: [...nodes], edges: [...edges], status: `Visiting ${current.id}, tentative distance ${current.dist}` }); await wait();
    for (const edge of edges) { const neighborId = edge.u === current.id ? edge.v : edge.v === current.id ? edge.u : null; if (!neighborId || !unvisited.has(neighborId)) continue; const neighbor = nodes.find(n => n.id === neighborId); edge.status = 'traversing'; onStep({ nodes: [...nodes], edges: [...edges], activeEdge: edge, status: `Relaxing ${current.id}–${neighborId} (w=${edge.weight})` }); await wait(); if (current.dist + edge.weight < neighbor.dist) neighbor.dist = current.dist + edge.weight; edge.status = 'default'; }
    current.status = 'settled'; }
  onStep({ nodes: [...nodes], edges: [...edges], status: 'Dijkstra complete with updated positional edge weights.' });
}
export async function runConnectedComponents(rawNodes, rawEdges, wait, onStep) {
  const { nodes, edges } = clone(rawNodes, rawEdges); const seen = new Set(); const colors = ['#2563eb', '#10b981', '#f59e0b', '#ec4899']; let count = 0;
  for (const node of nodes) { if (seen.has(node.id)) continue; const queue = [node.id]; seen.add(node.id); const color = colors[count++ % colors.length]; while (queue.length) { const id = queue.shift(); const current = nodes.find(n => n.id === id); current.color = color; onStep({ nodes: [...nodes], edges: [...edges], status: `Component ${count}: visiting ${id}` }); await wait(); edges.forEach(e => { const next = e.u === id ? e.v : e.v === id ? e.u : null; if (next && !seen.has(next)) { seen.add(next); queue.push(next); } }); } }
  onStep({ nodes: [...nodes], edges: [...edges], status: `Found ${count} connected component(s).` });
}
export async function runWeaklyConnected(nodes, edges, wait, onStep) { return runConnectedComponents(nodes, edges, wait, onStep); }
