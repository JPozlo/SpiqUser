import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PhoneauthPage } from './phoneauth.page';

const routes: Routes = [
  {
    path: '',
    component: PhoneauthPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PhoneauthPageRoutingModule {}
