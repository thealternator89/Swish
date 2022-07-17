import { Component, OnInit, ViewChild } from '@angular/core';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MatDialogState,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  NuMonacoEditorComponent,
  NuMonacoEditorEvent,
} from '@ng-util/monaco-editor';

import { PluginResult } from 'swish-base';

import { HotkeyService } from '../hotkey.service';
import { LoadingDialogComponent } from '../loading-dialog/loading-dialog.component';
import { PaletteComponent } from '../palette/palette.component';
import { PluginResultSnackbarComponent } from '../plugin-result-snackbar/plugin-result-snackbar.component';
import { SettingsService } from '../settings.service';
import {
  PluginResultEventData,
  PluginUpdateEventData,
  WebsocketService,
} from '../websocket.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent {
  editorOptions: any;

  @ViewChild(NuMonacoEditorComponent)
  editorComponent!: NuMonacoEditorComponent;

  languages = [
    { key: 'plaintext', name: 'Plain Text' },
    { key: 'bat', name: 'Batch' },
    { key: 'c', name: 'C' },
    { key: 'csharp', name: 'C#' },
    { key: 'cpp', name: 'C++' },
    { key: 'css', name: 'CSS' },
    { key: 'fsharp', name: 'F#' },
    { key: 'go', name: 'Go' },
    { key: 'graphql', name: 'GraphQL' },
    { key: 'handlebars', name: 'Handlebars' },
    { key: 'html', name: 'HTML' },
    { key: 'ini', name: 'Ini' },
    { key: 'java', name: 'Java' },
    { key: 'javascript', name: 'JavaScript' },
    { key: 'json', name: 'JSON' },
    { key: 'kotlin', name: 'Kotlin' },
    { key: 'markdown', name: 'Markdown' },
    { key: 'objective-c', name: 'Objective-C' },
    { key: 'powershell', name: 'PowerShell' },
    { key: 'python', name: 'Python' },
    { key: 'rust', name: 'Rust' },
    { key: 'shell', name: 'Shell' },
    { key: 'sql', name: 'SQL' },
    { key: 'swift', name: 'Swift' },
    { key: 'typescript', name: 'TypeScript' },
    { key: 'vb', name: 'Visual Basic' },
    { key: 'xml', name: 'XML' },
    { key: 'yaml', name: 'YAML' },
  ];

  // Dialog reference for palette
  paletteDialog?: MatDialogRef<PaletteComponent>;

  // Dialog reference for loading dialog
  loadingDialog?: MatDialogRef<LoadingDialogComponent>;

  currentRunId?: string;

  hotkey: string;

  constructor(
    private dialog: MatDialog,
    hotkeyService: HotkeyService,
    private websocketService: WebsocketService,
    private settingsService: SettingsService,
    private snackBar: MatSnackBar
  ) {
    this.hotkey = hotkeyService.paletteHotkey;

    hotkeyService.onTogglePalette().subscribe(() => this.togglePalette());
    hotkeyService.onClosePalette().subscribe(() => this.closePalette());

    this.editorOptions = {
      language: 'plaintext',
      scrollBeyondLastLine: false,
      selectionHighlight: false,
      occurrencesHighlight: false,
      renderLineHighlight: 'none',
      fontFamily: settingsService.editorFont,
      fontLigatures: settingsService.editorLigatures,
      matchBrackets: 'never',
      minimap: {
        enabled: false,
      },
    };

    websocketService.events.subscribe((event) => {
      if (event.data.runId !== this.currentRunId) {
        console.warn(
          `Received update with unexpected RunId ${event.data.runId}`
        );
        return;
      }

      // If this is a result, and it's for the current run, use it
      if (event.type === 'PluginResult') {
        this.handlePluginResult((event.data as PluginResultEventData).result);
      }

      // If this is a plugin update (for the current run), if the loading dialog isn't open, open it
      if (event.type === 'PluginUpdate') {
        if (this.loadingDialog?.getState() !== MatDialogState.OPEN) {
          // The dialog won't know what message we just got, so we initialize it.
          const update = event.data as PluginUpdateEventData;
          let initialState;
          if (update.updateType === 'progress') {
            initialState = { progress: update.data as number };
          } else if (update.updateType === 'status') {
            initialState = { status: update.data as string };
          }

          this.openLoadingDialog(initialState);
        }
      }
    });
  }

  setLanguage(_$event: any, key: string) {
    const model = this.editorComponent.editor.getModel();
    if (model) {
      monaco.editor.setModelLanguage(model, key);
    }
  }

  getThemeIcon() {
    return this.settingsService.editorColorScheme === 'dark'
      ? 'dark_mode'
      : 'light_mode';
  }

  switchColorMode() {
    this.settingsService.editorColorScheme = this.invertColor(
      this.settingsService.editorColorScheme
    );
    this.setTheme();
  }

  invertColor(color: 'light' | 'dark'): 'light' | 'dark' {
    return color === 'light' ? 'dark' : 'light';
  }

  setTheme() {
    const key =
      this.settingsService.editorColorScheme === 'light' ? 'vs' : 'vs-dark';
    monaco.editor.setTheme(key);
  }

  closePalette() {
    this.paletteDialog?.close();
    this.paletteDialog = undefined;
  }

  togglePalette() {
    // If the palette is open, we should close it
    if (this.paletteDialog?.getState() === MatDialogState.OPEN) {
      this.paletteDialog.close();
      this.paletteDialog = undefined;
      return;
    }

    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '700px';
    dialogConfig.height = '500px';
    dialogConfig.position = {
      top: '70px',
    };

    this.paletteDialog = this.dialog.open(PaletteComponent, dialogConfig);

    this.paletteDialog
      .afterClosed()
      .subscribe((result) => result && this.runPlugin(result));
  }

  runPlugin(pluginId: string) {
    const originalValue = this.getModel().getValue();

    this.lockEditor();

    this.currentRunId = crypto.randomUUID();

    this.websocketService.events.next({
      type: 'RunPlugin',
      data: {
        pluginId: pluginId,
        data: originalValue,
        runId: this.currentRunId,
      },
    } as any);

    // ensure we open the loading dialog if we (a) haven't received a response and (b) it's been more than 500ms
    sleep(700).then(() => {
      if (!!this.currentRunId) {
        this.openLoadingDialog();
      }
    });
  }

  showEvent(e: NuMonacoEditorEvent) {
    if (e.type === 'init') {
      this.setTheme();

      this.getEditor().updateOptions({
        fontFamily: this.settingsService.editorFont,
        fontSize: this.settingsService.editorFontSize,
        fontLigatures: this.settingsService.editorLigatures,
      });
    }
  }

  private handlePluginResult(result: PluginResult) {
    const text = result?.text;

    if (text) {
      this.replaceAllContent(text);
    } else {
      this.unlockEditor();
    }

    this.currentRunId = undefined;

    // If the loading dialog is open, close it.
    if (this.loadingDialog?.getState() === MatDialogState.OPEN) {
      this.loadingDialog.close();
      this.loadingDialog = undefined;
    }

    if (result?.message) {
      this.snackBar.openFromComponent(PluginResultSnackbarComponent, {
        data: result.message,
        panelClass: [`${result.message.level}-snackbar`],
        duration: 10000,
      });
    }
  }

  private openLoadingDialog(initialState?: {
    progress?: number;
    status?: string;
  }) {
    // Don't open the dialog if it's already open
    if (this.loadingDialog?.getState() === MatDialogState.OPEN) {
      return;
    }

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.width = '500px';
    dialogConfig.data = { runId: this.currentRunId, initial: initialState };

    this.loadingDialog = this.dialog.open(LoadingDialogComponent, dialogConfig);
  }

  private replaceAllContent(newContent: string): void {
    this.unlockEditor();
    const editor = this.getEditor();

    // Ensure the current state is in the undo stack (so we don't undo too much when we undo).
    editor.pushUndoStop();
    editor.executeEdits('pluginResult', [
      { range: this.getModel().getFullModelRange(), text: newContent },
    ]);

    editor.setScrollPosition({ scrollTop: 0, scrollLeft: 0 });
    editor.setPosition(this.getModel().getFullModelRange().getStartPosition());
  }

  private lockEditor() {
    this.getEditor().updateOptions({ readOnly: true });
  }

  private unlockEditor() {
    this.getEditor().updateOptions({ readOnly: false });
  }

  private getEditor(): monaco.editor.IStandaloneCodeEditor {
    return this.editorComponent.editor;
  }

  private getModel(): monaco.editor.ITextModel {
    return this.getEditor().getModel()!;
  }
}

function sleep(time: number): Promise<void> {
  return new Promise((res) => setTimeout(res, time));
}
