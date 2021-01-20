# cwc-core-js

Core functions for the CWC system.

## Installation
```bash
npm i @carwashconnect/cwc-core-js
```

## Usage

### Dates

Reduces the work to convert between date formats.

#### toCountdown( time: Date | number | string ): string

Converts a number (ms) or date into a countdown format. ("#d #h #m #s")

```js
import { Dates } from '@carwashconnect/cwc-core-js'

let countDown1:string = Dates.toCountdown(750) // "1s"
let countDown2:string = Dates.toCountdown(3600000) // "1h 0m 0s"
let countDown3:string = Dates.toCountdown(90061000) // "1d 1h 1m 1s"
```

#### toISO( date: Date | number | string ): string

Converts a timestamp into an ISO date string.

```js
import { Dates } from '@carwashconnect/cwc-core-js'

let timeStamp:number = 1534264485715;
let isoDate:string = Dates.toISO(timeStamp) // "2018-08-14T16:34:45.715Z"
```

#### toTimeStamp( date: Date | number | string ): number

Converts an ISO date string into timeStamp.

```js
import { Dates } from '@carwashconnect/cwc-core-js'

let isoDate:string = "2018-08-14T16:34:45.715Z";
let timeStamp:number = Dates.toTimeStamp(isoDate) // 1534264485715
```

### Errors

#### awsErrorToIError( awsError ): IError

Converts AWS errors to my own format.

```js
import { Errors, IError } from '@carwashconnect/cwc-core-js'

let awsError = { 
    message: "My error message", 
    code: "MyErrorCode", 
    statusCode: 500, 
    retryable: false 
}

let myError:IError = Errors.awsErrorToIError(awsError); // { message: "My error message", code: "MyErrorCode", status: 500, dateCreated: "2018-08-14T16:34:45.715Z" }

```

#### stamp( error:IError ): IError

Fills in the dateCreated field of an IError.

```js
import { Errors, IError } from '@carwashconnect/cwc-core-js'

let iError = { 
    message: "My error message", 
    code: "MyErrorCode", 
    status: 500
}

let myError:IError = Errors.stamp(iError); // { message: "My error message", code: "MyErrorCode", status: 500, dateCreated: "2018-08-14T16:34:45.715Z" }
```

### Objects

Some quality of life functions for handling objects.

#### copy( obj:T ): T

Creates a copy of an object to prevent manipulation of the original.

```js
import { Objects } from '@carwashconnect/cwc-core-js'

let obj: any = {
    "a": "a",
    "b": 0,
    "c": null,
    "d": false
}

let newObj:any = Objects.copy(obj);  // { "a": "a", "b": 0, "c": null, "d": false }
```

#### deepSearch( obj:any, ...keys: string[] ): boolean

Check to see if an property exists at the specified path.

```js
import { Objects } from '@carwashconnect/cwc-core-js'

let obj: any = {
    "a": "a",
    "b": 0,
    "c": null,
    "d": false
}

let test1:boolean = Objects.deepSearch(obj,"d"); // true
let test2:boolean = Objects.deepSearch(obj,"d", "e"); // false
```

#### isObject( obj:any ): boolean

Evaluates if the input is an object or array (null is evaluated to false).

```js
import { Objects } from '@carwashconnect/cwc-core-js'

let test1:boolean = Objects.isObject({}); // true
let test2:boolean = Objects.isObject([]); // true
let test3:boolean = Objects.isObject(null); // false
let test4:boolean = Objects.isObject("Hello world!"); // false
let test5:boolean = Objects.isObject(1); // false
let test6:boolean = Objects.isObject(); // false
```

#### merge( obj1:any, obj2:any, combineArrays?:boolean ): any

Copies the first object and overwrites properties with the properties from the second object.

```js
import { Objects } from '@carwashconnect/cwc-core-js'

let obj1:any = { "a":["hello"], "b":", " };
let obj2:any = { "a":["world"], "c":["!"]};

let newObj1:any = Objects.merge(obj1, obj2) // { "a":["world"], "b":", ", "c":["!"] } 
let newObj2:any = Objects.merge(obj1, obj2, true) // { "a":["hello", "world"], "b":", ", "c":["!"] } 
```

#### shuffle( arr:T[], createCopy?: boolean ): T[]

Shuffles an array based on Fisher-Yates (aka Knuth) shuffle.

```js
import { Objects } from '@carwashconnect/cwc-core-js'

let arr: number[] = [0, 1, 2, 3, 4, 5]

let arrCopy:number[] = Objects.shuffle(arr); 
console.log(arrCopy) // [1, 4, 0, 2, 5, 3]
console.log(arr) // [0, 1, 2, 3, 4, 5]

Objects.shuffle(arr); 
console.log(arr) // [3, 0, 4, 1, 5, 2]
```

#### trim( obj:any ): any

Removes empty string elements from the object.

```js
import { Objects } from '@carwashconnect/cwc-core-js'

let obj:any = { "a":["hello"], "b":"" };

obj = Objects.trim(obj) // { "a":["world"] } 
```

### Promises

Some quality of life functions for handling promises.

#### all( promises:Promise<any>[] ): Promise<any[]>

Executes all promises in an array at the same time and does not stop due to errors.

```js
import { Promises } from '@carwashconnect/cwc-core-js'

let promise1 = Promise.resolve(3);
let promise2 = 42;
let promise3 = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, 'foo');
});
let promise4 = Promise.reject("Error");

Promises.all([promise1, promise2, promise3, promise4])
    .then((values) => {
        // [3, 42, "foo", null]
    });
    .catch(error => {
        // We shouldn't hit this
    })
```

#### sequence( promises:Promise<any>[], ignoreErrors?:boolean ): Promise<any[]>

Executes all promises in an array in order.

```js
import { Promises } from '@carwashconnect/cwc-core-js'

let promise1 = Promise.resolve(3);
let promise2 = 42;
let promise3 = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, 'foo');
});
let promise4 = Promise.reject("Error");

//Executes the promises, stops when it hits an error
Promises.sequence([promise1, promise2, promise3, promise4])
    .then((values) => {
        // We shouldn't hit this
    });
    .catch(error => {
        // "Error"
    })

//Executes the promises while ignoring errors
Promises.sequence([promise1, promise2, promise3, promise4], true)
    .then((values) => {
        // [3, 42, "foo", null]
    });
    .catch(error => {
        // We shouldn't hit this
    })
```

#### loadBalancer( promiseList:LoadBalancerItem<T>[], options?: LoadBalancerOptions ): Promise<LoadBalancerOutputItem<T>[]>

A load balancer used to synchronously execute sets of asynchronous promises. Groups promises into sets and executes each set sequentially; promises within sets are executed asynchonously.

```js
import { Promises } from '@carwashconnect/cwc-core-js'

let options = {
    autoBalance: false, // Lets the load balancer evaluate the set size. Overwritten by 'setSize'. (Default: true)
    offset: 2, // Stacking delay (ms) to wait before executing a promise within a set. (Default: 2)
    setSize: 2, // The static size of each promise set.
    shuffle: true, // If the load balancer should shuffle the promises before execution. Does not affect order of output array. (Default: false)
    timeout: 5000, // Time (ms) the load balancer will attempt to not exceed for all promise executions.
    verbose: false // If the load balancer should log to the console. (Default: true)
}

let promises = [
    {func: (waitTime) => Promises.wait(waitTime).then(() => 2), args:[1000]},
    {func: (waitTime) => Promises.wait(waitTime).then(() => 4), args:[1000]},
    {func: () => Promises.wait(1000).then(() => 8)},
    {func: () => Promises.wait(1000).then(() => 16)},
]
Promises.loadBalancer(promises, options)
    .then((results) => {
        // ~2 seconds have passed 
        console.log(results) 
        // [
        //     { executionTime:1000, index: 0, result: 2 },
        //     { executionTime:1002, index: 1, result: 4 },
        //     { executionTime:1000, index: 2, result: 8 },
        //     { executionTime:1002, index: 3, result: 16 },
        // ]
    });
    .catch(error => {
        // We shouldn't hit this
    })
```

#### wait( ms:number ): Promise<void>

Waits for the specified time then returns a successful promise.

```js
import { Promises } from '@carwashconnect/cwc-core-js'

Promises.wait(3000)
    .then(() => {
        // 3 seconds have passed
    });
    .catch(error => {
        // We shouldn't hit this
    })
```

### Validator

Used to validate unknown objects.

#### ValidationLimits
```js
import { Validator, ValidationLimits } from '@carwashconnect/cwc-core-js'

let limit:ValidationLimits = {

    validationType: ["string", "null"], //What type/s the property is allowed to have 
    // Available types: array, boolean, email, token, null, number, phone, object, string, undefined, isodate

    required: true, // If the property is required to be present in order to pass validation

    max: 5, // The max value allowed for the property (Only certain types)

    min: 0, // The min value allowed for the property (Only certain types)

    maxLength: 5,  // The max length allowed for the property (Only certain types)
    
    minLength: 1 // The min length allowed for the property (Only certain types)

}
```

#### validate( obj:any, structure:ValidationLimits | ValidationStructure | ValidationStructure[] ): Promise<any>

Validates an object with an unknown structure. If expected properties match returns and object without unexpected properties. Will go as deep as the structure defines.

```js
import { Validator, ValidationLimits, ValidationStructure } from '@carwashconnect/cwc-core-js'

let validator = new Validator();


//Known structure
let expectedStructure1:ValidationStructure = {
    "a": { validationType: ["number"], required:true },
    "b": { validationType: ["object"] },
    "c": { validationType: ["string"] },
    "d": { validationType: ["string"] }
}

let obj1:any = {
    "a": 0,
    "b": {},
    "c": "Hello world!",
    "e": "Extra data"
}

validator.validate(obj1, expectedStructure1)
    .then((newObj1:any) => {
        // {
        //     "a": 0,
        //     "b": {},
        //     "c": "Hello world!"
        // }
    })
    .catch((error:IError[]) => {
        //We shouldn't hit this
    })


//Unknown structure where elements are the same types (Array or Object)
let expectedStructure2:ValidationLimits[] = [{
    validationType:["string"],
    required:true // Will result in a failed validation if any property of the object doesn't meet the limits
}]

let obj2:any = ["hello","world"]

validator.validate(obj1, expectedStructure1)
    .then((newObj1:any) => {
        // ["hello","world"]
    })
    .catch((error:IError[]) => {
        //We shouldn't hit this
    })
```