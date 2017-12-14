;
(function () {
  window.addEventListener('DOMContentLoaded', init)

  function init() {
    if (!'serviceWorker' in navigator) {
      return console.log('not support serviceWorker!')
    }
    const vapidPublicKey = 'BAyb_WgaR0L0pODaR7wWkxJi__tWbM1MPBymyRDFEGjtDCWeRYS9EF7yGoCHLdHJi6hikYdg4MuYaK0XoD0qnoY'

    navigator.serviceWorker.register('./sw.js')
    .then(registration => {
      console.log('SW registration: ' + registration.scope)
      return registration.pushManager.getSubscription()
        .then(subscription => {
          if (subscription) {
            return
          }
          return registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
            })
            .then(subscription => {
              const rawKey = subscription.getKey ? subscription.getKey('p256dh') : ''
              const key = rawKey ? btoa(String.fromCharCode.apply(null, new Uint8Array(rawKey))) : ''

              const rawAuthSecret = subscription.getKey ? subscription.getKey('auth') : ''
              const authSecret = rawAuthSecret ? btoa(String.fromCharCode.apply(null, new Uint8Array(rawAuthSecret))) : ''

              return fetch('//localhost:3111/register', {
                method: 'POST',
                mode: 'cors',
                cache: 'default',
                headers: new Headers({
                  'content-type': 'application/json'
                }),
                body: JSON.stringify({
                  endpoint: subscription.endpoint,
                  key: key,
                  authSecret: authSecret,
                }),
              })

            })
            .catch(error => {
              console.error('subscribe failed: ' + error)
            })

        })
    })
    .catch(error => {
      console.log('fail: ' + error)
    })
  }

  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const ouputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      ouputArray[i] = rawData.charCodeAt(i);
    }
    return ouputArray;
  }

})()
