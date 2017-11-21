export default class CookieNames implements ICookieNames {
    userIdName: string;
    sessionIdName: string;
    emailName: string;
    constructor(userIdName?: string, sessionIdName?: string, emailName?: string);
    getUserIdName(): string;
    setUserIdName(userIdName: string): void;
    getSessionIdName(): string;
    setSessionIdName(sessionIdName: string): void;
    getEmailName(): string;
    setEmailName(emailName: string): void;
}
