# Chucks Hop Shop mobile app backed

A service that returns a JSON object containing all beers being served by Chuck's in its two Seattle locations, Ballard and Central District.

## Requests

get /
get /beers

Both return array of JSON beer objects

## Response

Returns array of JSON objects with following schema.

Beer schema

index : int (what number on the board)
brewery : str
name : str 
type : str (ipa, stout, etc. not all will have)
growler_price : str
pint_price : str
abv : str
location : str (ballard or central)

## Sample beer object

{"index":12,"brewery":"OskarBlues","name":"OldChubScotchAle","type":"","growler_price":"$12.0","pint_price":"$4.0","abv":"8.0","location":"ballard"}
