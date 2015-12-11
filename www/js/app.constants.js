(function () {

    'use strict'

    angular
        .module('app')
        .constant('podio', new PodioJS({
            authType: 'password',
            clientId: 'fnation',
            clientSecret: '94PMse87ShrpIw3hNv6EqkZLh4foAuIcJkrBrt5pWhsmi8SmmpE7R2djPmgwyw49'
        }, {
            sessionStore: $localstorage
        }));
})();