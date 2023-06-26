import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoadedPlugin } from '../../../models/LoadedPlugin';
import { NuMonacoEditorComponent } from '@ng-util/monaco-editor';
import { PluginInputFormField } from 'src/models/FormFields';

@Component({
  selector: 'app-input-form',
  templateUrl: './input-form.component.html',
  styleUrls: ['./input-form.component.scss']
})
export class InputFormComponent implements OnInit {

  monacoOptions = {
    theme: 'vs',
    language: 'plaintext',
    scrollBeyondLastLine: false,
    selectionHighlight: false,
    occurrencesHighlight: false,
    renderLineHighlight: 'none',
    matchBrackets: 'never',
    minimap: {
      enabled: false,
    },
    wordWrap: true,
  }

  @Input("plugin")
  plugin: LoadedPlugin;

  @ViewChild('editor')
  inputEditor: NuMonacoEditorComponent;

  form: FormGroup;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.form = this.fb.group({});
    for (const field of this.plugin.input.fields) {
      this.form.addControl(field.label, this.fb.control(field.default));
    }
  }

  getLabelText(field: PluginInputFormField) {
    if (field.type === 'label') {
      return field.label;
    } else {
      return `${field.label}:`;
    }
  }

  getLabelClass(field: PluginInputFormField) {
    if (field.type === 'label') {
      return 'form-label' + (field.heading ? ' heading' : '');
    } else {
      return 'field-label';
    }
  }

  getFormFieldClass(field: PluginInputFormField) {
    switch(field.type) {
      case 'label': return '';
      case 'checkbox': return 'form-field checkbox-field';
      default: return 'form-field';
    }
  }

  getData() {
    const data = {
      formContent: this.getFormValue(),
      textContent: this.getTextValue(),
    }

    console.log(data);

    return data;
  }

  getFormValue() {
    const formValue = {};

    for (const field of this.plugin.input.fields) {
      const controlValue = this.form.get(field.label).value;

      if (field.type === 'label') {
        continue;
      }

      if (field.type === 'number') {
        formValue[field.key] = parseFloat(controlValue);
      } else {
        formValue[field.key] = controlValue;
      }
    }

    return formValue;
  }

  getTextValue() {
    return this.getModel()?.getValue() ?? '';
  }

  editorShowEvent(e: Event) {
    if (e.type === 'init') {
      this.setLanguage(this.plugin.input.syntax);
    }
  }

  private setLanguage(language: string) {
    const model = this.getModel();
    monaco.editor.setModelLanguage(model, language ?? 'plaintext');
  }

  private getEditor(): monaco.editor.IStandaloneCodeEditor | null {
    return this.inputEditor?.editor;
  }

  private getModel(): monaco.editor.ITextModel | null {
    return this.getEditor()?.getModel()!;
  }

}
