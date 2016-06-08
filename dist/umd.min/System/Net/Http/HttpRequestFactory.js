/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
!function(t){if("object"==typeof module&&"object"==typeof module.exports){var e=t(require,exports);void 0!==e&&(module.exports=e)}else"function"==typeof define&&define.amd&&define(["require","exports","../../Exceptions/ArgumentNullException","../../Disposable/DisposableBase","./HttpMethod","../../Uri/Uri","../../../extends"],t)}(function(t,e){"use strict";var r=t("../../Exceptions/ArgumentNullException"),o=t("../../Disposable/DisposableBase"),i=t("./HttpMethod"),u=t("../../Uri/Uri"),s=t("../../../extends"),n=s["default"],p=function(t){function e(e,o){if(t.call(this),this._http=e,this._disposableObjectName="HttpRequestFactory",!e)throw new r.ArgumentNullException("_http");this._uriDefaults=u.Uri.from(o)}return n(e,t),e.prototype._onDispose=function(){this._http=null,this._uriDefaults=null},e.prototype.uri=function(t){var r=this;r.throwIfDisposed();var o=u.Uri.from(t,r._uriDefaults);return r._uriDefaults.equals(o)?r:new e(r._http,o)},e.prototype.params=function(t){var e=this;return e.throwIfDisposed(),e.uri(e._uriDefaults.updateQuery(t))},e.prototype.request=function(t,e){var r=this;return r.throwIfDisposed(),r._http.request({method:t,uri:r._uriDefaults,data:e})},e.prototype.get=function(){return this.request(i.GET)},e.prototype.put=function(){return this.request(i.PUT)},e.prototype.post=function(t){return this.request(i.POST,t)},e.prototype["delete"]=function(){return this.request(i.DELETE)},e}(o.DisposableBase);Object.defineProperty(e,"__esModule",{value:!0}),e["default"]=p});
//# sourceMappingURL=HttpRequestFactory.js.map