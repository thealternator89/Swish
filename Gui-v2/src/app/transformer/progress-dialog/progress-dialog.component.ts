import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { IpcService } from 'src/app/ipc.service';

@Component({
  selector: 'app-progress-dialog',
  templateUrl: './progress-dialog.component.html',
  styleUrls: ['./progress-dialog.component.scss']
})
export class ProgressDialogComponent {

  message: string;
  progress: number;

  progressSubscription: Subscription;
  statusSubscription: Subscription;

  constructor(ipc: IpcService, changeDetector: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) data: {runId: string, initialMessage: string, initialProgress: number}) {
      console.log('Constructing progress dialog');
    this.message = data.initialMessage ?? 'Please Wait...';
    this.progress = data.initialProgress;

    this.progressSubscription = ipc.registerPluginProgressUpdates().subscribe((update) => {
      if (update.id === data.runId) {
        this.progress = update.percentage;
        changeDetector.detectChanges();
      }
    });

    this.statusSubscription = ipc.registerPluginStatusUpdates().subscribe((update) => {
      if (update.id === data.runId) {
        this.message = update.status;
        changeDetector.detectChanges();
      }
    });
  }

  onClose() {
    this.progressSubscription.unsubscribe();
    this.statusSubscription.unsubscribe();
  }

}
