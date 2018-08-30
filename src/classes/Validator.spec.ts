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
    it("validate() should validate simple limits", function (done) {

        let limit: ValidationStructure = {
            validationType: ["number"],
            max: 19,
            min: 17
        }


        validator.validate(16, limit)
            .then((newObj: any) => {
                expect(true).toEqual(false);
                done()
            })
            .catch(error => {
                expect(true).toEqual(true);
                done()
            })

        validator.validate(17, limit)
            .then((newObj: any) => {
                expect(newObj).toEqual(17);
                done()
            })
            .catch(error => {
                console.log(error);
                expect(true).toEqual(false);
                done()
            })

        validator.validate(18, limit)
            .then((newObj: any) => {
                expect(newObj).toEqual(18);
                done()
            })
            .catch(error => {
                expect(true).toEqual(false);
                done()
            })

        validator.validate(19, limit)
            .then((newObj: any) => {
                expect(newObj).toEqual(19);
                done()
            })
            .catch(error => {
                expect(true).toEqual(false);
                done()
            })

        validator.validate(20, limit)
            .then((newObj: any) => {
                expect(true).toEqual(false);
                done()
            })
            .catch(error => {
                expect(true).toEqual(true);
                done()
            })

    });

});
