import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-output-code',
  templateUrl: './output-code.component.html',
  styleUrls: ['./output-code.component.scss']
})
export class OutputCodeComponent implements OnInit {

  @Input("outputText")
  outputText: string;

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
    readOnly: true,
  }

  constructor() { }

  ngOnInit(): void {
  }

}
