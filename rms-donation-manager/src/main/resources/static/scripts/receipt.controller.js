var app = angular.module('rmsdmgui.receipt.controllers', []);

app.controller('ReceiptsController', ['$scope', 'ReceiptService', 'TicketService', 'PersonService', 'OrganizationService', 'PagerService', 'PDFService', 
	function ($scope, ReceiptService, TicketService, PersonService, OrganizationService, PagerService, PDFService) {

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
						alert("Error searching receipt: \nStatus: " + response.status + "\nMessage: " + response.data.cause.cause.message);
						break;
					case 500:
						alert("Error searching receipt: \nStatus: " + response.status + "\nMessage: " + response.data.message);
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
						alert("Error searching receipt: \nStatus: " + response.status + "\nMessage: " + response.data.cause.cause.message);
						break;
					case 500:
						alert("Error searching receipt: \nStatus: " + response.status + "\nMessage: " + response.data.message);
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
						alert("Error searching receipt: \nStatus: " + response.status + "\nMessage: " + response.data.cause.cause.message);
						break;
					case 500:
						alert("Error searching receipt: \nStatus: " + response.status + "\nMessage: " + response.data.message);
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
		
		if (receipt.taxReceiptName == "" || receipt.taxReceiptName == null) {
			alert('The receipt does not have a name:\nIt cannot be downloaded without it.');
		} else {
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
					switch(response.status) {
					case 404:
						TicketService.getOrganization(ticketId)
						.then(function success(response) {
							var organizationId = response.data._links.self.href.split('http://' + location.host + '/organizations/')[1];
							OrganizationService.getOrganizationAddress(organizationId)
							.then(function success(response) {
								var address = response.data._embedded.addresses[0];
								PDFService.generateReceipt(receipt, address);
							}, function error (response) {
								
							});
						}, function error(response) {
							
						});
						break;
					}
				});
			}, function error(response) {
				alert("error")
			});
		}
		
	}
	
	$scope.downloadAllReceipts = function() {
		var receiptsArray = {receipt : [], address : []}; //This array contains the receipts with their corresponding addresses
		for (var i = 0; i <= $scope.pager.totalPages; i++) {
			ReceiptService.getPaginatedReceipt(pageSize, i)
			.then(function success(response) {
				var totalElements = response.data.page.totalElements;
				response.data._embedded.receipts.forEach(function(element) {
					var receiptId = element._links.self.href.split('http://' + location.host + '/receipts/')[1];
					
					if (element.taxReceiptName == "" || element.taxReceiptName == null) {
						alert('The receipt N. ' + element.receiptNumber + ' does not have a name:\nIt cannot be downloaded without it.');
					} else {
						ReceiptService.getTickets(receiptId)
						.then(function success(response) {
							var ticketId = response.data._embedded.tickets[0]._links.self.href.split('http://' + location.host + '/tickets/')[1];
							TicketService.getPerson(ticketId)
							.then(function success(response) {
								var personId = response.data._links.self.href.split('http://' + location.host + '/persons/')[1];
								PersonService.getPersonAddress(personId)
								.then(function success(response) {
									var address = response.data._embedded.addresses[0];
									receiptsArray.receipt.push(element);
									receiptsArray.address.push(address);
									//Be careful when a receipt cannot be added: it would cause this if clause not to work
									if (receiptsArray.receipt.length >= totalElements) {
										PDFService.generateAllReceipts(receiptsArray);
									}
								}, function error(response) {
									
								});
							}, function error(response) {
								switch(response.status) {
								case 404:
									TicketService.getOrganization(ticketId)
									.then(function success(response) {
										var organizationId = response.data._links.self.href.split('http://' + location.host + '/organizations/')[1];
										OrganizationService.getOrganizationAddress(organizationId)
										.then(function success(response) {
											var address = response.data._embedded.addresses[0];
											receiptsArray.receipt.push(element);
											receiptsArray.address.push(address);
											//Be careful when a receipt cannot be added: it would cause this if clause not to work
											if (receiptsArray.receipt.length >= totalElements) {
												PDFService.generateAllReceipts(receiptsArray);
											}
										}, function error (response) {
											
										});
									}, function error(response) {
										
									});
									break;
								}
							});
						}, function error(response) {
							alert("error")
						});
					}
					
				});
			}, function error(response) {
				switch(response.status) {
				case 409:
					alert("Error searching receipt: \nStatus: " + response.status + "\nMessage: " + response.data.cause.cause.message);
					break;
				case 500:
					alert("Error searching receipt: \nStatus: " + response.status + "\nMessage: " + response.data.message);
					break;
				}
			});
		}
	}
}]);