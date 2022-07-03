import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-module-manage',
  templateUrl: './module-manage.component.html',
  styleUrls: ['./module-manage.component.scss'],
})
export class ModuleManageComponent implements OnInit {
  installedModules: string[] = [];
  moduleToInstall?: string;

  constructor(
    private backendService: BackendService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.retrieveInstalledModules();
  }

  install(): void {
    const module = this.moduleToInstall;

    if (!module) {
      return;
    }

    this.backendService.installModule(module).subscribe(() => {
      this.snackBar.open(`Installed module: ${module}`);
      this.retrieveInstalledModules();
    });
  }

  uninstall(module: string) {
    const moduleName = module.split('@')[0];
    // TODO: prompt for confirmation before continuing

    this.backendService.uninstallModule(moduleName).subscribe(() => {
      this.snackBar.open(`Removed module: ${moduleName}`);
      this.retrieveInstalledModules();
    });
  }

  retrieveInstalledModules() {
    this.backendService.listInstalledModules().subscribe((result) => {
      this.installedModules = result;
    });
  }

  showSnackbar(message: string) {
    this.snackBar.open(message, undefined, { duration: 3000 });
  }
}
