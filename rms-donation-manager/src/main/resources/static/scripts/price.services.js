var app = angular.module('rmsdmgui.price.services', []);

app.service('PriceService', ['$http', function($http) {
	
	this.getPriceByYear = function(year) {
		return $http({
			method : 'GET',
			url : 'http://' + location.host + '/ticketPrices/search/findByYear?year=' + year
		});
	}
	
}]);