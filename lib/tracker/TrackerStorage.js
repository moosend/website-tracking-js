"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var utils_1 = require("../common/utils");
var CookieNames_1 = require("../cookies/CookieNames");
var CookieKeys;
(function (CookieKeys) {
    CookieKeys["CAMPAIGN_ID"] = "cmid";
})(CookieKeys || (CookieKeys = {}));
var TrackerStorage = (function (_super) {
    __extends(TrackerStorage, _super);
    function TrackerStorage(storage) {
        var _this = _super.call(this) || this;
        _this.storage = storage;
        return _this;
    }
    TrackerStorage.prototype.setCookieNames = function (cookieNames) {
        for (var property in cookieNames) {
            if (property) {
                if (property === "userIdName") {
                    var propertyValue = this.storage.getItem(cookieNames[property]);
                    if (!propertyValue || !utils_1["default"].isValidUUID(propertyValue)) {
                        throw new Error("Property " + property + " is empty or has invalid UUID.");
                    }
                    this.setUserIdName(cookieNames[property]);
                }
                if (property === "emailName") {
                    this.setEmailName(cookieNames[property]);
                }
            }
        }
    };
    TrackerStorage.prototype.getUserId = function () {
        return this.storage.getItem(this.userIdName);
    };
    TrackerStorage.prototype.setUserId = function (userId, options) {
        this.storage.setItem(this.userIdName, userId, options);
    };
    TrackerStorage.prototype.getCampaignId = function () {
        return this.storage.getItem(TrackerStorage.Keys.CAMPAIGN_ID);
    };
    TrackerStorage.prototype.setCampaignId = function (campaignId) {
        this.storage.setItem(TrackerStorage.Keys.CAMPAIGN_ID, campaignId);
    };
    TrackerStorage.prototype.getEmail = function () {
        return this.storage.getItem(this.emailName);
    };
    TrackerStorage.prototype.setEmail = function (email) {
        this.storage.setItem(this.emailName, email);
    };
    TrackerStorage.prototype.getSessionId = function () {
        return this.storage.getItem(this.sessionIdName);
    };
    TrackerStorage.prototype.setSessionId = function (sessionId, options) {
        this.storage.setItem(this.sessionIdName, sessionId, options);
    };
    TrackerStorage.prototype.getCurrentPageUrl = function () {
        return window.location.href;
    };
    TrackerStorage.Keys = CookieKeys;
    return TrackerStorage;
}(CookieNames_1["default"]));
exports["default"] = TrackerStorage;
