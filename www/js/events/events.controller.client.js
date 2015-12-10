(function() {
  'use strict'

    /**
     * The Events controller for the app. The controller:
     * - retrieves and persists the events model from Podio API via the Event service
     * - exposes the model to the template
     */

    angular
        .module('app.events')
        .controller('EventsController', EventsController);

        EventsController.$inject = ['$scope','Podio', '$ionicLoading', 'events', '$state'];

        function EventsController ($scope, Podio, $ionicLoading,events,$state) {

            $ionicLoading.show({
                content: 'Loading',
                animation:'fade-in',
                showBackdrop: true
            });

            $scope.events = [];

            Podio.podio.isAuthenticated()
                .then(function() {
                    $scope.events = events;
                    $ionicLoading.hide();
                })
                .catch(function(error) {
                    console.log(error);
                    $ionicLoading.hide();
                    $state.go('login');
                })


        }

}
)();
