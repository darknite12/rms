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
	$scope.setPage(1);
	
	$scope.deleteEvent = function(eventUrl) {
		alert('Not possible to delete');
	}
	
	$scope.modifyEvent = function(eventUrl) {
		$location.path(eventUrl.split(location.host)[1]);
	}
}]);

app.controller('EventController', ['$scope', 'EventService', 'TicketService', 'TableService', '$location', '$routeParams',
	function($scope, EventService, TicketService, TableService, $location, $routeParams) {
	
	var eventId = $routeParams.id;
	
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
		//ask to put pagination in this serve response
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
		$scope.eventStats.paidTickets = response.data._embedded.tickets.length;
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
		$scope.eventStats.unpaidTickets = response.data._embedded.tickets.length;
	}, function error(response) {
		switch(response.status) {
		case 404:
			alert("No unpaid tickets found");
			break;
		}
	});
	
	EventService.getFreeTickets(eventId)
	.then(function success(response) {
		//ask to put pagination in this serve response
		$scope.eventStats.freeTickets = response.data._embedded.tickets.length;
	}, function error(response) {
		switch(response.status) {
		case 404:
			alert("No unpaid tickets found");
			break;
		}
	});
	
	$scope.updateEvent = function() {
		EventService.updateEvent(eventId, $scope.event)
		.then(function success(response) {
			$scope.message = 'Person data updated!';
			$scope.errorMessage = '';
			$location.path('/events');
		}, function error(response) {
			$scope.message = 'Person data updated!';
			$scope.errorMessage = '';
		});
	}
	
	$scope.cancel = function () {
		$location.path('/events');
	};
}]);