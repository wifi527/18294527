var http = require( 'http' ); // für HTTP-Requests
var fs = require( 'fs' ); // Filesystem

http.createServer( function( request, response ) {

  console.log( 'Anfrage an den Server!' );

  console.log( request.url );

  if ( request.url == '/' ) {
    response.writeHead( 200, {'Content-Type':'text/html'} );
    //response.end( 'Hallo Welt!' );
    fs.readFile( 'test.html', function( err, data ) {
      response.end( data );
    } );

  } else {
    response.writeHead( 404 );
    response.end( 'Error 404!!!' );
  }



}).listen( 12345 );

console.log( 'Server ist gestartet!' );
console.log( 'URL: http://localhost:12345' );
