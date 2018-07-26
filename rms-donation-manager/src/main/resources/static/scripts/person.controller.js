var app = angular.module('rmsdmgui.person.controllers', []);

app.controller('PersonsController', ['$scope','PersonService', 'PagerService', '$location', function ($scope, PersonService, PagerService, $location) {
	
	$scope.pager = {};
	//This is to make possible the first entrance to setPage function (look if there is a better solution)
	$scope.pager.totalPages = 2;
	$scope.searchValue = "";
	var pageSize = 15;
	
	$scope.setPage = function(page) {
		if(page <= $scope.pager.totalPages) {
			if($scope.searchValue == "") {
				PersonService.getPaginatedPerson(pageSize, (page - 1))
				.then(function success(response) {
					$scope.persons = response.data;
					$scope.pager.currentPage = response.data.page.number + 1;
					$scope.pager.totalPages = response.data.page.totalPages;
					$scope.pager.pages = PagerService.createSlideRange($scope.pager.currentPage, $scope.pager.totalPages);
					$scope.message='';
					$scope.errorMessage = '';
				}, function error(response) {
					alert($scope.errorMessage);
				});
			} else {
				PersonService.searchPerson($scope.searchValue, pageSize, (page - 1))
				.then(function success(response) {
					$scope.persons = response.data;
					$scope.pager.currentPage = response.data.page.number + 1;
					$scope.pager.totalPages = response.data.page.totalPages;
					$scope.pager.pages = PagerService.createSlideRange($scope.pager.currentPage, $scope.pager.totalPages);
					$scope.message='';
					$scope.errorMessage = '';
					if($scope.pager.totalPages <= 0) {
						alert("No people found");
						$scope.pager.totalPages = 2;
						$scope.searchValue = "";
						$scope.setPage(1);
					}
				}, function error (response) {
					$scope.message='';
					$scope.errorMessage = 'Error searching persons: \n' + response.data.cause.cause.message;
					alert($scope.errorMessage);
				});
			}
			
		}
	}
	
	$scope.setPage(1);
	
	$scope.deletePerson = function (personUrl) {
		PersonService.deletePerson(personUrl)
		.then(function success(response) {
			$scope.setPage(1);
		}, function error(response) {
			switch(response.status) {
			case 409:
				alert("Error deleting person: \nStatus: " + response.status + "\nMessage: " + response.data.cause.cause.message);
				break;
			case 500:
				alert("Error deleting person: \nStatus: " + response.status + "\nMessage: " + response.data.message);
				break;
			}
		});
	}
	
	$scope.modifyPerson = function (personUrl) {
		$location.path(personUrl.split(location.host)[1]);
	}
	
}]);

