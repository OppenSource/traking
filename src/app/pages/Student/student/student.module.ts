import { AjouterStudentSkeletonComponent } from './../../../components/Student/ajouter-student-skeleton/ajouter-student-skeleton.component';
import { AjouterStudentComponent } from './../../../components/Student/ajouter-student/ajouter-student.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { StudentPageRoutingModule } from './student-routing.module';
import { StudentPage } from './student.page';
import { QRCodeModule } from 'angularx-qrcode';
import { ListeStutentSkeletonComponent } from './../../../components/Student/liste-stutent-skeleton/liste-stutent-skeleton.component';
import { ListerStudentComponent } from './../../../components/Student/lister-student/lister-student.component';
import { ProlongeStudentAccessibiliteBusComponent } from './../../../components/Student/prolonge-student-accessibilite-bus/prolonge-student-accessibilite-bus.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StudentPageRoutingModule,
    QRCodeModule,
    ReactiveFormsModule,
  ],
  declarations: [
    StudentPage,
    AjouterStudentComponent,
    AjouterStudentSkeletonComponent,
    ListerStudentComponent,
    ListeStutentSkeletonComponent,
    ProlongeStudentAccessibiliteBusComponent,
  ],
})
export class StudentPageModule {}
