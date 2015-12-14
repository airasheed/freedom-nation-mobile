(function () {

    'use strict'

    angular
        .module('app')
        .constant('$ionicLoadingConfig',{
            content: '<ion-spinner></ion-spinner>',
            animation: 'fade-in',
            showBackdrop: true
        })
        .constant('DEFAULT_IMG',{
            event: 'img/freedom-nation-default-event.jpg'
        })
})();