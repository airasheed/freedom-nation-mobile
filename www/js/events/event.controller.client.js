/**
 * The Event Detail controller for the app. The controller:
 * - retrieves and persists the events model from Podio API via the Event service
 * - exposes the model to the template
 */

angular.module('freedomnation.controllers')
    .controller('EventDetailsCtrl', ['$scope','$cordovaBarcodeScanner', '$stateParams', '$state', 'Podio', '$ionicLoading','event','attendee',function ($scope,$cordovaBarcodeScanner, $stateParams, $state,Podio, $ionicLoading,event,attendee) {


        $ionicLoading.show({
            content: 'Loading',
            animation:'fade-in',
            showBackdrop: true
        });

        $scope.attendeeId = '';
        $scope.eventId = $stateParams.eventId;


        Podio.podio.isAuthenticated()
            .catch(function() {
                $ionicLoading.hide();
                $state.go('login');
            })
            .then(function() {
                return event.getEvent($scope.eventId);
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


        $scope.scanBarcode = function () {

            //Scanbarcode
            $cordovaBarcodeScanner.scan()
                .then(function (imageData) {
                    attendee.getAttendeeByBarcode(imageData.text)
                        .then(function(response) {
                            $state.go('tab.attendee-detail',
                                {
                                    eventId: $scope.eventId,
                                    attendeeId: response.id,
                                    attending: false
                                });
                        })
                        .catch(function(error) {
                            alert(error);
                        });
                })
                .catch(function (error) {
                    alert('An error occurred -> ' + error);
                });

        };

    }]);
