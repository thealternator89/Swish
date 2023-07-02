import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NotifierService } from '../notifier.service';
import { IpcService } from '../ipc.service';
import { ConfigService } from '../config.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-titlebar',
  templateUrl: './titlebar.component.html',
  styleUrls: ['./titlebar.component.scss'],
})
export class TitlebarComponent {
  title = 'Swish Desktop';
  platform: string;

  colorMode: 'light'|'dark';

  constructor(
    private _router: Router,
    private _notifier: NotifierService,
    private _ipc: IpcService,
    private _config: ConfigService
  ) {
    this.platform = _ipc.platform;
    this._config.onColorModeChanged().subscribe((mode) => {
      this.colorMode = mode;
    });
  }

  // Show the back button if the current URL is not the same as the referrer
  showHomeButton = () => this._router.url !== '/';

  // Only show the menu button if the current URL is the home page
  showMenuButton = () => true;

  goHome(): void {
    this._router.navigateByUrl('/');
  }

  showAbout(): void {
    this._router.navigateByUrl('/about');
  }

  showLogs(): void {
    this._router.navigateByUrl('/logs');
  }

  openGithubIssues(): void {
    this._ipc.openExternalUrl(
      'https://github.com/thealternator89/Swish/issues'
    );
  }

  openCustomPluginDocs(): void {
    this._ipc.openExternalUrl(
      'https://github.com/thealternator89/Swish/wiki/Plugins'
    );
  }

  toggleLightDarkMode(): void {
    this._config.toggleColorMode();
  }

  getColorModeIcon(): string {
    return this.colorMode === 'light' ? 'light_mode' : 'dark_mode';
  }

  getColorModeName(): string {
    return this.colorMode === 'light' ? 'Light Mode' : 'Dark Mode';
  }

  async reloadCustomPlugins(): Promise<void> {
    await window['app'].reloadUserPlugins();
    this._notifier.pluginsWereReloaded();
  }

  getPlatformClass(): string {
    switch (this.platform) {
      case 'win32':
        return 'win';
      case 'darwin':
        return 'mac';
      default:
        return 'linux';
    }
  }
}
