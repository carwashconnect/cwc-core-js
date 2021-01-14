"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Objects = void 0;
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
        if (!this.isObject(obj))
            return false;
        var currentLevel = obj;
        for (var _a = 0, keys_1 = keys; _a < keys_1.length; _a++) {
            var key = keys_1[_a];
            if ((Objects.isObject(currentLevel) || Array.isArray(currentLevel)) && key in currentLevel) {
                if ("undefined" == typeof currentLevel[key])
                    return false;
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
                        changes.deletions = "undefined" != typeof changes.deletions ? changes.deletions : {};
                        changes.deletions[key] = true;
                    }
                }
                for (var _a = 0, obj2Keys_1 = obj2Keys; _a < obj2Keys_1.length; _a++) {
                    var key = obj2Keys_1[_a];
                    if (!commonKeys.includes(key)) {
                        changes.additions = "undefined" != typeof changes.additions ? changes.additions : {};
                        changes.additions[key] = obj2[key];
                    }
                }
                for (var _b = 0, commonKeys_1 = commonKeys; _b < commonKeys_1.length; _b++) {
                    var key = commonKeys_1[_b];
                    var tempChanges = Objects.compare(obj1[key], obj2[key], cbh + 1);
                    if ("undefined" != typeof tempChanges.additions) {
                        changes.additions = "undefined" != typeof changes.additions ? changes.additions : {};
                        changes.additions[key] = tempChanges.additions;
                    }
                    if ("undefined" != typeof tempChanges.deletions) {
                        changes.deletions = "undefined" != typeof changes.deletions ? changes.deletions : {};
                        changes.deletions[key] = tempChanges.deletions;
                    }
                    if ("undefined" != typeof tempChanges.updates) {
                        changes.updates = "undefined" != typeof changes.updates ? changes.updates : {};
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
                if (typeof obj1 != typeof obj2)
                    return { "updates": obj2 };
                if (obj1 == obj2)
                    return {};
                return { "updates": obj2 };
            }
        }
    };
    Objects.intersect = function (obj1, obj2, options) {
        if (options === void 0) { options = { cbh: 0, onlyMatchingFields: true }; }
        options.cbh = options.cbh || 0;
        options.onlyMatchingFields = "undefined" != typeof options.onlyMatchingFields ? options.onlyMatchingFields : true;
        if (CALLBACK_HELL_LIMIT < options.cbh || 0)
            return undefined;
        if (!Objects.isObject(obj1) || !Objects.isObject(obj2))
            return undefined;
        var obj1Copy = 0 == options.cbh ? Objects.copy(obj1) : obj1;
        var obj2Copy = 0 == options.cbh ? Objects.copy(obj2) : obj2;
        var intersectedObject = {};
        for (var key in obj1Copy) {
            if ("undefined" == typeof obj2Copy[key])
                continue;
            if (Objects.isObject(obj1Copy[key]) && Objects.isObject(obj2Copy[key])) {
                var optionCopy = Objects.copy(options);
                optionCopy.cbh = (optionCopy.cbh || 0) + 1;
                intersectedObject[key] = Objects.intersect(obj1Copy[key], obj2Copy[key], optionCopy);
            }
            else {
                if (options.onlyMatchingFields) {
                    if (obj1Copy[key] === obj2Copy[key])
                        intersectedObject[key] = obj1Copy[key];
                }
                else {
                    intersectedObject[key] = obj1Copy[key];
                }
            }
        }
        return intersectedObject;
    };
    Objects.subtract = function (obj1, obj2, options) {
        if (options === void 0) { options = { cbh: 0 }; }
        options.cbh = options.cbh || 0;
        if (CALLBACK_HELL_LIMIT < options.cbh || 0)
            return {};
        if (!Objects.isObject(obj1) || !Objects.isObject(obj2))
            return {};
        var obj1Copy = 0 == options.cbh ? Objects.copy(obj1) : obj1;
        var obj2Copy = 0 == options.cbh ? Objects.copy(obj2) : obj2;
        for (var key in obj2Copy) {
            if ("undefined" == typeof obj1Copy[key])
                continue;
            if (Objects.isObject(obj1Copy[key]) && Objects.isObject(obj2Copy[key])) {
                var optionCopy = Objects.copy(options);
                optionCopy.cbh = (optionCopy.cbh || 0) + 1;
                obj1Copy[key] = Objects.subtract(obj1Copy[key], obj2Copy[key], optionCopy);
            }
            else {
                delete obj1Copy[key];
            }
        }
        if (Array.isArray(obj1Copy)) {
            var deletedKeys = Object.keys(obj2Copy).sort();
            var offset = 0;
            for (var _i = 0, deletedKeys_1 = deletedKeys; _i < deletedKeys_1.length; _i++) {
                var key = deletedKeys_1[_i];
                if (isNaN(Number(key)))
                    continue;
                var index = Number(key) - offset;
                if (Objects.isObject(obj1Copy[index]) && Objects.isObject(obj2Copy[key]))
                    continue;
                obj1Copy.splice(index, 1);
                offset++;
            }
        }
        return obj1Copy;
    };
    Objects.createPath = function (obj) {
        var keys = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            keys[_i - 1] = arguments[_i];
        }
        if (!this.isObject(obj) || Array.isArray(obj))
            return obj;
        var currentLevel = obj;
        for (var _a = 0, keys_2 = keys; _a < keys_2.length; _a++) {
            var key = keys_2[_a];
            currentLevel[key] = currentLevel[key] || {};
            currentLevel = currentLevel[key];
        }
        return obj;
    };
    return Objects;
}());
exports.Objects = Objects;
//# sourceMappingURL=Objects.js.map