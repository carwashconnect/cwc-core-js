import { ValidationStructure, ValidationLimitObject } from "../interfaces/ValidationStructure"
import { ValidationLimits } from "../interfaces/ValidationLimits";
import { ValidationFunction } from "../interfaces/ValidationFunction";
import { IError } from "../interfaces/IError"
import { isArray, isBoolean, isEmail, isJWTToken, isNumber, isPhoneNumber, isString, isUndefined, isISODate, isObject, isNull } from "./ValidatorTypes";
import { limitMax, limitMaxLength, limitMin, limitMinLength } from "./ValidatorLimits"

import { Objects } from "./Objects";
import { Dates } from "./Dates";


export class Validator {

    private _typeValidators: {
        [key: string]: {
            validator: ValidationFunction,
            limits: string[]
        }
    } = {};

    private _limits: {
        [key: string]: {
            limiter: ValidationFunction,
            limitName: string,
            types: string[]
        }
    } = {};

    private _validationErrors: { [key: string]: IError } = {
        "ValidationStructureException": { status: 500, code: "ValidationStructureException", message: "Validation structure is improperly formatted: ERROR" },
        "ValidationLimitRequestException": { status: 500, code: "ValidationLimitRequestException", message: "Limit 'LIMITATION' cannot be identified" },
        "ValidationLimitEvaluationException": { status: 500, code: "ValidationLimitEvaluationException", message: "Provided limit 'LIMITATION' cannot limit provided value type 'TYPE'" },
        "ValidationException": { status: 400, code: "ValidationException", message: "OBJ_PATH expected type 'TYPE'" },
        "ValidationLimitException": { status: 400, code: "ValidationLimitException", message: "OBJ_PATH did not meet 'LIMITATION' restriction" }
    }

    private _errors: IError[] = [];

    constructor() {
        //Add the default validators
        this.addTypeValidator("array", isArray);
        this.addTypeValidator("boolean", isBoolean);
        this.addTypeValidator("email", isEmail);
        this.addTypeValidator("token", isJWTToken);
        this.addTypeValidator("null", isNull);
        this.addTypeValidator("number", isNumber);
        this.addTypeValidator("phone", isPhoneNumber);
        this.addTypeValidator("phonenumber", isPhoneNumber);
        this.addTypeValidator("phone_number", isPhoneNumber);
        this.addTypeValidator("object", isObject);
        this.addTypeValidator("string", isString);
        this.addTypeValidator("undefined", isUndefined);
        this.addTypeValidator("isodate", isISODate);
        this.addTypeValidator("iso_date", isISODate);

        //Add the default limits
        this.addLimit("minLength", limitMinLength, ["array", "object", "string"])
        this.addLimit("maxLength", limitMaxLength, ["array", "object", "string"])
        this.addLimit("min", limitMin, ["number"])
        this.addLimit("max", limitMax, ["number"])
    }

    public addTypeValidator(name: string, validator: ValidationFunction): void {
        this._typeValidators[name.toLowerCase()] = { validator: validator, limits: [] };
    }

    public addLimit(name: string, limitFunction: ValidationFunction, types: string[]): void {
        let limitName: string = name.toLowerCase();
        let typeList: string[] = [];
        for (let i in types) {

            //Get the type name
            let typeName: string = types[i].toLowerCase();

            //Check if it applies to all types
            if ("*" == typeName) {

                //Erase other types from list and add the universal
                typeList = ["*"]
                break;

            } else {

                //Add the type to the list
                typeList.push(typeName);

            }

        }

        //Create the limiter
        this._limits[limitName] = { limiter: limitFunction, limitName: name, types: typeList };

    }

    //Resets which limits apply to which types
    protected _resetLimits() {
        for (let i in this._typeValidators) {
            this._typeValidators[i].limits = [];
        }
    }

    //Maps the limits to the types
    protected _mapLimits() {
        this._resetLimits()
        for (let i in this._limits) {
            let limit = this._limits[i];
            for (let type of limit.types) {

                //Check if a universal limiter
                if ("*" == type) {

                    //Add to all types
                    for (let j in this._typeValidators)
                        this._typeValidators[j].limits.push(i)

                } else {

                    //Add to the specified type
                    this._typeValidators[type].limits.push(i);

                }
            }

        }
    }

    public validate(input: any, structure: ValidationStructure): Promise<any> {
        //So we can return errors
        return new Promise((resolve, reject) => {

            //Map the limits to the types
            this._mapLimits();

            //Reset the errors
            this._errors = [];

            //Validate the object
            let output = this._validate(input, structure);

            //Check if we have errors
            if (this._errors.length) return reject(this._errors);

            //Return the modified output
            return resolve(output);

        })
    }

