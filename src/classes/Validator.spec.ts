import "jasmine";
import { Validator } from "./Validator";
import { ValidationLimits } from "../interfaces/ValidationLimits"
import { ValidationStructure } from "../interfaces/ValidationStructure"
import { IError } from "../interfaces/IError"

describe("Validator", function () {

    let validator = new Validator();

    //Simple known objects
    it("validate() should validate simple known objects", function (done) {

        let obj: any = {
            a: "hello",
            b: null,
            c: 1
        }

        let expectedOutput: any = {
            a: "hello",
            b: null
        }

        let expectedStructure: ValidationStructure = {
            a: {
                validationType: ["string"],
                required: true
            },
            b: {
                validationType: ["string", "NULL"]
            }
        }

        validator.validate(obj, expectedStructure)
            .then((newObj: any) => {
                expect(newObj).toEqual(expectedOutput);
                done()
            })
            .catch(error => {
                expect(true).toEqual(false);
                done()
            })

    });

    it("validate() should throw proper errors on simple known objects", function (done) {

        let obj: any = {
            a: "hello",
            b: null,
            errorPropertyc: 1
        }

        let expectedStructure: ValidationStructure = {
            a: {
                validationType: ["string"],
                required: true
            },
            b: {
                validationType: ["string", "NULL"]
            },
            errorProperty: {
                validationType: ["string", "NULL"],
                required: true
            }
        }

        validator.validate(obj, expectedStructure)
            .then((newObj: any) => {
                expect(true).toEqual(false);
                done()
            })
            .catch((errors: IError[]) => {
                expect(errors[0].message.indexOf("errorProperty")).toBeGreaterThan(-1);
                done()
            })

    });


    //Simple unknown objects
    it("validate() should validate simple unknown objects", function (done) {

        let obj: any[] = [
            "hello",
            "world",
            "!"
        ]

        let expectedOutput: any[] = [
            "hello",
            "world",
            "!"
        ]

        let expectedStructure: ValidationLimits[] = [{
            validationType: ["string"],
            required: true
        }]

        validator.validate(obj, expectedStructure)
            .then((newObj: any) => {
                expect(newObj).toEqual(expectedOutput);
                done()
            })
            .catch(error => {
                console.log(error);
                expect(true).toEqual(false);
                done()
            })

    });

    it("validate() should throw proper errors on simple unknown objects", function (done) {

        let obj: any[] = ["hello", "world", 0]


        let expectedStructure: ValidationLimits[] = [{
            validationType: ["string"],
            required: true
        }]

        validator.validate(obj, expectedStructure)
            .then((newObj: any) => {
                expect(true).toEqual(false);
                done()
            })
            .catch((errors: IError[]) => {
                expect(errors[0].message.indexOf("2")).toBeGreaterThan(-1);
                done()
            })

    });


    //Complex known objects
    it("validate() should validate complex known objects", function (done) {

        let obj: any = {
            a: "hello",
            b: { c: "1@1.1" },
            d: { e: 17 }
        }

        let expectedOutput: any = {
            a: "hello",
            b: { c: "1@1.1" },
            d: {}
        }

        let expectedStructure: ValidationStructure = {
            a: { validationType: ["string"], required: true },
            b: { c: { validationType: ["email"], required: true } },
            d: { e: { validationType: ["string", "NULL"] } }
        }

        validator.validate(obj, expectedStructure)
            .then((newObj: any) => {
                expect(newObj).toEqual(expectedOutput);
                done()
            })
            .catch(error => {
                expect(true).toEqual(false);
                done()
            })

    });

    it("validate() should throw proper complex on simple known objects", function (done) {

        let obj: any = {
            a: "hello",
            b: { c: "1@1.1" },
            d: { e: 17 }
        }

        let expectedStructure: ValidationStructure = {
            a: { validationType: ["string"], required: true },
            b: { c: { validationType: ["email"], required: true } },
            d: { e: { validationType: ["string", "NULL"], required: true } }
        }

        validator.validate(obj, expectedStructure)
            .then((newObj: any) => {
                expect(true).toEqual(false);
                done()
            })
            .catch((errors: IError[]) => {
                expect(errors[0].message.indexOf("d.e")).toBeGreaterThan(-1);
                done()
            })

    });


    //Limits
    it("validate() should validate simple limits", async () => {

        let limit: ValidationStructure = {
            validationType: ["number"],
            max: 19,
            min: 17
        }


        let isError1 = false;
        const output1 = await validator.validate(16, limit).catch(() => { isError1 = true })
        expect(isError1).toBeTrue();

        let isError2 = false;
        const output2 = await validator.validate(17, limit).catch(() => { isError2 = true })
        expect(output2).toEqual(17);
        expect(isError2).toBeFalse();

        let isError3 = false;
        const output3 = await validator.validate(18, limit).catch(() => { isError3 = true })
        expect(output3).toEqual(18);
        expect(isError3).toBeFalse();

        let isError4 = false;
        const output4 = await validator.validate(19, limit).catch(() => { isError4 = true })
        expect(output4).toEqual(19);
        expect(isError4).toBeFalse();

        let isError5 = false;
        const output5 = await validator.validate(20, limit).catch(() => { isError5 = true })
        expect(isError5).toBeTrue();

    });

});
