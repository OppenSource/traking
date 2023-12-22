import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OptPage } from './opt.page';

const routes: Routes = [
  {
    path: '',
    component: OptPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OptPageRoutingModule {}
