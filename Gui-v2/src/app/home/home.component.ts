import { Component, OnInit } from '@angular/core';
import { PluginDefinition } from 'swish-base';
import { IpcService } from '../ipc.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  plugins: PluginDefinition[] = [];

  favPlugins: PluginDefinition[] = [];

  constructor(private ipc: IpcService) {
    this.ipc.searchPlugins('').then((results: PluginDefinition[]) => {
      this.plugins = results;
      this.favPlugins = results.slice(0, 5);
    });
  }

  searchModified(_event: Event, term: string) {
    this.ipc.searchPlugins(term).then((results: PluginDefinition[]) => {
      this.plugins = results;
    });
  }

}
