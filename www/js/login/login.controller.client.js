(function () {

    'use strict'

    angular
        .module('app.login')
        .controller('LoginController', LoginController);


    LoginController.$inject = ['$scope', '$state','Podio', '$ionicPopup'];


    function LoginController ($scope,$state,Podio, $ionicPopup) {

        /*
         * Initialize Login Info
         * */
        $scope.auth = { email: '', password: ''};
        $scope.signIn = signIn;
        $scope.showAlert = showAlert;


        /*
         * Sign-in Behavior
         * @param {Object} Form Object
         */
        function signIn(form) {
            if(form.$valid) {

                Podio.podio.authenticateWithCredentials(
                    form.email.$modelValue,
                    form.password.$modelValue,
                    authenticationHandler
                );

            }else{
                console.log('Form Invalid');
            }

        }


        /*
         * Login Error Alert Function
         */
        function showAlert () {
            var alertPopup = $ionicPopup.alert({
                title: 'Login Unsuccesful!',
                cssClass: 'login-alert',
                template: 'Please Try Again!',
                okType: 'button-dark'
            });
        }

        /*
        * SignIn Call Back
        * */

        function authenticationHandler(error) {
                if (error) {
                    $scope.showAlert()
                } else {
                    $state.go('tab.events');
                }
            }
        }

})();
