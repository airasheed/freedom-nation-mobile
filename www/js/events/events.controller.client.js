
/**
 * The Events controller for the app. The controller:
 * - retrieves and persists the events model from Podio API via the Event service
 * - exposes the model to the template
 */

angular.module('freedomnation.controllers')
    .controller('EventsCtrl', ['$scope','Podio', '$ionicLoading', 'events', '$state', function ($scope, Podio, $ionicLoading,events,$state) {


        $ionicLoading.show({
            content: 'Loading',
            animation:'fade-in',
            showBackdrop: true
        });

        $scope.events = [];

        Podio.podio.isAuthenticated()
            .catch(function(error) {
                $ionicLoading.hide();
                $state.go('login');
            })
            .then(function () {
                return events.getEvents();
            })
            .then(function(response) {
                $scope.events = response;
            }).then(function() {
                $ionicLoading.hide();
            })
            .catch(function(error) {
                console.log(error);
            });

    }]);