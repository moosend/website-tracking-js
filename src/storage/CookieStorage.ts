import cookie from 'js-cookie';

export default class CookieStorage implements IStorage {

    public cookieSettings: any;

    constructor(cookieSettings?: any) {
        this.cookieSettings = cookieSettings;
    }

    public getItem(key: string): string {
        return cookie.get(key);
    }

    public setItem(key: string, value: string, options?: any): void {
        cookie.set(key, value, options);
    }

    public removeItem(key: string): void {
        cookie.remove(key);
    }
}
