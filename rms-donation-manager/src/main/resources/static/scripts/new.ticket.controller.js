var app = angular.module('rmsdmgui.ticket.controllers');

app.controller('NewTicketController', ['$scope', '$location', 'PagerService', 'PersonService', 'AddressService', 'OrganizationService', 'TicketService', 'TableService',
	function($scope, $location, PagerService, PersonService, AddressService, OrganizationService, TicketService, TableService){
	
	var buyerKind = "";
	var dBTable = "";
	var buyerAdded = false;
	var sittingTableAdded = false;
	$scope.sittingTable = {sittingTableNumber : ""};
	$scope.newTicketView = true;
	$scope.newTickets = [];
	$scope.tickets = {};
	$scope.pager = {};
	
	
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
		$scope.newTicket.year = "2018";
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
		$scope.newTicket.ticketPrice = "http://localhost:8080/ticketPrices/2";
		$scope.newTickets.push($scope.newTicket);
		$scope.addTicketElem = false;
	}
	
	$scope.addTickets = function () {
		var tableUrl = "";
		var ticketId = "";
		for(var i = 0; i <= ($scope.newTickets.length - 1); i++) {
			TicketService.addTicket($scope.newTickets[i])
			.then(function success(response) {
				ticketId = response.data._links.self.href.split("http://localhost:8080/tickets/")[1];
				if(sittingTableAdded){
					TableService.searchTable($scope.sittingTable.sittingTableNumber)
					.then(function success(response) {
						tableUrl = response.data._links.self.href;
						TicketService.addSittingTable(ticketId, tableUrl)
						.then(function success(response) {
							
						}, function error(response) {
							alert("Error adding sittingTable to ticket 1");
						});
					}, function error(response) {
						//The code to add the new table goes here
						switch(response.status) {
						case 404:
							TableService.addTable($scope.sittingTable)
							.then(function success(response) {
								tableUrl = response.data._links.self.href;
								TicketService.addSittingTable(ticketId, tableUrl)
								.then(function success(response) {
									
								}, function error(response) {
									alert("Error adding sittingTable to ticket 2");
								});
							}, function error(response) {
								
							});
						}
					});
				}
				
				if (buyerAdded) {
					TicketService.addBuyer(ticketId, buyerKind, $scope.buyer._links.self.href)
				.then(function success(response) {
					if(i >= ($scope.newTickets.length - 1)) {
						$location.path('/tickets');
					}
				}, function error(response) {
					alert("Error adding buyer");
				});
				} else if(i >= ($scope.newTickets.length - 1)) {
					$location.path('/tickets');
				}
				
				if (i >= ($scope.newTickets.length - 1)){
					$location.path('/tickets');
				}
				
			}, function error(response) {
				alert("Error adding ticket");
			});
		}
	}
	
	$scope.updateTicket = function (ticket, index) {
		$scope.newTickets[index] = ticket;
	}
	
	$scope.addSittingTable = function() {
		$scope.addSittingTableElem = true;
		sittingTableAdded = $scope.addSittingTableElem;
	}
	
	$scope.deleteSittingTable = function() {
		if($scope.sittingTableNumber != ""){
			$scope.sittingTable.sittingTableNumber = "";
		}
		$scope.addSittingTableElem = false;
		sittingTableAdded = $scope.addSittingTableElem;
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