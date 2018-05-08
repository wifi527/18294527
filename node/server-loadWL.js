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
            console.log( 'load Error' );
            reject();
          }
      });
  });
}


var parseCSV = function( body ) {
  return new Promise( function( resolve, reject ) {
    csv.parse( body, {delimiter:';'}, function(err, data) {
      if ( err ) { reject();   console.log( 'parse Error' ); }
      else { resolve(data); }
    });
  });
}

var saveWLJSON = function( linien, steige, haltestellen ) {

  return new Promise( function( resolve, reject ) {

    var ubahnen = {}; // alle Infos in einem Objekt zusammengeführt

    for ( let i in linien ) {
      if ( linien[i][4] != 'ptMetro' ) continue;
      // Ubahn gefunden und jetzt?
      ubahnen[ linien[i][1] ] = {
        id: linien[i][0]*1,
        haltestellen:[]
      };
      //console.log( 'Linie ' + linien[i][1] + ' geladen.' );
      for ( let j in steige ) {
        if ( steige[j][1] != linien[i][0] ) continue;

        // überprüfe ob haltestelle schon existiert
        var hsExists = -1;
        for ( let k in ubahnen[ linien[i][1] ].haltestellen ) {
          if ( ubahnen[ linien[i][1] ].haltestellen[k].id == steige[j][2] ) {
            hsExists = k;
            break;
          }
        }
        //console.log( 'HS Index '+hsExists );
        if ( hsExists == -1 ) { // gibt es noch nicht, also neu
          ubahnen[ linien[i][1] ].haltestellen.push( {
            id:steige[j][2] * 1
          } );
          hsExists =  ubahnen[ linien[i][1] ].haltestellen.length - 1;
          for ( let l in haltestellen ) {
            if ( steige[j][2] != haltestellen[l][0] ) continue;
    	      ubahnen[ linien[i][1] ].haltestellen[hsExists].name = haltestellen[l][3];
            ubahnen[ linien[i][1] ].haltestellen[hsExists].lat = haltestellen[l][6] * 1;
            ubahnen[ linien[i][1] ].haltestellen[hsExists].lng = haltestellen[l][7] * 1;
          }

        }

        // jede Haltestelle hat Bahnesteige
        ubahnen[ linien[i][1] ].haltestellen[hsExists]['steig'+steige[j][3]] = steige[j][5] * 1;

        // Reihenfolge
        if ( steige[j][3] == 'H' ) {
          ubahnen[ linien[i][1] ].haltestellen[hsExists].reihenfolge = steige[j][4] * 1;
        }


      }
      //console.log( ubahnen[ linien[i][1] ].haltestellen );
      ubahnen[ linien[i][1] ].haltestellen.sort( function(a,b) {
        return a.reihenfolge < b.reihenfolge ? -1 : 1;
      });
    }


    fs.writeFile( 'ubahnen_alles.json', JSON.stringify(ubahnen), function() {
      resolve();
    });


  });
}

// HTML für UI
app.get( '/loaddata', function(request,response){

  // Import Daten von WL
  // 1. Lade Linien CSV
  var dataLinien, dataSteige, dataHaltestellen;
  loadWLData( urlLinienCSV )
    .then( parseCSV )
    .then( function( dataCSV ) {
        dataLinien = dataCSV;
        console.log( 'CSV1 geladen und geparst.');
        return loadWLData( urlSteigeCSV );
    })
    .then( parseCSV )
    .then( function( dataCSV ) {
        dataSteige = dataCSV;
        console.log( 'CSV2 geladen und geparst.');
        return loadWLData( urlHaltestellenCSV );
    })
    .then( parseCSV )
    .then( function( dataCSV ) {
        dataHaltestellen = dataCSV;
        console.log( 'CSV3 geladen und geparst.');
        return saveWLJSON( dataLinien, dataSteige, dataHaltestellen );
    })
    .then( function() {
        console.log( 'Daten in JSON gespeichert.' );
        response.end( 'FERTIG' );
    })
    .catch( function() {
        console.log( 'CSV Ladefehler!' );
        response.end( 'ERR' );
    });

});


app.get( '/json', function(request,response){
   response.sendFile( __dirname+'/ubahnen_alles.json');
});
