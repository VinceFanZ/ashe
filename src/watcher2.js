const _ = typeof(window) === 'undefined' ? require('lodash') : window._
// Dep 类，添加依赖收集方法 depend
let uid = 1
class Dep {
  constructor() {
    this.id = uid++ // 为每个 dep 标记一个 uid
    this.subs = []
  }
  addSub(sub) {
    this.subs.push(sub)
  }
  depend() { // 依赖收集函数，在 getter 中执行，在 Dep.target 上找到当前 watcher，并添加依赖
    Dep.target && Dep.target.addDep(this)
  }
  notify() {
    this.subs.forEach(sub => {
      sub.update()
    })
  }
}
Dep.target = null // Dep.target 用来暂存正在收集依赖的当前 watcher
// 现在 Watcher 接收三个参数，第一个为依赖收集函数（如上文的 render），第二个为回调，第三个为附加配置
class Watcher {
  constructor(expFn, cb, options = {}) {
    this.context = options.context
    this.expFn = expFn
    this.depIds = new Set() //标记当前 watcher 已经加入到了哪些 dep
    this.cb = cb
    this.value = this.subAndGetValue()
    this.clonedOldValue = _.cloneDeep(this.value)
  }
  // 执行回调
  update() {
    let value = this.subAndGetValue() //获取 newValue
    if (!_.isEqual(value, this.clonedOldValue)) { // 比对前后两次值是否相等时借助一下 lodash 中的 isEqual 函数进行比较
      this.value = value
      this.cb.call(this.context, value, this.clonedOldValue)
      this.clonedOldValue = _.cloneDeep(value) // 缓存本次结果，会成为下次的 oldValue, 对于对象使用深拷贝
    }
  }
  //执行依赖收集函数，订阅依赖！
  subAndGetValue() {
    Dep.target = this // 把当前 watcher 放到 Dep.target 上，这样 getter 就知道应该把哪个 watcher 加入 dep 中了。
    let value = this.expFn.call(this.context)
    Dep.target = null // 订阅完置回空。
    return value
  }
  // 在 dep 上添加订阅
  addDep(dep) {
    if (!this.depIds.has(dep.id)) { //防止重复订阅，防止在一个 dep 中订阅两次
      this.depIds.add(dep.id)
      dep.addSub(this)
    }
  }
}
//简单封装下 new Watcher
function watch(expFn, cb, context) {
  return new Watcher(expFn, cb, context)
}
// 修改 defineReactive
function defineReactive(obj, key, value) {
  //为每个键都创建一个 dep
  let dep = new Dep()
  observify(value)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get() {
      if (Dep.target) {
        dep.depend()
      }
      return value
    },
    set: (newValue) => {
      if (newValue === value) {
        return
      } else {
        value = newValue
        observify(newValue)
        dep.notify()
      }
    }
  })
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

let o = {
  a: 1,
  b: 2,
  c: {
    d: 3
  }
}
observify(o)
watch(() => {
  console.log(o.a + o.b)
  return o.a + o.b
}, (newValue, oldValue) => {
  console.log('更新！新值为：', newValue, '，旧值为：', oldValue)
})
o.b = 3 //  输出：更新！新值为： 4 ，旧值为： 3
o.c.d = 4 // 无输出