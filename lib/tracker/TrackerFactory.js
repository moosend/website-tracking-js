"use strict";
exports.__esModule = true;
var config_1 = require("../common/config");
var CookieStorage_1 = require("../storage/CookieStorage");
var Browser_1 = require("./Browser");
var Tracker_1 = require("./Tracker");
var TrackerAgent_1 = require("./TrackerAgent");
var TrackerStorage_1 = require("./TrackerStorage");
exports["default"] = {
    CreateWithCookieStorageInstance: null,
    CreateWithCookieStorage: function (cookieSettings) {
        if (this.CreateWithCookieStorageInstance !== null) {
            return this.CreateWithCookieStorageInstance;
        }
        this.CreateWithCookieStorageInstance = new Tracker_1["default"](new TrackerAgent_1["default"](config_1["default"].apiUrl), new TrackerStorage_1["default"](new CookieStorage_1["default"](cookieSettings)), new Browser_1.Browser());
        return this.CreateWithCookieStorageInstance;
    }
};
