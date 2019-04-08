var app = angular.module('rmsdmgui.event.controllers', []);

app.controller('EventsController', ['$scope', 'EventService', 'PagerService', '$location',
	function ($scope, EventService, PagerService, $location) {
	
	$scope.events = [];
	
	$scope.pager = {};
	$scope.pager.totalPages = 2;
	$scope.searchValue = "";
	var pageSize = 15;
	
	$scope.setPage = function(page) {
		if(page <= $scope.pager.totalPages) {
			if($scope.searchValue == "") {
				EventService.getPaginatedEvent(pageSize, (page - 1))
				.then(function succcess(response) {
					$scope.events = response.data._embedded.events;
					$scope.pager.currentPage = response.data.page.number + 1;
					$scope.pager.totalPages = response.data.page.totalPages;
					$scope.pager.pages = PagerService.createSlideRange($scope.pager.currentPage, $scope.pager.totalPages);
					$scope.message='';
					$scope.errorMessage = '';
				}, function error(response) {
					
				});
			} else {
				EventService.searchEvent($scope.searchValue, pageSize, (page - 1))
				.then(function succcess(response) {
					$scope.events = response.data._embedded.events;
					$scope.pager.currentPage = response.data.page.number + 1;
					$scope.pager.totalPages = response.data.page.totalPages;
					$scope.pager.pages = PagerService.createSlideRange($scope.pager.currentPage, $scope.pager.totalPages);
					$scope.message='';
					$scope.errorMessage = '';
				}, function error(response) {
					
				});
			}
		}
	}
	
	$scope.updateIsActive = function(eventUrl, isActive) {
		var eventId = eventUrl.split('http://' + location.host + '/events/')[1];
		
		EventService.updateIsActive(eventId, isActive)
		.then(function success(response) {
			$scope.alertKind = 'success';
			$scope.message = 'Event ' + response.data.name + ' ' + response.data.year + ((response.data.isActive) ? ' now is Active' : ' now is Not Active');
			$scope.showAlert = true;
		}, function error(response) {
			$scope.alertKind = 'danger';
			$scope.message = 'Error updating Active field in event ' + response.data.name;
			$scope.showAlert = true;
		});
	}
	
	$scope.setPage(1);
	
	$scope.deleteEvent = function(eventUrl) {
		alert('Not possible to delete');
	}
	
	$scope.modifyEvent = function(eventUrl) {
		$location.path(eventUrl.split(location.host)[1]);
	}
}]);

app.controller('EventController', ['$scope', 'EventService', 'TicketService', 'TableService', '$location', '$routeParams', 'PriceService',
	function($scope, EventService, TicketService, TableService, $location, $routeParams, PriceService) {
	
	var eventId = $routeParams.id;
	var ticketPriceId = '';
	
	$scope.event = {};
	$scope.eventStats = {};
	
	EventService.getEvent(eventId)
	.then(function success(response) {
		$scope.event = response.data;
	}, function error(response) {
		switch(response.status) {
		case 404:
			alert("No event found");
			break;
		}
	});
	
	EventService.getEventTicketPrice(eventId)
	.then(function success(response) {
		ticketPriceId = response.data._links.self.href.split('http://' + location.host + '/ticketPrices/')[1];
		$scope.ticketPrice = response.data;
	}, function error(response) {
		$scope.message = '';
		$scope.errorMessage = 'error getting the ticket price for this event';
	});
	
	TicketService.getTicketsAtEvent(eventId)
	.then(function success(response) {
		$scope.eventStats.peopleAtEvent = response.data.page.totalElements;
	}, function error(response) {
		switch(response.status) {
		case 404:
			alert("No tickets at event found");
			break;
		}
	});
	
	TableService.getTablesOfEvent(eventId)
	.then(function success(response) {
		$scope.eventStats.numberOfTables = response.data.page.totalElements;
	}, function error(response) {
		switch(response.status) {
		case 404:
			alert("No tables found");
			break;
		}
	});
	
	TicketService.getTicketsOfEvent(eventId)
	.then(function success(response) {
		$scope.eventStats.totalTickets = response.data.page.totalElements;
	}, function error(response) {
		switch(response.status) {
		case 404:
			alert("No tickets found");
			break;
		}
	});
	
	TicketService.getPaidTicketsOfEvent(eventId)
	.then(function success(response) {
		//ask to put pagination in this serve response
		$scope.eventStats.paidTickets = response.data.page.totalElements;
	}, function error(response) {
		switch(response.status) {
		case 404:
			alert("No paid tickets found");
			break;
		}
	});
	
	TicketService.getUnpaidTicketsOfEvent(eventId)
	.then(function success(response) {
		//ask to put pagination in this serve response
		$scope.eventStats.unpaidTickets = response.data.page.totalElements;
	}, function error(response) {
		switch(response.status) {
		case 404:
			alert("No unpaid tickets found");
			break;
		}
	});
	
	TicketService.getFreeTickets(eventId)
	.then(function success(response) {
		//ask to put pagination in this serve response
		$scope.eventStats.freeTickets = response.data.page.totalElements;
	}, function error(response) {
		switch(response.status) {
		case 404:
			alert("No unpaid tickets found");
			break;
		}
	});
	
	$scope.updateEvent = function() {
		if(($scope.event.name == null) || ($scope.event.name == "") 
				|| ($scope.event.year == null)
				|| ($scope.event.year == "")
				|| ($scope.ticketPrice.price == null)
				|| ($scope.ticketPrice.price == "")
				|| ($scope.ticketPrice.cost == null)
				|| ($scope.ticketPrice.cost == "")) {
			$scope.alertKind = 'danger';
			$scope.message = 'Fields marked with * are obligatory: please fill them in.';
			$scope.showAlert = true;
		} else {
			PriceService.getPriceByCostAndPrice($scope.ticketPrice.cost, $scope.ticketPrice.price)
			.then(function success(response) {
				var priceUrl = response.data._links.self.href;
				$scope.event.ticketPrice = priceUrl;
				EventService.updateEvent(eventId, $scope.event)
				.then(function success(response) {
					$scope.message = 'Event data updated!';
					$scope.errorMessage = '';
					$location.path('/events');
				}, function error(response) {
					$scope.message = 'Event data update error!';
					$scope.errorMessage = '';
				});
			}, function error(response) {
				switch(response.status) {
				case 404:
					PriceService.addPrice($scope.ticketPrice)
					.then(function success(response) {
						var priceUrl = response.data._links.self.href;
						$scope.event.ticketPrice = priceUrl;
						EventService.updateEvent(eventId, $scope.event)
						.then(function success(response) {
							$scope.message = 'Event data updated!';
							$scope.errorMessage = '';
							$location.path('/events');
						}, function error(response) {
							$scope.message = 'Event data update error!';
							$scope.errorMessage = '';
						});
					}, function error(response) {
						$scope.alertKind = 'danger';
						$scope.message = 'Error adding new Ticket Price';
						$scope.showAlert = true;
					});
					break;
				}
			});
		}
	}
	
	$scope.cancel = function () {
		$location.path('/events');
	};
}]);