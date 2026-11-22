import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuestGuard } from 'src/app/core/guards/guest.guard.service';
import { AuthComponent } from './auth.component';

const routes: Routes = [
  { path: '', component: AuthComponent, canActivate: [GuestGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
