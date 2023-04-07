import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { NuMonacoEditorComponent } from '@ng-util/monaco-editor';
import { LoadedPlugin } from 'src/models/LoadedPlugin';
import { IpcService } from '../ipc.service';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';
import { ResultSnackbarComponent } from './result-snackbar/result-snackbar.component';

// Base editor options for both the input and output editors
const BASE_EDITOR_OPTIONS = {
  theme: 'vs',
  language: 'plaintext',
  scrollBeyondLastLine: false,
  selectionHighlight: false,
  occurrencesHighlight: false,
  renderLineHighlight: 'none',
  matchBrackets: 'never',
  minimap: {
    enabled: false,
  },
  wordWrap: true,
}

@Component({
  selector: 'app-transformer',
  templateUrl: './transformer.component.html',
  styleUrls: ['./transformer.component.scss']
})
export class TransformerComponent {

  plugin: LoadedPlugin;

  autoRun = false;
  autoRunOnPaste = true;

  inputEditorOptions = BASE_EDITOR_OPTIONS;
  outputEditorOptions = {
    ...BASE_EDITOR_OPTIONS,
    readOnly: true,
  };

  @ViewChild('inputEditor')
  inputEditor: NuMonacoEditorComponent;

  @ViewChild('outputEditor')
  outputEditor: NuMonacoEditorComponent;

  constructor(
    private ipc: IpcService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    route: ActivatedRoute
    ) {
    const id = route.snapshot.params['id'];
    this.ipc.getPlugin(id).then((plugin) => {
      this.plugin = plugin;
    });
  }

  getIcon() {
    return this.plugin?.icon ?? 'extension';
  }

  getText(editor: 'input'|'output') {
    return this.getModel(editor).getValue();
  }

  setText(editor: 'input'|'output', newContent: string) {
    const waslocked = this.editorIsLocked(editor);
    this.unlockEditor(editor);

    const e = this.getEditor(editor);
    const m = e.getModel();

    e.pushUndoStop();
    e.executeEdits('', [
      { range: m.getFullModelRange(), text: newContent },
    ]);
    e.setPosition(m.getFullModelRange().getEndPosition());

    if (waslocked) {
      this.lockEditor(editor);
    }
  }

  inputShowEvent(e: Event) {
    if (e.type === 'init') {
      let lastLength = 0;
      this.inputEditor.registerOnChange((change) => {
        if (change.length - lastLength > 1 && this.autoRunOnPaste) {
          this.runPlugin();
        } else if (this.autoRun) {
          this.runPlugin();
        }
        lastLength = change.length;
      });
    }
  }

  async runPlugin() {
    const result = await this.ipc.runPlugin({
      plugin: this.plugin.id,
      requestId: this.getPluginRunId(),
      data: this.getText('input'),
    });

    if (result.message) {
      this.handlePluginMessage(result.message);
    }

    this.setText('output', result.text);
  }

  private handlePluginMessage(message: {level: 'info'|'warn'|'error'|'success', text: string}) {
    if (message.level === 'error') {
      this.dialog.open(ErrorDialogComponent, {
        data: message,
      });
    } else {
      this.snackBar.openFromComponent(ResultSnackbarComponent, {
        data: message,
        panelClass: [`${message.level}-snackbar`],
        duration: 5000,
      });
    }
  }

  private editorIsLocked(editor: 'input'|'output') {
    return this.getEditor(editor).getOption(monaco.editor.EditorOption.readOnly);
  }

  private lockEditor(editor: 'input'|'output') {
    this.getEditor(editor).updateOptions({ readOnly: true });
  }

  private unlockEditor(editor: 'input'|'output') {
    this.getEditor(editor).updateOptions({ readOnly: false });
  }

  getPluginRunId(): string {
    // If crypto.randomUUID exists, use it to generate a plugin run ID
    // Otherwise we just generate a string of 32 random characters.
    const crypto = window.crypto as any;
    if (typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    } else {
      const charsBetween = (start: number, end: number) =>
        new Array(end - start + 1)
          .join('.')
          .split('.')
          .map((_v, i) => String.fromCharCode(start + i));

      const availableChars = [
        ...charsBetween('a'.charCodeAt(0), 'z'.charCodeAt(0)),
        ...charsBetween('A'.charCodeAt(0), 'Z'.charCodeAt(0)),
        ...charsBetween('0'.charCodeAt(0), '9'.charCodeAt(0)),
      ];

      const randomChar = () =>
        availableChars[Math.trunc(Math.random() * availableChars.length)];

      return new Array(32).join('.').split('.').map(randomChar).join('');
    }
  }

  private getEditor(editor: 'input'|'output'): monaco.editor.IStandaloneCodeEditor {
    switch (editor) {
      case 'input': return this.inputEditor.editor;
      case 'output': return this.outputEditor.editor;
    }
  }

  private getModel(editor: 'input'|'output'): monaco.editor.ITextModel {
    return this.getEditor(editor).getModel()!;
  }
}