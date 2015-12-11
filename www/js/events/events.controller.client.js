(function() {
  'use strict'

    /**
     * The Events controller for the app. The controller:
     * - retrieves and persists the events model from Podio API via the Event service
     * - exposes the model to the template
     */

    angular
        .module('app.events')
        .controller('EventsController', EventsController);

        EventsController.$inject = ['$scope','events'];

        function EventsController ($scope,events) {

            $scope.events = events;

        }

}
)();
