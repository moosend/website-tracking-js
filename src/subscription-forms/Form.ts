export default class Form {

    settings: Array < any > ;
    blueprintHtml: string;
    entityId: number;

    constructor(entityId: number, settings: Array < any > , blueprintHtml: string) {

        this.settings = settings;
        this.blueprintHtml = blueprintHtml;
        this.entityId = entityId;
    }

    protected createWrapper(): HTMLElement {

        let formEl = document.createElement("div");
        formEl.id = `mooform${this.entityId}`;

        return formEl;
    }

    attachScripts = (element: HTMLElement): void => {

        let parser = new DOMParser();
        let doc = parser.parseFromString(this.blueprintHtml, 'text/html');

        let s = document.createElement('script');
        let scriptsCollection: any = doc.getElementsByTagName('script');

        let code = '';

        for (let item = 0; item < scriptsCollection.length; item++) {

            code += scriptsCollection[item].text;
        }

        try {
            console.log(element);
            s.appendChild(document.createTextNode(code));
            element.appendChild(s);
        } catch (e) {
            s.text = code;
            element.appendChild(s);
        }
    }
}