angular.module('starter.controllers')
    .controller('authenticationFormCtrl', ['$scope', '$state','Podio', '$ionicPopup', '$ionicLoading', function ($scope,$state,Podio, $ionicPopup, $ionicLoading) {

        $scope.auth = {
            email: '',
            password: ''
        };

        Podio.podio.isAuthenticated()
            .then(function() {
            $state.go('tab.events');
        });

        $scope.signIn = function(form) {
            console.log('entered signin');
            if(form.$valid) {
                Podio.podio.authenticateWithCredentials(form.email.$modelValue, form.password.$modelValue, function (error) {
                    if (error) {
                        console.log(error);
                        $scope.showAlert()
                    } else {
                        console.log('no error')
                        $state.go('tab.events');
                    }
                });
            }else{
                console.log('Form Invalid');
            }

        };

        // An alert dialog
        $scope.showAlert = function() {
            var alertPopup = $ionicPopup.alert({
                title: 'Login Unsuccesful!',
                cssClass: 'login-alert',
                template: 'Please Try Again!',
                okType: 'button-dark'
            });
        }
    }]);

