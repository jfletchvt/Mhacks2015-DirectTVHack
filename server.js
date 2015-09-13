//Add express for simplified http server
var express = require('express');
var Twit = require('twit');
var http = require('http');
//Let socket.io handle WebSockets
var sio = require('socket.io');
var app = express();

//Include static HTML in the 'html' directory
app.use(express.static( 'html'));
//Add jquery for simplicity
app.use(express.static( 'node_modules/jquery/dist/'));
//Include static HTML in the 'html' directory
app.use(express.static('public'));

//Start the http server on port 4005
var server = app.listen(4005);
server.listen(4005, function() {
    console.log('Server listening at http://localhost:4005/');
});

// Attach the socket.io server to the http server
var io = sio.listen(server);


var T = new Twit({
  consumer_key:         'yNRrasJ04WXQxBEcj3dSQvNMH',
  consumer_secret:      'ka037a5DkkxmrAgV6kgctxnW5SXVsKbNffMzeGap9FW4Hsgcvs',
  access_token:         '70781804-fi8aPrm7BYLZh9YCbiN8XmOZPJUhe0L8v32NHCPv2',
  access_token_secret:  'tojzTgVobECHBGNeW0Nlun1UsDeojQqXSJYAwt99YNTBf'
});

var title = null;

var url = "35.3.6.70"
var options = {
  host: url,
  port: 8080,
  path: '/tv/getTuned'
};

function begin() {
	http.get(options, function(res) {
	  console.log("Got response: " + res.statusCode);

	  res.on("data", function(chunk) {
	    // console.log("BODY: " + chunk);
	    var json = JSON.parse(chunk);
	    title = json.title;
	    console.log(title);
	    var QUERY = title;

		T.get('search/tweets', { q: QUERY, count: 10}, getTweets); 


	  });
	}).on('error', function(e) {
	  console.log("Got error: " + e.message);
	});
}

begin();

function parseTwitterDate(aDate)
{   
  return new Date(Date.parse(aDate.replace(/( \+)/, ' UTC$1')));
}


// var socket = io.connect();
var tweet = null;
var diff = 0;

function getTweets (err, data, response) {
  // console.log(data);
  if (err) {
    console.error('error in gotTweets', err);
    return;
  }
  if (data.hasOwnProperty('statuses')) {
	  var tweet = filterTweets(data.statuses);
	  if (tweet != null){
		  var curTime = new Date();
		  // console.log(curTime);
		  tweetTime = parseTwitterDate(tweet.created_at)
		  // console.log(parseTwitterDate(data.statuses[0].created_at));
		  // console.log((curTime-tweetTime)/1000/60);
		  diff = (curTime-tweetTime)/1000/60;
		  console.log(diff);
		  if (data.hasOwnProperty('search_metadata') && diff <= 0.65 && !data.hasOwnProperty('retweeted_status')) {
			  console.log(tweet.text);
	        // console.log('data.statuses');
	        // console.log(data.statuses[0]);
	        json = {"tweet" : data.statuses[0], "time" : diff }
	      	//Broadcast the head position to all clients
	  		io.emit("newTweet", json);
		  }
	  }
  }

}
//Filter English tweets
function filterTweets(tweets){
	var firstEngTweet = null;
	for(var i=0; i<tweets.length; i++){
		if(tweets[i].user.lang == 'en' || tweets[i].user.lang == 'en-gb') {
			// console.log(tweets[i].user.lang);
			firstEngTweet = tweets[i];
			break;
		}
	}
	return firstEngTweet;
}

console.log('started ARCHIVER', new Date());
var CronJob = require('cron').CronJob;
if (CronJob) {
  new CronJob('*/15 * * * * *', function () {
    console.log('starting cronned job', new Date());
    begin();
  }, null, true, 'America/New_York');
}