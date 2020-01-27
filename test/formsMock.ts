export interface IPopup {

    renderForm(): void;

    attachStyle(formEl: HTMLElement): void;
    addCloseEventListener(formEl: HTMLElement, entityId: string): void;

    renderWithDelay(after: number, type: string): void;
    renderOnExit(): void;

    onMouseOut(e: any, after: number, type: string): void;

    setIntervalToShowCookie(formId: string, after: number, type: string): void;

    getTypeValue(after: number, type: string): Date;

    isPopupActive(formId: string): boolean;

    renderIfNotActive(e: any): void;
}

export class FakePopup implements IPopup {
    styleToAttach = "{ position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 9999 } ";
    classForWrapper = "msf-popup";

    constructor(entityId: string, settings: any, blueprintHtml: string) {}

    renderForm(): void {};

    attachStyle(formEl: HTMLElement): void {};
    addCloseEventListener(formEl: HTMLElement, entityId: string): void {};

    renderWithDelay(after: number, type: string): void {};
    renderOnExit(): void {};

    onMouseOut(e: any, after: number, type: string): void {};

    setIntervalToShowCookie(formId: string, after: number, type: string):void {};

    getTypeValue(after: number, type: string): Date { return new Date; };

    isPopupActive(formId: string) { return true; };

    renderIfNotActive(e: any): void {};
}