import { Injectable } from '@angular/core';
import { last, Observable, Subject } from 'rxjs';
import { SettingsService } from './settings.service';

const isMac = window.navigator.platform.toUpperCase().indexOf('MAC') >= 0;

@Injectable({
  providedIn: 'root',
})
export class HotkeyService {
  togglePaletteSubject = new Subject<void>();
  closePaletteSubject = new Subject<void>();

  public paletteHotkey = '';

  private lastKey?: string;
  private lastKeyTime?: number;

  private hotkeys = [
    {
      condition: (evt: KeyboardEvent) => evt.key === 'Shift',
      action: () => {
        console.log(new Date().getTime() - this.lastKeyTime!);
        if (
          this.lastKey === 'Shift' &&
          new Date().getTime() - this.lastKeyTime! < 500
        ) {
          this.togglePaletteSubject.next();
        }
      },
    },
  ];

  constructor(settingsService: SettingsService) {
    this.hotkeys = [
      {
        condition: (evt: KeyboardEvent) => evt.key === 'Escape',
        action: () => this.closePaletteSubject.next(),
      },
      this.generateHotkeys(settingsService.paletteHotkey),
    ];

    this.setHotkeyHint(settingsService.paletteHotkey);

    // Need to do keydown since e.g. if pressing ctrl+p, print will be triggered before key up is triggered
    window.onkeydown = (evt: KeyboardEvent) => {
      const matched = this.hotkeys.find((hotkey) => hotkey.condition(evt));
      if (matched) {
        // Remove the last key since we've matched.
        matched.action();
        evt.preventDefault();
      }

      this.lastKey = evt.key;
      this.lastKeyTime = new Date().getTime();
    };
  }

  generateHotkeys(definition: 'sublime' | 'vs' | 'jb') {
    switch (definition) {
      case 'vs': {
        return {
          condition: (evt: KeyboardEvent) => evt.ctrlKey && evt.key === ',',
          action: () => this.togglePaletteSubject.next(),
        };
      }
      case 'jb': {
        return {
          condition: (evt: KeyboardEvent) => {
            // Current key is shift, previous key is shift, and the last key was pressed less than 150ms ago.
            return (
              evt.key === 'Shift' &&
              this.lastKey === 'Shift' &&
              new Date().getTime() - this.lastKeyTime! < 150
            );
          },
          action: () => {
            this.lastKey = undefined;
            this.lastKeyTime = undefined;
            this.togglePaletteSubject.next();
          },
        };
      }
      default: {
        return this.cmdOrControlHotkey('p', () =>
          this.togglePaletteSubject.next()
        );
      }
    }
  }

  setHotkeyHint(definition: 'sublime' | 'vs' | 'jb') {
    switch (definition) {
      case 'jb':
        this.paletteHotkey = 'Shift twice';
        break;
      case 'vs':
        this.paletteHotkey = 'Ctrl + ,';
        break;
      default:
        this.paletteHotkey = `${isMac ? '⌘' : 'Ctrl'} + P`;
    }
  }

  cmdOrControlHotkey(key: string, action: () => void) {
    if (isMac) {
      return {
        condition: (evt: KeyboardEvent) => evt.metaKey && evt.key === key,
        action: action,
      };
    } else {
      return {
        condition: (evt: KeyboardEvent) => evt.ctrlKey && evt.key === key,
        action: action,
      };
    }
  }

  onTogglePalette(): Observable<void> {
    return this.togglePaletteSubject.asObservable();
  }

  onClosePalette(): Observable<void> {
    return this.closePaletteSubject.asObservable();
  }
}
