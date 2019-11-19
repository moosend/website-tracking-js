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
    Timed_Show_Type: string
}

export interface IEntityGet {
    Subtype: number;
}

export interface ISubFormsPost {
    WebsiteId: string,
    Context: IContext
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