    private _validate(input: any, structure: ValidationStructure, path: string[] = []): any {

        let output: any;

        //Identify the limit type
        if (Array.isArray(structure)) {

            //We are validating the contents of an unknown object
            structure = <ValidationLimits[]>structure;

            //Ensure we have enough to validate
            if (0 >= structure.length) {
                this._logError(this._validationErrors["ValidationStructureException"], {
                    "ERROR": "Array for unknown object traversal must have contents"
                })
                return;
            }
            if (!Objects.isObject(input)) {
                this._logError(this._validationErrors["ValidationException"], {
                    "OBJ_PATH": path.join("."),
                    "TYPE": "array or object"
                })
                return;
            }

            //Set the output
            output = Array.isArray(input) ? [] : {};

            //Loop through the unknown object
            for (let i in input) {

                //Check if the object property is valid
                let validatedData = this._validate(input[i], structure[0], (<string[]>[]).concat(path, [i]));
                if ("undefined" !== typeof validatedData) {

                    //Add it to the output object
                    if (Array.isArray(output))
                        output.push(validatedData)
                    else
                        output[i] = validatedData

                }
            }

        } else if (Array.isArray(structure.validationType)) {

            //We are validating a single property
            let limits: ValidationLimits = <ValidationLimits>structure;

            //Add to the output if valid
            if (this._validateProperty(input, limits, path)) output = input;

        } else {

            //We are validating the contents of a known object
            structure = <ValidationLimitObject>structure;

            //Check if the input is not an object
            if (!Objects.isObject(input)) {
                this._logError(this._validationErrors["ValidationException"], {
                    "OBJ_PATH": path.join("."),
                    "TYPE": "object"
                })
                return;
            }

            //Update the output
            output = {};

            //Loop through the validation structure
            for (let i in structure) {

                //Add to the output if valid
                let validatedData = this._validate(input[i], structure[i], (<string[]>[]).concat(path, [i]));
                if ("undefined" !== typeof validatedData) output[i] = validatedData;

            }

        }

        return output;
    }

    private _validateProperty(input: any, limit: ValidationLimits, path: string[]): boolean {
        let isValid: boolean = false;

        //Create the temporary limitationObject so typescript shuts up
        let typeLimitation: { validator: ValidationFunction, limits: string[] } = { validator: () => { return false }, limits: [] };

        //Check all the possible types
        for (let i in limit.validationType) {

            //Copy the type limitations
            typeLimitation = this._typeValidators[limit.validationType[i].toLowerCase()];

            //If the type limiter can't be found skip it
            if (!typeLimitation) continue;

            //Get if the type is valid
            isValid = typeLimitation.validator(input);

            //Stop checking if a type was valid
            if (isValid) break;

        }

        //Check if the property has a valid type before we get to limitations
        if (!isValid) {

            //Check if the property was required
            if (limit.required) {

                //Log the error
                this._logError(this._validationErrors["ValidationException"], {
                    "OBJ_PATH": path.join("."),
                    "TYPE": limit.validationType.join(" or ")
                })

            }

            //Invalid
            return false;

        }


        //Loop through the limits
        for (let limitName of typeLimitation.limits) {

            //Copy the limit
            let limitData = this._limits[limitName];
            if (!limit) {

                //Log the error
                this._logError(this._validationErrors["ValidationLimitRequestException"], {
                    "OBJ_PATH": path.join("."),
                    "LIMITATION": limitName
                })

                //Set to invalid
                isValid = false;
                continue
            };

            //Copy the limit function
            let limitFunction = limitData.limiter;
            if (!limitFunction) { continue };

            //Copy the value
            let limitValue: any = limit[limitData.limitName]
            if ("undefined" == typeof limitValue) { continue };

            //Evaluate the limitation
            let meetsLimitation: boolean = false;
            try {
                meetsLimitation = limitFunction(input, limitValue);
            } catch (e) {

                //Log the error
                this._logError(this._validationErrors["ValidationLimitApplicationException"], {
                    "OBJ_PATH": path.join(".") || "value",
                    "LIMITATION": limitName,
                    "TYPE": typeof input
                })

                //Set to invalid
                isValid = false;
            }

            //Check if it passed the limit
            if (!meetsLimitation) {

                //Log the error
                this._logError(this._validationErrors["ValidationLimitException"], {
                    "OBJ_PATH": path.join(".") || "value",
                    "LIMITATION": limitName
                })

                //Set to invalid
                isValid = false;

            }

        }

        // Return validity state 
        return isValid ? true : false;

    }

    private _logError(error: IError, replacementValues: { [key: string]: any }): void {
        let newError: IError = Objects.copy(error);
        newError.dateCreated = Dates.toISO(Date.now());
        for (let key in replacementValues) {
            newError.message = newError.message.replace(key.toUpperCase(), replacementValues[key])
        }
        this._errors.push(newError);
    }

}
