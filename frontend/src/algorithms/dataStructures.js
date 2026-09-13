// Pure Data Structure routines: Singly Linked List & BST

// Helper to clone a linked list array
function cloneNodes(nodes) {
  return nodes.map(n => ({ ...n }));
}

// ---------------- SINGLY LINKED LIST ----------------

export async function insertHeadList(nodes, value, wait, onStep) {
  const list = cloneNodes(nodes);
  const newNode = {
    id: `node-${Date.now()}`,
    value: Number(value),
    status: 'visiting',
    highlight: true,
  };

  onStep({
    nodes: [newNode, ...list],
    pointers: [{ name: 'NEW', index: 0, color: 'var(--color-primary)' }],
    status: `Allocated new node with value ${value} pointing to old HEAD`,
  });
  await wait();

  newNode.status = 'default';
  newNode.highlight = false;

  const result = [newNode, ...list];
  onStep({
    nodes: result,
    pointers: [
      { name: 'HEAD', index: 0, color: 'var(--color-primary)' },
      { name: 'TAIL', index: result.length - 1, color: 'var(--color-warning)' }
    ],
    status: `Node ${value} successfully inserted at HEAD.`,
  });
  return result;
}

export async function insertTailList(nodes, value, wait, onStep) {
  const list = cloneNodes(nodes);
  const newNode = {
    id: `node-${Date.now()}`,
    value: Number(value),
    status: 'visiting',
    highlight: true,
  };

  if (list.length === 0) {
    onStep({
      nodes: [newNode],
      pointers: [{ name: 'HEAD/TAIL', index: 0, color: 'var(--color-primary)' }],
      status: `List was empty. Node ${value} is now both HEAD and TAIL.`,
    });
    await wait();
    newNode.status = 'default';
    newNode.highlight = false;
    return [newNode];
  }

  // Traverse to tail
  for (let i = 0; i < list.length; i++) {
    list[i].status = 'visiting';
    onStep({
      nodes: [...list, newNode],
      pointers: [
        { name: 'HEAD', index: 0, color: 'var(--color-primary)' },
        { name: 'CURR', index: i, color: 'var(--color-warning)' },
        { name: 'NEW', index: list.length, color: 'var(--color-purple)' },
      ],
      status: `Traversing list to locate TAIL: currently inspecting index ${i} (${list[i].value})`,
    });
    await wait();
    list[i].status = 'default';
  }

  newNode.status = 'default';
  newNode.highlight = false;
  const result = [...list, newNode];

  onStep({
    nodes: result,
    pointers: [
      { name: 'HEAD', index: 0, color: 'var(--color-primary)' },
      { name: 'TAIL', index: result.length - 1, color: 'var(--color-warning)' },
    ],
    status: `Old TAIL next pointer updated to new node ${value}.`,
  });
  return result;
}

export async function searchList(nodes, target, wait, onStep) {
  const list = cloneNodes(nodes);
  target = Number(target);

  for (let i = 0; i < list.length; i++) {
    list[i].status = 'visiting';
    onStep({
      nodes: cloneNodes(list),
      pointers: [
        { name: 'CURR', index: i, color: 'var(--color-warning)' }
      ],
      status: `Inspecting node at index ${i} (value: ${list[i].value}), comparing against target ${target}`,
    });
    await wait();

    if (list[i].value === target) {
      list[i].status = 'found';
      onStep({
        nodes: cloneNodes(list),
        pointers: [
          { name: 'FOUND', index: i, color: 'var(--color-success)' }
        ],
        status: `Found target ${target} at index ${i}!`,
      });
      return;
    }
    list[i].status = 'default';
  }

  onStep({
    nodes: cloneNodes(list),
    pointers: [],
    status: `Target ${target} was not found in the linked list.`,
  });
}

export async function deleteList(nodes, target, wait, onStep) {
  const list = cloneNodes(nodes);
  target = Number(target);
  let deleteIdx = -1;

  for (let i = 0; i < list.length; i++) {
    list[i].status = 'visiting';
    onStep({
      nodes: cloneNodes(list),
      pointers: [{ name: 'CURR', index: i, color: 'var(--color-warning)' }],
      status: `Searching for element ${target} to delete: inspecting index ${i} (${list[i].value})`,
    });
    await wait();

    if (list[i].value === target) {
      deleteIdx = i;
      list[i].status = 'deleting';
      onStep({
        nodes: cloneNodes(list),
        pointers: [{ name: 'DELETE', index: i, color: 'var(--color-danger)' }],
        status: `Located node with value ${target} at index ${i}. Bypassing pointer...`,
      });
      await wait();
      break;
    }
    list[i].status = 'default';
  }

  if (deleteIdx === -1) {
    onStep({
      nodes: cloneNodes(list),
      status: `Value ${target} not found. No nodes removed.`,
    });
    return nodes;
  }

  const result = list.filter((_, idx) => idx !== deleteIdx);
  onStep({
    nodes: result,
    pointers: result.length > 0 ? [
      { name: 'HEAD', index: 0, color: 'var(--color-primary)' },
      { name: 'TAIL', index: result.length - 1, color: 'var(--color-warning)' }
    ] : [],
    status: `Node ${target} unlinked and deallocated successfully.`,
  });
  return result;
}

