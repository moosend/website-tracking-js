import CookieNames from "../src/cookies/CookieNames";

describe('CookieNames', () =>{

    test("CookieNames default values", () => {
        expect.assertions(4);

        const cookieNames = new CookieNames();
    
        expect(cookieNames.getUserIdName()).toEqual('uid');
        expect(cookieNames.getSessionIdName()).toEqual('sessionid');
        expect(cookieNames.getEmailName()).toEqual('email');
        expect(cookieNames.getExitIntentFlagName()).toEqual('exitIntentFlag');
    });
    
    test("CookieNames update default values", () => {
        expect.assertions(8);
        
        const cookieNames = new CookieNames();
    
        const userIdName = "userIdExample";
        const sessionIdName = "sessionIdExample";
        const emailName = "emailExample";
        const exitIntentFlagName = "exitIntentFlagExample";
    
        cookieNames.setUserIdName(userIdName);
        cookieNames.setSessionIdName(sessionIdName);
        cookieNames.setEmailName(emailName);
        cookieNames.setExitIntentFlagName(exitIntentFlagName);

        expect(cookieNames.getUserIdName()).not.toEqual('uid');
        expect(cookieNames.getUserIdName()).toEqual(userIdName);

        expect(cookieNames.getSessionIdName()).not.toEqual('sessionid');
        expect(cookieNames.getSessionIdName()).toEqual(sessionIdName);

        expect(cookieNames.getEmailName()).not.toEqual('email');
        expect(cookieNames.getEmailName()).toEqual(emailName);

        expect(cookieNames.getExitIntentFlagName()).not.toEqual('exitIntentFlag');
        expect(cookieNames.getExitIntentFlagName()).toEqual(exitIntentFlagName);
    });

});