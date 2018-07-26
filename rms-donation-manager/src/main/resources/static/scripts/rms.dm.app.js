angular.module('rmsdmgui', ['ngRoute', 
	'rmsdmgui.person.controllers',
	'rmsdmgui.person.services', 
	'rmsdmgui.address.services',
	'rmsdmgui.ticket.controllers',
	'rmsdmgui.ticket.services',
	'rmsdmgui.organization.controllers',
	'rmsdmgui.organization.services',
	'rmsdmgui.general.services',
	'rmsdmgui.price.services',
	'rmsdmgui.event.controllers',
	'rmsdmgui.event.services',
	'rmsdmgui.receipt.controllers',
	'rmsdmgui.receipt.services',
	'rmsdmgui.directives',
	'rmsdmgui.table.controllers',
	'rmsdmgui.table.services'])
.config(function($routeProvider, $httpProvider) {
    $routeProvider.when('/persons', {
        templateUrl : '../persons.html',
        controller : 'PersonsController',
        controllerAs: 'controller'
    }).when('/persons/:id', {
        templateUrl : '../person.html',
        controller : 'PersonController',
        controllerAs: 'controller'
    }).when('/organizations', {
        templateUrl : '../organizations.html',
        controller : 'OrganizationsController',
        controllerAs: 'controller'
    }).when('/organizations/:id', {
        templateUrl : '../organization.html',
        controller : 'OrganizationController',
        controllerAs: 'controller'
    }).when('/neworganization', {
    	templateUrl : '../organization.html',
    	controller : 'NewOrganizationController',
    	controllerAs : 'controller'
    }).when('/tickets', {
    	templateUrl : '../tickets.html',
    	controller : 'TicketsController',
    	controllerAs : 'controller'
    }).when('/tickets/:id', {
    	templateUrl : '../ticket.html',
    	controller : 'TicketController',
    	controllerAs : 'controller'
    }).when('/newticket', {
    	templateUrl : '../ticket.html',
    	controller : 'NewTicketController',
    	controllerAs : 'controller'
    }).when('/sittingTables', {
    	templateUrl : '../tables.html',
    	controller : 'TablesController',
    	controllerAs : 'controller'
    }).when('/sittingTables/:id', {
    	templateUrl : '../table.html',
    	controller : 'TableController',
    	controllerAs : 'controller'
    }).when('/newsittingTable', {
    	templateUrl : '../table.html',
    	controller : 'NewTableController',
    	controllerAs : 'controller'
    }).when('/events', {
    	templateUrl : '../events.html',
    	controller : 'EventsController',
    	controllerAs : 'controller'
    }).when('/events/:id', {
    	templateUrl : '../event.html',
    	controller : 'EventController',
    	controllerAs : 'controller'
    }).when('/receipts', {
    	templateUrl : '../receipts.html',
    	controller : 'ReceiptsController',
    	controllerAs : 'controller'
    }).otherwise('/');
});