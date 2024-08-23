
function create (obj) {
  const a = {}
  a.prototype = obj
  const fun = a.call(a)

  return typeof fun === 'object' ? this : fun
}

var obj = {}
function test(a) {
  console.log(a)
  console.log(this === obj)
}
Function.prototype.myBind = function(target) {
  const th = this
  return function () {
    th.apply(target, [].slice.call(arguments).slice(1))
  }
}
var testObj = test.bind(obj, 23)
testObj()
