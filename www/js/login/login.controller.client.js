(function () {

    'use strict'

    angular
        .module('app.login')
        .controller('LoginController', LoginController);


    LoginController.$inject = ['$scope', '$state','Podio','$ionicLoading','exception'];


    function LoginController ($scope,$state,Podio,$ionicLoading,exception) {

        //exception.catcher('hi')('this is a test');

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
                    exception.catcher('Please Try Again')(error);
                    $ionicLoading.hide();
                    $scope.loginUnsuccesful();

                } else {
                    $state.go('tab.events');
                }
            }
        }

})();
