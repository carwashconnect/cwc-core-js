import { ValidationStructure } from "../interfaces/ValidationStructure";
import { ValidationFunction } from "../interfaces/ValidationFunction";
export declare class Validator {
    private _typeValidators;
    private _limits;
    private _validationErrors;
    private _errors;
    constructor();
    addTypeValidator(name: string, validator: ValidationFunction): void;
    addLimit(name: string, limitFunction: (input: any) => boolean, types: string[]): void;
    protected _resetLimits(): void;
    protected _mapLimits(): void;
    validate(input: any, structure: ValidationStructure): Promise<any>;
    private _validate;
    private _validateProperty;
    private _logError;
}
