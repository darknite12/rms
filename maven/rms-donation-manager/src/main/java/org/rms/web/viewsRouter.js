/**
 * This file defines the configuration of how the different views (forms) are shown
 */
var mainApp = angular.module("mainApp", ['ngRoute']);

mainApp.config(['$routeProvider',
	/*This function shows a view and matches it with its respective controller*/
	function($routeProvider) {
		$routeProvider.
		when('/viewPerson', {
			templateUrl: 'viewPerson.htlm',
			controller: 'viewPersonControler'
		}).
		when('/createPerson', {
			templateUrl: 'createPerson.htlm',
			controller: 'createPersonControler'
		}).
		when('/modifyPerson', {
			templateUrl: 'modifyPerson.htlm',
			controller: 'modifyPersonControler'
		}).
		when('/removePerson', {
			templateUrl: 'removePerson.htlm',
			controller: 'removePersonControler'
		}).
		otherwise({
			redirectTo: 'viewPerson'/*The reference to the main or default view  goes here*/
			});
	}
]);