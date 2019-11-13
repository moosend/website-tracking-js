export default class Form {

    settings: Array < any > ;
    blueprintHtml: string;

    constructor(settings: Array < any > , blueprintHtml: string) {

        this.settings = settings;
        this.blueprintHtml = blueprintHtml;
    }

    protected createWrapper(): HTMLElement {

        let formEl = document.createElement("div");
        formEl.id = "mooforms";

        return formEl;
    }

    attachScripts = (element: HTMLElement): void => {

        let parser = new DOMParser();
        let doc = parser.parseFromString(this.blueprintHtml, 'text/html');
        console.log();

        let s = document.createElement('script');
        let scriptsCollection: any = doc.getElementsByTagName('script');

        let code = '';

        for (let item = 0; item < scriptsCollection.length; item++) {

            code += scriptsCollection[item].text;
        }

        try {
            s.appendChild(document.createTextNode(code));
            element.appendChild(s);
        } catch (e) {
            s.text = code;
            element.appendChild(s);
        }
    }
}