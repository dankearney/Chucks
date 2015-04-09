var express = require('express');
var models	= require('./models.js')
var path	= require('path')
var app     = express();


app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.get('/', function(req, resp){
	models.getBeers('cd', function(beers) {
          resp.render('beers', {"beers" : beers, 'location' : 'cd'});
	});
})

app.get('/ballard', function(req, resp){
	models.getBeers('ballard', function(beers) {
          resp.render('beers', {"beers" : beers, 'location' : 'ballard'});
	});
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})

module.exports = app;
