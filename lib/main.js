"use strict";
exports.__esModule = true;
require("es5-shim");
var utils_1 = require("./common/utils");
var CookieStorage_1 = require("./storage/CookieStorage");
var TrackerFactory_1 = require("./tracker/TrackerFactory");
var TrackerStorage_1 = require("./tracker/TrackerStorage");
var queryString = require("querystring");
var trackerStorage = new TrackerStorage_1["default"](new CookieStorage_1["default"]());
var tracker = TrackerFactory_1["default"].CreateWithCookieStorage();
if (typeof location === "object" && location.search) {
    var queryStringValues = queryString.parse(location.search.replace("?", ""));
    if (queryStringValues.cid) {
        trackerStorage.setUserId(queryStringValues.cid);
    }
    if (queryStringValues.cid) {
        trackerStorage.setUserId(queryStringValues.cid);
    }
}
exports["default"] = tracker;
var API_KEY = "mootrack";
var trackerStub = typeof (window) !== "undefined" ? window[API_KEY] : [];
global[API_KEY] = callTrackerMethod.bind(this);
var timeEntered = performance.now();
var cmid = utils_1.getParameterByName("cmid");
var mid = utils_1.getParameterByName("mid");
if (cmid != null && utils_1.isValidUUID(cmid)) {
    trackerStorage.setCampaignId(cmid);
}
if (mid != null && utils_1.isValidUUID(mid)) {
    trackerStorage.setMemberId(mid);
}
var lastExited = new Date(window.localStorage.getItem("lastExited"));
var currentDate = new Date();
currentDate.setDate(currentDate.getDate() - 1);
var shouldFireExitIntent = (lastExited === null) ? true : currentDate > lastExited;
if (trackerStorage.getExitIntentFlag() && shouldFireExitIntent) {
    document.documentElement.addEventListener("mouseleave", callExitIntentEvent);
}
function callExitIntentEvent() {
    var timeExited = performance.now();
    var timeElapsed = (timeExited - timeEntered) / 1000;
    var now = new Date();
    window.localStorage.setItem("lastExited", now.toString());
    tracker.trackExitIntent(Math.round(timeElapsed));
    document.documentElement.removeEventListener("mouseleave", callExitIntentEvent);
}
function callTrackerMethod() {
    var args = Array.prototype.slice.call(arguments);
    var methodName = args.length ? args[0] : "";
    var methodArguments = args.slice(1, args.length);
    if (typeof tracker[methodName] === "function") {
        try {
            tracker[methodName].apply(tracker, methodArguments);
        }
        catch (e) {
            console.error(e);
        }
        return;
    }
    tracker.track.apply(tracker, [methodName].concat(methodArguments));
}
if (typeof trackerStub === "function" && typeof trackerStub.q === "object" && trackerStub.q.length) {
    trackerStub.q.forEach(function (queueCall) {
        callTrackerMethod.apply(tracker, queueCall);
    });
}
