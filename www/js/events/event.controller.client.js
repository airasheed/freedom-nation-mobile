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

    EventController.$inject = ['$scope','$cordovaBarcodeScanner', '$stateParams', '$state','event','attendee','EventService','exception'];

    function EventController($scope,$cordovaBarcodeScanner, $stateParams, $state,event,attendee,EventService,exception) {


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

                            return attendee.getAttendeeByBarcode(imageData.text)
                                .then(function(response) {
                                    if(response == 'not found'){
                                        notFound();
                                        return;
                                    }

                                    //see if attendee list is empty
                                    var empty = ($scope.event.attendees == undefined) ? true : false;
                                    var onList;

                                    //see if attendee is on list
                                    if(!empty) {
                                        onList = ($scope.event.attendees.indexOf(response.id) > -1) ? true : false;
                                    }

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

                                });
                        });
                });
        }

        function pullRefresh() {
            EventService.getEvent($scope.eventId,true)
                .then(refreshEvent)
                .catch(exception.catcher('Refresh Error'))
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

        function notFound() {
            navigator.notification.alert(
                'Citizen Not Found',  // message
                null,         // callback
                'Freedom Nation',            // title
                'Ok'                  // buttonName
            );
        }
    }


})();

