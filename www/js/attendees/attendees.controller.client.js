(function() {

    'use strict'

    /**
     * The Attendees controller for the app. The controller:
     * - retrieves and persists the attendees model from Podio API via the Attendee service
     * - exposes the model to the template
     */
    angular
        .module('app.attendees')
        .controller('AttendeesController', AttendeesController);

    AttendeesController.$inject = ['$scope','attendees'];

    function AttendeesController ($scope,attendees) {

        $scope.attendees = attendees;

    }


})();