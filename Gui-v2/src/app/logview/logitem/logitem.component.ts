import { Component, Input, OnInit } from '@angular/core';

// TODO move this interface to a shared location with LogviewComponent
interface LogItem {
  level: string;
  message: string;
  time: string;
  source: string;
}

@Component({
  selector: 'app-logitem',
  templateUrl: './logitem.component.html',
  styleUrls: ['./logitem.component.scss']
})
export class LogitemComponent implements OnInit {

  @Input('data')
  log: LogItem;

  constructor() { }

  ngOnInit(): void {
  }

  logTimeInLocalTimezone(): string {
    const date = new Date(this.log.time);
    return date.toLocaleString();
  }

  levelIconName(): string {
    switch(this.log.level) {
      case 'warn': return 'warning';
      case 'error': return 'error';
      default: return 'info';
    }
  }
}
