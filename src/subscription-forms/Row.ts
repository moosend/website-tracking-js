import Form from './Form';

export default class Row extends Form {

    classForWrapper: string;

    styleToAttach: string;

    constructor(entityId: string, settings: any, blueprintHtml: string) {

        super(entityId, settings, blueprintHtml);

        this.renderForm();

    }

    renderForm(): void {

        let formEl = this.createWrapper();

        if (this.settings.Form_Position == 'bottom') {

            this.classForWrapper = "msf-row-bottom";
            this.removePreviousIfActive(`.${this.classForWrapper}`);
            this.styleToAttach = `{ width: 100%; position: fixed; bottom: 0; left: 0; right: 0; z-index: 100000; }`;
            document.body.appendChild(formEl);
            formEl.innerHTML = this.blueprintHtml;
            formEl.className = this.classForWrapper;
        } else {

            this.classForWrapper = "msf-row-top";
            this.removePreviousIfActive(`.${this.classForWrapper}`);
            this.styleToAttach = `{ width: auto; z-index: 100000; }`;
            let formWrapper = formEl;
            formEl = this.createWrappersForFixed();
            formWrapper.appendChild(formEl);
            document.body.insertBefore(formWrapper, document.body.firstChild);
            formEl.innerHTML = this.blueprintHtml;
            formWrapper.className = this.classForWrapper;
            this.addBlueprintHeight(formEl);
        }

        this.addListenerForSubmissionCookies(this.entityId);

        // Add user_email cookie for PHP plugins
        this.addListenerForSubmissionIdentifyCookies(this.entityId);

        this.attachStyle(formEl, this.styleToAttach);
        this.addCloseEventListener(formEl, this.entityId, this.settings.Form_Position);
        this.attachScripts(formEl);
    }

    attachStyle(formEl: HTMLElement, styleToAttach: string): void {

        let styleGlobal = document.createElement("style");
        styleGlobal.innerHTML = `${this.parentSelectorForStyle}${this.entityId} ${styleToAttach}`;

        let elementWrapper = document.querySelector(`${this.parentSelectorForStyle}${this.entityId} .moosend-main-form-wrapper`);
        formEl.insertBefore(styleGlobal, elementWrapper);
    }

    addCloseEventListener(formEl: HTMLElement, entityId: string, position: string): void {
        document && document.addEventListener(`moosend-form-close-event-${entityId}`, function () {
            formEl.remove();

            if (position == "top") {
                document.body.style.marginTop = "";
            }
        });
    }

    createWrappersForFixed(): HTMLElement {

        let fixedWrapper = document.createElement("div");
        fixedWrapper.className = "msf-row-fixed";
        fixedWrapper.style.cssText = "position: fixed; width: 100%; top: 0; left: 0; z-index: 9999;";

        return fixedWrapper;
    }

    addBlueprintHeight = (blueprintHtml: HTMLElement) => {

        document.body.style.marginTop = (blueprintHtml.offsetHeight).toString() + "px";
    }
}