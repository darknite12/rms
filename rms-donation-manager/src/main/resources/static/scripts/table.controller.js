var app = angular.module('rmsdmgui.table.controllers', []);

app.controller('TablesController', ['$scope', 'TableService', 'PagerService', '$location',
	function ($scope, TableService, PagerService, $location) {
	
	$scope.tables = [];
	
	$scope.pager = {};
	$scope.pager.totalPages = 2;
	$scope.searchValue = "";
	var pageSize = 15;
	
	$scope.setPage = function(page) {
		if(page <= $scope.pager.totalPages) {
			var added = false;
			if($scope.searchValue == "") {
				TableService.getPaginatedTable(pageSize, (page - 1))
				.then(function success(response) {
					$scope.tables = response.data._embedded.sittingTables;
					$scope.tables.forEach(function(element){
						var tableId = element._links.self.href.split('http://' + location.host + '/sittingTables/')[1];
						TableService.getAssociatedTickets(tableId)
						.then(function success(response) {
							element.peopleInTable = response.data._embedded.tickets.length;
						}, function error(response) {
							alert("Error Error");
						});
					});
					$scope.pager.currentPage = response.data.page.number + 1;
					$scope.pager.totalPages = response.data.page.totalPages;
					$scope.pager.pages = PagerService.createSlideRange($scope.pager.currentPage, $scope.pager.totalPages);
					$scope.message='';
					$scope.errorMessage = '';
				}, function error(response) {
					
				});
			} else {
				TableService.searchTable($scope.searchValue, pageSize, (page - 1))
				.then(function success(response) {
					$scope.tables = response.data._embedded.sittingTables;
					$scope.tables.forEach(function(element){
						var tableId = element._links.self.href.split('http://' + location.host + '/sittingTables/')[1]
						TableService.getAssociatedTickets(tableId)
						.then(function success(response) {
							element.peopleInTable = response.data._embedded.tickets.length;
						}, function error(response) {
							alert("Error Error");
						});
					});
					$scope.pager.currentPage = response.data.page.number + 1;
					$scope.pager.totalPages = response.data.page.totalPages;
					$scope.pager.pages = PagerService.createSlideRange($scope.pager.currentPage, $scope.pager.totalPages);
					$scope.message='';
					$scope.errorMessage = '';
					if($scope.pager.totalPages <= 0) {
						alert("No tables found");
						$scope.pager.totalPages = 2;
						$scope.searchValue = "";
						$scope.setPage(1);
					}
				}, function error(response) {
					switch(response.status) {
					case 409:
						alert("Error searching table: \nStatus: " + response.status + "\nMessage: " + response.data.cause.cause.message);
						break;
					case 500:
						alert("Error searching table: \nStatus: " + response.status + "\nMessage: " + response.data.message);
						break;
					}
				});
			}
		}
	}
	
	$scope.setPage(1);
	
	$scope.deleteTable = function(tableUrl) {
		TableService.deleteTable(tableUrl.split('http://' + location.host + '/sittingTables/')[1])
		.then(function success(response) {
			$scope.setPage($scope.pager.currentPage);
		}, function error(response) {
			switch(response.status) {
			case 409:
				alert("Error deleting ticket: \nStatus: " + response.status + "\nMessage: " + response.data.cause.cause.message);
				break;
			case 500:
				alert("Error deleting ticket: \nStatus: " + response.status + "\nMessage: " + response.data.message);
				break;
			}
			
		});
	}
	
	$scope.modifyTable = function (tableUrl) {
		$location.path(tableUrl.split(location.host)[1]);
	}
}]);

