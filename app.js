var express = require('express');
var app = express();
var server = require('http').Server(app);  
var bodyParser = require('body-parser');
var io = require('socket.io')(server);
var mongoose = require('mongoose');


app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());


// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

var routes = require('./routes.js');
    routes(app, io);


/*
Mongo database connection test
*/

mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(callback){
	console.log('connection to database successful');
});

/*
Mongoose simple schema
*/

var userSchema = mongoose.Schema({
    name: String,
    type: String,
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    meta: {
    	votes: Number,
    	favs: Number
    }
});

/*
Mongoose save middleware
inserts the proper created/updated time
*/
userSchema.pre('save', function(next){
  now = new Date();
  this.updated_at = now;
  if ( !this.created_at ) {
    this.created_at = now;
  }
  next();
});


var User = mongoose.model('User', userSchema);

//creating a test user
var user1 = new User({
	name: 'john doe',
	type: 'student',
	meta: {
		votes: 1,
		favs: 1
	}
});

//output
console.log('Created User: \n' + user1);

//save user
user1.save(function (err, user){
	if(err) return console.error(err);
	console.info("User Saved to Database\n" + user);
});	


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