var app = angular.module('rmsdmgui.ticket.controllers', []);

app.controller('TicketsController', ['$scope','TicketService', 'PagerService', '$location', function ($scope, TicketService, PagerService, $location) {
	
	$scope.tickets = [];
	
	$scope.pager = {};
	//This is to make possible the first entrance to setPage function (look if there is a better solution)
	$scope.pager.totalPages = 2;
	$scope.searchValue = "";
	var pageSize = 15;
	
	$scope.updateValue = function(valueName, value, ticketUrl, ticketNumber) {
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
			$scope.showAlert = true;
		}, function error(response) {
			$scope.alertKind = 'danger';
			$scope.message = valueNameToShow + ' not modified on ticket number ' + ticketNumber;
			$scope.showAlert = true;
		});
	}
	
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
						}, function error(response) {
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
							element.number = response.data.number;
						}, function error(response) {
							
						});
						TicketService.getEvent(ticketId)
						.then(function sucess(response) {
							element.event = response.data.name + ' ' + response.data.year;
						}, function error(response) {
							$scope.alertKind = 'danger';
							$scope.message = 'Error Getting Event for Ticket.';
							$scope.showAlert = true;
						});
					});
					$scope.pager.currentPage = response.data.page.number + 1;
					$scope.pager.totalPages = response.data.page.totalPages;
					$scope.pager.pages = PagerService.createSlideRange($scope.pager.currentPage, $scope.pager.totalPages);
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
						TicketService.getSittingTable(ticketId)
						.then(function success(response) {
							element.number = response.data.number;
						}, function error(response) {
							
						});
						TicketService.getEvent(ticketId)
						.then(function sucess(response) {
							element.event = response.data.name + ' ' + response.data.year;
						}, function error(response) {
							$scope.alertKind = 'danger';
							$scope.message = 'Error Getting Event for Ticket.';
							$scope.showAlert = true;
						});
					});
					$scope.pager.currentPage = response.data.page.number + 1;
					$scope.pager.totalPages = response.data.page.totalPages;
					$scope.pager.pages = PagerService.createSlideRange($scope.pager.currentPage, $scope.pager.totalPages);
					$scope.message='';
					$scope.errorMessage = '';
					if($scope.pager.totalPages <= 0) {
						$scope.alertKind = 'danger';
						$scope.message = 'No tickets found.';
						$scope.showAlert = true;
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
				$scope.alertKind = 'danger';
				$scope.message = 'Error deleting ticket: \nStatus: ' + response.status + '\nMessage: ' + response.data.cause.cause.message;
				$scope.showAlert = true;
				break;
			case 500:
				$scope.alertKind = 'danger';
				$scope.message = 'Error deleting ticket: \nStatus: ' + response.status + '\nMessage: ' + response.data.message;
				$scope.showAlert = true;
				break;
			}
			
		});
	}
	
	$scope.modifyTicket = function (ticketUrl) {
		$location.path(ticketUrl.split(location.host)[1]);
	}
 	
}]);

