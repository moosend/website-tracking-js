import { ICookieNames } from "../types";
export default class CookieNames implements ICookieNames {
    userIdName: string;
    sessionIdName: string;
    emailName: string;
    exitIntentFlagName: string;
    constructor(userIdName?: string, sessionIdName?: string, emailName?: string, exitIntentFlagName?: string);
    getUserIdName(): string;
    setUserIdName(userIdName: string): void;
    getSessionIdName(): string;
    setSessionIdName(sessionIdName: string): void;
    getEmailName(): string;
    setEmailName(emailName: string): void;
    getExitIntentFlagName(): string;
    setExitIntentFlagName(exitIntentFlagName: string): void;
}
