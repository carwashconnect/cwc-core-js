import { Objects } from "./Objects";
import { Dates } from "./Dates";

//The maximum auto balance set size for the load balancer 
//Allows for 67,108,864 elements to be load balanced
const MAX_SET_SIZE: number = 8192;

export class Promises {

    // Asynchronously executes all promises but doesn't stop due to errors
    static all(promises: Promise<any>[], debug: boolean = true): Promise<any[]> {
        return Promise.all(
            promises.map(p => p.catch(error => {
                if (debug) console.error("Promises.all() exception:", error);
                return null;
            }))
        )
    }

    //Sequence promises
    static sequence(promises: Promise<any>[], ignoreErrors: boolean = false): Promise<any[]> {
        return new Promise((resolve, reject) => {

            let i: number = 0;
            let promiseResults: any[] = [];
            let executePromise: () => void = () => {
                if (promises[i]) {
                    promises[i].then((data: any) => {
                        promiseResults.push(data)
                        i++;
                        executePromise();
                    }).catch((error: any) => {
                        if (!ignoreErrors) reject(error);
                        else {
                            promiseResults.push(null)
                            i++;
                            executePromise();
                        };
                    });
                } else resolve(promiseResults);
            }

            executePromise();

        })
    }

    /**
     * A load balancer used to synchronously execute sets of asynchronous promises.
     * @param {LoadBalancerItem[]} promiseList A list of functions and arguments that can be used to generate the promise.
     * @param {LoadBalancerOptions} options Options for the load balancer.
     * @returns {Promise<any[]>} The responses from the promises.
     */
    static async loadBalancer<Output, Input>(promiseList: LoadBalancerItem<Output, Input>[], options: LoadBalancerOptions = {}): Promise<LoadBalancerOutputItem<Output>[]> {
        //Set the default options
        if ("undefined" == typeof options.autoBalance) options.autoBalance = true;
        if ("undefined" == typeof options.shuffle) options.shuffle = false;
        if ("undefined" == typeof options.verbose) options.verbose = true;
        if ("undefined" == typeof options.offset) options.offset = 2;
        else options.offset = Math.abs(options.offset)
        if ("undefined" != typeof options.setSize) options.setSize = Math.abs(options.setSize);
        if ("undefined" != typeof options.timeout) options.timeout = Math.abs(options.timeout);

        //Create a copy of the list
        let promiseListCopy: LoadBalancerItem[] = Objects.copy(promiseList);

        //If shuffle is enabled
        if (options.shuffle) {

            //Index the entries so the response can be reordered
            for (let i in promiseListCopy) {
                if ("undefined" == typeof promiseListCopy[i].index)
                    promiseListCopy[i].index = Number(i);
            }

            //Shuffle the original
            //A copy was already made so additional copies aren't necessary
            Objects.shuffle(promiseListCopy, false);

        }

        //Prepare the responses
        let promiseResponses: LoadBalancerOutputItem<Output>[] = [];


        //Sort the promises into sets
        let promiseSets: LoadBalancerItem<Output, Input>[][] = [];
        let setSize: number = 1;
        if (options.setSize) {

            //Separate the promise list into sets
            setSize = options.setSize
            while (promiseListCopy.length) {
                promiseSets.push(promiseListCopy.splice(0, setSize))
            }

        } else {
            if (options.autoBalance) {

                //Find the number where the square just exceeds the list length
                //This is probably faster than finding the square root & Math.ceil
                setSize = 1;
                while (setSize * setSize < promiseListCopy.length || MAX_SET_SIZE <= setSize) {
                    setSize++;
                }

                //Separate the promise list into sets
                while (promiseListCopy.length) {
                    promiseSets.push(promiseListCopy.splice(0, setSize))
                }

            } else {
                return Promise.reject(Error("Load balancer requires either 'autoBalance' enabled or a positive integer 'setSize' to function."))
            }
        }

        //Log the breakdown
        if (options.verbose) console.log(`Starting load balancing - set size: ${setSize}, iterations: ${promiseSets.length}${"undefined" != typeof options.timeout ? `, timeout: ${Dates.toCountdown(options.timeout)}` : ``}`)

        //Set values to keep track of execution duration
        let maxSetTimes: number[] = [];
        let sum: (accumulator: number, currentValue: number) => number = (accumulator: number, currentValue: number) => accumulator + currentValue;
        let totalExecutionTime: number = 0;
        let averageExecutionTime: number = 0;
        let isTimedOut: boolean = false;

        //Loop through the sets
        for (let i in promiseSets) {
            //Copy the index and the set
            let iIndex: number = Number(i) || 0;
            let set = promiseSets[i]

            //Prepare the promises
            let setPromises: Promise<LoadBalancerOutputItem<Output>>[] = [];
            for (let j in set) {

                //Check if the load has timed out
                if (!isTimedOut && options.timeout) isTimedOut = options.timeout <= totalExecutionTime + averageExecutionTime ? true : false;

                //If the timeout has been exceeded or the next set is expected to timeout resolve remaining promises
                if (isTimedOut) {
                    setPromises.push(Promise.resolve({
                        error: Error("Load balancer timeout exceeded."),
                        executionTime: 0,
                        index: set[j].index
                    }))
                    continue;
                }

                //Create a new promise to allow for the timing offset and error handling
                setPromises.push(new Promise(async (resolve, reject) => {

                    //Mark the start of the promise
                    let start: number = Date.now();

                    //Apply the offset to the promise
                    //Aids in generating unique ids
                    try {
                        let jIndex: number = Number(j) || 0;
                        if (options.offset) await Promises.wait(options.offset * jIndex)
                    } catch (e) { }

                    try {

                        //Run the promise
                        let result: Output = await set[j].func(...(set[j].args || []));

                        //Mark the end time
                        let end: number = Date.now();

                        //Respond to the promise
                        return resolve({
                            result: result,
                            executionTime: end - start,
                            index: set[j].index
                        })

                    } catch (e) {

                        //Mark the end time
                        let end: number = Date.now();

                        //Respond to the promise
                        return resolve({
                            error: e,
                            executionTime: end - start,
                            index: set[j].index
                        })

                    }

                }))
            }

            try {

                //Run the current set
                let setResponses: LoadBalancerOutputItem<Output>[] = await Promise.all(setPromises)

                //Add the responses to the response list
                promiseResponses.push(...setResponses)

                let maxSetTime: number = 0;

                //Check if the call is not timed out
                if (!isTimedOut) {

                    //Get the longest time from the set
                    for (let response of setResponses) {
                        maxSetTime = Math.max(maxSetTime, response.executionTime)
                    }
                    maxSetTimes.push(maxSetTime);

                    //Get the total and average execution time
                    totalExecutionTime = maxSetTimes.reduce(sum);
                    averageExecutionTime = Math.ceil(totalExecutionTime / (maxSetTimes.length || 1));

                }

                //Log the expected remaining time
                if (options.verbose) {
                    let remainingSets = promiseSets.length - iIndex;
                    let expectedDuration = averageExecutionTime * remainingSets;
                    if (!isTimedOut) {
                        if (remainingSets) {
                            console.log(`Set ${iIndex + 1} (${set.length} item${1 < set.length ? "s" : ""}) completed in ${Dates.toCountdown(maxSetTime)}. Estimated completion time for remaining ${remainingSets} set${1 < remainingSets ? "s" : ""}: ${Dates.toCountdown(expectedDuration)}.`)
                        } else {
                            console.log(`Set ${iIndex + 1} (${set.length} item${1 < set.length ? "s" : ""}) completed in ${Dates.toCountdown(maxSetTime)}.`)
                        }
                    } else {
                        console.log(`Set ${iIndex + 1} (${set.length} item${1 < set.length ? "s" : ""}) timed out.`)
                    }
                }

            } catch (e) {

                //Throw the error like you mean it
                throw e;

            }

        }

        //If shuffle is enabled
        if (options.shuffle) {

            //Resort the output array to match input array
            promiseResponses.sort((a, b) => {
                if ("undefined" == typeof a.index || "undefined" == typeof b.index) return 0
                if (a.index > b.index) return 1;
                if (a.index < b.index) return -1;
                return 0;
            })

        }
        return Promise.resolve(promiseResponses);

    }

