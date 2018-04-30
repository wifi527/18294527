console.log( 'server-linien.js' );

// --- benötigten Module
var express = require( 'express' );
var bp = require( 'body-parser' );
var fs = require( 'fs' );
var request = require( 'request' );
var csv = require( 'csv' );

// Lade U-Bahnen von JSON-File
var ubahnen;
fs.readFile( 'ubahnen.json', function( err, data) {
  try {
    ubahnen = JSON.parse( data );
  } catch(e) {
    console.log( '---- CATCH ----' );
    //console.log( e );
    ubahnen = {};
  }
  console.log( ubahnen );

});


// startet Express/Applikation bzw. Server
var app = express();
var server = app.listen(5001, function() {
  console.log( 'Server läuft Port 5001' );
});

// Standardfunktionen für statische Files und
// POST Requests
app.use( bp.urlencoded({ extended:true }));
app.use( express.static( 'static' ) );

// HTML für UI
app.get( '/', function(request,response){
  response.sendFile( __dirname+'/d14-linien.html' );
});

//POST REQUEST
app.post( '/getWLData', function(req,res) {
  // lade CSV von WL
  console.log( 'Daten von WL werden geladen.' );
  request.get( 'https://data.wien.gv.at/csv/wienerlinien-ogd-linien.csv', function( err, response, body  ) {
    if ( !err && response.statusCode == 200 ) {
      //console.log( body );
      csv.parse( body, {delimiter:';'}, function(error,data) {
        //console.log( data );
        // var ubahnen = {};
        // bei 1 starten, weil 0 sind Spaltenbezeichnungen
        for ( let i = 1; i<data.length; i++ ) {
          if ( data[i][4] != 'ptMetro' ) continue;
          ubahnen[ data[i][1] ] = {linieID:data[i][0]};
        }
        //console.log( ubahnen );
        fs.writeFile( 'ubahnen.json', JSON.stringify( ubahnen ), function() {
          // Antwort zum Client
          res.writeHead(200,{'Content-Type':'application/json'});
          res.end( '{"result":"success"}' );
        });

      } );

    } else {
      res.code(404).end(); // Error keine Daten von WL
    }
  } );
});
// ----------------------------------------------------------

app.post( '/getLineData', function(req,res) {
  var lineID = ubahnen[ req.body.line ].linieID;
  if ( !lineID ) res.code(404).end();

  console.log( 'Daten von WL werden geladen.' );
  request.get( 'https://data.wien.gv.at/csv/wienerlinien-ogd-steige.csv', function( err, response, body  ) {
    if ( !err && response.statusCode == 200 ) {
      csv.parse( body, {delimiter:';'}, function(error,data) {

        var haltestellen = {};
        for ( let i = 1; i<data.length; i++ ) {
          if ( data[i][1] != lineID ) continue;
          if ( !haltestellen[data[i][2]] ) {

            haltestellen[data[i][2]] = {steige:[]};
          }
          haltestellen[data[i][2]].steige.push( { r:data[i][3], rbl:data[i][5] } );
        }
         ubahnen[ req.body.line ].haltestellen = haltestellen;
        fs.writeFile( 'ubahnen.json', JSON.stringify( ubahnen ), function() {
          // Antwort zum Client
          res.writeHead(200,{'Content-Type':'application/json'});
          res.end( '{"result":"success"}' );
        });

      } );

    } else {
      res.code(404).end(); // Error keine Daten von WL
    }
  } );



});


app.post( '/getHSData', function(req,res) {
  var hs = ubahnen[ req.body.line ].haltestellen;
  if ( !hs ) res.code(404).end();

  console.log( 'Daten von WL werden geladen.' );
  request.get( 'https://data.wien.gv.at/csv/wienerlinien-ogd-haltestellen.csv', function( err, response, body  ) {
    if ( !err && response.statusCode == 200 ) {
      csv.parse( body, {delimiter:';'}, function(error,data) {

        for ( let i = 1; i<data.length; i++ ) {
          if ( !hs[ data[i][0] ] ) continue;
          hs[ data[i][0] ].name = data[i][3];
          hs[ data[i][0] ].lat = data[i][6];
          hs[ data[i][0] ].lng = data[i][7];
        }
         ubahnen[ req.body.line ].haltestellen = hs;

        fs.writeFile( 'ubahnen.json', JSON.stringify( ubahnen ), function() {
          // Antwort zum Client
          res.writeHead(200,{'Content-Type':'application/json'});
          res.end( '{"result":"success"}' );
        });

      } );

    } else {
      res.code(404).end(); // Error keine Daten von WL
    }
  } );



});
