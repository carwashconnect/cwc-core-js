import { Dates } from "./Dates";
import { Errors } from "./Errors";
import { IError } from "../interfaces/IError"
describe("Errors", function () {

    it("awsErrorToIError() should convert an aws error to an IError", function () {
        let message = "Access Token has expired"
        let code = "NotAuthorizedException";
        let statusCode = 401;
        let awsError = {
            message: message,
            code: code,
            statusCode: statusCode,
            retryable: false
        };
        let iError: IError = {
            message: message,
            code: code,
            status: statusCode,
            dateCreated: Dates.toISO(Date.now())
        };
        
        expect(Errors.awsErrorToIError(awsError)).toEqual(iError);
    });

    it("toTimeStamp() should convert a date to a time stamp", function () {
        let time = 1534264485715;
        let date = new Date(time);
        expect(Dates.toTimeStamp(date)).toEqual(time);
    });

    it("toTimeStamp() should convert a string to a time stamp", function () {
        let time = 1534264485715;
        let strTime = "2018-08-14T16:34:45.715Z";
        expect(Dates.toTimeStamp(strTime)).toEqual(time);
    });

});
