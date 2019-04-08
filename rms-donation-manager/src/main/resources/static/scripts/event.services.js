var app = angular.module('rmsdmgui.event.services', []);

app.service('EventService', [ '$http', function($http) {
	
	this.getEvents = function() {
		return $http({
			method : 'GET',
			url : 'http://' + location.host + '/events'
		});
	}
	
	this.getActiveEvents = function() {
		return $http({
			method : 'GET',
			url : 'http://' + location.host + '/events/search/findByIsActiveTrue'
		});
	}
	
	this.getPaginatedEvent = function(size, page) {
		return $http({
			method : 'GET',
			url : 'http://' + location.host + '/events?size=' + size + '&page=' + page + '&sort=name'
		});
	}
	
	this.getEvent = function(id) {
		return $http({
			method : 'GET',
			url : 'http://' + location.host + '/events/' + id
		});
	}
	
	this.getEventTicketPrice = function(id) {
		return $http({
			method : 'GET',
			url : 'http://' + location.host + '/events/' + id + '/ticketPrice'
		});
	}
	
	this.getTickets = function(id) {
		return $http({
			method : 'GET',
			url : 'http://' + location.host + '/events/' + id + '/tickets'
		});
	}
	
	this.getTables = function(id) {
		return $http({
			method : 'GET',
			url : 'http://' + location.host + '/events/' + id + '/sittingTables'
		});
	}
	
	this.addEvent = function(event) {
		return $http({
			method : 'POST',
			url : 'http://' + location.host + '/events/',
			data : event
		});
	}
	
	this.updateEvent = function(id, event) {
		return $http({
	        method : 'PATCH',
	        url : 'http://' + location.host + '/events/' + id,
	        data : event
	    });
	}
	
	this.updateIsActive = function(id, isActive) {
		return $http({
	        method : 'PATCH',
	        url : 'http://' + location.host + '/events/' + id,
	        data : {'isActive' : isActive}
	    });
	}
	
	this.searchEvent = function(searchValue, size, page) {
		return $http({
			method : 'GET',
			url : 'http://' + location.host + '/events?size=' + size + '&page=' + page + '&sort=name'
		});
	}
	
}]);