import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { LoadedPlugin } from 'src/models/LoadedPlugin';

@Component({
  selector: 'app-plugin-item',
  templateUrl: './plugin-item.component.html',
  styleUrls: ['./plugin-item.component.scss']
})
export class PluginItemComponent {

  @Input()
  plugin: LoadedPlugin;

  constructor(private _router: Router) { }

  getIcon() {
    return this.plugin.icon ?? 'extension';
  }

  getTitleClass() {
    return this.plugin.systemPlugin ? 'system-plugin' : 'user-plugin';
  }

  click() {
    this._router.navigate(['/transformer', this.plugin.id]);
  }

}
