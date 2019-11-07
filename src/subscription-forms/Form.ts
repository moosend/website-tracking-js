export default class Form {

    settings: Array<any>;
    blueprintHtml: string;

    constructor(settings: Array<any>, blueprintHtml: string) {
        
        this.settings = settings;
        this.blueprintHtml = blueprintHtml;
    }

    protected createWrapper(): HTMLElement {
        
        let formEl = document.createElement("div");
        formEl.id = "mooforms";

        return formEl;
    }
}