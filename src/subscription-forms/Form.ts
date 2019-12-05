import { IFormSettingsGet } from './model';

export default class Form {

    settings: IFormSettingsGet;
    blueprintHtml: string;
    entityId: string;

    timedValues = {
        "seconds": () => 1000,
        "minutes": () => 60 * 1000,
        "hours": () => 60 * 60 * 1000,
        "days": () => 24 * 60 * 60 * 1000,
        "weeks": () => 7 * 24 * 60 * 60 * 1000,
        "months": () => 4 * 7 * 24 * 60 * 60 * 1000
    };

    constructor(entityId: string, settings: IFormSettingsGet, blueprintHtml: string) {

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
            s.appendChild(document.createTextNode(code));
            element.appendChild(s);
        } catch (e) {
            s.text = code;
            element.appendChild(s);
        }
    }
}