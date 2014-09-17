var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var Futures = require('futures');
var app     = express();

app.set('port', (process.env.PORT || 3000))
app.use(express.static(__dirname + '/public'))


function getBeerEntry(beer, location) {
	lines = beer.toString().split("\n");
	var index = lines[1];
	if (index) {
		index = index.replace(')', '');
	}
	index = parseInt(index);
	if (!index) {
		return null;
	}
	var brewery = lines[2].replace(/\W/g, '');
	var name = lines[3].replace(/\W/g, '');
	// the above actually kills regular spaces - try ("[^a-zA-Z0-9\s]", 
	var type = beer.attr('class').split(" ")[1];
	var growler_price = beer.children('.beer_meta_xlarge').text();
	var pint_price = beer.children('.beer_meta_small').text();
	var abv = beer.children('.beer_meta_big').text();
	return makeBeerObject(index, brewery, name, type, growler_price, pint_price, abv, location);
}

function makeBeerObject(index, brewery, name, type, growler_price, pint_price, abv, location) {
    return {"index" : index, 
    		"brewery" : brewery, 
    		"name" : name, 
    		"type" : type, 
    		"growler_price" : growler_price, 
    		"pint_price" : pint_price,
    		"abv" : abv,
    		"location" : location};
}

function isHeader(beer) {
	return beer.attr('class').indexOf('header') >= 0;
}

function scrapeLocation(html, location) {
	var $ = cheerio.load(html);
	var beers = $(".beer_even, .beer_odd");
	var out = [];
	var beer, name, index, entry;
	beers.each(function(i, elem) {
		beer = $(this);
		if (!isHeader(beer)) {
			entry = getBeerEntry(beer, location);
			if (entry) {
				out.push(entry);
			}
		}
	});
	return out;
}


var route = ['/','/beers'];
app.get(route, function(req, resp) {

	var sequence = Futures.sequence();

	sequence
	.then(function(next, res) {
	    var ballard_url = 'http://www.chucks85th.com';
		request(ballard_url, function (err, response, html) {
			if (!err) {
			    res = scrapeLocation(html, "ballard");
			    next(res);
			} else {
				console.log(err);
			}
	    });		
	})
	.then(function(next, res) {
	    var central_url = 'http://cd.chucks85th.com';
		request(central_url, function (err, response, html) {
			if (!err) {
			    var out = scrapeLocation(html, "central");
			    resp.send(JSON.stringify(out.concat(res)));
			} else {
				console.log(err);
			}
	    });
	});

});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})

module.exports = app;

