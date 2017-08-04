/**
 * This file defines the configuration of how the different views (forms) are shown
 */
var mainApp = angular.module("mainApp", ['ngRoute']);
/*This function shows a view and matches it with its respective controller*/
mainApp.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
	when('/viewPerson', {
		templateUrl: 'viewPerson.htlm',
		/*controller: 'ViewPersonControler'*/
	}).
	when('/createPerson', {
		templateUrl: 'createPerson.htlm',
		/*controller: 'CreatePersonControler'*/
	}).
	when('/modifyPerson', {
		templateUrl: 'modifyPerson.htlm',
		/*controller: 'ModifyPersonControler'*/
	}).
	when('/removePerson', {
		templateUrl: 'removePerson.htlm',
		/*controller: 'RemovePersonControler'*/
	}).
	otherwise({
		redirectTo: 'viewPerson'/*The reference to the main or default view  goes here*/
	});
}]);