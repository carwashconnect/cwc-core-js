import { IError } from "../interfaces/IError";
export declare class Errors {
    static awsErrorToIError(awsError: {
        message: string;
        code: string;
        statusCode: number;
        retryable: boolean;
    }): IError;
}
