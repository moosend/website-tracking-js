import Form from './Form';

export default class Inline extends Form {

    styleToAttach = "{ width: 100%; max-width: 500px; }";

    constructor(entityId: string, settings: any, blueprintHtml: string) {

        super(entityId, settings, blueprintHtml);

        this.renderForm('body');
    }

    renderForm = (selector: string): void => {

        let formEl = this.createWrapper();
        formEl.innerHTML = this.blueprintHtml;

        document.querySelector(selector).appendChild(formEl);

        this.addListenerForSubmissionCookies(this.entityId);

        // Add user_email cookie for PHP plugins
        this.addListenerForSubmissionIdentifyCookies(this.entityId);
        
        this.addCloseEventListener(formEl, this.entityId);
        this.attachScripts(formEl);
    }

    addCloseEventListener(formEl: HTMLElement, entityId: string): void {
        document && document.addEventListener(`moosend-form-close-event-${entityId}`, function () {
            formEl.remove();
        });
    }
}