import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { BackendService } from '../backend.service';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-custom-plugins',
  templateUrl: './custom-plugins.component.html',
  styleUrls: ['./custom-plugins.component.scss'],
})
export class CustomPluginsComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    private backendService: BackendService
  ) {
    this.listPluginFiles();
  }

  files: string[] = [];

  ngOnInit(): void {}

  delete(filename: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '500px';
    dialogConfig.data = { filename: filename };

    this.dialog
      .open(DeleteDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed) {
          this.backendService
            .deleteCustomPlugin(filename)
            .subscribe(() => this.listPluginFiles());
        }
      });
  }

  listPluginFiles() {
    this.backendService
      .listCustomPlugins()
      .subscribe((files) => (this.files = files));
  }
}
