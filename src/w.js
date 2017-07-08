const _ = require('lodash')

class Dep {
  constructor() {
    this.subs = []
  }
  addSub(sub) { // 添加订阅
    this.subs.push(sub)
  }
  notify(newValue, oldValue) {
    this.subs.forEach(sub => {
      sub.update(newValue, oldValue) // 触发订阅
    })
  }
}

const globalDep = new Dep()
// Watcher 类，每个 Watcher 为一个订阅源
class Watcher {
  constructor(callback) {
    this.callback = callback
  }
  update(newValue, oldValue) {
    this.callback(newValue, oldValue) // 被触发后执行回调
  }
}

// 数组响应化
function observifyArray(arr) {
  const aryMethods = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'] //需要变异的函数名列表
  let arrayAugmentations = Object.create(Array.prototype) // 创建一个 __proto__ 到 Array.prototype 的 arrayAugmentations 对象
  aryMethods.forEach(method => { // 在 arrayAugmentations 对象上将需要变异的函数重写
    arrayAugmentations[method] = function (...arg) {
      const oldValue = _.cloneDeep(this)
      Array.prototype[method].apply(this, arg) // 执行默认操作
      const newValue = this
      globalDep.notify(newValue, oldValue) // 重写后的函数会先执行默认操作，随后通知 Dep
    }
  })
  Object.setPrototypeOf(arr, arrayAugmentations) // 将要监测的数组的原型对象设置为 arrayAugmentations 对象，这样执行 push 等方法时就会执行我们替换后的变异方法啦
}

// 使一个对象响应化
function observify(value) {
  if (!isObject(value)) {
    return
  }

  if (Array.isArray(value)) { // 由于性能问题，我们不再对数组的每个 key 执行 Object.defineReactive
    observifyArray(value)
    for (let i = 0; i < value.length; i++) {
      observify(value[i])
    }
  } else {
    Object.keys(value).forEach((key) => {
      defineReactive(value, key, value[key]) // 遍历每个键使其响应化
    })
  }
}

function isObject(value) {
  return typeof value === 'object' && value !== null
}

//为对象的一个键应用 Object.defineProperty
function defineReactive(obj, key, value) {
  observify(value) // 递归
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get() {
      return value
    },
    set: (newValue) => {
      if (newValue === value) {
        return
      } else {
        let oldValue = value
        value = newValue
        observify(newValue)
        globalDep.notify(newValue, oldValue) // 变动时通知 Dep
      }
    }
  })
}

let o = {
  a: 1,
  c: {
    d: 1
  },
  e: [1, 2, 3]
}
//『使数据响应化』和『添加回调函数』两个操作已被解耦，解耦后可以方便的多次添加订阅
// 使数据响应化
observify(o)
// 添加订阅
globalDep.addSub(new Watcher((newValue, oldValue) => {
  console.log('发生改变！新值：', newValue, "，旧值：", oldValue)
}))
o.a = 2 // 输出：发生改变！新值： 2 ，旧值： 1
o.c.d = 4 // 输出：发生改变！新值： 4 ，旧值： 1
// 可以再添加一个订阅
globalDep.addSub(new Watcher((newValue, oldValue) => {
  console.log('新订阅')
}))
o.a = 3 // 输出：发生改变！新值： 3 ，旧值： 2
        // 输出：新订阅

o.e.push(4) // 输出：发生改变！新值： (4) [1, 2, 3, 4] ，旧值： (3) [1, 2, 3]