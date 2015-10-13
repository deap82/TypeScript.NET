/*
 * @author electricessence / https://github.com/electricessence/
 * Based upon .NET source.
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 * Source: http://referencesource.microsoft.com/#mscorlib/system/IObserver.cs
 */
var __extends=this&&this.__extends||function(e,o){function t(){this.constructor=e}for(var r in o)o.hasOwnProperty(r)&&(e[r]=o[r]);e.prototype=null===o?Object.create(o):(t.prototype=o.prototype,new t)};define(["require","exports","./SubscribableBase"],function(e,o,t){function r(e,o,t){void 0===t&&(t=!0);for(var r=null,n=0;n<e.length;n++){var i=e[n];try{o(i)}catch(u){r=r||[],r.push({observer:i,ex:u})}}if(t&&(e.length=0),r&&r.length){if(!console||!console.error)throw{message:s,errors:r};console.error(s,r)}}var n=function(e){function o(){e.apply(this,arguments)}return __extends(o,e),o.prototype.onNext=function(e){r(this._getSubscribers(),function(o){o.onNext&&o.onNext(e)})},o.prototype.onError=function(e){r(this._getSubscribers(),function(o){o.onError&&o.onError(e)})},o.prototype.onCompleted=function(){r(this._unsubscribeAll(!0),function(e){e.onCompleted&&e.onCompleted()})},o}(t["default"]);Object.defineProperty(o,"__esModule",{value:!0}),o["default"]=n;var s="One or more observers had errors when attempting to pass information."});
//# sourceMappingURL=ObservableNodeBase.js.map
