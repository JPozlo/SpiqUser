import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SessionHistoryPage } from './session-history.page';

const routes: Routes = [
  {
    path: '',
    component: SessionHistoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SessionHistoryPageRoutingModule {}
