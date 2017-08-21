export default class TrackerStorage implements ITrackerStorage {
    private static Keys;
    private storage;
    constructor(storage: IStorage);
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
