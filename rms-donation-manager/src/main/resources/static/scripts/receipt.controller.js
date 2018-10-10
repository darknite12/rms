var app = angular.module('rmsdmgui.receipt.controllers', []);

app.controller('ReceiptsController', ['$scope', '$location', 'ReceiptService', 'TicketService', 'PersonService', 'OrganizationService', 'PagerService', 'PDFService', 
	function ($scope, $location, ReceiptService, TicketService, PersonService, OrganizationService, PagerService, PDFService) {

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
	
	var checkReceiptAddress = function () {
		var receiptWithNoAddress = 0;
		$scope.receipts.forEach(function (element) {
			var receiptId = element._links.self.href.split('http://' + location.host + '/receipts/')[1];
			ReceiptService.getPerson(receiptId)
			.then(function success(response) {
				var personId = response.data._links.self.href.split('http://' + location.host + '/persons/')[1];
				PersonService.getPersonAddress(personId)
				.then(function success(response) {
					if (response.data._embedded.addresses.length <= 0) {
						element.background = "infobackground";
						receiptWithNoAddress++;
						$scope.alertKind = 'info';
						$scope.message = 'Hilighted receipts do not have an address. There is(are) ' + receiptWithNoAddress + ' receipt(s) with no address';
						$scope.showAlert = true;
					}
				}, function error(response) {
					
				});
			}, function error(response) {
				switch(response.status) {
				case 404:
					ReceiptService.getOrganization(receiptId)
					.then(function success(response) {
						var organizationId = response.data._links.self.href.split('http://' + location.host + '/organizations/')[1];
						OrganizationService.getOrganizationAddress(organizationId)
						.then(function success(response) {
							if (response.data._embedded.addresses.length <= 0) {
								element.background = "infobackground";
								receiptWithNoAddress++;
								$scope.alertKind = 'info';
								$scope.message = 'Hilighted receipts do not have an address. There is (are) ' + receiptWithNoAddress + ' receipt(s) with no address';
								$scope.showAlert = true;
							}
						}, function error (response) {
							
						});
					}, function error(response) {
						
					});
					break;
				}
			});
		});
	}
	
	$scope.setPage = function(page) {
		if(page <= $scope.pager.totalPages) {
			if($scope.searchValue == "" && $scope.selectedYear == "All") {
				ReceiptService.getPaginatedReceipt(pageSize, (page - 1))
				.then(function success(response) {
					$scope.receipts = response.data._embedded.receipts;
					checkReceiptAddress();
					$scope.pager.currentPage = response.data.page.number + 1;
					$scope.pager.totalPages = response.data.page.totalPages;
					$scope.pager.totalElements = response.data.page.totalElements
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
					checkReceiptAddress();
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
					checkReceiptAddress();
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
			$scope.alertKind = 'danger';
			$scope.message = 'Error number: ' + response.data.status + '. ' + response.data.error + ". It was not posible to generate the receipts: " + response.data.exception;
			$scope.showAlert = true;
		});
	}
	
	$scope.updateTaxReceiptName = function(receipt) {
		var receiptId = receipt._links.self.href.split('http://' + location.host + '/receipts/')[1];
		var newName = receipt.taxReceiptName;
		
		ReceiptService.updateTaxReceiptName(receiptId, newName)
		.then(function success(response) {
			$scope.alertKind = 'success';
			$scope.message = 'The tax receipt name has been updated to: ' + newName;
			$scope.showAlert = true;
		}, function error(response) {
			$scope.alertKind = 'danger';
			$scope.message = 'Error updating the tax receipt name';
			$scope.showAlert = true;
		});
	}
	
	$scope.downloadReceipt = function(receipt) {
		
		var receiptId = receipt._links.self.href.split('http://' + location.host + '/receipts/')[1];
		
		if (receipt.taxReceiptName == "" || receipt.taxReceiptName == null) {
			$scope.alertKind = 'danger';
			$scope.message = 'The receipt does not have a name:\nIt cannot be downloaded without it.';
			$scope.showAlert = true;
		} else {
			ReceiptService.getPerson(receiptId)
			.then(function success(response) {
				var personId = response.data._links.self.href.split('http://' + location.host + '/persons/')[1];
				PersonService.getPersonAddress(personId)
				.then(function success(response) {
					var address = response.data._embedded.addresses[0];
					if (response.data._embedded.addresses.length <= 0) {
						$scope.alertKind = 'danger';
						$scope.message = 'There is no address related to ' + receipt.taxReceiptName + ':\nThe receipt cannot be printed without an address';
						$scope.showAlert = true;
					} else {
						var address = response.data._embedded.addresses[0];
						PDFService.generateReceipt(receipt, address);
					}
				}, function error(response) {
					
				});
			}, function error(response) {
				switch(response.status) {
				case 404:
					ReceiptService.getOrganization(receiptId)
					.then(function success(response) {
						var organizationId = response.data._links.self.href.split('http://' + location.host + '/organizations/')[1];
						OrganizationService.getOrganizationAddress(organizationId)
						.then(function success(response) {
							if (response.data._embedded.addresses.length <= 0) {
								$scope.alertKind = 'danger';
								$scope.message = 'There is no address related to ' + receipt.taxReceiptName + ' organization: The receipt cannot be printed without an address';
								$scope.showAlert = true;
							} else {
								var address = response.data._embedded.addresses[0];
								PDFService.generateReceipt(receipt, address);
							}
						}, function error (response) {
							
						});
					}, function error(response) {
						
					});
					break;
				}
			});
		}
		
	}
	
	$scope.downloadAllReceipts = function() {
		console.log($scope.pager);
		var receiptsArray = {receipt : [], address : []}; //This array contains the receipts with their corresponding addresses
		var notAddedElements = 0; //This can be use for information in the future
		ReceiptService.getPaginatedReceipt($scope.pager.totalElements, 0)
		.then(function success(response) {
			var totalElements = response.data.page.totalElements;
			var elementCounter = 0;
			response.data._embedded.receipts.forEach(function(element) {
				var receiptId = element._links.self.href.split('http://' + location.host + '/receipts/')[1];
				if (element.taxReceiptName == "" || element.taxReceiptName == null) {
					$scope.alertKind = 'danger';
					$scope.message = 'The receipt N. ' + element.receiptNumber + ' does not have a name:\nIt cannot be downloaded without it.';
					$scope.showAlert = true;
				} else {
					ReceiptService.getPerson(receiptId)
					.then(function success(response) {
						var personId = response.data._links.self.href.split('http://' + location.host + '/persons/')[1];
						PersonService.getPersonAddress(personId)
						.then(function success(response) {
							if (response.data._embedded.addresses.length <= 0) {
								notAddedElements ++;									
							} else {
								var address = response.data._embedded.addresses[0];
								receiptsArray.receipt.push(element);
								receiptsArray.address.push(address);
							}
							elementCounter ++;
							if (elementCounter == totalElements) {
								PDFService.generateAllReceipts(receiptsArray);
								if (notAddedElements != 0) {
									$scope.alertKind = 'info';
									$scope.message = notAddedElements + ' receipt(s) could not be downloanded for lacking of address';
									$scope.showAlert = true;
								}
							}
						});
					}, function error(response) {
						switch(response.status) {
						case 404:
							ReceiptService.getOrganization(receiptId)
							.then(function success(response) {
								var organizationId = response.data._links.self.href.split('http://' + location.host + '/organizations/')[1];
								OrganizationService.getOrganizationAddress(organizationId)
								.then(function success(response) {
									if (response.data._embedded.addresses.length <= 0) {
										notAddedElements ++;
									} else {
										var address = response.data._embedded.addresses[0];
										receiptsArray.receipt.push(element);
										receiptsArray.address.push(address);										
									}
									elementCounter ++;
									if (elementCounter == totalElements) {
										PDFService.generateAllReceipts(receiptsArray);
										if (notAddedElements != 0) {
											$scope.alertKind = 'info';
											$scope.message = notAddedElements + ' receipt(s) could not be downloaded for lacking of address';
											$scope.showAlert = true;
										}
									}
								});
							});
							break;
						}
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
	
	$scope.modifyReceipt = function (receiptUrl) {
		$location.path(receiptUrl.split(location.host)[1]);
	}
}]);

app.controller('ReceiptController', ['$scope', '$location', '$routeParams', 'ReceiptService', 'TicketService', 'PersonService', 'OrganizationService', 'AddressService', 'PagerService',
	function ($scope, $location, $routeParams, ReceiptService, TicketService, PersonService, OrganizationService, AddressService, PagerService, PDFService) {
	
	$scope.receipt = {};
	$scope.personOrOrganizationName = "";
	$scope.addressSearchValue = "";
	$scope.receiptAddress = [];
	$scope.addressPager = {};
	var receiptId = $routeParams.id;
	var isPerson = false;
	var personOrOrganizationId = "";
	
	ReceiptService.getReceipt(receiptId)
	.then(function success(response) {
		$scope.receipt = response.data;
	}, function error(response) {
		
	});
	
	ReceiptService.getPerson(receiptId)
	.then(function success(response) {
		isPerson = true;
		$scope.personOrOrganizationName = response.data.firstName + " " + response.data.lastName;
		personOrOrganizationId = response.data._links.self.href.split('http://' + location.host + '/persons/')[1];
		PersonService.getPersonAddress(personOrOrganizationId)
		.then(function success(response) {
			$scope.receiptAddress = response.data._embedded;
		}, function error(response) {
			
		});
	}, function error(response) {
		switch(response.status) {
		case 404:
			isPerson = false;
			ReceiptService.getOrganization(receiptId)
			.then(function success(response) {
				$scope.personOrOrganizationName = response.data.name;
				personOrOrganizationId = response.data._links.self.href.split('http://' + location.host + '/organizations/')[1];
				OrganizationService.getOrganizationAddress(personOrOrganizationId)
				.then(function success(response) {
					$scope.receiptAddress = response.data._embedded;
				}, function error (response) {
					
				});
			}, function error(response) {
				
			});
			break;
		}
	});
	
	var refreshReceiptAddress = function () {
		if (isPerson) {
			PersonService.getPersonAddress(personOrOrganizationId)
			.then(function success(response) {
				$scope.receiptAddress = response.data._embedded;
			}, function error(response) {
				
			});
		} else {
			OrganizationService.getOrganizationAddress(personOrOrganizationId)
			.then(function success(response) {
				$scope.receiptAddress = response.data._embedded;
			}, function error (response) {
				
			});
		}
	}
	
	$scope.setPaginatedAddresses = function (page) {
		$scope.addReceiptAddressElem = true;
		$scope.newReceiptAddress = {};
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
	
	$scope.setReceiptAddress = function (address) {
		if (isPerson) {
			PersonService.addPersonAddress(personOrOrganizationId, address._links.self.href)
			.then(function success(response) {
				$scope.receiptAddress.addresses.push(address);
			}, function error(response) {
				
			});
		} else {
			OrganizationService.addOrganizationAddress(personOrOrganizationId, address._links.self.href)
			.then(function success(response) {
				$scope.receiptAddress.addresses.push(address);
			}, function error(response) {
				
			});
		}
		
		$scope.addressSearchValue = "";
		$scope.addReceiptAddressElem = false;
	}
	
	$scope.addReceiptAddress = function () {
		AddressService.addAddress($scope.newReceiptAddress)
		.then(function success(response) {
			var addressAdded = response.data;
			if (isPerson) {
				PersonService.addPersonAddress(personOrOrganizationId, addressAdded._links.self.href)
				.then(function success(response) {
					$scope.receiptAddress.addresses.push(addressAdded);
				}, function error(response) {
					
				});
			} else {
				OrganizationService.addOrganizationAddress(personOrOrganizationId, addressAdded._links.self.href)
				.then(function success(response) {
					$scope.receiptAddress.addresses.push(addressAdded);
				}, function error(response) {
					
				});
			}
		}, function error(response) {
			
		});
		
		$scope.addReceiptAddressElem = false;
	}
	
	$scope.deleteReceiptAddress = function (addressUrl) {
		var addressId = addressUrl.split('http://' + location.host + '/addresses/')[1];
		
		if (isPerson) {
			PersonService.deletePersonAddress(personOrOrganizationId, addressId)
			.then(function success(response) {
				refreshReceiptAddress();
			}, function error(response) {
				
			});
		} else {
			OrganizationService.deleteOrganizationAddress(personOrOrganizationId, addressId)
			.then(function success(response) {
				refreshReceiptAddress();
			}, function error(response) {
				
			});
		}
	}
	
	$scope.cancel = function () {
		$location.path('/receipts');
	};
}]);