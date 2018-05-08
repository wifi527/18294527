/*
*
*	 Model Module
*
*/
var MVC = (function(mvc) {
  'use strict';

  mvc.Model = function(data) {
    this._data = data;
    this.onSet = new mvc._Event(this);
  };

  // define getters and setters
  mvc.Model.prototype.get = function(){
	  return this._data;
  };
  mvc.Model.prototype.set = function(data){
	  this._data = data;
      this.onSet.notify({ data: data });
  };
  return mvc;
})(MVC || {});
