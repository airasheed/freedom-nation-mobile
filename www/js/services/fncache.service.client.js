(function() {
    'use strict';
    angular
        .module('app')
        .factory('fnCache', fnCache);


    fnCache.$inject = ['$cacheFactory'];

    function fnCache($cacheFactory) {
        /*
         * Main Cache Object
         * */
        return $cacheFactory('fnCache');

    }
})();