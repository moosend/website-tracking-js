import Form from './Form';

export default class Popup extends Form {

    styleToAttach = "#mooforms { width: 100%; max-width: 500px; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); box-shadow: 0px 9px 30px 0px rgba(0,0,0,0.75); z-index: 100000; } ";
    buttonCloseStyle: string = "#close-moo { position: absolute; top: 0; right: 0; background-color: white; z-index: 999; }";

    constructor(settings: Array<any> , blueprintHtml: string) {

        super(settings, blueprintHtml);

        this.renderForm();
    }

    renderForm = (): void => {

        let formEl = this.createWrapper();

        formEl.innerHTML = this.blueprintHtml;

        document.body.appendChild(formEl);

        this.attachStyle(formEl);
        this.attachCloseButton(formEl);

        this.attachScripts(formEl);
    }

    attachStyle(formEl: HTMLElement): void {

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

        closeButton.addEventListener('click', function () {
            this.parentElement.remove();
        });
    }

    renderWithDelay(time: number = 0): void {

        setTimeout(this.renderForm, time);
    }

    renderOnExit(): void {

        document.documentElement.addEventListener("mouseleave", this.onMouseOut);
    }

    onMouseOut = (e: any) => {
        // Remove this event listener
        document.documentElement.removeEventListener("mouseleave", this.onMouseOut);

        // Show the popup
        this.renderForm();
    }
}