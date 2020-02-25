import Popup from '../src/subscription-forms/Popup';
import Form from '../src/subscription-forms/Form';
import test = require("tape");
import sinon = require("sinon");
import { IFormSettingsGet } from '../src/subscription-forms/model';
const cookie = require('js-cookie');

test('Creates a basic popup if trigger is not given.', (t: test.Test) => {

    let renderFormSpy = sinon.spy(Popup.prototype, 'renderForm');
    
    let popup = new Popup('b835a45dd3e54d43ae1c61f1164cca02', {  } as IFormSettingsGet, "<div class='test'>Form</div>");
    
    renderFormSpy.restore();

    t.assert(renderFormSpy.calledOnce, 'Render is called once.');
    t.assert(renderFormSpy.calledOn(popup), 'Render is called for this Popup.');

    t.end();
});

test('Creates a timed popup on visit', (t: test.Test) => {

    let renderWithDelay = sinon.stub(Popup.prototype, 'renderWithDelay');
    
    let popup = new Popup('b835a45dd3e54d43ae1c61f1164cca02', { Popup_Trigger: "visit" } as IFormSettingsGet, "<div class='test'>Form</div>");
    
    renderWithDelay.restore();

    t.assert(renderWithDelay.calledOnce, 'Render is called once.');
    t.assert(renderWithDelay.calledOn(popup), 'Render is called for this Popup.');

    t.end();
});

test('Creates a popup on exit', (t: test.Test) => {

    let renderOnExitSpy = sinon.stub(Popup.prototype, 'renderOnExit');
    
    let popup = new Popup('b835a45dd3e54d43ae1c61f1164cca02', { Popup_Trigger: "exit" } as IFormSettingsGet, "<div class='test'>Form</div>");
    
    renderOnExitSpy.restore();

    t.assert(renderOnExitSpy.calledOnce, 'Render is called once.');
    t.assert(renderOnExitSpy.calledOn(popup), 'Render is called for this Popup.');

    t.end();
});

test('Creates a popup on click trigger', (t: test.Test) => {

    let querySelectorSpy = sinon.stub(document, 'querySelector');
    querySelectorSpy.returns(document.createElement('div'));

    let addEventListenerSpy = sinon.spy(HTMLElement.prototype, 'addEventListener');
    
    let popup = new Popup('b835a45dd3e54d43ae1c61f1164cca02', { Popup_Trigger: "click" } as IFormSettingsGet, "<div class='test'>Form</div>");
    
    querySelectorSpy.restore();
    addEventListenerSpy.restore();

    t.assert(addEventListenerSpy.calledOnce, 'Listener for click is binded.');

    t.end();
});

test('Tests Popup renderForm implementation', (t: test.Test) => {
    
    let createWrapperSpy = sinon.spy(Popup.prototype, <any>'createWrapper');
    let removePreviousIfActiveSpy = sinon.spy(Popup.prototype, 'removePreviousIfActive');
    let addListenerForSubmissionCookiesSpy = sinon.spy(Popup.prototype, 'addListenerForSubmissionCookies');
    let addListenerForSubmissionIdentifyCookies = sinon.spy(Popup.prototype, 'addListenerForSubmissionIdentifyCookies');
    let setIntervalToShowCookie = sinon.spy(Popup.prototype, 'setIntervalToShowCookie');
    let addCloseEventListener = sinon.spy(Popup.prototype, 'addCloseEventListener');
    let attachScripts = sinon.spy(Popup.prototype, 'attachScripts');
    let appendChildSpy = sinon.spy(HTMLElement.prototype, 'appendChild');

    let popUp = new Popup('b835a45dd3e54d43ae1c61f1164cca02', { } as IFormSettingsGet, "<div class='test'>Form</div>");

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

test('Tests Popup attachStyle implementation', (t: test.Test) => {

    let createElementSpy = sinon.spy(Document.prototype, 'createElement');
    let querySelectorSpy = sinon.spy(Document.prototype, 'querySelector');
    let insertBeforeSpy = sinon.spy(HTMLElement.prototype, 'insertBefore');

    Popup.prototype.attachStyle(document.createElement('div'));
    
    createElementSpy.restore();
    querySelectorSpy.restore();
    insertBeforeSpy.restore();

    t.assert(createElementSpy.calledTwice, 'createElement is called.');
    t.assert(querySelectorSpy.calledOnce, 'querySelector is called.');
    t.assert(insertBeforeSpy.calledOnce, 'insertBefore is called.');

    t.end();
});

test('Tests Popup addCloseEventListener implementation', (t: test.Test) => {

    let addEventListenerSpy = sinon.spy(Document.prototype, 'addEventListener');

    Popup.prototype.addCloseEventListener(document.createElement('div'), 'b835a45dd3e54d43ae1c61f1164cca02');
    
    addEventListenerSpy.restore();

    t.assert(addEventListenerSpy.calledOnce, 'addEventListener is called.');

    t.end();
});

test('Tests Popup setIntervalToShowCookie implementation', (t: test.Test) => {

    let setCookieSpy = sinon.spy(cookie, 'set');
    let getTypeValueSpy = sinon.stub(Popup.prototype, 'getTypeValue');
    
    let popUp = new Popup('b835a45dd3e54d43ae1c61f1164cca02', { } as IFormSettingsGet, "<div class='test'>Form</div>");
    
    setCookieSpy.restore();
    getTypeValueSpy.restore();

    t.assert(setCookieSpy.calledOnce, 'setCookie is called.');
    t.assert(getTypeValueSpy.calledOnce, 'getTypeValue is called.');

    t.end();
});

test('Tests Popup get type value implementation', (t: test.Test) => {

    let getTypeValueSpy = sinon.spy(Popup.prototype, 'getTypeValue');
    let getTimeSpy = sinon.spy(Date.prototype, 'getTime');
    
    let popUp = new Popup('b835a45dd3e54d43ae1c61f1164cca02', { } as IFormSettingsGet, "<div class='test'>Form</div>");

    getTypeValueSpy.restore();
    getTimeSpy.restore();

    t.assert(getTypeValueSpy.calledOnce, 'getTypeValue is called.');
    t.assert(getTimeSpy.calledOnce, 'Date getTime() is called.');

    t.end();
});

test('Tests Popup is popup active implementation', (t: test.Test) => {

    let querySelectorSpy = sinon.stub(document, 'querySelector').returns(null);
    let isPopupActiveSpy = sinon.spy(Popup.prototype, 'isPopupActive');

    Popup.prototype.isPopupActive('123456789');

    querySelectorSpy.restore();
    isPopupActiveSpy.restore();

    t.assert(querySelectorSpy.calledOnce, 'querySelector is called once.');
    t.assert(isPopupActiveSpy.returned(false), 'querySelector is called once.');

    t.end();
});

test('Popup on click renderIfNotActive renders form if no popup is active', (t: test.Test) => {

    let isPopupActiveSpy = sinon.stub(Popup.prototype, 'isPopupActive').returns(false);
    let renderFormSpy = sinon.spy(Popup.prototype, 'renderForm');
    let preventDefaultStub = sinon.stub(Event.prototype, 'preventDefault').returns(true);

    let popUp = new Popup('b835a45dd3e54d43ae1c61f1164cca02', { Popup_Trigger: 'click' } as IFormSettingsGet, "<div class='test'>Form</div>");
    popUp.renderIfNotActive(new Event(''));

    isPopupActiveSpy.restore();
    renderFormSpy.restore();
    preventDefaultStub.restore();

    t.assert(renderFormSpy.calledOnce, 'renderForm is called once.');

    t.end();
});
