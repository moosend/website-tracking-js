import { ISubFormsGet } from "../subscription-forms/model";
import APIRequest from './APIRequest';
const cookie = require('js-cookie');
// Initiate and call subforms
let formRequest: any = new APIRequest();

// Temporary site id for demo
const siteId = '8fceeb60-c8b6-492b-9204-7f20118e10a8';
const userId = '';
const userEmail = 'gentsp@moosend.com';
let cookiesToSend = formRequest.getAllCookies();

process && process.env && process.env.FORM_URL && formRequest.makeRequest(process.env.FORM_URL + siteId, formRequest.preparePayload(siteId, userId, userEmail, cookiesToSend, ''), (response: string) => {

    let responseObj: ISubFormsGet = JSON.parse(response);

    for (let key in responseObj) {

        let formId = responseObj[key].Entity.Id;

        if (cookie.get(`msf_shown_${formId}`) === undefined) {

            if (responseObj[key].Settings.Avoid_Submission_OnOff && responseObj[key].Settings.Avoid_Submission_OnOff === "true" && cookie.get(`msf_submitted_${formId}`) === "true") {

                continue;
            }

            import(`./${process.env.formtype}`)
                .then((module) => {
                    
                    new module.default(formId, responseObj[key].Settings, responseObj[key].EntityHtml);
                });
        }
    }
});