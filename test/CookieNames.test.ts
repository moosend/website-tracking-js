import test = require("tape");
import CookieNames from "../src/cookies/CookieNames";

test("CookieNames default values", (t: test.Test) => {
    const cookieNames = new CookieNames();

    t.equal(cookieNames.getUserIdName(), "uid", "default userIdName is 'uid'");
    t.equal(
        cookieNames.getSessionIdName(),
        "sessionid",
        "default sessionIdName is 'sessionid'",
    );
    t.equal(cookieNames.getEmailName(), "email", "default email is 'email'");
    t.equal(cookieNames.getExitIntentFlagName(), "exitIntentFlag", "default exitIntentFlagName is exitIntentFlag");

    t.plan(4);
    t.end();
});

test("CookieNames update default values", (t: test.Test) => {
    const cookieNames = new CookieNames();

    const userIdName = "userIdExample";
    const sessionIdName = "sessionIdExample";
    const emailName = "emailExample";
    const exitIntentFlagName = "exitIntentFlag";

    cookieNames.setUserIdName(userIdName);
    cookieNames.setSessionIdName(sessionIdName);
    cookieNames.setEmailName(emailName);
    cookieNames.setExitIntentFlagName(exitIntentFlagName);

    t.notEqual(
        cookieNames.getUserIdName(),
        "uid",
        "userIdName is not default value 'uid'",
    );
    t.notEqual(
        cookieNames.getSessionIdName(),
        "sessionid",
        "sessionIdName is not default value 'sessionid'",
    );
    t.notEqual(
        cookieNames.getEmailName(),
        "email",
        "email is not default value 'email'",
    );
    

    t.equal(
        cookieNames.getUserIdName(),
        userIdName,
        `userIdName is '${userIdName}'`,
    );
    t.equal(
        cookieNames.getSessionIdName(),
        sessionIdName,
        `sessionIdName is '${sessionIdName}'`,
    );
    t.equal(cookieNames.getEmailName(), emailName, `email is '${emailName}'`);

    t.plan(6);
    t.end();
});
