'use strict';

var Cancel = require('./Cancel.js');

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
//CancelToken构造函数，CancelToken是一个用于取消操作的对象
//CancelToken跳页面后取消掉还在pending状态的请求以提高性能
function CancelToken(executor) {
    if (typeof executor !== 'function') {//如果executor不是function，抛出错误
        throw new TypeError('executor must be a function.');
    }

    var resolvePromise;
    this.promise = new Promise(function promiseExecutor(resolve) {
        resolvePromise = resolve;
    });
    //CancelToken对象上的promise属性，一个promise对象，resolve方法存下来到resolvePromise里

    var token = this;//当前CancelToken对象
    executor(function cancel(message) {
        if (token.reason) {
            //如果CancelToken对象上已经存在reason属性，说明已经请求过取消操作了
            // Cancellation has already been requested
            return;
        }

        token.reason = new Cancel(message);//给当前CancelToken对象上设置reason属性，是一个Cancel对象
        resolvePromise(token.reason);//调用resolve方法，参数是当前CancelToken对象上的reason属性
        //用户调用cancel方法后会对当前cancelToken对象上的promise改变其状态为resolve，会运行适配器中的resolve回调来终止请求
    });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
//如果取消操作已经请求过了，就抛出Cancel对象的信息，也就是CancelToken对象的reason属性
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
    if (this.reason) {//如果当前CancelToken对象上有reason属性，直接抛出
        throw this.reason;
    }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
//CancelToken类上的source静态方法
//直接返回一个新建好的CancelToken对象和取消方法，方便使用，差不多就是工厂模式的意思
//返回一个对象包含两个属性，一个token属性是一个CancelToken新实例，另一个cancel属性是一个取消方法
//cancel取消方法对应CancelToken构造函数中的cancel方法，用户取消请求的时候直接调用就可以了
CancelToken.source = function source() {
    var cancel;
    var token = new CancelToken(function executor(c) {
        cancel = c;
    });
    return {
        token: token,
        cancel: cancel
    };
};

module.exports = CancelToken;