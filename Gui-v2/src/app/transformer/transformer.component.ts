import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogState } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { NuMonacoEditorComponent } from '@ng-util/monaco-editor';
import { LoadedPlugin } from 'src/models/LoadedPlugin';
import { IpcService } from '../ipc.service';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';
import { ResultSnackbarComponent } from './result-snackbar/result-snackbar.component';
import { OutputMessageComponent } from './output-message/output-message.component';
import { ProgressDialogComponent } from './progress-dialog/progress-dialog.component';
import { Subject } from 'rxjs';

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

  // TODO: disabled for now - "paste" causes issues with the progress dialog
  // Need to make this customisable in some way - can user pick? can plugin? can both?
  autoRunOn: 'paste'|'change'|'never' = 'never';

  outputType = 'none';
  outputText = '';

  progressDialog?: MatDialogRef<ProgressDialogComponent> = null;
  currentRunId: string = null;

  inputEditorOptions = BASE_EDITOR_OPTIONS;

  runPluginSubject: Subject<void> = new Subject();

  @ViewChild('inputEditor')
  inputEditor: NuMonacoEditorComponent;

  @ViewChild('outputMessage')
  outputMessage: OutputMessageComponent;

  constructor(
    private ipc: IpcService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private changeDetector: ChangeDetectorRef,
    route: ActivatedRoute
    ) {
    const id = route.snapshot.params['id'];
    this.ipc.getPlugin(id).then((plugin) => {
      this.plugin = plugin;
    });

    this.ipc.registerPluginProgressUpdates().subscribe((progress) => {
      if (progress.id === this.currentRunId && this.progressDialog?.getState() !== MatDialogState.OPEN) {
        this.showProgressDialog();
      }
    });

    this.ipc.registerPluginStatusUpdates().subscribe((status) => {
      if (status.id === this.currentRunId && this.progressDialog?.getState() !== MatDialogState.OPEN) {
        this.showProgressDialog();
      }
    });

    this.runPluginSubject.asObservable().subscribe(() => {
      console.log('Running plugin...');
      if (!this.currentRunId) {
        this.runPlugin();
      }
    });

  }

  triggerRunPlugin() {
    this.runPluginSubject.next();
  }

  getIcon() {
    return this.plugin?.icon ?? 'extension';
  }

  getText(editor: 'input') {
    return this.getModel(editor).getValue();
  }

  setText(editor: 'input', newContent: string) {
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
      if (this.plugin?.input?.syntax) {
        this.setLanguage('input', this.plugin.input.syntax);
      }

      // TODO: these are broken (fail to handle the dialog) so disabled for now
      if (this.autoRunOn === 'paste') {
        this.getEditor('input').onDidPaste(() => {
          this.triggerRunPlugin();
        });
      } else if (this.autoRunOn === 'change') {
        this.inputEditor.registerOnChange(() => {
          this.triggerRunPlugin();
        });
      }
    }
  }

  showProgressDialog(message?: string, progress?: number) {
    // If we already have a dialog that is open, don't show another one
    if (this.progressDialog?.getState() === MatDialogState.OPEN) {
      return;
    }

    console.log(`[TransformerComponent] Showing progress dialog: ${JSON.stringify({message, progress})}`);

    this.progressDialog = this.dialog.open(ProgressDialogComponent, {
      data: {
        runId: this.currentRunId,
        initialMessage: message,
        initialProgress: progress
      },
      disableClose: false, // TODO enable this - disabled just while this is broken
      width: '400px',
      height: '100px',
    });

    this.progressDialog.backdropClick().subscribe(() => {
      this.progressDialog.close();
    });
  }

  hideProgressDialog() {
    console.log('[TransformerComponent] Hiding progress dialog');
    if (this.progressDialog?.getState() === MatDialogState.OPEN) {
      // clean up the dialog before closing it
      this.progressDialog.componentInstance.onClose();
      this.progressDialog.close();
      // this.progressDialog = undefined;
    } else {
      console.log('[TransformerComponent] No progress dialog to hide');
    }

    this.changeDetector.detectChanges();
  }

  async runPlugin() {
    this.currentRunId = this.getPluginRunId();

    // Set up a timer to show the progress dialog after 700ms if:
    // - We haven't already shown it
    // - We haven't already finished
    setTimeout(() => {
      if (this.currentRunId && this.progressDialog?.getState() !== MatDialogState.OPEN) {
        console.log('[TransformerComponent] Taking too long to run, showing progress dialog');
        this.showProgressDialog();
      }
    }, 700);

    const result = await this.ipc.runPlugin({
      plugin: this.plugin.id,
      requestId: this.currentRunId,
      data: this.getText('input'),
    });

    this.currentRunId = null;
    this.hideProgressDialog();

    if (result.render === 'message') {
      this.setOutputType('message');
      this.outputMessage.setMessage(result.message);
      return;
    } else if (result.message) {
      this.handlePluginMessage(result.message);
    }

    // If we had some message, but no text, don't show the empty output
    if (!result.text && result.message) {
      this.setOutputType('none');
      return;
    }

    this.setOutputType('markdown');
    this.outputText = (result as any).markdown ?? result.text;
    this.changeDetector.detectChanges();
  }

  private setLanguage(editor: 'input', language: string) {
    const model = this.getModel(editor);
    if (model) {
      monaco.editor.setModelLanguage(model, language ?? 'plaintext');
    }
  }

  /**
   * Set the output type and force angular to detect changes
   * @param type 'none'|'message'|'code'
   */
  private setOutputType(type: 'none'|'message'|'code'|'markdown') {
    this.outputType = type;
    this.changeDetector.detectChanges();
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

  private editorIsLocked(editor: 'input') {
    return this.getEditor(editor).getOption(monaco.editor.EditorOption.readOnly);
  }

  private lockEditor(editor: 'input') {
    this.getEditor(editor).updateOptions({ readOnly: true });
  }

  private unlockEditor(editor: 'input') {
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

  private getEditor(editor: 'input'): monaco.editor.IStandaloneCodeEditor {
    switch (editor) {
      case 'input': return this.inputEditor.editor;
    }
  }

  private getModel(editor: 'input'): monaco.editor.ITextModel {
    return this.getEditor(editor).getModel()!;
  }
}
