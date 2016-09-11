'use strict';

angular.module('todos')
  .factory('UserService', function(Restangular) {
    var userServices = {},
    _todoAPI = Restangular.withConfig(function(RestangularConfigurer) {
      RestangularConfigurer.setBaseUrl('http://localhost:3000');
    });

    userServices.registerAccount = function(data) {
      return _todoAPI.all('/api/signup').post(data);
    };

    userServices.loginAccount = function(data) {
      return _todoAPI.all('/api/signin').post(data);
    };

    return userServices;
  });
