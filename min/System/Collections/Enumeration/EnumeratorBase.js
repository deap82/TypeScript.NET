/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
var __extends=this&&this.__extends||function(e,t){function r(){this.constructor=e}for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n]);e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)};define(["require","exports","../../Disposable/DisposableBase"],function(e,t,r){var n,i=function(){function e(){}return Object.defineProperty(e.prototype,"current",{get:function(){return this._current},enumerable:!0,configurable:!0}),e.prototype.yieldReturn=function(e){return this._current=e,!0},e.prototype.yieldBreak=function(){return this._current=null,!1},e}();!function(e){e[e.Before=0]="Before",e[e.Running=1]="Running",e[e.After=2]="After"}(n||(n={}));var o=function(e){function t(t,r,n){e.call(this),this.initializer=t,this.tryGetNext=r,this.disposer=n,this.reset()}return __extends(t,e),Object.defineProperty(t.prototype,"current",{get:function(){return this._yielder.current},enumerable:!0,configurable:!0}),t.prototype.reset=function(){var e=this;e._yielder=new i,e._state=n.Before},t.prototype.moveNext=function(){var e=this;try{switch(e._state){case n.Before:e._state=n.Running;var t=e.initializer;t&&t();case n.Running:return e.tryGetNext(e._yielder)?!0:(this.dispose(),!1);case n.After:return!1}}catch(r){throw this.dispose(),r}},t.prototype._onDispose=function(){var e=this,t=e.disposer;e.initializer=null,e.disposer=null;var r=e._yielder;e._yielder=null,r&&r.yieldBreak();try{t&&t()}finally{this._state=n.After}},t}(r["default"]);Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=o});
//# sourceMappingURL=EnumeratorBase.js.map
