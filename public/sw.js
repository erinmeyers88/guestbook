var staticCacheName = 'guestbook-static-v2';
// var contentImgsCache = 'guestbook-images';
// var allCaches = [
//     staticCacheName,
//     contentImgsCache
// ];

self.addEventListener('install', function(event) {
    console.log('install');
    event.waitUntil(
        caches.open(staticCacheName).then(function(cache) {
            return cache.addAll([
                '/',
                '/static/',
                '/purecss/'
            ]);
        })
    );
});

// self.addEventListener('activate', function(event) {
//     console.log('active');
//     event.waitUntil(
//         caches.keys().then(function(cacheNames) {
//             return Promise.all(
//                 cacheNames.filter(function(cacheName) {
//                     return cacheName.startsWith('guestbook-') &&
//                         !allCaches.includes(cacheName);
//                 }).map(function(cacheName) {
//                     return caches.delete(cacheName);
//                 })
//             );
//         })
//     );
// });
//
self.addEventListener('fetch', function(event) {
    // console.log('fetch', event.request.url);
    // var requestUrl = new URL(event.request.url);

    // if (requestUrl.origin === location.origin) {
    //     console.log('here');
    //     if (requestUrl.pathname === '/') {
    //         event.respondWith(caches.match('/offline.html'));
    //         // event.respondeWith(caches.match('/purecss'));
    //         return;
    //     }
    // }

    // if (event.request.mode === 'navigate' || (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html'))) {
    //     console.log('here');
    //     event.respondWith(
    //         fetch(event.request.url).catch(error => {
    //             console.log('error: ', error);
    //             // Return the offline page
    //             return caches.match('/offline.html');
    //         })
    //     );
    // }
    //
    // else {
    //     console.log('here bottom');
        event.respondWith(
            caches.match(event.request).then(function(response) {
                return response || fetch(event.request);
            })
        );
    // }


});
//
// function serveAvatar(request) {
//     // Avatar urls look like:
//     // avatars/sam-2x.jpg
//     // But storageUrl has the -2x.jpg bit missing.
//     // Use this url to store & match the image in the cache.
//     // This means you only store one copy of each avatar.
//     var storageUrl = request.url.replace(/-\dx\.jpg$/, '');
//
//     // TODO: return images from the "wittr-content-imgs" cache
//     // if they're in there. But afterwards, go to the network
//     // to update the entry in the cache.
//     //
//     // Note that this is slightly different to servePhoto!
//
//     return caches.open(contentImgsCache).then(function (cache) {
//         return cache.match(storageUrl).then(function (response) {
//             var networkFetch = fetch(request).then(function (networkResponse) {
//                 cache.put(storageUrl, networkResponse.clone());
//                 return networkResponse;
//             });
//
//             return response || networkFetch;
//         })
//     })
//
// }
//
// function servePhoto(request) {
//     var storageUrl = request.url.replace(/-\d+px\.jpg$/, '');
//
//     return caches.open(contentImgsCache).then(function(cache) {
//         return cache.match(storageUrl).then(function(response) {
//             if (response) return response;
//
//             return fetch(request).then(function(networkResponse) {
//                 cache.put(storageUrl, networkResponse.clone());
//                 return networkResponse;
//             });
//         });
//     });
// }
//
// self.addEventListener('message', function(event) {
//     if (event.data.action === 'skipWaiting') {
//         self.skipWaiting();
//     }
// });