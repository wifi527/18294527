/**
 * Controller module
 */
var MVC = (function (mvc) {
  'use strict';

  mvc.Controller = function (model, view) {

    this._model = model;
    this._view = view;

    this._view.onClick.attach(
      (sender, data) => this.update(data)
    );

  };

  mvc.Controller.prototype.update = function(data){
      this._model.set(data);
  };

  return mvc;
})(MVC || {});
