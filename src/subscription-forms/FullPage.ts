const cookie = require("js-cookie");
import Form from './Form';

export default class Popup extends Form {

    styleToAttach = "{ position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 9999 } ";
    classForWrapper = "msf-popup msf-fullpage";

    constructor(entityId: string, settings: any, blueprintHtml: string) {

        super(entityId, settings, blueprintHtml);

        this.renderForm();
    }

    renderForm = (): void => {

        let formEl = this.createWrapper();
        formEl.innerHTML = this.blueprintHtml;
        formEl.className = this.classForWrapper;

        // Remove all the previous Popups if active
        let wrapperClasses = (this.classForWrapper).split(" ");
        this.removePreviousIfActive(`.${wrapperClasses[0]}.${wrapperClasses[1]}`);

        document.body.appendChild(formEl);

        this.addListenerForSubmissionCookies(this.entityId);

        // Add user_email cookie for PHP plugins
        this.addListenerForSubmissionIdentifyCookies(this.entityId);

        this.attachStyle(formEl);
        this.addCloseEventListener(formEl, this.entityId);

        this.attachScripts(formEl);
    }

    attachStyle(formEl: HTMLElement): void {

        let styleGlobal = document.createElement("style");
        styleGlobal.innerHTML = `${this.parentSelectorForStyle}${this.entityId} ${this.styleToAttach}`;

        let elementWrapper = document.querySelector(`${this.parentSelectorForStyle}${this.entityId} .moosend-main-form-wrapper`);
        formEl.insertBefore(styleGlobal, elementWrapper);
    }

    addCloseEventListener(formEl: HTMLElement, entityId: string): void {
        formEl && formEl.addEventListener(`moosend-form-close-event-${entityId}`, function () {
            formEl.remove();
        });
    }

    isPopupActive = (formId: string) => {

        if (document.querySelector(`${this.parentSelectorForStyle}${formId}`) !== null) {

            return true;
        }

        return false;
    }
}