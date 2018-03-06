// window.onload = wenn Seite geladen wurde, dann tu was
window.onload = function() {

  // hol einen HTML Tag mit ID und schreib was rein
  document.getElementById( 'absatz' ).innerHTML = 'Hallo  <span id="js">Javascript</span>!';

  document.getElementById( 'absatz' ).onclick = function() {
	   document.getElementById( 'js' ).style.color = 'green';
  } //onclick

} // onload
