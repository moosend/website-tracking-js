import Browser from "../browser";
import config from "../common/config";
import CookieStorage from "../storage";
import Tracker from "./Tracker";
import TrackerAgent from "./TrackerAgent";
import TrackerStorage from "./TrackerStorage";

export default {

    CreateWithCookieStorageInstance: null,

    CreateWithCookieStorage(cookieSettings?: any) {

        if (this.CreateWithCookieStorageInstance !== null) {
            return this.CreateWithCookieStorageInstance;
        }

        this.CreateWithCookieStorageInstance = new Tracker(new TrackerAgent(config.apiUrl), new TrackerStorage(new CookieStorage(cookieSettings)), new Browser());

        return this.CreateWithCookieStorageInstance;
    },
};
