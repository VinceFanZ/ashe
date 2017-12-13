const express = require('express')
const cors = require('cors')
const webPush = require('web-push')
const bodyParser = require('body-parser')
const path = require('path')

const app = express()

app.use(express.static(path.resolve(__dirname, '../src/sw')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}))

webPush.setVapidDetails(
  'mailto:contact@deanhume.com',
  'BAyb_WgaR0L0pODaR7wWkxJi__tWbM1MPBymyRDFEGjtDCWeRYS9EF7yGoCHLdHJi6hikYdg4MuYaK0XoD0qnoY',
  'p6YVD7t8HkABoez1CvVJ5bl7BnEdKUu5bSyVjyxMBh0'
)

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../src/sw/inde.html'))
})

let pushSubscription

app.post('/register', cors(), (req, res) => {
  const endpoint = req.body.endpoint
  const authSecret = req.body.authSecret
  const key = req.body.key

  pushSubscription = {
    endpoint: endpoint,
    keys: {
      auth: authSecret,
      p256dh: key
    }
  }

  const body = 'thank you for registering'
  const iconUrl = 'https://abs-0.twimg.com/responsive-web/web/ltr/icon-default.882fa4ccf6539401.png'

  webPush.sendNotification(pushSubscription,
    JSON.stringify({
      url: 'http://localhost:3111?111',
      msg: body,
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

let count = 0
setInterval(() => {
  const body = 'thank you for registering' + (++count)
  const iconUrl = 'https://abs-0.twimg.com/responsive-web/web/ltr/icon-default.882fa4ccf6539401.png'

  webPush.sendNotification(pushSubscription,
      JSON.stringify({
        url: 'http://localhost:3111?111',
        msg: body,
        icon: iconUrl,
        type: 'register'
      })
    )
    .then(result => {
      console.log(result.statusCode)
    })
    .catch(error => {
      console.error(error)
    })
}, 1000 * 60)


app.listen(3111, function () {
  console.log('Listening at http://localhost:3111')
})
