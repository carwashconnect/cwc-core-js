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

}