var app = angular.module('rmsdmgui.organization.services', []);

app.service('OrganizationService', ['$http', function($http){
	
	this.getAllOrganizations = function getAllOrganizations(){
		return $http({
			method : 'GET',
			url : 'http://localhost:8080/organizations/'
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