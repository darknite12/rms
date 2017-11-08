var app = angular.module('rmsdmgui.person.controllers');

app.controller('NewPersonController', ['$scope', '$location', 'PersonService', 'AddressService', 'OrganizationService', 
	function($scope, $location, PersonService, AddressService, OrganizationService){
	
	$scope.newPersonView = true;
	
	$scope.person = {};
	
	$scope.personAddress = {addresses : [], exist : []};
	$scope.personOrganization = {organizations : [], exist : []};
	
	$scope.newPersonAddress = {};
	$scope.newPersonOrganization = {};
	
	$scope.addPerson = function () {
		PersonService.addPerson($scope.person)
		.then(function success (response) {
			var personId = response.data._links.self.href.split("http://localhost:8080/persons/")[1];
			
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
			
			
			//add for-loop to add Organizations
		}, function error (response) {
			alert("Try again");
		});
		$location.path('/persons');
		//Do not forget to make the relations with address and organization
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