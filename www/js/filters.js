/**
 * Created by Rasheed on 9/16/15.
 */
angular.module('freedomnation.filters', [])
    .filter('htmlToPlainText', function () {

        /*
        * Removes HTML from string
        */

        return function(text) {
            return text ? String(text).replace(/<[^>]+>/gm, '') : '';
        };
    });