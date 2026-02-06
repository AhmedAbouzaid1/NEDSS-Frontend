import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChangePasswordComponent } from './features/auth/change-password/change-password.component';
import { ForgetPasswordComponent } from './features/auth/forget-password/forget-password/forget-password.component';
import { NetworkFailureComponent } from './features/errors/network-failure/network-failure.component';

const routes: Routes = [
  {
    path: '',

    loadChildren: () =>
      import('./features/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./features/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: '',
    loadChildren: () =>
      import('./features/lab/lab.module').then((m) => m.LabModule),
  },
  { path: 'change-password', component: ChangePasswordComponent },
  { path: 'forget-password', component: ForgetPasswordComponent },
  { path: 'network-error', component: NetworkFailureComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
