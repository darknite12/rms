var app = angular.module('rmsdmgui.table.controllers');

app.controller('NewTableController', ['$scope', 'TableService', 'PagerService', 'EventService', '$location', 
	function($scope, TableService, PagerService, EventService, $location) {
	$scope.newTableView = true;
	$scope.sittingTable = {number : ""};
	$scope.event = {name : ""};
	var date = new Date();
	var eventAdded = false;
	
	$scope.sittingTable.year = date.getFullYear();
	
	$scope.addTable = function() {
		var table = $scope.sittingTable;
		var event = $scope.event;
		if (table.number == "") {
			alert("Please insert a table number");
		} else if (event.name == "") {
			alert("Please select an event");
		}else {
			TableService.searchTableByNumber(table.number)
			.then(function success(response) {
				alert("Table number: " + response.data.number + " already exists");
			}, function error(response) {
				switch(response.status){
				case 404:
					TableService.addTable(table)
					.then(function success(response) {
						var tableUrl = response.data._links.self.href;
						EventService.addTable(tableUrl)
						.then(function success(response) {
							//Add the function in the service to add the table to the event
						}, function error(response) {
							
						});
						
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
	
	$scope.setPaginatedEvents = function (page) {
		$scope.addEventElem = true;
		$scope.events = [c1 = [], c2 = [], c3 = [], c4 = [], c5 = []];
		var columns = 4;
		var itemsPerColumn = 5;
		var counter = 0;
		EventService.getPaginatedEvent(20, (page - 1))
		.then(function success(response) {
			for(var i = 0; i <= (columns - 1); i++) {
				for(var j = 0; j <= (itemsPerColumn - 1); j++) {
					$scope.events[j].push(response.data._embedded.events[counter]);
					counter++;
				}
			}
			$scope.tablePager.currentPage = response.data.page.number + 1;
			$scope.tablePager.totalPages = response.data.page.totalPages;
			$scope.tablePager.pages = PagerService.createSlideRange($scope.tablePager.currentPage, $scope.tablePager.totalPages);
		}, function error(response) {
			
		});
	}
	
	$scope.selectEvent = function (event) {
		$scope.event = event;
		$scope.addEventElem = false;
		eventAdded = true;
	}
	
	$scope.unlinkEvent = function () {
		$scope.event = {name : ""};
		eventAdded = false;
	}
	
	$scope.cancel = function () {
		$location.path('/sittingTables');
	};
}]);