export async function runBinarySearch(arr, target, wait, onStep) {
  const items = [...arr].sort((a, b) => a - b); let low = 0; let high = items.length - 1;
  while (low <= high) { const mid = Math.floor((low + high) / 2); onStep({ items, comparingIndices: [mid], pointerIndices: { L: low, M: mid, H: high }, status: `Checking midpoint ${mid}: ${items[mid]}` }); await wait(); if (items[mid] === target) { onStep({ items, sortedIndices: [mid], pointerIndices: { FOUND: mid }, status: `Found ${target} at index ${mid}.` }); return mid; } if (items[mid] < target) low = mid + 1; else high = mid - 1; }
  onStep({ items, comparingIndices: [], pointerIndices: {}, status: `${target} is not present.` }); return -1;
}
export async function runLinearSearch(items, target, wait, onStep) {
  for (let index = 0; index < items.length; index++) { onStep({ items: [...items], comparingIndices: [index], pointerIndices: { I: index }, status: `Comparing index ${index}: ${items[index]} with target ${target}` }); await wait(); if (items[index] === target) { onStep({ items: [...items], sortedIndices: [index], pointerIndices: { FOUND: index }, status: `Found ${target} at index ${index}.` }); return index; } }
  onStep({ items: [...items], comparingIndices: [], pointerIndices: {}, status: `${target} is not present.` }); return -1;
}
export async function runFibonacciTree(n = 4, wait, onStep) {
  let id = 0; async function build(value) { const node = { id: `fib-${++id}`, label: `F(${value})`, status: 'active', left: null, right: null }; onStep({ tree: node, status: `Calling Fib(${value})` }); await wait(); if (value <= 1) { node.label = `F(${value})=${value}`; node.status = 'found'; return { node, value }; } const left = await build(value - 1); node.left = left.node; const right = await build(value - 2); node.right = right.node; node.label = `F(${value})=${left.value + right.value}`; node.status = 'found'; onStep({ tree: node, status: `Resolved ${node.label}` }); await wait(); return { node, value: left.value + right.value }; }
  const result = await build(n); onStep({ tree: result.node, status: `Fibonacci recursion tree complete: Fib(${n}) = ${result.value}.` });
}
export async function runTuringMachine(wait, onStep) {
  const tape = ['B', '1', '0', '1', '1', 'B']; let headIndex = 1; let state = 'q_seek_end'; while (tape[headIndex] !== 'B') { onStep({ tape: [...tape], headIndex, state, status: 'Scanning right.' }); await wait(); headIndex++; } headIndex--; state = 'q_add_carry'; while (state === 'q_add_carry') { if (tape[headIndex] === '1') tape[headIndex--] = '0'; else { tape[headIndex] = '1'; state = 'q_halt'; } onStep({ tape: [...tape], headIndex, state, status: state === 'q_halt' ? 'Carry resolved.' : 'Writing 0 and carrying left.' }); await wait(); } onStep({ tape: [...tape], headIndex, state, status: 'Turing machine halted.' });
}
