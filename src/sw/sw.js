// self.importScripts('../../node_modules/sw-toolbox/sw-toolbox.js')

// toolbox.router.get('./assets/', function (event) {
//   return caches.open('as')
//     .then(response => {
//       return response.match(event.request)
//         .then(res => res || fetch(event.request))
//     })
//     .catch(() => fetch(event.request))
// }, {
//   origin: /.*/
// })

var cacheName = 'test'
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName)
      .then(cache => cache.addAll([
        './assets/hall.jpg'
      ]))
  )
})

self.addEventListener('push', event => {
  const payload = event.data ? JSON.parse(event.data.text()) : 'no payload'
  const title = '收到新通知'
  console.log(payload)

  if (payload.type === 'register') {
    event.waitUntil(
      self.registration.showNotification(title, {
        body: payload.msg,
        url: payload.url,
        icon: payload.icon
      })
    )
  }
})

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response ? response : fetch(event.request))
  )
})
