var app = angular.module('rmsdmgui.price.services', []);

app.service('PriceService', ['$http', function($http) {
	
	this.getPriceByCostAndPrice = function(cost, price) {
		return $http({
			method : 'GET',
			url : 'http://' + location.host + '/ticketPrices/search/findByCostAndPrice?cost=' + cost + '&price=' + price
		});
	}
	
	this.addPrice = function(price){
		return $http({
			method : 'POST',
			url : 'http://' + location.host + '/ticketPrices/',
			data : price
		});
	}
	
	this.updatePrice = function(id, ticketPrice) {
		return $http({
	        method : 'PATCH',
	        url : 'http://' + location.host + '/ticketPrices/' + id,
	        data : ticketPrice
	    });
	}
	
}]);