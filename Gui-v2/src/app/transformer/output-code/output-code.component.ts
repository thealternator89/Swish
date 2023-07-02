import { Component, Input, ViewChild } from '@angular/core';
import { NuMonacoEditorComponent } from '@ng-util/monaco-editor';
import { ConfigService } from 'src/app/config.service';

@Component({
  selector: 'app-output-code',
  templateUrl: './output-code.component.html',
  styleUrls: ['./output-code.component.scss'],
})
export class OutputCodeComponent {
  theme: 'light'|'dark' = 'light';

  @Input('outputText')
  outputText: string;

  @Input('language')
  outputLanguage: string = 'plaintext';

  @ViewChild('editor')
  editor: NuMonacoEditorComponent;

  monacoOptions = {
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

  constructor(private config: ConfigService) {
    config.onColorModeChanged().subscribe((mode) => {
      this.setEditorTheme(mode === 'light' ? 'vs' : 'vs-dark');
      this.theme = mode;
    });
    this.theme = this.config.colorMode;
  }

  editorShowEvent(e: Event) {
    if (e.type === 'init') {
      this.setLanguage(this.outputLanguage);
      this.setEditorTheme(this.config.colorMode === 'light' ? 'vs' : 'vs-dark');
    }
  }

  setEditorTheme(theme: 'vs' | 'vs-dark') {
    monaco.editor.setTheme(theme);
  }

  setLanguage(language: string) {
    this.outputLanguage = language;
    monaco.editor.setModelLanguage(this.editor.editor.getModel(), language);
  }
}
