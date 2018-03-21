var app = angular.module('rmsdmgui.table.controllers');

app.controller('NewTableController', ['$scope', 'TableService', '$location', function($scope, TableService, $location) {
	$scope.newTableView = true;
	$scope.sittingTable = {number : ""};
	var date = new Date();
	
	$scope.sittingTable.year = date.getFullYear();
	
	$scope.addTable = function() {
		var table = $scope.sittingTable;
		if (table.number == "") {
			alert("Please insert a table number");
		} else {
			TableService.searchTableByNumber(table.number)
			.then(function success(response) {
				alert("Table number: " + response.data.number + " already exists");
			}, function error(response) {
				switch(response.status){
				case 404:
					TableService.addTable(table)
					.then(function success(response) {
						$location.path('/sittingTables');
					}, function error(response) {
						switch(response.status) {
						case 409:
							alert("Error adding table: \nStatus: " + response.status + "\nMessage: " + response.data.cause.cause.message);
							break;
						case 500:
							alert("Error adding table: \nStatus: " + response.status + "\nMessage: " + response.data.message);
							break;
						}
					});
					break;
				}
			});
		}
	}
	
	$scope.cancel = function () {
		$location.path('/sittingTables');
	};
}]);