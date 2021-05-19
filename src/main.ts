///<reference path="../local.d.ts" />

/**
 * Entry file for demo bundle
 */
require("es5-shim");
import { getParameterByName, isValidUUID, validateEmail} from "./common/utils";
import CookieStorage from "./storage/CookieStorage";
import { TrackerActions } from "./tracker/Tracker";
import TrackerFactory from "./tracker/TrackerFactory";
import TrackerStorage from "./tracker/TrackerStorage";
import config from "./common/config";

const queryString = require("querystring");

const trackerStorage = new TrackerStorage(new CookieStorage());
const tracker: TrackingAPI = TrackerFactory.CreateWithCookieStorage();

// An instance for staging use, optional
const trackerStaging: TrackingAPI = TrackerFactory.CreateWithCookieStorage(undefined, config.apiUrlStaging);

if (typeof location === "object" && location.search) {

    const queryStringValues = queryString.parse(location.search.replace("?", ""));

    if (queryStringValues.cid) {
        trackerStorage.setUserId(queryStringValues.cid);
    }

    if (queryStringValues.cid) {

        trackerStorage.setUserId(queryStringValues.cid);
    }
}

export default tracker;
export { trackerStaging };

export { TrackerActions };
export { TrackerFactory };

/**
 * Expose tracker instance globally
 * The API is loaded via our loader script.
 * The loader script creates API stub to queue all calls before the API gets loaded.
 *
 * So before exposing the real API we must replay the calls in the queue if any in the queueing order.
 */
const API_KEY = "mootrack";
const trackerStub = typeof(window) !== "undefined" ? window[API_KEY] : [];

// Expose real API
global[API_KEY] = callTrackerMethod.bind(this);

const timeEntered = performance.now();

const cmid = getParameterByName("cmid");
const mid = getParameterByName("mid");

if (cmid != null && isValidUUID(cmid)) {
    trackerStorage.setCampaignId(cmid, { expires: 30 });
}

if (mid != null && isValidUUID(mid)) {
    trackerStorage.setMemberId(mid);
}

const lastExited = new Date(window.localStorage.getItem("lastExited"));
const currentDate = new Date();
currentDate.setDate(currentDate.getDate() - 1);
const shouldFireExitIntent = (lastExited === null) ? true : currentDate > lastExited;

if (trackerStorage.getExitIntentFlag() && shouldFireExitIntent) {

    document.documentElement.addEventListener("mouseleave", callExitIntentEvent);
}

function callExitIntentEvent() {
    const timeExited = performance.now();
    const timeElapsed = (timeExited - timeEntered) / 1000;
    const now = new Date();
    window.localStorage.setItem("lastExited", now.toString());
    tracker.trackExitIntent(Math.round(timeElapsed));
    document.documentElement.removeEventListener("mouseleave", callExitIntentEvent);
}

function callTrackerMethod() {

    const args = Array.prototype.slice.call(arguments);

    const methodName = args.length ? args[0] : "";
    const methodArguments = args.slice(1, args.length);

    // if tracker has a method that equals to methodName than invoke it
    if (typeof tracker[methodName] === "function") {
        try {
            tracker[methodName].apply(tracker, methodArguments);
        } catch (e) {
            console.error(e);
        }
        return;
    }

    // method name is a custom event, we did this so we can have an alias for mootrack('track', 'CUSTOM_EVENT')
    tracker.track.apply(tracker, [methodName, ...methodArguments]);
}

/**
 * Replacy all calls made on API stub
 */

if (typeof trackerStub === "function" && typeof trackerStub.q === "object" && trackerStub.q.length) {

    trackerStub.q.forEach((queueCall: any) => {

        callTrackerMethod.apply(tracker, queueCall);
    });
}
