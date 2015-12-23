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

    EventController.$inject = ['$scope','$cordovaBarcodeScanner', '$stateParams', '$state','event','attendee','EventService','exception','logger'];

    function EventController($scope,$cordovaBarcodeScanner, $stateParams, $state,event,attendee,EventService,exception,logger) {


        //Public Variables
        $scope.attendeeId = '';
        $scope.eventId = $stateParams.eventId;
        $scope.event = event;
        $scope.attending = true;

        //Public Methods
        $scope.scanBarcode = scanBarcode; //bindable function
        $scope.pullRefresh = pullRefresh;

        /////////////////////////////

        /*
        * Scan Bar Code
        * */
        function scanBarcode () {
            //Scanbarcode
            $cordovaBarcodeScanner.scan()
                .then(scanBarcodeComplete)
                .catch(exception.catcher('Couldn\'t read Barcode'));

            /*
             * Scan Bard Code Complete
             * */
            function scanBarcodeComplete(imageData) {
                EventService.getEvent($scope.eventId, true)
                    .then(function (response) {
                        $scope.event = response;
                        return attendee.getAttendeeByBarcode(imageData.text);
                    })
                    .then(getAttendeeBarcodeComplete)
                    .catch(exception.catcher);
            }
        }


        /*
        * Get AttendeeByBarCode Complete
        * */
        function getAttendeeBarcodeComplete(response) {

            var attendeeId = response.id;
            //If attendee not found return error.
            if(response == 'not found'){
                notFound();
                return;
            }

            //If there are attendees
            //If onlist display already attending alert if not display attendee
            if($scope.event.attendees) {
                ($scope.event.attendees.indexOf(attendeeId) > -1) ? attendingAlert() : displayAttendee(attendeeId);
            }else{
                displayAttendee(attendeeId);
            }

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

        function attendingAlert() {
            logger.info('Citizen already Attending','','Freedom Nation');
        }

        function notFound() {
            logger.info('Citizen Not Found','','Freedom Nation');
        }

        function displayAttendee(id) {
            $state.go('tab.attendee-detail',
                {
                    eventId: $scope.eventId,
                    attendeeId: id,
                    attending: false,
                    refresh: true
                });
        }
    }

})();

