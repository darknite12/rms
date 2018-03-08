var app = angular.module('rmsdmgui.table.services', []);

app.service('TableService', ['$http', function($http) {
	
	this.getPaginatedTable = function(size, page) {
		return $http({
			method : 'GET',
			url : 'http://localhost:8080/sittingTables?size=' + size + '&page=' + page + '&sort=sittingTableNumber'
		});
	}
	
	this.getAllTables = function() {
		return $http({
			method : 'GET',
			url : 'http://localhost:8080/sittingTables/'
		});
	}
	
	this.getAssociatedTickets = function(id) {
		return $http({
			method : 'GET',
			url : 'http://localhost:8080/sittingTables/' + id + '/tickets'
		});
	}
	
	this.addTable = function(table) {
		return $http({
			method : 'POST',
			url : 'http://localhost:8080/sittingTables/',
			data : table
		});
	}
	
	this.searchTable = function(tableNumber) {
		return $http({
			method : 'GET',
			url : 'http://localhost:8080/sittingTables/search/findBySittingTableNumber?sittingTableNumber=' + tableNumber
		});
	}
}]);