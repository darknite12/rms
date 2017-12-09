angular.module('rmsdmgui', ['ngRoute', 
	'rmsdmgui.person.controllers',
	'rmsdmgui.person.services', 
	'rmsdmgui.address.services',
	'rmsdmgui.ticket.controllers',
	'rmsdmgui.ticket.services',
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
    }).when('/tickets', {
    	templateUrl : '../tickets.html',
    	controller : 'TicketsController',
    	controllerAs : 'controller'
    }).when('/newticket', {
    	templateUrl : '../ticket.html',
    	controller : 'NewTicketController',
    	controllerAs : 'controller'
    }).otherwise('/');
});