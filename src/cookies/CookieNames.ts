export default class CookieNames implements ICookieNames {
    public userIdName: string;
    public campaignIdName: string;
    public memberIdName: string;
    public sessionIdName: string;
    public emailName: string;
    public exitIntentFlagName: string;

    constructor(
        userIdName: string = "uid",
        campaignIdName: string = "cmid",
        memberIdName: string = "mid",
        sessionIdName: string = "sessionid",
        emailName: string = "email",
        exitIntentFlagName: string = "exitIntentFlag",
    ) {
        this.userIdName = userIdName;
        this.sessionIdName = sessionIdName;
        this.emailName = emailName;
        this.exitIntentFlagName = exitIntentFlagName;
        this.campaignIdName = campaignIdName;
        this.memberIdName = memberIdName;
    }

    public getUserIdName(): string {
        return this.userIdName;
    }

    public setUserIdName(userIdName: string): void {
        this.userIdName = userIdName;
    }

    public getCampaignIdName(): string {
        return this.campaignIdName;
    }

    public setCampaignIdName(campaignIdName: string): void {
        this.campaignIdName = campaignIdName;
    }

    public getMemberIdName(): string {
        return this.memberIdName;
    }

    public setMemberIdName(memberIdName: string): void {
        this.memberIdName = memberIdName;
    }

    public getSessionIdName(): string {
        return this.sessionIdName;
    }

    public setSessionIdName(sessionIdName: string): void {
        this.sessionIdName = sessionIdName;
    }

    public getEmailName(): string {
        return this.emailName;
    }

    public setEmailName(emailName: string): void {
        this.emailName = emailName;
    }

    public getExitIntentFlagName(): string {
        return this.exitIntentFlagName;
    }

    public setExitIntentFlagName(exitIntentFlagName: string): void {
        this.exitIntentFlagName = exitIntentFlagName;
    }
}
