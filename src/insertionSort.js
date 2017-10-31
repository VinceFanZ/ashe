function insertionSort (arr) {
  for (let i = 1; i < arr.length; i++) {
    let element = arr[i]
    let j = i - 1
    for (j; j >= 0; j--) {
      let tmp = arr[j]
      let order = tmp - element
      if (order > 0) {
        arr[j + 1] = tmp
      } else {
        break
      }
    }
    arr[j + 1] = element
  }
  return arr
}

let arr = [8, 5, 4, 7, 8, 3, 5, 2, 9, 3, 0, 6]
console.log(insertionSort(arr))
