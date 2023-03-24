import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-titlebar',
  templateUrl: './titlebar.component.html',
  styleUrls: ['./titlebar.component.scss']
})
export class TitlebarComponent {

  title = 'Swish';

  constructor(private _router: Router) { }

  // Show the back button if the current URL is not the same as the referrer
  showHomeButton = () => {
    return new URL(document.URL).pathname !== '/'
  }

  goHome(): void {
    this._router.navigateByUrl('/');
  }

}
