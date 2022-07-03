import {
  Component,
  ElementRef,
  Host,
  HostBinding,
  Input,
  OnInit,
} from '@angular/core';
import { Highlightable, ListKeyManagerOption } from '@angular/cdk/a11y';

import { LoadedPlugin } from 'swish-base';
import { PaletteComponent } from '../palette/palette.component';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-palette-plugin-item',
  templateUrl: './palette-plugin-item.component.html',
  styleUrls: ['./palette-plugin-item.component.scss'],
})
export class PalettePluginItemComponent
  implements Highlightable, ListKeyManagerOption, OnInit {
  @Input('plugin')
  public plugin!: LoadedPlugin;

  @Input('disabled')
  public disabled?: boolean | undefined;

  private _isActive = false;

  @HostBinding('class.active') get isActive() {
    return this._isActive;
  }

  constructor(
    private elRef: ElementRef,
    @Host() private parent: PaletteComponent
  ) {}

  ngOnInit(): void {
    fromEvent(this.elRef.nativeElement, 'mouseover').subscribe(() =>
      this.parent.focusPlugin(this)
    );

    fromEvent(this.elRef.nativeElement, 'click').subscribe(() =>
      this.parent.selectPlugin(this)
    );
  }

  setActiveStyles(): void {
    this._isActive = true;
    this.elRef.nativeElement.scrollIntoView({ block: 'nearest' });
  }

  setInactiveStyles(): void {
    this._isActive = false;
  }

  getLabel() {
    return this.plugin.name;
  }

  getPluginIcon(): string {
    return this.plugin.icon || 'extension';
  }
}
