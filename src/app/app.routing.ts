import { Routes } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { ClientsComponent } from './clients/clients.component';
import { ChecksComponent } from './checks/checks.component';

export const AppRoutes: Routes = [
{
  path: '',
  redirectTo: 'dashboard',
  pathMatch: 'full',
}, 
{
  path: '',
  component: AdminLayoutComponent,
  children: [
    {
      path: '',
      loadChildren: './dashboard/dashboard.module#DashboardModule'
    },
    {
      path: 'clients',
      component: ClientsComponent
    },
    {
      path: 'checks',
      component: ChecksComponent
    }  
  ]
}, 
{
  path: 'auth',
  component: AuthLayoutComponent,
  children: [{
    path: '',
    loadChildren: './auth/auth.module#AuthModule'
  }]
}
];
