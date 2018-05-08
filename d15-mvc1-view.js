/*
*
*	 One-Way View
*
*/
var MVC = (function (mvc) {
  'use strict';

  mvc.View = function(model, selector) {
    this._model = model;
    this._selector = selector;

    this._model.onSet.attach( this.show.bind(this) );

    this.onClick = new mvc._Event(this);
    this._selector.addEventListener( 'click', function(e) {
      e.preventDefault();
      this.onClick.notify( this._model.get() + 1 );
    }.bind(this) )


  }

  mvc.View.prototype.show =function(){
     this._selector.innerHTML = this._model.get();
  };


  return mvc;
})(MVC || {});
