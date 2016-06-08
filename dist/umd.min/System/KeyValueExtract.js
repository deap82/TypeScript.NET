/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
!function(e){if("object"==typeof module&&"object"==typeof module.exports){var t=e(require,exports);void 0!==t&&(module.exports=t)}else"function"==typeof define&&define.amd&&define(["require","exports","./Exceptions/ArgumentException","./Exceptions/ArgumentNullException"],e)}(function(e,t){"use strict";function n(e){return e&&e.hasOwnProperty(p)&&e.hasOwnProperty(s)}function o(e,t){if(void 0===t&&(t=d),i(e,t+c+p),null===e)throw new a.ArgumentNullException(t+c+p);return e}function r(e,t){if(void 0===t&&(t=d),2!=e.length)throw new l.ArgumentException(t,"KeyValuePair tuples must be of length 2.");o(e[0],t)}function i(e,t){if(e===f)throw new l.ArgumentException(t,E);return e}function u(e,t){var u,a;if(e instanceof Array)r(e),u=e[0],a=i(e[1],x);else{if(!n(e))throw new l.ArgumentException(d,m);u=o(e.key),a=i(e.value,y)}return t(u,a)}var l=e("./Exceptions/ArgumentException"),a=e("./Exceptions/ArgumentNullException"),f=void 0,c=".",p="key",s="value",d="item",x=d+"[1]",y=d+c+s,m="Invalid type.  Must be a KeyValuePair or Tuple of length 2.",E="Cannot equal undefined.";t.isKeyValuePair=n,t.assertKey=o,t.assertTuple=r,t.assertNotUndefined=i,t.extractKeyValue=u,Object.defineProperty(t,"__esModule",{value:!0}),t["default"]=u});
//# sourceMappingURL=KeyValueExtract.js.map