(function () {

    'use strict'

    /**
     * The Event Detail controller for the app. The controller:
     * - retrieves and persists the events model from Podio API via the Event service
     * - exposes the model to the template
     */

    angular
        .module('app.events')
        .controller('EventController',EventController);

    EventController.$inject = ['$scope','$cordovaBarcodeScanner', '$stateParams', '$state', 'Podio', '$ionicLoading','event','attendee'];

    function EventController($scope,$cordovaBarcodeScanner, $stateParams, $state,Podio, $ionicLoading,event,attendee) {


        $scope.attendeeId = '';
        $scope.eventId = $stateParams.eventId;
        $scope.scanBarcode = scanBarcode; //bindable function

        Podio.podio.isAuthenticated()
            .catch(function() {
                $state.go('login');
            })
            .then(function() {
                return $scope.event = event;
            })
            .then(function() {
                $scope.attending = true;
            });


        function scanBarcode () {

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

        }

    }


})();

