const CALLBACK_HELL_LIMIT: number = 32;
export class Objects {

    //Creates a copy of an object
    static copy<T>(obj: T, cbh: number = 0): T {

        // Return if not an object, null, or have exceeded the callback count
        if (!this.isObject(obj) || cbh > CALLBACK_HELL_LIMIT) return obj;

        // Initialize the copy
        let copy: any;

        //Check if the object is an array
        if (Array.isArray(obj)) {

            //Prepare an array copy
            copy = [];
            for (let i in obj) {
                copy.push(this.copy(obj[i], cbh + 1))
            }

        } else {

            //Prepare an object copy
            copy = {};
            for (let key in obj) {
                copy[key] = this.copy(obj[key], cbh + 1)
            }

        }

        return copy;
    }

    // Evaluates if a property is present deep in an object
    static deepSearch(obj: any, ...keys: (string | number)[]): boolean {

        // Return if not an object, null, or have exceeded the callback count
        if (!this.isObject(obj)) return false;

        let currentLevel: any = obj;

        //Loop through all of the provided keys
        for (let key of keys) {

            //Check if the key is present in the current level
            if ((Objects.isObject(currentLevel) || Array.isArray(currentLevel)) && key in currentLevel) {

                // Undefined does not count as something, come on JavaScript...
                if ("undefined" == typeof currentLevel[key]) return false;

                // Copy the new level to the current level
                currentLevel = currentLevel[key];

            } else return false;

        }

        return true;
    }

    // Returns true if the input is an array or object, exluding null
    static isObject(obj: any): boolean {
        return "object" != typeof obj || null == obj ? false : true;
    }

    // Merges two objects together
    static merge<T, K>(obj1: T, obj2: K, combineArrays: boolean = false, cbh: number = 0): T & K {

        //Create a copy of both object if we're at the top level
        let obj1Copy: T & K = <T & K><unknown>(cbh > 0 ? obj1 : this.copy(obj1));
        let obj2Copy: K = cbh > 0 ? obj2 : this.copy(obj2);

        // If the objects cannot be merged return the second
        if (!this.isObject(obj1Copy) || !this.isObject(obj2Copy) || cbh > CALLBACK_HELL_LIMIT) return <T & K><unknown>obj2Copy;

        // Check if the second object is an array
        if (Array.isArray(obj2Copy)) {

            //Check if we're supposed to combine arrays and if the first object is also an array
            if (combineArrays && Array.isArray(obj1Copy)) {

                //Return the combined arrays
                return <T & K><unknown>obj1Copy.concat(obj2Copy);

            }

            //Return the second object
            return <T & K><unknown>obj2Copy;

        }

        // Loop through the keys in the second object
        for (let key in obj2Copy) {

            //Merge in all of the keys of object 2
            obj1Copy[key] = this.merge(obj1Copy[key], obj2Copy[key], combineArrays, cbh + 1);

        }

        //Return the first object with the second merged in
        return <T & K><unknown>obj1Copy;

    }

    // Removes empty string from an object
    static trim<T>(obj: T, cbh: number = 0): Partial<T> {

        // Return if not an object, null, or have exceeded the callback count
        if (!this.isObject(obj) || cbh > CALLBACK_HELL_LIMIT) return obj;

        let returnObj: any;

        // Check if the input object is an array
        if (Array.isArray(obj)) {

            // Prepare an array to return
            returnObj = [];
            for (let i in obj) {
                if ("" !== obj[i] && "undefined" !== typeof obj[i]) returnObj.push(Objects.trim(obj[i], cbh + 1));
            }

        } else {

            // Prepare an object to return
            returnObj = {};
            for (let i in obj) {
                if ("" !== <unknown>obj[i] && "undefined" !== typeof obj[i]) returnObj[i] = Objects.trim(obj[i], cbh + 1);
            }

        }

        return returnObj;
    }

    // Returns the differences between the two objects
    static compare<T extends Record<any, any>, K extends Record<any, any>>(obj1: T, obj2: K, cbh: number = 0): { updates?: Record<keyof Partial<T & K>, any>, deletions?: Record<keyof Partial<T & K>, any>, additions?: Record<keyof Partial<T & K>, any> } {

        //Check if we've exceeded the call back limit
        if (cbh > CALLBACK_HELL_LIMIT) return {};

        //Check if the first input is an object
        if (Objects.isObject(obj1)) {

            //Check if the second input is an object
            if (Objects.isObject(obj2)) {
                let changes: { updates?: any, deletions?: any, additions?: any } = {};

                let obj1Keys: string[] = Object.keys(obj1);
                let obj2Keys: string[] = Object.keys(obj2);
                let commonKeys: string[] = [];

                //Loop through the keys of the first object
                for (let key of obj1Keys) {

                    //Check if the second object has the key
                    if (obj2Keys.includes(key)) {
                        commonKeys.push(key)
                    } else {

                        //The property has been removed
                        changes.deletions = "undefined" != typeof changes.deletions ? changes.deletions : {};
                        changes.deletions[key] = true;

                    }
                }

                //Loop through the keys of the second object
                for (let key of obj2Keys) {

                    //Check if the key is not shared
                    if (!commonKeys.includes(key)) {

                        //The property has been added
                        changes.additions = "undefined" != typeof changes.additions ? changes.additions : {};
                        changes.additions[key] = obj2[key];

                    }

                }


                //Loop through the common keys
                for (let key of commonKeys) {
                    let tempChanges: { updates?: any, deletions?: any, additions?: any } = Objects.compare(obj1[key], obj2[key], cbh + 1);

                    //Check if contained properties have been added
                    if ("undefined" != typeof tempChanges.additions) {
                        changes.additions = "undefined" != typeof changes.additions ? changes.additions : {};
                        changes.additions[key] = tempChanges.additions;
                    }

                    //Check if contained properties have been deleted
                    if ("undefined" != typeof tempChanges.deletions) {
                        changes.deletions = "undefined" != typeof changes.deletions ? changes.deletions : {};
                        changes.deletions[key] = tempChanges.deletions;
                    }

                    //Check if contained properties have been updated
                    if ("undefined" != typeof tempChanges.updates) {
                        changes.updates = "undefined" != typeof changes.updates ? changes.updates : {};
                        changes.updates[key] = tempChanges.updates;
                    }

                }

                //Return all the changes
                return changes;

            } else {

                //Return the second input as the entire first input has changed
                return { "updates": obj2 }

            }

        } else {

            //Check if the second input is an object
            if (Objects.isObject(obj2)) {

                //Return the second input as the entire first input has changed
                return { "updates": obj2 };

            } else {

                //If they are not the same type return the second object
                if (typeof obj1 != typeof obj2) return { "updates": obj2 };

                //If they are the same return no change
                if (obj1 == obj2) return {};

                //TODO investigate extra logic here for arrays
                return { "updates": obj2 }

            }
        }
    }

    // Returns fields that appear in both objects
    static intersect(obj1: any, obj2: any, options: IIntersectOptions = { cbh: 0, onlyMatchingFields: true }): IGenericObject | undefined {

        //Set default options
        options.cbh = options.cbh || 0;
        options.onlyMatchingFields = "undefined" != typeof options.onlyMatchingFields ? options.onlyMatchingFields : true;

        //Ensure we're not in callback hell
        if (CALLBACK_HELL_LIMIT < options.cbh || 0) return undefined;

        //Ensure that both objects are objects
        if (!Objects.isObject(obj1) || !Objects.isObject(obj2)) return undefined;

        //Copy the objects on entry
        let obj1Copy: any = 0 == options.cbh ? Objects.copy(obj1) : obj1;
        let obj2Copy: any = 0 == options.cbh ? Objects.copy(obj2) : obj2;

        let intersectedObject: IGenericObject = {};

        //Loop through the first object's keys
        for (let key in obj1Copy) {

            //Check if the key isn't defined in the second object
            if ("undefined" == typeof obj2Copy[key]) continue;

            //Check if we have to delve deeper
            if (Objects.isObject(obj1Copy[key]) && Objects.isObject(obj2Copy[key])) {

                //Add to the callback counter
                let optionCopy: IIntersectOptions = Objects.copy(options);
                optionCopy.cbh = (optionCopy.cbh || 0) + 1;

                //Copy over the object's value intersect
                intersectedObject[key] = Objects.intersect(obj1Copy[key], obj2Copy[key], optionCopy)

            } else {

                //Check if we're only returning matching fields
                if (options.onlyMatchingFields) {

                    //Copy over the object's value if the values match
                    if (obj1Copy[key] === obj2Copy[key]) intersectedObject[key] = obj1Copy[key]

                } else {

                    //Copy over the object's value
                    intersectedObject[key] = obj1Copy[key]

                }

            }

        }

        return intersectedObject;

    }

