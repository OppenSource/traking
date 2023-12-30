import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DriverPageRoutingModule } from './driver-routing.module';

import { DriverPage } from './driver.page';
import { AjouterDriverSkeletonComponent } from '../../../components/Driver/ajouter-driver-skeleton/ajouter-driver-skeleton.component';
import { ListerDriverSkeletonComponent } from '../../../components/Driver/lister-driver-skeleton/lister-driver-skeleton.component';
import { AjouterDriverComponent } from '../../../components/Driver/ajouter-driver/ajouter-driver.component';
import { ListeDriverComponent } from '../../../components/Driver/liste-driver/liste-driver.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DriverPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [
    DriverPage,
    AjouterDriverComponent,
    AjouterDriverSkeletonComponent,
    ListeDriverComponent,
    ListerDriverSkeletonComponent,
  ],
})
export class DriverPageModule {}
