import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OfflineredirectmodalPageRoutingModule } from './offlineredirectmodal-routing.module';

import { OfflineredirectmodalPage } from './offlineredirectmodal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OfflineredirectmodalPageRoutingModule
  ],
  declarations: [OfflineredirectmodalPage]
})
export class OfflineredirectmodalPageModule {}
