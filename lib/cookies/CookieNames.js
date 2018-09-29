"use strict";
exports.__esModule = true;
var CookieNames = (function () {
    function CookieNames(userIdName, sessionIdName, emailName, exitIntentFlagName) {
        if (userIdName === void 0) { userIdName = "uid"; }
        if (sessionIdName === void 0) { sessionIdName = "sessionid"; }
        if (emailName === void 0) { emailName = "email"; }
        if (exitIntentFlagName === void 0) { exitIntentFlagName = "exitIntentFlag"; }
        this.userIdName = userIdName;
        this.sessionIdName = sessionIdName;
        this.emailName = emailName;
        this.exitIntentFlagName = exitIntentFlagName;
    }
    CookieNames.prototype.getUserIdName = function () {
        return this.userIdName;
    };
    CookieNames.prototype.setUserIdName = function (userIdName) {
        this.userIdName = userIdName;
    };
    CookieNames.prototype.getSessionIdName = function () {
        return this.sessionIdName;
    };
    CookieNames.prototype.setSessionIdName = function (sessionIdName) {
        this.sessionIdName = sessionIdName;
    };
    CookieNames.prototype.getEmailName = function () {
        return this.emailName;
    };
    CookieNames.prototype.setEmailName = function (emailName) {
        this.emailName = emailName;
    };
    CookieNames.prototype.getExitIntentFlagName = function () {
        return this.exitIntentFlagName;
    };
    CookieNames.prototype.setExitIntentFlagName = function (exitIntentFlagName) {
        this.exitIntentFlagName = exitIntentFlagName;
    };
    return CookieNames;
}());
exports["default"] = CookieNames;
