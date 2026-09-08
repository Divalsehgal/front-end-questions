// CAVEAT - this deviates from real Promise/A+ behavior in two ways (recap gotcha, not a bug fix):
// 1. then()/catch() return `this` instead of a new Promise, so chaining does not propagate values/errors
//    the way real Promise chaining does. Not fixed here - would need a proper rewrite.
// 2. (fixed below) real Promises always run .then/.catch handlers as a microtask, even when already
//    settled - never synchronously. The already-settled branches now use queueMicrotask() to match that.

const PromiseState = {
    PENDING: 'pending',
    FULFILLED: 'fulfilled',
    REJECTED: 'rejected',
};

class MyPromise {
    constructor(executor) {
        this._state = PromiseState.PENDING;
        this._successCallbackHandlers = [];
        this._failureCallbackHandlers = [];
        this._finallyCallbackHandler = undefined;
        this._value = undefined;
        this._reason = undefined;

        executor(
            this._promiseResolver.bind(this),
            this._promiseRejector.bind(this)
        );
    }

    then(handlerFn) {
        if (this._state === PromiseState.FULFILLED) {
            queueMicrotask(() => handlerFn(this._value));
        } else {
            this._successCallbackHandlers.push(handlerFn);
        }
        return this;
    }

    catch(handlerFn) {
        if (this._state === PromiseState.REJECTED) {
            queueMicrotask(() => handlerFn(this._reason));
        } else {
            this._failureCallbackHandlers.push(handlerFn);
        }
        return this;
    }

    finally(handlerFn) {
        if (this._state !== PromiseState.PENDING) {
            return handlerFn();
        }
        this._finallyCallbackHandler = handlerFn;
    }

    _promiseResolver(value) {
        if (this._state === PromiseState.FULFILLED) return;
        this._state = PromiseState.FULFILLED;
        this._value = value;
        this._successCallbackHandlers.forEach((cb) => cb(value));
        if (this._finallyCallbackHandler) this._finallyCallbackHandler();
    }

    _promiseRejector(reason) {
        if (this._state === PromiseState.REJECTED) return;
        this._state = PromiseState.REJECTED;
        this._reason = reason;
        this._failureCallbackHandlers.forEach((cb) => cb(reason));
        if (this._finallyCallbackHandler) this._finallyCallbackHandler();
    }
}
