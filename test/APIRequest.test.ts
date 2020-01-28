import test = require("tape");
import sinon = require("sinon");
import APIRequest from '../src/subscription-forms/APIRequest';
import { IFormSettingsGet } from "../src/subscription-forms/model";
import Popup from "../src/subscription-forms/Popup";
import Row from "../src/subscription-forms/Row";

const cookie = require('js-cookie');

const apirequestObj = new APIRequest();

test('Gets callback from makerequest', (t: test.Test) => {

    const callBack = sinon.spy();
    
    const apiRequest = sinon.stub(apirequestObj, 'makeRequest').yields();

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

test('Renders Popup and Row forms given from API response in JSON', (t: test.Test) => {

    let responseFromApi = '[{"Entity":{"Subtype": 1, "Id":"1234567789"},"EntityHtml":"<div>Form</div>","Settings":{}},{"Entity":{"Subtype": 3, "Id":"1234567789"},"EntityHtml":"<div>Form</div>","Settings":{}}]';

    let jsonParseSpy = sinon.spy(JSON, 'parse');
    let popupObjSpy = sinon.stub(Popup.prototype, 'renderForm');
    let rowObjSpy = sinon.stub(Row.prototype, 'renderForm');

    apirequestObj.renderForms(responseFromApi);

    jsonParseSpy.restore();
    popupObjSpy.restore();
    rowObjSpy.restore();

    t.assert(jsonParseSpy.calledOnce, 'JSON parse is called.');
    t.assert(popupObjSpy.calledOnce, 'Popup render is called.');
    t.assert(rowObjSpy.calledOnce, 'Row render is called.');

    t.end();
});

test('To be avoided should return true if Avoid Submission setting is true and the cookie exists', (t: test.Test) => {

    let cookiePositive = sinon.stub(cookie, 'get');
    cookiePositive.returns("true");

    let toBeAvoided = apirequestObj.isToBeAvoided('b835a45dd3e54d43ae1c61f1164cca02', { Avoid_Submission_OnOff: "true" } as IFormSettingsGet);

    cookiePositive.restore();

    t.equal(toBeAvoided, true, 'To be avoided returns true.');

    t.end();
});

test('To be avoided should return false if Avoid Submission setting is false and the cookie exists', (t: test.Test) => {

    let cookiePositive = sinon.stub(cookie, 'get');
    cookiePositive.returns("true");

    let toBeAvoided = apirequestObj.isToBeAvoided('b835a45dd3e54d43ae1c61f1164cca02', { Avoid_Submission_OnOff: "false" } as IFormSettingsGet);

    cookiePositive.restore();

    t.equal(toBeAvoided, false, 'To be avoided returns false.');

    t.end();
});

test('To be avoided should return false if Avoid Submission setting is true but the cookie does not exist', (t: test.Test) => {

    let cookiePositive = sinon.stub(cookie, 'get');
    cookiePositive.returns(undefined);

    let toBeAvoided = apirequestObj.isToBeAvoided('b835a45dd3e54d43ae1c61f1164cca02', { Avoid_Submission_OnOff: "true" } as IFormSettingsGet);

    cookiePositive.restore();

    t.equal(toBeAvoided, false, 'To be avoided returns false.');

    t.end();
});

test('Get all cookies calls get without parameters given', (t: test.Test) => {

    let cookieGetAllSpy = sinon.spy(cookie, 'get');

    apirequestObj.getAllCookies();

    cookieGetAllSpy.restore();

    t.assert(cookieGetAllSpy.calledOnce, 'Get all cookies is called once.');
    t.assert(cookieGetAllSpy.calledOn(cookie), 'Get all cookies is called on Cookie object.');

    t.end();
});