var app = angular.module('rmsdmgui.ticket.services', []);

app.service('TicketService', [ '$http', function($http) {
	
	this.getPaginatedTicket = function (size, page) {
		return $http({
			method : 'GET',
			url : 'http://localhost:8080/tickets?size=' + size + '&page=' + page + '&sort=ticketNumber'
		});
	}
	
	this.getAllTickets = function() {
		return $http({
			method : 'GET',
			url : 'http://localhost:8080/tickets?sort=ticketNumber'
		});
	}
	
	this.getBuyer = function(id, buyerKind) {
		return $http({
			method : 'GET',
			url : 'http://localhost:8080/tickets/' + id + '/' + buyerKind
		});
	}
	
	this.addTicket = function(ticket) {
		return $http({
			method : 'POST',
			url : 'http://localhost:8080/tickets/',
			data : ticket
		});
	}
	
	this.addSittingTable = function(id, tableUrl) {
		return $http({
			method : 'PUT',
			url : 'http://localhost:8080/tickets/' + id + '/sittingTable',
			headers: {'Content-Type': 'text/uri-list'},
			data : tableUrl
		});
	}
	
	this.addBuyer = function(id, buyerKind,buyerUrl) {
		return $http({
			method : 'PUT',
			url : 'http://localhost:8080/tickets/' + id + '/' + buyerKind,
			headers: {'Content-Type': 'text/uri-list'},
			data : buyerUrl
		});
	}
	
	this.deleteTicket = function(ticketUrl) {
		return $http({
			method: 'DELETE',
	        url: ticketUrl
	    });
	}
	
	this.searchTicket = function(searchValue, size, page) {
		return $http({
			method : 'GET',
			url : 'http://localhost:8080/tickets/search/findByTicketNumber?ticketNumber=' + searchValue + '&size=' + size + '&page=' + page + '&sort=ticketNumber'
		});
	}
}]);