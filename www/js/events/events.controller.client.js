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

        EventsController.$inject = ['$scope','events','EventService'];

        function EventsController ($scope,events,EventService) {

            $scope.events = events;
            $scope.pullRefresh = pullRefresh;

            //
            function pullRefresh() {
                EventService.getEvents(true)
                    .then(refreshEvent);
            }

            function refreshEvent(response) {

                $scope.events = response;
                $scope.$broadcast('scroll.refreshComplete');
            }
        }

}
)();
