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

app.controller('PersonController', ['$scope', 'PersonService', 'AddressService', 'OrganizationService', '$location', '$routeParams', 
	function ($scope, PersonService, AddressService, OrganizationService, $location, $routeParams) {
	
	var addressExists = false;
	var organizationExists = false;
	
	$scope.person = PersonService.getPerson({id: $routeParams.id})
	.then(function success(response) {
		$scope.person = response.data;
		$scope.message='';
		$scope.errorMessage = '';
	}, function error (response) {
		$scope.message='';
		$scope.errorMessage = 'Error getting person!';
	});
	
	refreshPersonAddress = function () {
		$scope.personAddress = PersonService.getPersonAddress({id: $routeParams.id})
		.then(function success(response) {
			$scope.personAddress = response.data;
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
		$scope.personOrganization = PersonService.getPersonOrganization({id: $routeParams.id})
		.then(function success(response) {
			$scope.personOrganization = response.data;
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
			alert('Persons organization data updated!');
			$scope.message = 'Persons organization data updated!';
			$scope.errorMessage = '';
		},
		function error(response) {
			$scope.errorMessage = 'Error updating persons address!';
			$scope.message = '';
		});
	}
	
	$scope.deletePersonAddress = function (addressUrl,itemIndex) {
		PersonService.deletePersonAddress({id: $routeParams.id},
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
		PersonService.deletePersonOrganization({id: $routeParams.id},
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
	
	$scope.getAddresses = function () {
		$scope.addPersonAddressElem = true;
		
		$scope.newPersonAddress = {
			address : "",
			address2 : "",
			city : "",
			poBox : "",
			postalCode : "",
			province : "",
			country : ""
		};
		
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
		
		$scope.newPersonOrganization = {
			name : ""	
		};
		
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
				PersonService.addPersonAddress({id: $routeParams.id}, response.data._links.self.href)
				.then(function success(response) {
					refreshPersonAddress();
				});
				$scope.message='';
				$scope.errorMessage = '';
			}, function error (response) {
				$scope.message='';
				$scope.errorMessage = 'Error adding address!';
			});
		} else if (addressExists) {
			PersonService.addPersonAddress({id: $routeParams.id}, $scope.newPersonAddress._links.self.href)
			.then(function success(response) {
				refreshPersonAddress();
			});
		}
		
		addressExists = false;
		$scope.addPersonAddressElem = false;
	}
	
	$scope.addPersonOrganization = function () {
		
		if(!organizationExists){
			OrganizationService.addOrganization($scope.newPersonOrganization)
			.then(function success(response){
				PersonService.addPersonOrganization({id: $routeParams.id}, response.data._links.self.href)
				.then(function success(response){
					refreshPersonOrganization();
				});
				$scope.message='';
				$scope.errorMessage = '';
			}, function error(response){
				$scope.message='';
				$scope.errorMessage = 'Error adding organization!';
			});
		}else if(organizationExists){
			PersonService.addPersonOrganization({id: $routeParams.id}, $scope.newPersonOrganization._links.self.href)
			.then(function success(response){
				refreshPersonOrganization();
			});
		}
		
		organizationExists = false;
		$scope.addPersonOrganizationElem = false;
	}
	
	$scope.cancel = function () {
		$location.path('/persons');
	};
	
}]);