import {
  ChangeDetectorRef,
  Component,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';

import { LoadedPlugin } from 'swish-base';
import { BackendService } from '../backend.service';
import { PalettePluginItemComponent } from '../palette-plugin-item/palette-plugin-item.component';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-palette',
  templateUrl: './palette.component.html',
  styleUrls: ['./palette.component.scss'],
})
export class PaletteComponent {
  constructor(
    public backend: BackendService,
    private changeDetector: ChangeDetectorRef,
    private dialogRef: MatDialogRef<PaletteComponent>
  ) {}

  plugins: LoadedPlugin[] = [];

  @ViewChildren(PalettePluginItemComponent)
  pluginComponents!: QueryList<PalettePluginItemComponent>;

  keyManager?: ActiveDescendantKeyManager<PalettePluginItemComponent>;

  ngAfterViewInit(): void {
    this.searchPlugins('');
    this.keyManager = new ActiveDescendantKeyManager(
      this.pluginComponents
    ).withWrap();
  }

  searchPlugins(term: string) {
    this.backend.searchPlugins(term).subscribe((results) => {
      this.plugins = results;

      // Ensure we update the UI before we try to set the first item as active
      this.changeDetector.detectChanges();
      this.keyManager!.setFirstItemActive();
    });
  }

  searchModified(_event: Event, term: string) {
    this.searchPlugins(term);
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

  selectPlugin(item?: PalettePluginItemComponent) {
    this.dialogRef.close(item?.plugin.id);
  }
}
