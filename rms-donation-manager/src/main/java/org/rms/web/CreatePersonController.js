/**
 * This is the controller for the createPerson template
 */
mainApp.controller('CreatePersonController', function($scope, $http) {
	
	/*Here is the declaration of the Object person*/
	$scope.person = {
			title : "",
			firstName : "",
			lastName : "",
			language : "",
			married : false,
			spouse : {
				firstName : "",
				lastName : ""
			},
			contactPerson : {
				firstName : "",
				lastName : "",
				cellPhoneNumber : "",
				homePhoneNumber : "",
				workPhoneNumber : "",
				faxPhoneNumber : ""
			},
			email : "",
			address : {
				street : "",
				number : "",
				city : "",
				province : "",
				postalCode : "",
				poBox : ""
			},
			parish : "",
			community : "",
			organization : {
				name : "",
				sameAddress : true,
				address : {
					street : "",
					number : "",
					city : "",
					province : "",
					postalCode : "",
					poBox : ""
				}
			},
			status : "",
			information : ""
	};
	
	$scope.submit = function (){
		var personObj = $scope.person;
		var personsPostAnswer;
		var personAddrPostAnswer;
		var organizationAddrPostAnswer;
		var organizationsPostAnswer;
		var spouseFullName = "Not married";
		
		if (personObj.married){
			spouseFullName = personObj.spouse.firstName + " " + personObj.spouse.lastName;
		}
		//Sending information to person table
		//check the URL
		$http.post("http://localhost:8080/persons", {
			"title" : personObj.title,
			"firstName" : personObj.firstName,
			"lastName" : personObj.lastName,
			"spouse" : spouseFullName,
			"contactPerson" : personObj.contactPerson.firstName + " " + personObj.contactPerson.lastName,
			"homePhoneNumber" : personObj.contactPerson.homePhoneNumber,
			"cellPhoneNumber" : personObj.contactPerson.cellPhoneNumber,
			"workPhoneNumber" : personObj.contactPerson.workPhoneNumber,
			"faxPhoneNumber" : personObj.contactPerson.faxPhoneNumber,
			"email" : personObj.email,
			"language" : personObj.language,
			"parish" : personObj.parish,
			"community" : personObj.community,
			"benefactorStatus" : personObj.status,
			"info" : personObj.information
		}).then(function (serverAnswer){
			cosole.log(serverAnswer);
			personsPostAnswer = serverAnswer;
		});
		
		//Sending information to addresses table
		$http.post("http://localhost:8080/addresses", {
			"address" : personObj.address.number + " " + personObj.address.street,
			"address2" : null,
			"poBox" : personObj.address.poBox,
			"city" : personObj.address.city,
			"provice" : personObj.address.province,
			"postalCode" : personObj.address.postalCode
		}).then(function (serverAnswer){
			cosole.log(serverAnswer);
			personAddrPostAnswer = serverAnswer;
		});
		
		//Sending information to organizations table
		$http.post("http://localhost:8080/organizations", {
			"name" : personObj.organization.name
		}).then(function (serverAnswer){
			cosole.log(serverAnswer);
			organizationsPostAnswer = serverAnswer;
		});
		
		if(!personObj.organization.sameAddress){
			$http.post("http://localhost:8080/addresses", {
				"address" : personObj.organization.address.number + " " + personObj.organization.address.street,
				"address2" : null,
				"poBox" : personObj.organization.address.poBox,
				"city" : personObj.organization.address.city,
				"provice" : personObj.organization.address.province,
				"postalCode" : personObj.organization.address.postalCode
			}).then(function (serverAnswer){
				cosole.log(serverAnswer);
				organizationAddrPostAnswer = serverAnswer;
			});
		} else {
			organizationAddrPostAnswer = personAddrPostAnswer
		}
		
		/*Now here we have to create the relations
		 *between the table using the variables
		 *with the answers from the server*/
	}
	
});