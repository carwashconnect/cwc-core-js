"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Promises = void 0;
var Objects_1 = require("./Objects");
var Dates_1 = require("./Dates");
var MAX_SET_SIZE = 8192;
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
    Promises.loadBalancer = function (promiseList, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var promiseListCopy, i, promiseResponses, promiseSets, setSize, maxSetTimes, sum, totalExecutionTime, averageExecutionTime, isTimedOut, _loop_1, _a, _b, _i, i;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if ("undefined" == typeof options.autoBalance)
                            options.autoBalance = true;
                        if ("undefined" == typeof options.shuffle)
                            options.shuffle = false;
                        if ("undefined" == typeof options.verbose)
                            options.verbose = true;
                        if ("undefined" == typeof options.offset)
                            options.offset = 2;
                        else
                            options.offset = Math.abs(options.offset);
                        if ("undefined" != typeof options.setSize)
                            options.setSize = Math.abs(options.setSize);
                        if ("undefined" != typeof options.timeout)
                            options.timeout = Math.abs(options.timeout);
                        promiseListCopy = Objects_1.Objects.copy(promiseList);
                        if (options.shuffle) {
                            for (i in promiseListCopy) {
                                promiseListCopy[i].index = i;
                            }
                            Objects_1.Objects.shuffle(promiseListCopy, false);
                        }
                        promiseResponses = [];
                        promiseSets = [];
                        setSize = 1;
                        if (options.setSize) {
                            setSize = options.setSize;
                            while (promiseListCopy.length) {
                                promiseSets.push(promiseListCopy.splice(0, setSize));
                            }
                        }
                        else {
                            if (options.autoBalance) {
                                setSize = 1;
                                while (setSize * setSize < promiseListCopy.length || MAX_SET_SIZE <= setSize) {
                                    setSize++;
                                }
                                while (promiseListCopy.length) {
                                    promiseSets.push(promiseListCopy.splice(0, setSize));
                                }
                            }
                            else {
                                return [2, Promise.reject(Error("Load balancer requires either 'autoBalance' enabled or a positive integer 'setSize' to function."))];
                            }
                        }
                        if (options.verbose)
                            console.log("Starting load balancing - set size: " + setSize + ", iterations: " + promiseSets.length + ("undefined" != typeof options.timeout ? ", timeout: " + Dates_1.Dates.toCountdown(options.timeout) : ""));
                        maxSetTimes = [];
                        sum = function (accumulator, currentValue) { return accumulator + currentValue; };
                        totalExecutionTime = 0;
                        averageExecutionTime = 0;
                        isTimedOut = false;
                        _loop_1 = function (i) {
                            var iIndex, set, setPromises, _loop_2, j, setResponses, maxSetTime, _i, setResponses_1, response, remainingSets, expectedDuration, e_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        iIndex = Number(i) || 0;
                                        set = promiseSets[i];
                                        setPromises = [];
                                        _loop_2 = function (j) {
                                            if (!isTimedOut && options.timeout)
                                                isTimedOut = options.timeout <= totalExecutionTime + averageExecutionTime ? true : false;
                                            if (isTimedOut) {
                                                setPromises.push(Promise.resolve({
                                                    error: Error("Load balancer timeout exceeded."),
                                                    executionTime: 0,
                                                    index: set[j].index
                                                }));
                                                return "continue";
                                            }
                                            setPromises.push(new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                                                var start, jIndex, e_2, result, end, e_3, end;
                                                var _a;
                                                return __generator(this, function (_b) {
                                                    switch (_b.label) {
                                                        case 0:
                                                            start = Date.now();
                                                            _b.label = 1;
                                                        case 1:
                                                            _b.trys.push([1, 4, , 5]);
                                                            jIndex = Number(j) || 0;
                                                            if (!options.offset) return [3, 3];
                                                            return [4, Promises.wait(options.offset * jIndex)];
                                                        case 2:
                                                            _b.sent();
                                                            _b.label = 3;
                                                        case 3: return [3, 5];
                                                        case 4:
                                                            e_2 = _b.sent();
                                                            return [3, 5];
                                                        case 5:
                                                            _b.trys.push([5, 7, , 8]);
                                                            return [4, (_a = set[j]).func.apply(_a, (set[j].args || []))];
                                                        case 6:
                                                            result = _b.sent();
                                                            end = Date.now();
                                                            return [2, resolve({
                                                                    result: result,
                                                                    executionTime: end - start,
                                                                    index: set[j].index
                                                                })];
                                                        case 7:
                                                            e_3 = _b.sent();
                                                            end = Date.now();
                                                            return [2, resolve({
                                                                    error: e_3,
                                                                    executionTime: end - start,
                                                                    index: set[j].index
                                                                })];
                                                        case 8: return [2];
                                                    }
                                                });
                                            }); }));
                                        };
                                        for (j in set) {
                                            _loop_2(j);
                                        }
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 3, , 4]);
                                        return [4, Promise.all(setPromises)];
                                    case 2:
                                        setResponses = _a.sent();
                                        promiseResponses.push.apply(promiseResponses, setResponses);
                                        maxSetTime = 0;
                                        if (!isTimedOut) {
                                            for (_i = 0, setResponses_1 = setResponses; _i < setResponses_1.length; _i++) {
                                                response = setResponses_1[_i];
                                                maxSetTime = Math.max(maxSetTime, response.executionTime);
                                            }
                                            maxSetTimes.push(maxSetTime);
                                            totalExecutionTime = maxSetTimes.reduce(sum);
                                            averageExecutionTime = Math.ceil(totalExecutionTime / (maxSetTimes.length || 1));
                                        }
                                        if (options.verbose) {
                                            remainingSets = promiseSets.length - iIndex;
                                            expectedDuration = averageExecutionTime * remainingSets;
                                            if (!isTimedOut) {
                                                if (remainingSets) {
                                                    console.log("Set " + (iIndex + 1) + " (" + set.length + " item" + (1 < set.length ? "s" : "") + ") completed in " + Dates_1.Dates.toCountdown(maxSetTime) + ". Estimated completion time for remaining " + remainingSets + " set" + (1 < remainingSets ? "s" : "") + ": " + Dates_1.Dates.toCountdown(expectedDuration) + ".");
                                                }
                                                else {
                                                    console.log("Set " + (iIndex + 1) + " (" + set.length + " item" + (1 < set.length ? "s" : "") + ") completed in " + Dates_1.Dates.toCountdown(maxSetTime) + ".");
                                                }
                                            }
                                            else {
                                                console.log("Set " + (iIndex + 1) + " (" + set.length + " item" + (1 < set.length ? "s" : "") + ") timed out.");
                                            }
                                        }
                                        return [3, 4];
                                    case 3:
                                        e_1 = _a.sent();
                                        throw e_1;
                                    case 4: return [2];
                                }
                            });
                        };
                        _a = [];
                        for (_b in promiseSets)
                            _a.push(_b);
                        _i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3, 4];
                        i = _a[_i];
                        return [5, _loop_1(i)];
                    case 2:
                        _c.sent();
                        _c.label = 3;
                    case 3:
                        _i++;
                        return [3, 1];
                    case 4:
                        if (options.shuffle) {
                            promiseResponses.sort(function (a, b) {
                                if (!a.index || !b.index)
                                    return 0;
                                if (a.index > b.index)
                                    return 1;
                                if (a.index < b.index)
                                    return -1;
                                return 0;
                            });
                        }
                        return [2, Promise.resolve(promiseResponses)];
                }
            });
        });
    };
    Promises.wait = function (ms) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                return resolve();
            }, ms);
        });
    };
    return Promises;
}());
exports.Promises = Promises;
//# sourceMappingURL=Promises.js.map