const cookie = require("js-cookie");
import Form from './Form';

export default class Popup extends Form {

    styleToAttach = "{ position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 9999 } ";
    classForWrapper = "msf-popup msf-fullpage";

    constructor(entityId: string, settings: any, blueprintHtml: string) {

        super(entityId, settings, blueprintHtml);

        if (this.settings.Popup_Trigger == "visit") {

            this.renderWithDelay(parseInt(this.settings.Timed_Show_After), this.settings.Timed_Show_Type);

        } else if (this.settings.Popup_Trigger == "exit") {

            this.renderOnExit();
        } else {

            this.renderForm();
        }
    }

    renderForm(): void {

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

        this.setIntervalToShowCookie(this.entityId, parseInt(this.settings.Timed_Last_Appearance_After), this.settings.Timed_Last_Appearance_Type);

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

    isPopupActive = (formId: string) => {

        if (document.querySelector(`${this.parentSelectorForStyle}${formId}`) !== null) {

            return true;
        }

        return false;
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
}