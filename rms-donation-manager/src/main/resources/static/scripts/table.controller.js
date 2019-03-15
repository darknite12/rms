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
						element.peopleAtTable = 0;
						TableService.getAssociatedTickets(tableId)
						.then(function success(response) {
							element.peopleInTable = response.data._embedded.tickets.length;
							if(element.peopleInTable > 0) {
								for(var i = 0; i <= (element.peopleInTable - 1); i++) {
									if(response.data._embedded.tickets[i].atEvent) {
										element.peopleAtTable ++;
									}
								}
							}
							
						}, function error(response) {
							alert("Error Error");
						});
						TableService.getEvent(tableId)
						.then(function sucess(response) {
							element.event = response.data.name + ' ' + response.data.year;
						}, function error(response) {
							alert("Error Getting Event for Table");
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
						element.peopleAtTable = 0;
						TableService.getAssociatedTickets(tableId)
						.then(function success(response) {
							element.peopleInTable = response.data._embedded.tickets.length;
							if(element.peopleInTable > 0) {
								for(var i = 0; i <= (element.peopleInTable - 1); i++) {
									if(response.data._embedded.tickets[i].atEvent) {
										element.peopleAtTable ++;
									}
								}
							}
						}, function error(response) {
							alert("Error Error");
						});
						TableService.getEvent(tableId)
						.then(function sucess(response) {
							element.event = response.data.name + ' ' + response.data.year;
						}, function error(response) {
							alert("Error Getting Event for Table");
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

app.controller('TableController', ['$scope', 'TableService', 'TicketService', 'PagerService', 'EventService', '$location', '$routeParams',
	function ($scope, TableService, TicketService, PagerService, EventService, $location, $routeParams) {
	
	var tableId = $routeParams.id;
	$scope.searchValue = "";
	$scope.linkingTickets = [];
	$scope.eventPager = {};
	$scope.ticketPager = {};
	$scope.sittingTable = {};
	
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
	
	TableService.getEvent(tableId)
	.then(function success(response) {
		$scope.event = response.data;
		$scope.event.nameToShow = response.data.name + " " + response.data.year;
	}, function error(response) {
		switch(response.status) {
		case 409:
			alert("Error getting event: \nStatus: " + response.status + "\nMessage: " + response.data.cause.cause.message);
			break;
		case 500:
			alert("Error getting event: \nStatus: " + response.status + "\nMessage: " + response.data.message);
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
			$scope.eventPager.currentPage = response.data.page.number + 1;
			$scope.eventPager.totalPages = response.data.page.totalPages;
			$scope.eventPager.pages = PagerService.createSlideRange($scope.eventPager.currentPage, $scope.eventPager.totalPages);
		}, function error(response) {
			
		});
	}
	
	$scope.selectEvent = function (event) {
		$scope.event = event;
		$scope.event.nameToShow = event.name + " " + event.year;
		$scope.addEventElem = false;
	}
	
	$scope.unlinkEvent = function () {
		$scope.event = {name : ""};
	}
	
	$scope.setPaginatedTickets = function (page) {
		$scope.addTicketElem = true;
		$scope.addingTickets = [c1 = [], c2 = [], c3 = [], c4 = [], c5 = []];
		var columns = 15;
		var itemsPerColumn = 5;
		var pageSize = 75;
		var counter = 0;
		
		if ($scope.searchValue == "") {
			TicketService.getPaginatedTicket(pageSize, (page - 1))
			.then(function success(response) {
				for(var i = 0; i <= (columns - 1); i++) {
					for(var j = 0; j <= (itemsPerColumn - 1); j++) {
						$scope.addingTickets[j].push(response.data._embedded.tickets[counter]);
						counter++;
					}
				}
				$scope.ticketPager.currentPage = response.data.page.number + 1;
				$scope.ticketPager.totalPages = response.data.page.totalPages;
				$scope.ticketPager.pages = PagerService.createSlideRange($scope.ticketPager.currentPage, $scope.ticketPager.totalPages);
			}, function error(response) {
				
			});
		} else {
			TicketService.searchTicket($scope.searchValue, pageSize, (page - 1))
			.then(function success(response) {
				for(var i = 0; i <= (columns - 1); i++) {
					for(var j = 0; j <= (itemsPerColumn - 1); j++) {
						$scope.addingTickets[j].push(response.data._embedded.tickets[counter]);
						counter++;
					}
				}
				$scope.ticketPager.currentPage = response.data.page.number + 1;
				$scope.ticketPager.totalPages = response.data.page.totalPages;
				$scope.ticketPager.pages = PagerService.createSlideRange($scope.ticketPager.currentPage, $scope.ticketPager.totalPages);
			}, function error(response) {
				alert("error geting ticket");
			});
		}
		
		
	}
	
	$scope.selectTicket = function (ticket) {
		var ticketId = ticket._links.self.href.split('http://' + location.host + '/tickets/')[1];
		var ticketInArray = false;
		$scope.linkingTickets.forEach(function (element) {
			var elementId = element._links.self.href.split('http://' + location.host + '/tickets/')[1];
			if(elementId == ticketId) {
				ticketInArray = true;
			}
		});
		if(ticketInArray) {
			alert("You already added this ticket number");
		} else {
			TicketService.getSittingTable(ticketId)
			.then(function success(response) {
				alert("This ticket is already assigned to table " + response.data.number);
			}, function error(response) {
				switch(response.status) {
				case 404:
					$scope.linkingTickets.push(ticket);
				}
			});
		}
		$scope.searchValue = "";
		$scope.addTicketElem = false;
	}
	
	$scope.updateTable = function () {
		var updatingTable = $scope.sittingTable;
		var event = $scope.event;
		if(updatingTable.number == "") {
			alert("Please insert a table number");
		} else if (event.name == "") {
			alert("Please select an event");
		} else if (updatingTable.peoplePerTable < updatingTable.peopleInTable) {
			alert("People per table cannot be less than people in table:\nPlease delete tickets to fit in the capacity of the table");
		} else {
			var eventId = event._links.self.href.split('http://' + location.host + '/events/')[1];
			TableService.searchTableByNumberAndEventId(updatingTable.number, eventId)
			.then(function success(response) {
				if(updatingTable.number == $scope.sittingTableNumber) {
					updatingTable.event = event._links.self.href;
					TableService.updateTable(tableId, updatingTable)
					.then(function success(response) {
						$location.path('/sittingTables');
					}, function error(response) {
						switch(response.status) {
						case 409:
							$scope.alertKind = 'danger';
							$scope.message = 'Error adding table: \nStatus: ' + response.status + '\nMessage: ' + response.data.cause.cause.message;
							$scope.showAlert = true;
							break;
						case 500:
							$scope.alertKind = 'danger';
							$scope.message = 'Error adding table: \nStatus: ' + response.status + '\nMessage: ' + response.data.message;
							$scope.showAlert = true;
							break;
						}
					});
				} else {
					$scope.alertKind = 'danger';
					$scope.message = 'Table number: ' + response.data.number + ' already exists.';
					$scope.showAlert = true;
				}
			}, function error(response) {
				switch(response.status){
				case 404:
					updatingTable.event = event._links.self.href;
					TableService.updateTable(tableId, updatingTable)
					.then(function success(response) {
						$location.path('/sittingTables');
					}, function error(response) {
						switch(response.status) {
						case 409:
							$scope.alertKind = 'danger';
							$scope.message = 'Error adding table: \nStatus: ' + response.status + '\nMessage: ' + response.data.cause.cause.message;
							$scope.showAlert = true;
							break;
						case 500:
							$scope.alertKind = 'danger';
							$scope.message = 'Error adding table: \nStatus: ' + response.status + '\nMessage: ' + response.data.message;
							$scope.showAlert = true;
							break;
						}
					});
					break;
				}
			});
			$scope.linkingTickets.forEach(function (element) {
				var ticketId = element._links.self.href.split('http://' + location.host + '/tickets/')[1];
				TicketService.addSittingTable(ticketId, tableId)
				.then(function success(response) {
					
				}, function error(response) {
					$scope.alertKind = 'danger';
					$scope.message = 'Errors linking tickets.';
					$scope.showAlert = true;
					alert("Errors linking tickets");
				});
			});
		}
	}
	
	$scope.updateTicketValue = function (valueName, value, ticketUrl, ticketNumber) {
		var ticketId = ticketUrl.split('http://' + location.host + '/tickets/')[1];
		var data = {};
		var valueNameToShow = '';
		
		switch(valueName) {
		case 'paid':
			valueNameToShow = 'Paid';
			data = {
				paid : value
			}
			break;
		case 'formOfPayment':
			valueNameToShow = 'Form of Payment';
			data = {
				formOfPayment : value
			}
			break;
		case 'atEvent':
			valueNameToShow = 'Is At Event';
			data = {
				atEvent : value
			}
			break;
		}
		
		TicketService.updateValue(ticketId, data)
		.then(function success(response) {
			$scope.alertKind = 'success';
			$scope.message = valueNameToShow + ' modified to ' + value + ' on ticket number ' + ticketNumber;
			$scope.showAlert2 = true;
		}, function error(response) {
			$scope.alertKind = 'danger';
			$scope.message = 'Not able to modify ticket number ' + ticketNumber;
			$scope.showAlert2 = true;
		});
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