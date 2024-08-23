const selfCurryFn = (fn) => {
  const fnLen = fn.length
  console.log('🚀 ~ file: curry.js:3 ~ selfCurryFn ~ fnLen', fnLen)
  function curry(...args) {
    const argLen = args.length // curry 接收的参数
    if (argLen >= fnLen) {
      return fn.apply(this, args) // 如果外面绑定 this 的话，直接绑定到fn上
    } else {
      // 参数个数没有达到时继续接收剩余的参数
      function otherCurry(...args2) {
        return curry.apply(this, args.concat(args2))
      }

      return otherCurry
    }
  }

  return curry
}

const selfAddFn = (x, y, z) => {
  return x + y + z
}

const selfSum = selfCurryFn(selfAddFn)

console.log('🚀 ~ file: curry.js:56 ~ selfSum(1)(2)(3)', selfSum(1)(2)(3))
console.log('🚀 ~ file: curry.js:55 ~ selfSum(1, 2)(3)', selfSum(1, 2)(3))
console.log('🚀 ~ file: curry.js:54 ~ selfSum(1, 2, 3)', selfSum(1, 2, 3))
