var app = angular.module('rmsdmgui.ticket.controllers');

app.controller('NewTicketController', 
		['$scope', '$location', 'PagerService', 'PersonService', 'AddressService', 'EventService',
			'OrganizationService', 'TicketService', 'TableService', 'PriceService',
	function($scope, $location, PagerService, PersonService, AddressService, EventService,
			OrganizationService, TicketService, TableService, PriceService){
	
	var buyerKind = "";
	var dBTable = "";
	var tableUrl = "";
	var buyerAdded = false;
	var sittingTableAdded = false;
	var date = new Date();
	var eventId = null;
	$scope.sittingTable = {number : ""};
	$scope.buyer = {name : ""};
	$scope.event = {name : ""};
	$scope.newTicketView = true;
	$scope.newTickets = [];
	$scope.tickets = {};
	$scope.pager = {};
	$scope.tablePager = {};
	$scope.eventPager = {};
	
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
		if(eventId == null) {
			$scope.alertKind = 'info';
			$scope.message = 'Please select an event.';
			$scope.showAlert = true;
		} else {
			$scope.addTableElem = true;
			$scope.tables = [c1 = [], c2 = [], c3 = [], c4 = [], c5 = []];
			var columns = 15;
			var itemsPerColumn = 5;
			var counter = 0;
			TableService.getPaginatedTablesOfEvent(eventId, 75, (page - 1))
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
	}
	
	$scope.selectTable = function (table) {
		TableService.getAssociatedTickets(table._links.self.href.split('http://' + location.host + '/sittingTables/')[1])
		.then(function success(response) {
			var existingTickets = response.data._embedded.tickets.length;
			var maxTickets = table.peoplePerTable;
			var ticketsToBeAdded = $scope.newTickets.length;
			if (existingTickets >= maxTickets) {
				$scope.sittingTable = {number : ""};
				$scope.alertKind = 'warning';
				$scope.message = 'This table is full. Please select another table.';
				$scope.showAlert = true;
			}else if((existingTickets + ticketsToBeAdded) > maxTickets) {
				$scope.sittingTable = {number : ""};
				$scope.alertKind = 'warning';
				$scope.message = 'This table is almost full.\nYou can add only ' + (maxTickets - existingTickets) + ' Ticket(s) to this table.';
				$scope.showAlert = true;
			} else if (existingTickets < maxTickets) {
				$scope.sittingTable = table;
				sittingTableAdded = true;
			}
		}, function error(response) {
			$scope.alertKind = 'danger';
			$scope.message = 'Error \n\nStatus: ' + response.data.status + '\nCause: ' + response.data.message;
			$scope.showAlert = true;
		});
		$scope.addTableElem = false;
	}
	
	$scope.unlinkTable = function () {
		$scope.sittingTable = {number : ""};
		sittingTableAdded = false;
	}
	
	$scope.setPaginatedEvents = function (page) {
		$scope.addEventElem = true;
		$scope.events = [c1 = [], c2 = [], c3 = [], c4 = [], c5 = []];
		var columns = 4;
		var itemsPerColumn = 5;
		var counter = 0;
		
		EventService.getActiveEvents()
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
			$scope.alertKind = 'danger';
			$scope.message = 'Error getting events.';
			$scope.showAlert = true;
		});
	}
	
	$scope.selectEvent = function (event) {
		eventId = event._links.self.href.split('http://' + location.host + '/events/')[1];
		$scope.event = event;
		$scope.event.nameToShow = event.name + " " + event.year;
		$scope.addEventElem = false;
	}
	
	$scope.unlinkEvent = function () {
		eventId = null;
		$scope.event = {name : ""};
	}
	
	$scope.showTicketForm = function () {
		if(eventId == null) {
			$scope.alertKind = 'info';
			$scope.message = 'Please select an event.';
			$scope.showAlert = true;
		} else {
			$scope.newTicket = {};
			$scope.newTicket.ticketNumber = "";
			$scope.newTicket.year = date.getFullYear();
			$scope.addTicketElem = true;
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
	
	$scope.validateTicket = function () {
		TicketService.searchTicketByNumberAndEventId($scope.newTicket.ticketNumber, eventId)
		.then(function success(response) {
			$scope.alertKind = 'danger';
			$scope.message = 'Ticket number: ' + response.data.ticketNumber + ' already exists.';
			$scope.showAlert = true;
		}, function error(response) {
			switch(response.status){
			case 404:
				if($scope.newTicket.ticketNumber == ""){
					$scope.alertKind = 'warning';
					$scope.message = 'Please insert a ticket number.';
					$scope.showAlert = true;
				} else {
					var ticketAdded = false;
					$scope.newTickets.forEach(function (element) {
						if(element.ticketNumber == $scope.newTicket.ticketNumber) {
							ticketAdded = true;
						}
					});
					if(ticketAdded){
						$scope.alertKind = 'danger';
						$scope.message = 'Ticket number ' + $scope.newTicket.ticketNumber + ' has been added already.';
						$scope.showAlert = true;
					} else {
						EventService.getEventTicketPrice(eventId)
						.then(function success(response) {
							var priceUrl = response.data._links.self.href;
							$scope.newTicket.ticketPrice = priceUrl;
							$scope.newTickets.push($scope.newTicket);
							$scope.addTicketElem = false;
						}, function error(response) {
							
						});
					}
				}
				break;
			}
		});
		
	}
	
	$scope.addTickets = function () {
		var ticketId = "";
		var ticketIds = [];
		var counter = 0;
		var event = $scope.event;
		
		if($scope.newTickets.length <= 0) {
			$scope.alertKind = 'warning';
			$scope.message = 'Please add a ticket.';
			$scope.showAlert = true;
		} else {
			$scope.newTickets.forEach(function (element) {
				element.event = event._links.self.href;
				TicketService.addTicket(element)
				.then(function success(response) {
					ticketId = response.data._links.self.href.split('http://' + location.host + '/tickets/')[1];
					ticketIds.push(ticketId);
					if(sittingTableAdded && !buyerAdded){
						TicketService.addSittingTable(ticketId, $scope.sittingTable._links.self.href)
						.then(function success(response) {
							
						}, function error(response) {
							$scope.alertKind = 'danger';
							$scope.message = 'Error adding sittingTable to ticket.';
							$scope.showAlert = true;
						});
					} else if (!sittingTableAdded && buyerAdded) {
						TicketService.addBuyer(ticketId, buyerKind, $scope.buyer._links.self.href)
						.then(function success(response) {
							
						}, function error(response) {
							$scope.alertKind = 'danger';
							$scope.message = 'Error adding buyer to ticket.';
							$scope.showAlert = true;
						});
					} else if (sittingTableAdded && buyerAdded) {
						TicketService.addBuyer(ticketId, buyerKind, $scope.buyer._links.self.href)
						.then(function success(response) {
							TicketService.addSittingTable(ticketIds[counter], $scope.sittingTable._links.self.href)
							.then(function success(response) {
								
							}, function error(response) {
								$scope.alertKind = 'danger';
								$scope.message = 'Error adding sittingTable to ticket.';
								$scope.showAlert = true;
							});
							counter++;
						}, function error(response) {
							$scope.alertKind = 'danger';
							$scope.message = 'Error adding buyer to ticket.';
							$scope.showAlert = true;
						});
					}
				}, function error(response) {
					$scope.alertKind = 'danger';
					$scope.message = 'Error adding ticket.';
					$scope.showAlert = true;
				});
			});
			$location.path('/tickets');
		}
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