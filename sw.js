'use strict';

var cacheName = 'restaurant_cache ';
var version = 1;
var currentCache = cacheName + version;
var serviceLog = '[Service Worker ' + currentCache + ']';
//
var cacheFiles = ['./', 'index.html', 'restaurant.html', 'css/styles.css', 'js/dbhelper.js', 'js/main.js', 'js/restaurant_info.js', 'data/restaurants.json', 'img/1.jpg', 'img/2.jpg', 'img/3.jpg', 'img/4.jpg', 'img/5.jpg', 'img/6.jpg', 'img/7.jpg', 'img/8.jpg', 'img/9.jpg', 'img/10.jpg'];

self.addEventListener('install', function (event) {
    console.log('Install ', serviceLog);
    event.waitUntil(caches.open(currentCache).then(function (cache) {
        console.log('Caching files ', serviceLog);
        return cache.addAll(cacheFiles);
    }).catch(function () {
        console.log('Caching files error:', serviceLog);
    }));
});

self.addEventListener('activate', function (event) {
    console.log('Activated ', serviceLog);
    event.waitUntil(caches.keys().then(function (cacheNames) {
        return Promise.all(cacheNames.map(function (thisCache) {
            if (thisCache !== currentCache) {
                console.log('Deleted Service Worker', thisCache);
                return caches.delete(thisCache);
            }
        }));
    }).catch(function () {
        console.log('Activate error: ', serviceLog);
    }));
});

self.addEventListener('fetch', function (event) {
    console.log('[Service Worker] fetched');

    event.respondWith(caches.open(currentCache).then(function (cache) {
        return cache.match(event.request).then(function (response) {
            return response || fetch(event.request).then(function (response) {
                cache.put(event.request, response.clone());
                return response;
            });
        });
    }));
});