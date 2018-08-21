"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Dates = (function () {
    function Dates() {
    }
    Dates.toISO = function (timeStamp) {
        return (new Date(timeStamp)).toISOString();
    };
    Dates.toTimeStamp = function (date) {
        return (new Date(date)).getTime();
    };
    return Dates;
}());
exports.Dates = Dates;
//# sourceMappingURL=Dates.js.map