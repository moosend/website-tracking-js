"use strict";
exports.__esModule = true;
var cookie = require("js-cookie");
var CookieStorage = (function () {
    function CookieStorage(cookieSettings) {
        this.cookieSettings = cookieSettings;
    }
    CookieStorage.prototype.getItem = function (key) {
        return cookie.get(key);
    };
    CookieStorage.prototype.setItem = function (key, value, options) {
        cookie.set(key, value, options);
    };
    CookieStorage.prototype.removeItem = function (key) {
        cookie.remove(key);
    };
    return CookieStorage;
}());
exports["default"] = CookieStorage;
