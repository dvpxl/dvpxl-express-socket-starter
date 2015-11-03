
var httpRequest = require('request');

module.exports = function(app, io) {

    app.get('/', function(request, response) {
        response.render('pages/index');
    });

	app.get('/page1', function(request, response) {
		response.render('pages/page1');
	});

};