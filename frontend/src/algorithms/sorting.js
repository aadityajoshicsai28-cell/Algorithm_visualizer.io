// Pure sorting algorithm routines with visual step yielding

export async function bubbleSort(arr, wait, onStep) {
  const n = arr.length;
  const a = [...arr];
  const sortedIndices = [];

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      onStep({
        items: [...a],
        comparingIndices: [j, j + 1],
        swappedIndices: [],
        sortedIndices: [...sortedIndices],
        status: `Comparing elements at index ${j} (${a[j]}) and ${j + 1} (${a[j + 1]})`,
      });
      await wait();

      if (a[j] > a[j + 1]) {
        const temp = a[j];
        a[j] = a[j + 1];
        a[j + 1] = temp;
        swapped = true;

        onStep({
          items: [...a],
          comparingIndices: [],
          swappedIndices: [j, j + 1],
          sortedIndices: [...sortedIndices],
          status: `Swapped: ${a[j + 1]} > ${a[j]}, placed ${a[j]} at index ${j}`,
        });
        await wait();
      }
    }
    sortedIndices.push(n - 1 - i);
    if (!swapped) break;
  }

  // All remaining are sorted
  for (let i = 0; i < n; i++) {
    if (!sortedIndices.includes(i)) sortedIndices.push(i);
  }

  onStep({
    items: [...a],
    comparingIndices: [],
    swappedIndices: [],
    sortedIndices: [...sortedIndices],
    status: 'Bubble Sort Complete! Entire array is sorted in ascending order.',
  });
}

export async function selectionSort(arr, wait, onStep) {
  const n = arr.length;
  const a = [...arr];
  const sortedIndices = [];

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    onStep({
      items: [...a],
      comparingIndices: [i],
      swappedIndices: [],
      sortedIndices: [...sortedIndices],
      pivotIndex: minIdx,
      status: `Searching for minimum element in unsorted subarray [${i}..${n - 1}], starting with minimum at index ${minIdx} (${a[minIdx]})`,
    });
    await wait();

    for (let j = i + 1; j < n; j++) {
      onStep({
        items: [...a],
        comparingIndices: [minIdx, j],
        swappedIndices: [],
        sortedIndices: [...sortedIndices],
        pivotIndex: minIdx,
        status: `Comparing index ${j} (${a[j]}) with current minimum at index ${minIdx} (${a[minIdx]})`,
      });
      await wait();

      if (a[j] < a[minIdx]) {
        minIdx = j;
        onStep({
          items: [...a],
          comparingIndices: [minIdx],
          swappedIndices: [],
          sortedIndices: [...sortedIndices],
          pivotIndex: minIdx,
          status: `New minimum found at index ${minIdx} (${a[minIdx]})`,
        });
        await wait();
      }
    }

    if (minIdx !== i) {
      const temp = a[i];
      a[i] = a[minIdx];
      a[minIdx] = temp;

      onStep({
        items: [...a],
        comparingIndices: [],
        swappedIndices: [i, minIdx],
        sortedIndices: [...sortedIndices],
        status: `Swapped minimum element ${a[i]} to its sorted position at index ${i}`,
      });
      await wait();
    }
    sortedIndices.push(i);
  }
  sortedIndices.push(n - 1);

  onStep({
    items: [...a],
    comparingIndices: [],
    swappedIndices: [],
    sortedIndices: [...sortedIndices],
    pivotIndex: -1,
    status: 'Selection Sort Complete! Array is sorted.',
  });
}

