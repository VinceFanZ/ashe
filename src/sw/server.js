const express = require('express')
const cors = require('cors')
const webPush = require('web-push')
const bodyParser = require('body-parser')
const path = require('path')

const app = express()

let pushSubscription

app.use(express.static(path.resolve(__dirname)))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
}))

webPush.setVapidDetails(
  'mailto:contact@deanhume.com',
  'BAyb_WgaR0L0pODaR7wWkxJi__tWbM1MPBymyRDFEGjtDCWeRYS9EF7yGoCHLdHJi6hikYdg4MuYaK0XoD0qnoY',
  'p6YVD7t8HkABoez1CvVJ5bl7BnEdKUu5bSyVjyxMBh0'
)

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'))
})

app.post('/register', cors(), (req, res) => {
  const { endpoint, authSecret, key } = req.body

  pushSubscription = {
    endpoint: endpoint,
    keys: {
      auth: authSecret,
      p256dh: key
    }
  }

  const body = 'Thank you for registering'
  const iconUrl = 'https://abs-0.twimg.com/responsive-web/web/ltr/icon-default.882fa4ccf6539401.png'

  webPush.sendNotification(pushSubscription,
      JSON.stringify({
        url: 'http://localhost:3111?111',
        body: body,
        icon: iconUrl,
        type: 'register'
      })
    )
    .then(result => {
      console.log(result.statusCode)
      res.sendStatus(201)
    })
    .catch(error => {
      console.error(error)
    })

})

sendMessage()

function sendMessage () {
  let count = 0
  setInterval(() => {
    if (!pushSubscription) {
      return
    }
    const body = '来自火星人的赞 +' + (++count)
    const iconUrl = 'https://abs-0.twimg.com/responsive-web/web/ltr/icon-default.882fa4ccf6539401.png'

    webPush.sendNotification(pushSubscription,
        JSON.stringify({
          url: 'http://localhost:3111?111',
          body: body,
          icon: iconUrl,
          type: 'message'
        })
      )
      .then(result => {
        console.log(result.statusCode)
      })
      .catch(error => {
        console.error(error)
      })
  }, 1000 * 60)
}


app.listen(3111, function () {
  console.log('Listening at http://localhost:3111')
})
