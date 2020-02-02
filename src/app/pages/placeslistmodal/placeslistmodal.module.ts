import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlaceslistmodalPageRoutingModule } from './placeslistmodal-routing.module';

import { PlaceslistmodalPage } from './placeslistmodal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlaceslistmodalPageRoutingModule
  ],
  declarations: [PlaceslistmodalPage]
})
export class PlaceslistmodalPageModule {}
