"use strict";
exports.__esModule = true;
var Utils = (function () {
    function Utils() {
    }
    Utils.isValidUUID = function (uuidString) {
        var validUUIDRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return (validUUIDRegex.test(uuidString) ||
            validUUIDRegex.test(uuidString.replace(/(\w{8})(\w{4})(\w{4})(\w{4})(\w{12})/gi, "$1-$2-$3-$4-$5")));
    };
    return Utils;
}());
exports["default"] = Utils;
exports.tostr = function (value) {
    return Object.prototype.toString.call(value);
};
exports.isString = function (value) {
    return Object.prototype.toString.call(value) === "[object String]";
};
exports.isNumber = function (value) {
    return Object.prototype.toString.call(value) === "[object Number]" || !isNaN(parseFloat(value));
};
exports.isObject = function (value) {
    return Object.prototype.toString.call(value) === "[object Object]";
};
exports.isUrl = function (url) {
    var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    return regexp.test(url);
};
exports.isValidUUID = function (uuidString) {
    var validUUIDRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return (validUUIDRegex.test(uuidString) ||
        validUUIDRegex.test(uuidString.replace(/(\w{8})(\w{4})(\w{4})(\w{4})(\w{12})/gi, "$1-$2-$3-$4-$5")));
};
exports.getParameterByName = function (name) {
    var url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
    if (!results) {
        return null;
    }
    if (!results[2]) {
        return "";
    }
    return decodeURIComponent(results[2].replace(/\+/g, " "));
};
exports.validateEmail = function (email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};
