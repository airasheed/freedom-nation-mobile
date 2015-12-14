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

    AttendeesController.$inject = ['$scope','attendees','$stateParams','AttendeeService','EventService'];

    function AttendeesController ($scope,attendees,$stateParams,AttendeeService,EventService) {

        $scope.eventId = $stateParams.eventId;
        if($stateParams.attendeeIds){
            $scope.attendeeIds = JSON.parse($stateParams.attendeeIds);
        }
        $scope.attendees = attendees;
        $scope.pullRefresh = pullRefresh;


        //////////////////////////

        function pullRefresh() {
            EventService.getEvent($scope.eventId, true)
                .then(function(response) {
                    var attendeeIds = JSON.parse(response.attendees);
                    return AttendeeService.getAttendees(attendeeIds,$scope.eventId,true);
                })
                .then(refreshAttendees);
        }

        function refreshAttendees(response) {
            $scope.attendees = response;
            $scope.$broadcast('scroll.refreshComplete');
        }


    }



})();