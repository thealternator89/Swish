import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PluginDataTransferService {

  private data: string;

  constructor() { }

  setData(data: string) {
    this.data = data;
  }

  getData(): string {
    const data = this.data;
    this.data = undefined;

    return data;
  }
}
