import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import {
  NuMonacoEditorComponent,
  NuMonacoEditorEvent,
} from '@ng-util/monaco-editor';
import { Observable } from 'rxjs';
import { BackendService } from '../backend.service';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';

const INITIAL_FILE_CONTENT = `'use strict';

module.exports = {
    name: '',         // Give your plugin a name
    id: '',           // (Optional) Give your plugin an ID - this is mainly useful if you're overriding a builtin plugin
    description: '',  // (Optional) Describe what your plugin does
    author: '',       // (Optional) Put your name in here
    tags: [],         // (Optional) Tag your plugin with useful words to help it be easier to find
    icon: '',         // (Optional) Find an icon at https://material.io/icons to make your plugin more identifiable
    process: async (args) => {
        // Do stuff!
        return args.textContent; // <- this just returns whatever was in the editor when we started
    }
}`;

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

  filenameControl = new FormControl('', [
    Validators.required,
    Validators.pattern(/^[A-Z0-9\-]+(\.js)?$/i),
  ]);

  create: boolean;

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
    this.create = !this.filename;
  }

  ngOnInit(): void {}

  showEvent(e: NuMonacoEditorEvent): void {
    if (e.type === 'init') {
      // Tell Monaco that this is a CommonJS module - don't prompt to upgrade to ESM
      monaco.languages.typescript.javascriptDefaults.setCompilerOptions({});

      if (this.create) {
        this.replaceAllContent(INITIAL_FILE_CONTENT);
      } else {
        this.backendService
          .getCustomPluginContent(this.filename)
          .subscribe((content) => this.replaceAllContent(content));
      }
    }
  }

  save() {
    let obs: Observable<void>;

    if (this.create) {
      obs = this.backendService.createCustomPlugin(
        this.filenameControl.value!, // TODO: Check if we can remove the '!'
        this.getModel().getValue()
      );
    } else {
      obs = this.backendService.overwriteCustomPlugin(
        this.filename,
        this.getModel().getValue()
      );
    }

    obs.subscribe({
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

  mode() {
    return this.create ? 'Create' : 'Edit';
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
