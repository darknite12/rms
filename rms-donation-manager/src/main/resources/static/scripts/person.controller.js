var app = angular.module('rmsdmgui.person.controllers', []);

app.controller('PersonsController', ['$scope','PersonService', '$location', function ($scope, PersonService, $location) {
	PersonService.getAllPersons()
	.then(function success(response) {
		$scope.persons = response.data;
		$scope.message='';
		$scope.errorMessage = '';
	}, function error (response) {
		$scope.message='';
		$scope.errorMessage = 'Error getting persons!';
	});
	
	$scope.modifyPerson = function (personUrl) {
		$location.path(personUrl.split(location.host)[1]);
		
	}
	
}]);

app.controller('PersonController', ['$scope', 'PersonService', '$location', '$routeParams', function ($scope, PersonService, $location, $routeParams) {
	
	$scope.person = PersonService.getPerson({id: $routeParams.id})
	.then(function success(response) {
		$scope.person = response.data;
		$scope.message='';
		$scope.errorMessage = '';
	}, function error (response) {
		$scope.message='';
		$scope.errorMessage = 'Error getting person!';
	});
	
	$scope.updateUser = function () {
		$location.path('/user-list');
	};

	$scope.cancel = function () {
		$location.path('/user-list');
	};
}]);