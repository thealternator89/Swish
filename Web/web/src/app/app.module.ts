import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';

import { NuMonacoEditorModule } from '@ng-util/monaco-editor';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EditorComponent } from './editor/editor.component';
import { StoreModule } from '@ngrx/store';
import { PaletteComponent } from './palette/palette.component';
import { PluginResultSnackbarComponent } from './plugin-result-snackbar/plugin-result-snackbar.component';
import { PalettePluginItemComponent } from './palette-plugin-item/palette-plugin-item.component';
import { LoadingDialogComponent } from './loading-dialog/loading-dialog.component';
import { CustomPluginsComponent } from './custom-plugins/custom-plugins.component';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { ModuleManageComponent } from './module-manage/module-manage.component';
import { EditCustomPluginComponent } from './edit-custom-plugin/edit-custom-plugin.component';
import { SettingsComponent } from './settings/settings.component';

@NgModule({
  declarations: [
    AppComponent,
    EditorComponent,
    PaletteComponent,
    PluginResultSnackbarComponent,
    PalettePluginItemComponent,
    LoadingDialogComponent,
    CustomPluginsComponent,
    DeleteDialogComponent,
    ModuleManageComponent,
    EditCustomPluginComponent,
    SettingsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatProgressBarModule,
    MatSelectModule,
    MatSnackBarModule,
    MatToolbarModule,
    NuMonacoEditorModule.forRoot(),
    ReactiveFormsModule,
    StoreModule.forRoot({}, {}),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
