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
            'app.login'])

        .run(function($ionicPlatform,$rootScope,$state,$stateParams, $http,$localstorage,$ionicLoading,Podio) {

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
                        .then(function () {
                            console.log('podio is authenticated');
                        })
                        .catch(function(error) {
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

        })

        .config(function($stateProvider, $urlRouterProvider) {

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
                            controller: 'EventsController',
                            resolve: {
                                events: function (EventService) {
                                    return EventService.getEvents();
                                }
                            }
                        }
                    }
                })
                .state('tab.event-detail',{
                    url:'/event/:eventId',
                    views: {
                        'tab-event':{
                            templateUrl: 'views/event.html',
                            controller: 'EventController',
                            resolve: {
                                event : function(EventService,$stateParams) {
                                    return EventService.getEvent($stateParams.eventId);
                                },
                                attendee : function(AttendeeService) {
                                    return AttendeeService;
                                }
                            }
                        }
                    },
                    params: {eventId: null}
                })
                .state('tab.attendees',{
                    url: '/attendees/:attendeeIds',
                    views: {
                        'tab-event':{
                            templateUrl: 'views/attendees.html',
                            controller: 'AttendeesController',
                            resolve: {
                                attendees : function(AttendeeService,$stateParams) {
                                    var attendeeIds = $stateParams.attendeeIds;
                                    if(attendeeIds) {
                                        attendeeIds = JSON.parse(attendeeIds);
                                        var eventId = $stateParams.eventId;
                                        return AttendeeService.getAttendees(attendeeIds, eventId);
                                    }else {
                                        return undefined;
                                    }
                                }
                            }
                        }
                    },
                    params: {
                        eventId: null,
                        attendeeIds: {array:true}
                    }
                })
                .state('tab.attendee-detail',{
                    url: '/attendee/:attendeeId',
                    views: {
                        'tab-event':{
                            templateUrl: 'views/attendee.html',
                            controller: 'AttendeeController',
                            resolve: {
                                attendee : function(AttendeeService,$stateParams) {
                                    return AttendeeService.getAttendee($stateParams.attendeeId);
                                }
                            }
                        }
                    },
                    params:{
                        eventId: null,
                        attendeeId: null,
                        attending: true
                    }
                })
                .state('login', {
                    url: '/login',
                    requireAuthentication: false,
                    templateUrl: 'views/login.html',
                    controller: 'LoginController'
                });

            $urlRouterProvider.otherwise('/tab/events');

        });

})();