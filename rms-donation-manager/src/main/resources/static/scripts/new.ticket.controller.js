var app = angular.module('rmsdmgui.ticket.controllers');

app.controller('NewTicketController', 
		['$scope', '$location', 'PagerService', 'PersonService', 'AddressService', 
			'OrganizationService', 'TicketService', 'TableService', 'PriceService',
	function($scope, $location, PagerService, PersonService, AddressService, 
			OrganizationService, TicketService, TableService, PriceService){
	
	var buyerKind = "";
	var dBTable = "";
	var tableUrl = "";
	var priceUrl = "";
	var buyerAdded = false;
	var sittingTableAdded = false;
	var date = new Date();
	$scope.sittingTable = {number : ""};
	$scope.buyer = {name : ""};
	$scope.newTicketView = true;
	$scope.newTickets = [];
	$scope.tickets = {};
	$scope.pager = {};
	$scope.tablePager = {};
	
	PriceService.getPriceByYear(date.getFullYear())
	.then(function success(response) {
		priceUrl = response.data._links.self.href;
	}, function error(response) {
		alert("Error \n\nStatus: " + response.data.status + "\nCause: " + response.data.message);
	});
	
	$scope.setPage = function (page) {
		$scope.buyer = {name : ""}; {};
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
			var existingTickets = response.data._embedded.tickets.length;
			var maxTickets = table.peoplePerTable;
			var ticketsToBeAdded = $scope.newTickets.length;
			if (existingTickets >= maxTickets) {
				$scope.sittingTable = {number : ""};
				alert("This table is full. Please select another table");
			}else if((existingTickets + ticketsToBeAdded) > maxTickets) {
				$scope.sittingTable = {number : ""};
				alert("This table is almost full.\nYou can add only " + (maxTickets - existingTickets) + " to this table");
			} else if (existingTickets < maxTickets) {
				$scope.sittingTable = table;
				sittingTableAdded = true;
			}
		}, function error(response) {
			alert("Error \n\nStatus: " + response.data.status + "\nCause: " + response.data.message);
		});
		$scope.addTableElem = false;
	}
	
	$scope.unlinkTable = function () {
		$scope.sittingTable = {number : ""};
		sittingTableAdded = false;
	}
	
	$scope.showTicketForm = function () {
		$scope.newTicket = {};
		$scope.newTicket.ticketNumber = "";
		$scope.newTicket.year = date.getFullYear();
		$scope.addTicketElem = true;
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
	
	$scope.validateTicket = function () {
		TicketService.searchTicketByNumber($scope.newTicket.ticketNumber)
		.then(function success(response) {
				alert("Ticket number: " + response.data.ticketNumber + " already exists");
		}, function error(response) {
			switch(response.status){
			case 404:
				if($scope.newTicket.ticketNumber == ""){
					alert("Please insert a ticket number");
				} else {
					$scope.newTicket.ticketPrice = priceUrl;
					$scope.newTickets.push($scope.newTicket);
					$scope.addTicketElem = false;
				}
				break;
			}
		});
		
	}
	
	$scope.addTickets = function () {
		var ticketId = "";
		var ticketIds = [];
		var counter = 0;
		
		$scope.newTickets.forEach(function (element) {
			TicketService.addTicket(element)
			.then(function success(response) {
				ticketId = response.data._links.self.href.split('http://' + location.host + '/tickets/')[1];
				ticketIds.push(ticketId);
				if(sittingTableAdded && !buyerAdded){
					TicketService.addSittingTable(ticketId, $scope.sittingTable._links.self.href)
					.then(function success(response) {
						
					}, function error(response) {
						alert("Error adding sittingTable to ticket");
					});
				} else if (!sittingTableAdded && buyerAdded) {
					TicketService.addBuyer(ticketId, buyerKind, $scope.buyer._links.self.href)
					.then(function success(response) {
						
					}, function error(response) {
						alert("Error adding buyer");
					});
				} else if (sittingTableAdded && buyerAdded) {
					TicketService.addBuyer(ticketId, buyerKind, $scope.buyer._links.self.href)
					.then(function success(response) {
						TicketService.addSittingTable(ticketIds[counter], $scope.sittingTable._links.self.href)
						.then(function success(response) {
							
						}, function error(response) {
							alert("Error adding sittingTable to ticket");
						});
						counter++;
					}, function error(response) {
						alert("Error adding buyer");
					});
				}
			}, function error(response) {
				alert("Error adding ticket");
			});
		});
		//When the application goes back to the tickets GUI the new tickets do not appear until the page is reload
		//The problem is that the page change is faster than the time that the changes are made in the DB. 
		$location.path('/tickets');
	}
	
	$scope.updateTicket = function (ticket, index) {
		$scope.newTickets[index] = ticket;
	}
	
	$scope.deleteSittingTable = function() {
		if($scope.sittingTableNumber != ""){
			$scope.sittingTable.number = "";
		}
		$scope.addSittingTableElem = false;
		sittingTableAdded = $scope.addSittingTableElem;
		$scope.tableAdded = false;
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
		buyerAdded = true;
	}
	
	$scope.unlinkBuyer = function() {
		$scope.buyer = {name : ""};
		$scope.addOrganizationElem = false;
		$scope.addPersonElem = false;
		buyerAdded = false;
	}
	
	$scope.cancel = function () {
		$location.path('/tickets');
	};
}]);