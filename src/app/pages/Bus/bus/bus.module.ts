import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BusPageRoutingModule } from './bus-routing.module';
import { BusPage } from './bus.page';

import { AjouterBusComponent } from '../../../components/Bus/ajouter-bus/ajouter-bus.component';
import { AjouterBusSkeletonComponent } from '../../../components/Bus/ajouter-bus-skeleton/ajouter-bus-skeleton.component';
import { ListerBusComponent } from '../../../components/Bus/lister-bus/lister-bus.component';
import { ListerBusSkeletonComponent } from '../../../components/Bus/lister-bus-skeleton/lister-bus-skeleton.component';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BusPageRoutingModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  declarations: [
    BusPage,
    AjouterBusComponent,
    AjouterBusSkeletonComponent,
    ListerBusComponent,
    ListerBusSkeletonComponent,
  ],
})
export class BusPageModule {}
