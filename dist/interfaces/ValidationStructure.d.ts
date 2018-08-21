import { ValidationLimits } from "./ValidationLimits";
export interface ValidationStructure {
    [key: string]: ValidationLimits | ValidationLimits[] | ValidationStructure;
}
