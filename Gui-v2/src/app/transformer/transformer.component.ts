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
import { InputCodeComponent } from './input-code/input-code.component';

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

  outputType: 'none'|'message'|'code'|'markdown'|'html' = 'none';
  outputText = '';

  progressDialog?: MatDialogRef<ProgressDialogComponent> = null;
  currentRunId: string = null;

  runPluginSubject: Subject<void> = new Subject();

  @ViewChild('inputCode')
  inputCode: InputCodeComponent;

  @ViewChild('outputMessage')
  outputMessage: OutputMessageComponent;

  constructor(
    private ipc: IpcService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private changeDetector: ChangeDetectorRef,
    route: ActivatedRoute
    ) {
    const pluginId = route.snapshot.params['id'];
    this.ipc.getPlugin(pluginId).then((plugin) => {
      this.plugin = plugin;
    });

    this.ipc.registerPluginProgressUpdates().subscribe(({id, percentage}) => {
      if (id === this.currentRunId && this.progressDialog?.getState() !== MatDialogState.OPEN) {
        this.showProgressDialog(undefined, percentage);
      }
    });

    this.ipc.registerPluginStatusUpdates().subscribe(({id, status}) => {
      if (id === this.currentRunId && this.progressDialog?.getState() !== MatDialogState.OPEN) {
        this.showProgressDialog(status, undefined);
      }
    });

    this.runPluginSubject.asObservable().subscribe(() => {
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

  showProgressDialog(message?: string, progress?: number) {
    // If we already have a dialog that is open, don't show another one
    if (this.progressDialog?.getState() === MatDialogState.OPEN) {
      return;
    }

    this.progressDialog = this.dialog.open(ProgressDialogComponent, {
      data: {
        runId: this.currentRunId,
        initialMessage: message,
        initialProgress: progress
      },
      disableClose: true,
      width: '400px',
      height: '100px',
    });

    this.progressDialog.backdropClick().subscribe(() => {
      this.progressDialog.close();
    });
  }

  hideProgressDialog() {
    if (this.progressDialog?.getState() === MatDialogState.OPEN) {
      // clean up the dialog before closing it
      this.progressDialog.componentInstance.onClose();
      this.progressDialog.close();
      this.progressDialog = undefined;
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
        this.showProgressDialog();
      }
    }, 700);

    const result = await this.ipc.runPlugin({
      plugin: this.plugin.id,
      requestId: this.currentRunId,
      data: this.inputCode.getText(),
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

    if (result.render === 'markdown') {
      this.outputText = result.markdown;
      this.setOutputType('markdown');
    } else if (result.render === 'html') {
      this.outputText = result.html;
      this.setOutputType('html');
    } else {
      this.outputText = result.text;
      this.setOutputType('code');
    }
  }

  private setOutputType(type: 'none'|'message'|'code'|'markdown'|'html') {
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
}
