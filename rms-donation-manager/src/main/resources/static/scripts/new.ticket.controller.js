var app = angular.module('rmsdmgui.ticket.controllers');

app.controller('NewTicketController', ['$scope', '$location', 'PersonService', 'AddressService', 'OrganizationService', 'TicketService', 'TableService',
	function($scope, $location, PersonService, AddressService, OrganizationService, TicketService, TableService){
	
	var buyerKind = "";
	$scope.newTicketView = true;
	$scope.newTickets = [];
	$scope.tickets = {};
	
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
		$scope.buyer = {};
		PersonService.getAllPersons()
		.then(function success(response) {
			$scope.buyers = response.data._embedded.persons;
		}, function error(response){
			
		});
	}
	
	$scope.getOrganizations = function () {
		$scope.addBuyerElem = true;
		$scope.addPersonElem = false;
		$scope.buyer = {};
		OrganizationService.getAllOrganizations()
		.then(function success(response) {
			$scope.buyers = response.data._embedded.organizations;
		}, function error(response) {
			
		});
	}
	
	$scope.addTicket = function () {
		$scope.newTicket.ticketPrice = "http://localhost:8080/ticketPrices/2";
		$scope.newTickets.push($scope.newTicket);
		$scope.addTicketElem = false;
	}
	
	$scope.addTickets = function () {
		
		var tableExists = false;
		var tableUrl = "";
		
		TableService.getAllTables()
		.then(function success(response) {
			var sittingTables = response.data._embedded.sittingTables;
			for(var i = 0; i <= (sittingTables.length - 1); i++) {
				if (sittingTable[i].sittingTableNumber == $scope.sittingTable) {
					tableExists = true;
					tableUrl = sittingTable[i]._links.self.href;
				}
			}
			//I Stopped Here
		}, function error(response) {
			
		});
		
		TableService.addTable($scope.sittingTable)
		.then(function success(response) {
			tableUrl = response.data._links.self.href;
			for(var i = 0; i <= ($scope.newTickets.length - 1); i++) {
				TicketService.addTicket($scope.newTickets[i])
				.then(function success(response) {
					var ticketId = response.data._links.self.href.split("http://localhost:8080/tickets/")[1];
					TicketService.addSittingTable(ticketId, tableUrl)
					.then(function success(response) {
						TicketService.addBuyer(ticketId, buyerKind, $scope.buyer._links.self.href)
						.then(function success(response) {
							
						}, function error(response) {
							alert("Eror adding buyer");
						});
					}, function error(response) {
						alert("Eror adding sittingTable to ticket");
					});
				}, function error(response) {
					alert("Eror adding ticket");
				});
			}
		}, function error(response) {
			alert("Eror adding sittingTable");
		});
		$location.path('/tickets');
	}
	
	$scope.updateTicket = function (ticket, index) {
		$scope.newTickets[index] = ticket;
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
	}
	
	$scope.cancel = function () {
		$location.path('/tickets');
	};
}]);