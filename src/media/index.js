(function (win, doc) {
  const getId = doc.querySelector.bind(doc)
  const width = 600
  const height = 480

  win.addEventListener('DOMContentLoaded', () => {
    const vid = getId('#video')
    const con = getId('#canvas').getContext('2d')
    const btnStart = getId('#start')
    const btnStop = getId('#stop')
    const select = getId('#select')
    const contraints = {
      audio: false,
      video: {
        width,
        height
      }
    }
    let videoTracks
    let isStreaming = false
    let reqAF
    let selectBeauty = 'invert'

    // 翻转 canvas
    con.translate(width, 0)
    con.scale(-1, 1)

    btnStart.addEventListener('click', () => {
      if (isStreaming) {
        return
      }
      navigator.mediaDevices.getUserMedia(contraints)
        .then(mediaStream => {
          videoTracks = mediaStream.getVideoTracks()
          try {
            vid.srcObject = mediaStream
          } catch (e) {
            vid.src = win.URL.createObjectURL(mediaStream)
          }
          vid.play()
        })
        .catch(error => {
          console.error(error)
        })
    })

    btnStop.addEventListener('click', () => {
      videoTracks[0].stop()
      videoTracks = null
      isStreaming = false
      vid.pause()
      win.cancelAnimationFrame(reqAF)
    })

    select.addEventListener('change', () => {
      selectBeauty = select.options[select.selectedIndex].value
    })

    vid.addEventListener('canplay', () => {
      if (!isStreaming) {
        isStreaming = true
      }
    })

    vid.addEventListener('play', () => {
      selectBeauty = select.options[select.selectedIndex].value
      draw()
    })

    setOptions()

    function draw() {
      con.fillRect(0, 0, width, height)
      con.drawImage(vid, 0, 0, width, height)
      const imageData = con.getImageData(0, 0, width, height)
      let data = imageData.data

      if (selectBeauty !== 'default') {
        beauty()[selectBeauty](data)
        con.putImageData(imageData, 0, 0)
      }

      reqAF = win.requestAnimationFrame(draw)
    }

    function setOptions() {
      const cf = document.createDocumentFragment()
      Object.keys(beauty()).forEach((val) => {
        const option = document.createElement('option')
        option.value = val
        option.textContent = val
        cf.appendChild(option)
      })
      select.appendChild(cf)
    }

  })

  function beauty () {
    return {
      invert (data) {
        for (let i = 0; i < data.length; i += 4) {
          data[i] = 225 - data[i]
          data[i + 1] = 225 - data[i + 1]
          data[i + 2] = 225 - data[i + 2]
        }
        return data
      },
      grayscale (data) {
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
          data[i] = avg
          data[i + 1] = avg
          data[i + 2] = avg
        }
        return data
      },
      /**
       * 高斯模糊
       * @param  {Array} pixes  pix array
       * @param  {Number} radius 取样区域半径, 正数, 可选, 默认为 3.0
       * @param  {Number} sigma 标准方差, 可选, 默认取值为 radius / 3
       * @return {Array}
       */
      gaussBlur (pixes, radius, sigma) {
        var gaussMatrix = [],
          gaussSum = 0,
          x, y,
          r, g, b, a,
          i, j, k, len;

        radius = Math.floor(radius) || 3;
        sigma = sigma || radius / 3;

        a = 1 / (sigma * Math.sqrt(2 * Math.PI));
        b = -1 / (2 * sigma * sigma);
        //生成高斯矩阵
        for (i = 0, x = -radius; x <= radius; x++, i++) {
          g = a * Math.exp(b * x * x);
          gaussMatrix[i] = g;
          gaussSum += g;

        }
        //归一化, 保证高斯矩阵的值在[0,1]之间
        for (i = 0, len = gaussMatrix.length; i < len; i++) {
          gaussMatrix[i] /= gaussSum;
        }
        //x 方向一维高斯运算
        for (y = 0; y < height; y++) {
          for (x = 0; x < width; x++) {
            r = g = b = a = 0;
            gaussSum = 0;
            for (j = -radius; j <= radius; j++) {
              k = x + j;
              if (k >= 0 && k < width) { //确保 k 没超出 x 的范围
                //r,g,b,a 四个一组
                i = (y * width + k) * 4;
                r += pixes[i] * gaussMatrix[j + radius];
                g += pixes[i + 1] * gaussMatrix[j + radius];
                b += pixes[i + 2] * gaussMatrix[j + radius];
                gaussSum += gaussMatrix[j + radius];
              }
            }
            i = (y * width + x) * 4;
            // 除以 gaussSum 是为了消除处于边缘的像素, 高斯运算不足的问题
            // console.log(gaussSum)
            pixes[i] = r / gaussSum;
            pixes[i + 1] = g / gaussSum;
            pixes[i + 2] = b / gaussSum;
          }
        }
        //y 方向一维高斯运算
        for (x = 0; x < width; x++) {
          for (y = 0; y < height; y++) {
            r = g = b = a = 0;
            gaussSum = 0;
            for (j = -radius; j <= radius; j++) {
              k = y + j;
              if (k >= 0 && k < height) { //确保 k 没超出 y 的范围
                i = (k * width + x) * 4;
                r += pixes[i] * gaussMatrix[j + radius];
                g += pixes[i + 1] * gaussMatrix[j + radius];
                b += pixes[i + 2] * gaussMatrix[j + radius];
                gaussSum += gaussMatrix[j + radius];
              }
            }
            i = (y * width + x) * 4;
            pixes[i] = r / gaussSum;
            pixes[i + 1] = g / gaussSum;
            pixes[i + 2] = b / gaussSum;
          }
        }
        //end
        return pixes;
      }
    }
  }

})(window, document)
