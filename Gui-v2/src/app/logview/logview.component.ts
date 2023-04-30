import { Component, OnInit } from '@angular/core';
import { IpcService } from '../ipc.service';

interface LogItem {
  level: string;
  message: string;
  time: string;
}

@Component({
  selector: 'app-logview',
  templateUrl: './logview.component.html',
  styleUrls: ['./logview.component.scss']
})
export class LogviewComponent {

  logs: LogItem[] = [];

  constructor(private ipc: IpcService) {
    this.ipc.getLogs().then(logs => {
      this.logs = logs;
    });
  }

}
