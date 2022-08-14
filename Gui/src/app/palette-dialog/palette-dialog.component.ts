import { ChangeDetectorRef, Component, NgZone, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';

import { MatDialogRef } from '@angular/material/dialog';
import { PluginDefinition } from 'swish-base';
import { IpcService } from '../ipc.service';
import { PalettePluginItemComponent } from '../palette-plugin-item/palette-plugin-item.component';

@Component({
  selector: 'app-palette-dialog',
  templateUrl: './palette-dialog.component.html',
  styleUrls: ['./palette-dialog.component.scss'],
})
export class PaletteDialogComponent {
  plugins: PluginDefinition[];

  @ViewChildren(PalettePluginItemComponent)
  pluginComponents!: QueryList<PalettePluginItemComponent>;

  keyManager?: ActiveDescendantKeyManager<PalettePluginItemComponent>;

  constructor(
    public dialogRef: MatDialogRef<PaletteDialogComponent>,
    private changeDetector: ChangeDetectorRef,
    private ngZone: NgZone,
    private ipc: IpcService
  ) {
    this.dialogRef.backdropClick().subscribe(() => {
      this.close();
    });
  }

  ngAfterViewInit(): void {
    this.onSearchChange('');
    this.keyManager = new ActiveDescendantKeyManager(
      this.pluginComponents
    ).withWrap();
  }

  close() {
    this.ngZone.run(() => {
      this.dialogRef.close();
    });
  }

  onSearchChange(query) {
    this.ipc.searchPlugins(query).then((results: PluginDefinition[]) => {
      this.plugins = results;

      // Ensure we update the UI before we try to set the first item as active
      this.changeDetector.detectChanges();
      this.keyManager!.setFirstItemActive();
    });
  }

  selectPlugin(item?: PalettePluginItemComponent) {
    this.dialogRef.close(item?.plugin);
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.selectPlugin(this.keyManager?.activeItem!);
    }
    this.keyManager?.onKeydown(event);
  }

  focusPlugin(item: PalettePluginItemComponent) {
    this.keyManager?.setActiveItem(item);
  }
}
