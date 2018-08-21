"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Dates_1 = require("./Dates");
var Errors = (function () {
    function Errors() {
    }
    Errors.awsErrorToIError = function (awsError) {
        return {
            message: awsError.message,
            code: awsError.code,
            status: awsError.statusCode,
            dateCreated: Dates_1.Dates.toISO(Date.now())
        };
    };
    return Errors;
}());
exports.Errors = Errors;
//# sourceMappingURL=Errors.js.map