import FullPage from '../src/subscription-forms/FullPage';
import test = require("tape");
import sinon = require("sinon");
import { IFormSettingsGet } from '../src/subscription-forms/model';
const cookie = require('js-cookie');

test('Creates a basic full page popup', (t: test.Test) => {

    let renderFormSpy = sinon.spy(FullPage.prototype, 'renderForm');
    
    let fullpage = new FullPage('b835a45dd3e54d43ae1c61f1164cca02', {  } as IFormSettingsGet, "<div class='test'>Form</div>");
    
    renderFormSpy.restore();

    t.assert(renderFormSpy.calledOnce, 'Render is called once.');
    t.assert(renderFormSpy.calledOn(fullpage), 'Render is called for this FullPage Popup.');

    t.end();
});

test('Creates a timed FullPage popup on visit', (t: test.Test) => {

    let renderWithDelay = sinon.stub(FullPage.prototype, 'renderWithDelay');
    
    let fullpage = new FullPage('b835a45dd3e54d43ae1c61f1164cca02', { Popup_Trigger: "visit" } as IFormSettingsGet, "<div class='test'>Form</div>");
    
    renderWithDelay.restore();

    t.assert(renderWithDelay.calledOnce, 'Render is called once.');
    t.assert(renderWithDelay.calledOn(fullpage), 'Render is called for this FullPage.');

    t.end();
});

test('Creates a FullPage popup on exit', (t: test.Test) => {

    let renderOnExitSpy = sinon.stub(FullPage.prototype, 'renderOnExit');
    
    let fullpage = new FullPage('b835a45dd3e54d43ae1c61f1164cca02', { Popup_Trigger: "exit" } as IFormSettingsGet, "<div class='test'>Form</div>");
    
    renderOnExitSpy.restore();

    t.assert(renderOnExitSpy.calledOnce, 'Render is called once.');
    t.assert(renderOnExitSpy.calledOn(fullpage), 'Render is called for this FullPage.');

    t.end();
});

test('Tests FullPage popup renderForm implementation', (t: test.Test) => {
    
    let createWrapperSpy = sinon.spy(FullPage.prototype, <any>'createWrapper');
    let removePreviousIfActiveSpy = sinon.spy(FullPage.prototype, 'removePreviousIfActive');
    let addListenerForSubmissionCookiesSpy = sinon.spy(FullPage.prototype, 'addListenerForSubmissionCookies');
    let addListenerForSubmissionIdentifyCookies = sinon.spy(FullPage.prototype, 'addListenerForSubmissionIdentifyCookies');
    let setIntervalToShowCookie = sinon.spy(FullPage.prototype, 'setIntervalToShowCookie');
    let addCloseEventListener = sinon.spy(FullPage.prototype, 'addCloseEventListener');
    let attachScripts = sinon.spy(FullPage.prototype, 'attachScripts');
    let appendChildSpy = sinon.spy(HTMLElement.prototype, 'appendChild');

    let fullpage = new FullPage('b835a45dd3e54d43ae1c61f1164cca02', { } as IFormSettingsGet, "<div class='test'>Form</div>");

    createWrapperSpy.restore();
    appendChildSpy.restore();
    addCloseEventListener.restore();
    removePreviousIfActiveSpy.restore();
    addListenerForSubmissionCookiesSpy.restore();
    addListenerForSubmissionIdentifyCookies.restore();
    setIntervalToShowCookie.restore();
    attachScripts.restore();

    t.assert(createWrapperSpy.calledOnce, 'Create wrapper is called.');
    t.assert(removePreviousIfActiveSpy.calledOnce, 'removePreviousIfActive is called.');
    t.assert(appendChildSpy.called, 'Appendchild is called.');
    t.assert(addListenerForSubmissionCookiesSpy.calledOnce, 'addListenerForSubmissionCookies is called.');
    t.assert(addListenerForSubmissionIdentifyCookies.calledOnce, 'addListenerForSubmissionIdentifyCookies is called.');
    t.assert(setIntervalToShowCookie.calledOnce, 'setIntervalToShowCookie is called.');
    t.assert(addCloseEventListener.calledOnce, 'addCloseEventListener is called.');
    t.assert(attachScripts.calledOnce, 'attachScripts is called.');

    t.end();
});

test('Tests FullPage attachStyle implementation', (t: test.Test) => {

    let createElementSpy = sinon.spy(Document.prototype, 'createElement');
    let querySelectorSpy = sinon.spy(Document.prototype, 'querySelector');
    let insertBeforeSpy = sinon.spy(HTMLElement.prototype, 'insertBefore');

    FullPage.prototype.attachStyle(document.createElement('div'));
    
    createElementSpy.restore();
    querySelectorSpy.restore();
    insertBeforeSpy.restore();

    t.assert(createElementSpy.calledTwice, 'createElement is called.');
    t.assert(querySelectorSpy.calledOnce, 'querySelector is called.');
    t.assert(insertBeforeSpy.calledOnce, 'insertBefore is called.');

    t.end();
});

test('Tests FullPage popup addCloseEventListener implementation', (t: test.Test) => {

    let addEventListenerSpy = sinon.spy(Document.prototype, 'addEventListener');

    FullPage.prototype.addCloseEventListener(document.createElement('div'), 'b835a45dd3e54d43ae1c61f1164cca02');
    
    addEventListenerSpy.restore();

    t.assert(addEventListenerSpy.calledOnce, 'addEventListener is called.');

    t.end();
});

test('Tests FullPage popup setIntervalToShowCookie implementation', (t: test.Test) => {

    let setCookieSpy = sinon.spy(cookie, 'set');
    let getTypeValueSpy = sinon.stub(FullPage.prototype, 'getTypeValue');
    
    let fullpage = new FullPage('b835a45dd3e54d43ae1c61f1164cca02', { } as IFormSettingsGet, "<div class='test'>Form</div>");
    
    setCookieSpy.restore();
    getTypeValueSpy.restore();

    t.assert(setCookieSpy.calledOnce, 'setCookie is called.');
    t.assert(getTypeValueSpy.calledOnce, 'getTypeValue is called.');

    t.end();
});

test('Tests FullPage popup get type value implementation', (t: test.Test) => {

    let getTypeValueSpy = sinon.spy(FullPage.prototype, 'getTypeValue');
    let getTimeSpy = sinon.spy(Date.prototype, 'getTime');
    
    let fullpage = new FullPage('b835a45dd3e54d43ae1c61f1164cca02', { } as IFormSettingsGet, "<div class='test'>Form</div>");

    getTypeValueSpy.restore();
    getTimeSpy.restore();

    t.assert(getTypeValueSpy.calledOnce, 'getTypeValue is called.');
    t.assert(getTimeSpy.calledOnce, 'Date getTime() is called.');

    t.end();
});

test('Test if is FullPage popup active implementation', (t: test.Test) => {

    let querySelectorSpy = sinon.stub(document, 'querySelector').returns(null);
    let isPopupActiveSpy = sinon.spy(FullPage.prototype, 'isPopupActive');

    FullPage.prototype.isPopupActive('123456789');

    querySelectorSpy.restore();
    isPopupActiveSpy.restore();

    t.assert(querySelectorSpy.calledOnce, 'querySelector is called once.');
    t.assert(isPopupActiveSpy.returned(false), 'querySelector is called once.');

    t.end();
});
