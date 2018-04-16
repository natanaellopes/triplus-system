import { Routes } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { ClientsComponent } from './clients/clients.component';
import { ChecksComponent } from './checks/checks.component';
import { DealComponent } from './deal/deal.component';
import { UserComponent } from './users/users.component';
import { TriplusClientsComponent } from './triplus-clients/triplus-clients.component';
import { HouseCleaningClientsComponent } from './housecleaning-clients/housecleaning-clients.component';

export const AppRoutes: Routes = [
{
  path: '',
  redirectTo: 'auth',
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
      path: 'triplus-client',
      component: TriplusClientsComponent
    },
    {
      path: 'clients',
      component: ClientsComponent
    },
    {
      path: 'checks',
      component: ChecksComponent
    },
    {
      path: 'deal',
      component: DealComponent
    },
    {
      path: 'users',
      component: UserComponent
    },
    {
      path: 'housecleaning/client',
      component: HouseCleaningClientsComponent
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
