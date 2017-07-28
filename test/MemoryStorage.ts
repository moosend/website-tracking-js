/// <reference path="../src/local.d.ts" />

export default class MemoryStorage implements IStorage {
  private data: any = {};

  public getItem(key: string): string {
    return this.data[key];
  }

  public setItem(key: string, value: string): void {
    this.data[key] = value;
  }

  public removeItem(key: string): void {
    delete this.data[key];
  }
}
