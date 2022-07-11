import {
  AfterContentInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import {
  NuMonacoEditorComponent,
  NuMonacoEditorEvent,
} from '@ng-util/monaco-editor';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-create-custom-plugin',
  templateUrl: './create-custom-plugin.component.html',
  styleUrls: ['./create-custom-plugin.component.scss'],
})
export class CreateCustomPluginComponent {
  editorOptions: any = {
    theme: 'vs-dark',
    language: 'javascript',
    scrollBeyondLastLine: false,
    selectionHighlight: false,
    occurrencesHighlight: false,
    renderLineHighlight: 'none',
    matchBrackets: 'never',
    minimap: {
      enabled: false,
    },
  };

  readonly initialContent = `'use strict';

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
}` as any;

  filenameControl = new FormControl('', [
    Validators.required,
    Validators.pattern(/^[A-Z0-9\-]+(\.js)?$/i),
  ]);

  @ViewChild(NuMonacoEditorComponent)
  editorComponent!: NuMonacoEditorComponent;

  constructor(
    private snackBar: MatSnackBar,
    private backendService: BackendService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  showEvent(e: NuMonacoEditorEvent): void {
    if (e.type === 'init') {
      this.replaceAllContent(this.initialContent);

      // Tell Monaco that this is a CommonJS module - don't prompt to upgrade to ESM
      // monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      //   module: monaco.languages.typescript.ModuleKind.CommonJS,
      //   noUnusedParameters: true,
      // });
    }
  }

  save() {
    if (!this.filenameControl.valid || !this.filenameControl.value) {
      alert(
        'Provided filename is invalid!\nThis can only have 0-9, A-Z and hyphen (-)'
      );
      return;
    }

    this.backendService
      .createCustomPlugin(
        this.filenameControl.value,
        this.getModel().getValue()
      )
      .subscribe({
        complete: () => this.router.navigateByUrl('/custom-plugins'),
        error: (error) =>
          this.snackBar.open(error.error, undefined, { duration: 5000 }),
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
