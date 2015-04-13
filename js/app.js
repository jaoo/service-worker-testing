'use strict';

window.addEventListener('DOMContentLoaded', function load() {
  window.removeEventListener('DOMContentLoaded', load);

  function dumpSwr(swr) {
    if (swr.installing) {
      dump('Client context: registration has an installing worker (' +
           swr.installing.state + ')!\n');
    }
    if (swr.waiting) {
      dump('Client context: registration has an waiting worker (' +
           swr.waiting.state + ')!\n');
    }
    if (swr.active) {
      dump('Client context: registration has an active worker (' +
           swr.active.state + ')!\n');
    }
  }

  if ('serviceWorker' in navigator) {
    document.getElementById('register-worker').onclick = function() {
      navigator.serviceWorker.register('service.js', {scope: './'}).then(
        swr => {
          dumpSwr(swr);

          window.onmessage = function(msg) {
            if (msg.data === 'READY') {
              swr.active.postMessage('ping');
            } else {
              dump('Client context. Message from service worker: ' + msg.data + '\n');
            }
          };
          var content = document.getElementById('content');
          var iframe = document.createElement('iframe');
          iframe.setAttribute('src', 'test.html');
          if (!content) {
            dump('Client context: unable to append child!\n');
            return;
          }
          content.appendChild(iframe);
        },
        error => {
          dump('Client context: ' + error + '\n');
      });
    };

    document.getElementById('check-controller').onclick = function() {
      if (!navigator.serviceWorker.controller) {
        dump('Client context: no navigator.serviceWorker.controller object!\n');
        return;
      }
      dump('Client context: navigator.serviceWorker.controller.state is ' +
           (navigator.serviceWorker.controller.state)+ '\n');
    };

    document.getElementById('check-registration').onclick = function() {
      navigator.serviceWorker.getRegistration().then(swr => {
        if (!swr) {
          dump('Client context: no navigator.serviceWorker.getRegistration() result!\n');
          return;
        }
        dumpSwr(swr);
      });
    };

    document.getElementById('unregister-registration').onclick = function() {
      navigator.serviceWorker.getRegistration().then(swr => {
        if (!swr) {
          dump('Client context: no navigator.serviceWorker.getRegistration() result!\n');
          return;
        }
        swr.unregister().then(result => {
          dump('Client context: unregister registration ' +
               (result ? 'succeed' : 'failed') + '!\n');
        });
      });
    };
  }
});
