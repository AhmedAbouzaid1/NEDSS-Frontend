import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ZeroNotificatonComponent } from './zero-notificaton/zero-notificaton.component';
import { ImmediateNotificationComponent } from './immediate-notification/immediate-notification.component';
import { ZeroReportComponent } from './zero-report/zero-report.component';

const routes: Routes = [
  {
    path: '',
    component: ZeroNotificatonComponent,
    children: [
      {
        path: 'immediate-notification',
        component: ImmediateNotificationComponent,
      },
      { path: 'zero-report', component: ZeroReportComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ZeroNotificatonRoutingModule {}
