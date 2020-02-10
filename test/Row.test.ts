import test = require("tape");
import sinon = require("sinon");
import Row from "../src/subscription-forms/Row";
import { IFormSettingsGet } from '../src/subscription-forms/model';

test('Creates a basic row form.', (t: test.Test) => {

    let renderForm = sinon.stub(Row.prototype, 'renderForm');
    
    let popup = new Row('b835a45dd3e54d43ae1c61f1164cca02', {  } as IFormSettingsGet, "<div class='test'>Form</div>");
    
    renderForm.restore();

    t.assert(renderForm.calledOnce, 'Render is called once.');

    t.end();
});

test('Tests Row renderForm implementation for bottom', (t: test.Test) => {

    let createWrapperSpy = sinon.spy(Row.prototype, <any>'createWrapper');
    let removePreviousIfActiveSpy = sinon.spy(Row.prototype, 'removePreviousIfActive');
    let appendChild = sinon.spy(HTMLElement.prototype, 'appendChild');
    let addListenerForSubmissionCookiesSpy = sinon.spy(Row.prototype, 'addListenerForSubmissionCookies');
    let addListenerForSubmissionIdentifyCookies = sinon.spy(Row.prototype, 'addListenerForSubmissionIdentifyCookies');
    let addCloseEventListener = sinon.spy(Row.prototype, 'addCloseEventListener');
    let attachScripts = sinon.spy(Row.prototype, 'attachScripts');

    let popup = new Row('b835a45dd3e54d43ae1c61f1164cca02', { Form_Position: 'bottom' } as IFormSettingsGet, "<div class='test'>Form</div>");

    createWrapperSpy.restore();
    removePreviousIfActiveSpy.restore();
    appendChild.restore();
    addListenerForSubmissionCookiesSpy.restore();
    addListenerForSubmissionIdentifyCookies.restore();
    addCloseEventListener.restore();
    attachScripts.restore();

    t.assert(createWrapperSpy.calledOnce, 'createWrapper is called.');
    t.assert(removePreviousIfActiveSpy.calledOnce, 'removePreviousIfActive is called once.');
    t.assert(appendChild.called, 'appendChild is called once.');
    t.assert(appendChild.calledAfter(removePreviousIfActiveSpy), 'appendChild is called after removePreviousIfActive.');
    t.assert(addListenerForSubmissionCookiesSpy.calledOnce, 'addListenerForSubmissionCookies is called.');
    t.assert(addListenerForSubmissionIdentifyCookies.calledOnce, 'addListenerForSubmissionIdentifyCookies is called.');
    t.assert(addCloseEventListener.calledOnce, 'addCloseEventListener is called.');
    t.assert(attachScripts.calledOnce, 'attachScripts is called.');

    t.end();
});

test('Tests Row renderForm implementation for top', (t: test.Test) => {

    let createWrapperSpy = sinon.spy(Row.prototype, <any>'createWrapper');
    let removePreviousIfActiveSpy = sinon.spy(Row.prototype, 'removePreviousIfActive');
    let createWrappersForFixedSpy = sinon.spy(Row.prototype, 'createWrappersForFixed');
    let appendChild = sinon.spy(HTMLElement.prototype, 'appendChild');
    let insertBeforeSpy = sinon.spy(HTMLElement.prototype, 'insertBefore');
    let addBlueprintHeightSpy = sinon.spy(Row.prototype, 'addBlueprintHeight');
    let addListenerForSubmissionCookiesSpy = sinon.spy(Row.prototype, 'addListenerForSubmissionCookies');
    let addListenerForSubmissionIdentifyCookies = sinon.spy(Row.prototype, 'addListenerForSubmissionIdentifyCookies');
    let addCloseEventListener = sinon.spy(Row.prototype, 'addCloseEventListener');
    let attachScripts = sinon.spy(Row.prototype, 'attachScripts');

    let popup = new Row('b835a45dd3e54d43ae1c61f1164cca02', { Form_Position: 'top' } as IFormSettingsGet, "<div class='test'>Form</div>");

    createWrapperSpy.restore();
    removePreviousIfActiveSpy.restore();
    createWrappersForFixedSpy.restore();
    appendChild.restore();
    addBlueprintHeightSpy.restore();
    addListenerForSubmissionCookiesSpy.restore();
    addListenerForSubmissionIdentifyCookies.restore();
    addCloseEventListener.restore();
    attachScripts.restore();
    insertBeforeSpy.restore();

    t.assert(createWrapperSpy.calledOnce, 'createWrapper is called.');
    t.assert(removePreviousIfActiveSpy.calledOnce, 'removePreviousIfActive is called once.');
    t.assert(createWrappersForFixedSpy.calledOnce, 'createWrappersForFixedSpy is called once.');
    t.assert(appendChild.called, 'appendChild is called once.');
    t.assert(appendChild.calledAfter(removePreviousIfActiveSpy), 'appendChild is called after removePreviousIfActive.');
    t.assert(insertBeforeSpy.called, 'insertBeforeSpy is called.');
    t.assert(addBlueprintHeightSpy.calledOnce, 'addBlueprintHeightSpy is called once.');
    t.assert(addListenerForSubmissionCookiesSpy.calledOnce, 'addListenerForSubmissionCookies is called.');
    t.assert(addListenerForSubmissionIdentifyCookies.calledOnce, 'addListenerForSubmissionIdentifyCookies is called.');
    t.assert(addCloseEventListener.calledOnce, 'addCloseEventListener is called.');
    t.assert(attachScripts.calledOnce, 'attachScripts is called.');

    t.end();
});

test('Tests Row attachStyle implementation', (t: test.Test) => {

    let createElementSpy = sinon.spy(Document.prototype, 'createElement');
    let querySelectorSpy = sinon.spy(Document.prototype, 'querySelector');
    let insertBeforeSpy = sinon.spy(HTMLElement.prototype, 'insertBefore');

    let popup = new Row('b835a45dd3e54d43ae1c61f1164cca02', { Form_Position: 'top' } as IFormSettingsGet, "<div class='test'>Form</div>");
    
    createElementSpy.restore();
    querySelectorSpy.restore();
    insertBeforeSpy.restore();

    t.assert(createElementSpy.called, 'createElement is called.');
    t.assert(querySelectorSpy.calledOnce, 'querySelector is called.');
    t.assert(insertBeforeSpy.called, 'insertBefore is called.');

    t.end();
});

test('Tests Row addCloseEventListener implementation', (t: test.Test) => {

    let addEventListenerSpy = sinon.spy(Document.prototype, 'addEventListener');

    Row.prototype.addCloseEventListener(document.createElement('div'), 'b835a45dd3e54d43ae1c61f1164cca02', 'top');
    
    addEventListenerSpy.restore();

    t.assert(addEventListenerSpy.called, 'addEventListener is called.');

    t.end();
});

test('Tests Row createWrappersForFixed implementation', (t: test.Test) => {

    let createElementSpy = sinon.spy(Document.prototype, 'createElement');

    Row.prototype.createWrappersForFixed();

    createElementSpy.restore();

    t.assert(createElementSpy.calledOnce, 'createElement is called once.');

    t.end();
});