app.controller('TableController', ['$scope', 'TableService', 'TicketService','PagerService', '$location', '$routeParams',
	function ($scope, TableService, TicketService, PagerService, $location, $routeParams) {
	
	var tableId = $routeParams.id;
	
	TableService.getTable(tableId)
	.then(function success(response) {
		$scope.sittingTable = response.data;
		$scope.sittingTableNumber = response.data.number;
	}, function error(response) {
		switch(response.status) {
		case 409:
			alert("Error getting ticket: \nStatus: " + response.status + "\nMessage: " + response.data.cause.cause.message);
			break;
		case 500:
			alert("Error getting ticket: \nStatus: " + response.status + "\nMessage: " + response.data.message);
			break;
		}
	});
	
	TableService.getAssociatedTickets(tableId)
	.then(function success(response) {
		$scope.tickets = response.data._embedded.tickets;
		$scope.tickets.forEach(function (element) {
			var ticketId = element._links.self.href.split('http://' + location.host + '/tickets/')[1];
			TicketService.getPerson(ticketId)
			.then(function success(response) {
				element.buyer = response.data.firstName + " " + response.data.lastName;
			}, function(response) {
				switch(response.status) {
				case 404:
					TicketService.getOrganization(ticketId)
					.then(function success(response) {
						element.buyer = response.data.name;
					}, function error(response) {
						
					});
					break;
				}
			});
		});
		$scope.sittingTable.peopleInTable = response.data._embedded.tickets.length;
	}, function error(response) {
		switch(response.status) {
		case 409:
			alert("Error unlinking ticket: \nStatus: " + response.status + "\nMessage: " + response.data.cause.cause.message);
			break;
		case 500:
			alert("Error unlinking ticket: \nStatus: " + response.status + "\nMessage: " + response.data.message);
			break;
		}
	});
	
	$scope.updateTable = function () {
		var updatingTable = $scope.sittingTable;
		if(updatingTable.number == "") {
			alert("Please insert a table number");
		} else if (updatingTable.peoplePerTable < updatingTable.peopleInTable) {
			alert("People per table cannot be less than people in table:\nPlease delete tickets to fit in the capacity of the table");
		} else {
			TableService.searchTableByNumber(updatingTable.number)
			.then(function success(response) {
				if(updatingTable.number == $scope.sittingTableNumber) {
					TableService.updateTable(tableId, updatingTable)
					.then(function success(response) {
						$location.path('/sittingTables');
					}, function error(response) {
						switch(response.status) {
						case 409:
							alert("Error updating table: \nStatus: " + response.status + "\nMessage: " + response.data.cause.cause.message);
							break;
						case 500:
							alert("Error updating table: \nStatus: " + response.status + "\nMessage: " + response.data.message);
							break;
						}
					});
				} else {
					alert("Table number: " + response.data.number + " already exists");
				}
			}, function error(response) {
				switch(response.status){
				case 404:
					TableService.updateTable(tableId, updatingTable)
					.then(function success(response) {
						$location.path('/sittingTables');
					}, function error(response) {
						switch(response.status) {
						case 409:
							alert("Error updating table: \nStatus: " + response.status + "\nMessage: " + response.data.cause.cause.message);
							break;
						case 500:
							alert("Error updating table: \nStatus: " + response.status + "\nMessage: " + response.data.message);
							break;
						}
					});
					break;
				}
			});
		}
	}
	
	$scope.unlinkTicket = function (ticketUrl) {
		var ticketId = ticketUrl.split('http://' + location.host + '/tickets/')[1];
		TicketService.deleteSittingTable(ticketId)
		.then(function success(response) {
			TableService.getAssociatedTickets(tableId)
			.then(function success(response) {
				$scope.tickets = response.data._embedded.tickets;
				$scope.sittingTable.peopleInTable = response.data._embedded.tickets.length;
			}, function error(response) {
				switch(response.status) {
				case 409:
					alert("Error deleting ticket: \nStatus: " + response.status + "\nMessage: " + response.data.cause.cause.message);
					break;
				case 500:
					alert("Error deleting ticket: \nStatus: " + response.status + "\nMessage: " + response.data.message);
					break;
				}
			});
		}, function error(response) {
			switch(response.status) {
			case 409:
				alert("Error deleting ticket: \nStatus: " + response.status + "\nMessage: " + response.data.cause.cause.message);
				break;
			case 500:
				alert("Error deleting ticket: \nStatus: " + response.status + "\nMessage: " + response.data.message);
				break;
			}
		});
	}
	
	$scope.cancel = function () {
		$location.path('/sittingTables');
	};
}]);