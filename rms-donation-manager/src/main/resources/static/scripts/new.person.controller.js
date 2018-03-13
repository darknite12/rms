var app = angular.module('rmsdmgui.person.controllers');

app.controller('NewPersonController', ['$scope', '$location', 'PersonService', 'AddressService', 'OrganizationService', 'PagerService',
	function($scope, $location, PersonService, AddressService, OrganizationService, PagerService){
	
	$scope.newPersonView = true;
	
	$scope.person = {};
	
	$scope.personAddress = {addresses : [], exist : []};
	$scope.personOrganization = {organizations : [], exist : []};
	
	$scope.newPersonAddress = {};
	$scope.newPersonOrganization = {};
	
	$scope.pager = {};
	
	$scope.addPerson = function () {
		PersonService.addPerson($scope.person)
		.then(function success (response) {
			var personId = response.data._links.self.href.split('http://' + location.host + '/persons/')[1];
			
			for(var i = 0 ; i <= ($scope.personAddress.addresses.length - 1) ; i++){
				
				if(!$scope.personAddress.exist[i]){
					AddressService.addAddress($scope.personAddress.addresses[i])
					.then(function success(response) {
						var newAddressAdded = response.data._links.self.href;
						PersonService.addPersonAddress(personId, newAddressAdded)
						.then(function success(response) {
							
						}, function error(response) {
							alert("Eror adding addresses");
						});
					}, function error(response) {
						alert("Eror adding New addresses");
					});
				} else if($scope.personAddress.exist[i]) {
					PersonService.addPersonAddress(personId, $scope.personAddress.addresses[i]._links.self.href)
					.then(function success(response) {
						
					}, function error(response) {
						alert("Eror adding addresses");
					});
				}
				
			}
			
			for(var j = 0; j <= ($scope.personOrganization.organizations.length - 1); j++){
				if(!$scope.personOrganization.exist[j]){
					OrganizationService.addOrganization($scope.personOrganization.organizations[j])
					.then(function success(response) {
						var newOrganizationAdded = response.data._links.self.href;
						PersonService.addPersonOrganization(personId, newOrganizationAdded)
						.then(function success(response) {
							
						}, function error(response) {
							alert("Eror adding addresses");
						});
					}, function error(response) {
						alert("Eror adding New addresses");
					});
				} else if($scope.personOrganization.exist[j]) {
					PersonService.addPersonOrganization(personId, $scope.personOrganization.organizations[j]._links.self.href)
					.then(function success(response) {
						
					}, function error(response) {
						alert("Eror adding addresses");
					});
				}
			}
		}, function error (response) {
			alert("Try again");
		});
		$location.path('/persons');
	}
	
	$scope.addPersonAddress = function (){
		$scope.personAddress.addresses.push($scope.newPersonAddress);
		$scope.personAddress.exist.push(false);
		$scope.addPersonAddressElem = false;
	}

	$scope.addPersonOrganization = function (){
		$scope.personOrganization.organizations.push($scope.newPersonOrganization);
		$scope.personOrganization.exist.push(false);
		$scope.addPersonOrganizationElem = false;
	}

	$scope.updatePersonAddress = function (address, index) {
		$scope.personAddress.addresses[index] = address;
	}

	$scope.updatePersonOrganization = function (organization, index) {
		$scope.personOrganization.organizations[index] = organization;
	}
	
	$scope.setPersonAddress = function (address) {
		$scope.personAddress.addresses.push(address);
		$scope.personAddress.exist.push(true);
		$scope.addPersonAddressElem = false;
	}

	$scope.setPersonOrganization = function (organization) {
		$scope.personOrganization.organizations.push(organization);
		$scope.personOrganization.exist.push(true);
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
		$scope.searchValue = "";
		$scope.pager.totalPages = 2;
		$scope.setPage(1);
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