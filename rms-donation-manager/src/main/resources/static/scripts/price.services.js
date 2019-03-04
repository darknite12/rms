var app = angular.module('rmsdmgui.price.services', []);

app.service('PriceService', ['$http', function($http) {
	
	this.getPriceByYear = function(year) {
		return $http({
			method : 'GET',
			url : 'http://' + location.host + '/ticketPrices/search/findByYear?year=' + year
		});
	}
	
	this.addTicketPrice = function(price){
		return $http({
			method : 'POST',
			url : 'http://' + location.host + '/ticketPrices/',
			data : price
		});
	}
	
	this.updateTicketPrice = function(id, ticketPrice) {
		return $http({
	        method : 'PATCH',
	        url : 'http://' + location.host + '/ticketPrices/' + id,
	        data : ticketPrice
	    });
	}
	
}]);