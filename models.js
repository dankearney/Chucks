var request = require('request');
var cheerio = require('cheerio');

function getBeerEntry(beer) {
	lines = beer.toString().split("\n");
	var index = lines[1];
	if (index) {
		index = index.replace(')', '');
	}
	index = parseInt(index);
	if (!index) {
		return null;
	}
	var brewery = lines[2].replace(/[^a-zA-Z0-9\s]/, '').replace(/^\s+|\s+$/g,'');
	var name = lines[3].replace(/[^a-zA-Z0-9\s]/, '').replace(/^\s+|\s+$/g,'');
	var type = beer.attr('class').split(" ")[1];
	var growler_price = beer.children('.beer_meta_xlarge').text();
	var pint_price = beer.children('.beer_meta_small').text();
	var abv = beer.children('.beer_meta_big').text();
	return makeBeerObject(index, brewery, name, type, growler_price, pint_price, abv);
}

function makeBeerObject(index, brewery, name, type, growler_price, pint_price, abv) {
    return {"index" : index, 
    		"brewery" : brewery, 
    		"name" : name, 
    		"type" : type, 
    		"growler_price" : growler_price, 
    		"pint_price" : pint_price,
    		"abv" : abv,
    };
}

function isHeader(beer) {
	return beer.attr('class').indexOf('header') >= 0;
}

function scrape(html, location) {
	var $ = cheerio.load(html);
	var beers = $(".beer_even, .beer_odd");
	var out = [];
	var beer, name, index, entry;
	beers.each(function(i, elem) {
		beer = $(this);
		if (!isHeader(beer)) {
			entry = getBeerEntry(beer);
			if (entry) {
				out.push(entry);
			}
		}
	});
	return out;
}

function getBeers (location, callback) {

	if (location == 'cd') {
		url = 'http://cd.chucks85th.com';
	} else {
		url = 'http://www.chucks85th.com';
	} 
	request(url, function (err, response, html) {
		if (!err) {
		    callback(scrape(html));
		} else {
			console.log(err);
		}
    });		
}

exports.getBeers = getBeers;