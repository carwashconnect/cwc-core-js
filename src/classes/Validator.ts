import { ValidationStructure } from "../interfaces/ValidationStructure"
import { ValidationLimits } from "../interfaces/ValidationLimits";
import { ValidationType } from "../interfaces/ValidationType";
import { IError } from "../interfaces/IError"
import { isArray, isBoolean, isEmail, isJWTToken, isNumber, isPhoneNumber, isString, isUndefined, isISODate, isObject, isNull } from "./ValidatorTypes";
import { Objects } from "./Objects";
import { Dates } from "./Dates";


export class Validator {

    private _typeValidators: {
        [key: string]: {
            validator: ValidationType,
            limits: string[]
        }
    } = {};
    private _validationErrors: { [key: string]: IError } = {
        "ValidationStructureException": { status: 500, code: "ValidationStructureException", message: "Validation structure is improperly formatted: ERROR" },
        "ValidationException": { status: 400, code: "ValidationException", message: "OBJ_PATH expected type TYPE" },
        "ValidationLimitException": { status: 400, code: "ValidationException", message: "OBJ_PATH did not meet LIMITATION restriction" }
    }

    private _errors: IError[] = [];

    constructor() {
        //Add the default validators
        this.addTypeValidator("array", isArray, ["minLength", "maxLength"]);
        this.addTypeValidator("boolean", isBoolean);
        this.addTypeValidator("email", isEmail);
        this.addTypeValidator("token", isJWTToken);
        this.addTypeValidator("null", isNull);
        this.addTypeValidator("number", isNumber, ["min", "max"]);
        this.addTypeValidator("phone", isPhoneNumber);
        this.addTypeValidator("phonenumber", isPhoneNumber);
        this.addTypeValidator("phone_number", isPhoneNumber);
        this.addTypeValidator("object", isObject, ["minLength", "maxLength"]);
        this.addTypeValidator("string", isString, ["minLength", "maxLength"]);
        this.addTypeValidator("undefined", isUndefined);
        this.addTypeValidator("isodate", isISODate);
        this.addTypeValidator("iso_date", isISODate);
    }

    public addTypeValidator(name: string, validator: ValidationType, limits: string[] = []): void {
        this._typeValidators[name.toLowerCase()] = { validator: validator, limits: limits };
    }

    public validate(input: any, structure: ValidationLimits | ValidationLimits[] | ValidationStructure): Promise<any> {
        //So we can return errors
        return new Promise((resolve, reject) => {

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

    private _validate(input: any, structure: ValidationLimits | ValidationLimits[] | ValidationStructure, path: string[] = []): any {

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
            structure = <ValidationStructure>structure;

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
        let typeLimitation: { validator: ValidationType, limits: string[] } = { validator: () => { return false }, limits: [] };

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


        //Loop through the limits (We don't know what limits are there)
        for (let key in limit) {

            //Skip if the limit isn't applicable or is addressed else where
            if (0 > typeLimitation.limits.indexOf(key)) continue

            //Check the limit
            switch (key.toLowerCase()) {
                case "min":

                    //Check if its less than the min value
                    if (input < (<number>limit.min)) {

                        //Log the error
                        this._logError(this._validationErrors["ValidationLimitException"], {
                            "OBJ_PATH": path.join("."),
                            "LIMITATION": key
                        })

                        //Set to invalid
                        isValid = false;

                    }

                    break;
                case "max":

                    //Check if its greater than the max value
                    if (input > (<number>limit.max)) {

                        //Log the error
                        this._logError(this._validationErrors["ValidationLimitException"], {
                            "OBJ_PATH": path.join("."),
                            "LIMITATION": key
                        })

                        //Set to invalid
                        isValid = false;

                    }

                    break;
                case "minlength":

                    //Check if its less than the min length
                    if (Object.keys(input).length < (<number>limit.minLength)) {

                        //Log the error
                        this._logError(this._validationErrors["ValidationLimitException"], {
                            "OBJ_PATH": path.join("."),
                            "LIMITATION": key
                        })

                        //Set to invalid
                        isValid = false;

                    }

                    break;
                case "maxlength":

                    //Check if its greater than the max length
                    if (Object.keys(input).length > (<number>limit.maxLength)) {

                        //Log the error
                        this._logError(this._validationErrors["ValidationLimitException"], {
                            "OBJ_PATH": path.join("."),
                            "LIMITATION": key
                        })

                        //Set to invalid
                        isValid = false;

                    }

                    break;

                case "prefix":

                    //Check if it starts with the prefix
                    if (!(<string>input).startsWith(<string>limit.prefix)) {

                        //Log the error
                        this._logError(this._validationErrors["ValidationLimitException"], {
                            "OBJ_PATH": path.join("."),
                            "LIMITATION": key
                        })

                        //Set to invalid
                        isValid = false;

                    }

                    break;
                default:
                    break;
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
