var app = angular.module('rmsdmgui.person.controllers', []);

app.controller('PersonsController', ['$scope','PersonService', '$location', function ($scope, PersonService, $location) {
	PersonService.getPaginatedPerson(15, 0)
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

app.controller('PersonController', ['$scope', 'PersonService', 'AddressService', 'OrganizationService', '$location', '$routeParams', 
	function ($scope, PersonService, AddressService, OrganizationService, $location, $routeParams) {
	
	var addressExists = false;
	var organizationExists = false;
	$scope.personAddress = [];
	$scope.personOrganization = [];
	
	$scope.person = PersonService.getPerson($routeParams.id)
	.then(function success(response) {
		$scope.person = response.data;
		$scope.message='';
		$scope.errorMessage = '';
	}, function error (response) {
		$scope.message='';
		$scope.errorMessage = 'Error getting person!';
	});
	
	refreshPersonAddress = function () {
		$scope.personAddress = PersonService.getPersonAddress($routeParams.id)
		.then(function success(response) {
			$scope.personAddress = response.data._embedded;
			$scope.message='';
			$scope.errorMessage = '';
		}, function error (response) {
			$scope.message='';
			$scope.errorMessage = 'Error getting person addresses!';
		});
	}
	//Provisional way for refreshing personAddress model
	refreshPersonAddress();
	
	refreshPersonOrganization = function(){
		$scope.personOrganization = PersonService.getPersonOrganization($routeParams.id)
		.then(function success(response) {
			$scope.personOrganization = response.data._embedded;
			$scope.message='';
			$scope.errorMessage = '';
		}, function error (response) {
			$scope.message='';
			$scope.errorMessage = 'Error getting person Organizations!';
		});
	}
	//Provisional way for refreshing personOrganization model
	refreshPersonOrganization();
	
	
	$scope.updatePerson = function () {
		PersonService.updatePerson($routeParams.id, 
			$scope.person
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
		PersonService.updatePersonAddress(address)
		.then(function success(response) {
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
			$scope.message = 'Persons organization data updated!';
			$scope.errorMessage = '';
		},
		function error(response) {
			$scope.errorMessage = 'Error updating persons address!';
			$scope.message = '';
		});
	}
	
	$scope.deletePersonAddress = function (addressUrl,itemIndex) {
		PersonService.deletePersonAddress($routeParams.id,
				addressUrl.split("http://localhost:8080/addresses/")[1])
			.then(function success(response) {
				AddressService.deleteAddress(addressUrl)
				.then(function success(response) {
					//Provisional way for refreshing personAddress model
					refreshPersonAddress();
				}, function error(response){
					refreshPersonAddress();
				});
				$scope.message = 'Persons address data deleted!';
				$scope.errorMessage = '';
			},
			function error(response) {
				$scope.errorMessage = 'Error deleting persons address!';
				$scope.message = '';
			});
		//$scope.personAddress[itemIndex].delete;
	}
	
	$scope.deletePersonOrganization = function (organizationUrl) {
		PersonService.deletePersonOrganization($routeParams.id,
			organizationUrl.split("http://localhost:8080/organizations/")[1])
		.then(function success(response) {
			OrganizationService.deleteOrganization(organizationUrl)
			.then(function success(response) {
				//Provisional way for refreshing personOrganization model
				refreshPersonOrganization();
			}, function error(response){
				refreshPersonOrganization();
			});
		},
		function error(response) {
			
		}
		);
	}
	
	$scope.setPersonAddress = function (address) {
		addressExists = true;
		$scope.newPersonAddress = address;
	}
	
	$scope.setPersonOrganization = function (organization) {
		organizationExists = true;
		$scope.newPersonOrganization = organization;
	}
	
	$scope.addPersonAddress = function () {
		
		if(!addressExists){
			AddressService.addAddress($scope.newPersonAddress)
			.then(function success(response) {
				PersonService.addPersonAddress($routeParams.id, response.data._links.self.href)
				.then(function success(response) {
					refreshPersonAddress();
					//$scope.personAddress.push(response.data._embedded);
				});
				$scope.message='';
				$scope.errorMessage = '';
			}, function error (response) {
				$scope.message='';
				$scope.errorMessage = 'Error adding address!';
			});
		} else if (addressExists) {
			PersonService.addPersonAddress($routeParams.id, $scope.newPersonAddress._links.self.href)
			.then(function success(response) {
				refreshPersonAddress();
				//$scope.personAddress.push(response.data._embedded);
			});
		}
		
		addressExists = false;
		$scope.addPersonAddressElem = false;
	}
	
	$scope.addPersonOrganization = function () {
		
		if(!organizationExists){
			OrganizationService.addOrganization($scope.newPersonOrganization)
			.then(function success(response){
				PersonService.addPersonOrganization($routeParams.id, response.data._links.self.href)
				.then(function success(response){
					refreshPersonOrganization();
					//$scope.personOrganization.push(response.data._embedded);
				});
				$scope.message='';
				$scope.errorMessage = '';
			}, function error(response){
				$scope.message='';
				$scope.errorMessage = 'Error adding organization!';
			});
		}else if(organizationExists){
			PersonService.addPersonOrganization($routeParams.id, $scope.newPersonOrganization._links.self.href)
			.then(function success(response){
				refreshPersonOrganization();
				//$scope.personOrganization.push(response.data._embedded);
			});
		}
		
		organizationExists = false;
		$scope.addPersonOrganizationElem = false;
	}
	
	$scope.getAddresses = function () {
		$scope.addPersonAddressElem = true;
		
		$scope.newPersonAddress = {};
		
		AddressService.getAllAddresses()
		.then(function success(response) {
			$scope.addresses = response.data;
			$scope.message='Good';
			$scope.errorMessage = '';
		}, function error (response) {
			$scope.message='';
			$scope.errorMessage = 'Error getting addresses!';
		});
	}
	
	$scope.getOrganizations = function () {
		$scope.addPersonOrganizationElem = true;
		
		$scope.newPersonOrganization = {};
		
		OrganizationService.getAllOrganizations()
		.then(function success(response) {
			$scope.organizations = response.data;
			$scope.message='Good';
			$scope.errorMessage = '';
		}, function error(response){
			$scope.message='';
			$scope.errorMessage = 'Error getting organizations!';
		});
	}
	
	$scope.cancel = function () {
		$location.path('/persons');
	};
	
}]);