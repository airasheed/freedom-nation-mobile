
/**
 * The Attendee controller for the app. The controller:
 * - retrieves and persists the individual attendee model data from Podio API via the Attendee service
 * - exposes the model to the template
 */

angular.module('freedomnation.controllers')
    .controller('AttendeeDetailCtrl', ['$scope', '$state', '$stateParams', 'Podio', '$ionicLoading', '$http','attendee','$ionicPopup','$ionicHistory', function ($scope, $state, $stateParams, Podio, $ionicLoading, $http,attendee, $ionicPopup,$ionicHistory) {

        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true
        });


        var eventId = $stateParams.eventId,
            attendeeId = $stateParams.attendeeId;
        $scope.attending = true;
        $scope.addToEvent = addToEvent;

        if($stateParams.attending == false) {
            $scope.attending = false;
        }
        Podio.podio.isAuthenticated()
            .catch(function() {
                $ionicLoading.hide();
                $state.go('login');
            })
            .then(function() {
                $scope.attendee = attendee;
                $ionicLoading.hide();
            });



         function addToEvent () {
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true
            });

            attendee.addToEvent(eventId,attendeeId)
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
        };

    }]
);
