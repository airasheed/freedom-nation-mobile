(function() {
    'use strict';
    angular
        .module('app')
        .factory('utilsService', utilsService);


    function utilsService() {

        var service = {
            convertDataUrl: convertDataUrl
        };

        return service;


        function convertDataUrl(rawImg) {
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
})();