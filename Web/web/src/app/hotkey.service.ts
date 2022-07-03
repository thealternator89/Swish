import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

var isMac = window.navigator.platform.toUpperCase().indexOf('MAC') >= 0;

@Injectable({
  providedIn: 'root',
})
export class HotkeyService {
  togglePaletteSubject = new Subject<void>();
  closePaletteSubject = new Subject<void>();

  private hotkeys = [
    {
      condition: (evt: KeyboardEvent) =>
        isMac && evt.metaKey && evt.key === 'p',
      action: () => this.togglePaletteSubject.next(),
    },
    {
      condition: (evt: KeyboardEvent) =>
        !isMac && evt.ctrlKey && evt.key === 'p',
      action: () => this.togglePaletteSubject.next(),
    },
    {
      condition: (evt: KeyboardEvent) => evt.key === 'Escape',
      action: () => this.closePaletteSubject.next(),
    },
  ];

  constructor() {
    // Need to do keydown since e.g. if pressing ctrl+p, print will be triggered before key up is triggered
    window.onkeydown = (evt: KeyboardEvent) => {
      const matched = this.hotkeys.find((hotkey) => hotkey.condition(evt));
      if (matched) {
        matched.action();
        evt.preventDefault();
      }
    };
  }

  onTogglePalette(): Observable<void> {
    return this.togglePaletteSubject.asObservable();
  }

  onClosePalette(): Observable<void> {
    return this.closePaletteSubject.asObservable();
  }
}
