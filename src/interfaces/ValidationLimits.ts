export interface ValidationLimits {
    validationType: string[];
    required?: boolean;
    max?: number;
    min?: number;
    maxLength?: number;
    minLength?: number;
    [key: string]: any
}