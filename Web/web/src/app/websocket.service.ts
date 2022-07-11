import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { PluginResult } from 'swish-base';

export interface Event {
  type: 'PluginResult' | 'PluginUpdate' | 'RunPlugin';
  data: PluginResultEventData | PluginUpdateEventData | RunPluginRequestData;
}

export interface RunPluginRequestData {
  pluginId: string;
  data: string;
  runId: string;
}

export interface PluginResultEventData {
  runId: string;
  result: PluginResult;
}

export interface PluginUpdateEventData {
  runId: string;
  updateType: 'status' | 'progress';
  data: string | number;
}

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private readonly websocketUrl;

  //null assertion as this is set in 'connect' called from constructor so we know it will be there.
  public events: WebSocketSubject<MessageEvent>;

  constructor() {
    const proto = window.location.protocol === 'https:' ? 'wss' : 'ws';
    this.websocketUrl = `${proto}://${window.location.host}`;

    this.events = webSocket(this.websocketUrl);
  }
}
