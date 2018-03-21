var app = angular.module('rmsdmgui.event.services', []);

app.service('EventService', [ '$http', function($http) {
	
	this.getPaginatedEvent = function(size, page) {
		return $http({
			method : 'GET',
			url : 'http://' + location.host + '/events?size=' + size + '&page=' + page + '&sort=name'
		});
	}
	
}]);