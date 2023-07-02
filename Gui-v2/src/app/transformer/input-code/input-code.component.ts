import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NuMonacoEditorComponent } from '@ng-util/monaco-editor';
import { ConfigService } from 'src/app/config.service';

const DEFAULT_MONACO_OPTIONS = {
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
};

@Component({
  selector: 'app-input-code',
  templateUrl: './input-code.component.html',
  styleUrls: ['./input-code.component.scss']
})
export class InputCodeComponent implements OnInit {

  monacoOptions = DEFAULT_MONACO_OPTIONS;
  theme: 'light'|'dark' = 'light';

  @ViewChild('editor')
  inputEditor: NuMonacoEditorComponent;

  @Input('language')
  editorLanguage: string;

  constructor(private config: ConfigService) {
    this.config.onColorModeChanged().subscribe((mode) => {
      this.setEditorTheme(mode === 'light' ? 'vs' : 'vs-dark');
      this.theme = mode;
    });
    this.theme = this.config.colorMode;
  }

  ngOnInit(): void {
  }

  getData() {
    return {
      textContent: this.getText(),
    }
  }

  getText() {
    return this.getModel().getValue();
  }

  setText(newContent: string) {
    const waslocked = this.editorIsLocked();
    this.unlockEditor();

    const e = this.getEditor();
    const m = e.getModel();

    e.pushUndoStop();
    e.executeEdits('', [
      { range: m.getFullModelRange(), text: newContent },
    ]);
    e.setPosition(m.getFullModelRange().getEndPosition());

    if (waslocked) {
      this.lockEditor();
    }
  }

  setEditorTheme(theme: 'vs' | 'vs-dark') {
    monaco.editor.setTheme(theme);
  }

  setLanguage(language: string) {
    const model = this.getModel();
    monaco.editor.setModelLanguage(model, language ?? 'plaintext');
  }

  editorShowEvent(e: Event) {
    if (e.type === 'init') {
      this.setLanguage(this.editorLanguage);
      this.setEditorTheme(this.config.colorMode === 'light' ? 'vs' : 'vs-dark');
    }
  }

  private editorIsLocked() {
    return this.getEditor().getOption(monaco.editor.EditorOption.readOnly);
  }

  private lockEditor() {
    this.getEditor().updateOptions({ readOnly: true });
  }

  private unlockEditor() {
    this.getEditor().updateOptions({ readOnly: false });
  }

  private getEditor(): monaco.editor.IStandaloneCodeEditor {
    return this.inputEditor.editor;
  }

  private getModel(): monaco.editor.ITextModel {
    return this.getEditor().getModel()!;
  }
}
