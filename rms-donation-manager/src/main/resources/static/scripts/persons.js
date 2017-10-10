angular.module('dmgui', [])
.controller('Persons', function($scope, $http) {
    $http.get('http://localhost:8080/persons/').
        then(function(response) {
            $scope.persons = response.data;
        });
});