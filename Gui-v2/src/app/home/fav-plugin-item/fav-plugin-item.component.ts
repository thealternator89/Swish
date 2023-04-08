import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { LoadedPlugin } from 'src/models/LoadedPlugin';

@Component({
  selector: 'app-fav-plugin-item',
  templateUrl: './fav-plugin-item.component.html',
  styleUrls: ['./fav-plugin-item.component.scss']
})
export class FavPluginItemComponent {

  @Input()
  plugin: LoadedPlugin;

  constructor(private _router: Router) { }

  getIcon() {
    return this.plugin.icon ?? 'extension';
  }

  click() {
    this._router.navigate(['/transformer', this.plugin.id]);
  }

}
