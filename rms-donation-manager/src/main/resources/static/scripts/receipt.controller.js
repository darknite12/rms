var app = angular.module('rmsdmgui.receipt.controllers', []);

app.controller('ReceiptsController', ['$scope', 'ReceiptService', 'PagerService', 'PDFService', function ($scope, ReceiptService, PagerService, PDFService) {

	$scope.receipts = [];
	
	$scope.pager = {};
	//This is to make possible the first entrance to setPage function (look if there is a better solution)
	$scope.pager.totalPages = 2;
	$scope.searchValue = "";
	$scope.years = ["All"];
	$scope.selectedYear = "All";
	var date = new Date();
	var pageSize = 15;
	
	var initializeYear = function() {
		var startingYear = "2018";
		var actualYear = date.getFullYear();
		
		for (var i = startingYear; i <= actualYear; i++) {
			$scope.years.push(i);
		}
	}
	
	initializeYear();
	
	$scope.setPage = function(page) {
		if(page <= $scope.pager.totalPages) {
			if($scope.searchValue == "" && $scope.selectedYear == "All") {
				ReceiptService.getPaginatedReceipt(pageSize, (page - 1))
				.then(function success(response) {
					$scope.receipts = response.data._embedded.receipts;
					$scope.pager.currentPage = response.data.page.number + 1;
					$scope.pager.totalPages = response.data.page.totalPages;
					$scope.pager.pages = PagerService.createSlideRange($scope.pager.currentPage, $scope.pager.totalPages);
					$scope.message='';
					$scope.errorMessage = '';
				}, function error(response) {
					switch(response.status) {
					case 409:
						alert("Error searching table: \nStatus: " + response.status + "\nMessage: " + response.data.cause.cause.message);
						break;
					case 500:
						alert("Error searching table: \nStatus: " + response.status + "\nMessage: " + response.data.message);
						break;
					}
				});
			} else if($scope.searchValue == "" && $scope.selectedYear != "All") {
				ReceiptService.getPaginatedReceiptByYear($scope.selectedYear, pageSize, (page - 1))
				.then(function success(response) {
					$scope.receipts = response.data._embedded.receipts;
					$scope.pager.currentPage = response.data.page.number + 1;
					$scope.pager.totalPages = response.data.page.totalPages;
					$scope.pager.pages = PagerService.createSlideRange($scope.pager.currentPage, $scope.pager.totalPages);
					$scope.message='';
					$scope.errorMessage = '';
				}, function error(response) {
					switch(response.status) {
					case 409:
						alert("Error searching table: \nStatus: " + response.status + "\nMessage: " + response.data.cause.cause.message);
						break;
					case 500:
						alert("Error searching table: \nStatus: " + response.status + "\nMessage: " + response.data.message);
						break;
					}
				});
			} else {
				ReceiptService.searchReceipt($scope.searchValue, pageSize, (page - 1))
				.then(function success(response) {
					$scope.receipts = response.data._embedded.receipts;
					$scope.pager.currentPage = response.data.page.number + 1;
					$scope.pager.totalPages = response.data.page.totalPages;
					$scope.pager.pages = PagerService.createSlideRange($scope.pager.currentPage, $scope.pager.totalPages);
					if($scope.pager.totalPages <= 0) {
						alert("No receipts found");
						$scope.pager.totalPages = 2;
						$scope.searchValue = "";
						$scope.setPage(1);
					}
					$scope.message='';
					$scope.errorMessage = '';
				}, function error(response) {
					switch(response.status) {
					case 409:
						alert("Error searching table: \nStatus: " + response.status + "\nMessage: " + response.data.cause.cause.message);
						break;
					case 500:
						alert("Error searching table: \nStatus: " + response.status + "\nMessage: " + response.data.message);
						break;
					}
				});
			}
		}
	}
	
	$scope.setPage(1);
	
	$scope.generateReceipts = function() {

		ReceiptService.generateReceipts($scope.selectedYear)
		.then(function success(response) {
			
		}, function error(response) {
			
		})
	}
	
	$scope.downloadReceipt = function(receipt) {
		
		PDFService.generateReceipt(receipt, {
		      "address" : "2661 Kingston Rd.",
		      "address2" : null,
		      "city" : "Scarborough",
		      "country" : null,
		      "poBox" : null,
		      "postalCode" : "M1M 1M3",
		      "province" : "Ontario",
		      "_links" : {
		        "self" : {
		          "href" : "http://localhost:8080/addresses/1"
		        },
		        "address" : {
		          "href" : "http://localhost:8080/addresses/1"
		        },
		        "persons" : {
		          "href" : "http://localhost:8080/addresses/1/persons"
		        },
		        "organizations" : {
		          "href" : "http://localhost:8080/addresses/1/organizations"
		        }
		      }
		    });
	}
}]);