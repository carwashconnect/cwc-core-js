import { Objects } from "./Objects";

describe("Objects", function () {

    it("trim() should remove empty strings from an object", function () {
        let objInput: { [key: string]: any } = { "a": 0, "b": "", "c": { "d": "world", "e": "" } };
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

    it("deepSearch() should return non-objects", function () {
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

        expect(comparison).toEqual(output);

    });

});
