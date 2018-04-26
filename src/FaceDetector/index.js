;(function (win, doc) {
  win.addEventListener('DOMContentLoaded', () => {
    const getId = doc.querySelector.bind(doc)
    const width = 600
    const height = 480
    if (!win.FaceDetector) {
      console.error('not supported FaceDetector')
      return
    }
    const vid = getId('#video')
    const canvas = getId('#canvas')
    const btnStop = getId('#btnStop')
    const ctx = canvas.getContext('2d')
    let isDetectingFaces
    let reqAF

    ctx.translate(width, 0)
    ctx.scale(-1, 1)

    navigator.mediaDevices
      .getUserMedia({ video: { width, height } })
      .then((mediaStream) => {
        videoTracks = mediaStream.getVideoTracks()
        try {
          vid.srcObject = mediaStream
        } catch (e) {
          vid.src = win.URL.createObjectURL(mediaStream)
        }
        vid.play()
      })
      .catch((error) => {
        console.error(error)
      })

    vid.addEventListener('play', () => {
      ctx.clearRect(0, 0, width, height)
      ctx.drawImage(vid, 0, 0, width, height)
      loopDraw()
    })
    btnStop.addEventListener('click', () => {
      videoTracks[0].stop()
      videoTracks = null
      vid.pause()
      win.cancelAnimationFrame(reqAF)
    })

    async function loopDraw () {
      reqAF = win.requestAnimationFrame(loopDraw)

      if (isDetectingFaces) {
        return
      }
      const faceDetector = new FaceDetector()

      isDetectingFaces = true
      const faces = await faceDetector.detect(canvas)
      isDetectingFaces = false

      ctx.clearRect(0, 0, width, height)
      ctx.drawImage(vid, 0, 0, width, height)

      if (faces.length) {
        ctx.lineWidth = 2
        ctx.strokeStyle = 'red'

        faces.forEach((item) => {
          const itemBox = item.boundingBox
          ctx.strokeRect(
            Math.floor(width - itemBox.x - itemBox.width),
            Math.floor(itemBox.y),
            Math.floor(itemBox.width),
            Math.floor(itemBox.height),
          )
        })
      }
    }
  })
})(window, document)
