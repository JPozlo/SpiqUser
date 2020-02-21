import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OfflineredirectmodalPage } from './offlineredirectmodal.page';

const routes: Routes = [
  {
    path: '',
    component: OfflineredirectmodalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OfflineredirectmodalPageRoutingModule {}
