import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog'
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { NuMonacoEditorModule } from '@ng-util/monaco-editor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { TitlebarComponent } from './titlebar/titlebar.component';
import { PluginItemComponent } from './home/plugin-item/plugin-item.component';
import { FavPluginItemComponent } from './home/fav-plugin-item/fav-plugin-item.component';
import { TransformerComponent } from './transformer/transformer.component';
import { ErrorDialogComponent } from './transformer/error-dialog/error-dialog.component';
import { ResultSnackbarComponent } from './transformer/result-snackbar/result-snackbar.component';
import { OutputMessageComponent } from './transformer/output-message/output-message.component';
import { OutputPlaceholderComponent } from './transformer/output-placeholder/output-placeholder.component';
import { AboutComponent } from './about/about.component';
import { MarkdownModule } from 'ngx-markdown';
import { OutputMarkdownComponent } from './transformer/output-markdown/output-markdown.component';
import { LogviewComponent } from './logview/logview.component';
import { LogitemComponent } from './logview/logitem/logitem.component';
import { ProgressDialogComponent } from './transformer/progress-dialog/progress-dialog.component';
import { InputCodeComponent } from './transformer/input-code/input-code.component';
import { OutputCodeComponent } from './transformer/output-code/output-code.component';
import { OutputHtmlComponent } from './transformer/output-html/output-html.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TitlebarComponent,
    PluginItemComponent,
    FavPluginItemComponent,
    TransformerComponent,
    ErrorDialogComponent,
    ResultSnackbarComponent,
    OutputMessageComponent,
    OutputPlaceholderComponent,
    AboutComponent,
    OutputMarkdownComponent,
    LogviewComponent,
    LogitemComponent,
    ProgressDialogComponent,
    InputCodeComponent,
    OutputCodeComponent,
    OutputHtmlComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    MatChipsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatProgressBarModule,
    MatSnackBarModule,
    NuMonacoEditorModule.forRoot({
      baseUrl: `lib`,
    }),
    MarkdownModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
