import { Highlightable } from '@angular/cdk/a11y';
import { ChangeDetectorRef, Component, ElementRef, Host, HostBinding, Input, OnInit } from '@angular/core';
import { fromEvent } from 'rxjs';
import { PluginDefinition } from 'swish-base';
import { PaletteDialogComponent } from '../palette-dialog/palette-dialog.component';

@Component({
  selector: 'app-palette-plugin-item',
  templateUrl: './palette-plugin-item.component.html',
  styleUrls: ['./palette-plugin-item.component.scss'],
})
export class PalettePluginItemComponent implements Highlightable, OnInit {
  @Input()
  public readonly plugin: PluginDefinition;

  private _isActive = false;

  @Input('disabled')
  public disabled?: boolean | undefined;

  @HostBinding('class.active') get isActive() {
    return this._isActive;
  }

  constructor(
    private elRef: ElementRef,
    @Host() private parent: PaletteDialogComponent,
    private changeDetector: ChangeDetectorRef,) {}

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
    this.changeDetector.detectChanges();
    this.elRef.nativeElement.scrollIntoView({ block: 'nearest' });
  }

  setInactiveStyles(): void {
    this._isActive = false;
  }

  getLabel?(): string {
    return this.plugin.name;
  }

  getPluginIcon() {
    return this.plugin.icon || 'extension';
  }
}
