export interface ISubFormsGet {
    Entity: IEntityGet,
    EntityHtml: string,
    Settings: IFormSettingsGet[]
}

export interface IFormSettingsGet {
    Value: string;
    Property: string | number;
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