    /**
     * Uses setTimeout to create a promise that can be used in tandem with await.
     * @param {number} ms The number of milliseconds to wait before a response.
     * @returns {Promise<void>}
     */
    static wait(ms: number): Promise<void> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                return resolve();
            }, ms)
        })
    }

}

/**
  *  A structure for storing promises without execution.
  */
export interface LoadBalancerItem<Output = any, Input = any> {

    /**
     *  A function which returns the promise to be executed.
     */
    func: (...args: Input[]) => Promise<Output>;

    /**
     *  Any arguments to be passed into the promise execution function.
     */
    args?: Input[];

    /**
     *  Original index of the item that is used in the case that the shuffle option is enabled to re-sort the array post completion.
     */
    index?: number | string;
}

export type LoadBalancerOutputItem<Output> = LoadBalancerOutputSuccessItem<Output> | LoadBalancerOutputFailureItem<Output>;

export interface LoadBalancerOutputSuccessItem<Output> extends LoadBalancerOutputGeneralItem<Output> {

    /**
     *  The result of the promise.
     */
    result: Output;

    /**
     *  A function which returns the promise to be executed.
     */
    error?: undefined;

}
export interface LoadBalancerOutputFailureItem<Output> extends LoadBalancerOutputGeneralItem<Output> {

    /**
     *  The result of the promise.
     */
    result?: undefined;

    /**
     *  A function which returns the promise to be executed.
     */
    error: any;

}
export interface LoadBalancerOutputGeneralItem<Output> {

    /**
     *  The duration of the request in ms.
     */
    executionTime: number;

    /**
     *  Original index of the item that is used in the case that the shuffle option is enabled to re-sort the array post completion.
     */
    index?: number | string;

}

/**
  *  Options for the Promises.loadBalancer function.
  */
export interface LoadBalancerOptions {

    /**
     *  If the load balancer should be responsible for balancing the promises. Attempts to have equal number of sets and items in sets. (Default: true)
     */
    autoBalance?: boolean;

    /**
     *  The number of milliseconds to delay promise executions within a set by. (Default: 2)
     */
    offset?: number;

    /**
     *  The size of the sets of promises to run simultaneously.
     */
    setSize?: number;

    /**
     *  If the load balancer should shuffle the execution list before execution. (Default: false)
     */
    shuffle?: boolean;

    /**
     *  When to resolve all the promises regardless of completion state. Will only be taken into account if there is more than one set / iteration.
     */
    timeout?: number

    /**
     *  If the load balancer should log the execution logs. (Default: true)
     */
    verbose?: boolean;

}