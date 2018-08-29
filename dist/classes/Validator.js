"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ValidatorTypes_1 = require("./ValidatorTypes");
var ValidatorLimits_1 = require("./ValidatorLimits");
var Objects_1 = require("./Objects");
var Errors_1 = require("./Errors");
var Validator = (function () {
    function Validator() {
        this._typeValidators = {};
        this._limits = {};
        this._validationErrors = {
            "ValidationStructureException": { status: 500, code: "ValidationStructureException", message: "Validation structure is improperly formatted: ERROR" },
            "ValidationLimitRequestException": { status: 500, code: "ValidationLimitRequestException", message: "Limit 'LIMITATION' cannot be identified" },
            "ValidationLimitEvaluationException": { status: 500, code: "ValidationLimitEvaluationException", message: "Provided limit 'LIMITATION' cannot limit provided value type 'TYPE'" },
            "ValidationException": { status: 400, code: "ValidationException", message: "OBJ_PATH expected type 'TYPE'" },
            "ValidationLimitException": { status: 400, code: "ValidationLimitException", message: "OBJ_PATH did not meet 'LIMITATION' restriction" }
        };
        this._errors = [];
        this.addTypeValidator("array", ValidatorTypes_1.isArray);
        this.addTypeValidator("boolean", ValidatorTypes_1.isBoolean);
        this.addTypeValidator("email", ValidatorTypes_1.isEmail);
        this.addTypeValidator("token", ValidatorTypes_1.isJWTToken);
        this.addTypeValidator("null", ValidatorTypes_1.isNull);
        this.addTypeValidator("number", ValidatorTypes_1.isNumber);
        this.addTypeValidator("phone", ValidatorTypes_1.isPhoneNumber);
        this.addTypeValidator("phonenumber", ValidatorTypes_1.isPhoneNumber);
        this.addTypeValidator("phone_number", ValidatorTypes_1.isPhoneNumber);
        this.addTypeValidator("object", ValidatorTypes_1.isObject);
        this.addTypeValidator("string", ValidatorTypes_1.isString);
        this.addTypeValidator("undefined", ValidatorTypes_1.isUndefined);
        this.addTypeValidator("isodate", ValidatorTypes_1.isISODate);
        this.addTypeValidator("iso_date", ValidatorTypes_1.isISODate);
        this.addLimit("minLength", ValidatorLimits_1.limitMinLength, ["array", "object", "string"]);
        this.addLimit("maxLength", ValidatorLimits_1.limitMaxLength, ["array", "object", "string"]);
        this.addLimit("min", ValidatorLimits_1.limitMin, ["number"]);
        this.addLimit("max", ValidatorLimits_1.limitMax, ["number"]);
    }
    Validator.prototype.addTypeValidator = function (name, validator) {
        this._typeValidators[name.toLowerCase()] = { validator: validator, limits: [] };
    };
    Validator.prototype.addLimit = function (name, limitFunction, types) {
        var limitName = name.toLowerCase();
        var typeList = [];
        for (var i in types) {
            var typeName = types[i].toLowerCase();
            if ("*" == typeName) {
                typeList = ["*"];
                break;
            }
            else {
                typeList.push(typeName);
            }
        }
        this._limits[limitName] = { limiter: limitFunction, limitName: name, types: typeList };
    };
    Validator.prototype._resetLimits = function () {
        for (var i in this._typeValidators) {
            this._typeValidators[i].limits = [];
        }
    };
    Validator.prototype._mapLimits = function () {
        this._resetLimits();
        for (var i in this._limits) {
            var limit = this._limits[i];
            for (var _i = 0, _a = limit.types; _i < _a.length; _i++) {
                var type = _a[_i];
                if ("*" == type) {
                    for (var j in this._typeValidators)
                        this._typeValidators[j].limits.push(i);
                }
                else {
                    this._typeValidators[type].limits.push(i);
                }
            }
        }
    };
    Validator.prototype.validate = function (input, structure) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._mapLimits();
            _this._errors = [];
            var output = _this._validate(input, structure);
            if (_this._errors.length)
                return reject(_this._errors);
            return resolve(output);
        });
    };
    Validator.prototype._validate = function (input, structure, path) {
        if (path === void 0) { path = []; }
        var output;
        if (Array.isArray(structure)) {
            structure = structure;
            if (0 >= structure.length) {
                this._logError(this._validationErrors["ValidationStructureException"], {
                    "ERROR": "Array for unknown object traversal must have contents"
                });
                return;
            }
            if (!Objects_1.Objects.isObject(input)) {
                this._logError(this._validationErrors["ValidationException"], {
                    "OBJ_PATH": path.join("."),
                    "TYPE": "array or object"
                });
                return;
            }
            output = Array.isArray(input) ? [] : {};
            for (var i in input) {
                var validatedData = this._validate(input[i], structure[0], [].concat(path, [i]));
                if ("undefined" !== typeof validatedData) {
                    if (Array.isArray(output))
                        output.push(validatedData);
                    else
                        output[i] = validatedData;
                }
            }
        }
        else if (Array.isArray(structure.validationType)) {
            var limits = structure;
            if (this._validateProperty(input, limits, path))
                output = input;
        }
        else {
            structure = structure;
            if (!Objects_1.Objects.isObject(input)) {
                this._logError(this._validationErrors["ValidationException"], {
                    "OBJ_PATH": path.join("."),
                    "TYPE": "object"
                });
                return;
            }
            output = {};
            for (var i in structure) {
                var validatedData = this._validate(input[i], structure[i], [].concat(path, [i]));
                if ("undefined" !== typeof validatedData)
                    output[i] = validatedData;
            }
        }
        return output;
    };
    Validator.prototype._validateProperty = function (input, limit, path) {
        var isValid = false;
        var typeLimitation = { validator: function () { return false; }, limits: [] };
        for (var i in limit.validationType) {
            typeLimitation = this._typeValidators[limit.validationType[i].toLowerCase()];
            if (!typeLimitation)
                continue;
            isValid = typeLimitation.validator(input);
            if (isValid)
                break;
        }
        if (!isValid) {
            if (limit.required) {
                this._logError(this._validationErrors["ValidationException"], {
                    "OBJ_PATH": path.join("."),
                    "TYPE": limit.validationType.join(" or ")
                });
            }
            return false;
        }
        for (var _i = 0, _a = typeLimitation.limits; _i < _a.length; _i++) {
            var limitName = _a[_i];
            var limitData = this._limits[limitName];
            if (!limit) {
                this._logError(this._validationErrors["ValidationLimitRequestException"], {
                    "OBJ_PATH": path.join("."),
                    "LIMITATION": limitName
                });
                isValid = false;
                continue;
            }
            ;
            var limitFunction = limitData.limiter;
            if (!limitFunction) {
                continue;
            }
            ;
            var limitValue = limit[limitData.limitName];
            if ("undefined" == typeof limitValue) {
                continue;
            }
            ;
            var meetsLimitation = false;
            try {
                meetsLimitation = limitFunction(input, limitValue);
            }
            catch (e) {
                this._logError(this._validationErrors["ValidationLimitApplicationException"], {
                    "OBJ_PATH": path.join(".") || "value",
                    "LIMITATION": limitName,
                    "TYPE": typeof input
                });
                isValid = false;
            }
            if (!meetsLimitation) {
                this._logError(this._validationErrors["ValidationLimitException"], {
                    "OBJ_PATH": path.join(".") || "value",
                    "LIMITATION": limitName
                });
                isValid = false;
            }
        }
        return isValid ? true : false;
    };
    Validator.prototype._logError = function (error, replacementValues) {
        var newError = Errors_1.Errors.stamp(error);
        for (var key in replacementValues) {
            newError.message = newError.message.replace(key.toUpperCase(), replacementValues[key]);
        }
        this._errors.push(newError);
    };
    return Validator;
}());
exports.Validator = Validator;
//# sourceMappingURL=Validator.js.map