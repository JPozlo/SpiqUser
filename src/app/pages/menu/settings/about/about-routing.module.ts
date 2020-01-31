import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AboutPage } from './about.page';

const routes: Routes = [
  {
    path: '',
    component: AboutPage,
  },
  {
    path: 'help',
    loadChildren: () => import('./help/help.module').then(m => m.HelpPageModule)
  },
  {
    path: 'legal',
    loadChildren: () => import('./legal/legal.module').then(m => m.LegalPageModule)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AboutPageRoutingModule { }
