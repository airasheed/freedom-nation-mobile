/**
 * The Event Detail controller for the app. The controller:
 * - retrieves and persists the events model from Podio API via the Event service
 * - exposes the model to the template
 */

angular.module('freedomnation.controllers')
    .controller('EventDetailsCtrl', ['$scope', '$stateParams', '$cordovaBarcodeScanner', '$state', 'Podio', '$ionicLoading', 'event',function ($scope, $stateParams, $cordovaBarcodeScanner, $state,Podio, $ionicLoading,event) {


        $ionicLoading.show({
            content: 'Loading',
            animation:'fade-in',
            showBackdrop: true
        });

        var eventId = $stateParams.eventId;

        $scope.attendeeId = '';
        $scope.eventId = $stateParams.eventId;


        Podio.podio.isAuthenticated()
            .catch(function() {
                $ionicLoading.hide();
                $state.go('login');
            })
            .then(function() {
                return event.getEvent(eventId);
            })
            .catch(function(error) {
                console.log(error);
            })
            .then(function(data) {
                $scope.event = data;
            })
            .then(function() {
                $ionicLoading.hide();
                $scope.attending = true;
            });


        $scope.attendeeIdTest = 316650571;

        $scope.doRefresh = function () {
            console.log('Page refreshed');
            $scope.$broadcast('scroll.refreshComplete');
        };

        $scope.scanBarcode = function () {

            console.log('scanbar code here');

            $cordovaBarcodeScanner.scan()
                .then(function (imageData) {
                    alert(imageData);
                    /*if (imageData.text != null) {
                     $state.go('tab.attendee-detail', {
                     eventId: $scope.eventId,
                     attendeeId: imageData.text
                     });
                     } else {
                     alert('Invalid Member');
                     $state.go('tab.event-detail', {eventId: $scope.eventId});

                     }*/
                })
                .catch(function (error) {
                    alert('An error occurred -> ' + error);
                });

        };

    }]);
