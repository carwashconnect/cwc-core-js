import "jasmine";
import { isArray, isBoolean, isEmail, isJWTToken, isNull, isNumber, isPhoneNumber, isObject, isUndefined, isISODate, isString } from "./ValidatorTypes";

describe("Validator types", function () {

    //Arrays
    let tArray: object = [];

    // Booleans
    let tBoolean1: boolean = true;
    let tBoolean2: boolean = false;

    // Emails
    let tEmail1: string = "test@domain.ca";
    let tEmail2: string = "1@1.1";
    let tEmail3: string = "test+filter@domain.ca";

    //Tokens
    let tToken: string = "eyJraWQiOiJ2NlRoWEpKazhRcWZpclVQK0ZXaEgyeHdzaEhyK1wvcmRvRTBRYUkybjRyUT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI2ZWNlMmFjMi1lYjAzLTQxMzItYjc0OC05ODRhMDQ1MTcwNWQiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX1FKT2puM1hFSCIsImNvZ25pdG86dXNlcm5hbWUiOiI2ZWNlMmFjMi1lYjAzLTQxMzItYjc0OC05ODRhMDQ1MTcwNWQiLCJnaXZlbl9uYW1lIjoiSmVmZnJleSIsImF1ZCI6IjZvNTI4Z2IybTEzbTc5NjI0ZGh2M2pxZm04IiwiZXZlbnRfaWQiOiIyYjJjYmQyNS1hMjQ3LTExZTgtYTJlYi03MzE1ZjRhMmI5YzIiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTUzNDUyODcxOCwiZXhwIjoxNTM0NTMyMzE4LCJpYXQiOjE1MzQ1Mjg3MTgsImZhbWlseV9uYW1lIjoiTmVsc29uIiwiZW1haWwiOiJ0aGV3YXJtZXN0ZnV6enkrYXdzdGVzdDFAZ21haWwuY29tIn0.Rt0hjlkmruTVddfp-b_GGGkV1Dx5bmimlXPP_Jh3eRzuIgua9jOZjUqAEYHyI7jox_uLgLef1kkxVti6rMFoleeVdyGyD9UdME9q_9Am-xrsm5tAAwbB7wRUI2P7QizD8fP6uJEI4u2820Xmfgcpi0qFEu-uPTHMdO-spBm37nZVpQ-sepEFfb4bXPdXrWY_Ys8mKBJujuh5YM6_zqQgBDxRKdiF_ASFK26sbRBCz_gVoP6Rl-ZQygZIPStHjgtNwmSNnoHpRk63OdaEkiri_92NcE1ZhoFDBA-rDDmuebBctvddKbonMobdvQS9WY_x8Drka0lXY7pU-IOwy4tBXw";

    //Null
    let tNull: null = null;

    //Number
    let tNumber1: number = 1;
    let tNumber2: number = -1;
    let tNumber3: number = 0;
    let tNumber4: number = 0.9837;

    //Objects
    let tObject: object = {};

    //Phone Number
    let tPhone1: string = "722-205-4092";
    let tPhone2: string = "(853) 315-8956";
    let tPhone3: string = "952 571 6170";
    let tPhone4: string = "861.658.8013";
    let tPhone5: string = "+91 (528) 418-5016";
    let tPhone6: string = "4198475935";

    //Undefined
    let tUndefined: undefined;

    //Undefined
    let tISODate1: string = "2011-10-05T14:48:00.000Z";
    let tISODate2: string = "2018-08-20T21:28:30.713Z";

    it("isArray() should determine if an input is an array", function () {
        expect(isArray(tArray)).toEqual(true);
        expect(isArray(tBoolean1)).toEqual(false);
        expect(isArray(tBoolean2)).toEqual(false);
        expect(isArray(tEmail1)).toEqual(false);
        expect(isArray(tEmail2)).toEqual(false);
        expect(isArray(tEmail3)).toEqual(false);
        expect(isArray(tToken)).toEqual(false);
        expect(isArray(tNull)).toEqual(false);
        expect(isArray(tNumber1)).toEqual(false);
        expect(isArray(tNumber2)).toEqual(false);
        expect(isArray(tNumber3)).toEqual(false);
        expect(isArray(tNumber4)).toEqual(false);
        expect(isArray(tObject)).toEqual(false);
        expect(isArray(tPhone1)).toEqual(false);
        expect(isArray(tPhone2)).toEqual(false);
        expect(isArray(tPhone3)).toEqual(false);
        expect(isArray(tPhone4)).toEqual(false);
        expect(isArray(tPhone5)).toEqual(false);
        expect(isArray(tPhone6)).toEqual(false);
        expect(isArray(tUndefined)).toEqual(false);
        expect(isArray(tISODate1)).toEqual(false);
        expect(isArray(tISODate2)).toEqual(false);
    });

    it("isBoolean() should determine if an input is a boolean", function () {
        expect(isBoolean(tArray)).toEqual(false);
        expect(isBoolean(tBoolean1)).toEqual(true);
        expect(isBoolean(tBoolean2)).toEqual(true);
        expect(isBoolean(tEmail1)).toEqual(false);
        expect(isBoolean(tEmail2)).toEqual(false);
        expect(isBoolean(tEmail3)).toEqual(false);
        expect(isBoolean(tToken)).toEqual(false);
        expect(isBoolean(tNull)).toEqual(false);
        expect(isBoolean(tNumber1)).toEqual(false);
        expect(isBoolean(tNumber2)).toEqual(false);
        expect(isBoolean(tNumber3)).toEqual(false);
        expect(isBoolean(tNumber4)).toEqual(false);
        expect(isBoolean(tObject)).toEqual(false);
        expect(isBoolean(tPhone1)).toEqual(false);
        expect(isBoolean(tPhone2)).toEqual(false);
        expect(isBoolean(tPhone3)).toEqual(false);
        expect(isBoolean(tPhone4)).toEqual(false);
        expect(isBoolean(tPhone5)).toEqual(false);
        expect(isBoolean(tPhone6)).toEqual(false);
        expect(isBoolean(tUndefined)).toEqual(false);
        expect(isBoolean(tISODate1)).toEqual(false);
        expect(isBoolean(tISODate2)).toEqual(false);
    });

    it("isEmail() should determine if an input is an email", function () {
        expect(isEmail(tArray)).toEqual(false);
        expect(isEmail(tBoolean1)).toEqual(false);
        expect(isEmail(tBoolean2)).toEqual(false);
        expect(isEmail(tEmail1)).toEqual(true);
        expect(isEmail(tEmail2)).toEqual(true);
        expect(isEmail(tEmail3)).toEqual(true);
        expect(isEmail(tToken)).toEqual(false);
        expect(isEmail(tNull)).toEqual(false);
        expect(isEmail(tNumber1)).toEqual(false);
        expect(isEmail(tNumber2)).toEqual(false);
        expect(isEmail(tNumber3)).toEqual(false);
        expect(isEmail(tNumber4)).toEqual(false);
        expect(isEmail(tObject)).toEqual(false);
        expect(isEmail(tPhone1)).toEqual(false);
        expect(isEmail(tPhone2)).toEqual(false);
        expect(isEmail(tPhone3)).toEqual(false);
        expect(isEmail(tPhone4)).toEqual(false);
        expect(isEmail(tPhone5)).toEqual(false);
        expect(isEmail(tPhone6)).toEqual(false);
        expect(isEmail(tUndefined)).toEqual(false);
        expect(isEmail(tISODate1)).toEqual(false);
        expect(isEmail(tISODate2)).toEqual(false);
    });

    it("isJWTToken() should determine if an input is a jwt token", function () {
        expect(isJWTToken(tArray)).toEqual(false);
        expect(isJWTToken(tBoolean1)).toEqual(false);
        expect(isJWTToken(tBoolean2)).toEqual(false);
        expect(isJWTToken(tEmail1)).toEqual(false);
        expect(isJWTToken(tEmail2)).toEqual(false);
        expect(isJWTToken(tEmail3)).toEqual(false);
        expect(isJWTToken(tToken)).toEqual(true);
        expect(isJWTToken(tNull)).toEqual(false);
        expect(isJWTToken(tNumber1)).toEqual(false);
        expect(isJWTToken(tNumber2)).toEqual(false);
        expect(isJWTToken(tNumber3)).toEqual(false);
        expect(isJWTToken(tNumber4)).toEqual(false);
        expect(isJWTToken(tObject)).toEqual(false);
        expect(isJWTToken(tPhone1)).toEqual(true);
        expect(isJWTToken(tPhone2)).toEqual(false);
        expect(isJWTToken(tPhone3)).toEqual(false);
        expect(isJWTToken(tPhone4)).toEqual(true);
        expect(isJWTToken(tPhone5)).toEqual(false);
        expect(isJWTToken(tPhone6)).toEqual(true);
        expect(isJWTToken(tUndefined)).toEqual(false);
        expect(isJWTToken(tISODate1)).toEqual(false);
        expect(isJWTToken(tISODate2)).toEqual(false);
    });

    it("isNull() should determine if an input is null", function () {
        expect(isNull(tArray)).toEqual(false);
        expect(isNull(tBoolean1)).toEqual(false);
        expect(isNull(tBoolean2)).toEqual(false);
        expect(isNull(tEmail1)).toEqual(false);
        expect(isNull(tEmail2)).toEqual(false);
        expect(isNull(tEmail3)).toEqual(false);
        expect(isNull(tToken)).toEqual(false);
        expect(isNull(tNull)).toEqual(true);
        expect(isNull(tNumber1)).toEqual(false);
        expect(isNull(tNumber2)).toEqual(false);
        expect(isNull(tNumber3)).toEqual(false);
        expect(isNull(tNumber4)).toEqual(false);
        expect(isNull(tObject)).toEqual(false);
        expect(isNull(tPhone1)).toEqual(false);
        expect(isNull(tPhone2)).toEqual(false);
        expect(isNull(tPhone3)).toEqual(false);
        expect(isNull(tPhone4)).toEqual(false);
        expect(isNull(tPhone5)).toEqual(false);
        expect(isNull(tPhone6)).toEqual(false);
        expect(isNull(tUndefined)).toEqual(false);
        expect(isNull(tISODate1)).toEqual(false);
        expect(isNull(tISODate2)).toEqual(false);
    });

    it("isNumber() should determine if an input is a number", function () {
        expect(isNumber(tArray)).toEqual(false);
        expect(isNumber(tBoolean1)).toEqual(false);
        expect(isNumber(tBoolean2)).toEqual(false);
        expect(isNumber(tEmail1)).toEqual(false);
        expect(isNumber(tEmail2)).toEqual(false);
        expect(isNumber(tEmail3)).toEqual(false);
        expect(isNumber(tToken)).toEqual(false);
        expect(isNumber(tNull)).toEqual(false);
        expect(isNumber(tNumber1)).toEqual(true);
        expect(isNumber(tNumber2)).toEqual(true);
        expect(isNumber(tNumber3)).toEqual(true);
        expect(isNumber(tNumber4)).toEqual(true);
        expect(isNumber(tObject)).toEqual(false);
        expect(isNumber(tPhone1)).toEqual(false);
        expect(isNumber(tPhone2)).toEqual(false);
        expect(isNumber(tPhone3)).toEqual(false);
        expect(isNumber(tPhone4)).toEqual(false);
        expect(isNumber(tPhone5)).toEqual(false);
        expect(isNumber(tPhone6)).toEqual(true);
        expect(isNumber(tUndefined)).toEqual(false);
        expect(isNumber(tISODate1)).toEqual(false);
        expect(isNumber(tISODate2)).toEqual(false);
    });

    it("isObject() should determine if an input is an object", function () {
        expect(isObject(tArray)).toEqual(true);
        expect(isObject(tBoolean1)).toEqual(false);
        expect(isObject(tBoolean2)).toEqual(false);
        expect(isObject(tEmail1)).toEqual(false);
        expect(isObject(tEmail2)).toEqual(false);
        expect(isObject(tEmail3)).toEqual(false);
        expect(isObject(tToken)).toEqual(false);
        expect(isObject(tNull)).toEqual(false);
        expect(isObject(tNumber1)).toEqual(false);
        expect(isObject(tNumber2)).toEqual(false);
        expect(isObject(tNumber3)).toEqual(false);
        expect(isObject(tNumber4)).toEqual(false);
        expect(isObject(tObject)).toEqual(true);
        expect(isObject(tPhone1)).toEqual(false);
        expect(isObject(tPhone2)).toEqual(false);
        expect(isObject(tPhone3)).toEqual(false);
        expect(isObject(tPhone4)).toEqual(false);
        expect(isObject(tPhone5)).toEqual(false);
        expect(isObject(tPhone6)).toEqual(false);
        expect(isObject(tUndefined)).toEqual(false);
        expect(isObject(tISODate1)).toEqual(false);
        expect(isObject(tISODate2)).toEqual(false);
    });

    it("isPhoneNumber() should determine if an input is a phone number", function () {
        expect(isPhoneNumber(tArray)).toEqual(false);
        expect(isPhoneNumber(tBoolean1)).toEqual(false);
        expect(isPhoneNumber(tBoolean2)).toEqual(false);
        expect(isPhoneNumber(tEmail1)).toEqual(false);
        expect(isPhoneNumber(tEmail2)).toEqual(false);
        expect(isPhoneNumber(tEmail3)).toEqual(false);
        expect(isPhoneNumber(tToken)).toEqual(false);
        expect(isPhoneNumber(tNull)).toEqual(false);
        expect(isPhoneNumber(tNumber1)).toEqual(false);
        expect(isPhoneNumber(tNumber2)).toEqual(false);
        expect(isPhoneNumber(tNumber3)).toEqual(false);
        expect(isPhoneNumber(tNumber4)).toEqual(false);
        expect(isPhoneNumber(tObject)).toEqual(false);
        expect(isPhoneNumber(tPhone1)).toEqual(true);
        expect(isPhoneNumber(tPhone2)).toEqual(true);
        expect(isPhoneNumber(tPhone3)).toEqual(true);
        expect(isPhoneNumber(tPhone4)).toEqual(true);
        expect(isPhoneNumber(tPhone5)).toEqual(true);
        expect(isPhoneNumber(tPhone6)).toEqual(true);
        expect(isPhoneNumber(tUndefined)).toEqual(false);
        expect(isPhoneNumber(tISODate1)).toEqual(false);
        expect(isPhoneNumber(tISODate2)).toEqual(false);
    });

    it("isString() should determine if an input is a string", function () {
        expect(isString(tArray)).toEqual(false);
        expect(isString(tBoolean1)).toEqual(false);
        expect(isString(tBoolean2)).toEqual(false);
        expect(isString(tEmail1)).toEqual(true);
        expect(isString(tEmail2)).toEqual(true);
        expect(isString(tEmail3)).toEqual(true);
        expect(isString(tToken)).toEqual(true);
        expect(isString(tNull)).toEqual(false);
        expect(isString(tNumber1)).toEqual(false);
        expect(isString(tNumber2)).toEqual(false);
        expect(isString(tNumber3)).toEqual(false);
        expect(isString(tNumber4)).toEqual(false);
        expect(isString(tObject)).toEqual(false);
        expect(isString(tPhone1)).toEqual(true);
        expect(isString(tPhone2)).toEqual(true);
        expect(isString(tPhone3)).toEqual(true);
        expect(isString(tPhone4)).toEqual(true);
        expect(isString(tPhone5)).toEqual(true);
        expect(isString(tPhone6)).toEqual(true);
        expect(isString(tUndefined)).toEqual(false);
        expect(isString(tISODate1)).toEqual(true);
        expect(isString(tISODate2)).toEqual(true);
    });

    it("isUndefined() should determine if an input is undefined", function () {
        expect(isUndefined(tArray)).toEqual(false);
        expect(isUndefined(tBoolean1)).toEqual(false);
        expect(isUndefined(tBoolean2)).toEqual(false);
        expect(isUndefined(tEmail1)).toEqual(false);
        expect(isUndefined(tEmail2)).toEqual(false);
        expect(isUndefined(tEmail3)).toEqual(false);
        expect(isUndefined(tToken)).toEqual(false);
        expect(isUndefined(tNull)).toEqual(false);
        expect(isUndefined(tNumber1)).toEqual(false);
        expect(isUndefined(tNumber2)).toEqual(false);
        expect(isUndefined(tNumber3)).toEqual(false);
        expect(isUndefined(tNumber4)).toEqual(false);
        expect(isUndefined(tObject)).toEqual(false);
        expect(isUndefined(tPhone1)).toEqual(false);
        expect(isUndefined(tPhone2)).toEqual(false);
        expect(isUndefined(tPhone3)).toEqual(false);
        expect(isUndefined(tPhone4)).toEqual(false);
        expect(isUndefined(tPhone5)).toEqual(false);
        expect(isUndefined(tPhone6)).toEqual(false);
        expect(isUndefined(tUndefined)).toEqual(true);
        expect(isUndefined(tISODate1)).toEqual(false);
        expect(isUndefined(tISODate2)).toEqual(false);
    });

    it("isISODate() should determine if an input is an ISO Date", function () {
        expect(isISODate(tArray)).toEqual(false);
        expect(isISODate(tBoolean1)).toEqual(false);
        expect(isISODate(tBoolean2)).toEqual(false);
        expect(isISODate(tEmail1)).toEqual(false);
        expect(isISODate(tEmail2)).toEqual(false);
        expect(isISODate(tEmail3)).toEqual(false);
        expect(isISODate(tToken)).toEqual(false);
        expect(isISODate(tNull)).toEqual(false);
        expect(isISODate(tNumber1)).toEqual(false);
        expect(isISODate(tNumber2)).toEqual(false);
        expect(isISODate(tNumber3)).toEqual(false);
        expect(isISODate(tNumber4)).toEqual(false);
        expect(isISODate(tObject)).toEqual(false);
        expect(isISODate(tPhone1)).toEqual(false);
        expect(isISODate(tPhone2)).toEqual(false);
        expect(isISODate(tPhone3)).toEqual(false);
        expect(isISODate(tPhone4)).toEqual(false);
        expect(isISODate(tPhone5)).toEqual(false);
        expect(isISODate(tPhone6)).toEqual(false);
        expect(isISODate(tUndefined)).toEqual(false);
        expect(isISODate(tISODate1)).toEqual(true);
        expect(isISODate(tISODate2)).toEqual(true);
    });

});
