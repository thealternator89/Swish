import { Component, Input } from '@angular/core';
import { LoadedPlugin } from 'src/models/LoadedPlugin';

@Component({
  selector: 'app-fav-plugin-item',
  templateUrl: './fav-plugin-item.component.html',
  styleUrls: ['./fav-plugin-item.component.scss']
})
export class FavPluginItemComponent {

  @Input()
  plugin: LoadedPlugin;

  constructor() { }

  getIcon() {
    return this.plugin.icon ?? 'extension';
  }

}
