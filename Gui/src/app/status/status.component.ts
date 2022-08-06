import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { IpcService } from '../ipc.service';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss'],
})
export class StatusComponent implements OnInit {
  text: string;
  progress?: number;
  level?: 'error' | 'warn' | 'info' | 'success';

  currentPluginRunId?: string;
  currentStatusTimeout?: NodeJS.Timeout;

  constructor(private changeDetector: ChangeDetectorRef, ipc: IpcService) {
    this.text = buildDefaultStatusText();

    ipc.registerPluginProgressUpdates().subscribe((update) => {
      console.log(
        `${update.percentage}% - RunID: ${update.id}. CurrentRunId: ${this.currentPluginRunId}`
      );
      // If the runId doesn't match the current run, it's probably old and we don't want to render it.
      if (this.currentPluginRunId !== update.id) {
        return;
      }

      // TODO: If the status hasn't been manually set for this run, we need to set it to something like "Running <plugin>..."
      this.updateProgress(update.percentage);
    });

    ipc.registerPluginStatusUpdates().subscribe((update) => {
      console.log(
        `${update.status} - RunID: ${update.id}. CurrentRunId: ${this.currentPluginRunId}`
      );
      if (this.currentPluginRunId !== update.id) {
        return;
      }

      this.updateStatus(update.status);
    });
  }

  ngOnInit(): void {}

  updateStatus(newStatus: string) {
    if (newStatus) {
      this.text = newStatus;
    } else {
      this.text = buildDefaultStatusText();
    }
    this.changeDetector.detectChanges();
  }

  updateProgress(newProgress: number | undefined) {
    // Coerce percentage into the range 0 - 100
    if (newProgress < 0) {
      this.progress = 0;
    } else if (newProgress > 100) {
      this.progress = 100;
    }

    // NOTE: We *DO* want to store undefined if passed. This will hide the progress bar.
    this.progress = newProgress;
    this.changeDetector.detectChanges();
  }

  clearProgressAndStatus() {
    if (this.currentStatusTimeout) {
      clearTimeout(this.currentStatusTimeout);
      this.currentStatusTimeout = undefined;
    }
    this.level = undefined;
    this.updateStatus(undefined);
    this.updateProgress(undefined);
  }

  setStatus(
    message: string,
    level: 'error' | 'warn' | 'info' | 'success',
    autoClear: boolean = true
  ) {
    this.clearProgressAndStatus();
    this.level = level;
    this.updateStatus(message);

    if (autoClear) {
      this.currentStatusTimeout = setTimeout(
        () => this.clearProgressAndStatus(),
        10000
      );
    }
  }

  setCurrentPluginRun(runId: string) {
    this.currentPluginRunId = runId;
    this.clearProgressAndStatus(); // ensure we have a clean status to start a new run.
  }

  clearCurrentPluginRun() {
    this.currentPluginRunId = undefined;
  }
}

function buildDefaultStatusText() {
  const isMac = window.navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const cmdOrCtrl = isMac ? '⌘' : 'Ctrl';
  return `Press ${cmdOrCtrl} + Shift + P to get started`;
}
