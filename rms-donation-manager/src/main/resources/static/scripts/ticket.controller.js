var app = angular.module('rmsdmgui.ticket.controllers', []);

app.controller('TicketsController', ['$scope','TicketService', 'PagerService', '$location', function ($scope, TicketService, PagerService, $location) {
	
	$scope.tickets = [];
	var allTickets = [];
	
	$scope.pager = {};
	//This is to make possible the first entrance to setPage function (look if there is a better solution)
	$scope.pager.totalPages = 2;
	$scope.searchValue = "";
	var pageSize = 15;
	
	$scope.setPage = function(page) {
		if(page <= $scope.pager.totalPages) {
			if($scope.searchValue == "") {
				TicketService.getPaginatedTicket(pageSize, (page - 1))
				.then(function success(response) {
					$scope.tickets = response.data._embedded.tickets;
					$scope.tickets.forEach(function(element) {
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
						TicketService.getSittingTable(ticketId)
						.then(function success(response) {
							element.sittingTableNumber = response.data.sittingTableNumber;
						}, function error(response) {
							
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
				TicketService.searchTicket($scope.searchValue, pageSize, (page - 1))
				.then(function success(response) {
					$scope.tickets = response.data._embedded.tickets;
					$scope.tickets.forEach(function(element) {
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
					$scope.pager.currentPage = response.data.page.number + 1;
					$scope.pager.totalPages = response.data.page.totalPages;
					$scope.pager.pages = PagerService.createSlideRange($scope.pager.currentPage, $scope.pager.totalPages);
					$scope.message='';
					$scope.errorMessage = '';
					if($scope.pager.totalPages <= 0) {
						alert("No tickets found");
						$scope.pager.totalPages = 2;
						$scope.searchValue = "";
						$scope.setPage(1);
					}
				}, function error(response) {
					
				});
			}
		}
	}
	
	$scope.setPage(1);
	
	$scope.deleteTicket = function(ticketUrl) {
		TicketService.deleteTicket(ticketUrl.split('http://' + location.host + '/tickets/')[1])
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
	
	$scope.modifyTicket = function (ticketUrl) {
		$location.path(ticketUrl.split(location.host)[1]);
	}
 	
}]);

app.controller('TicketController', ['$scope','TicketService', 'TableService', 'PersonService', 'OrganizationService','PagerService', '$location', '$routeParams', 
	function ($scope, TicketService, TableService, PersonService, OrganizationService, PagerService, $location, $routeParams) {
	
	var sittingTableChanged = false;
	var buyerChanged = false;
	var ticketChanged = false;
	var buyerKind = "";
	var dBTable = "";
	$scope.newTicketView = false;
	$scope.ticketNumber = "";
	$scope.newTickets = [];
	$scope.sittingTable = {sittingTableNumber : ""};
	$scope.buyer = {name : ""};
	$scope.pager = {};
	$scope.tablePager = {};
	
	TicketService.getTicket($routeParams.id)
	.then(function success(response) {
		$scope.ticketNumber = response.data.ticketNumber;
		$scope.newTickets.push(response.data);
	}, function error(response) {
		alert("Error getting ticket");
	});
	
	TicketService.getSittingTable($routeParams.id)
	.then(function success(response) {
		$scope.sittingTable = response.data;
	}, function error(response) {
		switch(response.status) {
		case 404:
			$scope.sittingTable = {sittingTableNumber : ""};
			$scope.addTableElem = false;
			break;
		}
	});
	
	TicketService.getPerson($routeParams.id)
	.then(function success(response) {
		$scope.buyer = response.data;
		$scope.buyer.name = $scope.buyer.firstName + " " + $scope.buyer.lastName;
	}, function(response) {
		switch(response.status) {
		case 404:
			TicketService.getOrganization($routeParams.id)
			.then(function success(response) {
				$scope.buyer = response.data;
			}, function error(response) {
				
			});
			break;
		}
	});
	
	$scope.setPaginatedTables = function (page) {
		$scope.addTableElem = true;
		$scope.tables = [c1 = [], c2 = [], c3 = [], c4 = [], c5 = []];
		var columns = 15;
		var itemsPerColumn = 5;
		var counter = 0;
		TableService.getPaginatedTable(75, (page - 1))
		.then(function success(response) {
			for(var i = 0; i <= (columns - 1); i++) {
				for(var j = 0; j <= (itemsPerColumn - 1); j++) {
					$scope.tables[j].push(response.data._embedded.sittingTables[counter]);
					counter++;
				}
			}
			$scope.tablePager.currentPage = response.data.page.number + 1;
			$scope.tablePager.totalPages = response.data.page.totalPages;
			$scope.tablePager.pages = PagerService.createSlideRange($scope.tablePager.currentPage, $scope.tablePager.totalPages);
		}, function error(response) {
			
		});
	}
	
	$scope.selectTable = function (table) {
		TableService.getAssociatedTickets(table._links.self.href.split('http://' + location.host + '/sittingTables/')[1])
		.then(function success(response) {
			var actualTickets = response.data._embedded.tickets.length;
			var maxTickets = table.peoplePerTable;
			if(actualTickets >= maxTickets) {
				$scope.sittingTable = {sittingTableNumber : ""};
				alert("This table is full. Please select another table");
			} else if (actualTickets < maxTickets) {
				$scope.sittingTable = table;
				sittingTableChanged = true;
			}
		}, function error(response) {
			alert("Error \n\nStatus: " + response.data.status + "\nCause: " + response.data.message);
		});
		$scope.addTableElem = false;
	}
	
	$scope.unlinkTable = function () {
		$scope.sittingTable = {sittingTableNumber : ""};
		sittingTableChanged = true;
	}
	
	$scope.selectBuyer = function (buyer) {
		$scope.buyer = buyer;
		if(buyer.firstName != null){
			$scope.buyer.name = buyer.firstName + " " + buyer.lastName;
			buyerKind = "person";
		} else {
			buyerKind = "organization";
		}
		$scope.addBuyerElem = false;
		buyerChanged = true;
	}
	
	$scope.unlinkBuyer = function() {
		$scope.buyer = {name : ""};
		$scope.addOrganizationElem = false;
		$scope.addPersonElem = false;
		buyerChanged = true;
	}
	
	$scope.setPage = function (page) {
		$scope.buyers = [c1 = [], c2 = [], c3 = [], c4 = [], c5 = [], c6 = [], c7 = [], c8 = [],
			c9 = [], c10 = [], c11 = [], c12 = [], c13 = [], c14 = [], c15 = []];
		var itemsPerColumn = 15;
		var counter = 0;
		var pageSize = 45;
		
		switch(dBTable) {
		case "persons":
			if(page <= $scope.pager.totalPages) {
				PersonService.getPaginatedPerson(pageSize, (page - 1))
				.then(function success(response) {
					for(var i = 0; i <= 2; i++) {
						for(var j = 0; j <= (itemsPerColumn - 1); j++) {
							$scope.buyers[j].push(response.data._embedded.persons[counter]);
							counter++;
						}
					}
					$scope.pager.currentPage = response.data.page.number + 1;
					$scope.pager.totalPages = response.data.page.totalPages;
					$scope.pager.pages = PagerService.createSlideRange($scope.pager.currentPage, $scope.pager.totalPages);
				}, function error(response){
					
				});
			}
			break;
		case "organizations":
			if(page <= $scope.pager.totalPages) {
				OrganizationService.getPaginatedOrganization(pageSize, (page - 1))
				.then(function success(response) {
					for(var i = 0; i <= 2; i++) {
						for(var j = 0; j <= (itemsPerColumn - 1); j++) {
							$scope.buyers[j].push(response.data._embedded.organizations[counter]);
							counter++;
						}
					}
					$scope.pager.currentPage = response.data.page.number + 1;
					$scope.pager.totalPages = response.data.page.totalPages;
					$scope.pager.pages = PagerService.createSlideRange($scope.pager.currentPage, $scope.pager.totalPages);
				}, function error(response) {
					
				});
			}
			break;
		}
	}
	
	$scope.searchBuyer = function () {
		$scope.buyers = [c1 = [], c2 = [], c3 = [], c4 = [], c5 = [], c6 = [], c7 = [], c8 = [],
			c9 = [], c10 = [], c11 = [], c12 = [], c13 = [], c14 = [], c15 = []];
		var page = 1;
		var itemsPerColumn = 15;
		var counter = 0;
		var pageSize = 45;
		
		switch(dBTable) {
		case "persons":
			PersonService.searchPerson($scope.searchValue, pageSize, (page - 1))
			.then(function success(response) {
				for(var i = 0; i <= 2; i++) {
					for(var j = 0; j <= (itemsPerColumn - 1); j++) {
						$scope.buyers[j].push(response.data._embedded.persons[counter]);
						counter++;
					}
				}
				$scope.pager.currentPage = response.data.page.number + 1;
				$scope.pager.totalPages = response.data.page.totalPages;
				$scope.pager.pages = PagerService.createSlideRange($scope.pager.currentPage, $scope.pager.totalPages);
			}, function error(response){
				
			});
			break;
		case "organizations":
			OrganizationService.searchOrganization($scope.searchValue, pageSize, (page - 1))
			.then(function success(response) {
				for(var i = 0; i <= 2; i++) {
					for(var j = 0; j <= (itemsPerColumn - 1); j++) {
						$scope.buyers[j].push(response.data._embedded.organizations[counter]);
						counter++;
					}
				}
				$scope.pager.currentPage = response.data.page.number + 1;
				$scope.pager.totalPages = response.data.page.totalPages;
				$scope.pager.pages = PagerService.createSlideRange($scope.pager.currentPage, $scope.pager.totalPages);
			}, function error(response) {
				
			});
			break;
		}
	}
	
	$scope.getPersons = function () {
		$scope.addBuyerElem = true;
		$scope.addOrganizationElem = false;
		$scope.searchValue = "";
		$scope.pager.totalPages = 2
		dBTable = "persons";
		$scope.setPage(1);
	}
	
	$scope.getOrganizations = function () {
		$scope.addBuyerElem = true;
		$scope.addPersonElem = false;
		$scope.searchValue = "";
		$scope.pager.totalPages = 2;
		dBTable = "organizations";
		$scope.setPage(1);
	}
	
	$scope.updateTicket = function() {
		var updatingTicket = $scope.newTickets[0];
		var ticketId = $routeParams.id;
		var sittingTable = $scope.sittingTable;
		var buyer = $scope.buyer;
		if(updatingTicket.ticketNumber == ""){
			alert("Please insert a ticket number");
		} else {
			TicketService.searchTicketByNumber(updatingTicket.ticketNumber)
			.then(function success(response) {
				if(updatingTicket.ticketNumber == $scope.ticketNumber) {
					TicketService.updateTicket(ticketId, updatingTicket)
					.then(function success(response) {
						$location.path('/tickets');
					}, function error(response) {
						alert("Error: " + response.status);
					});
				} else {
					alert("Ticket number: " + response.data.ticketNumber + " already exists");
				}
			}, function error(response) {
				switch(response.status){
				case 404:
					TicketService.updateTicket(ticketId, updatingTicket)
					.then(function success(response) {
						$location.path('/tickets');
					}, function error(response) {
						alert("Error: " + response.status);
					});
					break;
				}
			});
			
			
			if(sittingTableChanged && !buyerChanged) {
				if(sittingTable.sittingTableNumber == "") {
					TicketService.deleteSittingTable(ticketId)
					.then(function success(response) {
						
					}, function error(response) {
						alert("Error: " + response.status);
					});
				} else {
					TicketService.addSittingTable(ticketId, sittingTable._links.self.href)
					.then(function success(response) {
					}, function error(response) {
						alert("Error: " + response.status);
					});
				}
			}else if(!sittingTableChanged && buyerChanged) {
				if(buyer.name == "") {
					TicketService.deletePerson(ticketId)
					.then(function success(response) {
						TicketService.deleteOrganization(ticketId)
						.then(function success(response) {
						}, function error(response) {
							alert("Error: " + response.status);
						});
					}, function error(response) {
						alert("Error \n\nStatus: " + response.data.status + "\nCause: " + response.data.message);
					});
				} else {
					TicketService.addBuyer(ticketId, buyerKind, buyer._links.self.href)
					.then(function success(response) {
					}, function error(response) {
						alert("Error adding buyer");
					});
				}
			} else if(sittingTableChanged && buyerChanged) {
				if(buyer.name == "") {
					TicketService.deletePerson(ticketId)
					.then(function success(response) {
						TicketService.deleteOrganization(ticketId)
						.then(function success(response) {
							if(sittingTable.sittingTableNumber == "") {
								TicketService.deleteSittingTable(ticketId)
								.then(function success(response) {
									
								}, function error(response) {
									alert("Error: " + response.status);
								});
							} else {
								TicketService.addSittingTable(ticketId, sittingTable._links.self.href)
								.then(function success(response) {
								}, function error(response) {
									alert("Error: " + response.status);
								});
							}
						}, function error(response) {
							alert("Error: " + response.status);
						});
					}, function error(response) {
						alert("Error \n\nStatus: " + response.data.status + "\nCause: " + response.data.message);
					});
				} else {
					TicketService.addBuyer(ticketId, buyerKind, buyer._links.self.href)
					.then(function success(response) {
						if(sittingTable.sittingTableNumber == "") {
							TicketService.deleteSittingTable(ticketId)
							.then(function success(response) {
								
							}, function error(response) {
								alert("Error: " + response.status);
							});
						} else {
							TicketService.addSittingTable(ticketId, sittingTable._links.self.href)
							.then(function success(response) {
							}, function error(response) {
								alert("Error: " + response.status);
							});
						}
					}, function error(response) {
						alert("Error adding buyer");
					});
				}
			}
		}
	}
	
	$scope.cancel = function () {
		$location.path('/tickets');
	};
}]);