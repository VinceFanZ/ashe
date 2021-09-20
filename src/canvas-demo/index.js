const canvas = document.getElementById('canvas')
const WIDTH = document.documentElement.clientWidth
const HEIGHT = document.documentElement.clientHeight
canvas.width = WIDTH
canvas.height = HEIGHT
const ctx = canvas.getContext('2d')
const initRoundPopulation = 1000
const round = []

class RoundItem {
  index
  x
  y
  r
  color
  constructor(index, x, y) {
    this.index = index
    this.x = x
    this.y = y
    this.r = Math.random() * 2 + 1
    const alpha = (Math.floor(Math.random() * 10) + 1) / 10 / 2
    this.color = `rgba(255,255,255, ${alpha})`
  }
  draw(ctx) {
    ctx.fillStyle = this.color
    ctx.shadowBlur = this.r * 2
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false)
    ctx.closePath()
    ctx.fill()
  }
  move(ctx) {
    this.y -= 0.5
    if (this.y <= -10) {
      this.y = HEIGHT + 10
    }
    this.draw(ctx)
  }
}

function animate() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT)
  round.forEach((item, index) => {
    item.move(ctx)
  })
  requestAnimationFrame(animate)
}

function init() {
  for (let i = 0; i < initRoundPopulation; ++i) {
    round[i] = new RoundItem(i, Math.random() * WIDTH, Math.random() * HEIGHT)
    round[i].draw(ctx)
  }
  animate()
}

// init()

//
let para = {
  num: 100,
  color: false, // 颜色 如果是false 则是随机渐变颜色
  r: 0.9, // 圆每次增加的半径
  o: 0.09, // 判断圆消失的条件，数值越大，消失的越快
  a: 1,
}
let color
let color2
const round_arr = [] // 存放圆的数组

window.addEventListener('mousemove', (event) => {
  round_arr.push({
    mouseX: event.clientX,
    mouseY: event.clientY,
    r: para.r,
    o: 1,
  })
})

if (para.color) {
  color2 = para.color
} else {
  color = Math.random() * 360
}

function animate2() {
  if (!para.color) {
    color += 1
    color2 = `hsl(${color}, 100%, 80%)`
  }
  ctx.clearRect(0, 0, WIDTH, HEIGHT)

  for (let i = 0; i < round_arr.length ; ++i) {
    ctx.fillStyle = color2
    ctx.beginPath()
    ctx.arc(round_arr[i].mouseX, round_arr[i].mouseY, round_arr[i].r, 0, 2 * Math.PI)
    ctx.closePath()
    ctx.fill()
    round_arr[i].r += para.r
    round_arr[i].o -= para.o

    if (round_arr[i].o <= 0) {
      round_arr.splice(i, 1)
      i--
    }
  }

  requestAnimationFrame(animate2)
}
animate2()
