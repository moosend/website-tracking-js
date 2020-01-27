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