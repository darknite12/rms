var app = angular.module('rmsdmgui.person.services', []);

app.service('PersonService', [ '$http', function($http) {
	this.getAllPersons = function getAllPersons() {
		return $http({
			method : 'GET',
			url : 'http://localhost:8080/persons/'
		});
	}
	
	this.getPerson = function getPerson(id){
		return $http({
          method: 'GET',
          url: 'http://localhost:8080/persons/' + id.id
        });
	}
	
}]);