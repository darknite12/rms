angular.module('rmsdmgui', ['ngRoute', 
	'rmsdmgui.person.controllers', 
	'rmsdmgui.person.services', 
	'rmsdmgui.address.services',
	'rmsdmgui.organization.services'])
.config(function($routeProvider, $httpProvider) {
    $routeProvider.when('/persons', {
      templateUrl : '../persons.html',
      controller : 'PersonsController',
      controllerAs: 'controller'
    }).when('/persons/:id', {
      templateUrl : '../person.html',
      controller : 'PersonController',
      controllerAs: 'controller'
    }).when('/newperson', {
    	templateUrl : '../person.html',
    	controller : 'NewPersonController',
    	controllerAs : 'controller'
    }).otherwise('/');
});