    /**
     * Shuffles an array (Fisher-Yates (aka Knuth) Shuffle).
     * See: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
     * @param {any[]} arr The array to be shuffled.
     * @param {boolean} createCopy If a copy of the array and contents should be created before shuffling. (Default: true)
     * @returns {any[]} The shuffled array.
     */
    static shuffle<T>(arr: T[], createCopy: boolean = true): T[] {
        let tempArr: any[] = createCopy ? Objects.copy(arr) : arr;
        let currentIndex = tempArr.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = tempArr[currentIndex];
            tempArr[currentIndex] = tempArr[randomIndex];
            tempArr[randomIndex] = temporaryValue;
        }

        return tempArr;
    }

    // Subtract the fields in the second object from the first object
    static subtract(obj1: any, obj2: any, options: ISubtractOptions = { cbh: 0 }): IGenericObject {

        //Set default options
        options.cbh = options.cbh || 0;

        //Ensure we're not in callback hell
        if (CALLBACK_HELL_LIMIT < options.cbh || 0) return {};

        //Ensure that both objects are objects
        if (!Objects.isObject(obj1) || !Objects.isObject(obj2)) return {};

        //Copy the objects on entry
        let obj1Copy: any = 0 == options.cbh ? Objects.copy(obj1) : obj1;
        let obj2Copy: any = 0 == options.cbh ? Objects.copy(obj2) : obj2;

        //Loop through the keys in the second object
        for (let key in obj2Copy) {

            //Ensure the key exists in the first object
            if ("undefined" == typeof obj1Copy[key]) continue;

            //Check if both fields are objects
            if (Objects.isObject(obj1Copy[key]) && Objects.isObject(obj2Copy[key])) {

                //Add to the callback counter
                let optionCopy: ISubtractOptions = Objects.copy(options);
                optionCopy.cbh = (optionCopy.cbh || 0) + 1;

                //Copy over the object's value intersect
                obj1Copy[key] = Objects.subtract(obj1Copy[key], obj2Copy[key], optionCopy)

            } else {

                //Remove the field from the object
                delete obj1Copy[key]

            }

        }

        //Handle undefined being left in arrays
        if (Array.isArray(obj1Copy)) {
            let deletedKeys = Object.keys(obj2Copy).sort();
            let offset = 0;
            for (let key of deletedKeys) {

                //Ensure the key is a number
                if (isNaN(Number(key))) continue;

                //Handle any previously removed elements
                let index = Number(key) - offset

                //Skip if the element isn't deleted
                if (Objects.isObject(obj1Copy[index]) && Objects.isObject(obj2Copy[key])) continue;

                //Remove the element
                obj1Copy.splice(index, 1);

                //Increase the offset
                offset++;
            }
        }

        return obj1Copy
    }

    //Creates a given path in an object safely
    static createPath(obj: IGenericObject, ...keys: string[]): IGenericObject {

        // Return if not an object, null, or have exceeded the callback count
        if (!this.isObject(obj) || Array.isArray(obj)) return obj;

        //Reverse the keys
        let currentLevel: IGenericObject = obj;

        //Loop through all of the provided keys
        for (let key of keys) {

            //Create the path if it doesn't exist
            currentLevel[key] = currentLevel[key] || {};

            //Copy the next level into the current level
            currentLevel = currentLevel[key];

        }

        //Return the object
        return obj;

    }

}

export interface IGenericObject {
    [key: string]: any
}

export interface IGeneralObjectOptions {
    cbh?: number;
}
export interface IIntersectOptions extends IGeneralObjectOptions {
    onlyMatchingFields?: boolean;
}

export interface ISubtractOptions extends IGeneralObjectOptions { }