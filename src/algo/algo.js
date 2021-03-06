export function doBubbleSort(array) {
    // console.log("bubbleSort");
    const arrayLength = array.length;
    let animations = [];

    for (let i = arrayLength - 1; 0 <= i; i--) {
        for (let j = 0; j < i; j++) {
            animations.push({ "operation": "compare", "target": [j, j + 1] });
            if (array[j] > array[j + 1]) {
                animations.push({ "operation": "swap", "target": [[j, array[j]], [j + 1, array[j + 1]]] });
                // // console.log("swap (%d, %d)", j, j + 1);
                let tmp = array[j];
                array[j] = array[j + 1];
                array[j + 1] = tmp;
            }
        }
        animations.push({ "operation": "fix", "target": [i] });
        // // console.log("fix %d", i)
    }
    animations.push({ "result": array })
    // // console.log(array);
    return animations;
}

export function doQuickSort(array) {
    // // console.log("quickSort");
    // // console.log(array);

    let animations = [];

    const partition = (array, left, right) => {
        let pivotIndex = Math.floor((right + left) / 2);
        let pivot = array[pivotIndex];
        animations.push({ "operation": "pivot", "target": [pivotIndex, pivot] });
        // // console.log("pivot: array[%d] = %d", pivotIndex, pivot)
        let i = left;
        let j = right;

        while (i <= j) {
            while (array[i] < pivot) {
                animations.push({ "operation": "compare", "target": [i, array[i], pivot] });
                // // console.log("compare: array[%d](%d) <-> pivot(%d)", i, array[i], pivot);
                i++;
            }

            while (array[j] > pivot) {
                animations.push({ "operation": "compare", "target": [j, array[j], pivot] });
                // // console.log("compare: array[%d](%d) <-> pivot(%d)", j, array[j], pivot);
                j--;
            }

            if (i <= j) {
                animations.push({ "operation": "swap", "target": [[i, array[i]], [j, array[j]], [pivotIndex, pivot]] });
                // console.log("swap: array[%d](%d) <-> array[%d](%d)", i, array[i], j, array[j]);
                // console.log("is pivot? : pivot index %d, i=%d, j=%d", pivotIndex, i, j);
                // switch (pivotIndex) {
                //     case i:
                //         pivotIndex = j;
                //         break;
                //     case j:
                //         pivotIndex = i;
                //         break;
                //     default:
                //         break;
                // }
                let tmp = array[i];
                array[i] = array[j];
                array[j] = tmp;
                // console.log(array);
                i++;
                j--;
            }
        }
        return i;
    };

    const quickSort = (array, left, right) => {
        let index;

        if (array.length > 1) {
            left = typeof left != "number" ? 0 : left;
            right = typeof right != "number" ? array.length - 1 : right;

            index = partition(array, left, right);

            if (left < index - 1) {
                quickSort(array, left, index - 1);
            }

            if (index < right) {
                quickSort(array, index, right);
            }

            animations.push({ "operation": "fix", "target": index });
            // console.log("fix: array[%d](%d)", index, array[index]);

        }
        return array;
    }

    quickSort(array);
    animations.push({ "operation": "fix", "target": 0 });
    animations.push({ "result": array });

    return animations;
}

export function doHeapSort(array) {
    let arrayLength = array.length;

    let animations = [];

    const buildHeap = (array, i) => {
        let left = 2 * i + 1;
        let right = 2 * i + 2;
        let max = i;

        if (left < arrayLength && array[max] < array[left]) {
            max = left;
        }

        if (right < arrayLength && array[max] < array[right]) {
            max = right;
        }

        if (max !== i) {
            animations.push({ "operation": "swap", "target": [[i, array[i]], [max, array[max]]] });
            let tmp = array[i];
            array[i] = array[max];
            array[max] = tmp;

            buildHeap(array, max);
        }
    };

    for (let i = Math.floor(arrayLength / 2); 0 <= i; i -= 1) {
        buildHeap(array, i);
    }

    for (let i = arrayLength - 1; 0 < i; i -= 1) {
        animations.push({ "operation": "swap", "target": [[0, array[0]], [i, array[i]]] });
        let tmp = array[0];
        array[0] = array[i];
        array[i] = tmp;
        animations.push({ "operation": "fix", "target": [i] });
        arrayLength -= 1;
        buildHeap(array, 0);
    }
    animations.push({ "operation": "fix", "target": [0] });
    animations.push({ "result": array });
    console.log(array);

    return animations;
}

// TODO: mergesort
export function doMergeSort(array) {
    const arrayLength = array.length;
    let animations = [];

    if (arrayLength < 2) {
        return [{ "result": array }];
    }

    const auxiliaryArray = array.slice();
    mergeSortHelper(array, 0, array.length - 1, auxiliaryArray, animations);
    return animations;
}

function mergeSortHelper(
    mainArray,
    startIdx,
    endIdx,
    auxiliaryArray,
    animations,
) {
    if (startIdx === endIdx) return;
    const middleIdx = Math.floor((startIdx + endIdx) / 2);
    mergeSortHelper(auxiliaryArray, startIdx, middleIdx, mainArray, animations);
    mergeSortHelper(auxiliaryArray, middleIdx + 1, endIdx, mainArray, animations);
    doMerge(mainArray, startIdx, middleIdx, endIdx, auxiliaryArray, animations);
}

function doMerge(
    mainArray,
    startIdx,
    middleIdx,
    endIdx,
    auxiliaryArray,
    animations,
) {
    let k = startIdx;
    let i = startIdx;
    let j = middleIdx + 1;
    while (i <= middleIdx && j <= endIdx) {
        // // These are the values that we're comparing; we push them once
        // // to change their color.
        // animations.push([i, j]);
        // // These are the values that we're comparing; we push them a second
        // // time to revert their color.
        // animations.push([i, j]);
        if (auxiliaryArray[i] <= auxiliaryArray[j]) {
            // // We overwrite the value at index k in the original array with the
            // // value at index i in the auxiliary array.
            // animations.push([k, auxiliaryArray[i]]);
            mainArray[k++] = auxiliaryArray[i++];
        } else {
            // // We overwrite the value at index k in the original array with the
            // // value at index j in the auxiliary array.
            // animations.push([k, auxiliaryArray[j]]);
            mainArray[k++] = auxiliaryArray[j++];
        }
    }
    while (i <= middleIdx) {
        // // These are the values that we're comparing; we push them once
        // // to change their color.
        // animations.push([i, i]);
        // // These are the values that we're comparing; we push them a second
        // // time to revert their color.
        // animations.push([i, i]);
        // // We overwrite the value at index k in the original array with the
        // // value at index i in the auxiliary array.
        // animations.push([k, auxiliaryArray[i]]);
        mainArray[k++] = auxiliaryArray[i++];
    }
    while (j <= endIdx) {
        // // These are the values that we're comparing; we push them once
        // // to change their color.
        // animations.push([j, j]);
        // // These are the values that we're comparing; we push them a second
        // // time to revert their color.
        // animations.push([j, j]);
        // // We overwrite the value at index k in the original array with the
        // // value at index j in the auxiliary array.
        // animations.push([k, auxiliaryArray[j]]);
        mainArray[k++] = auxiliaryArray[j++];
    }
}