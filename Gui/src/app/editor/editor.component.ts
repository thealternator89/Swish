import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit {
  content: string = '';

  editorOptions = {
    theme: 'vs-dark',
    language: 'plaintext',
    scrollBeyondLastLine: false,
    selectionHighlight: false,
    occurrencesHighlight: false,
    renderLineHighlight: 'none',
    fontFamily: 'JetBrains Mono',
    fontLigatures: true,
    matchBrackets: 'never',
    minimap: {
      enabled: false,
    },
  };

  constructor() {}

  ngOnInit(): void {}

  get text() {
    return this.content;
  }

  set text(newContent: string) {
    this.content = newContent;
  }
}
