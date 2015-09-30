angular.module('freedomnation.controllers')
    .controller('authenticationFormCtrl', ['$scope', '$state','Podio', '$ionicPopup', function ($scope,$state,Podio, $ionicPopup) {

        /*
        * Initialize Login Info
        * */
        $scope.auth = {
            email: '',
            password: ''
        };

        Podio.podio.isAuthenticated()
            .then(function () {
                $state.go('tab.events');
            });

        /*
        * Sign-in Behavior
        * @param {Object} Form Object
        */
        $scope.signIn = function(form) {
            if(form.$valid) {
                Podio.podio.authenticateWithCredentials(form.email.$modelValue, form.password.$modelValue, function (error) {
                    console.log(error);
                    if (!error) {
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


        /*
         * Login Error Alert Function
         */
        $scope.showAlert = function() {
            var alertPopup = $ionicPopup.alert({
                title: 'Login Unsuccesful!',
                cssClass: 'login-alert',
                template: 'Please Try Again!',
                okType: 'button-dark'
            });
        }
    }]);

