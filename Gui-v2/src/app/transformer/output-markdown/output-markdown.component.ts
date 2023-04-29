import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-output-markdown',
  templateUrl: './output-markdown.component.html',
  styleUrls: ['./output-markdown.component.scss']
})
export class OutputMarkdownComponent implements OnInit {

  @Input()
  outputText: string;

  constructor() { }

  ngOnInit(): void {
  }

}
