import test = require("tape");
import sinon = require("sinon");
import APIRequest from '../src/subscription-forms/APIRequest';
import { IFormSettingsGet } from "../src/subscription-forms/model";
import { callbackify } from "util";
const cookie = require('js-cookie');

const apirequestObj = new APIRequest();

test('Gets callback from makerequest', (t: test.Test) => {

    const callBack = sinon.spy();
    
    const apiRequest = sinon.stub(apirequestObj, 'makeRequest').yields(callBack);

    apiRequest('http://localhost', { test: 'test'}, callBack);
    
    t.assert(callBack.calledOnce, 'Callback is called.');

    t.end();
});

test('Test APIRequest payload for forms with website id', (t: test.Test) => {

    let payloadValues = apirequestObj.preparePayload('b835a45dd3e54d43ae1c61f1164cca02', '123456', 'dev@moosend.com', { 'cookie_1': 'phobos' }, 'http://localhost');

    const mustReturn = {
        WebsiteId: 'b835a45dd3e54d43ae1c61f1164cca02',
            RemoteWebContext: {
                ContactId: '123456',
                MemberEmail: 'dev@moosend.com',
                Cookies: { 'cookie_1': 'phobos' },
                CurrentUrlPath: 'http://localhost'
            }
    };

    t.deepEqual(payloadValues, mustReturn, 'Preparepayload returns equal.');

    t.end();
});

test('Test APIRequest payload for single form without website id', (t: test.Test) => {

    let payloadValues = apirequestObj.preparePayloadForSingle('b835a45dd3e54d43ae1c61f1164cca02', '123456', 'dev@moosend.com', { 'cookie_1': 'phobos' }, 'http://localhost');

    const mustReturn = {
        EntityId: 'b835a45dd3e54d43ae1c61f1164cca02',
            RemoteWebContext: {
                ContactId: '123456',
                MemberEmail: 'dev@moosend.com',
                Cookies: { 'cookie_1': 'phobos' },
                CurrentUrlPath: 'http://localhost'
            }
    };

    t.deepEqual(payloadValues, mustReturn, 'Preparepayload for single form returns equal.');

    t.end();
});

test('To be avoided should return true if Avoid Submission setting is true and the cookie exists', (t: test.Test) => {

    let cookiePositive = sinon.stub(cookie, 'get');
    cookiePositive.returns("true");

    let toBeAvoided = apirequestObj.isToBeAvoided('b835a45dd3e54d43ae1c61f1164cca02', { Avoid_Submission_OnOff: "true" } as IFormSettingsGet);

    cookiePositive.resetBehavior();

    t.equal(toBeAvoided, true, 'To be avoided returns true');

    t.end();
});