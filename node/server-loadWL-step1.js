// server-loadWL
// lädt CSV Daten von Wienerlinien und fügt sie zu einem JSON zusammen

// --- benötigten Module
var express = require( 'express' );
var bp = require( 'body-parser' );
var fs = require( 'fs' );
var request = require( 'request' );
var csv = require( 'csv' );

// startet Express/Applikation bzw. Server
var app = express();
var server = app.listen(5001, function() {
  console.log( 'Server läuft Port 5001' );
});



// Standardfunktionen für statische Files und
// POST Requests
app.use( bp.urlencoded({ extended:true }));
app.use( express.static( 'static' ) );

var urlLinienCSV = 'https://data.wien.gv.at/csv/wienerlinien-ogd-linien.csv';
var urlSteigeCSV = 'https://data.wien.gv.at/csv/wienerlinien-ogd-steige.csv';
var urlHaltestellenCSV = 'https://data.wien.gv.at/csv/wienerlinien-ogd-haltestellen.csv';

var loadWLData = function( url ) {
  return new Promise( function(resolve, reject) {
      request.get( url, function( err, response, body ) {
          if ( !err && response.statusCode == 200 ) {
            resolve( body );
          } else {
            reject();
          }
      });
  });
}


var parseCSV = function( body ) {
  return new Promise( function( resolve, reject ) {
    csv.parse( body, {delimiter:';'}, function(err, data) {
      if ( err ) { reject(); }
      else { resolve(data); }
    });
  });
}


// HTML für UI
app.get( '/loaddata', function(request,response){

  // Import Daten von WL
  // 1. Lade Linien CSV
  loadWLData( urlLinienCSV )
    .then( function( contentCSV ) {
        console.log( 'CSV1 geladen.');
        return parseCSV( contentCSV );
    })
    .then( function( dataCSV ) {
        console.log( 'CSV1 Daten geparst.');
        return loadWLData( urlSteigeCSV );
    })
    .then( function( contentCSV ) {
        console.log( 'CSV2 geladen.');
        return parseCSV( contentCSV );
    })
    .then( function( dataCSV ) {
        console.log( 'CSV2 Daten geparst.');
        return loadWLData( urlHaltestellenCSV );
    })
    .then( function( contentCSV ) {
        console.log( 'CSV3 geladen.');
        return parseCSV( contentCSV );
    })
    .then( function( dataCSV ) {
      console.log( 'CSV3 Daten geparst.');
      response.end( 'FERTIG' );
    })
    .catch( function() {
      console.log( 'CSV Ladefehler!' );
      response.end( 'ERR' );
    });



  // 2. Parse Linien CSV
  // 3. Lade Bahnsteige CSV
  // 4. Parse Bahnsteige CSV
  // 5. Lade Haltestellen CSV
  // 6. Parse Haltestellen CSV

});
