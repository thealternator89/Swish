import { Injectable } from '@angular/core';
import { IpcService } from './ipc.service';
import { Observable, Subject } from 'rxjs';

type ColorMode = 'light'|'dark';

const CONFIG_KEYS = {
  COLOR_MODE: 'colorMode',
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  colorMode: ColorMode;

  colorModeChanged = new Subject<ColorMode>();

  constructor(private ipc: IpcService) {
    this.get(CONFIG_KEYS.COLOR_MODE).then((mode) => {
      this.colorMode = mode ?? 'light';
      this.colorModeChanged.next(this.colorMode);
    });
  }

  public toggleColorMode(): void {
    this.setColorMode(this.colorMode === 'light' ? 'dark' : 'light');
  }

  public setColorMode(mode: ColorMode): void {
    this.set(CONFIG_KEYS.COLOR_MODE, mode);
    this.colorMode = mode;
    this.colorModeChanged.next(mode);
  }

  public onColorModeChanged(): Observable<ColorMode> {
    return this.colorModeChanged.asObservable();
  }

  private async get(key: string): Promise<any> {
    return await this.ipc.getConfigValue(key);
  }

  private async set(key: string, value: any): Promise<void> {
    return await this.ipc.setConfigValue(key, value);
  }

}
