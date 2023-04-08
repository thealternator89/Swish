import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { PluginDefinition } from 'swish-base';
import { IpcService } from '../ipc.service';
import { NotifierService } from '../notifier.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  plugins: PluginDefinition[] = [];

  favPlugins: PluginDefinition[] = [];

  @ViewChild('search')
  search: any; // TODO: type this

  constructor(private ipc: IpcService, private notifier: NotifierService) {
    this.ipc.searchPlugins('').then((results: PluginDefinition[]) => {
      this.plugins = results;

      // Temporarily display 5 random plugins as favorites until we support UI and storage of favorites
      const temp = JSON.parse(JSON.stringify(results));
      this.favPlugins = temp.sort(() => Math.random() - 0.5).slice(0, 5);
    });

    this.notifier.onPluginsReloaded().subscribe(() => {
      this.ipc.searchPlugins(this.search.value).then((results: PluginDefinition[]) => {
        this.plugins = results;
      });
    });
  }

  searchModified(_event: Event, term: string) {
    this.ipc.searchPlugins(term).then((results: PluginDefinition[]) => {
      this.plugins = results;
    });
  }

}
