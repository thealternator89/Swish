import { Component, OnInit, ViewChild } from '@angular/core';
import { NuMonacoEditorComponent } from '@ng-util/monaco-editor';

@Component({
  selector: 'app-input-code',
  templateUrl: './input-code.component.html',
  styleUrls: ['./input-code.component.scss']
})
export class InputCodeComponent implements OnInit {

  @ViewChild('editor')
  inputEditor: NuMonacoEditorComponent;

  monacoOptions = {
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

  constructor() { }

  ngOnInit(): void {
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

  setLanguage(language: string) {
    const model = this.getModel();
    monaco.editor.setModelLanguage(model, language ?? 'plaintext');
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
