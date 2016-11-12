/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports","../../Types","../../Disposable/DisposableBase","../../Disposable/ObjectPool","./IteratorResult","../../../extends"],function(e,t,r,i,n,s,o){"use strict";function a(e){return u||(u=new n.ObjectPool(40,function(){return new c},function(e){return e.yieldBreak()})),e?void u.add(e):u.take()}var u,p=o["default"],d=void 0,c=function(){function e(){this._current=d,this._index=NaN}return Object.defineProperty(e.prototype,"current",{get:function(){return this._current},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"index",{get:function(){return this._index},enumerable:!0,configurable:!0}),e.prototype.yieldReturn=function(e){return this._current=e,isNaN(this._index)?this._index=0:this._index++,!0},e.prototype.yieldBreak=function(){return this._current=d,this._index=NaN,!1},e.prototype.dispose=function(){this.yieldBreak()},e}(),l=function(e){function t(t,i,n,s){e.call(this),this._initializer=t,this._tryGetNext=i,this.reset(),r.Type.isBoolean(s)?this._isEndless=s:r.Type.isBoolean(n)&&(this._isEndless=n),r.Type.isFunction(n)&&(this._disposer=n)}return p(t,e),Object.defineProperty(t.prototype,"current",{get:function(){var e=this._yielder;return e&&e.current},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"index",{get:function(){var e=this._yielder;return e?e.index:NaN},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"isEndless",{get:function(){return this._isEndless},enumerable:!0,configurable:!0}),t.prototype.reset=function(){var e=this;e.throwIfDisposed();var t=e._yielder;e._yielder=null,e._state=0,t&&a(t)},t.prototype._assertBadState=function(){var e=this;switch(e._state){case 3:e.throwIfDisposed("This enumerator caused a fault and was disposed.");break;case 5:e.throwIfDisposed("This enumerator was manually disposed.")}},t.prototype.tryGetCurrent=function(e){return this._assertBadState(),1===this._state&&(e(this.current),!0)},Object.defineProperty(t.prototype,"canMoveNext",{get:function(){return this._state<2},enumerable:!0,configurable:!0}),t.prototype.moveNext=function(){var e=this;e._assertBadState();try{switch(e._state){case 0:e._yielder=e._yielder||a(),e._state=1;var t=e._initializer;t&&t();case 1:return!!e._tryGetNext(e._yielder)||(this.dispose(),e._state=2,!1);default:return!1}}catch(r){throw this.dispose(),e._state=3,r}},t.prototype.tryMoveNext=function(e){return!!this.moveNext()&&(e(this.current),!0)},t.prototype.nextValue=function(){return this.moveNext()?this.current:d},t.prototype.next=function(){return this.moveNext()?new s.IteratorResult(this.current,this.index):s.IteratorResult.Done},t.prototype.end=function(){this._ensureDisposeState(4)},t.prototype["return"]=function(e){var t=this;t._assertBadState();try{return e===d||2===t._state||4===t._state?s.IteratorResult.Done:new s.IteratorResult(e,d,(!0))}finally{t.end()}},t.prototype._ensureDisposeState=function(e){var t=this;t.wasDisposed||(t.dispose(),t._state=e)},t.prototype._onDispose=function(){var e=this;e._isEndless=!1;var t=e._disposer;e._initializer=null,e._disposer=null;var r=e._yielder;e._yielder=null,this._state=5,r&&a(r),t&&t()},t}(i.DisposableBase);t.EnumeratorBase=l,Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=l});
//# sourceMappingURL=EnumeratorBase.js.map