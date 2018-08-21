import { ValidationType } from "../interfaces/ValidationType";
import { Objects } from "./Objects";

export let isArray: ValidationType = (input: any) => {
    return Array.isArray(input) ? true : false;
}

export let isBoolean: ValidationType = (input: any) => {
    return true === input || false === input ? true : false;
}

export let isEmail: ValidationType = (input: any) => {
    if (!isString(input)) return false;
    let emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    return 0 == input.replace(emailRegex, "").length ? true : false;
}

export let isISODate: ValidationType = (input: any) => {
    if (!isString(input)) return false;
    let dateRegex = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d(:[0-5]\d(\.\d{0,3})?)?([+-][0-2]\d:[0-5]\d|Z)/;
    return 0 == input.replace(dateRegex, "").length ? true : false;
}

export let isJWTToken: ValidationType = (input: any) => {
    if (!isString(input)) return false;
    let tokenRegex = /[A-Za-z0-9-_=.]+/;
    return 0 == input.replace(tokenRegex, "").length ? true : false;
}

export let isNull: ValidationType = (input: any) => {
    return null === input ? true : false;
}


export let isNumber: ValidationType = (input: any) => {
    if (isString(input)) return !isNaN(Number(input)) ? true : false;;
    return "number" === typeof input ? true : false;
}

export let isObject: ValidationType = (input: any) => {
    return Objects.isObject(input) ? true : false;
}

export let isPhoneNumber: ValidationType = (input: any) => {
    if (!isString(input)) return false;
    let tokenRegex = /(\+?\d{0,3}[ -.●])?\(?([2-9][0-8][0-9])\)?[ -.●]?([2-9][0-9]{2})[ -.●]?([0-9]{4})/;
    return 0 == input.replace(tokenRegex, "").length ? true : false;
}

export let isString: ValidationType = (input: any) => {
    return "string" === typeof input ? true : false;
}

export let isUndefined: ValidationType = (input: any) => {
    return "undefined" === typeof input ? true : false;
}

