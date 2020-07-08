import config from "../common/config";
import CookieStorage from "../storage/CookieStorage";
import Tracker from "./Tracker";
import TrackerAgent from "./TrackerAgent";
import TrackerStorage from "./TrackerStorage";

export default {

    CreateWithCookieStorageInstance: null,

    CreateWithCookieStorage(cookieSettings?: any, url?: string) {

        const apiUrl = url ? url : config.apiUrl;
        
        if (this.CreateWithCookieStorageInstance !== null && url === undefined) {
            return this.CreateWithCookieStorageInstance;
        }

        this.CreateWithCookieStorageInstance = new Tracker(new TrackerAgent(apiUrl), new TrackerStorage(new CookieStorage(cookieSettings)));

        return this.CreateWithCookieStorageInstance;
    },
};