app.controller('TicketController', ['$scope','TicketService', 'TableService', 'PersonService', 'OrganizationService','PagerService', 'EventService', '$location', '$routeParams', 
	function ($scope, TicketService, TableService, PersonService, OrganizationService, PagerService, EventService, $location, $routeParams) {
	
	var sittingTableChanged = false;
	var buyerChanged = false;
	var ticketChanged = false;
	var buyerKind = "";
	var dBTable = "";
	$scope.newTicketView = false;
	$scope.ticketNumber = "";
	$scope.newTickets = [];
	$scope.sittingTable = {number : ""};
	$scope.buyer = {name : ""};
	$scope.pager = {};
	$scope.tablePager = {};
	$scope.eventPager = {};
	
	TicketService.getTicket($routeParams.id)
	.then(function success(response) {
		$scope.ticketNumber = response.data.ticketNumber;
		$scope.newTickets.push(response.data);
	}, function error(response) {
		$scope.alertKind = 'danger';
		$scope.message = 'Error getting ticket.';
		$scope.showAlert = true;
	});
	
	TicketService.getEvent($routeParams.id)
	.then(function success(response) {
		$scope.event = response.data;
		$scope.event.nameToShow = response.data.name + " " + response.data.year;
	}, function error(response) {
		
	});
	
	TicketService.getSittingTable($routeParams.id)
	.then(function success(response) {
		$scope.sittingTable = response.data;
	}, function error(response) {
		switch(response.status) {
		case 404:
			$scope.sittingTable = {number : ""};
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
				$scope.alertKind = 'danger';
				$scope.message = 'Error getting organization.';
				$scope.showAlert = true;
			});
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
				$scope.sittingTable = {number : ""};
				$scope.alertKind = 'warning';
				$scope.message = 'This table is full. Please select another table.';
				$scope.showAlert = true;
			} else if (actualTickets < maxTickets) {
				$scope.sittingTable = table;
				sittingTableChanged = true;
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
		var event = $scope.event;
		
		if(updatingTicket.ticketNumber == ""){
			$scope.alertKind = 'warning';
			$scope.message = 'Please add a ticket.';
			$scope.showAlert = true;
		} else if(event.name == ""){
			$scope.alertKind = 'warning';
			$scope.message = 'Please select an event.';
			$scope.showAlert = true;
		} else {
			var eventId = event._links.self.href.split('http://' + location.host + '/events/')[1];
			updatingTicket.event = event._links.self.href;
			TicketService.searchTicketByNumberAndEventId(updatingTicket.ticketNumber, eventId)
			.then(function success(response) {
				if(updatingTicket.ticketNumber == $scope.ticketNumber) {
					TicketService.updateTicket(ticketId, updatingTicket)
					.then(function success(response) {
						$location.path('/tickets');
					}, function error(response) {
						$scope.alertKind = 'danger';
						$scope.message = 'Error \n\nStatus: ' + response.data.status + '\nCause: ' + response.data.message;
						$scope.showAlert = true;
					});
				} else {
					$scope.alertKind = 'danger';
					$scope.message = 'Ticket number: ' + response.data.ticketNumber + ' already exists.';
					$scope.showAlert = true;
				}
			}, function error(response) {
				switch(response.status){
				case 404:
					TicketService.updateTicket(ticketId, updatingTicket)
					.then(function success(response) {
						$location.path('/tickets');
					}, function error(response) {
						$scope.alertKind = 'danger';
						$scope.message = 'Error \n\nStatus: ' + response.data.status + '\nCause: ' + response.data.message;
						$scope.showAlert = true;
					});
					break;
				}
			});
			
			
			if(sittingTableChanged && !buyerChanged) {
				if(sittingTable.number == "") {
					TicketService.deleteSittingTable(ticketId)
					.then(function success(response) {
						
					}, function error(response) {
						$scope.alertKind = 'danger';
						$scope.message = 'Error \n\nStatus: ' + response.data.status + '\nCause: ' + response.data.message;
						$scope.showAlert = true;
					});
				} else {
					TicketService.addSittingTable(ticketId, sittingTable._links.self.href)
					.then(function success(response) {
					}, function error(response) {
						$scope.alertKind = 'danger';
						$scope.message = 'Error \n\nStatus: ' + response.data.status + '\nCause: ' + response.data.message;
						$scope.showAlert = true;
					});
				}
			}else if(!sittingTableChanged && buyerChanged) {
				if(buyer.name == "") {
					TicketService.deletePerson(ticketId)
					.then(function success(response) {
						TicketService.deleteOrganization(ticketId)
						.then(function success(response) {
						}, function error(response) {
							$scope.alertKind = 'danger';
							$scope.message = 'Error \n\nStatus: ' + response.data.status + '\nCause: ' + response.data.message;
							$scope.showAlert = true;
						});
					}, function error(response) {
						$scope.alertKind = 'danger';
						$scope.message = 'Error \n\nStatus: ' + response.data.status + '\nCause: ' + response.data.message;
						$scope.showAlert = true;
					});
				} else {
					TicketService.addBuyer(ticketId, buyerKind, buyer._links.self.href)
					.then(function success(response) {
					}, function error(response) {
						$scope.alertKind = 'danger';
						$scope.message = 'Error adding buyer.';
						$scope.showAlert = true;
					});
				}
			} else if(sittingTableChanged && buyerChanged) {
				if(buyer.name == "") {
					TicketService.deletePerson(ticketId)
					.then(function success(response) {
						TicketService.deleteOrganization(ticketId)
						.then(function success(response) {
							if(sittingTable.number == "") {
								TicketService.deleteSittingTable(ticketId)
								.then(function success(response) {
									
								}, function error(response) {
									$scope.alertKind = 'danger';
									$scope.message = 'Error \n\nStatus: ' + response.data.status + '\nCause: ' + response.data.message;
									$scope.showAlert = true;
								});
							} else {
								TicketService.addSittingTable(ticketId, sittingTable._links.self.href)
								.then(function success(response) {
								}, function error(response) {
									$scope.alertKind = 'danger';
									$scope.message = 'Error \n\nStatus: ' + response.data.status + '\nCause: ' + response.data.message;
									$scope.showAlert = true;
								});
							}
						}, function error(response) {
							$scope.alertKind = 'danger';
							$scope.message = 'Error \n\nStatus: ' + response.data.status + '\nCause: ' + response.data.message;
							$scope.showAlert = true;
						});
					}, function error(response) {
						$scope.alertKind = 'danger';
						$scope.message = 'Error \n\nStatus: ' + response.data.status + '\nCause: ' + response.data.message;
						$scope.showAlert = true;
					});
				} else {
					TicketService.addBuyer(ticketId, buyerKind, buyer._links.self.href)
					.then(function success(response) {
						if(sittingTable.number == "") {
							TicketService.deleteSittingTable(ticketId)
							.then(function success(response) {
								
							}, function error(response) {
								$scope.alertKind = 'danger';
								$scope.message = 'Error \n\nStatus: ' + response.data.status + '\nCause: ' + response.data.message;
								$scope.showAlert = true;
							});
						} else {
							TicketService.addSittingTable(ticketId, sittingTable._links.self.href)
							.then(function success(response) {
							}, function error(response) {
								$scope.alertKind = 'danger';
								$scope.message = 'Error \n\nStatus: ' + response.data.status + '\nCause: ' + response.data.message;
								$scope.showAlert = true;
							});
						}
					}, function error(response) {
						$scope.alertKind = 'danger';
						$scope.message = 'Error adding buyer.';
						$scope.showAlert = true;
					});
				}
			}
		}
	}
	
	$scope.cancel = function () {
		$location.path('/tickets');
	};
}]);