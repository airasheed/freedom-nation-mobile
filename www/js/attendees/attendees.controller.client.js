(function() {

    'use strict'

    /**
     * The Attendees controller for the app. The controller:
     * - retrieves and persists the attendees model from Podio API via the Attendee service
     * - exposes the model to the template
     */
    angular
        .module('app.attendees')
        .controller('AttendeesController', AttendeesController);

    AttendeesController.$inject = ['$scope','Podio','$ionicLoading','$state','attendees'];

    function AttendeesController ($scope,Podio,$ionicLoading,$state,attendees) {

            $ionicLoading.show({
                content: 'Loading',
                animation:'fade-in',
                showBackdrop: true
            });

            Podio.podio.isAuthenticated()
                .catch(function(error) {
                    $state.go('login');
                    $ionicLoading.hide();
                    console.log(error);
                })
                .then(function() {
                    $scope.attendees = attendees;
                    $ionicLoading.hide();
                });

    }


})();