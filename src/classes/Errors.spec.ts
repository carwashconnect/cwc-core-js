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

        let myError = Errors.awsErrorToIError(awsError);
        let iError: IError = {
            message: message,
            code: code,
            status: statusCode,
            dateCreated: myError.dateCreated
        };

        expect(myError).toEqual(iError);
    });

    it("stamp() should add a timestamp to an error", function () {
        let iError: IError = {
            message: "My message",
            code: "MyMessage",
            status: 500
        };

        let newIError: IError = Errors.stamp(iError);
        iError.dateCreated = newIError.dateCreated;
        
        expect(newIError).toEqual(iError);
    });

});
