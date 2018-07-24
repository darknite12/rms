var app = angular.module('rmsdmgui.receipt.controllers', []);

app.controller('ReceiptsController', ['$scope', 'ReceiptService', 'TicketService', 'PersonService', 'PagerService', 'PDFService', 
	function ($scope, ReceiptService, TicketService, PersonService, PagerService, PDFService) {

	$scope.receipts = [];
	
	$scope.pager = {};
	//This is to make possible the first entrance to setPage function (look if there is a better solution)
	$scope.pager.totalPages = 2;
	$scope.searchValue = "";
	$scope.lastReceiptNumber = "";
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

		ReceiptService.generateReceipts($scope.selectedYear, $scope.lastReceiptNumber)
		.then(function success(response) {
			$scope.setPage(1);
		}, function error(response) {
			
		});
	}
	
	$scope.downloadReceipt = function(receipt) {
		
		var receiptId = receipt._links.self.href.split('http://' + location.host + '/receipts/')[1];
		var receiptAdderess = [];
		
		ReceiptService.getTickets(receiptId)
		.then(function success(response) {
			var ticketId = response.data._embedded.tickets[0]._links.self.href.split('http://' + location.host + '/tickets/')[1];
			TicketService.getPerson(ticketId)
			.then(function success(response) {
				var personId = response.data._links.self.href.split('http://' + location.host + '/persons/')[1];
				PersonService.getPersonAddress(personId)
				.then(function success(response) {
					var address = response.data._embedded.addresses[0];
					PDFService.generateReceipt(receipt, address);
				}, function error(response) {
					
				});
			}, function error(response) {
				
			});
		}, function error(response) {
			alert("error")
		});
	}
}]);