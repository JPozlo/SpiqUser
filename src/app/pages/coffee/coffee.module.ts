import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CoffeePageRoutingModule } from './coffee-routing.module';

import { CoffeePage } from './coffee.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CoffeePageRoutingModule
  ],
  declarations: [CoffeePage]
})
export class CoffeePageModule {}
