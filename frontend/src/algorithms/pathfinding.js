// Bidirectional pathfinding algorithms for the grid visualizer.
export function createInitialGrid(numRows = 16, numCols = 32) {
  return Array.from({ length: numRows }, (_, r) => Array.from({ length: numCols }, (_, c) => ({ r, c, isStart: r === Math.floor(numRows / 2) && c === 4, isTarget: r === Math.floor(numRows / 2) && c === numCols - 5, isWall: false, isVisited: false, isVisiting: false, isPath: false, searchSide: null, previous: null })));
}
// A UI helper, not an algorithm entry: keeps endpoints open while creating obstacle walls.
export function generateRandomMaze(inputGrid, wallChance = 0.28) {
  return inputGrid.map(row => row.map(cell => ({
    ...cell,
    isWall: !cell.isStart && !cell.isTarget && Math.random() < wallChance,
    isVisited: false,
    isVisiting: false,
    isPath: false,
    searchSide: null,
    previous: null,
  })));
}
const cloneGrid = (grid) => grid.map(row => row.map(cell => ({ ...cell })));
const key = (node) => `${node.r},${node.c}`;
const neighbors = (grid, node) => [[-1, 0], [1, 0], [0, -1], [0, 1]].map(([dr, dc]) => grid[node.r + dr]?.[node.c + dc]).filter(Boolean);
async function animateJoinedPath(grid, meet, fromStart, fromTarget, wait, onStep, visitedCount) {
  const first = []; for (let curr = meet; curr; curr = fromStart.get(key(curr))) first.unshift(curr);
  const second = []; for (let curr = fromTarget.get(key(meet)); curr; curr = fromTarget.get(key(curr))) second.push(curr);
  const path = [...first, ...second];
  for (let index = 0; index < path.length; index++) { path[index].isPath = true; onStep({ grid: cloneGrid(grid), status: `Reconstructing path through collision point (${meet.r}, ${meet.c}): ${index + 1}/${path.length}`, stats: `Visited: ${visitedCount} | Path length: ${path.length - 1}` }); await wait(); }
  onStep({ grid: cloneGrid(grid), status: `Frontiers collided at (${meet.r}, ${meet.c}). Path complete.`, stats: `Visited: ${visitedCount} | Path length: ${path.length - 1}` });
}
async function bidirectionalSearch(inputGrid, wait, onStep, { mode, label }) {
  const grid = cloneGrid(inputGrid); let start; let target;
  grid.flat().forEach(cell => { Object.assign(cell, { isVisited: false, isVisiting: false, isPath: false, searchSide: null, previous: null }); if (cell.isStart) start = cell; if (cell.isTarget) target = cell; });
  if (!start || !target) return;
  const frontStart = [start]; const frontTarget = [target]; const seenStart = new Map([[key(start), null]]); const seenTarget = new Map([[key(target), null]]);
  start.searchSide = 'start'; target.searchSide = 'target'; let visitedCount = 0; let takeStart = true;
  while (frontStart.length && frontTarget.length) {
    const frontier = takeStart ? frontStart : frontTarget; const ownSeen = takeStart ? seenStart : seenTarget; const otherSeen = takeStart ? seenTarget : seenStart;
    const current = mode === 'dfs' ? frontier.pop() : frontier.shift(); if (!current) break; visitedCount++;
    if (!current.isStart && !current.isTarget) current.isVisiting = true;
    onStep({ grid: cloneGrid(grid), status: `${label}: ${takeStart ? 'start' : 'target'} frontier expands at (${current.r}, ${current.c})`, stats: `Visited: ${visitedCount}` }); await wait(); current.isVisiting = false; current.isVisited = true;
    for (const next of neighbors(grid, current)) { if (next.isWall || ownSeen.has(key(next))) continue; ownSeen.set(key(next), current); next.searchSide = takeStart ? (next.searchSide === 'target' ? 'collision' : 'start') : (next.searchSide === 'start' ? 'collision' : 'target'); frontier.push(next); if (otherSeen.has(key(next))) { next.searchSide = 'collision'; await animateJoinedPath(grid, next, seenStart, seenTarget, wait, onStep, visitedCount); return; } }
    takeStart = !takeStart;
  }
  onStep({ grid: cloneGrid(grid), status: `${label}: the two frontiers could not connect.`, stats: `Visited: ${visitedCount}` });
}
export const bfsPath = (grid, wait, onStep) => bidirectionalSearch(grid, wait, onStep, { mode: 'bfs', label: 'Bidirectional BFS' });
// On this unit-weight grid, bidirectional uniform-cost search is Dijkstra-equivalent and preserves shortest paths.
export const dijkstraPath = (grid, wait, onStep) => bidirectionalSearch(grid, wait, onStep, { mode: 'bfs', label: 'Bidirectional Dijkstra' });
// Two LIFO frontiers preserve DFS's valid-but-not-necessarily-shortest-path guarantee.
export const dfsPath = (grid, wait, onStep) => bidirectionalSearch(grid, wait, onStep, { mode: 'dfs', label: 'Bidirectional DFS' });
