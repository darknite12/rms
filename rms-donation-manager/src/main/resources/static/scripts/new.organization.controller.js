var app = angular.module('rmsdmgui.organization.controllers');

app.controller('NewOrganizationController', ['$scope', '$location', 'OrganizationService', 'PersonService', 'AddressService', 'PagerService',
	function($scope, $location, OrganizationService, PersonService, AddressService, PagerService){
	
	$scope.newOrganizationView = true;
	$scope.addressSearchValue = "";
	$scope.personSearchValue = "";
	$scope.organization = {};
	
	$scope.organizationAddress = {addresses : [], exist : []};
	$scope.organizationPerson = {persons : []};
	
	$scope.newOrganizationAddress = {};
	$scope.newOrganizationPerson = {};
	
	$scope.addressPager = {};
	$scope.personPager = {};
	
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
	
	$scope.addOrganizationAddress = function (){
		$scope.organizationAddress.addresses.push($scope.newOrganizationAddress);
		$scope.organizationAddress.exist.push(false);
		$scope.addOrganizationAddressElem = false;
	}
	
	$scope.setOrganizationAddress = function (address) {
		$scope.organizationAddress.addresses.push(address);
		$scope.organizationAddress.exist.push(true);
		$scope.addOrganizationAddressElem = false;
	}
	
	//this method needs to be looked at to see if it is necessary
	$scope.updateOrganizationAddress = function (address, index) {
		$scope.organizationAddress.addresses[index] = address;
	}
	
	$scope.linkPerson = function(person) {
		$scope.organizationPerson.persons.push(person);
		$scope.addPersonElem = false;
		$scope.personSearchValue = "";
	}
	
	$scope.addOrganization = function() {
		OrganizationService.addOrganization($scope.organization)
		.then(function success(response) {
			var organizationId = response.data._links.self.href.split('http://' + location.host + '/organizations/')[1];
			
			for (var i = 0; i <= ($scope.organizationAddress.addresses.length - 1); i++) {
				if (!$scope.organizationAddress.exist[i]) {
					AddressService.addAddress($scope.organizationAddress.addresses[i])
					.then(function success(response) {
						var newAddressUrl = response.data._links.self.href;
						OrganizationService.addOrganizationAddress(organizationId, newAddressUrl)
						.then(function success(response) {
							alert('NEW address added to the new organization');
						}, function error(response) {
							alert('Error adding new address to new organization');
						});
					}, function error(response) {
						alert("Error adding New addresse");
					});
				} else if ($scope.organizationAddress.exist[i]) {
					OrganizationService.addOrganizationAddress(organizationId, $scope.organizationAddress.addresses[i]._links.self.href)
					.then(function success(response) {
						alert('OLD address added to the new organization');
					}, function error(response) {
						alert('Error adding old address to new organization');
					});
				}
			}
			//this part is not working yet
			$scope.organizationPerson.persons.forEach(function(element) {
				var personId = element._links.self.href.split('http://' + location.host + '/persons/')[1];
				PersonService.addPersonOrganization(personId, 'http://' + location.host + '/organizations/' + organizationId)
				.then(function success(response) {
					alert('Person added to the organization');
				}, function error(response) {
					alert('Error adding persons to de organization');
				});
				
				/*The same problem as in organization controllers
				 * OrganizationService.addOrganizationPerson(organizationId, element._links.self.href)
				.then(function success(response) {
					
				}, function error(response) {
					
				});*/
			});
		}, function error(response) {
			alert('Error adding organization');
		});
	}
}]);