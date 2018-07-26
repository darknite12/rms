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
					$scope.errorMessage = 'Error searching persons: \n' + response.data.cause.cause.message;
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

app.controller('OrganizationController', ['$scope', function ($scope) {
	
}]);