app.controller('PersonController', ['$scope', 'PersonService', 'AddressService', 'OrganizationService', 'PagerService', '$location', '$routeParams', 
	function ($scope, PersonService, AddressService, OrganizationService, PagerService, $location, $routeParams) {
	
	var addressExists = false;
	var organizationExists = false;
	$scope.searchValue = "";
	$scope.personAddress = [];
	$scope.personOrganization = [];
	$scope.pager = {};
	$scope.addressPager = {};
	
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
		var addressId = address._links.self.href.split('http://' + location.host + '/addresses/')[1];
		PersonService.updatePersonAddress(addressId, address)
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
		var organizationId = organization._links.self.href.split('http://' + location.host + '/organizations/')[1];
		PersonService.updatePersonOrganization(organizationId, organization)
		.then(function success(response) {
			$scope.message = 'Persons organization data updated!';
			$scope.errorMessage = '';
		},
		function error(response) {
			$scope.errorMessage = 'Error updating persons address!';
			$scope.message = '';
		});
	}
	
	$scope.deletePersonAddress = function (addressUrl, itemIndex) {
		var addressId = addressUrl.split('http://' + location.host + '/addresses/')[1];
		PersonService.deletePersonAddress($routeParams.id,	addressId)
			.then(function success(response) {
				refreshPersonAddress();
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
		var OrganizationId = organizationUrl.split('http://' + location.host + '/organizations/')[1];
		PersonService.deletePersonOrganization($routeParams.id, OrganizationId)
		.then(function success(response) {
			refreshPersonOrganization();
		},function error(response) {
			
		});
	}
	
	$scope.setPersonAddress = function (address) {
		/*addressExists = true;
		$scope.newPersonAddress = address;
		*/
		PersonService.addPersonAddress($routeParams.id, address._links.self.href)
		.then(function success(response) {
			//refreshPersonAddress();
			$scope.personAddress.addresses.push(address);
			$scope.addPersonAddressElem = false;
		});
	}
	
	$scope.setPersonOrganization = function (organization) {
		organizationExists = true;
		$scope.newPersonOrganization = organization;
	}
	
	$scope.addPersonAddress = function () {
		
		AddressService.addAddress($scope.newPersonAddress)
		.then(function success(response) {
			var addressAdded = response.data;
			PersonService.addPersonAddress($routeParams.id, response.data._links.self.href)
			.then(function success(response) {
				//refreshPersonAddress();
				$scope.personAddress.addresses.push(addressAdded);
			});
			$scope.message='';
			$scope.errorMessage = '';
		}, function error (response) {
			$scope.message='';
			$scope.errorMessage = 'Error adding address!';
		});
		
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
	
	$scope.getOrganizations = function () {
		$scope.addPersonOrganizationElem = true;
		$scope.newPersonOrganization = {};
		$scope.searchValue = "";
		$scope.pager.totalPages = 2;
		$scope.setPage(1);
	}
	
	$scope.setPaginatedAddresses = function (page) {
		$scope.addPersonAddressElem = true;
		$scope.newPersonAddress = {};
		var pageSize = 15;
		
		if($scope.searchValue == "") {
			AddressService.getPaginatedAddress(pageSize, (page - 1))
			.then(function success(response) {
				$scope.addresses = response.data;
				$scope.addressPager.currentPage = response.data.page.number + 1;
				$scope.addressPager.totalPages = response.data.page.totalPages;
				$scope.addressPager.pages = PagerService.createSlideRange($scope.addressPager.currentPage, $scope.addressPager.totalPages);
				$scope.message='Good';
				$scope.errorMessage = '';
			}, function error(response) {
				$scope.message='';
				$scope.errorMessage = 'Error getting addresses!';
			});
		} else {
			AddressService.searchAddress($scope.searchValue, pageSize, (page - 1))
			.then(function success(response) {
				$scope.addresses = response.data;
				$scope.addressPager.currentPage = response.data.page.number + 1;
				$scope.addressPager.totalPages = response.data.page.totalPages;
				$scope.addressPager.pages = PagerService.createSlideRange($scope.addressPager.currentPage, $scope.addressPager.totalPages);
				$scope.message='Good';
				$scope.errorMessage = '';
			}, function error(response) {
				$scope.message='';
				$scope.errorMessage = 'Error getting addresses!';
			});
		}
		
	}
	
	$scope.setPage = function (page) {
		$scope.organizations = [c1 = [], c2 = [], c3 = [], c4 = [], c5 = [], c6 = [], c7 = [], c8 = [],
			c9 = [], c10 = [], c11 = [], c12 = [], c13 = [], c14 = [], c15 = []];
		var itemsPerColumn = 15;
		var counter = 0;
		var pageSize = 45;
		
		if(page <= $scope.pager.totalPages) {
			OrganizationService.getPaginatedOrganization(pageSize, (page - 1))
			.then(function success(response) {
				for(var i = 0; i <= 2; i++) {
					for(var j = 0; j <= (itemsPerColumn - 1); j++) {
						$scope.organizations[j].push(response.data._embedded.organizations[counter]);
						counter++;
					}
				}
				$scope.pager.currentPage = response.data.page.number + 1;
				$scope.pager.totalPages = response.data.page.totalPages;
				$scope.pager.pages = PagerService.createSlideRange($scope.pager.currentPage, $scope.pager.totalPages);
			}, function error(response) {
				
			});
		}
	}
	
	$scope.cancel = function () {
		$location.path('/persons');
	};
	
}]);