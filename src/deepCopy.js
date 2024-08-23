function deepCopy(obj, cache = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (cache.has(obj)) {
    return cache.get(obj)
  }

  let copy = Array.isArray(obj) ? [] : {}
  cache.set(obj, copy)

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      copy[key] = deepCopy((obj)[key], cache)
    }
  }

  return copy
}

const t1 = {
  name: 'Jack',
  age: 18,
  hobbit: ['sing', { type: 'sports', value: 'run' }],
  score: {
    math: 'A',
  },
  run: function () {},
  walk: undefined,
  fly: NaN,
  cy: null,
  date: new Date(),
  r: /\s+/g,
}

console.log(deepCopy(null))
console.log(deepCopy([]))
console.log(deepCopy(t1))

const a = { name: 'a' }
const b = { name: 'b' }
a['b'] = b
b['a'] = a

const copied = deepCopy(a)
console.log(copied.name) // 'a'
console.log(copied.b.name) // 'b'
console.log(copied.b.a.name) // 'a'
