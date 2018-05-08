/*
*
*	 Event Module
*
*/
var MVC = (function(mvc) {
  'use strict';

  mvc._Event = function (sender) {

    this._sender = sender;
    this._listeners = [];
  };

  mvc._Event.prototype.attach = function(listener) {
	  this._listeners.push(listener);

  };

  mvc._Event.prototype.notify = function(args) {

	  for (var i in this._listeners) {
		  this._listeners[i](this._sender, args);
	  }
  };

  return mvc;
})(MVC || {});
