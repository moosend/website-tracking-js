export default class CookieNames implements ICookieNames {
    public userIdName: string;
    public sessionIdName: string;
    public emailName: string;

    constructor(
        userIdName: string = "uid",
        sessionIdName: string = "sessionid",
        emailName: string = "email",
    ) {
        this.userIdName = userIdName;
        this.sessionIdName = sessionIdName;
        this.emailName = emailName;
    }

    public getUserIdName(): string {
        return this.userIdName;
    }

    public setUserIdName(userIdName: string): void {
        this.userIdName = userIdName;
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
}
