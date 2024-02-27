"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.limitMaxLength = exports.limitMinLength = exports.limitMax = exports.limitMin = void 0;
var limitMin = function (input, comparison) {
    return input >= comparison ? true : false;
};
exports.limitMin = limitMin;
var limitMax = function (input, comparison) {
    return input <= comparison ? true : false;
};
exports.limitMax = limitMax;
var limitMinLength = function (input, comparison) {
    return Object.keys(input).length >= comparison ? true : false;
};
exports.limitMinLength = limitMinLength;
var limitMaxLength = function (input, comparison) {
    return Object.keys(input).length <= comparison ? true : false;
};
exports.limitMaxLength = limitMaxLength;
//# sourceMappingURL=ValidatorLimits.js.map