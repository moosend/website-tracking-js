import CookieNames from "../cookies";
import { ICookieNames, IStorage, ITrackerStorage } from "../types";
export default class TrackerStorage extends CookieNames implements ITrackerStorage {
    private static Keys;
    cookieNames: CookieNames;
    private storage;
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
    setExitIntentFlag(exitIntentFlag: boolean): void;
    getExitIntentFlag(): boolean;
}
