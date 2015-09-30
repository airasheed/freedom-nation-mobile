/*global angular */

/**
 * The main Freedom Nation app module
 *
 * @type {angular.Module}
 */

angular.module('freedomnation', ['ionic', 'ngCordova','ngMessages', 'freedomnation.controllers', 'freedomnation.services','freedomnation.filters'])

.run(function($ionicPlatform,$rootScope,$state,$stateParams, $http,$localstorage) {

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
        controller: 'EventsCtrl',
        resolve: {
          events: function (EventService) {
            return EventService;
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
            controller: 'EventDetailsCtrl',
            resolve: {
              event : function(EventService) {
                return EventService;
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
            controller: 'AttendeesCtrl',
            resolve: {
              attendees : function(AttendeeService) {
                return AttendeeService;
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
            controller: 'AttendeeDetailCtrl',
            resolve: {
              attendee : function(AttendeeService) {
                return AttendeeService;
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
        templateUrl: 'views/login.html'
      });

      $urlRouterProvider.otherwise('/tab/events');

});
