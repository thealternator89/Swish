import { Component, OnInit, ViewChild } from '@angular/core';
import { PluginResult } from 'swish-base';
import { OutputMessageComponent } from '../output-message/output-message.component';

@Component({
  selector: 'app-output',
  templateUrl: './output.component.html',
  styleUrls: ['./output.component.scss'],
})
export class OutputComponent implements OnInit {
  constructor() {}

  @ViewChild('outputMessage')
  outputMessage: OutputMessageComponent;

  outputType: 'none' | 'message' | 'text' | 'markdown' | 'html' = 'none';
  output: PluginResult = null;

  ngOnInit(): void {}

  handlePluginResult(result: PluginResult) {
    if (result.render) {
      this.outputType = result.render;
    } else if (result.text) {
      this.outputType = 'text';
    } else {
      this.outputType = 'none';
    }

    this.output = result;
  }
}
