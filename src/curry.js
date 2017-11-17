function curry (fn, args) {
  let length = fn.length
  args = args || []
  return function () {
    let _args = args.slice(0)
    let arg
    let i = 0
    for (i; i < arguments.length; i++) {
      arg = arguments[i]
      _args.push(arg)
    }
    if (_args.length < length) {
      return curry.call(this, fn, _args)
    } else {
      return fn.apply(this, _args)
    }
  }
}


function add(a, b, c) {
  console.log(a + b + c)
}

const fn = curry(add)

fn(3, 5, 7)
fn(3, 5)(7)
fn(3)(5)(7)
