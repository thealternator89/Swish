import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import {
  Event,
  PluginUpdateEventData,
  WebsocketService,
} from '../websocket.service';

@Component({
  selector: 'app-loading-dialog',
  templateUrl: './loading-dialog.component.html',
  styleUrls: ['./loading-dialog.component.scss'],
})
export class LoadingDialogComponent implements OnInit {
  message: string = 'Loading...';
  percent?: number;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      runId: string;
      initial: { status: string; progress: number };
    },
    websocketService: WebsocketService
  ) {
    this.message = data.initial?.status ?? this.message;
    this.percent = data.initial?.progress ?? this.percent;

    websocketService.events.subscribe((event) => {
      // If this is a plugin update (for the current run), process it
      if (
        event.type === 'PluginUpdate' &&
        event.data.runId === this.data.runId
      ) {
        const updateData = event.data as PluginUpdateEventData;

        switch (updateData.updateType) {
          case 'progress': {
            this.percent = updateData.data as number;
            break;
          }
          case 'status': {
            this.message = updateData.data as string;
            break;
          }
        }
      }
    });
  }

  getProgressBarMode() {
    if (this.percent === undefined || this.percent < 0) {
      return 'indeterminate';
    }
    return 'determinate';
  }

  ngOnInit(): void {}
}
