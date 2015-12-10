(function () {

    'use strict'

    angular
        .module('app')
        .factory('Podio', Podio);

    Podio.$inject = ['$localstorage'];

    function Podio ($localstorage) {

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
    }

})();