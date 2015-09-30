angular.module('starter.controllers')
    .controller('AttendeeDetailCtrl', ['$scope', '$state', '$stateParams', 'Podio', '$ionicLoading', '$http','attendee','$ionicPopup','$ionicHistory', function ($scope, $state, $stateParams, Podio, $ionicLoading, $http,attendee, $ionicPopup,$ionicHistory) {

        console.log($ionicHistory);
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true
        });


        var eventId = $stateParams.eventId,
            attendeeId = $stateParams.attendeeId;


        Podio.podio.isAuthenticated()
            .catch(function() {
                $ionicLoading.hide();
                $state.go('login');
            })
            .then(function() {
            return attendee.getAttendee(attendeeId);
            })
            .catch(function(error) {
                console.log(error);
            })
            .then(function(data) {
                $scope.attendee = data;
            })
            .then(function() {
                $ionicLoading.hide();
            });

        $scope.attending = true;

        if($stateParams.attending == false) {
            $scope.attending = false;
        }

        $scope.addToEvent = function () {
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
