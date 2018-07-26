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
	
	this.searchOrganization = function (searchValue, size, page) {
		return $http({
			method : 'GET',
			url : 'http://' + location.host + '/organizations/search/findBySearchString?searchParameter=' + searchValue + '&size=' + size + '&page=' + page + '&sort=ticketNumber'
		});
	}
	
	this.addOrganization = function (organization){
		return $http({
			method : 'POST',
			url : 'http://' + location.host + '/organizations/',
			data : organization
		});
	}
	
	this.deleteOrganization = function deleteOrganization(organizationUrl) {
		return $http({
			method: 'DELETE',
	        url: organizationUrl
	    });
	}
}]);