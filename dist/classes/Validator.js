"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ValidatorTypes_1 = require("./ValidatorTypes");
var Objects_1 = require("./Objects");
var Dates_1 = require("./Dates");
var Validator = (function () {
    function Validator() {
        this._typeValidators = {};
        this._validationErrors = {
            "ValidationStructureException": { status: 500, code: "ValidationStructureException", message: "Validation structure is improperly formatted: ERROR" },
            "ValidationException": { status: 400, code: "ValidationException", message: "OBJ_PATH expected type TYPE" },
            "ValidationLimitException": { status: 400, code: "ValidationException", message: "OBJ_PATH did not meet LIMITATION restriction" }
        };
        this._errors = [];
        this.addTypeValidator("array", ValidatorTypes_1.isArray, ["minLength", "maxLength"]);
        this.addTypeValidator("boolean", ValidatorTypes_1.isBoolean);
        this.addTypeValidator("email", ValidatorTypes_1.isEmail);
        this.addTypeValidator("token", ValidatorTypes_1.isJWTToken);
        this.addTypeValidator("null", ValidatorTypes_1.isNull);
        this.addTypeValidator("number", ValidatorTypes_1.isNumber, ["min", "max"]);
        this.addTypeValidator("phone", ValidatorTypes_1.isPhoneNumber);
        this.addTypeValidator("phonenumber", ValidatorTypes_1.isPhoneNumber);
        this.addTypeValidator("phone_number", ValidatorTypes_1.isPhoneNumber);
        this.addTypeValidator("object", ValidatorTypes_1.isObject, ["minLength", "maxLength"]);
        this.addTypeValidator("string", ValidatorTypes_1.isString, ["minLength", "maxLength"]);
        this.addTypeValidator("undefined", ValidatorTypes_1.isUndefined);
        this.addTypeValidator("isodate", ValidatorTypes_1.isISODate);
        this.addTypeValidator("iso_date", ValidatorTypes_1.isISODate);
    }
    Validator.prototype.addTypeValidator = function (name, validator, limits) {
        if (limits === void 0) { limits = []; }
        this._typeValidators[name.toLowerCase()] = { validator: validator, limits: limits };
    };
    Validator.prototype.validate = function (input, structure) {
        var _this = this;
        return new Promise(function (resolve, reject) {
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
        for (var key in limit) {
            if (0 > typeLimitation.limits.indexOf(key))
                continue;
            switch (key.toLowerCase()) {
                case "min":
                    if (input < limit.min) {
                        this._logError(this._validationErrors["ValidationLimitException"], {
                            "OBJ_PATH": path.join("."),
                            "LIMITATION": key
                        });
                        isValid = false;
                    }
                    break;
                case "max":
                    if (input > limit.max) {
                        this._logError(this._validationErrors["ValidationLimitException"], {
                            "OBJ_PATH": path.join("."),
                            "LIMITATION": key
                        });
                        isValid = false;
                    }
                    break;
                case "minlength":
                    if (Object.keys(input).length < limit.minLength) {
                        this._logError(this._validationErrors["ValidationLimitException"], {
                            "OBJ_PATH": path.join("."),
                            "LIMITATION": key
                        });
                        isValid = false;
                    }
                    break;
                case "maxlength":
                    if (Object.keys(input).length > limit.maxLength) {
                        this._logError(this._validationErrors["ValidationLimitException"], {
                            "OBJ_PATH": path.join("."),
                            "LIMITATION": key
                        });
                        isValid = false;
                    }
                    break;
                case "prefix":
                    if (!input.startsWith(limit.prefix)) {
                        this._logError(this._validationErrors["ValidationLimitException"], {
                            "OBJ_PATH": path.join("."),
                            "LIMITATION": key
                        });
                        isValid = false;
                    }
                    break;
                default:
                    break;
            }
        }
        return isValid ? true : false;
    };
    Validator.prototype._logError = function (error, replacementValues) {
        var newError = Objects_1.Objects.copy(error);
        newError.dateCreated = Dates_1.Dates.toISO(Date.now());
        for (var key in replacementValues) {
            newError.message = newError.message.replace(key.toUpperCase(), replacementValues[key]);
        }
        this._errors.push(newError);
    };
    return Validator;
}());
exports.Validator = Validator;
//# sourceMappingURL=Validator.js.map