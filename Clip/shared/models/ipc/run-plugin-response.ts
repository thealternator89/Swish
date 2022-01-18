import { PluginResult } from 'swish-base';

export interface RunPluginResponse extends PluginResult {
  error?: Error;
}
