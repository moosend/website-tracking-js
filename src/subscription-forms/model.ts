export interface ISubFormsGet {
    Entity: IEntityGet,
    EntityHtml: string,
    Settings: IFormSettingsGet[]
}

export interface IFormSettingsGet {
    Avoid_Submission_OnOff: string,
    Popup_Trigger: string,
    Exit_Show_After: string,
    Exit_Show_Type: string,
    Timed_Show_After: string,
    Timed_Show_Type: string,
    Form_Position: string,
    Timed_Last_Appearance_After: string,
    Timed_Last_Appearance_Type: string,
}

export interface IEntityGet {
    Id: string,
    Subtype: number;
}

export interface ISubFormsPost {
    WebsiteId: string,
    RemoteWebContext: IContext
}

export interface ISubFormPost {
    EntityId: string,
    RemoteWebContext: IContext
}

export interface IContext {
    ContactId: string,
    MemberEmail: string,
    Cookies: ICookiesPost,
    CurrentUrlPath: string
}

export interface ICookiesPost {
    [key: string]: string
}

export interface ICookiesProps {
    alreadySubmitted: boolean
}

export const FormTypesClasses = {
    1: "msf-popup",
    2: "msf-inline",
    3: "msf-row",
    4: "msf-scrollbox",
    5: "msf-fullpage"
}