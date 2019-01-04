export default class CookieNames implements ICookieNames {
    userIdName: string;
    campaignIdName: string;
    memberIdName: string;
    sessionIdName: string;
    emailName: string;
    exitIntentFlagName: string;
    constructor(userIdName?: string, campaignIdName?: string, memberIdName?: string, sessionIdName?: string, emailName?: string, exitIntentFlagName?: string);
    getUserIdName(): string;
    setUserIdName(userIdName: string): void;
    getCampaignIdName(): string;
    setCampaignIdName(campaignIdName: string): void;
    getMemberIdName(): string;
    setMemberIdName(memberIdName: string): void;
    getSessionIdName(): string;
    setSessionIdName(sessionIdName: string): void;
    getEmailName(): string;
    setEmailName(emailName: string): void;
    getExitIntentFlagName(): string;
    setExitIntentFlagName(exitIntentFlagName: string): void;
}
