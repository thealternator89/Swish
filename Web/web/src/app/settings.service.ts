import { Injectable } from '@angular/core';

const KEY_COLOR_SCHEME = 'colorscheme';
const KEY_EDITOR_FONT = 'editorfont';
const KEY_EDITOR_FONT_SIZE = 'editorfontsize';
const KEY_EDITOR_LIGATURES = 'editorligatures';
const KEY_PALETTE_HOTKEY = 'palettehotkey';

const COLOR_LIGHT = 'light';
const COLOR_DARK = 'dark';

type ColorScheme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  constructor() {}

  get editorColorScheme(): ColorScheme {
    return localStorage.getItem(KEY_COLOR_SCHEME) === COLOR_LIGHT
      ? COLOR_LIGHT
      : COLOR_DARK;
  }

  set editorColorScheme(value: ColorScheme) {
    localStorage.setItem(KEY_COLOR_SCHEME, value);
  }

  get editorFont(): string | undefined {
    return localStorage.getItem(KEY_EDITOR_FONT) ?? undefined;
  }

  set editorFont(value: string | undefined) {
    if (!value) {
      localStorage.removeItem(KEY_EDITOR_FONT);
    } else {
      localStorage.setItem(KEY_EDITOR_FONT, value);
    }
  }

  get editorFontSize(): number | undefined {
    const value = localStorage.getItem(KEY_EDITOR_FONT_SIZE);
    return value ? Number(value) : undefined;
  }

  set editorFontSize(value: number | undefined) {
    if (!value) {
      localStorage.removeItem(KEY_EDITOR_FONT_SIZE);
    } else {
      localStorage.setItem(KEY_EDITOR_FONT_SIZE, String(value));
    }
  }

  get editorLigatures(): boolean {
    // If the property is set, and it is 'true', return true. Otherwise false.
    return localStorage.getItem(KEY_EDITOR_LIGATURES)?.toLowerCase() === 'true'
      ? true
      : false;
  }

  set editorLigatures(value: boolean) {
    localStorage.setItem(KEY_EDITOR_LIGATURES, String(value));
  }
}
