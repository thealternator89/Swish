import { Component, Input, OnInit } from '@angular/core';
import { PluginDefinition } from 'swish-base';

@Component({
  selector: 'app-palette-plugin-item',
  templateUrl: './palette-plugin-item.component.html',
  styleUrls: ['./palette-plugin-item.component.scss'],
})
export class PalettePluginItemComponent {
  @Input()
  public readonly plugin: PluginDefinition;

  getPluginIcon() {
    return this.plugin.icon || 'extension';
  }
}
