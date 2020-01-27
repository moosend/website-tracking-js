import Popup from '../src/subscription-forms/Popup';
import test = require("tape");
import sinon = require("sinon");
import { IFormSettingsGet } from '../src/subscription-forms/model';

test('Creates a basic popup if trigger is not given.', (t: test.Test) => {

    let renderFormSpy = sinon.spy(Popup.prototype, 'renderForm');
    
    let popup = new Popup('b835a45dd3e54d43ae1c61f1164cca02', {  } as IFormSettingsGet, "<div class='test'>Form</div>");
    
    renderFormSpy.restore();

    t.assert(renderFormSpy.calledOnce, 'Render is called once.');

    t.end();
});

test('Creates a timed popup on visit', (t: test.Test) => {

    let renderWithDelay = sinon.stub(Popup.prototype, 'renderWithDelay');
    
    let popup = new Popup('b835a45dd3e54d43ae1c61f1164cca02', { Popup_Trigger: "visit" } as IFormSettingsGet, "<div class='test'>Form</div>");
    
    renderWithDelay.restore();

    t.assert(renderWithDelay.calledOnce, 'Render is called once.');

    t.end();
});

test('Creates a popup on exit', (t: test.Test) => {

    let renderOnExitSpy = sinon.stub(Popup.prototype, 'renderOnExit');
    
    let popup = new Popup('b835a45dd3e54d43ae1c61f1164cca02', { Popup_Trigger: "exit" } as IFormSettingsGet, "<div class='test'>Form</div>");
    
    renderOnExitSpy.restore();

    t.assert(renderOnExitSpy.calledOnce, 'Render is called once.');

    t.end();
});

test('Creates a popup on click trigger', (t: test.Test) => {

    let querySelectorSpy = sinon.stub(document, 'querySelector');
    querySelectorSpy.returns(document.createElement('div'));

    let addEventListenerSpy = sinon.spy(HTMLElement.prototype, 'addEventListener');
    let renderOnClickSpy = sinon.spy(Popup.prototype, 'renderForm');
    
    let popup = new Popup('b835a45dd3e54d43ae1c61f1164cca02', { Popup_Trigger: "click" } as IFormSettingsGet, "<div class='test'>Form</div>");
    
    querySelectorSpy.restore();
    addEventListenerSpy.restore();
    renderOnClickSpy.restore();

    t.assert(addEventListenerSpy.calledOnce, 'Listener for click is binded.');

    t.end();
});
