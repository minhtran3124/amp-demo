'use strict';

angular.module('todos.user-info-header', ['ngCookies'])
  .directive('todosUserInfoHeader', function() {
    return {
      restrict: 'AE',
      replace: true,
      scope: true,
      templateUrl: 'views/directives/user-info.html',
      controller: ['$scope', '$rootScope', '$cookieStore', '$state',
        function ($scope, $rootScope, $cookieStore, $state) {
          $scope.showHeaderUser = true;

          $rootScope.$on('$stateChangeSuccess', function() {
            $scope.showHeaderUser = !!$rootScope.userInfo;
          });

          $scope.signOut = function() {
            $scope.showHeaderUser = false;
            $cookieStore.remove('userInfo');
            $rootScope.userInfo = null;
            $state.go('login', {}, {location:'replace'});
          };
        }]
    };
  })
  ;
