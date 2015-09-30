/**
 * The Attendees controller for the app. The controller:
 * - retrieves and persists the attendees model from Podio API via the Attendee service
 * - exposes the model to the template
 */
angular.module('freedomnation.controllers')
    .controller('AttendeesCtrl', ['$scope', '$stateParams','Podio','$ionicLoading','$state','attendees', function ($scope,$stateParams,Podio,$ionicLoading,$state,attendees) {

        $ionicLoading.show({
            content: 'Loading',
            animation:'fade-in',
            showBackdrop: true
        });


        $scope.eventId = $stateParams.eventId;

        if($stateParams.attendeeIds !== undefined) {

            var attendeeIds = JSON.parse($stateParams.attendeeIds);

            Podio.podio.isAuthenticated()
                .catch(function(error) {
                    $state.go('login');
                    $ionicLoading.hide();
                    console.log(error);
                })
                .then(function() {
                    return attendees.getAttendees(attendeeIds);
                }).
                then(function(response) {
                    $scope.attendees = response;

                }).then(function () {
                $ionicLoading.hide();
            });
        } else {
            $ionicLoading.hide()
        }





    }]
);
