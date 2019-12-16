const cookie = require("js-cookie");
import Form from './Form';

export default class ScrollBox extends Form {

    styleToAttach: string;
    classForWrapper: string = 'msf-sticky';

    constructor(entityId: string, settings: any, blueprintHtml: string) {

        super(entityId, settings, blueprintHtml);

        this.renderForm(settings);

    }

    renderForm(settings: any): void {

        let formEl = this.createWrapper();
        formEl.innerHTML = this.blueprintHtml;
        formEl.className = `${this.classForWrapper}-${this.settings.Form_Position}`;

        this.removePreviousIfActive(`.${this.classForWrapper}-${this.settings.Form_Position}`);

        document.body.appendChild(formEl);

        if(this.settings.Avoid_Submission_OnOff == "true") {
            
            this.addListenerForSubmissionCookies(this.entityId);
            
        }

        this.attachStyle(formEl, this.settings.Form_Position);
        this.addListenerToButton(formEl);
        this.addListenerToText(formEl);
        this.attachScripts(formEl);
    }

    attachStyle(formEl: HTMLElement, position: string = "right"): void {

        this.styleToAttach = "{ width: 100%; max-width: 500px; position: fixed; " + position + ": 0; bottom: 0; z-index: 100000; }";

        let styleGlobal = document.createElement("style");
        styleGlobal.innerHTML = `${this.parentSelectorForStyle}${this.entityId} ${this.styleToAttach}` ;

        let elementWrapper = document.querySelector(`${this.parentSelectorForStyle}${this.entityId} .moosend-main-form-wrapper`);
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