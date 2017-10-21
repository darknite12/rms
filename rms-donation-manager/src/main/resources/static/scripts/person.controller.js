var app = angular.module('rmsdmgui.person.controllers', []);

app.controller('PersonsController', ['$scope','PersonService', '$location', function ($scope, PersonService, $location) {
	PersonService.getAllPersons()
	.then(function success(response) {
		$scope.persons = response.data;
		$scope.message='';
		$scope.errorMessage = '';
	}, function error (response) {
		$scope.message='';
		$scope.errorMessage = 'Error getting persons!';
	});
	
	$scope.modifyPerson = function (personUrl) {
		$location.path(personUrl.split(location.host)[1]);
		
	}
	
}]);

app.controller('PersonController', ['$scope', 'PersonService', '$location', '$routeParams', function ($scope, PersonService, $location, $routeParams) {
	
	$scope.person = PersonService.getPerson({id: $routeParams.id})
	.then(function success(response) {
		$scope.person = response.data;
		$scope.message='';
		$scope.errorMessage = '';
	}, function error (response) {
		$scope.message='';
		$scope.errorMessage = 'Error getting person!';
	});
	
	$scope.personAddress = PersonService.getPersonAddress({id: $routeParams.id})
	.then(function success(response) {
		$scope.personAddress = response.data;
		$scope.message='';
		$scope.errorMessage = '';
	}, function error (response) {
		$scope.message='';
		$scope.errorMessage = 'Error getting person addresses!';
	});
	
	$scope.personOrganization = PersonService.getPersonOrganization({id: $routeParams.id})
	.then(function success(response) {
		$scope.personOrganization = response.data;
		$scope.message='';
		$scope.errorMessage = '';
	}, function error (response) {
		$scope.message='';
		$scope.errorMessage = 'Error getting person Organizations!';
	});
	
	$scope.updatePerson = function () {
		PersonService.updatePerson({id: $routeParams.id}, 
			$scope.person.title, 
			$scope.person.firstName, 
			$scope.person.lastName, 
			$scope.person.contactPerson,
			$scope.person.spouse,
			$scope.person.email,
			$scope.person.homePhoneNumber,
			$scope.person.cellPhoneNumber,
			$scope.person.workPhoneNumber,
			$scope.person.faxPhoneNumber,
			$scope.person.parish,
			$scope.person.community,
			$scope.person.language,
			$scope.person.benefactorStatus,
			$scope.person.info
		).then(function success(response) {
			$scope.message = 'Person data updated!';
			$scope.errorMessage = '';
		},
		function error(response) {
			$scope.errorMessage = 'Error updating person!';
			$scope.message = '';
		});
	}
	
	$scope.updatePersonAddress = function () {
		PersonService.updatePersonAddress({id: $routeParams.id},
			$scope.personAddressForm.address,
			$scope.personAddressForm.address2,
			$scope.personAddressForm.city,
			$scope.personAddressForm.province,
			$scope.personAddressForm.postalCode,
			$scope.personAddressForm.poBox
		).then(function success(response) {
			$scope.message = 'Persons address data updated!';
			$scope.errorMessage = '';
		},
		function error(response) {
			$scope.errorMessage = 'Error updating persons address!';
			$scope.message = '';
		});
	}

	$scope.cancel = function () {
		$location.path('/persons');
	};
}]);