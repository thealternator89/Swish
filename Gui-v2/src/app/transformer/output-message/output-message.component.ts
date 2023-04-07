import { Component, OnInit } from '@angular/core';

type Level = 'error'|'warn'|'info'|'success';

@Component({
  selector: 'app-output-message',
  templateUrl: './output-message.component.html',
  styleUrls: ['./output-message.component.scss']
})
export class OutputMessageComponent implements OnInit {
  text: string;
  level: Level = 'info';

  constructor() { }

  ngOnInit(): void {
  }

  setMessage(message: {level: 'info'|'warn'|'error'|'success', text: string}): void {
    this.level = message.level;
    this.text = message.text;
  }

  getIcon(): string {
    return {
      error: 'error',
      warn: 'warning',
      info: 'info',
      success: 'check_circle'
    }[this.level];
  }

  getClass(): Level {
    return this.level;
  }

}
