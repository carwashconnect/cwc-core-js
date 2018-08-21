import { ValidationStructure } from "../interfaces/ValidationStructure";
import { ValidationLimits } from "../interfaces/ValidationLimits";
import { ValidationType } from "../interfaces/ValidationType";
export declare class Validator {
    private _typeValidators;
    private _validationErrors;
    private _errors;
    constructor();
    addTypeValidator(name: string, validator: ValidationType, limits?: string[]): void;
    validate(input: any, structure: ValidationLimits | ValidationLimits[] | ValidationStructure): Promise<any>;
    private _validate;
    private _validateProperty;
    private _logError;
}
