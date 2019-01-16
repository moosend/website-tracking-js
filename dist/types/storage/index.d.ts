import { IStorage } from '../types';
export default class CookieStorage implements IStorage {
    cookieSettings: any;
    constructor(cookieSettings?: any);
    getItem(key: string): string;
    setItem(key: string, value: string, options?: any): void;
    removeItem(key: string): void;
}
