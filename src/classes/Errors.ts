import { IError } from "../interfaces/IError";
import { Dates } from "./Dates";

export class Errors {

    static awsErrorToIError(awsError: { message: string, code: string, statusCode: number, retryable: boolean }): IError {
        return <IError>{
            message: awsError.message,
            code: awsError.code,
            status: awsError.statusCode,
            dateCreated: Dates.toISO(Date.now())
        }
    }
    
}