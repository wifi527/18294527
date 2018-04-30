var addieren = function( a, b) {
  if ( typeof a == 'undefined' ) a = 0;
  if ( typeof b == 'undefined' ) b = 0;
  if ( typeof a == 'string' ) a = a.replace(',','.');
  if ( typeof b == 'string' ) b = b.replace(',','.');
  if ( isFinite(a) ) a *= 1;
  if ( isFinite(b) ) b *= 1;
  return a+b;
}
var addieren3 = function( a, b ) {
  a = a || 0;
  b = b || 0;
  a = a.toString().replace( ',' , '.');
  b = b.toString().replace( ',' , '.');
  a = isFinite( a ) ? a * 1 : a;
  b = isFinite( b ) ? b * 1 : b;
  return a + b;
}
var addieren2 = function( a, b ) {
  if ( !a && !b ) return 0;
  a = (a+'').replace( ',' , '.');
  b = (b+'').replace( ',' , '.');
  if ( isFinite( a ) && isFinite( b ) )
    return a*1+b*1;
  else
    return a+b;
}

var makeObect = function() {
  return {a:1};
}

var machObjekt = function() {
  this.a = 1;
}

var summe = function( a,b ) {
  var sum = addieren(a,b);
  document.getElementById('ausgabe').innerHTML = sum;
}
