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
	
	$scope.updatePersonAddress = function (address) {
		PersonService.updatePersonAddress(
			address.address,
			address.address2,
			address.city,
			address.province,
			address.postalCode,
			address.poBox,
			address.country,
			address._links.self.href
		).then(function success(response) {
			$scope.message = 'Persons address data updated!';
			$scope.errorMessage = '';
		},
		function error(response) {
			$scope.errorMessage = 'Error updating persons address!';
			$scope.message = '';
		});
	}
	
	$scope.updatePersonOrganization = function (organization) {
		PersonService.updatePersonOrganization(
				organization.name,
				organization._links.self.href
		).then(function success(response) {
			alert('Persons organization data updated!');
			$scope.message = 'Persons organization data updated!';
			$scope.errorMessage = '';
		},
		function error(response) {
			$scope.errorMessage = 'Error updating persons address!';
			$scope.message = '';
		});
	}
	
	$scope.deletePersonAddress = function (address) {
		PersonService.deletePersonAddress({id: $routeParams.id},
				address._links.self.href.split("http://localhost:8080/addresses/")[1]
			).then(function success(response) {
				$scope.message = 'Persons address data deleted!';
				$scope.errorMessage = '';
			},
			function error(response) {
				$scope.errorMessage = 'Error deleting persons address!';
				$scope.message = '';
			});
		PersonService.deleteAddress(address._links.self.href.split);
		
		$location.path('/persons');
	}
	
	$scope.cancel = function () {
		$location.path('/persons');
	};
	
}]);