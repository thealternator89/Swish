import { Component, Input, ViewChild } from '@angular/core';
import { NuMonacoEditorComponent } from '@ng-util/monaco-editor';

@Component({
  selector: 'app-output-code',
  templateUrl: './output-code.component.html',
  styleUrls: ['./output-code.component.scss'],
})
export class OutputCodeComponent {
  @Input('outputText')
  outputText: string;

  @Input('language')
  outputLanguage: string = 'plaintext';

  @ViewChild('editor')
  editor: NuMonacoEditorComponent;

  monacoOptions = {
    theme: 'vs',
    scrollBeyondLastLine: false,
    selectionHighlight: false,
    occurrencesHighlight: false,
    renderLineHighlight: 'none',
    matchBrackets: 'never',
    minimap: {
      enabled: false,
    },
    wordWrap: true,
    readOnly: true,
  };

  constructor() {}

  editorShowEvent(e: Event) {
    if (e.type === 'init') {
      this.setLanguage(this.outputLanguage);
    }
  }

  setLanguage(language: string) {
    this.outputLanguage = language;
    monaco.editor.setModelLanguage(this.editor.editor.getModel(), language);
  }
}
