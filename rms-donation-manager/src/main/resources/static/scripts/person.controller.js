angular.module('dmgui', [])
.controller('PersonController', ['$scope','PersonService', function ($scope, PersonService) {
	PersonService.getAllPersons()
		.then(function success(response) {
			$scope.persons = response.data;
			$scope.message='';
			$scope.errorMessage = '';
		}, function error (response) {
			$scope.message='';
			$scope.errorMessage = 'Error getting persons!';
		});
	
	$scope.getPerson = function () {
		var id = $scope.per.url;
        PersonService.getPerson($scope.per.url)
          .then(function success(response){
              $scope.person = response.data;
              $scope.person.id = 3;
              $scope.message='';
              $scope.errorMessage = '';
          },
          function error (response ){
              $scope.message = '';
              if (response.status === 404){
                  $scope.errorMessage = 'Person not found!';
              }
              else {
                  $scope.errorMessage = "Error getting person!";
              }
          });
    }
}])
.service('PersonService', [ '$http', function($http) {
	this.getAllPersons = function getAllPersons() {
		return $http({
			method : 'GET',
			url : 'http://localhost:8080/persons/'
		});
	}
	
	this.getPerson = function getPerson(personURL){
		alert("yo");
        return $http({
          method: 'GET',
          url: personURL
        });
	}
}]);