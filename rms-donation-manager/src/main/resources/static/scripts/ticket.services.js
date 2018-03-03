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
	
	this.getTicket = function(id) {
		return $http({
			method : 'GET',
			url : 'http://localhost:8080/tickets/' + id
		});
	}
	
	this.getSittingTable = function(id) {
		return $http({
			method : 'GET',
			url : 'http://localhost:8080/tickets/' + id + '/sittingTable'
		});
	}
	
	this.getBuyer = function(id, buyerKind) {
		return $http({
			method : 'GET',
			url : 'http://localhost:8080/tickets/' + id + '/' + buyerKind
		});
	}
	
	this.getPerson = function(id) {
		return $http({
			method : 'GET',
			url : 'http://localhost:8080/tickets/' + id + '/person'
		});
	}
	
	this.getOrganization = function(id) {
		return $http({
			method : 'GET',
			url : 'http://localhost:8080/tickets/' + id + '/organization'
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
	
	this.updateTicket = function(id, ticket) {
		return $http({
	        method : 'PATCH',
	        url : 'http://localhost:8080/tickets/' + id,
	        data : ticket
	    });
	}
	
	this.deleteTicket = function(id) {
		return $http({
			method: 'DELETE',
	        url: 'http://localhost:8080/tickets/' + id
	    });
	}
	
	this.deleteSittingTable = function(id) {
		return $http({
			method: 'DELETE',
	        url: 'http://localhost:8080/tickets/' + id + "/sittingTable"
	    });
	}
	
	this.deletePerson = function(id) {
		return $http({
			method: 'DELETE',
	        url: 'http://localhost:8080/tickets/' + id + "/person"
	    });
	}
	
	this.deleteOrganization = function(id) {
		return $http({
			method: 'DELETE',
	        url: 'http://localhost:8080/tickets/' + id + "/organization"
	    });
	}
	
	this.searchTicket = function(searchValue, size, page) {
		//There is an error here
		return $http({
			method : 'GET',
			url : 'http://localhost:8080/tickets/search/findBySearchString?searchParameter=' + searchValue + '&size=' + size + '&page=' + page + '&sort=ticketNumber'
		});
	}
	
	this.searchTicketByNumber = function(ticketNumber) {
		return $http({
			method : 'GET',
			url : 'http://localhost:8080/tickets/search/findByTicketNumber?ticketNumber=' + ticketNumber
		});
	}
}]);