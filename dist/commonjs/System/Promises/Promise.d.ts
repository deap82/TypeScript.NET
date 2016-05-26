/*!
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT
 * Although most of the following code is written from scratch, it is
 * heavily influenced by Q (https://github.com/kriskowal/q) and uses some of Q's spec.
 */
import { Func } from "../FunctionTypes";
import { DisposableBase } from "../Disposable/DisposableBase";
export declare class PromiseState<T> extends DisposableBase {
    protected _state: Promise.State;
    protected _result: T;
    protected _error: any;
    constructor(_state: Promise.State, _result?: T, _error?: any);
    protected _onDispose(): void;
    protected getState(): Promise.State;
    state: Promise.State;
    isPending: boolean;
    isSettled: boolean;
    isFulfilled: boolean;
    isRejected: boolean;
    protected getResult(): T;
    result: T;
    protected getError(): any;
    error: any;
}
export declare abstract class PromiseBase<T> extends PromiseState<T> implements PromiseLike<T> {
    constructor();
    abstract then<TResult>(onFulfilled: Promise.Fulfill<T, TResult>, onRejected?: Promise.Reject<TResult>): PromiseBase<TResult>;
    abstract thenThis<TResult>(onFulfilled: Promise.Fulfill<T, TResult>, onRejected?: Promise.Reject<TResult>): PromiseBase<T>;
    deferAll(): PromiseBase<T>;
    defer(): PromiseBase<T>;
    delay(milliseconds?: number): PromiseBase<T>;
    'catch'<TResult>(onRejected: Promise.Reject<TResult>): PromiseBase<TResult>;
    'finally'<TResult>(fin: () => Promise.Resolution<TResult>): PromiseBase<TResult>;
    finallyThis(fin: () => void): PromiseBase<T>;
}
export declare abstract class Resolvable<T> extends PromiseBase<T> {
    then<TResult>(onFulfilled: Promise.Fulfill<T, TResult>, onRejected?: Promise.Reject<TResult>): PromiseBase<TResult>;
    thenThis<TResult>(onFulfilled: Promise.Fulfill<T, TResult>, onRejected?: Promise.Reject<TResult>): PromiseBase<T>;
}
export declare abstract class Resolved<T> extends Resolvable<T> {
    constructor(state: Promise.State, result: T, error?: any);
}
export declare class Promise<T> extends Resolvable<T> {
    private _waiting;
    constructor(resolver?: Promise.Executor<T>, resolveImmediate?: boolean);
    then<TResult>(onFulfilled: Promise.Fulfill<T, TResult>, onRejected?: Promise.Reject<TResult>): PromiseBase<TResult>;
    thenThis<TResult>(onFulfilled: Promise.Fulfill<T, TResult>, onRejected?: Promise.Reject<TResult>): PromiseBase<T>;
    protected _onDispose(): void;
    protected _resolvedCalled: boolean;
    resolveUsing(resolver: Promise.Executor<T>, deferResolution?: boolean, throwIfSettled?: boolean): void;
    resolve(result?: T, throwIfSettled?: boolean): void;
    reject(error: any, throwIfSettled?: boolean): void;
}
export declare class Task<T> extends Resolved<T> {
    private _factory;
    constructor(_factory: Func<T>);
    protected _onDispose(): void;
    protected getState(): Promise.State;
    protected getResult(): T;
    protected getError(): any;
    then<TResult>(onFulfilled: Promise.Fulfill<T, TResult>, onRejected?: Promise.Reject<TResult>): PromiseBase<TResult>;
    thenThis<TResult>(onFulfilled: Promise.Fulfill<T, TResult>, onRejected?: Promise.Reject<TResult>): PromiseBase<T>;
    resolve(): Task<T>;
    isCompleted: boolean;
}
export declare class LazyPromise<T> extends Promise<T> {
    private _resolver;
    constructor(_resolver: Promise.Executor<T>);
    protected _onDispose(): void;
    private _onThen();
    then<TResult>(onFulfilled: Promise.Fulfill<T, TResult>, onRejected?: Promise.Reject<TResult>): PromiseBase<TResult>;
    thenThis<TResult>(onFulfilled: Promise.Fulfill<T, TResult>, onRejected?: Promise.Reject<TResult>): PromiseBase<T>;
}
export declare module Promise {
    enum State {
        Pending = 0,
        Fulfilled = 1,
        Rejected = -1,
    }
    type Resolution<TResult> = PromiseLike<TResult> | TResult | void;
    interface Fulfill<T, TResult> {
        (value: T): Resolution<TResult>;
    }
    interface Reject<TResult> {
        (err?: any): Resolution<TResult>;
    }
    interface Then<T, TResult> {
        (onFulfilled: Fulfill<T, TResult>, onRejected?: Reject<TResult>): PromiseBase<TResult>;
    }
    interface Executor<T> {
        (resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: any) => void): void;
    }
    function all<T>(promises: PromiseLike<T>[]): PromiseBase<T[]>;
    function all<T>(promise: PromiseLike<T>, ...rest: PromiseLike<T>[]): PromiseBase<T[]>;
    function race<T>(promises: PromiseLike<T>[]): PromiseBase<T>;
    function race<T>(promise: PromiseLike<T>, ...rest: PromiseLike<T>[]): PromiseBase<T>;
    function resolve(): PromiseBase<void>;
    function resolve<T>(value: T | PromiseLike<T>): PromiseBase<T>;
    function reject<T>(reason: T): PromiseBase<T>;
    module lazy {
        function resolve<T>(factory: Func<T>): Task<T>;
        function pending<T>(resolver: Promise.Executor<T>): LazyPromise<T>;
    }
    function wrap<T>(target: PromiseLike<T>): PromiseBase<T>;
    function createFrom<T, TResult>(then: Then<T, TResult>): PromiseBase<T>;
    function pending<T>(resolver?: Promise.Executor<T>): Promise<T>;
}
