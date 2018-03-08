var app = angular.module('rmsdmgui.organization.services', []);

app.service('OrganizationService', ['$http', function($http){
	
	this.getPaginatedOrganization = function (size, number) {
		return $http({
			method : 'GET',
			url : 'http://localhost:8080/organizations?size=' + size + '&page=' + number + '&sort=name'
		});
	}
	
	this.getAllOrganizations = function getAllOrganizations(){
		return $http({
			method : 'GET',
			url : 'http://localhost:8080/organizations/'
		});
	}
	
	this.searchOrganization = function (searchValue, size, page) {
		return $http({
			method : 'GET',
			url : 'http://localhost:8080/organizations/search/findBySearchString?searchParameter=' + searchValue + '&size=' + size + '&page=' + page + '&sort=ticketNumber'
		});
	}
	
	this.addOrganization = function (organization){
		return $http({
			method : 'POST',
			url : 'http://localhost:8080/organizations/',
			data : organization
		});
	}
	
	this.deleteOrganization = function deleteOrganization(OrganizationUrl) {
		return $http({
			method: 'DELETE',
	        url: OrganizationUrl
	    });
	}
}]);