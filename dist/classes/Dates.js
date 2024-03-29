"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dates = void 0;
var Dates = (function () {
    function Dates() {
    }
    Dates.toCountdown = function (date) {
        var time = (new Date(date)).getTime();
        var days = Math.floor(time / 86400000);
        time = time - days * 86400000;
        var hours = Math.floor(time / 3600000);
        time = time - hours * 3600000;
        var minutes = Math.floor(time / 60000);
        time = time - minutes * 60000;
        var seconds = minutes || hours || days ? Math.floor(time / 1000) : Math.round(time / 1000);
        return "".concat(days ? "".concat(days, "d ") : "").concat(hours || days ? "".concat(hours, "h ") : "").concat(minutes || hours || days ? "".concat(minutes, "m ") : "").concat(seconds, "s");
    };
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