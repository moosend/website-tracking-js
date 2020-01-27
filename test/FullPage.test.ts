import FullPage from '../src/subscription-forms/FullPage';
import test = require("tape");
import sinon = require("sinon");
import { IFormSettingsGet } from '../src/subscription-forms/model';

test('Creates a basic full page popup', (t: test.Test) => {

    let renderFormStub = sinon.stub(FullPage.prototype, 'renderForm');
    
    let popup = new FullPage('b835a45dd3e54d43ae1c61f1164cca02', {  } as IFormSettingsGet, "<div class='test'>Form</div>");
    
    renderFormStub.restore();

    t.assert(renderFormStub.calledOnce, 'Render is called once.');

    t.end();
});
