import Form from './Form';

export default class Inline extends Form {

    styleToAttach = "{ width: 100%; max-width: 500px; }";

    constructor(entityId: number, settings: Array<string>, blueprintHtml: string) {

        super(entityId, settings, blueprintHtml);

        this.renderForm('body');

    }

    renderForm = (selector: string): void => {

        let formEl = this.createWrapper();
        formEl.innerHTML = this.blueprintHtml;

        document.querySelector(selector).appendChild(formEl);

        this.attachStyle(formEl);
        this.attachScripts(formEl);
    }

    attachStyle(formEl: HTMLElement): void {

        let styleGlobal = document.createElement("style");
        styleGlobal.innerHTML = `#mooform${this.entityId} ${this.styleToAttach}` ;

        let elementWrapper = document.querySelector(".main-form-wrapper");
        formEl.insertBefore(styleGlobal, elementWrapper);
    }
}