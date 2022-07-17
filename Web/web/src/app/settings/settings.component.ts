import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../settings.service';

const isMac = window.navigator.platform.toUpperCase().indexOf('MAC') >= 0;

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  font?: string;

  fontsize?: number;

  ligatures: boolean = false;

  constructor(private settingsService: SettingsService) {
    this.font = settingsService.editorFont;
    this.fontsize = settingsService.editorFontSize;
    this.ligatures = settingsService.editorLigatures;
  }

  save(): void {
    this.settingsService.editorFont = this.font;
    this.settingsService.editorFontSize = this.fontsize;
    this.settingsService.editorLigatures = this.ligatures;
  }
}
