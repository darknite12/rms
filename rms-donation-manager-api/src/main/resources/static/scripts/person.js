angular.module('dmgui', [])
.controller('Person', function($scope, $http) {
    $http.get('http://localhost:8080/persons/').
        then(function(response) {
            $scope.persons = response.data;
        });
});