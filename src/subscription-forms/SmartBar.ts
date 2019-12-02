const cookie = require("js-cookie");
import Form from './Form';

export default class SmartBar extends Form {

    private elementWrapper: HTMLElement;

    styleToAttach: string;

    constructor(entityId: string, settings: any, blueprintHtml: string) {

        super(entityId, settings, blueprintHtml);

        this.renderForm();

    }

    renderForm(): void {

        let formEl = this.createWrapper();
        formEl.innerHTML = this.blueprintHtml;

        let positionVal = 'static';

        if(this.settings.Form_Position == 'bottom') {

            positionVal = 'fixed';
            document.body.appendChild(formEl);
        } else {

            document.body.insertBefore(formEl, document.body.firstChild);
        }

        let formElementId: string = formEl.querySelector('form').id;

        if(this.settings.Avoid_Submission_OnOff == "true") {
            document.addEventListener(`success-form-submit-${formElementId}`, () => {

                cookie.set(`msf_already_submitted_${formElementId}`, true, { expires: 120 });
            });
        }
        
        this.attachStyle(formEl, positionVal, this.settings.Form_Position);
        this.attachScripts(formEl);
    }

    attachStyle(formEl: HTMLElement, position: string = "static", verticalPosition: string = "top"): void {

        this.styleToAttach = `{ width: 100%; position: ${position}; ${verticalPosition}: 0; left: 0; right: 0; z-index: 100000; }`;

        let styleGlobal = document.createElement("style");
        styleGlobal.innerHTML = `#mooform${this.entityId} ${this.styleToAttach}` ;

        let elementWrapper = document.querySelector(`#mooform${this.entityId} .main-form-wrapper`);
        formEl.insertBefore(styleGlobal, elementWrapper);
    }
}