var app = angular.module('rmsdmgui.organization.controllers', []);

app.controller('OrganizationsController', ['$scope', 'OrganizationService', 'PagerService', '$location', function ($scope, OrganizationService, PagerService, $location) {
	
	$scope.pager = {};
	//This is to make possible the first entrance to setPage function (look if there is a better solution)
	$scope.pager.totalPages = 2;
	$scope.searchValue = "";
	var pageSize = 15;
	
	$scope.setPage = function(page) {
		if(page <= $scope.pager.totalPages) {
			if($scope.searchValue == "") {
				OrganizationService.getPaginatedOrganization(pageSize, (page - 1))
				.then(function success(response) {
					$scope.organizations = response.data;
					$scope.pager.currentPage = response.data.page.number + 1;
					$scope.pager.totalPages = response.data.page.totalPages;
					$scope.pager.pages = PagerService.createSlideRange($scope.pager.currentPage, $scope.pager.totalPages);
					$scope.message='';
					$scope.errorMessage = '';
				}, function error(response) {
					alert($scope.errorMessage);
				});
			} else {
				OrganizationService.searchOrganization($scope.searchValue, pageSize, (page - 1))
				.then(function success(response) {
					$scope.organizations = response.data;
					$scope.pager.currentPage = response.data.page.number + 1;
					$scope.pager.totalPages = response.data.page.totalPages;
					$scope.pager.pages = PagerService.createSlideRange($scope.pager.currentPage, $scope.pager.totalPages);
					$scope.message='';
					$scope.errorMessage = '';
					if($scope.pager.totalPages <= 0) {
						alert("No Organizations found");
						$scope.pager.totalPages = 2;
						$scope.searchValue = "";
						$scope.setPage(1);
					}
				}, function error(response) {
					$scope.message='';
					$scope.errorMessage = 'Error searching organizations: \n' + response.data.cause.cause.message;
					alert($scope.errorMessage);
				})
			}
		}
		
	}
	
	$scope.setPage(1);
	
	$scope.deleteOrganization = function (organizationUrl) {
		OrganizationService.deleteOrganization(organizationUrl)
		.then(function success(response) {
			$scope.setPage(1);
		}, function error(response) {
			switch(response.status) {
			case 409:
				alert("Error deleting organization: \nStatus: " + response.status + "\nMessage: " + response.data.cause.cause.message);
				break;
			case 500:
				alert("Error deleting organization: \nStatus: " + response.status + "\nMessage: " + response.data.message);
				break;
			}
		});
	}
	
	$scope.modifyOrganization = function (organizationUrl) {
		$location.path(organizationUrl.split(location.host)[1]);
	}
	
}]);

