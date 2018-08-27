import { ValidationFunction } from "../interfaces/ValidationFunction";

export let limitMin: ValidationFunction = (input: any, comparison: number) => {
    return input >= comparison ? true : false;
}

export let limitMax: ValidationFunction = (input: any, comparison: number) => {
    return input <= comparison ? true : false;
}

export let limitMinLength: ValidationFunction = (input: object, comparison: number) => {
    return Object.keys(input).length >= comparison ? true : false;
}

export let limitMaxLength: ValidationFunction = (input: object, comparison: number) => {
    return Object.keys(input).length <= comparison ? true : false;
}