export async function insertionSort(arr, wait, onStep) {
  const n = arr.length;
  const a = [...arr];
  const sortedIndices = [0];

  for (let i = 1; i < n; i++) {
    const key = a[i];
    let j = i - 1;

    onStep({
      items: [...a],
      comparingIndices: [i],
      swappedIndices: [],
      sortedIndices: [...sortedIndices],
      pivotIndex: i,
      status: `Extracting key element ${key} at index ${i} to insert into sorted prefix`,
    });
    await wait();

    while (j >= 0 && a[j] > key) {
      onStep({
        items: [...a],
        comparingIndices: [j, j + 1],
        swappedIndices: [],
        sortedIndices: [...sortedIndices],
        pivotIndex: j + 1,
        status: `${a[j]} > ${key}: Shifting element ${a[j]} right to index ${j + 1}`,
      });
      await wait();

      a[j + 1] = a[j];
      j--;
      onStep({
        items: [...a],
        comparingIndices: [],
        swappedIndices: [j + 1],
        sortedIndices: [...sortedIndices],
        status: `Shift completed. Checking preceding element.`,
      });
      await wait();
    }

    a[j + 1] = key;
    sortedIndices.push(i);

    onStep({
      items: [...a],
      comparingIndices: [],
      swappedIndices: [j + 1],
      sortedIndices: [...sortedIndices],
      pivotIndex: -1,
      status: `Inserted key ${key} at position ${j + 1}`,
    });
    await wait();
  }

  onStep({
    items: [...a],
    comparingIndices: [],
    swappedIndices: [],
    sortedIndices: Array.from({ length: n }, (_, i) => i),
    pivotIndex: -1,
    status: 'Insertion Sort Complete! Array is sorted.',
  });
}

export async function mergeSort(arr, wait, onStep) {
  const a = [...arr];
  const n = a.length;

  async function merge(left, mid, right) {
    const leftArr = a.slice(left, mid + 1);
    const rightArr = a.slice(mid + 1, right + 1);
    let i = 0;
    let j = 0;
    let k = left;

    while (i < leftArr.length && j < rightArr.length) {
      onStep({
        items: [...a],
        comparingIndices: [left + i, mid + 1 + j],
        swappedIndices: [],
        sortedIndices: [],
        status: `Merging: Comparing ${leftArr[i]} and ${rightArr[j]}`,
      });
      await wait();

      if (leftArr[i] <= rightArr[j]) {
        a[k] = leftArr[i];
        i++;
      } else {
        a[k] = rightArr[j];
        j++;
      }

      onStep({
        items: [...a],
        comparingIndices: [],
        swappedIndices: [k],
        sortedIndices: [],
        status: `Placed ${a[k]} at index ${k}`,
      });
      await wait();
      k++;
    }

    while (i < leftArr.length) {
      a[k] = leftArr[i];
      onStep({
        items: [...a],
        comparingIndices: [],
        swappedIndices: [k],
        sortedIndices: [],
        status: `Placed remaining left element ${a[k]} at index ${k}`,
      });
      await wait();
      i++;
      k++;
    }

    while (j < rightArr.length) {
      a[k] = rightArr[j];
      onStep({
        items: [...a],
        comparingIndices: [],
        swappedIndices: [k],
        sortedIndices: [],
        status: `Placed remaining right element ${a[k]} at index ${k}`,
      });
      await wait();
      j++;
      k++;
    }
  }

  async function divideAndSort(left, right) {
    if (left >= right) return;
    const mid = Math.floor((left + right) / 2);

    onStep({
      items: [...a],
      comparingIndices: [left, right],
      swappedIndices: [],
      sortedIndices: [],
      pivotIndex: mid,
      status: `Dividing subarray [${left}..${right}] at midpoint ${mid}`,
    });
    await wait();

    await divideAndSort(left, mid);
    await divideAndSort(mid + 1, right);
    await merge(left, mid, right);
  }

  await divideAndSort(0, n - 1);

  onStep({
    items: [...a],
    comparingIndices: [],
    swappedIndices: [],
    sortedIndices: Array.from({ length: n }, (_, i) => i),
    pivotIndex: -1,
    status: 'Merge Sort Complete! All subarrays combined in sorted order.',
  });
}

