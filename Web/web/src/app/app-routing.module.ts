import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateCustomPluginComponent } from './create-custom-plugin/create-custom-plugin.component';
import { CustomPluginsComponent } from './custom-plugins/custom-plugins.component';
import { EditCustomPluginComponent } from './edit-custom-plugin/edit-custom-plugin.component';
import { EditorComponent } from './editor/editor.component';
import { ModuleManageComponent } from './module-manage/module-manage.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: EditorComponent },
  { path: 'custom-plugins', component: CustomPluginsComponent },
  { path: 'custom-plugins/new', component: CreateCustomPluginComponent },
  {
    path: 'custom-plugins/edit/:filename',
    component: EditCustomPluginComponent,
  },
  { path: 'modules', component: ModuleManageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
