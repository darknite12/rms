var app = angular.module('rmsdmgui.person.services', []);

app.service('PersonService', [ '$http', function($http) {
	
	this.getPaginatedPerson = function (size, page) {
		return $http({
			method : 'GET',
			url : 'http://localhost:8080/persons?size=' + size + '&page=' + page + '&sort=firstName&lastName'
		});
	}
	
	this.getAllPersons = function getAllPersons() {
		return $http({
			method : 'GET',
			url : 'http://localhost:8080/persons'
		});
	}
	
	this.getPerson = function getPerson(id){
		return $http({
          method: 'GET',
          url: 'http://localhost:8080/persons/' + id
        });
	}
	
	this.getPersonAddress = function getPersonAddress(id) {
		return $http({
			method: 'GET',
			url: 'http://localhost:8080/persons/' + id +'/addresses' 
		})
	}
	
	this.getPersonOrganization = function getPersonOrganization(id) {
		return $http({
			method: 'GET',
			url: 'http://localhost:8080/persons/' + id +'/organizations'
		})
	}
	
	this.addPerson = function addPerson(person) {
		return $http({
			method : 'POST',
			url : 'http://localhost:8080/persons/',
			data : person
		});
	}
	
	this.updatePerson = function updatePerson(id, person) {
	    return $http({
	        method : 'PATCH',
	        url : 'http://localhost:8080/persons/' + id,
	        data : person
	    });
	}
	
	this.deletePerson = function(personUrl) {
		return $http({
			method: 'DELETE',
	        url: personUrl
	    });
	}
	
	this.searchPerson = function(searchValue, size, page) {
		return $http({
			method : 'GET',
			url : 'http://localhost:8080/persons/search/findBySearchString?searchParameter=' + searchValue + '&size=' + size + '&page=' + page + '&sort=firstName&lastName'
		});
	}
	
	this.updatePersonAddress = function updatePersonAddress(address) {
		return $http({
			method : 'PATCH',
			url : address._links.self.href,
			data : address
		});
	}
	
	this.updatePersonOrganization = function updatePersonOrganization(name ,organizationUrl) {
		return $http({
			method : 'PATCH',
			url : organizationUrl,
			data : {
				name : name
			}
		});
	}
	
	this.addPersonAddress = function addPersonAddress(id, addressUrl){
		return $http({
			method : 'POST',
			url : 'http://localhost:8080/persons/' + id + "/addresses",
			headers: {'Content-Type': 'text/uri-list'},
			data : addressUrl
		});
	}
	
	this.addPersonOrganization = function addPersonOrganization(id, organizationUrl) {
		return $http({
			method : 'POST',
			url : 'http://localhost:8080/persons/' + id + "/organizations",
			headers: {'Content-Type': 'text/uri-list'},
			data : organizationUrl
		});
	}
	
	this.deletePersonAddress = function deletePersonAddress(id, addressId) {
		return $http({
			method: 'DELETE',
	        url: 'http://localhost:8080/persons/' + id + "/addresses/" + addressId
	    });
	}
	
	this.deletePersonOrganization = function (id, organizationId) {
		return $http({
			method: 'DELETE',
	        url: 'http://localhost:8080/persons/' + id + "/organizations/" + organizationId
	    });
	}
	
}]);