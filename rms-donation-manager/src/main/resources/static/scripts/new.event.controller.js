var app = angular.module('rmsdmgui.event.controllers');

app.controller('NewEventController', ['$scope', '$location', 'EventService', 'PriceService',
	function($scope, $location, EventService, PriceService){

	$scope.newEventView = true;
	$scope.event = {};
	
	//Add a filter to make sure that the price and cost are numbers
	$scope.addEvent = function () {
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
				EventService.addEvent($scope.event)
				.then(function success(response) {
					$location.path('/events');
				}, function error(success) {
					$scope.alertKind = 'danger';
					$scope.message = 'Error adding new Event';
					$scope.showAlert = true;
				});
			}, function error(response) {
				switch(response.status) {
				case 404:
					PriceService.addPrice($scope.ticketPrice)
					.then(function success(response) {
						var priceUrl = response.data._links.self.href;
						$scope.event.ticketPrice = priceUrl;
						EventService.addEvent($scope.event)
						.then(function success(response) {
							$location.path('/events');
						}, function error(success) {
							$scope.alertKind = 'danger';
							$scope.message = 'Error adding new Event';
							$scope.showAlert = true;
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