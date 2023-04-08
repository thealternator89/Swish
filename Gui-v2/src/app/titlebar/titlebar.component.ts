import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NotifierService } from '../notifier.service';

@Component({
  selector: 'app-titlebar',
  templateUrl: './titlebar.component.html',
  styleUrls: ['./titlebar.component.scss']
})
export class TitlebarComponent {

  title = 'Swish';

  constructor(private _router: Router, private _notifier: NotifierService) { }

  // Show the back button if the current URL is not the same as the referrer
  showHomeButton = () => new URL(document.URL).pathname !== '/';

  // Only show the settings button if the current URL is the home page
  showSettingsButton = () => new URL(document.URL).pathname === '/';

  goHome(): void {
    this._router.navigateByUrl('/');
  }

  async reloadCustomPlugins(): Promise<void> {
    await window['app'].reloadUserPlugins();
    this._notifier.pluginsWereReloaded();
  }

}
