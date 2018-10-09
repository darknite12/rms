var app = angular.module('rmsdmgui.receipt.services', []);

app.service('ReceiptService', ['$http', function($http) {
	
	this.getPaginatedReceipt = function (size, page) {
		return $http({
			method : 'GET',
			url : 'http://' + location.host + '/receipts?size=' + size + '&page=' + page + '&sort=ticketNumber'
		});
	}
	
	this.getPaginatedReceiptByYear = function (year, size, page) {
		return $http({
			method : 'GET',
			url : 'http://' + location.host + '/receipts/search/findByYear?year=' + year + '&size=' + size + '&page=' + page + '&sort=receiptNumber'
		});
	}
	
	this.getReceipt = function (id) {
		return $http({
			method : 'GET',
			url : 'http://' + location.host + '/receipts/' + id
		});
	}
	
	this.getTickets = function (id) {
		return $http({
			method : 'GET',
			url : 'http://' + location.host + '/receipts/' + id + '/tickets'
		});
	}
	
	this.getPerson = function (id) {
		return $http({
			method : 'GET',
			url : 'http://' + location.host + '/receipts/' + id + '/person'
		});
	}
	
	this.getOrganization = function (id) {
		return $http({
			method : 'GET',
			url : 'http://' + location.host + '/receipts/' + id + '/organization'
		});
	}
	
	this.updateTaxReceiptName = function (id, newName) {
		return $http({
			method : 'PATCH',
			url : 'http://' + location.host + '/receipts/' + id,
			data : {
				'taxReceiptName' : newName
			}
		});
	}
	
	this.searchReceipt = function (searchValue, size, page) {
		return $http({
			method : 'GET',
			url : 'http://' + location.host + '/receipts/search/findBySearchString?searchParameter=' + searchValue + '&size=' + size + '&page=' + page + '&sort=receiptNumber'
		});
	}
	
	this.generateReceipts = function(year, lastReceiptNumber) {
		return $http({
			method : 'POST',
			url : 'http://' + location.host + '/receipts/generate',
			data : {
				'year' : year,
				'lastReceiptNumber' : lastReceiptNumber
			}
		});
	}
}]);