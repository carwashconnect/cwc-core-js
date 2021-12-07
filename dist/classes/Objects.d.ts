export declare class Objects {
    static copy<T>(obj: T, cbh?: number): T;
    static deepSearch(obj: any, ...keys: (string | number)[]): boolean;
    static isObject(obj: any): boolean;
    static merge<T, K>(obj1: T, obj2: K, combineArrays?: boolean, cbh?: number): T & K;
    static trim<T>(obj: T, cbh?: number): Partial<T>;
    static compare<T extends Record<any, any>, K extends Record<any, any>>(obj1: T, obj2: K, cbh?: number): {
        updates?: Record<keyof Partial<T & K>, any>;
        deletions?: Record<keyof Partial<T & K>, any>;
        additions?: Record<keyof Partial<T & K>, any>;
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
