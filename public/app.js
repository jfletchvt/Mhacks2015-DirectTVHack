//Application specific code
//Initiate the WebSocket connection through socket.io
var socket = io.connect();
var tweet = null;
function init() {
	socket.on("newTweet", function(data) {
		console.log(data);
		tweet = data.tweet;
		time = data.time;
		updateTweet(tweet, time);
	  });
}

function updateTweet(tweet, time) {
	$('p').text(tweet.text);
	$('.text-muted').text(parseInt(time*60)+" seconds ago");
	$('.text-success').text("@"+tweet.user.screen_name);
	$('img').attr("src",tweet.user.profile_image_url);
	$('.twt-wrapper').slideDown("slow", function(){
		setTimeout(function(){
		  $('.twt-wrapper').slideUp("slow");
		}, 15000);
	});

}