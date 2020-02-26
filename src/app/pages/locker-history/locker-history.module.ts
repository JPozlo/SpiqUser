import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LockerHistoryPageRoutingModule } from './locker-history-routing.module';

import { LockerHistoryPage } from './locker-history.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LockerHistoryPageRoutingModule
  ],
  declarations: [LockerHistoryPage]
})
export class LockerHistoryPageModule {}
