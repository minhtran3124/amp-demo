'use strict';
angular
  .module('todos.projects', ['ui.router'])

  .config(function($stateProvider) {
    $stateProvider
      .state('projects', {
        url: '/projects',
        views: {
          'main': {
            controller: 'TodoCtrl',
            templateUrl: 'views/projects/todos-list.html'
          }
        },
        data: {
          pageTitle: 'Project List'
        }
      });
  })

  .controller('TodoCtrl', function($http, $scope, $state, $stateParams, $cookieStore, TodoServices, $uibModal, ProjectsService, $rootScope) {

    // For todo
    $scope.todoTemplate = 'views/projects/todo-template.html';
    $scope.deleteTodo = deleteTodo;
    $scope.addTodo = addTodo;
    $scope.isEdit = -1;
    $scope.editTodo = editTodo;
    $scope.toggleStatus = toggleStatus;

    // For project
    $scope.projectTemplate = 'views/projects/project-template.html';
    $scope.addProject = addProject;
    $scope.selectProject = selectProject;
    $scope.deleteProject = deleteProject;

    // TODO: Assign userId after sign in
    $scope.userInfo = $rootScope.userInfo;
    $scope.userId = $scope.userInfo.userId;

    $scope.toggleEditMode = function(index) {
      $scope.isEdit = index;
    };

    $scope.signOut = function() {
      $cookieStore.remove('userInfo');
      $rootScope.userInfo = {};
      $state.go('login', {}, {location:'replace'});
    };

    /**
     * GET
     * when landing on the page, get all todos and show them
     * use the service to get all the todos
     */

      (function getProjects() {
        return ProjectsService.get($scope.userId)
          .then(function(data) {
            $scope.projects = data;

            if($scope.projects.length > 0) {
              $scope.activeProject = $scope.projects[0];

              TodoServices.get($scope.activeProject._id)
              .then(function(data) {
                $scope.todos = data;
                $scope.projectId = $scope.activeProject._id;
              });
            }
          });
      })();

      (function countTodo() {
        ProjectsService.get($scope.userId)
        .then(function(data) {
          $scope.projects = data;

          if($scope.projects.length > 0) {
            _.forEach($scope.projects, function(project, index) {
              $scope.project = project;
              TodoServices.get($scope.project._id)
              .then(function(data){
                $scope.projects[index].totalTodo = data.length;
              });
            });
          }
        });
      })();

      // countTodo('57c0290db14e871c0a779292');
    /**
     * DELETE
     * delete a todo after checking it
     * [deleteTodo description]
     * @param  {todoId} id
     */
    function deleteTodo(id) {
      var projectId = $scope.projectId;

      TodoServices.delete(id, projectId)
        // if successful creation, call our get function to get all the new todos
        .then(function() {
          $scope.todos = _.reject($scope.todos, { '_id': id });
        });
    }

    /**
     * addProject: call popup to add project
     */
    function addProject() {
      var addProjectModal = $uibModal.open({
        animation: false,
        templateUrl: 'views/projects/project-modal.html',
        windowClass: 'project-modal',
        controller: 'ProjectCtrl',
        resolve: {
          UserId: function() {
            return $scope.userId;
          }
        }
      });

      addProjectModal.result.then(function (data) {
        $scope.projects.push(data);
      });
    }

    /**
     * addTodo: call popup to add todo
     */
    function addTodo() {
      var modalAddTodo = $uibModal.open({
        animation: false,
        templateUrl: 'views/projects/todo-modal.html',
        windowClass: 'todo-modal',
        controller: 'AddTodoCtrl',
        resolve: {
          ProjectId: function() {
            return $scope.projectId;
          },
          Projects: function() {
            return $scope.projects;
          }
        }
      });

      modalAddTodo.result.then(function(todo) {
        if (todo.project === $scope.activeProject._id) {
          $scope.activeProject.totalTodo += 1;
          $scope.todos.push(todo);
        } else {
          var projectAdding = _.find($scope.projects, { '_id': todo.project });
          projectAdding.totalTodo += 1;
        }
      });
    }

    /**
     * editTodo: toggle edit todo mode
     * @param  {Object} todo
     */
    function editTodo(todo) {
      $scope.isEdit = -1;
      var projectId = $scope.projectId;

      TodoServices.update(todo, projectId)
      .then(function(data) {
        todo = data;
      });
    }

    /**
     * toggleStatus
     * @param  {Object} todo
     */
    function toggleStatus(todo) {
      var projectId = $scope.projectId;

      TodoServices.update(todo, projectId)
      .then(function(data) {
        todo = data;
      });
    }

    /**
     * selectProject: get list todo of each project
     * @param  {Object} project
     */
    function selectProject(project) {
      $scope.activeProject = project;

      TodoServices.get($scope.activeProject._id)
        .then(function(data) {
          $scope.todos = data;
        });
    }

    function deleteProject(project) {
      ProjectsService.delete(project._id)
        .then(function() {
          $scope.projects = _.reject($scope.projects, { '_id': project._id });
        });
    }
  })
  .controller('ProjectCtrl', function($http, $scope, ProjectsService, $uibModalInstance, UserId) {
    $scope.userId = UserId;

    $scope.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    };

    $scope.saveProject = function() {
      if (!!$scope.projectName) {
        var data = {
          name: $scope.projectName,
          userId: $scope.userId
        };

        return ProjectsService.create(data)
        .then(function(data){
          $uibModalInstance.close(data);
        });
      }
    };
  })
  .controller('AddTodoCtrl', function($http, $scope, TodoServices, $uibModalInstance, ProjectId, Projects) {
    $scope.projectId = ProjectId;
    $scope.projects = Projects;
    $scope.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    };

    $scope.createTodo = function() {
      if ($scope.content !== undefined) {
        var data = {
          content: $scope.content,
          status: false,
          project: $scope.projectId
        };

        return TodoServices.create(data)
          .then(function(todo) {
            $uibModalInstance.close(todo);
          });
      }
    };
  });
