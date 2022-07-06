import { Component, ViewChild } from '@angular/core';
import { NuMonacoEditorComponent } from '@ng-util/monaco-editor';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent {
  editorOptions: any;

  @ViewChild(NuMonacoEditorComponent)
  editorComponent: NuMonacoEditorComponent;

  constructor() {
    const editorConfig = (window as any).config.editor;
    this.editorOptions = {
      theme: 'vs-dark',
      language: 'plaintext',
      scrollBeyondLastLine: false,
      selectionHighlight: false,
      occurrencesHighlight: false,
      renderLineHighlight: 'none',
      fontFamily: editorConfig.font,
      fontLigatures: editorConfig.ligatures,
      matchBrackets: 'never',
      minimap: {
        enabled: false,
      },
    };
  }

  get text() {
    return this.getModel().getValue();
  }

  set text(newContent: string) {
    this.replaceAllContent(newContent);
  }

  private replaceAllContent(newContent: string): void {
    this.unlockEditor();
    const editor = this.getEditor();

    // Ensure the current state is in the undo stack (so we don't undo too much when we undo).
    editor.pushUndoStop();
    editor.executeEdits('', [
      { range: this.getModel().getFullModelRange(), text: newContent },
    ]);

    editor.setPosition(this.getModel().getFullModelRange().getEndPosition());
  }

  public lockEditor() {
    this.getEditor().updateOptions({ readOnly: true });
  }

  public unlockEditor() {
    this.getEditor().updateOptions({ readOnly: false });
  }

  private getEditor(): monaco.editor.IStandaloneCodeEditor {
    return this.editorComponent.editor;
  }

  private getModel(): monaco.editor.ITextModel {
    return this.getEditor().getModel()!;
  }
}

