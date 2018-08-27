import { ValidationLimits } from "./ValidationLimits"

export type ValidationStructure = ValidationLimits | ValidationLimits[] | ValidationLimitObject;

export interface ValidationLimitObject {
    [key: string]: ValidationLimits | ValidationLimits[] | ValidationLimitObject;
}