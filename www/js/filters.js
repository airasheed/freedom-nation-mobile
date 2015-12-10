(function () {

    'use strict'

    /**
     * Created by Rasheed on 9/16/15.
     */
    angular
        .module('app.filters', [])
        .filter('htmlToPlainText', htmlToPlainText);

    function htmlToPlainText () {
        /*
         * Removes HTML from string
         */

        return function(text) {
            return text ? String(text).replace(/<[^>]+>/gm, '') : '';
        };
    }

})();