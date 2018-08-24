var app = angular.module('rmsdmgui.organization.services', []);

app.service('OrganizationService', ['$http', function($http){
	
	this.getPaginatedOrganization = function (size, number) {
		return $http({
			method : 'GET',
			url : 'http://' + location.host + '/organizations?size=' + size + '&page=' + number + '&sort=name'
		});
	}
	
	this.getAllOrganizations = function getAllOrganizations(){
		return $http({
			method : 'GET',
			url : 'http://' + location.host + '/organizations/'
		});
	}
	
	this.getOrganization = function (id) {
		return $http({
			method: 'GET',
			url: 'http://' + location.host + '/organizations/' + id
	    });
	}
	
	this.getOrganizationAddress = function (id) {
		return $http({
			method: 'GET',
			url: 'http://' + location.host + '/organizations/' + id +'/addresses' 
		})
	}
	
	this.getOrganizationPersons = function (id) {
		return $http({
			method: 'GET',
			url: 'http://' + location.host + '/organizations/' + id +'/persons' 
		})
	}
	
	this.addOrganization = function (organization){
		return $http({
			method : 'POST',
			url : 'http://' + location.host + '/organizations/',
			data : organization
		});
	}
	
	this.addOrganizationAddress = function (id, addressUrl) {
		return $http({
			method : 'POST',
			url : 'http://' + location.host + '/organizations/' + id + "/addresses",
			headers: {'Content-Type': 'text/uri-list'},
			data : addressUrl
		});
	}
	
	this.addOrganizationPerson = function (id, personUrl) {
		return $http({
			method : 'POST',
			url : 'http://' + location.host + '/organizations/' + id + "/persons",
			headers: {'Content-Type': 'text/uri-list'},
			data : personUrl
		});
	}
	
	this.updateOrganization = function (id, organization) {
		return $http({
	        method : 'PATCH',
	        url : 'http://' + location.host + '/organizations/' + id,
	        data : organization
	    });
	}
	
	this.updateOrganizationAddress = function (addressId, address) {
		return $http({
			method : 'PATCH',
			url : 'http://' + location.host + '/addresses/' + addressId,
			data : address
		});
	}
	
	this.deleteOrganization = function (organizationUrl) {
		return $http({
			method: 'DELETE',
	        url: organizationUrl
	    });
	}
	
	this.deleteOrganizationAddress = function (id, addressId) {
		return $http({
			method: 'DELETE',
	        url: 'http://' + location.host + '/organizations/' + id + "/addresses/" + addressId
	    });
	}
	
	this.searchOrganization = function (searchValue, size, page) {
		return $http({
			method : 'GET',
			url : 'http://' + location.host + '/organizations/search/findBySearchString?searchParameter=' + searchValue + '&size=' + size + '&page=' + page + '&sort=ticketNumber'
		});
	}
	
}]);