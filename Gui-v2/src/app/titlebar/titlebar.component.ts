import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NotifierService } from '../notifier.service';
import { IpcService } from '../ipc.service';

@Component({
  selector: 'app-titlebar',
  templateUrl: './titlebar.component.html',
  styleUrls: ['./titlebar.component.scss'],
})
export class TitlebarComponent {
  title = 'Swish';
  platform: string;

  constructor(
    private _router: Router,
    private _notifier: NotifierService,
    ipc: IpcService
  ) {
    this.platform = ipc.platform;
  }

  // Show the back button if the current URL is not the same as the referrer
  showHomeButton = () => this._router.url !== '/';

  // Only show the menu button if the current URL is the home page
  showMenuButton = () => this._router.url === '/';

  goHome(): void {
    this._router.navigateByUrl('/');
  }

  showAbout(): void {
    this._router.navigateByUrl('/about');
  }

  showLogs(): void {
    this._router.navigateByUrl('/logs');
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
