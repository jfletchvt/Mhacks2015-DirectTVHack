//Application specific code



var boxIP = '35.3.6.70'

var xhr = new XMLHttpRequest();

xhr.open("GET", "http://35.3.6.70:8080/tv/getTuned", false);
xhr.send();

var myVar = xhr.responseText;
var json = JSON.parse(myVar)
console.log(json.title);