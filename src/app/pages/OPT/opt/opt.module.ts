import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OptPageRoutingModule } from './opt-routing.module';

import { OptPage } from './opt.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OptPageRoutingModule
  ],
  declarations: [OptPage]
})
export class OptPageModule {}