export async function quickSort(arr, wait, onStep) {
  const a = [...arr];
  const n = a.length;
  const sortedIndices = [];

  async function partition(low, high) {
    const pivot = a[high];
    let i = low - 1;

    onStep({
      items: [...a],
      comparingIndices: [],
      swappedIndices: [],
      sortedIndices: [...sortedIndices],
      pivotIndex: high,
      status: `Selected pivot ${pivot} at index ${high}`,
    });
    await wait();

    for (let j = low; j < high; j++) {
      onStep({
        items: [...a],
        comparingIndices: [j, high],
        swappedIndices: [],
        sortedIndices: [...sortedIndices],
        pivotIndex: high,
        status: `Comparing element ${a[j]} at index ${j} with pivot ${pivot}`,
      });
      await wait();

      if (a[j] < pivot) {
        i++;
        const temp = a[i];
        a[i] = a[j];
        a[j] = temp;

        onStep({
          items: [...a],
          comparingIndices: [],
          swappedIndices: [i, j],
          sortedIndices: [...sortedIndices],
          pivotIndex: high,
          status: `${a[i]} < ${pivot}: Swapped index ${i} and index ${j}`,
        });
        await wait();
      }
    }

    const temp = a[i + 1];
    a[i + 1] = a[high];
    a[high] = temp;

    sortedIndices.push(i + 1);
    onStep({
      items: [...a],
      comparingIndices: [],
      swappedIndices: [i + 1, high],
      sortedIndices: [...sortedIndices],
      pivotIndex: i + 1,
      status: `Pivot ${pivot} placed into its final sorted position at index ${i + 1}`,
    });
    await wait();

    return i + 1;
  }

  async function sort(low, high) {
    if (low < high) {
      const pi = await partition(low, high);
      await sort(low, pi - 1);
      await sort(pi + 1, high);
    } else if (low === high) {
      sortedIndices.push(low);
    }
  }

  await sort(0, n - 1);

  onStep({
    items: [...a],
    comparingIndices: [],
    swappedIndices: [],
    sortedIndices: Array.from({ length: n }, (_, i) => i),
    pivotIndex: -1,
    status: 'Quick Sort Complete! Array is partitioned and sorted.',
  });
}

export async function heapSort(arr, wait, onStep) {
  const a = [...arr];
  const n = a.length;
  const sortedIndices = [];

  async function heapify(size, rootIdx) {
    let largest = rootIdx;
    const left = 2 * rootIdx + 1;
    const right = 2 * rootIdx + 2;

    onStep({
      items: [...a],
      comparingIndices: [rootIdx],
      swappedIndices: [],
      sortedIndices: [...sortedIndices],
      pivotIndex: rootIdx,
      status: `Heapifying subtree rooted at index ${rootIdx}`,
    });
    await wait();

    if (left < size) {
      onStep({
        items: [...a],
        comparingIndices: [largest, left],
        swappedIndices: [],
        sortedIndices: [...sortedIndices],
        status: `Checking left child ${a[left]} against current largest ${a[largest]}`,
      });
      await wait();
      if (a[left] > a[largest]) {
        largest = left;
      }
    }

    if (right < size) {
      onStep({
        items: [...a],
        comparingIndices: [largest, right],
        swappedIndices: [],
        sortedIndices: [...sortedIndices],
        status: `Checking right child ${a[right]} against current largest ${a[largest]}`,
      });
      await wait();
      if (a[right] > a[largest]) {
        largest = right;
      }
    }

    if (largest !== rootIdx) {
      const temp = a[rootIdx];
      a[rootIdx] = a[largest];
      a[largest] = temp;

      onStep({
        items: [...a],
        comparingIndices: [],
        swappedIndices: [rootIdx, largest],
        sortedIndices: [...sortedIndices],
        status: `Swapped root ${a[largest]} with larger child ${a[rootIdx]}`,
      });
      await wait();

      await heapify(size, largest);
    }
  }

  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    await heapify(n, i);
  }

  // Extract elements one by one from heap
  for (let i = n - 1; i > 0; i--) {
    const temp = a[0];
    a[0] = a[i];
    a[i] = temp;
    sortedIndices.push(i);

    onStep({
      items: [...a],
      comparingIndices: [],
      swappedIndices: [0, i],
      sortedIndices: [...sortedIndices],
      status: `Extracted max heap root ${a[i]} and moved to sorted position ${i}`,
    });
    await wait();

    await heapify(i, 0);
  }
  sortedIndices.push(0);

  onStep({
    items: [...a],
    comparingIndices: [],
    swappedIndices: [],
    sortedIndices: Array.from({ length: n }, (_, i) => i),
    pivotIndex: -1,
    status: 'Heap Sort Complete! Max-heap extraction finished.',
  });
}
