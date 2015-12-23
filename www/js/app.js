(function () {

    'use strict'


    /*global angular */

    /**
     * The main Freedom Nation app module
     *
     * @type {angular.Module}
     */

    angular
        .module('app', ['ionic',
            'ngCordova',
            'ngMessages',
            'app.events',
            'app.attendees',
            'app.filters',
            'app.login',
        'blocks.exception',
        ])

        .run(runBlock)

        .config(configure);


    //////////////////////////////////////////////

    runBlock.$inject = ['$ionicPlatform', '$rootScope', '$state', '$stateParams', '$http', '$localstorage', '$ionicLoading', 'Podio'];
    function runBlock($ionicPlatform,$rootScope,$state,$stateParams, $http,$localstorage,$ionicLoading,Podio) {

        $rootScope.$on('loading:show', function () {
            $ionicLoading.show();
        });

        $rootScope.$on('loading:hide', function () {
            $ionicLoading.hide();
        });

        $rootScope.$on('$stateChangeStart', function (event,toState) {

            $rootScope.$broadcast('loading:show');

            if(!toState.hasOwnProperty('requireAuthentication') || toState.requireAuthentication !== false){
                Podio.isAuthenticated()
                    .catch(function() {
                        event.preventDefault();
                        $state.go('login');
                    });
            }

        });

        $rootScope.$on('$stateChangeSuccess', function () {
            $rootScope.$broadcast('loading:hide');
        });

        /*
         * Local Storage Object Used*/
        $localstorage.get('password', function (token) {
            $http.defaults.headers.common['Authorization'] = 'OAuth2 ' + token.accessToken;
        });



        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;

        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)

            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleLightContent();

            }
        });

    }

    configure.$inject = ['$stateProvider', '$urlRouterProvider'];
    function configure($stateProvider, $urlRouterProvider) {


        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider
            // setup an abstract state for the tabs directive
            .state('tab', {
                url: '/tab',
                abstract: true,
                templateUrl: 'views/tabs.html'
            })

            // Each tab has its own nav history stack:

            .state('tab.events', {
                url: '/events',
                views: {
                    'tab-event': {
                        templateUrl: 'views/events.html',
                        controller: 'EventsController as eventsvm',
                        resolve: {
                            events: eventsPrep
                        }
                    }
                },
                params: {refresh:false}
            })
            .state('tab.event-detail',{
                url:'/event/:eventId',
                views: {
                    'tab-event':{
                        templateUrl: 'views/event.html',
                        controller: 'EventController',
                        resolve: {
                            event : eventPrep
                        }
                    }
                },
                params: {eventId: null,refresh: false} //must declare params here,
            })
            .state('tab.attendees',{
                url: '/attendees/:attendeeIds',
                views: {
                    'tab-event':{
                        templateUrl: 'views/attendees.html',
                        controller: 'AttendeesController',
                        resolve: {
                            attendees : attendeesPrep
                        }
                    }
                },
                params: {
                    eventId: null,
                    attendeeIds: {array:true},
                    refresh: false
                }
            })
            .state('tab.attendee-detail',{
                url: '/attendee/:attendeeId',
                views: {
                    'tab-event':{
                        templateUrl: 'views/attendee.html',
                        controller: 'AttendeeController',
                        resolve: {
                            attendee : attendeePrep
                        }
                    }
                },
                params:{
                    eventId: null,
                    attendeeId: null,
                    attending: true,
                    refresh:false
                }
            })
            .state('login', {
                url: '/login',
                requireAuthentication: false,
                templateUrl: 'views/login.html',
                controller: 'LoginController'
            });

        $urlRouterProvider.otherwise('/tab/events');

    }


    eventsPrep.$inject = ['EventService', '$stateParams'];
    function eventsPrep (EventService,$stateParams) {
        return EventService.getEvents($stateParams.refresh);
    }

    eventPrep.$inject = ['EventService','$stateParams'];
    function eventPrep (EventService,$stateParams) {
        var eventId = $stateParams.eventId,
            refresh = $stateParams.refresh;
        return EventService.getEvent(eventId,refresh);
    }

    attendeesPrep.$inject = ['AttendeeService','$stateParams'];
    function attendeesPrep(AttendeeService,$stateParams) {
        var attendeeIds = $stateParams.attendeeIds;
        if(attendeeIds) {
            attendeeIds = JSON.parse(attendeeIds);
            var eventId = $stateParams.eventId,
                refresh = $stateParams.refresh;
            return AttendeeService.getAttendees(attendeeIds, eventId,refresh);
        }else {
            return undefined;
        }
    }

    attendeePrep.$inject = ['AttendeeService', '$stateParams'];
    function attendeePrep(AttendeeService,$stateParams) {
        var attendeeId = $stateParams.attendeeId,
            refresh = $stateParams.refresh;
        return AttendeeService.getAttendee(attendeeId,refresh);
    }
})();