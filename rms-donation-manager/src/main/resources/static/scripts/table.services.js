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
	
	this.getTable = function(id) {
		return $http({
			method : 'GET',
			url : 'http://localhost:8080/sittingTables/' + id
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
	
	this.updateTable = function(id, table) {
		return $http({
	        method : 'PATCH',
	        url : 'http://localhost:8080/sittingTables/' + id,
	        data : table
	    });
	}
	
	this.deleteTable = function(id) {
		return $http({
			method: 'DELETE',
	        url: 'http://localhost:8080/sittingTables/' + id
	    });
	}
	
	this.searchTable = function(searchValue, size, page) {
		//There is an error here
		return $http({
			method : 'GET',
			url : 'http://localhost:8080/sittingTables/search/findBySearchString?searchParameter=' + searchValue + '&size=' + size + '&page=' + page + '&sort=sittingTableNumber'
		});
	}
	
	this.searchTableByNumber = function(tableNumber) {
		return $http({
			method : 'GET',
			url : 'http://localhost:8080/sittingTables/search/findBySittingTableNumber?sittingTableNumber=' + tableNumber
		});
	}
}]);