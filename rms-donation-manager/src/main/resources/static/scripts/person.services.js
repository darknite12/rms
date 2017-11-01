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
	
	this.getPersonAddress = function getPersonAddress(id) {
		return $http({
			method: 'GET',
			url: 'http://localhost:8080/persons/' + id.id +'/addresses' 
		})
	}
	
	this.getPersonOrganization = function getPersonOrganization(id) {
		return $http({
			method: 'GET',
			url: 'http://localhost:8080/persons/' + id.id +'/organizations'
		})
	}
	
	this.updatePerson = function updatePerson(id, title, firstName, lastName, contactPerson, 
			spouse, email, homePhoneNumber, cellPhoneNumber, workPhoneNumber, 
			faxPhoneNumber, parish, community, language, benefactorStatus, info) {
	    return $http({
	        method : 'PATCH',
	        url : 'http://localhost:8080/persons/' + id.id,
	        data : {
	        	title : title,
	        	firstName : firstName,
	        	lastName : lastName,
	        	contactPerson : contactPerson,
	        	spouse : spouse,
				email : email,
				homePhoneNumber : homePhoneNumber,
				cellPhoneNumber : cellPhoneNumber,
				workPhoneNumber : workPhoneNumber,
				faxPhoneNumber : faxPhoneNumber,
				parish : parish,
				community : community,
				language : language,
				benefactorStatus : benefactorStatus,
				info : info
	        }
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
			url : 'http://localhost:8080/persons/' + id.id + "/addresses",
			headers: {'Content-Type': 'text/uri-list'},
			data : addressUrl
		});
	}
	
	this.addPersonOrganization = function addPersonOrganization(id, organizationUrl) {
		return $http({
			method : 'POST',
			url : 'http://localhost:8080/persons/' + id.id + "/organizations",
			headers: {'Content-Type': 'text/uri-list'},
			data : organizationUrl
		});
	}
	
	this.deletePersonAddress = function deletePersonAddress(id, addressId) {
		return $http({
			method: 'DELETE',
	        url: 'http://localhost:8080/persons/' + id.id + "/addresses/" + addressId
	    });
	}
	
	this.deletePersonOrganization = function (id, organizationId) {
		return $http({
			method: 'DELETE',
	        url: 'http://localhost:8080/persons/' + id.id + "/organizations/" + organizationId
	    });
	}
	
}]);