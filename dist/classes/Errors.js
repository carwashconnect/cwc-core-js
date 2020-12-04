"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Errors = void 0;
var Dates_1 = require("./Dates");
var Objects_1 = require("./Objects");
var Errors = (function () {
    function Errors() {
    }
    Errors.awsErrorToIError = function (awsError) {
        return {
            message: awsError.message,
            code: awsError.code,
            status: awsError.statusCode || 500,
            timeStamp: Dates_1.Dates.toISO(Date.now())
        };
    };
    Errors.stamp = function (error) {
        var err = Objects_1.Objects.copy(error);
        err.timeStamp = Dates_1.Dates.toISO(Date.now());
        return err;
    };
    return Errors;
}());
exports.Errors = Errors;
//# sourceMappingURL=Errors.js.map