import { Objects } from "./Objects";

describe("Objects", function () {

    it("trim() should remove empty strings from an object", function () {
        let objInput: { [key: string]: any } = { "a": 0, "b": "", "c": { "d": "world", "e": "" } };
        let objOutput: { [key: string]: any } = { "a": 0, "c": { "d": "world" } }
        expect(Objects.trim(objInput)).toEqual(objOutput);
        expect(Objects.trim([objInput])).toEqual([objOutput]);
    });

    it("trim() should remove undefined values from an object", function () {
        let objInput: { [key: string]: any } = { "a": 0, "b": undefined, "c": { "d": "world", "e": undefined } };
        let objOutput: { [key: string]: any } = { "a": 0, "c": { "d": "world" } }
        expect(Objects.trim(objInput)).toEqual(objOutput);
        expect(Objects.trim([objInput])).toEqual([objOutput]);
    });
    
    it("trim() should return non-objects", function () {
        expect(Objects.trim(null)).toEqual(null);
        expect(Objects.trim(undefined)).toEqual(undefined);
        expect(Objects.trim(false)).toEqual(false);
        expect(Objects.trim(0)).toEqual(0);
        expect(Objects.trim("hello")).toEqual("hello");
    });

    it("deepSearch() should find properties deep within objects", function () {
        let objInput: { [key: string]: any } = { "a": 0, "b": "", "c": { "d": "world", "e": "", "f": { "g": "" } } };

        // Keys present
        expect(Objects.deepSearch(objInput, "a")).toEqual(true);
        expect(Objects.deepSearch(objInput, "c")).toEqual(true);
        expect(Objects.deepSearch(objInput, "c", "f")).toEqual(true);
        expect(Objects.deepSearch(objInput, "c", "f", "g")).toEqual(true);

        // Keys not present
        expect(Objects.deepSearch(objInput, "d")).toEqual(false);
        expect(Objects.deepSearch(objInput, "c", "a")).toEqual(false);
        expect(Objects.deepSearch(objInput, "c", "f", "h")).toEqual(false);

    });

    it("deepSearch() should evaluate false on non-objects", function () {
        expect(Objects.deepSearch(null)).toEqual(false);
        expect(Objects.deepSearch(undefined)).toEqual(false);
        expect(Objects.deepSearch(false)).toEqual(false);
        expect(Objects.deepSearch(0)).toEqual(false);
        expect(Objects.deepSearch("hello")).toEqual(false);
    });

    it("deepSearch() should evaluate true when going through arrays", function () {
        let objInput: { [key: string]: any } = { a: [{ b: 0 }, { c: 0 }] };
        expect(Objects.deepSearch(objInput, "a", "0", "b")).toEqual(true);
        expect(Objects.deepSearch(objInput, "a", 1, "c")).toEqual(true);

        let objInput2: { [key: string]: any }[] = [{ a: [{ b: 0 }, { c: 0 }] }];
        expect(Objects.deepSearch(objInput2, "0", "a", 1, "c")).toEqual(true);
        expect(Objects.deepSearch(objInput2, 0, "a", 1, "c")).toEqual(true);
        expect(Objects.deepSearch(objInput2, 0, "a", 2, "c")).toEqual(false);
    });

    it("deepSearch() should evaluate false in niche object cases", function () {
        expect(Objects.deepSearch(null, "key")).toEqual(false);
        expect(Objects.deepSearch({ test: null }, "test", "a")).toEqual(false);
        expect(Objects.deepSearch({ test: undefined }, "test")).toEqual(false);
        expect(Objects.deepSearch({ test: "a" }, "test", "a")).toEqual(false);
    });

    it("copy() should return basic types", function () {
        expect(Objects.copy(null)).toEqual(null);
        expect(Objects.copy(undefined)).toEqual(undefined);
        expect(Objects.copy(false)).toEqual(false);
        expect(Objects.copy(0)).toEqual(0);
        expect(Objects.copy("hello")).toEqual("hello");
    });

    it("copy() should create a copy of an object input", function () {
        let obj: any = {
            "a": "a",
            "b": 0,
            "c": null,
            "d": false,
            "e": [
                { "f": "f" },
                "g"
            ],
            "h": {
                "i": "i",
                "j": {
                    "k": "k",
                    "l": 50
                }
            }
        }

        //Create the copy and test
        let copy: any = Objects.copy(obj);
        expect(copy).toEqual(obj);

        //Change the original to ensure it was copied
        obj["h"]["i"] = "m"
        expect(copy).not.toEqual(obj);

    });

    it("merge() should combine two objects", function () {

        //The real deal
        let obj1: any = {
            "a": "a",
            "b": 0,
            "c": null,
            "d": false,
            "e": [
                { "f": "f" },
                "g"
            ],
            "h": {
                "i": "i",
                "j": {
                    "k": "k",
                    "l": 50
                }
            }
        }

        let obj2: any = {
            "a": "b",
            "e": [
                { "g": "g" }
            ],
            "h": {
                "i": "j",
                "j": {
                    "k": "l",
                    "l": "m"
                }
            }
        }

        let result1: any = {
            "a": "b",
            "b": 0,
            "c": null,
            "d": false,
            "e": [
                { "g": "g" }
            ],
            "h": {
                "i": "j",
                "j": {
                    "k": "l",
                    "l": "m"
                }
            }
        }

        let result2: any = {
            "a": "b",
            "b": 0,
            "c": null,
            "d": false,
            "e": [
                { "f": "f" },
                "g",
                { "g": "g" }
            ],
            "h": {
                "i": "j",
                "j": {
                    "k": "l",
                    "l": "m"
                }
            }
        }

        expect(Objects.merge(obj1, obj2)).toEqual(result1);
        expect(Objects.merge(obj1, obj2, true)).toEqual(result2);

    });


    it("compare() should check what has changed between objects", function () {
        let obj1: any = {
            "a": "a",
            "b": 0,
            "c": null,
            "d": false,
            "e": [
                { "f": "f" },
                "g"
            ],
            "h": {
                "i": "i",
                "j": {
                    "k": "k",
                    "l": 50
                }
            }
        }

        let obj2: any = {
            "a": "a",
            "b": 1,
            "c": 4,
            "e": [
                { "f": "f" },
                "g"
            ],
            "h": {
                "i": "i",
                "j": {
                    "l": 50,
                    "m": 1
                }
            },
            "m": {
                "o": true
            }
        }


        let output = {
            additions: { "m": { "o": true }, "h": { "j": { "m": 1 } } },
            deletions: { "d": true, "h": { "j": { "k": true } } },
            updates: { "b": 1, "c": 4 },
        }

        //Create the copy and test
        let comparison: any = Objects.compare(obj1, obj2);

        let obj3: any = { a: true }
        let obj4: any = { a: false }
        let output2: any = { updates: { a: false } }
        let comparison2: any = Objects.compare(obj3, obj4);

        expect(comparison).toEqual(output);
        expect(comparison2).toEqual(output2);

    });

    it("compare() should differentiate types", function () {
        let obj1: any = { a: 50 };
        let obj2: any = { a: "50" };
        let output: any = { updates: { a: "50" } }
        let comparison: any = Objects.compare(obj1, obj2);
        expect(comparison).toEqual(output);
    });

    it("intersect() should check what has changed between objects", function () {
        let obj1: any = { "a": true, "b": true, "c": true, "d": { "a": true, "b": true }, "e": { "a": true } }
        let obj2: any = { "a": true, "b": false, "d": { "a": true, "b": false, "c": true }, "e": true }

        let outputMatching = { "a": true, "d": { "a": true } }
        let outputNotMatching = { "a": true, "b": true, "d": { "a": true, "b": true }, "e": { "a": true } }

        expect(Objects.intersect(obj1, obj2, { onlyMatchingFields: true })).toEqual(outputMatching);
        expect(Objects.intersect(obj1, obj2, { onlyMatchingFields: false })).toEqual(outputNotMatching);
    });

    it("shuffle() should shuffle arrays", function () {
        //Very unlikely this will shuffle back to normal
        const comparisonArr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29];
        let arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29];

        //Should shuffle copied array
        let shuffled = Objects.shuffle(arr, true);
        expect(shuffled).not.toEqual(comparisonArr, "Oops, you may have hit the one occurance where it shuffled back to normal. Try testing again.");

    });

    it("shuffle() should create copys of array if requested", function () {
        //Very unlikely this will shuffle back to normal
        const comparisonArr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29];
        let arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29];

        //Should shuffle copied array
        let shuffled = Objects.shuffle(arr, true);
        expect(arr).toEqual(comparisonArr);
        expect(shuffled).not.toEqual(comparisonArr, "Oops, you may have hit the one occurance where it shuffled back to normal. Try testing again.");

        //Should shuffle original array
        let shuffled2 = Objects.shuffle(arr, false);
        expect(arr).not.toEqual(comparisonArr);
        expect(shuffled2).toEqual(arr, "Oops, you may have hit the one occurance where it shuffled back to normal. Try testing again.");
    });

    it("shuffle() should return empty arrays", function () {
        expect(Objects.shuffle([], false)).toEqual([]);
    });

    it("shuffle() should return single element arrays", function () {
        expect(Objects.shuffle([1], false)).toEqual([1]);
    });

    it("subtract() should remove what is common between objects", function () {
        let obj1: any = { "a": true, "b": true, "c": true, "d": { "a": true, "b": true, "c": true }, "e": { "a": true }, "f": true }
        let obj2: any = { "a": true, "b": false, "d": { "a": true, "b": false }, "e": true, "f": { "a": true } }

        let output = { "c": true, "d": { "c": true } }

        expect(Objects.subtract(obj1, obj2)).toEqual(output);
    });

    it("subtract() should empty out arrays properly", function () {
        let obj1: any = [undefined, 0, 1, 2, 3, undefined];
        let obj2: any = { 1: true, 3: true };
        let output: any = [undefined, 1, 3, undefined]
        expect(Objects.subtract(obj1, obj2)).toEqual(output);
    });

    it("createPath() should create a path without deleting current contents", function () {
        let obj1: any = { "b": {} }
        let obj2: any = { "a": { "a": 0 }, "b": {} }
        let obj3: any = { "a": { "b": { "c": { "d": 0 } } } }

        let output1 = { "a": { "b": { "c": {} } }, "b": {} }
        let output2 = { "a": { "a": 0, "b": { "c": {} } }, "b": {} }
        let output3 = { "a": { "b": { "c": { "d": 0 } } } }

        Objects.createPath(obj1, "a", "b", "c")
        Objects.createPath(obj2, "a", "b", "c")
        Objects.createPath(obj3, "a", "b", "c")

        expect(obj1).toEqual(output1);
        expect(obj2).toEqual(output2);
        expect(obj3).toEqual(output3);
    });

});
