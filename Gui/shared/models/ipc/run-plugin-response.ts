import { PluginResult } from 'beep-base';

export interface RunPluginResponse extends PluginResult {
  error?: Error;
}
