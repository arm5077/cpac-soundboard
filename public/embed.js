// Requires jQuery.

console.log("Embedded scripts running ...");

var pymParent = new pym.Parent('iframe', "https://s3-us-west-2.amazonaws.com/nationaljournal/cpac-soundboard/index.html", {});

resize();
$(window).resize(resize);
setInterval(resize, 1000);

function resize(){
	if( $(window).width() > 1125 ){
		$("#iframe").css({
			"width": "180%",
			"margin-left": "-40%"
		});
	}
	else {
		$("#iframe").css({
			"width": "",
			"margin-left": ""
		});
	}
}
