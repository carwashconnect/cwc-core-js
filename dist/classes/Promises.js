"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Promises = void 0;
var Promises = (function () {
    function Promises() {
    }
    Promises.all = function (promises, debug) {
        if (debug === void 0) { debug = true; }
        return Promise.all(promises.map(function (p) { return p.catch(function (error) {
            if (debug)
                console.error("Promises.all() exception:", error);
            return null;
        }); }));
    };
    Promises.sequence = function (promises, ignoreErrors) {
        if (ignoreErrors === void 0) { ignoreErrors = false; }
        return new Promise(function (resolve, reject) {
            var i = 0;
            var promiseResults = [];
            var executePromise = function () {
                if (promises[i]) {
                    promises[i].then(function (data) {
                        promiseResults.push(data);
                        i++;
                        executePromise();
                    }).catch(function (error) {
                        if (!ignoreErrors)
                            reject(error);
                        else {
                            promiseResults.push(null);
                            i++;
                            executePromise();
                        }
                        ;
                    });
                }
                else
                    resolve(promiseResults);
            };
            executePromise();
        });
    };
    return Promises;
}());
exports.Promises = Promises;
//# sourceMappingURL=Promises.js.map