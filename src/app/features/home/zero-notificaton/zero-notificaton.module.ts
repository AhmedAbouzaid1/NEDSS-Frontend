import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ExportAsModule } from 'ngx-export-as';
import { NgxPrintModule } from 'ngx-print';
import { ZeroNotificatonRoutingModule } from './zero-notificaton-routing.module';
import { ZeroNotificatonComponent } from './zero-notificaton/zero-notificaton.component';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { ZeroReportComponent } from './zero-report/zero-report.component';
import { ImmediateNotificationComponent } from './immediate-notification/immediate-notification.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { TranslateModule } from '@ngx-translate/core';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { MaterialModule } from 'src/app/core/shared/material-module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';

@NgModule({
  providers: [DatePipe],
  declarations: [
    ZeroNotificatonComponent,
    SideMenuComponent,
    ZeroReportComponent,
    ImmediateNotificationComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    ExportAsModule,
    NgxPrintModule,
    SharedModule,
    NgSelectModule,
    FormsModule,
    CalendarModule,
    MaterialModule,
    PaginatorModule,
    TableModule,
    ZeroNotificatonRoutingModule,
    NgMultiSelectDropDownModule,
    InputTextModule,
    MultiSelectModule,
  ],
})
export class ZeroNotificatonModule {}
