// Ionic Starter App

// var server ="localhost";
//  var port = "3000";
var server = "app.pmtoolbelt.com";
var port = "80";

//register sub modules
angular.module('starter.controllers', []);

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova', 'angularFileUpload'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
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
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html"
    }).state('tab.signin', {
          url: "/signin",
          views: {
              'tab-signin': {
                  templateUrl: 'templates/signin.tab.html',
                  controller: 'AuthenticationCtrl'
              }
          }
      })
    // Each tab has its own nav history stack:

    .state('tab.home', {
      url: '/home',
      views: {
        'tab-home': {
          templateUrl: 'templates/main.tab.html',
          controller: 'WorkOrderCtrl'
        }
      }
    }).state('tab.dash', {
            url: '/dash',
            views: {
                'tab-dash': {
                    templateUrl: 'templates/home.tab.html',
                    controller: 'HomeCtrl'
                }
            }
        })
  .state('tab.timeclock', {
      url: '/timeclock',
      views: {
          'tab-timeclock': {
              templateUrl: 'templates/timeclock.tab.html',
              controller: 'TimeCtrl'
          }
      }
  })
    .state('tab.workorder', {
          url: '/workorder',
          views: {
              'tab-workorder': {
                  templateUrl: 'templates/workorder.tab.html',
                  controller: 'WorkOrderCtrl'
              }
          }
      })
    .state('tab.workorder_detail', {
      url: '/workorder/detail/:workorderId',
      views: {
        'tab-workorder': {
          templateUrl: 'templates/detail-workorder.tab.html',
          controller: 'WorkOrderCtrl'
        }
      }
    })
  .state('tab.workorder_current', {
      url: '/workorder/current',
      views: {
          'tab-workorder': {
              templateUrl: 'templates/current-workorder.tab.html',
              controller: 'WorkOrderCtrl'
          }
      }
  })
  .state('tab.workorder_complete', {
      url: '/workorder/complete/:workorderId',
      views: {
          'tab-workorder': {
              templateUrl: 'templates/complete-workorder.tab.html',
              controller: 'WorkOrderCtrl'
          }
      }
  })
  .state('tab.logout', {
      url: '/auth/signout',
      views: {
          'tab-workorder': {
              templateUrl: 'templates/detail-signin.tab.html',
              controller: 'AccountCtrl'
          }
      }
  })

    .state('tab.account', {
      url: '/account',
      views: {
        'tab-account': {
          templateUrl: 'templates/tab-account.html',
          controller: 'AccountCtrl'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/signin');

});

