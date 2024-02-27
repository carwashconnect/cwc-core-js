import "jasmine";
import { Promises, LoadBalancerItem } from "./Promises";

describe("Promises", function () {

    //Update timeout so promises can be tested adequately
    const JASMINE_TIMEOUT: number = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;
    });
    afterEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = JASMINE_TIMEOUT;
    });

    it("all() should execute all promises at the same time and always return an array", async () => {
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

        const output = await Promises.all(promises, false)
        expect(output).toEqual(promisesResult);
    });

    it("sequence() should execute promises in a sequence", async () => {

        //Inputs
        let promises1: Promise<any>[] = [Promise.resolve("Hello"), Promise.resolve(true), Promise.resolve(0), Promise.resolve(["a"]), Promise.reject("My error here")]
        let promises2: Promise<any>[] = [Promise.resolve("Hello"), Promise.resolve(true), Promise.resolve(0), Promise.resolve(["a"]), Promise.reject("My error here")]

        //Ouputs
        let promisesResult: any[] = ["Hello", true, 0, ["a"], null]

        //Empty input
        const output1 = await Promises.sequence([])
        expect(output1).toEqual([]);

        // Failing on catch 
        let error = "";
        const output2 = await Promises.sequence(promises1).catch((err) => error = err)
        expect(error).toEqual("My error here");

        //Succeeding on catch
        const output3 = await Promises.sequence(promises2, true)
        expect(output3).toEqual(promisesResult);

    });

    it("wait() should wait some time before completing", async () => {

        const waitTime = 2000;
        const marginOfError = 40;

        //Get the before and after timestamp
        let before = Date.now();
        await Promises.wait(waitTime)
        let after = Date.now();

        //Check the time to see if its within the acceptable margin
        expect(Math.round(waitTime / marginOfError)).toEqual(Math.round((after - before) / marginOfError));

    });

    it("loadBalancer() resolve basic promises", async () => {

        //Ensure it works with an empty array
        let responses1 = await Promises.loadBalancer([], { verbose: false })
        expect(responses1).toEqual([]);

        //Ensure it can handle a basic promise
        let responses2 = await Promises.loadBalancer([{
            func: () => { return Promise.resolve(0) }
        }], { verbose: false })
        expect(responses2[0].result).toEqual(0);
        expect(responses2[0].executionTime).toBeGreaterThanOrEqual(0);

        //Ensure it can handle a basic promise with passed arguments
        let responses3 = await Promises.loadBalancer([{
            func: (str: string) => { return Promise.resolve(str) },
            args: ["Hello world!"]
        }], { verbose: false })
        expect(responses3[0].result).toEqual("Hello world!");
        expect(responses3[0].executionTime).toBeGreaterThanOrEqual(0);

        //Ensure it can handle a basic failed promise
        let responses4 = await Promises.loadBalancer([{
            func: () => { return Promise.reject("Failure no arguments") }
        }], { verbose: false })
        expect(responses4[0].error).toEqual("Failure no arguments");
        expect(responses4[0].executionTime).toBeGreaterThanOrEqual(0);


        //Ensure it can handle a basic failed promise with passed arguments
        let responses5 = await Promises.loadBalancer([{
            func: (err: string) => { return Promise.reject(err) },
            args: ["Failure with arguments"]
        }], { verbose: false })
        expect(responses5[0].error).toEqual("Failure with arguments");
        expect(responses5[0].executionTime).toBeGreaterThanOrEqual(0);

    });

    it("loadBalancer() to halt if timeout is going to be exceeded", async () => {

        const WAIT_TIME: number = 1000;
        //Prepare the promises
        let timedPromises: LoadBalancerItem[] = [
            { func: () => { return Promises.wait(WAIT_TIME).then(() => 1) } },
            { func: () => { return Promises.wait(WAIT_TIME).then(() => 2) } },
            { func: () => { return Promises.wait(WAIT_TIME).then(() => 3) } }
        ]

        //Ensure it can function without timing out
        let responses1 = await Promises.loadBalancer(timedPromises, { setSize: 1, timeout: WAIT_TIME * 4, verbose: false })
        expect(responses1[0].result).toEqual(1);
        expect(responses1[0].executionTime).toBeGreaterThanOrEqual(WAIT_TIME);
        expect(responses1[1].result).toEqual(2);
        expect(responses1[1].executionTime).toBeGreaterThanOrEqual(WAIT_TIME);
        expect(responses1[2].result).toEqual(3);
        expect(responses1[2].executionTime).toBeGreaterThanOrEqual(WAIT_TIME);

        //Ensure it can timeout when it is supposed to
        let responses2 = await Promises.loadBalancer(timedPromises, { setSize: 1, timeout: WAIT_TIME * 1.5, verbose: false })
        expect(responses2[0].result).toEqual(1);
        expect(responses2[0].executionTime).toBeGreaterThanOrEqual(WAIT_TIME);
        expect(responses2[1].error).not.toBeUndefined();
        expect(responses2[1].executionTime).toBeGreaterThanOrEqual(0);
        expect(responses2[2].error).not.toBeUndefined();
        expect(responses2[2].executionTime).toBeGreaterThanOrEqual(0);


        //Prepare the promises
        let timedPromises2: LoadBalancerItem[] = [
            { func: () => { return Promises.wait(WAIT_TIME).then(() => 1) } },
            { func: () => { return Promises.wait(WAIT_TIME).then(() => 2) } },
            { func: () => { return Promises.wait(WAIT_TIME).then(() => 3) } },
            { func: () => { return Promises.wait(WAIT_TIME).then(() => 4) } },
            { func: () => { return Promises.wait(WAIT_TIME).then(() => 5) } },
            { func: () => { return Promises.wait(WAIT_TIME).then(() => 6) } }
        ]

        //Ensure it can timeout when there are multiple items in a set
        let responses3 = await Promises.loadBalancer(timedPromises2, { setSize: 3, timeout: WAIT_TIME * 1.5, verbose: false })

        //Successes
        expect(responses3[0].result).toEqual(1);
        expect(responses3[0].executionTime).toBeGreaterThanOrEqual(WAIT_TIME);
        expect(responses3[1].result).toEqual(2);
        expect(responses3[1].executionTime).toBeGreaterThanOrEqual(WAIT_TIME);
        expect(responses3[2].result).toEqual(3);
        expect(responses3[2].executionTime).toBeGreaterThanOrEqual(WAIT_TIME);

        //Errors
        expect(responses3[3].error).not.toBeUndefined();
        expect(responses3[3].executionTime).toBeGreaterThanOrEqual(0);
        expect(responses3[4].error).not.toBeUndefined();
        expect(responses3[4].executionTime).toBeGreaterThanOrEqual(0);
        expect(responses3[5].error).not.toBeUndefined();
        expect(responses3[5].executionTime).toBeGreaterThanOrEqual(0);

    });

    it("loadBalancer() auto balancer creates square sets", async () => {

        const WAIT_TIME: number = 100;
        //Prepare the promises
        let timedPromises: LoadBalancerItem[] = [
            { func: () => { return Promises.wait(WAIT_TIME).then(() => 1) } },
            { func: () => { return Promises.wait(WAIT_TIME).then(() => 2) } },
            { func: () => { return Promises.wait(WAIT_TIME).then(() => 3) } },
            { func: () => { return Promises.wait(WAIT_TIME).then(() => 4) } },
            { func: () => { return Promises.wait(WAIT_TIME).then(() => 5) } },
            { func: () => { return Promises.wait(WAIT_TIME).then(() => 6) } },
            { func: () => { return Promises.wait(WAIT_TIME).then(() => 7) } },
            { func: () => { return Promises.wait(WAIT_TIME).then(() => 8) } },
            { func: () => { return Promises.wait(WAIT_TIME).then(() => 9) } },
            { func: () => { return Promises.wait(WAIT_TIME).then(() => 10) } }
        ]

        //4x4
        let responses1 = await Promises.loadBalancer(timedPromises, { timeout: (WAIT_TIME * 2.5) + 20, verbose: true })
        expect(responses1[0].result).toEqual(1);
        expect(responses1[0].executionTime).toBeGreaterThanOrEqual(WAIT_TIME);
        expect(responses1[1].result).toEqual(2);
        expect(responses1[1].executionTime).toBeGreaterThanOrEqual(WAIT_TIME);
        expect(responses1[2].result).toEqual(3);
        expect(responses1[2].executionTime).toBeGreaterThanOrEqual(WAIT_TIME);
        expect(responses1[3].result).toEqual(4);
        expect(responses1[3].executionTime).toBeGreaterThanOrEqual(WAIT_TIME);
        expect(responses1[4].result).toEqual(5);
        expect(responses1[4].executionTime).toBeGreaterThanOrEqual(WAIT_TIME);
        expect(responses1[5].result).toEqual(6);
        expect(responses1[5].executionTime).toBeGreaterThanOrEqual(WAIT_TIME);
        expect(responses1[6].result).toEqual(7);
        expect(responses1[6].executionTime).toBeGreaterThanOrEqual(WAIT_TIME);
        expect(responses1[7].result).toEqual(8);
        expect(responses1[7].executionTime).toBeGreaterThanOrEqual(WAIT_TIME);
        expect(responses1[8].error).not.toBeUndefined();
        expect(responses1[8].executionTime).toBeGreaterThanOrEqual(0);
        expect(responses1[9].error).not.toBeUndefined();
        expect(responses1[9].executionTime).toBeGreaterThanOrEqual(0);

        //3x3
        let responses2 = await Promises.loadBalancer(timedPromises.slice(0, 5), { timeout: WAIT_TIME + 20, verbose: true })
        expect(responses2[0].result).toEqual(1);
        expect(responses2[0].executionTime).toBeGreaterThanOrEqual(WAIT_TIME);
        expect(responses2[1].result).toEqual(2);
        expect(responses2[1].executionTime).toBeGreaterThanOrEqual(WAIT_TIME);
        expect(responses2[2].result).toEqual(3);
        expect(responses2[2].executionTime).toBeGreaterThanOrEqual(WAIT_TIME);
        expect(responses2[3].error).not.toBeUndefined();
        expect(responses2[3].executionTime).toBeGreaterThanOrEqual(0);
        expect(responses2[4].error).not.toBeUndefined();
        expect(responses2[4].executionTime).toBeGreaterThanOrEqual(0);

        //2x2
        let responses3 = await Promises.loadBalancer(timedPromises.slice(0, 3), { timeout: WAIT_TIME + 20, verbose: false })
        expect(responses3[0].result).toEqual(1);
        expect(responses3[0].executionTime).toBeGreaterThanOrEqual(WAIT_TIME);
        expect(responses3[1].result).toEqual(2);
        expect(responses3[1].executionTime).toBeGreaterThanOrEqual(WAIT_TIME);
        expect(responses3[2].error).not.toBeUndefined();
        expect(responses3[2].executionTime).toBeGreaterThanOrEqual(0);

    });

    it("loadBalancer() shuffle should not impact result order", async () => {

        const WAIT_TIME: number = 100;
        //Prepare the promises
        let timedPromises: LoadBalancerItem[] = [
            { func: () => { return Promises.wait(WAIT_TIME).then(() => 1) } },
            { func: () => { return Promises.wait(WAIT_TIME).then(() => 2) } },
            { func: () => { return Promises.wait(WAIT_TIME).then(() => 3) } },
            { func: () => { return Promises.wait(WAIT_TIME).then(() => 4) } },
            { func: () => { return Promises.wait(WAIT_TIME).then(() => 5) } },
            { func: () => { return Promises.wait(WAIT_TIME).then(() => 6) } },
            { func: () => { return Promises.wait(WAIT_TIME).then(() => 7) } },
            { func: () => { return Promises.wait(WAIT_TIME).then(() => 8) } },
            { func: () => { return Promises.wait(WAIT_TIME).then(() => 9) } },
            { func: () => { return Promises.wait(WAIT_TIME).then(() => 10) } }
        ]

        //Shuffle test
        let responses1 = await Promises.loadBalancer(timedPromises.slice(0, 4), { shuffle: true, verbose: false })
        expect(responses1[0].result).toEqual(1);
        expect(Number(responses1[0].index)).toEqual(0);
        expect(responses1[0].executionTime).toBeGreaterThanOrEqual(WAIT_TIME);
        expect(responses1[1].result).toEqual(2);
        expect(Number(responses1[1].index)).toEqual(1);
        expect(responses1[1].executionTime).toBeGreaterThanOrEqual(WAIT_TIME);
        expect(responses1[2].result).toEqual(3);
        expect(Number(responses1[2].index)).toEqual(2);
        expect(responses1[2].executionTime).toBeGreaterThanOrEqual(WAIT_TIME);
        expect(responses1[3].result).toEqual(4);
        expect(Number(responses1[3].index)).toEqual(3);
        expect(responses1[3].executionTime).toBeGreaterThanOrEqual(WAIT_TIME);

    })

});
