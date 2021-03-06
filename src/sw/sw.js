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
  console.log('%cSW: install', 'color: cornflowerblue')
  event.waitUntil(
    caches.open(cacheName)
    .then(cache => {
      console.log('%cOpen caches', 'color: cornflowerblue')
      return cache.addAll([
        './assets/hall.jpg',
        './assets/img_4x3.png',
        './index.js',
        './index.html'
      ])
    })
  )
})


self.addEventListener('activate', event => {
  console.log('%cSW: activate', 'color: cornflowerblue')
  const cacheWhiteList = [cacheName]
  event.waitUntil(
    caches.keys()
    .then(keyList => Promise.all(
      keyList.map(key => {
        // 删掉旧缓存
        if (cacheWhiteList.indexOf(key) === -1) {
          return caches.delete(key)
        }
      })
    ))
  )
})

self.addEventListener('push', event => {
  const payload = event.data ? JSON.parse(event.data.text()) : 'no payload'
  const title = '注册通知'

  if (payload.type === 'register') {
    event.waitUntil(
      self.registration.showNotification(title, {
        body: payload.body,
        url: payload.url,
        icon: payload.icon
      })
    )
  }

  if (payload.type === 'message') {
    event.waitUntil(
      self.registration.showNotification('新消息', {
        body: payload.body,
        url: payload.url,
        icon: payload.icon
      })
    )
  }
})

self.addEventListener('notificationclick', event => {
  event.notification.close()
  clients.openWindow('http://localhost:3111')
})

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true })
    .then(response => {
      if (response) {
        return response
      }

      const fetchRequest = event.request.clone()
      return fetch(fetchRequest).then(response => {
        if (!response || response.status !== 200) {
          return response
        }
        const responseToCache = response.clone()
        caches.open(cacheName).then(cache => {
          cache.put(event.request, responseToCache)
        })

        return response
      })
    })
  )
})
