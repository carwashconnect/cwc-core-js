import { Promises } from "./Promises";

describe("Promises", function () {

    it("all() should execute all promises at the same time and always return an array", function () {
        Promises.all([], false)
            .then(res => {
                expect(res).toEqual([]);
            })
            .catch(err => { expect(true).toEqual(false); })

        let promises: Promise<any>[] = [
            Promise.resolve("Hello"),
            Promise.resolve(true),
            Promise.resolve(0),
            Promise.resolve(["a"]),
            Promise.reject("My error here")
        ]
        let promisesResult: any[] = ["Hello", true, 0, ["a"], null]
        Promises.all(promises, false)
            .then(res => {
                expect(res).toEqual(promisesResult);
            })
            .catch(err => { expect(true).toEqual(false); })
    });

    it("sequence() should execute promises in a sequence", function () {

        //Inputs
        let promises1: Promise<any>[] = [Promise.resolve("Hello"), Promise.resolve(true), Promise.resolve(0), Promise.resolve(["a"]), Promise.reject("My error here")]
        let promises2: Promise<any>[] = [Promise.resolve("Hello"), Promise.resolve(true), Promise.resolve(0), Promise.resolve(["a"]), Promise.reject("My error here")]

        //Ouputs
        let promisesResult: any[] = ["Hello", true, 0, ["a"], null]

        //Empty input
        Promises.sequence([])
            .then(res => {
                expect(res).toEqual([]);
            })
            .catch(err => { expect(true).toEqual(false); })

        // Failing on catch 
        Promises.sequence(promises1)
            .then(res => {
                expect(true).toEqual(false);
            })
            .catch(err => { expect(err).toEqual("My error here"); })

        //Succeeding on catch
        Promises.sequence(promises2, true)
            .then(res => {
                expect(res).toEqual(promisesResult);
            })
            .catch(err => { expect(true).toEqual(false); })

    });

});
