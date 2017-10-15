angular.module('rmsdmgui', ['ngRoute', 'rmsdmgui.person.controllers', 'rmsdmgui.person.services'])
.config(function($routeProvider, $httpProvider) {
    $routeProvider.when('/persons', {
      templateUrl : '../persons.html',
      controller : 'PersonsController',
      controllerAs: 'controller'
    }).when('/persons/:id', {
      templateUrl : '../person.html',
      controller : 'PersonController',
      controllerAs: 'controller'
    }).otherwise('/');
});