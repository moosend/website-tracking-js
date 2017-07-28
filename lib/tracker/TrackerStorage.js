"use strict";
exports.__esModule = true;
var TrackerStorage = (function () {
    function TrackerStorage(storage) {
        this.storage = storage;
    }
    TrackerStorage.prototype.getUserId = function () {
        return this.storage.getItem(TrackerStorage.Keys.USER_ID);
    };
    TrackerStorage.prototype.setUserId = function (userId) {
        this.storage.setItem(TrackerStorage.Keys.USER_ID, userId);
    };
    TrackerStorage.prototype.getCampaignId = function () {
        return this.storage.getItem(TrackerStorage.Keys.CAMPAIGN_ID);
    };
    TrackerStorage.prototype.setCampaignId = function (campaignId) {
        this.storage.setItem(TrackerStorage.Keys.CAMPAIGN_ID, campaignId);
    };
    TrackerStorage.prototype.getEmail = function () {
        return this.storage.getItem(TrackerStorage.Keys.EMAIL);
    };
    TrackerStorage.prototype.setEmail = function (email) {
        this.storage.setItem(TrackerStorage.Keys.EMAIL, email);
    };
    TrackerStorage.prototype.getSessionId = function () {
        return this.storage.getItem(TrackerStorage.Keys.SESSION_NUMBER);
    };
    TrackerStorage.prototype.setSessionId = function (sessionId, options) {
        this.storage.setItem(TrackerStorage.Keys.SESSION_NUMBER, sessionId, options);
    };
    TrackerStorage.prototype.getCurrentPageUrl = function () {
        return window.location.href;
    };
    TrackerStorage.Keys = {
        CAMPAIGN_ID: "cmid",
        EMAIL: "email",
        SESSION_NUMBER: "sessionid",
        USER_ID: "uid"
    };
    return TrackerStorage;
}());
exports["default"] = TrackerStorage;
