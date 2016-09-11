'use strict';

angular.module('todos')
	.factory('TodoServices', function(Restangular) {
    var todoService = {},
        _todoAPI = Restangular.withConfig(function(RestangularConfigurer) {
          RestangularConfigurer.setBaseUrl('http://localhost:3000');
        }),
        baseAccounts = _todoAPI.all('api');

    todoService.get = function(projectId) {
      return baseAccounts.one('projects', projectId).all('todos').getList();
    };

    todoService.create = function(todoData) {
      return baseAccounts.one('projects', todoData.project).all('todos').post(todoData);
    };

    todoService.update = function(todo, projectId) {
      return baseAccounts.one('projects', projectId).one('todos', todo._id).customPOST(todo);
    };

    todoService.delete = function(todoId, projectId) {
      return baseAccounts.one('projects', projectId).one('todos', todoId).remove();
    };

    return todoService;
  })

  .factory('ProjectsService', function(Restangular){
    var projectService = {},
        _todoAPI = Restangular.withConfig(function(RestangularConfigurer) {
          RestangularConfigurer.setBaseUrl('http://localhost:3000');
        }),
        baseAccounts = _todoAPI.all('api');

    projectService.get = function(userId) {
      return baseAccounts.one('projects', userId).getList();
    };

    projectService.create = function(data) {
      return baseAccounts.one('projects', data.userId).post(null, data);
    };

    projectService.delete = function(projectId) {
      return baseAccounts.one('projects', projectId).remove();
    };

    return projectService;
  });
