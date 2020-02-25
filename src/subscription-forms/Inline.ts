import Form from './Form';

export default class Inline extends Form {
    
    selectorsToShow: NodeList;

    constructor(entityId: string, settings: any, blueprintHtml: string) {

        super(entityId, settings, blueprintHtml);

        this.renderForm(`div[data-mooform-id="${entityId}"]`);
    }

    renderForm(selector: string): void {

        this.selectorsToShow = document.querySelectorAll(selector);

        for (let i = 0; i < this.selectorsToShow.length; i++) {

            let formEl = this.createWrapper();
            formEl.innerHTML = this.blueprintHtml;
            
            this.selectorsToShow[i].appendChild(formEl);
            
            this.attachScripts(formEl);
        }
    }
}