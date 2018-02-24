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
	$scope.sittingTable = {sittingTableNumber : ""};
	$scope.newTicketView = true;
	$scope.newTickets = [];
	$scope.tickets = {};
	$scope.pager = {};
	
	PriceService.getPriceByYear(date.getFullYear())
	.then(function success(response) {
		priceUrl = response.data._links.self.href;
	}, function error(response) {
		alert("Error \n\nStatus: " + response.data.status + "\nCause: " + response.data.message);
	});
	
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
	
	$scope.getTickets = function () {
		$scope.newTicket = {};
		$scope.newTicket.year = date.getFullYear();
		$scope.addTicketElem = true;
		TicketService.getAllTickets()
		.then(function success(response) {
			$scope.tickets = response.data;
		}, function error(response) {
			
		});
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
	
	$scope.addTicket = function () {
		$scope.newTicket.ticketPrice = priceUrl;
		$scope.newTickets.push($scope.newTicket);
		$scope.addTicketElem = false;
	}
	
	$scope.addTickets = function () {
		var ticketId = "";
		for(var i = 0; i <= ($scope.newTickets.length - 1); i++) {
			TicketService.addTicket($scope.newTickets[i])
			.then(function success(response) {
				ticketId = response.data._links.self.href.split("http://localhost:8080/tickets/")[1];
				if(sittingTableAdded){
					TicketService.addSittingTable(ticketId, tableUrl)
					.then(function success(response) {
						
					}, function error(response) {
						alert("Error adding sittingTable to ticket");
					});
				}
				
				if (buyerAdded) {
					TicketService.addBuyer(ticketId, buyerKind, $scope.buyer._links.self.href)
					.then(function success(response) {
						
					}, function error(response) {
						alert("Error adding buyer");
					});
				}
				
			}, function error(response) {
				alert("Error adding ticket");
			});
		}
		$location.path('/tickets');
	}
	
	$scope.updateTicket = function (ticket, index) {
		$scope.newTickets[index] = ticket;
	}
	
	$scope.addSittingTable = function() {
		sittingTableAdded = $scope.addSittingTableElem;
		TableService.searchTable($scope.sittingTable.sittingTableNumber)
		.then(function success(response) {
			tableUrl = response.data._links.self.href;
			$scope.tableAdded = true;
		}, function error(response) {
			switch(response.status) {
			case 404:
				TableService.addTable($scope.sittingTable)
				.then(function success(response) {
					tableUrl = response.data._links.self.href;
					$scope.tableAdded = true;
				}, function error(response) {
					alert("Error adding table");
				});
			}
		});
	}
	
	$scope.deleteSittingTable = function() {
		if($scope.sittingTableNumber != ""){
			$scope.sittingTable.sittingTableNumber = "";
		}
		$scope.addSittingTableElem = false;
		sittingTableAdded = $scope.addSittingTableElem;
		$scope.tableAdded = false;
	}
	
	$scope.setBuyer = function (buyer) {
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
	
	$scope.deleteBuyer = function() {
		$scope.buyer = {}
		buyerAdded = false;
	}
	
	$scope.cancel = function () {
		$location.path('/tickets');
	};
}]);