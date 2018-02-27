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
 	/*
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
			ticket.ticketNumber = "32";
			ticket.soldBy = "El";
			ticket.url = "aqui.com";
			ticket.buyer = "Yo for now";
			$scope.tickets.push(ticket);
		}
		
		/*for(var i = 0; i <= (allTickets.tickets.length - 1); i++) {
			actualTicket = allTickets.tickets[i];
			ticketId = actualTicket._links.self.href.split("http://localhost:8080/tickets/")[1];
			if(actualTicket._links.person.href != null) {
				buyerKind = "person";
			} else if(actualTicket._links.organization.href != null) {
				buyerKind = "organization";
			}
			TicketService.getBuyer(ticketId, buyerKind)
			.then(function success(response) {
				ticket[i].ticketNumber = actualTicket.ticketNumber;
				ticket[i].soldBy = actualTicket.soldBy;
				ticket[i].url = actualTicket._links.self.href;
				if(response.data.firstName != null) {
					ticket[i].buyer = response.data.firstName + " " + response.data.lastName;
				} else if(response.data.name != null) {
					ticket[i].buyer = response.data.name;
				}
				$scope.tickets.push(ticket[i]);
			}, function error(response) {
				
			});
			 
		}
		$scope.message='';
		$scope.errorMessage = '';
	}, function error (response) {
		$scope.message='';
		$scope.errorMessage = 'Error getting persons!';
	});*/
}]);