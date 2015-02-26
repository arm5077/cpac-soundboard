app = angular.module("cpacApp", []);

app.controller("cpacController", ["$scope", "$http", "$sce", function($scope, $http, $sce){
	
	$scope.renderHTML = function(text){ return $sce.trustAsHtml(text); };
	$scope.trustURL = function(url){ return $sce.trustAsResourceUrl(url) };
	$scope.prepareForTweet = function(text){
		return text.replace(/<(?:.|\n)*?>/gm, '').replace(/;/g, ' - ');
	}
	
	$scope.formatTime = function(timestamp){
		return moment(timestamp).format('MMM. D');
	};
	
	$scope.isNew = function(timestamp){
		return( ( moment() - moment(timestamp) ) / 1000 / 60 <= 60 );
	}
	
	$scope.playAudio = function(index, quote){
		sound = document.getElementById(index);
		quote.activated = true;
		
		if( quote.playing ){
			quote.playing = false;
			sound.pause();
			
		}
		else {
			
			$("audio").each(function(){ this.pause();})
			$scope.data.categories.forEach(function(category){ category.days.forEach(function(day){  day.quotes.forEach(function(quote){ quote.playing = false }); }); });

			quote.playing = true; 
			sound.currentTime = 0;
			sound.play();
			sound.onended = function() {
				$scope.$timeout(function(){
					quote.playing = false;
				});
				
				
				
			};
		}
	}
	
	$http.get("data.json")
		.error(function(error){
			console.log("Hit an error! Here it is: " + error);
		})
		.success(function(response){	
			$scope.data = response;
		});
	
	
}]);

