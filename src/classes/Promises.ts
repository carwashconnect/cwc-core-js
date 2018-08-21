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
}