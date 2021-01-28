import { Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { IpcService } from './ipc.service';
import { PaletteDialogComponent } from './palette-dialog/palette-dialog.component';

import { v4 } from 'uuid';
import { MenuCommand } from 'shared/const/ipc/menu-command';
import { StatusComponent } from './status/status.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Beep';
  paletteDialogRef: MatDialogRef<PaletteDialogComponent>;

  @ViewChild(StatusComponent) statusComponent:StatusComponent;

  content: string = '';

  editorOptions = {
    theme: 'vs-dark',
    language: 'plaintext',
    scrollBeyondLastLine: false,
    selectionHighlight: false,
    occurrencesHighlight: false,
    renderLineHighlight: "none",
    fontFamily: "JetBrains Mono",
    fontLigatures: true,
    matchBrackets: "never",
    minimap: {
      enabled: false
    }
  };

  constructor(private dialog: MatDialog, private ipc: IpcService) {
    ipc.registerMenuCommands().subscribe((value: MenuCommand) => {
      switch(value) {
        case 'toggleCommandPalette': this.togglePalette();
          break;
        case 'editor.cut': document.execCommand('Cut');
          break;
        case 'editor.copy': document.execCommand('Copy');
          break;
        case 'editor.paste': document.execCommand('Paste');
          break;
      }
    });

    // Listen on this window for keyup events, so we can close the palette if the escape key is pressed.
    window.addEventListener('keyup', (event) => {
      if (event.code === 'Escape') {
        this.paletteDialogRef?.componentInstance?.close();
        event.stopPropagation();
      }
    }, true);

  }

  togglePalette() {
    // If the Dialog Ref and component instance exist, the dialog is visible. Close it.
    if (this.paletteDialogRef?.componentInstance) {
      this.paletteDialogRef.componentInstance.close();
      return;
    }

    this.paletteDialogRef = this.dialog.open(PaletteDialogComponent, {
      height: '300px',
      width: '600px',
      position: {
        top: '5px'
      }
    });

    this.paletteDialogRef.afterClosed().subscribe(async (selectedPlugin) => {
      if (!selectedPlugin) {
        return;
      }

      const currentPluginRunId = v4();

      this.statusComponent.setCurrentPluginRun(currentPluginRunId);
      this.statusComponent.setStatus(`Running ${selectedPlugin.name}...`, 'info', false);
      const pluginResult = await this.ipc.runPlugin({
        plugin: selectedPlugin.id,
        data: this.content,
        requestId: currentPluginRunId,
      });

      this.statusComponent.clearCurrentPluginRun();
      this.statusComponent.clearProgressAndStatus();

      const {error, message, text} = pluginResult;

      if (error) {
        this.statusComponent.setStatus(error.message, 'error');
        console.error(error);
        return; // If there was an error we don't want to do anything else.
      }

      if (message) {
        this.statusComponent.setStatus(message.text, message.level);
      } else {
        this.statusComponent.setStatus('Complete', 'success');
      }

      if (text) {
        this.content = text;
      }
    });
  }
}
