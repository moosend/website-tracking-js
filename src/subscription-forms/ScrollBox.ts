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
            
        this.addListenerForSubmissionCookies(this.entityId);

        // Add user_email cookie for PHP plugins
        this.addListenerForSubmissionIdentifyCookies(this.entityId);

        this.attachStyle(formEl, this.settings.Form_Position);
        this.addCloseEventListener(formEl, this.entityId);
        this.attachScripts(formEl);
    }

    attachStyle(formEl: HTMLElement, position: string = "right"): void {

        let doc = this.getParsedHtmlToDom(this.blueprintHtml);
        let formHtml = <HTMLElement>doc.querySelector('.moosend-main-form-wrapper');
        let widthOfBlueprint = formHtml && formHtml.style.maxWidth;
        
        this.styleToAttach = "{ width: " + widthOfBlueprint + "; position: fixed; " + position + ": 0; bottom: 0; z-index: 100000; }";

        let styleGlobal = document.createElement("style");
        styleGlobal.innerHTML = `${this.parentSelectorForStyle}${this.entityId} ${this.styleToAttach}` ;

        let elementWrapper = document.querySelector(`${this.parentSelectorForStyle}${this.entityId} .moosend-main-form-wrapper`);
        formEl.insertBefore(styleGlobal, elementWrapper);
    }

    addCloseEventListener(formEl: HTMLElement, entityId: string): void {
        document && document.addEventListener(`moosend-form-close-event-${entityId}`, function () {
            formEl.remove();
        });
    }
}