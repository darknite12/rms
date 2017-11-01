var app = angular.module('rmsdmgui.address.services', []);

app.service('AddressService', ['$http', function($http) {
	
	this.getAllAddresses = function getAllAddresses() {
		return $http({
			method : 'GET',
			url : 'http://localhost:8080/addresses/'
		});
	}
	
	this.addAddress = function addAddress(address) {
		return $http({
			method : 'POST',
			url : 'http://localhost:8080/addresses/',
			data : address
		});
	}
	
	this.deleteAddress = function deleteAddress(addressUrl){
		return $http({
			method: 'DELETE',
	        url: addressUrl
	    });
	}
}]);