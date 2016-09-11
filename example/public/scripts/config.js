'use strict';

angular.module('todos', [
    'ui.router',
    'restangular',
    'ngAnimate',
    'ngTouch',
    'ngCookies',
    'ui.bootstrap',
    'todos.users',
    'todos.projects',
    'todos.user-info-header'
  ])
  .constant('AppSettings', {
    'pageTitle': 'Todos App'
  })
  .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', onConfig])
  .run(['$rootScope', '$cookieStore', 'AppSettings', '$location', onRun]);

  function onConfig($stateProvider, $urlRouterProvider, $locationProvider) {
    // catch all route
    $urlRouterProvider.otherwise( '/login' );
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
  }

  function onRun($rootScope, $cookieStore, AppSettings, $location) {
    $rootScope.userInfo = $cookieStore.get('userInfo') || null;

    $rootScope.$on('$stateChangeStart', function () {
        // redirect to login page if not logged in and trying to access a restricted page
        var restrictedPage = !_.includes(['/login', '/sign-up'], $location.path()),
            loggedIn = $rootScope.userInfo;

        if (restrictedPage && !loggedIn) {
          $location.path('/login');
        }
    });

    $rootScope.$on('$stateChangeSuccess', function(event, toState) {
      $rootScope.pageTitle =  AppSettings.pageTitle + ' - ' + toState.data.pageTitle;
    });
  }
