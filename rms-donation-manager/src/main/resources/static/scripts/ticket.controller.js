var app = angular.module('rmsdmgui.ticket.controllers', []);

app.controller('TicketsController', ['$scope','TicketService', '$location', function ($scope, TicketService, $location) {
	TicketService.getAllTickets()
	.then(function success(response) {
		$scope.tickets = response.data;
		$scope.message='';
		$scope.errorMessage = '';
	}, function error (response) {
		$scope.message='';
		$scope.errorMessage = 'Error getting persons!';
	});
}]);