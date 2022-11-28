/** @format */

/**
 * remove 方法兼容判断
 *
 * @export
 * @param {HTMLElement} target
 */
 export function removeElement(target) {
  if (target.remove) {
    target.remove()
    return
  }
  target.parentNode && target.parentNode.removeChild(target)
}

/**
 * 创建离屏 canvas
 *
 * @export
 * @returns
 */
export function getCanvas(width, height, isAutoDpr = true) {
  const dpr = (isAutoDpr && Math.floor(window.devicePixelRatio)) || 1
  const canvas = document.createElement('canvas')
  canvas.style.cssText = `width:${width}px;height:${height}px;`
  canvas.style.display = 'none'
  canvas.width = width * dpr
  canvas.height = height * dpr
  const ctx = canvas.getContext('2d')
  ctx.scale(dpr, dpr)
  document.body.appendChild(canvas)

  return {
    canvas,
    ctx,
  }
}

/**
 * 加载图片
 *
 * @export
 * @param {*} url
 * @param {*} [defaultImg]
 * @returns
 */
export function loadImg(url, defaultImg) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = function() {
      resolve(this)
    }
    img.onerror = function(e) {
      if (defaultImg) {
        resolve(defaultImg)
        return
      }
      console.error(e)
      reject(Error('load error: ' + url))
    }

    img.src = url
  })
}

export function createShader(gl, type, sourceCode) {
  // Compiles either a shader of type gl.VERTEX_SHADER or gl.FRAGMENT_SHADER
  // 创建着色器对象
  const shader = gl.createShader(type)
  // 将源码分配给着色器对象
  gl.shaderSource(shader, sourceCode)
  // 编译着色器程序
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader)
    throw new Error('Could not compile WebGL program. \n\n' + info)
  }
  return shader
}

export function createProgram(gl, vertexShader, fragmentShader) {
  // 创建着色器程序
  const program = gl.createProgram()
  // 将顶点着色器挂载在着色器程序上
  gl.attachShader(program, vertexShader)
  // 将片元着色器挂载在着色器程序上
  gl.attachShader(program, fragmentShader)
  // 链接着色器程序
  gl.linkProgram(program)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program)
    throw new Error('Could not compile WebGL program. \n\n' + info)
  }
  // 使用刚创建好的着色器程序.
  gl.useProgram(program)
  return program
}

export function createTexture(gl, index, imgData) {
  const textureIndex = gl.TEXTURE0 + index
  gl.activeTexture(textureIndex)
  const texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR) // NEAREST
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  if (imgData) {
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imgData)
  }

  return texture
}
