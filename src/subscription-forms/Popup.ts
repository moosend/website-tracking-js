import Form from './Form';

export default class Popup extends Form {

    styleToAttach = "{ width: 100%; max-width: 500px; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); box-shadow: 0px 9px 30px 0px rgba(0,0,0,0.75); z-index: 100000; } ";
    buttonCloseStyle: string = "{ position: absolute; top: 0; right: 0; background-color: white; z-index: 999; }";

    constructor(entityId: number, settings: Array<any> , blueprintHtml: string) {

        super(entityId, settings, blueprintHtml);

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
        styleGlobal.innerHTML = `#mooform${this.entityId} ${this.styleToAttach} #mooform${this.entityId} .close-moo ${this.buttonCloseStyle}` ;

        let elementWrapper = document.querySelector(`#mooform${this.entityId} .main-form-wrapper`);
        formEl.insertBefore(styleGlobal, elementWrapper);
    }

    attachCloseButton(formEl: HTMLElement): void {

        let closeButton = document.createElement("div");
        closeButton.className = "close-moo";
        closeButton.innerHTML = "EXIT";

        let elementWrapper = document.querySelector(`#mooform${this.entityId} .main-form-wrapper`);
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