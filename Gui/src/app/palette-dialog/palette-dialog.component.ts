import { Component, NgZone, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { PluginDefinition } from 'swish-base';
import { IpcService } from '../ipc.service';

@Component({
  selector: 'app-palette-dialog',
  templateUrl: './palette-dialog.component.html',
  styleUrls: ['./palette-dialog.component.scss'],
})
export class PaletteDialogComponent implements OnInit {
  plugins: PluginDefinition[];

  constructor(
    public dialogRef: MatDialogRef<PaletteDialogComponent>,
    private ngZone: NgZone,
    private ipc: IpcService
  ) {
    this.dialogRef.backdropClick().subscribe(() => {
      this.close();
    });
  }

  ngOnInit(): void {
    this.onSearchChange('');
  }

  close() {
    this.ngZone.run(() => {
      this.dialogRef.close();
    });
  }

  onSearchChange(query) {
    this.ipc.searchPlugins(query).then((results: PluginDefinition[]) => {
      this.plugins = results;
    });
  }

  selectPlugin(plugin) {
    this.dialogRef.close(plugin);
  }
}
