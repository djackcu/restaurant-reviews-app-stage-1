'use strict';

var cacheName = 'restaurant_cache';
var version = 6;
var currentCache;
//
var cacheFiles = ['./', 'index.html', 'restaurant.html', 'css/styles.css', 'js/dbhelper.js', 'js/main.js', 'js/restaurant_info.js', 'data/restaurants.json', 'img/1.jpj', 'img/2.jpj', 'img/3.jpj', 'img/4.jpj', 'img/5.jpj', 'img/6.jpj', 'img/7.jpj', 'img/8.jpj', 'img/9.jpj', 'img/10.jpj'];

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