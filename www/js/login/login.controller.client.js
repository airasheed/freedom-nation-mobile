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

        Podio.podio.isAuthenticated()
        .then(function () {
                console.log('im here');
            $state.go('tab.events');
        });



        /*
         * Sign-in Behavior
         * @param {Object} Form Object
         */
        function signIn(form) {
            if(form.$valid) {
                Podio.podio.authenticateWithCredentials(form.email.$modelValue, form.password.$modelValue, function (error) {
                    console.log(error);
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
    }
})();
