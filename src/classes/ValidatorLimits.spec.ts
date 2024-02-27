import "jasmine";
import { limitMax as max, limitMin as min, limitMaxLength as maxLength, limitMinLength as minLength } from "./ValidatorLimits"

describe("Validator limits", function () {

    //Min
    it("min() should return false if input is less than the comparison value", function () {
        expect(min(0, 1)).toEqual(false);
    });

    it("min() should return true if input is greater than or equal to the comparison value", function () {
        expect(min(1, 0)).toEqual(true);
        expect(min(0, 0)).toEqual(true);
    });


    //Max
    it("max() should return false if input is greater than the comparison value", function () {
        expect(max(1, 0)).toEqual(false);
    });

    it("max() should return true if input is less than or equal to the comparison value", function () {
        expect(max(0, 1)).toEqual(true);
        expect(max(0, 0)).toEqual(true);
    });


    //Min length
    it("minLength() should return false if the input length is less than the comparison value", function () {

        //String
        expect(minLength("a", 2)).toEqual(false);

        //Array
        expect(minLength(["a"], 2)).toEqual(false);

        //Object
        expect(minLength({ "a": 0 }, 2)).toEqual(false);
    });

    it("minLength() should return true if the input length is greater than or equal the comparison value", function () {

        //String
        expect(minLength("a", 1)).toEqual(true);
        expect(minLength("a", 0)).toEqual(true);

        //Array
        expect(minLength(["a"], 1)).toEqual(true);
        expect(minLength(["a"], 0)).toEqual(true);

        //Object
        expect(minLength({ "a": 0 }, 1)).toEqual(true);
        expect(minLength({ "a": 0 }, 0)).toEqual(true);

    });

    //Max length
    it("maxLength() should return false if the input length is greater than the comparison value", function () {

        //String
        expect(maxLength("a", 0)).toEqual(false);

        //Array
        expect(maxLength(["a"], 0)).toEqual(false);

        //Object
        expect(maxLength({ "a": 0 }, 0)).toEqual(false);
    });

    it("maxLength() should return true if the input length is less than or equal the comparison value", function () {

        //String
        expect(maxLength("a", 1)).toEqual(true);
        expect(maxLength("a", 2)).toEqual(true);

        //Array
        expect(maxLength(["a"], 1)).toEqual(true);
        expect(maxLength(["a"], 2)).toEqual(true);

        //Object
        expect(maxLength({ "a": 0 }, 1)).toEqual(true);
        expect(maxLength({ "a": 0 }, 2)).toEqual(true);

    });



});
