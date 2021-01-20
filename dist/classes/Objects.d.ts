export declare class Objects {
    static copy<T>(obj: T, cbh?: number): T;
    static deepSearch(obj: any, ...keys: (string | number)[]): boolean;
    static isObject(obj: any): boolean;
    static merge(obj1: any, obj2: any, combineArrays?: boolean, cbh?: number): any;
    static trim(obj: any, cbh?: number): any;
    static compare(obj1: any, obj2: any, cbh?: number): {
        updates?: any;
        deletions?: any;
        additions?: any;
    };
    static intersect(obj1: any, obj2: any, options?: IIntersectOptions): IGenericObject | undefined;
    static shuffle<T>(arr: T[], createCopy?: boolean): T[];
    static subtract(obj1: any, obj2: any, options?: ISubtractOptions): IGenericObject;
    static createPath(obj: IGenericObject, ...keys: string[]): IGenericObject;
}
export interface IGenericObject {
    [key: string]: any;
}
export interface IGeneralObjectOptions {
    cbh?: number;
}
export interface IIntersectOptions extends IGeneralObjectOptions {
    onlyMatchingFields?: boolean;
}
export interface ISubtractOptions extends IGeneralObjectOptions {
}
