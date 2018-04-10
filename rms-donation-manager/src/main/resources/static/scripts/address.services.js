var app = angular.module('rmsdmgui.address.services', []);

app.service('AddressService', ['$http', function($http) {
	
	this.getPaginatedAddress = function (size, page) {
		return $http({
			method : 'GET',
			url : 'http://' + location.host + '/addresses?size=' + size + '&page=' + page + '&sort=address'
		});
	}
	
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
	
	this.searchAddress = function (searchValue, size, page) {
		return $http({
			method : 'GET',
			//url : 'http://' + location.host + '/addresses/search/findBySearchString?searchParameter=' + searchValue + '&size=' + size + '&page=' + page + '&sort=address'
			url : 'http://' + location.host + '/addresses/search/findByAddress?address=' + searchValue + '&size=' + size + '&page=' + page + '&sort=address'
		});
	}
}]);