angular.module('freedomnation.services', [])
    .factory('Podio', ['$localstorage', function ($localstorage) {

      var podio = new PodioJS({
        authType: 'password',
        clientId: 'fnation',
        clientSecret: '94PMse87ShrpIw3hNv6EqkZLh4foAuIcJkrBrt5pWhsmi8SmmpE7R2djPmgwyw49'
      }, {
        sessionStore: $localstorage
      });

      return {
        podio: podio,
        getEvents: function () {

          var res = {};
          podio.request('post', '/item/app/11602319/filter').then(function (response) {
            res = response;
          }, function (error) {
            console.log(error);
          });

          return res;
        }
      };
    }])
    .factory('$localstorage', ['$window', function ($window) {
      return {
        set: function (podioOAuth, callback) {
          $window.localStorage.setItem('podioOAuth', JSON.stringify(podioOAuth));
          $window.location.reload();
        },
        get: function (authType, callback) {
          var podioOAuth = $window.localStorage.getItem('podioOAuth');
          if (podioOAuth) {
            podioOAuth = JSON.parse(podioOAuth);
          }
          callback(podioOAuth || {});
        },
        logOut: function () {
          $window.localStorage.removeItem('podioOAuth');
          $window.location.reload();
        }
      };
    }])
    .factory('utils', function () {
      return {
        convertDataUrl: function (rawImg) {
          var raw = '',
              bytes = new Uint8Array(rawImg.data),
              length = bytes.length;
          for (var i = 0; i < length; i++) {
            raw += String.fromCharCode(bytes[i]);
          }

          var b64 = btoa(raw);
          var dataURL = "data:image/jpeg;base64," + b64;

          return dataURL;
        }
      }

    })
    .factory('fnCache', function ($cacheFactory) {
      /*
      * Main Cache Object
      * */
      return $cacheFactory('fnCache');
    });

