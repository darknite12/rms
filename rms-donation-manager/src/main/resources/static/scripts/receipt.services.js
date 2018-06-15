var app = angular.module('rmsdmgui.receipt.services', []);

app.service('ReceiptService', ['$http', function($http) {
	
	this.getPaginatedReceipt = function (size, page) {
		return $http({
			method : 'GET',
			url : 'http://' + location.host + '/receipts?size=' + size + '&page=' + page + '&sort=ticketNumber'
		});
	}
	//I need to create this searching method in the repository
	this.searchReceipt = function (searchValue, size, page) {
		return $http({
			method : 'GET',
			url : 'http://' + location.host + '/receipts/search/findBySearchString?searchParameter=' + searchValue + '&size=' + size + '&page=' + page + '&sort=ticketNumber'
		});
	}
	
	this.generateReceipts = function(year) {
		return $http({
			method : 'POST',
			url : 'http://' + location.host + '/receipts/generate',
			data : {'year' : year}
		});
	}
}]);