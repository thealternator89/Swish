export interface PluginInputFormField {
  key: string;
  type: 'text' | 'number' | 'checkbox' | 'select' | 'date' | 'label';
  label: string;
  heading: boolean; // Only used for labels - indicates that this label is a heading
  opts: string[];
  default: string | number | boolean;
  placeholder: string; // Only used if type is text, select, date or number
}
