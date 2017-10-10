angular.module('dmgui', [])
.controller('Person', function($scope, $http) {
    $http.get('http://localhost:8080/persons/{id}').
    then(function(response) {
        $scope.person = response.data;
    });
});