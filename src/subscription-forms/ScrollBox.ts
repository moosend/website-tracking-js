import Form from './Form';

export default class ScrollBox extends Form {

    buttonCloseStyle: string = "#close-moo { position: absolute; top: 0; right: 0; background-color: white; z-index: 999; }";

    styleToAttach: string;

    constructor(settings: Array<string>, blueprintHtml: string) {

        super(settings, blueprintHtml);

        this.renderForm(settings);

    }

    renderForm(settings: any): void {

        let formEl = this.createWrapper();
        formEl.innerHTML = this.blueprintHtml;
        document.body.appendChild(formEl);

        this.attachStyle(formEl, settings[0]);
        this.attachCloseButton(formEl);
    }

    attachStyle(formEl: HTMLElement, position: string = "right"): void {

        this.styleToAttach = "#mooforms { width: 100%; max-width: 500px; position: fixed;" + position + ": 30px; bottom: 30px; z-index: 100000; box-shadow: 0px 9px 30px 0px rgba(0,0,0,0.75); }";

        let styleGlobal = document.createElement("style");
        styleGlobal.innerHTML = this.styleToAttach + this.buttonCloseStyle;

        let elementWrapper = document.querySelector(".main-form-wrapper");
        formEl.insertBefore(styleGlobal, elementWrapper);
    }

    attachCloseButton(formEl: HTMLElement): void {

        let closeButton = document.createElement("div");
        closeButton.id = "close-moo";
        closeButton.innerHTML = "EXIT";

        let elementWrapper = document.querySelector(".main-form-wrapper");
        formEl.insertBefore(closeButton, elementWrapper);

        closeButton.addEventListener('click', function() {
            this.parentElement.remove();
        });
    }
}