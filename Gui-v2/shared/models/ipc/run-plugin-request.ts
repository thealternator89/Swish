export interface RunPluginRequest {
  plugin: string;
  data: {textContent?: string, formContent?: {[key: string]: any}};
  requestId: string;
}
