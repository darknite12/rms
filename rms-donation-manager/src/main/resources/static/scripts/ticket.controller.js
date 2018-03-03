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
		TicketService.deleteTicket(ticketUrl.split("http://localhost:8080/tickets/")[1])
		.then(function success(response) {
			$scope.setPage(1);
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
		$scope.sittingTable = table;
		$scope.addTableElem = false;
		sittingTableChanged = true;
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
		$scope.buyer = {};
		$scope.buyers = [c1 = [], c2 = [], c3 = [], c4 = [], c5 = [], c6 = [], c7 = [], c8 = [],
			c9 = [], c10 = [], c11 = [], c12 = [], c13 = [], c14 = [], c15 = []];
		var itemsPerColumn = 15;
		var counter = 0;
		
		switch(dBTable) {
		case "persons":
			PersonService.getPaginatedPerson(45, (page - 1))
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
			OrganizationService.getPaginatedOrganization(45, (page - 1))
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
		dBTable = "persons";
		$scope.setPage(1);
	}
	
	$scope.getOrganizations = function () {
		$scope.addBuyerElem = true;
		$scope.addPersonElem = false;
		dBTable = "organizations";
		$scope.setPage(1);
	}
	
	$scope.updateTicket = function() {
		//remember to compare if the table has been unlike or if there is a new one
		var updatingTicket = $scope.newTickets[0];
		TicketService.searchTicketByNumber(updatingTicket.ticketNumber)
		.then(function success(response) {
			if(updatingTicket.ticketNumber == $scope.ticketNumber) {
				TicketService.updateTicket($routeParams.id, updatingTicket)
				.then(function success(response) {
					alert("Ticket Updated");
				}, function error(response) {
					alert("Error: " + response.status);
				});
			} else {
				alert("Ticket number: " + response.data.ticketNumber + " already exists");
			}
		}, function error(response) {
			switch(response.status){
			case 404:
				if(updatingTicket.ticketNumber == ""){
					alert("Please insert a ticket number");
				} else {
					TicketService.updateTicket($routeParams.id, updatingTicket)
					.then(function success(response) {
						
					}, function error(response) {
						alert("Error: " + response.status);
					});
				}
				break;
			}
		});
		
		if(sittingTableChanged) {
			if($scope.sittingTable.sittingTableNumber == "") {
				TicketService.deleteSittingTable($routeParams.id)
				.then(function success(response) {
					alert("Table Updated: Deleted");
				}, function error(response) {
					alert("Error: " + response.status);
				});
			} else {
				TicketService.addSittingTable($routeParams.id, $scope.sittingTable._links.self.href)
				.then(function success(response) {
					alert("Table Updated");
				}, function error(response) {
					alert("Error: " + response.status);
				});
			}
		}
		
		if(buyerChanged) {
			if($scope.buyer.name == "") {
				TicketService.deletePerson($routeParams.id)
				.then(function success(response) {
					TicketService.deleteOrganization($routeParams.id)
					.then(function success(response) {
						alert("Person and Organization unlinked");
					}, function error(response) {
						alert("Error: " + response.status);
					});
				}, function error(response) {
					alert("Error: " + response.status);
				});
			} else {
				TicketService.addBuyer($routeParams.id, buyerKind, $scope.buyer._links.self.href)
				.then(function success(response) {
					alert("Buyer updated");
				}, function error(response) {
					alert("Error adding buyer");
				});
			}
		}
	}
	
	$scope.cancel = function () {
		$location.path('/tickets');
	};
}]);