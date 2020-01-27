import test = require("tape");
import sinon = require("sinon");
import ScrollBox from "../src/subscription-forms/ScrollBox";
import { IFormSettingsGet } from '../src/subscription-forms/model';

test('Creates a basic scroll box form.', (t: test.Test) => {

    let renderFormStub = sinon.stub(ScrollBox.prototype, 'renderForm');
    
    let popup = new ScrollBox('b835a45dd3e54d43ae1c61f1164cca02', {  } as IFormSettingsGet, "<div class='test'>Form</div>");
    
    renderFormStub.restore();

    t.assert(renderFormStub.calledOnce, 'Render is called once.');

    t.end();
});