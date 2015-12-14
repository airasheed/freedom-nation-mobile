(function () {

    'use strict'


    /**
     * The Attendee controller for the app. The controller:
     * - retrieves and persists the individual attendee model data from Podio API via the Attendee service
     * - exposes the model to the template
     */

    angular
        .module('app.attendees')
        .controller('AttendeeController', AttendeeController);

    AttendeeController.$inject =  ['$scope', '$state', '$stateParams', '$ionicLoading','attendee','$ionicPopup','$ionicHistory','AttendeeService','fnCache'];

    function AttendeeController($scope, $state, $stateParams, $ionicLoading,attendee, $ionicPopup,$ionicHistory,AttendeeService,fnCache) {


            var eventId = $stateParams.eventId,
                attendeeId = $stateParams.attendeeId;
            $scope.attending = ($stateParams.attending) ? true : false;
            $scope.attendee = attendee;
            $scope.addToEvent = addToEvent;
            $scope.pullRefresh = pullRefresh;
            $scope.goBack = goBack;


            function addToEvent () {
                $ionicLoading.show();

                AttendeeService.addToEvent(eventId,attendeeId)
                    .then(function(response) {
                        if(response !== null) {
                            $ionicLoading.hide();
                            attendedAddedDialog();
                        }
                    })
                    .catch(function(error) {
                        console.log(error);
                    })
            }

        function pullRefresh() {
            AttendeeService.getAttendee(attendeeId,true)
                .then(refreshEvent);
        }

        function refreshEvent(response) {
            $scope.attendee = response;
            $scope.$broadcast('scroll.refreshComplete');
        }


        function attendedAddedDialog() {
            navigator.notification.alert(
                'Member Added!',  // message
                goBack,         // callback
                'Freedom Nation',            // title
                'Ok'                  // buttonName
            );
        }

        function goBack() {
            $ionicHistory.goBack();
        }
        }

})();