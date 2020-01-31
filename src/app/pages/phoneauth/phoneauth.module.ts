import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PhoneauthPageRoutingModule } from './phoneauth-routing.module';

import { PhoneauthPage } from './phoneauth.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PhoneauthPageRoutingModule
  ],
  declarations: [PhoneauthPage]
})
export class PhoneauthPageModule {}
