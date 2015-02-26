app = angular.module("cpacApp", []);

app.controller("cpacController", ["$scope", "$http", "$sce", function($scope, $http, $sce){
	
	console.log("Hello world!");
	
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		$scope.mobile = true;
	}
	
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
	
	$scope.turnOffAudio = function(){
		$("audio").each(function(){ this.pause();})
		$scope.data.categories.forEach(function(category){ category.days.forEach(function(day){  day.quotes.forEach(function(quote){ quote.playing = false }); }); });
		console.log("Turning off sound!");
	}
	
	$scope.playAudio = function(index, quote){

		sound = document.getElementById(index);
		console.log(sound);
		quote.activated = true;
		
		if( quote.playing ){
			quote.playing = false;
			sound.pause();
			console.log("Sound is playing, so I'm turning it off.");
			
		}
		else {
			$scope.turnOffAudio();
			console.log("Sound isn't playing, so I'm turning everything else off and turning this on.");
			quote.playing = true; 
			console.log("Ready state is" + sound.readyState);
			if( sound.readyState == 4){
				sound.currentTime = 0;
				sound.play();
			} else {
				sound.load();
				sound.addEventListener("canplay", function(){
					console.log("Sound loaded!")
					sound.currentTime = 0;
					sound.play();
				});
			}
			
			sound.onended = function() {
				$scope.$apply(function(){
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

