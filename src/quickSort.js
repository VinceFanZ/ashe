function quickSort (arr) {
  if (arr.length <= 1) return arr
  let pivotIndex = Math.floor(arr / 2)
  let pivot = arr.splice(pivotIndex, 1)[0]

  let left = []
  let right = []
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > pivot) {
      right.push(arr[i])
    } else {
      left.push(arr[i])
    }
  }
  return quickSort(left).concat(pivot, quickSort(right))
}

let arr = [85, 24, 63, 45, 17, 31, 96, 50]
console.log(quickSort(arr))
