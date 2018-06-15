var app = angular.module('rmsdmgui.receipt.controllers', []);

app.controller('ReceiptsController', ['$scope', 'ReceiptService', 'PagerService', function ($scope, ReceiptService, PagerService) {

	$scope.receipts = [];
	
	$scope.pager = {};
	//This is to make possible the first entrance to setPage function (look if there is a better solution)
	$scope.pager.totalPages = 2;
	$scope.searchValue = "";
	var pageSize = 15;
	
	$scope.setPage = function(page) {
		if(page <= $scope.pager.totalPages) {
			if($scope.searchValue == "") {
				ReceiptService.getPaginatedReceipt(pageSize, (page - 1))
				.then(function success(response) {
					$scope.receipts = response.data._embedded.receipts;
					$scope.pager.currentPage = response.data.page.number + 1;
					$scope.pager.totalPages = response.data.page.totalPages;
					$scope.pager.pages = PagerService.createSlideRange($scope.pager.currentPage, $scope.pager.totalPages);
					$scope.message='';
					$scope.errorMessage = '';
				}, function error(response) {
					
				});
			} else {
				ReceiptService.searchReceipt($scope.searchValue, pageSize, (page - 1))
				.then(function success(response) {
					$scope.receipts = response.data._embedded.receipts;
					$scope.pager.currentPage = response.data.page.number + 1;
					$scope.pager.totalPages = response.data.page.totalPages;
					$scope.pager.pages = PagerService.createSlideRange($scope.pager.currentPage, $scope.pager.totalPages);
					$scope.message='';
					$scope.errorMessage = '';
				}, function error(response) {
					
				});
			}
		}
	}
	
	$scope.setPage(1);
	
	$scope.generateReceipts = function() {
		ReceiptService.generateReceipts()
		.then(function success(response) {
			
		}, function error(response) {
			
		})
	}
	
	$scope.downloadReceipt = function(receiptUrl) {
		
	}
}]);