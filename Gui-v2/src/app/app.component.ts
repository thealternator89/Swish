import { Component } from '@angular/core';
import { IpcService } from './ipc.service';

import { MenuCommand } from 'shared/const/ipc/menu-command';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Swish';


  constructor(ipc: IpcService) {
    ipc.registerMenuCommands().subscribe((value: MenuCommand) => {
      switch (value) {
        case 'editor.cut':
          document.execCommand('Cut');
          break;
        case 'editor.copy':
          document.execCommand('Copy');
          break;
        case 'editor.paste':
          document.execCommand('Paste');
          break;
      }
    });
  }

  getPluginRunId(): string {
    // Get a random string of 32 characters.
    const charsBetween = (start: number, end: number) =>
      new Array(end - start + 1)
        .join('.')
        .split('.')
        .map((_v, i) => String.fromCharCode(start + i));

    const availableChars = [
      ...charsBetween('a'.charCodeAt(0), 'z'.charCodeAt(0)),
      ...charsBetween('A'.charCodeAt(0), 'Z'.charCodeAt(0)),
      ...charsBetween('0'.charCodeAt(0), '9'.charCodeAt(0)),
    ];

    const randomChar = () =>
      availableChars[Math.trunc(Math.random() * availableChars.length)];

    return new Array(32).join('.').split('.').map(randomChar).join('');
  }
}
