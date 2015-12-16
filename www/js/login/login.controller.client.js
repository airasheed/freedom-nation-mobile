(function () {

    'use strict'

    angular
        .module('app.login')
        .controller('LoginController', LoginController);


    LoginController.$inject = ['$scope', '$state','Podio', '$ionicPopup', '$ionicLoading'];


    function LoginController ($scope,$state,Podio, $ionicPopup,$ionicLoading) {

        $ionicLoading.show();


        Podio.isAuthenticated()
            .then(function () {
                $state.go('tab.events');
            })
            .catch(function(error) {
                $ionicLoading.hide();
         });

        /*
         * Initialize Login Info
         * */
        $scope.auth = { email: '', password: ''};
        $scope.signIn = signIn;
        $scope.loginUnsuccesful = loginUnsuccesful;


        /*
         * Sign-in Behavior
         * @param {Object} Form Object
         */
        function signIn(form) {
            if(form.$valid) {
                $ionicLoading.show();
                Podio.authenticateWithCredentials(
                    form.email.$modelValue,
                    form.password.$modelValue,
                    authenticationHandler
                );

            }else{
                console.log('Form Invalid');
            }

        }


        function loginUnsuccesful() {
            navigator.notification.alert(
                'Username or Password incorrect. Please try again.',  // message
                null,         // callback
                'Freedom Nation',            // title
                'Ok'                  // buttonName
            );
        }

        /*
        * SignIn Call Back
        * */

        function authenticationHandler(error) {
                if (error) {
                    $ionicLoading.hide();
                    $scope.loginUnsuccesful();
                } else {
                    $state.go('tab.events');
                }
            }
        }

})();
