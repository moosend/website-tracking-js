export interface ISubForms {
    Entity: IFormEntityGet,
    Settings: IFormEntityGet[],
    Blueprint: IFormBlueprintGet
}

export interface IFormEntityGet {
    type: number,
    subtype: number;
}

export interface IFormSettingsGet {
    Value: string;
    Property: string | number;
}

export interface IFormBlueprintGet {
    blueprintId: string,
    blueprintType: string,
    blueprintContent: string
}

export interface ICookiesProps {
    alreadySubmitted: boolean
}