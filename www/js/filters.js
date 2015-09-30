/**
 * Created by Rasheed on 9/16/15.
 */
angular.module('starter.filters', [])
    .filter('htmlToPlainText', function () {
        return function(text) {
            return text ? String(text).replace(/<[^>]+>/gm, '') : '';
        };
    });