export declare class Objects {
    static copy(obj: any, cbh?: number): any;
    static deepSearch(obj: any, ...keys: string[]): boolean;
    static isObject(obj: any): boolean;
    static merge(obj1: any, obj2: any, combineArrays?: boolean, cbh?: number): any;
    static trim(obj: any, cbh?: number): any;
    static compare(obj1: any, obj2: any, cbh?: number): {
        updates?: any;
        deletions?: any;
        additions?: any;
    };
}
