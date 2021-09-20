const canvas = document.getElementById('canvas')
canvas.width = 400
canvas.height = 400
const context = canvas.getContext('2d')

// context.beginPath()
// context.arc(100, 100, 50, 0, Math.PI * 0.5, false)
// context.closePath()

// context.fillStyle = 'rgb(255,255,2)'
// context.fill() // 填充

// context.strokeStyle = 'white'
// context.stroke() // 描边

//
// context.beginPath()
// context.fillStyle = '#fff'
// context.fillRect(10, 10, 100, 100)
// context.strokeStyle = '#fff'
// context.strokeRect(130, 10, 100, 100)

//
// context.beginPath()
// context.arc(100, 100, 50, 0, 2 * Math.PI, false)
// context.fillStyle = '#fff'
// context.shadowBlur = 20
// context.shadowColor = '#fff'
// context.fill()

//
// const grd = context.createLinearGradient(100, 100, 100, 200)
// grd.addColorStop(0, 'rgb(255, 0, 0)')
// grd.addColorStop(0.2, 'rgb(255, 165, 0)')
// grd.addColorStop(0.3, 'rgb(255, 255, 0)')
// grd.addColorStop(0.5, 'rgb(0, 255, 0)')
// grd.addColorStop(0.7, 'rgb(0, 127, 255)')
// grd.addColorStop(0.9, 'rgb(0, 0, 255)')
// grd.addColorStop(1, 'rgb(139, 0, 255)')
// context.fillStyle = grd
// context.fillRect(100, 100, 200, 120)

//
// context.strokeStyle = 'white'
// context.strokeRect(5, 5, 50, 25)
// context.scale(2, 2)
// context.strokeRect(5, 5, 50, 25)
// context.scale(2, 2)
// context.strokeRect(5, 5, 50, 25)
// context.fillStyle = 'white'
// context.rotate((20 * Math.PI) / 180)
// context.fillRect(70, 30, 20, 15)
