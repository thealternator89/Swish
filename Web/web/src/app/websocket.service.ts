import { Injectable } from '@angular/core';
import { map, Observable, Observer, Subject } from 'rxjs';
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
  // TODO figure out how to use the current URL host
  private readonly websocketUrl = `ws://${window.location.host}`;

  //null assertion as this is set in 'connect' called from constructor so we know it will be there.
  public events: WebSocketSubject<MessageEvent>;

  constructor() {
    this.events = webSocket(this.websocketUrl);
  }
}
