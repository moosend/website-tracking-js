const cookie = require("js-cookie");
import Form from './Form';
import { IFormSettingsGet } from './model';

export default class Popup extends Form {

    styleToAttach = "{ position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 9999 } ";
    buttonCloseStyle: string = "{ position: absolute; top: 0; right: 0; background-color: white; z-index: 999; }";
    classForWrapper = "msf-popup";

    constructor(entityId: string, settings: any, blueprintHtml: string) {

        super(entityId, settings, blueprintHtml);

        if (this.settings.Popup_Trigger == "visit") {

            this.renderWithDelay(parseInt(this.settings.Timed_Show_After), this.settings.Timed_Show_Type);

        } else if (this.settings.Popup_Trigger == "exit") {

            this.renderOnExit();

        } else if (this.settings.Popup_Trigger == "click") {

            let clickElement: HTMLElement = document.querySelector(`#click-trigger[data-mooform-id="${this.entityId}"]`);

            if (clickElement !== null) {
                clickElement.addEventListener('click', this.renderIfNotActive);
            }
        } else {

            this.renderForm();
        }
    }

    renderForm = (): void => {

        let formEl = this.createWrapper();
        formEl.innerHTML = this.blueprintHtml;
        formEl.className = this.classForWrapper;

        // Remove all the previous Popups if active
        this.removePreviousIfActive(this.classForWrapper);

        document.body.appendChild(formEl);

        let formElementId: string = formEl.querySelector('form').id;

        if (this.settings.Avoid_Submission_OnOff == "true") {
            document.addEventListener(`success-form-submit-${formElementId}`, () => {

                cookie.set(`msf_already_submitted_${formElementId}`, true, { expires: 120 });
            });
        }

        this.settings.Exit_Show_After = this.settings.Exit_Show_After ? this.settings.Exit_Show_After : '0';

        if (this.settings.Popup_Trigger == "exit") {
            this.settings.Timed_Last_Appearance_After = this.settings.Exit_Show_After ? this.settings.Exit_Show_After : '0';
            this.settings.Timed_Last_Appearance_Type = this.settings.Exit_Show_Type;
        }

        this.setIntervalToShowCookie(formElementId, parseInt(this.settings.Timed_Last_Appearance_After), this.settings.Timed_Last_Appearance_Type);

        this.attachStyle(formEl);
        this.addListenerToButton(formEl);
        this.addListenerToOverlay(formEl);
        this.addListenerToText(formEl);

        this.attachScripts(formEl);
    }

    attachStyle(formEl: HTMLElement): void {

        let styleGlobal = document.createElement("style");
        styleGlobal.innerHTML = `#mooform${this.entityId} ${this.styleToAttach} #mooform${this.entityId} .close-moo ${this.buttonCloseStyle}`;

        let elementWrapper = document.querySelector(`#mooform${this.entityId} .moosend-main-form-wrapper`);
        formEl.insertBefore(styleGlobal, elementWrapper);
    }

    addListenerToButton(formEl: HTMLElement): void {

        const icon = formEl.querySelector(`.moosend-main-form-wrapper .content .moosend-form-close-icon`);

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

    addListenerToOverlay(formEl: HTMLElement): void {

        const overlay = formEl.querySelector(`.moosend-main-form-wrapper .moosend-form-close-overlay`);

        overlay && overlay.addEventListener('click', function () {
            formEl.remove();
        });
    }

    renderWithDelay(after: number = 0, type: string = "seconds"): void {

        setTimeout(this.renderForm, after * this.timedValues[type]());
    }

    renderOnExit(): void {

        document.documentElement.addEventListener("mouseleave", this.onMouseOut);
    }

    onMouseOut = (e: any, after: number = 0, type: string = "seconds") => {
        // Remove this event listener
        document.documentElement.removeEventListener("mouseleave", this.onMouseOut);

        this.renderForm();
    }

    setIntervalToShowCookie = (formId: string, after: number = 0, type: string = "seconds") => {

        let typeValue = this.getTypeValue(after, type);

        cookie.set(`msf_already_shown_${formId}`, true, { expires: typeValue });
    }

    getTypeValue = (after: number = 0, type: string = "seconds"): Date => {

        return new Date(new Date().getTime() + after * this.timedValues[type]());
    }

    isPopupActive = (formId: string) => {

        if (document.querySelector(`#mooform${formId}`) !== null) {

            return true;
        }

        return false;
    }

    renderIfNotActive = () => {

        if (!this.isPopupActive(this.entityId)) {
            
            this.renderForm();
        }
    }
}