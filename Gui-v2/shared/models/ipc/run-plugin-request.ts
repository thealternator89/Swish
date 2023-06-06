export interface RunPluginRequest {
  plugin: string;
  data: {textContent?: string, formData?: {[key: string]: any}};
  requestId: string;
}
