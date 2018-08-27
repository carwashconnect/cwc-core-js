import { ValidationLimits } from "./ValidationLimits";
export declare type ValidationStructure = ValidationLimits | ValidationLimits[] | ValidationLimitObject;
export interface ValidationLimitObject {
    [key: string]: ValidationLimits | ValidationLimits[] | ValidationLimitObject;
}
