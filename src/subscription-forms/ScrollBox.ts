const cookie = require("js-cookie");
import Form from './Form';

export default class ScrollBox extends Form {

    buttonCloseStyle: string = "{ position: absolute; top: 0; right: 0; background-color: white; z-index: 999; }";

    styleToAttach: string;

    constructor(entityId: string, settings: any, blueprintHtml: string) {

        super(entityId, settings, blueprintHtml);

        this.renderForm(settings);

    }

    renderForm(settings: any): void {

        let formEl = this.createWrapper();
        formEl.innerHTML = this.blueprintHtml;
        document.body.appendChild(formEl);

        let formElementId: string = formEl.querySelector('form').id;

        if(this.settings.Avoid_Submission_OnOff == "true") {
            document.addEventListener(`success-form-submit-${formElementId}`, () => {

                cookie.set(`msf_already_submitted_${formElementId}`, true, { expires: 120 });
            });
        }

        this.attachStyle(formEl, this.settings.Form_Position);
        this.addListenerToButton(formEl);
        this.addListenerToText(formEl);
        this.attachScripts(formEl);
    }

    attachStyle(formEl: HTMLElement, position: string = "right"): void {

        this.styleToAttach = "{ width: 100%; max-width: 500px; position: fixed; " + position + ": 0; bottom: 0; z-index: 100000; }";

        let styleGlobal = document.createElement("style");
        styleGlobal.innerHTML = `#mooform${this.entityId} ${this.styleToAttach} #mooform${this.entityId} .close-moo ${this.buttonCloseStyle}` ;

        let elementWrapper = document.querySelector(`#mooform${this.entityId} .moosend-main-form-wrapper`);
        formEl.insertBefore(styleGlobal, elementWrapper);
    }

    addListenerToButton(formEl: HTMLElement): void {

        const icon = formEl.querySelector(`.moosend-main-form-wrapper .moosend-form-close-icon`);

        icon && icon.addEventListener('click', function () {
            formEl.remove();
        });
    }

    addListenerToText(formEl: HTMLElement): void {

        const text = formEl.querySelector('.moosend-main-form-wrapper .content form .moosend-form-close-text');

        text && text.addEventListener('click', function () {
            formEl.remove();
        });
    }
}