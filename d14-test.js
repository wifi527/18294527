QUnit.test( 'mein erster Test', function(assert) {
  assert.ok( 1 == '1', 'automatische Typumwandlung' );
});

QUnit.test( 'Zahlen addieren', function(assert) {
  assert.ok( typeof addieren == 'function', 'Funktion gibt es');
  assert.equal( addieren(1,2), 3, 'Zahlen addieren' );
  assert.equal( addieren('1','2'), 3, 'Addieren mit Typumwandlung' );
  assert.equal( addieren('a','b'), 'ab', 'nicht nummerische Werte werden verkettet' );
  assert.equal( addieren( '1,5', 1.2), 2.7, 'Komma mit Punkt und Beistrich möglich' );
  assert.equal( addieren(), 0, 'Funktion ohne Parameter' );
});

QUnit.test( 'Objekte', function(assert) {
  var o1 = makeObect();
  var o2 = new machObjekt();
  console.log( o1, o2 );
  assert.deepEqual( o1, {a:1}, 'machObjekte sind gleich' );
  assert.propEqual( o2, {a:1}, 'machObjekte sind gleich' );
});

QUnit.module( 'Setup HTML', {
  before:function() {

    var div = document.createElement( 'div' );
    div.id = 'ausgabe';
    document.getElementById( 'qunit-fixture' ).appendChild( div );

  },
  after:function() {

    document.getElementById( 'qunit-fixture' ).innerHTML = '';

  }
});

QUnit.test( 'Addieren mit Ausgabe', function(assert) {
  summe(1,2);
  assert.equal( document.getElementById('ausgabe').innerHTML, '3', 'Ausgabe hat funktioniert' );
});
