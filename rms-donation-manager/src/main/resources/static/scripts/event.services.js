var app = angular.module('rmsdmgui.event.services', []);

app.service('EventService', [ '$http', function($http) {
	
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
	
	this.getTickets = function(id) {
		return $http({
			method : 'GET',
			url : 'http://' + location.host + '/events/' + id + '/tickets'
		});
	}
	
	this.getFreeTickets = function(id) {
		//Change to the right url
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
	
	this.updateEvent = function(id, event) {
		return $http({
	        method : 'PATCH',
	        url : 'http://' + location.host + '/events/' + id,
	        data : event
	    });
	}
	
	this.searchEvent = function(searchValue, size, page) {
		return $http({
			method : 'GET',
			url : 'http://' + location.host + '/events?size=' + size + '&page=' + page + '&sort=name'
		});
	}
	
}]);