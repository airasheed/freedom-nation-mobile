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

    AttendeesController.$inject = ['$scope','attendees','$stateParams','AttendeeService','EventService','exception'];

    function AttendeesController ($scope,attendees,$stateParams,AttendeeService,EventService,exception) {

        $scope.eventId = $stateParams.eventId;
        if($stateParams.attendeeIds){
            $scope.attendeeIds = JSON.parse($stateParams.attendeeIds);
        }
        $scope.attendees = attendees;
        $scope.empty = (!attendees) ? true : false;
        $scope.pullRefresh = pullRefresh;


        //////////////////////////

        function pullRefresh() {
            EventService.getEvent($scope.eventId, true)
                .then(getEventComplete)
                .then(refreshAttendees)
                .catch(exception.catcher('Refresh Error'));
        }

        function getEventComplete(response) {
            if(response.attendees) {
                var attendeeIds = JSON.parse(response.attendees);
                return AttendeeService.getAttendees(attendeeIds,$scope.eventId,true);
            }
        }

        function refreshAttendees(response) {
            if(response) {
                $scope.attendees = response;
                $scope.empty = false;
            }
            $scope.$broadcast('scroll.refreshComplete');
        }


    }



})();