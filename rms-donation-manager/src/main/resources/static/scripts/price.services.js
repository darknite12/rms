var app = angular.module('rmsdmgui.price.services', []);

app.service('PriceService', ['$http', function($http) {
	
	this.getPriceByYear = function(year) {
		return $http({
			method : 'GET',
			url : 'http://localhost:8080/ticketPrices/search/findByYear?year=' + year
		});
	}
	
}]);