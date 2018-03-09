var app = angular.module('rmsdmgui.table.services', []);

app.service('TableService', ['$http', function($http) {
	
	this.getPaginatedTable = function(size, page) {
		return $http({
			method : 'GET',
			url : 'http://' + location.host + '/sittingTables?size=' + size + '&page=' + page + '&sort=sittingTableNumber'
		});
	}
	
	this.getAllTables = function() {
		return $http({
			method : 'GET',
			url : 'http://' + location.host + '/sittingTables/'
		});
	}
	
	this.getTable = function(id) {
		return $http({
			method : 'GET',
			url : 'http://' + location.host + '/sittingTables/' + id
		});
	}
	
	this.getAssociatedTickets = function(id) {
		return $http({
			method : 'GET',
			url : 'http://' + location.host + '/sittingTables/' + id + '/tickets'
		});
	}
	
	this.addTable = function(table) {
		return $http({
			method : 'POST',
			url : 'http://' + location.host + '/sittingTables/',
			data : table
		});
	}
	
	this.updateTable = function(id, table) {
		return $http({
	        method : 'PATCH',
	        url : 'http://' + location.host + '/sittingTables/' + id,
	        data : table
	    });
	}
	
	this.deleteTable = function(id) {
		return $http({
			method: 'DELETE',
	        url: 'http://' + location.host + '/sittingTables/' + id
	    });
	}
	
	this.searchTable = function(searchValue, size, page) {
		//There is an error here
		return $http({
			method : 'GET',
			url : 'http://' + location.host + '/sittingTables/search/findBySearchString?searchParameter=' + searchValue + '&size=' + size + '&page=' + page + '&sort=sittingTableNumber'
		});
	}
	
	this.searchTableByNumber = function(tableNumber) {
		return $http({
			method : 'GET',
			url : 'http://' + location.host + '/sittingTables/search/findBySittingTableNumber?sittingTableNumber=' + tableNumber
		});
	}
}]);