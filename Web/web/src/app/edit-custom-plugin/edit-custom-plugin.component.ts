import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import {
  NuMonacoEditorComponent,
  NuMonacoEditorEvent,
} from '@ng-util/monaco-editor';
import { BackendService } from '../backend.service';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-edit-custom-plugin',
  templateUrl: './edit-custom-plugin.component.html',
  styleUrls: ['./edit-custom-plugin.component.scss'],
})
export class EditCustomPluginComponent implements OnInit {
  editorOptions: any = {
    theme: 'vs-dark',
    language: 'javascript',
    scrollBeyondLastLine: false,
    minimap: {
      enabled: false,
    },
  };

  filename: string;

  @ViewChild(NuMonacoEditorComponent)
  editorComponent!: NuMonacoEditorComponent;

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private backendService: BackendService,
    private router: Router,
    route: ActivatedRoute
  ) {
    this.filename = route.snapshot.params['filename'];
  }

  ngOnInit(): void {
    if (!this.filename) {
      console.error(`Filename not set, can't perform edit.`);
      this.router.navigateByUrl('/custom-plugins');
    }
  }

  showEvent(e: NuMonacoEditorEvent): void {
    if (e.type === 'init') {
      // Tell Monaco that this is a CommonJS module - don't prompt to upgrade to ESM
      monaco.languages.typescript.javascriptDefaults.setCompilerOptions({});

      this.backendService
        .getCustomPluginContent(this.filename)
        .subscribe((content) => this.replaceAllContent(content));
    }
  }

  save() {
    this.backendService
      .overwriteCustomPlugin(this.filename, this.getModel().getValue())
      .subscribe({
        complete: () => this.router.navigateByUrl('/custom-plugins'),
        error: (error) =>
          this.snackBar.open(error.error, undefined, { duration: 5000 }),
      });
  }

  delete() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '500px';
    dialogConfig.data = { filename: this.filename };

    this.dialog
      .open(DeleteDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed) {
          this.backendService
            .deleteCustomPlugin(this.filename)
            .subscribe(() => this.router.navigateByUrl('/custom-plugins'));
        }
      });
  }

  private replaceAllContent(newContent: string): void {
    this.getEditor().executeEdits('pluginResult', [
      { range: this.getModel().getFullModelRange(), text: newContent },
    ]);

    this.getEditor().setPosition(
      this.getModel().getFullModelRange().getEndPosition()
    );
  }

  private getEditor(): monaco.editor.IStandaloneCodeEditor {
    return this.editorComponent.editor;
  }

  private getModel(): monaco.editor.ITextModel {
    return this.getEditor().getModel()!;
  }
}
