import test = require("tape");
import sinon = require("sinon");
import Inline from '../src/subscription-forms/Inline';
import { IFormSettingsGet } from '../src/subscription-forms/model';

test('Creates a basic inline form', (t: test.Test) => {

    let renderFormSpy = sinon.spy(Inline.prototype, 'renderForm');
    
    let inline = new Inline('b835a45dd3e54d43ae1c61f1164cca02', {  } as IFormSettingsGet, "<div class='test'>Form</div>");
    
    renderFormSpy.restore();

    t.assert(renderFormSpy.calledOnce, 'Render is called once.');
    t.assert(renderFormSpy.calledOn(inline), 'Render is called for this Inline form.');
    t.assert(renderFormSpy.calledWithExactly(`div[data-mooform-id="b835a45dd3e54d43ae1c61f1164cca02"]`), 'Called with html element to show.');

    t.end();
});

test('Tests Inline form calls when no HTML selector exists', (t: test.Test) => {

    let querySelectorAllSpy = sinon.spy(Document.prototype, 'querySelectorAll');
    let createWrapperSpy = sinon.spy(Inline.prototype, <any>'createWrapper');
    let appendChildSpy = sinon.spy(HTMLElement.prototype, 'appendChild');
    let attachScriptsSpy = sinon.spy(Inline.prototype, 'attachScripts');

    let inline = new Inline('b835a45dd3e54d43ae1c61f1164cca02', {  } as IFormSettingsGet, "<div class='test'>Form</div>");

    querySelectorAllSpy.restore();
    createWrapperSpy.restore();
    appendChildSpy.restore();
    attachScriptsSpy.restore();

    t.assert(querySelectorAllSpy.calledOnce, 'querySelectorAll is called once.');
    t.assert(createWrapperSpy.notCalled, 'createWrapper is not called.');
    t.assert(appendChildSpy.notCalled, 'querySelector is not called.');
    t.assert(attachScriptsSpy.notCalled, 'attachScripts is not called.');

    t.end();
});

test('Tests Inline form calls when one HTML selector exists', (t: test.Test) => {

    let parentEl = document.createElement('div');
    parentEl.appendChild(document.createElement('div'));

    let querySelectorAllSpy = sinon.stub(Document.prototype, 'querySelectorAll').returns(parentEl.childNodes);
    let createWrapperSpy = sinon.spy(Inline.prototype, <any>'createWrapper');
    let appendChildSpy = sinon.spy(HTMLElement.prototype, 'appendChild');
    let attachScriptsSpy = sinon.spy(Inline.prototype, 'attachScripts');

    let inline = new Inline('b835a45dd3e54d43ae1c61f1164cca02', {  } as IFormSettingsGet, "<div class='test'>Form</div>");

    createWrapperSpy.restore();
    appendChildSpy.restore();
    attachScriptsSpy.restore();
    querySelectorAllSpy.restore();

    t.assert(querySelectorAllSpy.calledOnce, 'querySelectorAll is called once.');
    t.assert(createWrapperSpy.calledOnce, 'createWrapper is called once.');
    t.assert(appendChildSpy.called, 'appendChildSpy is called.');
    t.assert(attachScriptsSpy.calledOnce, 'attachScripts is called once.');

    t.end();
});

test('Tests Inline form calls when two HTML selector exists', (t: test.Test) => {

    let parentEl = document.createElement('div');
    parentEl.appendChild(document.createElement('div'));
    parentEl.appendChild(document.createElement('div'));

    let querySelectorAllSpy = sinon.stub(Document.prototype, 'querySelectorAll').returns(parentEl.childNodes);
    let createWrapperSpy = sinon.spy(Inline.prototype, <any>'createWrapper');
    let appendChildSpy = sinon.spy(HTMLElement.prototype, 'appendChild');
    let attachScriptsSpy = sinon.spy(Inline.prototype, 'attachScripts');

    let inline = new Inline('b835a45dd3e54d43ae1c61f1164cca02', {  } as IFormSettingsGet, "<div class='test'>Form</div>");

    createWrapperSpy.restore();
    appendChildSpy.restore();
    attachScriptsSpy.restore();
    querySelectorAllSpy.restore();

    t.assert(querySelectorAllSpy.calledOnce, 'querySelectorAll is called once.');
    t.assert(createWrapperSpy.calledTwice, 'createWrapper is called twice.');
    t.assert(appendChildSpy.called, 'appendChildSpy is called.');
    t.assert(attachScriptsSpy.calledTwice, 'attachScripts is called twice.');

    t.end();
});