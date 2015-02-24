app = angular.module("cpacApp", []);

app.controller("cpacController", ["$scope", "$http", "$sce", function($scope, $http, $sce){
	
	$scope.renderHTML = function(text){ return $sce.trustAsHtml(text); };
	
	$http.get("data.json")
		.error(function(error){
			console.log("Hit an error! Here it is: " + error);
		})
		.success(function(response){	
			$scope.data = response;
		});
	
	
}]);

