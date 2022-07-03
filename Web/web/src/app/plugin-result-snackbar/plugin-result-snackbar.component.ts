import { Component, HostBinding, Inject, OnInit } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-plugin-result-snackbar',
  templateUrl: './plugin-result-snackbar.component.html',
  styleUrls: ['./plugin-result-snackbar.component.scss'],
})
export class PluginResultSnackbarComponent implements OnInit {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA)
    public data: { text: string; level: 'error' | 'info' | 'warn' | 'success' }
  ) {}

  ngOnInit(): void {}

  getIcon() {
    // Map from a status to an icon name
    return {
      error: 'error',
      warn: 'warning',
      info: 'info',
      success: 'check_circle',
    }[this.data.level];
  }
}
