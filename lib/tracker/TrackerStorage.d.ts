import CookieNames from "../cookies/CookieNames";
export default class TrackerStorage extends CookieNames implements ITrackerStorage {
    private static Keys;
    private storage;
    private cookieNames;
    constructor(storage: IStorage);
    setCookieNames(cookieNames: ICookieNames): void;
    getUserId(): string;
    setUserId(userId: string, options?: any): void;
    getCampaignId(): string;
    setCampaignId(campaignId: string): void;
    getEmail(): string;
    setEmail(email: string): void;
    getSessionId(): string;
    setSessionId(sessionId: string, options?: any): void;
    getCurrentPageUrl(): string;
}
