# Chucks Hop Shop mobile app backed

A service that returns a JSON object containing all beers being served by Chuck's in its two Seattle locations, Ballard and Central District.

## Requests

get /

get /beers

Both return array of JSON beer objects

## Response

Returns array of JSON objects with following schema.

index : int (what number on the board) <br />
brewery : str<br />
name : str <br />
type : str (ipa, stout, etc. not all will have)<br />
growler_price : str<br />
pint_price : str<br />
abv : str<br />
location : str (ballard or central)

## Sample beer object

{"index":12,"brewery":"OskarBlues","name":"OldChubScotchAle","type":"","growler_price":"$12.0","pint_price":"$4.0","abv":"8.0","location":"ballard"}
