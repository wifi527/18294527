var fs = require( 'fs' ); // Filesystem
var express = require( 'express' ); // Server
var bp = require( 'body-parser' ); // Request Inhalte auslesen

var app = express();

var server = app.listen(5000,function(){
  console.log( 'Server gestartet. http://localhost:5000' );
});

/*
!!! ACCESS Control Origin Header, wenn Quelle nicht die gleiche ist. */
/*
app.use( function(req, res, next) {
  res.setHeader( 'Access-Control-Allow-Origin', '*' );
  res.setHeader( 'Access-Control-Allow-Methods', 'GET, POST' );
  next(); // nicht vergessen!
});
*/

// statische Files liegen alle im Unterordner "static"
app.use( express.static( 'static' ) );

// POST Request Daten stehen danach in request.body
app.use( bp.urlencoded({ extended:true }));

var getOrte = function( cb ) {
  fs.readFile( 'meineorte.json', function(err, data ) {
    cb( JSON.parse(data) );
  });
}

app.post( '/orte', function( req, res ) {
  getOrte( function(d) {
    d.alle.push( req.body );
    fs.writeFile( 'meineorte.json', JSON.stringify(d),  function(){
      res.writeHead( 200, {'Content-Type':'application/json'});
      res.end( JSON.stringify({saved:true}) );
    });
  });
});

app.get( '/get_orte', function( req, res ) {
  getOrte( function(d) {
    res.writeHead( 200, {'Content-Type':'application/json'});
    res.end( JSON.stringify(d) );
  });
});

app.get( '/', function( req, res ) {
  res.sendFile( __dirname + '/d12-orte.html' );
});

/*
//besser statische File wie oben durchschleifen

app.get( '/jquery-3.3.1.min.js', function(req,res) {
  res.sendFile( __dirname + '/jquery-3.3.1.min.js' );
  /*fs.readFile( 'jquery-3.3.1.min.js', function( err, data ) {
    res.writeHead(200,{'Content-Type':'text/javascript'});
    res.end( data );
  });* /
});
*/
