// Module
var express = require( 'express' );
//var fs = require( 'fs' );
//var bp = require( 'body-parser' );
var socket = require( 'socket.io');

var app = express();
var server = app.listen(26893,function() {
  console.log( 'WIFI Secret Chat.' );
});

app.use( express.static( 'static' ) );

app.get( '/', function(request,response) {
  response.sendFile( __dirname+'/d13-chat.html' );
})

var aktiveUser = [];
var emojibaseurl = 'https://emojipedia-us.s3.amazonaws.com/thumbs/72/apple/118/';
var emojis = [
  { reg:/:\)/g, url:'grinning-face_1f600.png' },
  { reg:/;\)/g, url:'grinning-face-with-smiling-eyes_1f601.png' },
  { reg:/:X/g, url:'female-singer-type-6_1f469-1f3ff-200d-1f3a4.png' }
];
var makeImageEmojis = function(msg) {
  for ( var i in emojis ) {
    msg = msg.replace( emojis[i].reg, '<img src="'+emojibaseurl+emojis[i].url+'" style="height:1.5em;">' );
  }
  return msg;
}
var makeCharEmojis = function(msg) {
    msg = msg.replace( /:AT/g, String.fromCodePoint(0x1F1E6, 0x1F1F9) );
    msg = msg.replace( /:rainbow/g, String.fromCodePoint(0x1F3F3, 0xFE0F, 0x200D, 0x1F308) );
    return msg;

}


var makeTime = function() {
	var now = new Date();
	var m = now.getMinutes();
	m = (m<10 ? '0' : '')+m;
	var s = now.getSeconds();
	s = (s<10 ? '0' : '')+s;

	return now.getHours()+':'+m+':'+s;
}

var makeTimeHTML = function() {
	return '<time>'+makeTime()+'</time><br>';
}

var showOnliner = function( socket ) {
  var alleUser = 'niemand';
  if ( aktiveUser.length > 0 ) {
    alleUser = aktiveUser.toString();
  }

  socket.emit( 'servershout', '<em>Derzeit online: ' + alleUser + '</em>' );
}

var io = socket( server );
io.on( 'connection', function( socket ) {
  // socket ist Verbindung zw. Server und einem Client
  console.log( 'Neuer Benutzer online.' );
  var user;

  socket.on( 'neueruser', function( name ) {
    user = name;
    io.emit( 'servershout', makeTimeHTML()+'<em><b>'+name+'</b> ist online.</em>' );
    showOnliner(socket);
    aktiveUser.push( user );
  });

  socket.on( 'disconnect', function() {
    io.emit( 'servershout', makeTimeHTML()+'<em>'+user+' ist offline.</em>');
    for ( var i in aktiveUser ) {
      if ( user == aktiveUser[i] ) {
        aktiveUser.splice(i,1);
        break;
      }
    }
  });

  socket.on( 'clientshout', function(msg) {

    if ( msg == '/online' ) {
      showOnliner(socket);
      return;
    }

   //EMOJIS
    msg = makeImageEmojis(msg);
    msg = makeCharEmojis(msg);

    io.emit( 'servershout', makeTimeHTML()+'<b>'+user+'</b>: '+msg );
  });


});