export async function reverseList(nodes, wait, onStep) {
  const list = cloneNodes(nodes);
  if (list.length <= 1) return list;

  const reversed = [];
  onStep({
    nodes: cloneNodes(list),
    status: 'Starting in-place iterative linked list reversal with prev, curr, and next pointers.',
  });
  await wait();

  for (let i = 0; i < list.length; i++) {
    const item = { ...list[i], status: 'visiting' };
    reversed.unshift(item);

    onStep({
      nodes: [...reversed, ...list.slice(i + 1)],
      pointers: [
        { name: 'REVERSED', index: 0, color: 'var(--color-success)' },
        { name: 'ORIGINAL', index: i + 1 < list.length ? i + 1 : list.length - 1, color: 'var(--color-primary)' }
      ],
      status: `Reversed pointer for node ${list[i].value} (step ${i + 1} of ${list.length})`,
    });
    await wait();
    item.status = 'default';
  }

  onStep({
    nodes: reversed,
    pointers: [
      { name: 'HEAD', index: 0, color: 'var(--color-primary)' },
      { name: 'TAIL', index: reversed.length - 1, color: 'var(--color-warning)' }
    ],
    status: 'Linked list successfully reversed!',
  });
  return reversed;
}

// ---------------- BINARY SEARCH TREE (BST) ----------------

function cloneTree(node) {
  if (!node) return null;
  return {
    id: node.id,
    value: node.value,
    label: node.label,
    status: node.status || 'default',
    highlight: node.highlight || false,
    left: cloneTree(node.left),
    right: cloneTree(node.right),
  };
}

export async function insertBST(root, val, wait, onStep) {
  val = Number(val);
  const currentRoot = cloneTree(root);

  if (!currentRoot) {
    const newNode = { id: `bst-${val}-${Date.now()}`, value: val, status: 'found', left: null, right: null };
    onStep({
      tree: newNode,
      status: `Inserted ${val} as tree root.`,
    });
    await wait();
    newNode.status = 'default';
    return newNode;
  }

  let curr = currentRoot;
  while (curr) {
    curr.status = 'visiting';
    onStep({
      tree: cloneTree(currentRoot),
      status: `Comparing incoming value ${val} with current node ${curr.value}`,
    });
    await wait();
    curr.status = 'default';

    if (val < curr.value) {
      if (!curr.left) {
        curr.left = { id: `bst-${val}-${Date.now()}`, value: val, status: 'found', left: null, right: null };
        onStep({
          tree: cloneTree(currentRoot),
          status: `${val} < ${curr.value}: Inserted ${val} as left child of ${curr.value}.`,
        });
        await wait();
        curr.left.status = 'default';
        break;
      }
      curr = curr.left;
    } else if (val > curr.value) {
      if (!curr.right) {
        curr.right = { id: `bst-${val}-${Date.now()}`, value: val, status: 'found', left: null, right: null };
        onStep({
          tree: cloneTree(currentRoot),
          status: `${val} > ${curr.value}: Inserted ${val} as right child of ${curr.value}.`,
        });
        await wait();
        curr.right.status = 'default';
        break;
      }
      curr = curr.right;
    } else {
      onStep({
        tree: cloneTree(currentRoot),
        status: `Value ${val} already exists in the BST. Duplicate ignored.`,
      });
      break;
    }
  }

  return currentRoot;
}

export async function searchBST(root, val, wait, onStep) {
  val = Number(val);
  const currentRoot = cloneTree(root);
  let curr = currentRoot;

  while (curr) {
    curr.status = 'visiting';
    onStep({
      tree: cloneTree(currentRoot),
      status: `Comparing search target ${val} with node ${curr.value}`,
    });
    await wait();

    if (val === curr.value) {
      curr.status = 'found';
      onStep({
        tree: cloneTree(currentRoot),
        status: `Found target key ${val} in the BST!`,
      });
      return;
    }

    curr.status = 'default';
    if (val < curr.value) {
      curr = curr.left;
    } else {
      curr = curr.right;
    }
  }

  onStep({
    tree: cloneTree(currentRoot),
    status: `Target value ${val} does not exist in the BST.`,
  });
}

export async function deleteBST(root, val, wait, onStep) {
  val = Number(val);
  let currentRoot = cloneTree(root);

  async function removeNode(node, v) {
    if (!node) return null;

    node.status = 'visiting';
    onStep({
      tree: cloneTree(currentRoot),
      status: `Navigating to node ${v}: currently at ${node.value}`,
    });
    await wait();
    node.status = 'default';

    if (v < node.value) {
      node.left = await removeNode(node.left, v);
      return node;
    } else if (v > node.value) {
      node.right = await removeNode(node.right, v);
      return node;
    } else {
      // Node found
      node.status = 'deleting';
      onStep({
        tree: cloneTree(currentRoot),
        status: `Found target ${v} to delete. Evaluating children configuration...`,
      });
      await wait();

      // Case 1: No children
      if (!node.left && !node.right) return null;

      // Case 2: One child
      if (!node.left) return node.right;
      if (!node.right) return node.left;

      // Case 3: Two children -> find in-order successor
      let succParent = node;
      let succ = node.right;
      while (succ.left) {
        succParent = succ;
        succ = succ.left;
      }

      node.value = succ.value;
      node.label = String(succ.value);
      node.status = 'found';

      onStep({
        tree: cloneTree(currentRoot),
        status: `Replaced deleted node with in-order successor ${succ.value}`,
      });
      await wait();
      node.status = 'default';

      if (succParent !== node) {
        succParent.left = succ.right;
      } else {
        succParent.right = succ.right;
      }
      return node;
    }
  }

  currentRoot = await removeNode(currentRoot, val);

  onStep({
    tree: cloneTree(currentRoot),
    status: `BST deletion of ${val} complete with re-layout.`,
  });
  return currentRoot;
}
