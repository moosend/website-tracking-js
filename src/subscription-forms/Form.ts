import { IFormSettingsGet } from './model';
const cookie = require("js-cookie");

export default class Form {

    settings: IFormSettingsGet;
    blueprintHtml: string;
    entityId: string;

    parentSelectorForStyle: string = '#msf_';

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
        formEl.id = `msf_${this.entityId}`;

        return formEl;
    }

    attachScripts = (element: HTMLElement): void => {

        let doc = this.getParsedHtmlToDom(this.blueprintHtml);

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

    removePreviousIfActive = (selectorToDelete: string): void => {

        let previousForms = document.querySelectorAll(`${selectorToDelete}`);
        
        for(let i = 0; i < previousForms.length; i++) {
            previousForms[i].remove();
        }
    }

    addListenerForSubmissionCookies = (entityId: string): void => {
        
        document.addEventListener(`success-form-submit-${entityId}`, (e) => {
            
            cookie.set(`msf_submitted_${entityId}`, true, { expires: 3650 });
        });
    }

    addListenerForSubmissionIdentifyCookies = (entityId: string): void => {
        
        document.addEventListener(`success-form-submit-${entityId}`, (e) => {
            
            cookie.set('USER_EMAIL', (<CustomEvent>event).detail.email, { expires: 3650 });
        });
    }

    getParsedHtmlToDom = (htmlString: string): Document => {

        let parser = new DOMParser();
        return parser.parseFromString(htmlString, 'text/html');
    } 
}