import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomPluginsComponent } from './custom-plugins/custom-plugins.component';
import { EditCustomPluginComponent } from './edit-custom-plugin/edit-custom-plugin.component';
import { EditorComponent } from './editor/editor.component';
import { ModuleManageComponent } from './module-manage/module-manage.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: EditorComponent },
  { path: 'custom-plugins', component: CustomPluginsComponent },
  { path: 'custom-plugins/new', component: EditCustomPluginComponent },
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
