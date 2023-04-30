import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TransformerComponent } from './transformer/transformer.component';
import { AboutComponent } from './about/about.component';
import { LogviewComponent } from './logview/logview.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'logs', component: LogviewComponent },
  { path: 'transformer/:id', component: TransformerComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
