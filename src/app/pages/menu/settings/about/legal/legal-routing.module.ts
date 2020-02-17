import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LegalPage } from './legal.page';

const routes: Routes = [
  {
    path: '',
    component: LegalPage
  },  {
    path: 'privacy-policy',
    loadChildren: () => import('./privacy-policy/privacy-policy.module').then( m => m.PrivacyPolicyPageModule)
  },
  {
    path: 'terms-conditions',
    loadChildren: () => import('./terms-conditions/terms-conditions.module').then( m => m.TermsConditionsPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LegalPageRoutingModule {}
