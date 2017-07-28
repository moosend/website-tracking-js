export default class CookieStorage implements IStorage {
    private cookieSettings;
    constructor(cookieSettings?: any);
    getItem(key: string): string;
    setItem(key: string, value: string, options?: any): void;
    removeItem(key: string): void;
}
