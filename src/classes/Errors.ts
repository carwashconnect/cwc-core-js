import { IError } from "../interfaces/IError";
import { Dates } from "./Dates";
import { Objects } from "./Objects";

export class Errors {

    static awsErrorToIError(awsError: { message: string, code: string, statusCode: number, retryable: boolean }): IError {
        return <IError>{
            message: awsError.message,
            code: awsError.code,
            status: awsError.statusCode || 500,
            timeStamp: Dates.toISO(Date.now())
        }
    }

    static stamp(error: IError): IError {
        let err: IError = Objects.copy(error);
        err.timeStamp = Dates.toISO(Date.now());
        return err;
    }

}