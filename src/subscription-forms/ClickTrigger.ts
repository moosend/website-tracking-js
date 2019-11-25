import Form from './Form';

export default class ClickTrigger extends Form {

    private elementWrapper: HTMLElement;

    styleToAttach = "#mooforms { width: 100%; max-width: 500px; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); box-shadow: 0px 9px 30px 0px rgba(0,0,0,0.75); z-index: 100000; } #close-moo { position: absolute; top: 0; right: 0; background-color: white; z-index: 999; }";

    constructor(entityId: string, settings: any, blueprintHtml: string) {

        super(entityId, settings, blueprintHtml);

        const button = document.querySelector('#moo-click');

        let objectBind = this;

        button.addEventListener('click', function(e) {
            e.preventDefault;

            objectBind.renderForm();
        });
        
    }

    renderForm(): void {

        let formEl = this.createWrapper();
        formEl.innerHTML = this.blueprintHtml;
        document.body.appendChild(formEl);

        this.attachStyle(formEl);
        this.attachCloseButton(formEl);
        this.attachScripts(formEl);
    }

    attachStyle(formEl: HTMLElement): void {

        let styleGlobal = document.createElement("style");
        styleGlobal.innerHTML = this.styleToAttach;

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