const cookie = require("js-cookie");
import Form from './Form';

export default class Popup extends Form {

    styleToAttach = "{ position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 9999 } ";
    classForWrapper = "msf-popup";

    constructor(entityId: string, settings: any, blueprintHtml: string) {

        super(entityId, settings, blueprintHtml);

        if (this.settings.Popup_Trigger == "visit") {

            this.renderWithDelay(parseInt(this.settings.Timed_Show_After), this.settings.Timed_Show_Type);

        } else if (this.settings.Popup_Trigger == "exit") {

            this.renderOnExit();

        } else if (this.settings.Popup_Trigger == "click") {

            let clickElements = Array.from(document.querySelectorAll(`[data-mooform-id="${this.entityId}"]`));
            
            if (clickElements !== null) {
                
                clickElements.forEach((element) => {

                    element.addEventListener('click', this.renderIfNotActive.bind(this));
                });
            }
        } else {

            this.renderForm();
        }
    }

    renderForm(): void {

        let formEl = this.createWrapper();
        formEl.innerHTML = this.blueprintHtml;
        formEl.className = this.classForWrapper;

        // Remove all the previous Popups if active
        this.removePreviousIfActive(`.${this.classForWrapper}`);

        document.body.appendChild(formEl);

        this.addListenerForSubmissionCookies(this.entityId);

        // Add user_email cookie for PHP plugins
        this.addListenerForSubmissionIdentifyCookies(this.entityId);

        this.settings.Exit_Show_After = this.settings.Exit_Show_After ? this.settings.Exit_Show_After : '0';

        if (this.settings.Popup_Trigger == "exit") {
            this.settings.Timed_Last_Appearance_After = this.settings.Exit_Show_After ? this.settings.Exit_Show_After : '0';
            this.settings.Timed_Last_Appearance_Type = this.settings.Exit_Show_Type;
        }

        if (this.settings.Popup_Trigger != "click") {

            this.setIntervalToShowCookie(this.entityId, parseInt(this.settings.Timed_Last_Appearance_After), this.settings.Timed_Last_Appearance_Type);
        }

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
        document && document.addEventListener(`moosend-form-close-event-${entityId}`, function () {
            formEl.remove();
        });
    }

    renderWithDelay(after: number = 0, type: string = "seconds"): void {

        setTimeout(this.renderForm.bind(this), after * this.timedValues[type]());
    }

    renderOnExit(): void {

        document.documentElement.addEventListener("mouseleave", this.onMouseOut);
    }

    onMouseOut = (e: any, after: number = 0, type: string = "seconds"): void => {
        // Remove this event listener
        document.documentElement.removeEventListener("mouseleave", this.onMouseOut);

        this.renderForm();
    }

    setIntervalToShowCookie(formId: string, after: number = 0, type: string = "seconds"): void {

        let typeValue = this.getTypeValue(after, type);

        cookie.set(`msf_shown_${formId}`, true, { expires: typeValue });
    }

    getTypeValue(after: number = 0, type: string = "seconds"): Date {
        
        return new Date(new Date().getTime() + after * this.timedValues[type]());
    }

    isPopupActive(formId: string): boolean {

        if (document.querySelector(`${this.parentSelectorForStyle}${formId}`) !== null) {

            return true;
        }

        return false;
    }

    renderIfNotActive(e: any): void {

        e.preventDefault();

        if (this.settings.Avoid_Submission_OnOff && this.settings.Avoid_Submission_OnOff === "true" && cookie.get(`msf_submitted_${this.entityId}`) === "true") {

            return;
        }

        if (!this.isPopupActive(this.entityId)) {

            this.renderForm();
        }

    }
}