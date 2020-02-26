import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LockerPageRoutingModule } from './locker-routing.module';

import { LockerPage } from './locker.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LockerPageRoutingModule
  ],
  declarations: [LockerPage]
})
export class LockerPageModule {}
