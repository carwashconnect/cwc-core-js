import { IError } from "../interfaces/IError";
import { Dates } from "./Dates";
import { Objects } from "./Objects";

export class Errors {

    static awsErrorToIError(awsError: { message: string, code: string, statusCode: number, retryable: boolean }): IError {
        return <IError>{
            message: awsError.message,
            code: awsError.code,
            status: awsError.statusCode,
            dateCreated: Dates.toISO(Date.now())
        }
    }

    static stamp(error: IError): IError {
        let err: IError = Objects.copy(error);
        err.dateCreated = Dates.toISO(Date.now());
        return err;
    }

}