"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUndefined = exports.isString = exports.isPhoneNumber = exports.isObject = exports.isNumber = exports.isNull = exports.isJWTToken = exports.isISODate = exports.isEmail = exports.isBoolean = exports.isArray = void 0;
var Objects_1 = require("./Objects");
exports.isArray = function (input) {
    return Array.isArray(input) ? true : false;
};
exports.isBoolean = function (input) {
    return true === input || false === input ? true : false;
};
exports.isEmail = function (input) {
    if (!exports.isString(input))
        return false;
    var emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    return 0 == input.replace(emailRegex, "").length ? true : false;
};
exports.isISODate = function (input) {
    if (!exports.isString(input))
        return false;
    var dateRegex = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d(:[0-5]\d(\.\d{0,3})?)?([+-][0-2]\d:[0-5]\d|Z)/;
    return 0 == input.replace(dateRegex, "").length ? true : false;
};
exports.isJWTToken = function (input) {
    if (!exports.isString(input))
        return false;
    var tokenRegex = /[A-Za-z0-9-_=.]+/;
    return 0 == input.replace(tokenRegex, "").length ? true : false;
};
exports.isNull = function (input) {
    return null === input ? true : false;
};
exports.isNumber = function (input) {
    if (exports.isString(input))
        return !isNaN(Number(input)) ? true : false;
    ;
    return "number" === typeof input ? true : false;
};
exports.isObject = function (input) {
    return Objects_1.Objects.isObject(input) ? true : false;
};
exports.isPhoneNumber = function (input) {
    if (!exports.isString(input))
        return false;
    var tokenRegex = /(\+?\d{0,3}[ -.●])?\(?([2-9][0-8][0-9])\)?[ -.●]?([2-9][0-9]{2})[ -.●]?([0-9]{4})/;
    return 0 == input.replace(tokenRegex, "").length ? true : false;
};
exports.isString = function (input) {
    return "string" === typeof input ? true : false;
};
exports.isUndefined = function (input) {
    return "undefined" === typeof input ? true : false;
};
//# sourceMappingURL=ValidatorTypes.js.map