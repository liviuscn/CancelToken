'use strict';

module.exports = function isCancel(value) {
    //判断请求失败时的错误对象是不是Cancel对象
    return !!(value && value.__CANCEL__);
};