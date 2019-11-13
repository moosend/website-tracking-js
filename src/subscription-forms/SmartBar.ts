import Form from './Form';

export default class SmartBar extends Form {

    private elementWrapper: HTMLElement;

    styleToAttach = "#mooforms { width: 100%; position: fixed; top: 0; left: 0; right: 0; z-index: 100000; }";

    constructor(settings: Array<string>, blueprintHtml: string) {

        super(settings, blueprintHtml);

        this.renderForm();

    }

    renderForm(): void {

        let formEl = this.createWrapper();
        formEl.innerHTML = this.blueprintHtml;
        document.body.appendChild(formEl);

        this.attachStyle(formEl);
        this.attachScripts(formEl);
    }

    attachStyle(formEl: HTMLElement): void {

        let styleGlobal = document.createElement("style");
        styleGlobal.innerHTML = this.styleToAttach;

        let elementWrapper = document.querySelector(".main-form-wrapper");
        formEl.insertBefore(styleGlobal, elementWrapper);
    }
}