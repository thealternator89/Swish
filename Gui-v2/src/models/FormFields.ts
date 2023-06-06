export interface PluginInputFormField {
  key: string;
  type: 'text' | 'number' | 'checkbox' | 'select' | 'date' | 'label';
  label: string;
  heading: boolean; // Only used for labels - indicates that this label is a heading
}
