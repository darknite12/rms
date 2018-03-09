var app = angular.module('rmsdmgui.address.services', []);

app.service('AddressService', ['$http', function($http) {
	
	this.getAllAddresses = function getAllAddresses() {
		return $http({
			method : 'GET',
			url : 'http://' + location.host + '/addresses/'
		});
	}
	
	this.addAddress = function addAddress(address) {
		return $http({
			method : 'POST',
			url : 'http://' + location.host + '/addresses/',
			data : address
		});
	}
	
	this.deleteAddress = function deleteAddress(id){
		return $http({
			method: 'DELETE',
	        url: 'http://' + location.host + '/addresses/' + id
	    });
	}
}]);