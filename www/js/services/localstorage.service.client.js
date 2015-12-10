(function() {
    'use strict';
    angular
        .module('app')
        .factory('$localstorage', localStorageService);

    localStorageService.$inject = ['$window'];

    function localStorageService($window) {

        var service = {
            set: set,
            get: get,
            logOut: logOut
        };

        return service;

        function set (podioOAuth, callback) {
            $window.localStorage.setItem('podioOAuth', JSON.stringify(podioOAuth));
            $window.location.reload();
        }

        function get (authType, callback) {
            var podioOAuth = $window.localStorage.getItem('podioOAuth');
            if (podioOAuth) {
                podioOAuth = JSON.parse(podioOAuth);
            }
            callback(podioOAuth || {});
        }

        function logOut (){
            $window.localStorage.removeItem('podioOAuth');
            $window.location.reload();
        }

    }
})();