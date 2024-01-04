import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('../pages/Dashboard/dashboard/dashboard.module').then(
            (m) => m.DashboardPageModule
          ),
      },
      // Add other child routes if needed
      // Example:
      // {
      //   path: 'other-page',
      //   loadChildren: () =>
      //     import('../pages/OtherPage/other-page.module').then(
      //       (m) => m.OtherPageModule
      //     ),
      // },
    ],
  },
  {
    path: '',
    redirectTo: '/home/dashboard',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
