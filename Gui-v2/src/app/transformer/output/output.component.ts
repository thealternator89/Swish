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

  tabs: string[] = [];

  outputType: 'none' | 'message' | 'tabs' = 'none';
  output: PluginResult = null;

  ngOnInit(): void {}

  handlePluginResult(result: PluginResult) {
    if (result.render || result.text) {
      this.outputType = 'tabs';
      this.tabs = this.getTabs(result);
    } else {
      this.outputType = 'none';
    }

    this.output = result;
  }

  tabName(key: string) {
    switch (key) {
      case 'text': {
        const language = this.syntaxName(this.output.syntax);
        if (language) {
          return `Text (${language})`;
        }
        return 'Text';
      }
      case 'markdown':
        return 'Markdown';
      case 'html':
        return 'HTML';
      default:
        return key;
    }
  }

  private syntaxName(language: string) {
    switch (language) {
      case 'text':
      case 'plaintext':
      case undefined:
        return '';
      case 'json':
      case 'xml':
      case 'yaml':
        return language.toLocaleUpperCase();
      default:
        return this.capitalize(language);
    }
  }

  private capitalize(value: string) {
    return value ? value.charAt(0).toUpperCase() + value.slice(1) : '';
  }

  private getTabs(result: PluginResult) {
    const tabs = [];

    // If the plugin specifies a type to render, use that as the first tab
    if (result.render) {
      tabs.push(result.render);
    }

    // Look for other types of output and add them as tabs if they aren't already there
    if (result.text) {
      tabs.includes('text') || tabs.push('text');
    }
    if (result.markdown) {
      tabs.includes('markdown') || tabs.push('markdown');
    }
    if (result.html) {
      tabs.includes('html') || tabs.push('html');
    }
    return tabs;
  }
}
