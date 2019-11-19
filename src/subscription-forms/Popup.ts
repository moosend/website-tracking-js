const cookie = require("js-cookie");
import Form from './Form';
import { IFormSettingsGet } from './model';

export default class Popup extends Form {

    styleToAttach = "{ width: 100%; max-width: 500px; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); box-shadow: 0px 9px 30px 0px rgba(0,0,0,0.75); z-index: 100000; } ";
    buttonCloseStyle: string = "{ position: absolute; top: 0; right: 0; background-color: white; z-index: 999; }";

    constructor(entityId: number, settings: any, blueprintHtml: string) {

        super(entityId, settings, blueprintHtml);

        if(this.settings.Popup_Trigger == "visit") {
            this.renderWithDelay();
        } else if(this.settings.Popup_Trigger == "trigger") {
            this.renderOnExit();
        }
    }

    renderForm = (): void => {

        let formEl = this.createWrapper();

        formEl.innerHTML = this.blueprintHtml;

        document.body.appendChild(formEl);

        let formElementId: string = formEl.querySelector('form').id;

        if(this.settings.Avoid_Submission_OnOff == "true") {
            document.addEventListener(`success-form-submit-${formElementId}`, () => {

                cookie.set(`already_submitted_${formElementId}`, true);
            });
        }
        
        this.attachStyle(formEl);
        this.attachCloseButton(formEl);

        this.attachScripts(formEl);
    }

    attachStyle(formEl: HTMLElement): void {

        let styleGlobal = document.createElement("style");
        styleGlobal.innerHTML = `#mooform${this.entityId} ${this.styleToAttach} #mooform${this.entityId} .close-moo ${this.buttonCloseStyle}` ;

        let elementWrapper = document.querySelector(`#mooform${this.entityId} .main-form-wrapper`);
        formEl.insertBefore(styleGlobal, elementWrapper);
    }

    attachCloseButton(formEl: HTMLElement): void {

        let closeButton = document.createElement("div");
        closeButton.className = "close-moo";
        closeButton.innerHTML = "EXIT";

        let elementWrapper = document.querySelector(`#mooform${this.entityId} .main-form-wrapper`);
        formEl.insertBefore(closeButton, elementWrapper);

        closeButton.addEventListener('click', function () {
            this.parentElement.remove();
        });
    }

    renderWithDelay(after: number = 0, type: string = "seconds"): void {

        setTimeout(this.renderForm, after * 1000);
    }

    renderOnExit(): void {

        document.documentElement.addEventListener("mouseleave", this.onMouseOut);
    }

    onMouseOut = (e: any, after: number = 0, type: string = "seconds") => {
        // Remove this event listener
        document.documentElement.removeEventListener("mouseleave", this.onMouseOut);

        setTimeout(this.renderForm, after * 1000);
    }

    setCookieForSubmission = (formId: string) => {

        cookie.set(`already_submitted_${formId}`, true);

        return true;
    }
}