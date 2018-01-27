var app = angular.module('rmsdmgui.table.services', []);

app.service('TableService', ['$http', function($http) {
	
	this.getAllTables = function() {
		return $http({
			method : 'GET',
			url : 'http://localhost:8080/sittingTables/'
		});
	}
	
	this.addTable = function(table) {
		return $http({
			method : 'POST',
			url : 'http://localhost:8080/sittingTables/',
			data : table
		});
	}
}]);