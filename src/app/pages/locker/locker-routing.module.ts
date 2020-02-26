import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LockerPage } from './locker.page';

const routes: Routes = [
  {
    path: '',
    component: LockerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LockerPageRoutingModule {}
