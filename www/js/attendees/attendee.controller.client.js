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
            $scope.attending = true;
            $scope.addToEvent = addToEvent;
            $scope.attendee = attendee;

            if($stateParams.attending == false) {
                $scope.attending = false;
            }


            function addToEvent () {
                $ionicLoading.show();
                console.log(eventId);
                fnCache.remove('attendees:' + eventId);
                AttendeeService.addToEvent(eventId,attendeeId)
                    .then(function(response) {

                        if(response !== null) {
                            $ionicLoading.hide();
                            $ionicPopup.alert({
                                title: 'Confirmation',
                                template: 'Member Added'
                            })
                                .then(function(res) {
                                    $ionicHistory.goBack();
                                });
                        }
                    })
                    .catch(function(error) {
                        console.log(error);
                    })
            }

        }

})();