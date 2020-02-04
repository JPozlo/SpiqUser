import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SessionHistoryPageRoutingModule } from './session-history-routing.module';

import { SessionHistoryPage } from './session-history.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SessionHistoryPageRoutingModule
  ],
  declarations: [SessionHistoryPage]
})
export class SessionHistoryPageModule {}
