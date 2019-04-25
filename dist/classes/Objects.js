"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CALLBACK_HELL_LIMIT = 32;
var Objects = (function () {
    function Objects() {
    }
    Objects.copy = function (obj, cbh) {
        if (cbh === void 0) { cbh = 0; }
        if (!this.isObject(obj) || cbh > CALLBACK_HELL_LIMIT)
            return obj;
        var copy;
        if (Array.isArray(obj)) {
            copy = [];
            for (var i in obj) {
                copy.push(this.copy(obj[i], cbh + 1));
            }
        }
        else {
            copy = {};
            for (var key in obj) {
                copy[key] = this.copy(obj[key], cbh + 1);
            }
        }
        return copy;
    };
    Objects.deepSearch = function (obj) {
        var keys = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            keys[_i - 1] = arguments[_i];
        }
        if (!this.isObject(obj) || Array.isArray(obj))
            return false;
        var currentLevel = obj;
        for (var _a = 0, keys_1 = keys; _a < keys_1.length; _a++) {
            var key = keys_1[_a];
            if (key in currentLevel) {
                currentLevel = currentLevel[key];
            }
            else
                return false;
        }
        return true;
    };
    Objects.isObject = function (obj) {
        return "object" != typeof obj || null == obj ? false : true;
    };
    Objects.merge = function (obj1, obj2, combineArrays, cbh) {
        if (combineArrays === void 0) { combineArrays = false; }
        if (cbh === void 0) { cbh = 0; }
        var obj1Copy = cbh > 0 ? obj1 : this.copy(obj1);
        var obj2Copy = cbh > 0 ? obj2 : this.copy(obj2);
        if (!this.isObject(obj1Copy) || !this.isObject(obj2Copy) || cbh > CALLBACK_HELL_LIMIT)
            return obj2Copy;
        if (Array.isArray(obj2Copy)) {
            if (combineArrays && Array.isArray(obj1Copy)) {
                return obj1Copy.concat(obj2Copy);
            }
            return obj2Copy;
        }
        for (var key in obj2Copy) {
            obj1Copy[key] = this.merge(obj1Copy[key], obj2Copy[key], combineArrays, cbh + 1);
        }
        return obj1Copy;
    };
    Objects.trim = function (obj, cbh) {
        if (cbh === void 0) { cbh = 0; }
        if (!this.isObject(obj) || cbh > CALLBACK_HELL_LIMIT)
            return obj;
        var returnObj;
        if (Array.isArray(obj)) {
            returnObj = [];
            for (var i in obj) {
                if ("" !== obj[i])
                    returnObj.push(Objects.trim(obj[i], cbh + 1));
            }
        }
        else {
            returnObj = {};
            for (var i in obj) {
                if ("" !== obj[i])
                    returnObj[i] = Objects.trim(obj[i], cbh + 1);
            }
        }
        return returnObj;
    };
    Objects.compare = function (obj1, obj2, cbh) {
        if (cbh === void 0) { cbh = 0; }
        if (cbh > CALLBACK_HELL_LIMIT)
            return {};
        if (Objects.isObject(obj1)) {
            if (Objects.isObject(obj2)) {
                var changes = {};
                var obj1Keys = Object.keys(obj1);
                var obj2Keys = Object.keys(obj2);
                var commonKeys = [];
                for (var _i = 0, obj1Keys_1 = obj1Keys; _i < obj1Keys_1.length; _i++) {
                    var key = obj1Keys_1[_i];
                    if (obj2Keys.includes(key)) {
                        commonKeys.push(key);
                    }
                    else {
                        changes.deletions = changes.deletions || {};
                        changes.deletions[key] = true;
                    }
                }
                for (var _a = 0, obj2Keys_1 = obj2Keys; _a < obj2Keys_1.length; _a++) {
                    var key = obj2Keys_1[_a];
                    if (!commonKeys.includes(key)) {
                        changes.additions = changes.additions || {};
                        changes.additions[key] = obj2[key];
                    }
                }
                for (var _b = 0, commonKeys_1 = commonKeys; _b < commonKeys_1.length; _b++) {
                    var key = commonKeys_1[_b];
                    var tempChanges = Objects.compare(obj1[key], obj2[key], cbh + 1);
                    if (tempChanges.additions) {
                        changes.additions = changes.additions || {};
                        changes.additions[key] = tempChanges.additions;
                    }
                    if (tempChanges.deletions) {
                        changes.deletions = changes.deletions || {};
                        changes.deletions[key] = tempChanges.deletions;
                    }
                    if (tempChanges.updates) {
                        changes.updates = changes.updates || {};
                        changes.updates[key] = tempChanges.updates;
                    }
                }
                return changes;
            }
            else {
                return { "updates": obj2 };
            }
        }
        else {
            if (Objects.isObject(obj2)) {
                return { "updates": obj2 };
            }
            else {
                if (obj1 == obj2)
                    return {};
                if (typeof obj1 != typeof obj2)
                    return { "updates": obj2 };
                return { "updates": obj2 };
            }
        }
    };
    return Objects;
}());
exports.Objects = Objects;
//# sourceMappingURL=Objects.js.map