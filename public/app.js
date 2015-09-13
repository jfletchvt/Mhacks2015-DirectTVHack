//Application specific code
//Initiate the WebSocket connection through socket.io
var socket = io.connect();

function init() {
	socket.on("newTweet", function(data) {
		console.log(data);
	  });
}