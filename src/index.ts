/**
 * Entry file for demo bundle
 */
// tslint:disable:ordered-imports
import './polyfills';
import { parse, ParsedUrlQuery } from "querystring";
import CookieStorage from "./storage";
import TrackerFactory from "./tracker/TrackerFactory";
import TrackerStorage from "./tracker/TrackerStorage";
import { TrackingAPI } from './types';

const trackerStorage = new TrackerStorage(new CookieStorage());
const tracker: TrackingAPI = TrackerFactory.CreateWithCookieStorage();

if (typeof location === "object" && location.search) {

    const queryStringValues: ParsedUrlQuery = parse(location.search.replace("?", ""));

    if (queryStringValues.cmid) {

        trackerStorage.setCampaignId(queryStringValues.cmid);
    }

    if (queryStringValues.cid) {

        trackerStorage.setUserId(queryStringValues.cid);
    }
}

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
window[API_KEY] = callTrackerMethod;

const timeEntered = performance.now();

if (trackerStorage.getExitIntentFlag()) {
    addExitIntentEventListener(document.documentElement, "mouseleave", callExitIntentEvent);
}

function callExitIntentEvent() {
    const timeExited = performance.now();
    const timeElapsed = (timeExited - timeEntered) / 1000;
    tracker.trackExitIntent(Math.round(timeElapsed));
    removeExitIntentEventListener(document.documentElement, "mouseleave", callExitIntentEvent);
}

function addExitIntentEventListener(element, event, callback) {
    element.addEventListener ? element.addEventListener(event, callback) : element.attachEvent && element.attachEvent("on" + event, callback);
}

function removeExitIntentEventListener(element, event, callback) {
    element.removeEventListener ? element.removeEventListener(event, callback) : element.detachEvent && element.detachEvent("on" + event, callback);
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
if (typeof trackerStub.q === "object" && trackerStub.q.length) {

    trackerStub.q.forEach((queueCall: any) => {

        callTrackerMethod.apply(tracker, queueCall);
    });
}

export default tracker;