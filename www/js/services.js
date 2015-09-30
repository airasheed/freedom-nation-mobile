angular.module('starter.services', [])
    .factory('Podio', ['$localstorage', function ($localstorage) {

      var podio = new PodioJS({
        authType: 'password',
        clientId: 'fnation',
        clientSecret: '94PMse87ShrpIw3hNv6EqkZLh4foAuIcJkrBrt5pWhsmi8SmmpE7R2djPmgwyw49'
      }, {
        sessionStore: $localstorage
      });

      var eventFieldIds = {
        title: 89107336,
        date: 89107337,
        attendees: 89107415,
        price: 89107340,
        desc: 89107344,
        img: 89107348
      };

      return {
        podio: podio,
        getEvents: function() {

          var res = {};
          podio.request('post', '/item/app/11602319/filter').then(function(response) {
            res = response;
          }, function(error) {
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

