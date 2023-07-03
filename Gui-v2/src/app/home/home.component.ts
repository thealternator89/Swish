import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { PluginDefinition } from 'swish-base';
import { IpcService } from '../ipc.service';
import { NotifierService } from '../notifier.service';
import { ConfigService } from '../config.service';

const tagsToShow = 15;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  plugins: PluginDefinition[] = [];

  theme: 'light' | 'dark' = 'light';

  tags: string[] = [];
  selectedTags: string[] = [];

  @ViewChild('search')
  search: HTMLInputElement;

  constructor(private ipc: IpcService, private notifier: NotifierService, private config: ConfigService) {
    this.searchPlugins('');
    this.notifier
      .onPluginsReloaded()
      .subscribe(() => this.searchPlugins(this.search.value));

    this.config.onColorModeChanged().subscribe((mode) => {
      this.theme = mode;
    });
    this.theme = this.config.colorMode;
  }

  getSelectedTags() {
    return this.selectedTags.sort();
  }

  getOtherTags() {
    if (this.selectedTags.length >= tagsToShow) {
      return [];
    }

    return this.tags
      .filter((tag) => !this.selectedTags.includes(tag))
      .slice(0, tagsToShow - this.selectedTags.length);
  }

  searchModified(_event: Event, term: string) {
    this.searchPlugins(term);
  }

  tagSelected(tag: string) {
    if (this.selectedTags.includes(tag)) {
      this.selectedTags = this.selectedTags.filter((t) => t !== tag);
    } else {
      this.selectedTags.push(tag);
    }
    this.searchPlugins(this.search.value);
  }

  async searchPlugins(query: string) {
    const results = await this.ipc.searchPlugins(query, this.selectedTags);
    this.updatePlugins(results);
  }

  updatePlugins(plugins: PluginDefinition[]) {
    this.plugins = plugins;
    this.tags = this.getPluginTags(plugins);
  }

  getPluginTags(plugins: PluginDefinition[]) {
    const tagDict: Record<string, number> = {};
    plugins?.forEach((plugin) => {
      plugin?.tags?.forEach((tag) => {
        if (tagDict[tag]) {
          tagDict[tag]++;
        } else {
          tagDict[tag] = 1;
        }
      });
    });

    const sortedTags = Object.keys(tagDict).map((tag) => tag.toLocaleLowerCase()).sort(
      (a, b) => tagDict[b] - tagDict[a]
    );

    return Array.from(sortedTags).slice(0, tagsToShow);
  }
}
