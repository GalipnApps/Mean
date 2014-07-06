/******************
Main Controllers
******************/
var ProjectManagementApp = angular.module('projectmanageApp', ['ngRoute','projectManagement', 'ng-breadcrumbs']);
 
ProjectManagementApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
		when('/home',{
			templateUrl:'partials/home.html',
			controller: 'loginpageController',
			label: 'Home',
		}).
		when('/home/manage_projects',{
			templateUrl:'partials/manage_projects.html',
			controller: 'manageProjectsController',
			label: 'manage_projects',
		}).
		when('/home/manage_users',{
			templateUrl:'partials/manage_users.html',
			controller: 'manageUsersController',
			label: 'manage_users',
		}).
		when('/home/manage_projects/addProject',{
			templateUrl:'partials/addProject.html',
			controller: 'manageProjectsController',
			label: 'addProject',
		}).
		when('/home/manage_users/addUser',{
			templateUrl:'partials/addUser.html',
			controller: 'manageUsersController',
			label: 'addUser',
		}).
		when('/home/projects/manage_backlogs/addBacklog',{
			templateUrl:'partials/newBacklogItem.html',
			controller: 'myProjectBackLogController',
			label: 'addBacklog',
		}).
		when('/home/projects/manage_backlogs',{
			templateUrl:'partials/manage_backlogs.html',
			controller: 'myProjectBackLogController',
			label: 'manage_backlogs',
		}).
		when('/home/projects/manage_sprints',{
			templateUrl:'partials/manage_sprints.html',
			controller: 'mySprintController',
			label: 'manage_sprints',
		}).
		when('/home/projects/manage_sprints/addSprint',{
			templateUrl:'partials/addSprint.html',
			controller: 'mySprintController',
			label: 'addSprint',
		}).
		when('/home/projects/manage_sprints/manage_tasks/addTask',{
			templateUrl:'partials/new_task.html',
			controller: 'myTaskController',
			label: 'addTask',
		}).
		when('/home/projects/manage_sprints/manage_tasks',{
			templateUrl:'partials/manage_tasks.html',
			controller: 'myTaskController',
			label: 'manage_tasks',
		}).
		when('/home/projects',{
			templateUrl:'partials/myProjects.html',
			controller: 'myProjectsController',
			label: 'projects',
		}).
		otherwise({
			redirectTo: '/home'
		});
	}
 ]);

 
ProjectManagementApp.run(function ($rootScope){
	// $rootScope.sprintProjectName = ''; //global variable
	$rootScope.taskSprintProjectName= '';
});

  
  
  
  
  