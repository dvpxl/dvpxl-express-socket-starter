var express = require('express');
var app = express();
var server = require('http').Server(app);  
var bodyParser = require('body-parser');
var io = require('socket.io')(server);


app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());


// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

var routes = require('./routes.js');
    routes(app, io);

/***
* Socket handling
***/

io.on('connection', function(client) {  
    console.log('Client connected...');
	client.on('join', function(data) {
	    console.log('From Server:' + data);
	});

	client.on('messages', function(data) {
	    console.log('From Server:' + data);
	});

	client.emit('speech', 'testdata');

	setInterval(function(){
		var random = Math.random();
		client.emit('heartbeat', random);
		console.log('emitting heartbeat' + random);
	}, 2000);
});



server.listen(app.get('port'), function(){
  console.log("application started");
});