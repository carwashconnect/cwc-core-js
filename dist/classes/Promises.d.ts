export declare class Promises {
    static all(promises: Promise<any>[], debug?: boolean): Promise<any[]>;
    static sequence(promises: Promise<any>[], ignoreErrors?: boolean): Promise<any[]>;
}
