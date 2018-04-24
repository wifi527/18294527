// Module
var express = require( 'express' );
var fs = require( 'fs' );
var bp = require( 'body-parser' );

var app = express();
app.listen(5000,function() {
  console.log( 'Server gestartet, Port 5000'  );
});

// sieh nach ob angefragte Datei im Ordner "static" liegt
// für statische Ressourcen (JS, CSS, Images, usw)
app.use( express.static( 'static' ) );

//wandelt POST-Daten in JS-Objekt request.body um
app.use( bp.urlencoded({extended:true} ));

// Request Daten werden als JSON mitgeschickt
// app.use( bp.json() );

var alleOrte; //globale Variable
fs.readFile( 'orte.json', function(err,data) {
  //console.log( data.toString() ); Inhalt der Datei als String
  try {
    alleOrte = JSON.parse(data); // wandle Inhalt in Objekt um
    console.log( 'initial load data', alleOrte.orte ); // Zeige Orte Array
  } catch(e) {
    console.log( 'orte.json ist fehlerhaft!' );
    alleOrte = {orte:[]}; // Fallback wenn JSON-File fehlerhaft
  }
});

app.post( '/orte', function( request, response) {
  var neuerOrt = {
    name: request.body.name,
    lat: request.body.lat * 1,
    lng: request.body.lng * 1
  }

  if ( neuerOrt.name && neuerOrt.lat && neuerOrt.lng ) {
    // Daten speichern
    alleOrte.orte.push( neuerOrt );
    fs.writeFile( 'orte.json', JSON.stringify(alleOrte), function(){
      response.writeHead(200,{'Content-Type':'application/json'});
      response.end( JSON.stringify({result:true}));
    });
  } else {
    // Error
    response.status(500).end();
  }

});


app.post( '/zeigeorte', function(request,response) {
  response.writeHead(200,{'Content-Type':'application/json'});
  response.end( JSON.stringify(alleOrte));
});


app.get( '/', function(request,response){
  response.sendFile( __dirname+'/d13-orte.html' );
});
