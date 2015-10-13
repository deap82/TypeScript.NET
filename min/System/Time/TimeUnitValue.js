/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require","exports","../Compare","./TimeUnit","./TimeSpan"],function(e,t,n,o,i){function r(e){if(!(e instanceof a||e instanceof i["default"]))throw new Error("Invalid comparison type.  Must be of type TimeUnitValue or TimeSpan.")}function u(e){if(isNaN(e)||e>o["default"].Days||e<o["default"].Ticks||Math.floor(e)!==e)throw new Error("Invalid TimeUnit.");return!0}var a=function(){function e(e,t){this.value=e,this._type=t,u(t)}return e.prototype.coerce=function(t){var n=this._type;if(u(n),t instanceof i["default"])t=t.toTimeUnitValue(n);else{if(!(t instanceof e))return null;n!==t.type&&(t=t.to(n))}return t},e.prototype.equals=function(e){var t=this.coerce(e);return null==t?!1:n.areEqual(this.value,t.value)},e.prototype.compareTo=function(e){return null==e?1:(r(e),n.compare(this.value,this.coerce(e).value))},Object.defineProperty(e.prototype,"type",{get:function(){return this._type},enumerable:!0,configurable:!0}),e.prototype.toTimeSpan=function(){return new i["default"](this.value,this.type)},Object.defineProperty(e.prototype,"total",{get:function(){return this.toTimeSpan()},enumerable:!0,configurable:!0}),e.prototype.to=function(e){return void 0===e&&(e=this.type),this.toTimeSpan().toTimeUnitValue(e)},e}();Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=a});
//# sourceMappingURL=TimeUnitValue.js.map
