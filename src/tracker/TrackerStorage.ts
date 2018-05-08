import Utils from "../common/utils";
import CookieNames from "../cookies/CookieNames";
import Tracker from "./Tracker";

enum CookieKeys {
    CAMPAIGN_ID = "cmid",
}

export default class TrackerStorage extends CookieNames
    implements ITrackerStorage {
    private static Keys = CookieKeys;

    private storage: IStorage;
    private cookieNames: CookieNames;

    constructor(storage: IStorage) {
        super();
        this.storage = storage;
    }

    public setCookieNames(cookieNames: ICookieNames): void {
        for (const property in cookieNames) {
            if (property) {
                if (property === "userIdName") {
                    const propertyValue = this.storage.getItem(
                        cookieNames[property],
                    );
                    if (!propertyValue || !Utils.isValidUUID(propertyValue)) {
                        throw new Error(
                            `Property ${property} is empty or has invalid UUID.`,
                        );
                    }
                    this.setUserIdName(cookieNames[property]);
                }
                if (property === "emailName") {
                    this.setEmailName(cookieNames[property]);
                }
            }
        }
    }

    public getUserId(): string {
        return this.storage.getItem(this.userIdName);
    }

    public setUserId(userId: string, options?: any): void {
        this.storage.setItem(this.userIdName, userId, options);
    }

    public getCampaignId(): string {
        return this.storage.getItem(TrackerStorage.Keys.CAMPAIGN_ID);
    }

    public setCampaignId(campaignId: string): void {
        this.storage.setItem(TrackerStorage.Keys.CAMPAIGN_ID, campaignId);
    }

    public getEmail(): string {
        return this.storage.getItem(this.emailName);
    }

    public setEmail(email: string): void {
        this.storage.setItem(this.emailName, email);
    }

    public getSessionId(): string {
        return this.storage.getItem(this.sessionIdName);
    }

    public setSessionId(sessionId: string, options?: any): void {
        this.storage.setItem(this.sessionIdName, sessionId, options);
    }

    public getCurrentPageUrl(): string {
        return window.location.href;
    }

    public setExitIntentFlag(exitIntentFlag: boolean): void {
        this.storage.setItem(this.exitIntentFlagName, exitIntentFlag);
    }

    public getExitIntentFlag(): boolean {
        return this.storage.getItem(this.exitIntentFlagName);
    }
    
}
