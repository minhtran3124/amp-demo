'use strict';
angular
  .module('todos.users', ['ui.router'])

  .config(function($stateProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        views: {
          'main': {
            controller: 'LoginCtrl',
            templateUrl: 'views/users/login.html'
          }
        },
        params: {
          userInfo : null
        },
        data: {
          pageTitle: 'Login'
        }
      })
      .state('sign-up', {
        url: '/sign-up',
        views: {
          'main': {
            controller: 'SignUpCtrl',
            templateUrl: 'views/users/sign-up.html'
          }
        },
        data: {
          pageTitle: 'SignUp'
        }
      });
  })
  .controller('LoginCtrl', ['$scope', '$rootScope', '$state', '$cookieStore', 'UserService',
    function LoginCtrl ($scope, $rootScope, $state, $cookieStore, UserService) {

      // remove $cookieStore
      $cookieStore.remove('userInfo');

      $scope.login = function () {
        var data = {
          email : $scope.email,
          password : $scope.password
        };

        UserService.loginAccount(data)
          .then(function(userInfo) {
            $rootScope.userInfo = userInfo;
            $cookieStore.put('userInfo', userInfo);
            $state.go('projects', {}, {location:'replace'});
          })
          .catch(function() {
            $scope.alertMessage = true;
          });
      };

      // redirect to sign-up page
      $scope.redirectRegisterAccount = function () {
        $state.go('sign-up', {}, {location:'replace'});
      };
    }
  ])
  .controller('SignUpCtrl', ['$scope', '$state', 'UserService',
    function SignUpCtrl ($scope, $state, UserService) {

      $scope.resgiterAccount = function () {
        var data = {
          email : $scope.email,
          password : $scope.password
        };

        UserService.registerAccount(data)
          .then(function() {
            $state.go('login', {}, {location:'replace'});
          })
          .catch(function() {
            $scope.alertMessage = true;
          });
      };
    }
  ]);
