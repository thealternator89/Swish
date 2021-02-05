import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';


import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';

import { AppComponent } from './app.component';

import { NuMonacoEditorModule } from '@ng-util/monaco-editor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PaletteDialogComponent } from './palette-dialog/palette-dialog.component';
import { StatusComponent } from './status/status.component';
import { EditorComponent } from './editor/editor.component'

@NgModule({
  declarations: [
    AppComponent,
    PaletteDialogComponent,
    StatusComponent,
    EditorComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    NuMonacoEditorModule.forRoot({
      baseUrl: `lib`,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
