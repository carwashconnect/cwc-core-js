"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.limitMaxLength = exports.limitMinLength = exports.limitMax = exports.limitMin = void 0;
exports.limitMin = function (input, comparison) {
    return input >= comparison ? true : false;
};
exports.limitMax = function (input, comparison) {
    return input <= comparison ? true : false;
};
exports.limitMinLength = function (input, comparison) {
    return Object.keys(input).length >= comparison ? true : false;
};
exports.limitMaxLength = function (input, comparison) {
    return Object.keys(input).length <= comparison ? true : false;
};
//# sourceMappingURL=ValidatorLimits.js.map