export declare class Promises {
    static all(promises: Promise<any>[], debug?: boolean): Promise<any[]>;
    static sequence(promises: Promise<any>[], ignoreErrors?: boolean): Promise<any[]>;
    static loadBalancer<Output, Input>(promiseList: LoadBalancerItem<Output, Input>[], options?: LoadBalancerOptions): Promise<LoadBalancerOutputItem<Output>[]>;
    static wait(ms: number): Promise<void>;
}
export interface LoadBalancerItem<Output = any, Input = any> {
    func: (...args: Input[]) => Promise<Output>;
    args?: Input[];
    index?: number | string;
}
export type LoadBalancerOutputItem<Output> = LoadBalancerOutputSuccessItem<Output> | LoadBalancerOutputFailureItem<Output>;
export interface LoadBalancerOutputSuccessItem<Output> extends LoadBalancerOutputGeneralItem<Output> {
    result: Output;
    error?: undefined;
}
export interface LoadBalancerOutputFailureItem<Output> extends LoadBalancerOutputGeneralItem<Output> {
    result?: undefined;
    error: any;
}
export interface LoadBalancerOutputGeneralItem<Output> {
    executionTime: number;
    index?: number | string;
}
export interface LoadBalancerOptions {
    autoBalance?: boolean;
    offset?: number;
    setSize?: number;
    shuffle?: boolean;
    timeout?: number;
    verbose?: boolean;
}
