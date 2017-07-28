import Tracker from "./Tracker";

// TODO: save data in single cookie via JSON.stringify rather separate cookies for each key
export default class TrackerStorage implements ITrackerStorage {

    private static Keys = {
        CAMPAIGN_ID: "cmid",
        EMAIL: "email",
        SESSION_NUMBER: "sessionid",
        USER_ID: "uid",
    };

    private storage: IStorage;

    constructor(storage: IStorage) {
        this.storage = storage;
    }

    public getUserId(): string {
        return this.storage.getItem(TrackerStorage.Keys.USER_ID);
    }

    public setUserId(userId: string): void {
        this.storage.setItem(TrackerStorage.Keys.USER_ID, userId);
    }

    public getCampaignId(): string {
        return this.storage.getItem(TrackerStorage.Keys.CAMPAIGN_ID);
    }

    public setCampaignId(campaignId: string): void {
        this.storage.setItem(TrackerStorage.Keys.CAMPAIGN_ID, campaignId);
    }

    public getEmail(): string {
        return this.storage.getItem(TrackerStorage.Keys.EMAIL);
    }

    public setEmail(email: string): void {
        this.storage.setItem(TrackerStorage.Keys.EMAIL, email);
    }

    public getSessionId(): string {
        return this.storage.getItem(TrackerStorage.Keys.SESSION_NUMBER);
    }

    public setSessionId(sessionId: string, options?: any): void {
        this.storage.setItem(TrackerStorage.Keys.SESSION_NUMBER, sessionId, options);
    }

    public getCurrentPageUrl(): string {
        return window.location.href;
    }
}
