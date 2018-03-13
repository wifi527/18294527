/*
 *  Berechne Umfang eines Kreises mit dem Radius
  */




var umfang = function( r ) { // r => lokale Variable
	var u;
	u = 2 * r * Math.PI;
	return u; // Rückgabewert
}

var runden = function( zahl, stellen ) {
	var gerundet, faktor;

	faktor = Math.pow(10, stellen);
	gerundet = Math.round( zahl*faktor ) / faktor;
	return gerundet;
}

var el = function( id ) {
	return document.getElementById( id );
}

var zufallsZahl = function() {
  return Math.floor( Math.random() * 10 ) + 1;
}
