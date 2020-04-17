'use strict';

/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
//Cancel对象构造函数，cancel对象是当请求被取消的时候会抛出的对象
function Cancel(message) {
    this.message = message;//Cancel对象上的message属性
}

Cancel.prototype.toString = function toString() {//返回将Cancel对象的message属性的字符串提示
    return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;//Cancel原型上的__CANCEL__内部属性，默认为true

module.exports = Cancel;