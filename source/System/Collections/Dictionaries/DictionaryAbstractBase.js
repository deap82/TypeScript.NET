/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */
define(["require", "exports", '../../Compare', '../Enumeration/EnumeratorBase', '../../Exceptions/NotImplementedException', '../../Exceptions/ArgumentException', '../../Exceptions/InvalidOperationException'], function (require, exports, Values, EnumeratorBase, NotImplementedException, ArgumentException, InvalidOperationException) {
    var DictionaryAbstractBase = (function () {
        function DictionaryAbstractBase() {
            this._updateRecursion = 0;
        }
        Object.defineProperty(DictionaryAbstractBase.prototype, "isUpdating", {
            get: function () { return this._updateRecursion != 0; },
            enumerable: true,
            configurable: true
        });
        DictionaryAbstractBase.prototype._onValueUpdate = function (key, value, old) {
            if (!Values.areEqual(value, old, true)) {
                var _ = this;
                if (_.onValueChanged)
                    _.onValueChanged(key, value, old);
                if (_._updateRecursion == 0)
                    _._onUpdated();
            }
        };
        DictionaryAbstractBase.prototype._onUpdated = function () {
            var _ = this;
            if (_.onUpdated)
                _.onUpdated();
        };
        DictionaryAbstractBase.prototype.handleUpdate = function (closure) {
            var _ = this, result;
            if (closure) {
                _._updateRecursion++;
                try {
                    result = closure();
                }
                finally {
                    _._updateRecursion--;
                }
            }
            else
                result = _._updateRecursion == 0;
            if (result && _._updateRecursion == 0)
                _._onUpdated();
            return result;
        };
        Object.defineProperty(DictionaryAbstractBase.prototype, "isReadOnly", {
            get: function () { return false; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DictionaryAbstractBase.prototype, "count", {
            get: function () {
                throw notImplementedException("count");
            },
            enumerable: true,
            configurable: true
        });
        DictionaryAbstractBase.prototype.add = function (item) {
            if (!item)
                throw new ArgumentException('item', 'Dictionaries must use a valid key/value pair. \'' + item + '\' is not allowed.');
            this.addByKeyValue(item.key, item.value);
        };
        DictionaryAbstractBase.prototype.clear = function () {
            var _ = this, keys = _.keys, count = keys.length;
            if (count)
                _.handleUpdate(function () {
                    keys.forEach(function (key) { _.removeByKey(key); });
                    return true;
                });
            if (_.count != 0)
                console.warn("Dictionary clear() results in mismatched count.");
            return count;
        };
        DictionaryAbstractBase.prototype.contains = function (item) {
            if (!item)
                return false;
            var value = this.getValue(item.key);
            return Values.areEqual(value, item.value);
        };
        DictionaryAbstractBase.prototype.copyTo = function (array, index) {
            if (index === void 0) { index = 0; }
            var e = this.getEnumerator();
            while (e.moveNext()) {
                array[index++] = e.current;
            }
        };
        DictionaryAbstractBase.prototype.remove = function (item) {
            var key = item.key, value = this.getValue(key);
            return (Values.areEqual(value, item.value) && this.removeByKey(key))
                ? 1 : 0;
        };
        Object.defineProperty(DictionaryAbstractBase.prototype, "keys", {
            get: function () { throw notImplementedException("keys"); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DictionaryAbstractBase.prototype, "values", {
            get: function () { throw notImplementedException("values"); },
            enumerable: true,
            configurable: true
        });
        DictionaryAbstractBase.prototype.addByKeyValue = function (key, value) {
            var _ = this;
            if (_.containsKey(key)) {
                var ex = new InvalidOperationException("Adding a key/value when the key already exists.");
                ex.data['key'] = key;
                ex.data['value'] = value;
                throw ex;
            }
            _.setValue(key, value);
        };
        DictionaryAbstractBase.prototype.getValue = function (key) {
            throw notImplementedException("getValue(key: TKey): TValue", "When calling for key: " + key);
        };
        DictionaryAbstractBase.prototype.setValue = function (key, value) {
            throw notImplementedException("setValue(key: TKey, value: TValue): boolean", "When setting " + key + ":" + value + ".");
        };
        DictionaryAbstractBase.prototype.containsKey = function (key) {
            var value = this.getValue(key);
            return value !== undefined;
        };
        DictionaryAbstractBase.prototype.containsValue = function (value) {
            var e = this.getEnumerator(), equal = Values.areEqual;
            while (e.moveNext()) {
                if (equal(e.current, value, true)) {
                    e.dispose();
                    return true;
                }
            }
            return false;
        };
        DictionaryAbstractBase.prototype.removeByKey = function (key) {
            return this.setValue(key, undefined);
        };
        DictionaryAbstractBase.prototype.removeByValue = function (value) {
            var _ = this, count = 0, equal = Values.areEqual;
            _.keys.forEach(function (key) {
                if (equal(_.getValue(key), value, true)) {
                    _.removeByKey(key);
                    ++count;
                }
            });
            return count;
        };
        DictionaryAbstractBase.prototype.importPairs = function (pairs) {
            var _ = this;
            return _.handleUpdate(function () {
                var changed = false;
                pairs.forEach(function (pair) {
                    _.setValue(pair.key, pair.value);
                    changed = true;
                });
                return changed;
            });
        };
        DictionaryAbstractBase.prototype.getEnumerator = function () {
            var _ = this;
            var keys, len, i = 0;
            return new EnumeratorBase(function () {
                keys = _.keys;
                len = keys.length;
            }, function (yielder) {
                while (i < len) {
                    var key = keys[i++], value = _.getValue(key);
                    if (value !== undefined)
                        return yielder.yieldReturn({ key: key, value: value });
                }
                return yielder.yieldBreak();
            });
        };
        return DictionaryAbstractBase;
    })();
    function notImplementedException(name, log) {
        if (log === void 0) { log = ""; }
        console.log("DictionaryAbstractBase sub-class has not overridden " + name + ". " + log);
        return new NotImplementedException("DictionaryAbstractBase." + name + ": Not implemented.");
    }
    return DictionaryAbstractBase;
});
//# sourceMappingURL=DictionaryAbstractBase.js.map