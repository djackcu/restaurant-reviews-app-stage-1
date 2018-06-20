'use strict';

var cacheName = 'restaurant_cache';
var version = 6;
var currentCache;
//
var cacheFiles = ['./', 'index.html', 'restaurant.html', 'css/styles.css', 'js/dbhelper.js', 'js/main.js', 'js/restaurant_info.js', 'data/restaurants.json'];

self.addEventListener('install', function (event) {
    currentCache = cacheName + version;
    console.log('Install [Service Worker]', currentCache);
    event.waitUntil(caches.open(currentCache).then(function (cache) {
        return cache.addAll(cacheFiles);
    }));
});

self.addEventListener('activate', function (event) {
    console.log('[Service Worker] activated');
    event.waitUntil(caches.keys().then(function (cacheNames) {
        return Promise.all(cacheNames.map(function (thisCache) {
            if (thisCache !== currentCache) {
                console.log('Deleted Service Worker', thisCache);
                return caches.delete(thisCache);
            }
        }));
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