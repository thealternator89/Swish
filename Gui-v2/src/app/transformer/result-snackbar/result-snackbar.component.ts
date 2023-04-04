import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-result-snackbar',
  templateUrl: './result-snackbar.component.html',
  styleUrls: ['./result-snackbar.component.scss']
})
export class ResultSnackbarComponent {

  constructor(
    @Inject(MAT_SNACK_BAR_DATA)
    public data: { text: string; level: 'error' | 'info' | 'warn' | 'success' }
  ) { }

  getMessage = () => this.data.text;

  getIcon() {
    // Map from a level to an icon name
    return {
      error: 'error',
      warn: 'warning',
      info: 'info',
      success: 'check_circle',
    }[this.data.level];
  }
}