app.controller('OrganizationController', ['$scope', 'PersonService', 'AddressService', 'OrganizationService', 'PagerService', '$location', '$routeParams',
	function ($scope, PersonService, AddressService, OrganizationService, PagerService, $location, $routeParams) {
	
	$scope.organizationName = "";
	$scope.addressSearchValue = "";
	$scope.personSearchValue = "";
	$scope.organizationAddress = [];
	$scope.organizationPerson = [];
	$scope.addressPager = {};
	$scope.personPager = {};
	var organizationId = $routeParams.id;
	
	OrganizationService.getOrganization(organizationId)
	.then(function success(response) {
		$scope.organization = response.data;
		$scope.organizationName = response.data.name;
		$scope.message='';
		$scope.errorMessage = '';
	}, function error(response) {
		$scope.message='';
		$scope.errorMessage = 'Error getting organization!';
	});
	
	refreshOrganizationPerson = function () {
		OrganizationService.getOrganizationPersons(organizationId)
		.then(function success(response) {
			$scope.organizationPerson = response.data._embedded;
			$scope.message = '';
			$scope.errorMessage = '';
		}, function error(response) {
			$scope.message='';
			$scope.errorMessage = 'Error getting people of the organization!';
		});
	}
	
	refreshOrganizationPerson();
	
	refreshOrganizationAddress = function () {
		OrganizationService.getOrganizationAddress(organizationId)
		.then(function success(response) {
			$scope.organizationAddress = response.data._embedded;
			$scope.message='';
			$scope.errorMessage = '';
		}, function error (response) {
			$scope.message='';
			$scope.errorMessage = 'Error getting organization addresses!';
		});
	}
	
	refreshOrganizationAddress();
	
	$scope.setOrganizationAddress = function (address) {
		OrganizationService.addOrganizationAddress(organizationId, address._links.self.href)
		.then(function success(response) {
			$scope.organizationAddress.addresses.push(address);
			$scope.addOrganizationAddressElem = false;
		}, function error(response) {
			
		});
		$scope.addressSearchValue = "";
	}
	
	$scope.addOrganizationAddress = function () {
		
		AddressService.addAddress($scope.newOrganizationAddress)
		.then(function(response) {
			var addressAdded = response.data;
			OrganizationService.addOrganizationAddress(organizationId, addressAdded._links.self.href)
			.then(function success(response) {
				$scope.organizationAddress.addresses.push(addressAdded);
			}, function error(response) {
				
			});
			$scope.message='';
			$scope.errorMessage = '';
		}, function(response) {
			$scope.message='';
			$scope.errorMessage = 'Error adding address!';
		});
		
		$scope.addPersonAddressElem = false;
	}
	
	$scope.updateOrganizationAddress = function (address) {
		var addressId = address._links.self.href.split('http://' + location.host + '/addresses/')[1];
		
		OrganizationService.updateOrganizationAddress(addressId, address)
		.then(function success(response) {
			refreshOrganizationAddress();
			alert('Organization address updated');
		}, function error(response) {
			alert('Error updating organization address');
		});
	}
	
	$scope.deleteOrganizationAddress = function (addressUrl) {
		var addressId = addressUrl.split('http://' + location.host + '/addresses/')[1];
		
		OrganizationService.deleteOrganizationAddress(organizationId, addressId)
		.then(function success(response){
			refreshOrganizationAddress();
		}, function error(response) {
			alert('Error deleting the address');
		});
	}
	
	$scope.setPaginatedAddresses = function (page) {
		$scope.addOrganizationAddressElem = true;
		$scope.newOrganizationAddress = {};
		var pageSize = 15;
		
		if($scope.addressSearchValue == "") {
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
			AddressService.searchAddress($scope.addressSearchValue, pageSize, (page - 1))
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
	
	$scope.setPaginatedPersons = function (page) {
		
		$scope.addPersonElem = true;
		$scope.persons = [c1 = [], c2 = [], c3 = [], c4 = [], c5 = [], c6 = [], c7 = [], c8 = [],
			c9 = [], c10 = [], c11 = [], c12 = [], c13 = [], c14 = [], c15 = []];
		var itemsPerColumn = 15;
		var counter = 0;
		var pageSize = 45;
		
		if($scope.personSearchValue == "") {
			PersonService.getPaginatedPerson(pageSize, (page - 1))
			.then(function success(response) {
				for(var i = 0; i <= 2; i++) {
					for(var j = 0; j <= (itemsPerColumn - 1); j++) {
						$scope.persons[j].push(response.data._embedded.persons[counter]);
						counter++;
					}
				}
				$scope.personPager.currentPage = response.data.page.number + 1;
				$scope.personPager.totalPages = response.data.page.totalPages;
				$scope.personPager.pages = PagerService.createSlideRange($scope.personPager.currentPage, $scope.personPager.totalPages);
			}, function error(response){
				$scope.message='';
				$scope.errorMessage = 'Error getting persons!';
			});
		} else {
			PersonService.searchPerson($scope.personSearchValue, pageSize, (page - 1))
			.then(function success(response) {
				for(var i = 0; i <= 2; i++) {
					for(var j = 0; j <= (itemsPerColumn - 1); j++) {
						$scope.persons[j].push(response.data._embedded.persons[counter]);
						counter++;
					}
				}
				$scope.personPager.currentPage = response.data.page.number + 1;
				$scope.personPager.totalPages = response.data.page.totalPages;
				$scope.personPager.pages = PagerService.createSlideRange($scope.personPager.currentPage, $scope.personPager.totalPages);
			}, function error(response){
				$scope.message='';
				$scope.errorMessage = 'Error getting persons!';
			});
		}
	}
	
	$scope.linkPerson = function (person) {
		
		var personId = person._links.self.href.split('http://' + location.host + '/persons/')[1];
		var personExists = false;
		
		$scope.organizationPerson.persons.forEach(function (element) {
			var actualPersonId = element._links.self.href.split('http://' + location.host + '/persons/')[1];
			personExists = (personId == actualPersonId) ? true : false;
		});
		
		if (personExists) {
			alert('This person is alreday in the organization');
		} else {
			PersonService.addPersonOrganization(personId, 'http://' + location.host + '/organizations/' + organizationId)
			.then(function success(response) {
				$scope.organizationPerson.persons.push(person);
				
			}, function error(response) {
				alert("error adding a person to the organization");
			});
		}
		$scope.personSearchValue = "";
		$scope.addPersonElem = false;
		
		/*For some reason this is not working properly: the info is send to the DB, and it answers as if the operation was complete
		 * nevertheless no real changes were performed in the DB
		 * OrganizationService.addOrganizationPerson(organizationId, person._links.self.href)
		.then(function success(response) {
			$scope.organizationPerson.persons.push(person);
			$scope.addPersonElem = false;
		}, function error(response) {
			alert("error adding a person to the organization");
		});*/
	}
	
	$scope.unlinkPerson = function (personUrl) {
		
		var personId = personUrl.split('http://' + location.host + '/persons/')[1];
		
		PersonService.deletePersonOrganization(personId, organizationId)
		.then(function success(response) {
			refreshOrganizationPerson();
		}, function error(response) {
			alert('error unlinking the person from the organization');
		});
		
		/*Here happens the same that in comment in the function to link the person a person to the organization*/
	}
	
	$scope.updateOrganization = function () {
		
		if ($scope.organization.name == "") {
			alert('The field for the organization name cannot be empty');
		} else {
			OrganizationService.updateOrganization(organizationId, $scope.organization)
			.then(function(response) {
				//alert('Organization updated');
				$location.path('/organizations');
			}, function error(response) {
				alert('Error Updating organization');
			});
		}
		
	}
	
	$scope.cancel = function () {
		$location.path('/organizations');
	};
	//Bug: the same address can be added more than once
}]);