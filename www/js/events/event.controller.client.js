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

    EventController.$inject = ['$scope','$cordovaBarcodeScanner', '$stateParams', '$state','event','attendee','EventService'];

    function EventController($scope,$cordovaBarcodeScanner, $stateParams, $state,event,attendee,EventService) {


        //Public Variables
        $scope.attendeeId = '';
        $scope.eventId = $stateParams.eventId;
        $scope.event = event;
        $scope.attending = true;

        //Public Methods
        $scope.scanBarcode = scanBarcode; //bindable function
        $scope.pullRefresh = pullRefresh;

        /////////////////////////////


        function scanBarcode () {

            //Scanbarcode
            $cordovaBarcodeScanner.scan()
                .then(function (imageData) {
                    EventService.getEvent($scope.eventId,true)
                        .then(function(response) {

                            $scope.event = response;
                            console.log($scope.event.attendees);

                            console.log(imageData.text);
                            attendee.getAttendeeByBarcode(imageData.text)
                                .then(function(response) {

                                    //see if attendee list is empty
                                    var empty = ($scope.event.attendees == undefined) ? true : false;
                                    var onList;

                                    //see if attendee is on list
                                    if(!empty) {
                                        onList = ($scope.event.attendees.indexOf(response.id) > -1) ? true : false;
                                    }
                                    console.log(empty, onList);

                                    if(onList){
                                        alreadyAttendingAlert();
                                    }else{
                                        $state.go('tab.attendee-detail',
                                            {
                                                eventId: $scope.eventId,
                                                attendeeId: response.id,
                                                attending: false,
                                                refresh: true
                                            });
                                    }

                                })
                                .catch(function(error) {
                                    alert(error);
                                });
                        });
                })
                .catch(function (error) {
                    alert('An error occurred -> ' + error);
                });

        }

        function pullRefresh() {
            EventService.getEvent($scope.eventId,true)
                .then(refreshEvent);
        }

        function refreshEvent(response) {
            $scope.event = response;
            $scope.$broadcast('scroll.refreshComplete');
        }

        function alreadyAttendingAlert() {
            navigator.notification.alert(
                'Citizen already Attending!',  // message
                null,         // callback
                'Freedom Nation',            // title
                'Ok'                  // buttonName
            );
        }
    }


})();

