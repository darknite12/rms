var app = angular.module('rmsdmgui.ticket.services', []);

app.service('TicketService', [ '$http', function($http) {
	this.getAllTickets = function getAllTickets() {
		return $http({
			method : 'GET',
			url : 'http://localhost:8080/tickets/'
		});
	}
}]);