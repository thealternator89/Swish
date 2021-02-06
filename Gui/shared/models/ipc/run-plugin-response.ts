import { PluginResult } from 'beep-base/dist/plugins/plugin-definition';

export interface RunPluginResponse extends PluginResult {
  error?: Error;
}
