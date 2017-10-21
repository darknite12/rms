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
	
	this.updatePersonAddress = function updatePersonAddress(address, address2, city, province, postalCode, poBox, addressUrl) {
		return $http({
			method : 'PATCH',
			url : addressUrl,
			data : {
				address : address,
				address2 : address2,
				city : city,
				province : province,
				postalCode : postalCode,
				poBox : poBox
			}
		});
	}
	
	
}]);