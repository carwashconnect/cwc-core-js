const CALLBACK_HELL_LIMIT: number = 32;
export class Objects {

    //Creates a copy of an object
    static copy(obj: any, cbh: number = 0): any {

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
    static deepSearch(obj: any, ...keys: string[]): boolean {

        // Return if not an object, null, or have exceeded the callback count
        if (!this.isObject(obj) || Array.isArray(obj)) return false;

        let currentLevel: any = obj;

        //Loop through all of the provided keys
        for (let key of keys) {

            //Check if the key is present in the current level
            if (key in currentLevel) {

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
    static merge(obj1: any, obj2: any, combineArrays: boolean = false, cbh: number = 0): any {

        //Create a copy of both object if we're at the top level
        let obj1Copy: any = cbh > 0 ? obj1 : this.copy(obj1);
        let obj2Copy: any = cbh > 0 ? obj2 : this.copy(obj2);

        // If the objects cannot be merged return the second
        if (!this.isObject(obj1Copy) || !this.isObject(obj2Copy) || cbh > CALLBACK_HELL_LIMIT) return obj2Copy;

        // Check if the second object is an array
        if (Array.isArray(obj2Copy)) {

            //Check if we're supposed to combine arrays and if the first object is also an array
            if (combineArrays && Array.isArray(obj1Copy)) {

                //Return the combined arrays
                return obj1Copy.concat(obj2Copy);

            }

            //Return the second object
            return obj2Copy;

        }

        // Loop through the keys in the second object
        for (let key in obj2Copy) {

            //Merge in all of the keys of object 2
            obj1Copy[key] = this.merge(obj1Copy[key], obj2Copy[key], combineArrays, cbh + 1);

        }

        //Return the first object with the second merged in
        return obj1Copy;

    }

    // Removes empty string from an object
    static trim(obj: any, cbh: number = 0): any {

        // Return if not an object, null, or have exceeded the callback count
        if (!this.isObject(obj) || cbh > CALLBACK_HELL_LIMIT) return obj;

        let returnObj: any;

        // Check if the input object is an array
        if (Array.isArray(obj)) {

            // Prepare an array to return
            returnObj = [];
            for (let i in obj) {
                if ("" !== obj[i]) returnObj.push(Objects.trim(obj[i], cbh + 1));
            }

        } else {

            // Prepare an object to return
            returnObj = {};
            for (let i in obj) {
                if ("" !== obj[i]) returnObj[i] = Objects.trim(obj[i], cbh + 1);
            }

        }

        return returnObj;
    }

    static compare(obj1: any, obj2: any, cbh: number = 0): { updates?: any, deletions?: any, additions?: any } {

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
                        changes.deletions = changes.deletions || {};
                        changes.deletions[key] = true;

                    }
                }

                //Loop through the keys of the second object
                for (let key of obj2Keys) {

                    //Check if the key is not shared
                    if (!commonKeys.includes(key)) {

                        //The property has been added
                        changes.additions = changes.additions || {};
                        changes.additions[key] = obj2[key];

                    }

                }


                //Loop through the common keys
                for (let key of commonKeys) {
                    let tempChanges: { updates?: any, deletions?: any, additions?: any } = Objects.compare(obj1[key], obj2[key], cbh + 1);

                    //Check if contained properties have been added
                    if (tempChanges.additions) {
                        changes.additions = changes.additions || {};
                        changes.additions[key] = tempChanges.additions;
                    }

                    //Check if contained properties have been deleted
                    if (tempChanges.deletions) {
                        changes.deletions = changes.deletions || {};
                        changes.deletions[key] = tempChanges.deletions;
                    }

                    //Check if contained properties have been updated
                    if (tempChanges.updates) {
                        changes.updates = changes.updates || {};
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

                //If they are the same return no change
                if (obj1 == obj2) return {};

                //If they are not the same type return the second object
                if (typeof obj1 != typeof obj2) return { "updates": obj2 };

                //TODO investigate extra logic here for arrays
                return { "updates": obj2 }

            }
        }
    }

}