import { Component, OnInit } from '@angular/core';
import { IpcService } from '../ipc.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  version: string;

  constructor(private ipc: IpcService) {
    this.ipc.getAppVersion().then(version => {
      this.version = version;
    });
  }

  ngOnInit(): void {
  }

}
