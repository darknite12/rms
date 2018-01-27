var app = angular.module('rmsdmgui.ticket.controllers', []);

app.controller('TicketsController', ['$scope','TicketService', '$location', function ($scope, TicketService, $location) {
	
	$scope.tickets = [];
	var allTickets = [];
	
	TicketService.getAllTickets()
	.then(function success(response) {
		$scope.tickets = response.data._embedded.tickets;
		/*allTickets = response.data._embedded;
		
		var ticket = {
			ticketNumber : "",
			soldBy : "",
			url : "",
			buyer : ""
		};
		var buyerKind = "";
		var ticketId = "";
		var actualTicket = {};
		
		//trying to get the name of the buyers
		
		for(var i = 0; i <= (allTickets.tickets.length - 1); i++) {
			actualTicket = allTickets.tickets[i];
			ticketId = actualTicket._links.self.href.split("http://localhost:8080/tickets/")[1];
			if(actualTicket._links.person.href != null) {
				buyerKind = "person";
			} else if(actualTicket._links.organization.href != null) {
				buyerKind = "organization";
			}
			TicketService.getBuyer(ticketId, buyerKind)
			.then(function success(response) {
				ticket.ticketNumber = actualTicket.ticketNumber;
				ticket.soldBy = actualTicket.soldBy;
				ticket.url = actualTicket._links.self.href;
				if(response.data.firstName != null) {
					ticket.buyer = response.data.firstName + " " + response.data.lastName;
				} else if(response.data.name != null) {
					ticket.buyer = response.data.name;
				}
				$scope.tickets.push(ticket);
			}, function error(response) {
				
			});
			 
		}
		$scope.message='';
		$scope.errorMessage = '';*/
	}, function error (response) {
		$scope.message='';
		$scope.errorMessage = 'Error getting persons!';
	});
}]);