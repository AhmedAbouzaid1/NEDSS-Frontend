import { RouterModule } from '@angular/router';
import { ExportAsModule } from 'ngx-export-as';
import {NgxPrintModule} from 'ngx-print';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTreeModule } from '@angular/material/tree';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { TableModule } from 'primeng/table';
import { TabMenuModule } from 'primeng/tabmenu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from 'src/app/core/shared/material-module';
import { PreparationsTeamComponent } from './component/add-preparations/preparations-team/preparations-team.component';
import { AddPreparationsComponent } from './component/add-preparations/add-preparations.component';
import { PreparationsDataComponent } from './component/add-preparations/preparations-data/preparations-data.component';
import { PreparationsDevicesComponent } from './component/add-preparations/preparations-devices/preparations-devices.component';
import { PreparationsRoutes } from './preparations.routing';
import { ListPreparationsComponent } from './component/list-preparations/list-preparations.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { HttpLoaderFactory } from '../home.module';
import { PaginatorModule } from 'primeng/paginator';
import { TabViewModule } from 'primeng/tabview';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MultiSelectModule } from 'primeng/multiselect';
@NgModule({
  declarations: [
    PreparationsDataComponent,
    PreparationsTeamComponent,
    PreparationsDevicesComponent,
    AddPreparationsComponent,
    ListPreparationsComponent
  ],
  imports: [
    NgMultiSelectDropDownModule,
    PreparationsRoutes,
    CommonModule,
    NgSelectModule,
    FormsModule,
    ExportAsModule,
    NgxPrintModule,
    RouterModule,
    MaterialModule,
    MatTreeModule,
    ReactiveFormsModule,
    TableModule,
    TabMenuModule,
    SharedModule,
    CalendarModule,
    PaginatorModule,
    TabViewModule,
    InputTextModule,
    InputTextareaModule,
    MultiSelectModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
      defaultLanguage: localStorage.getItem("ls.currentLang")!==undefined && localStorage.getItem("ls.currentLang")!=="undefined"?localStorage.getItem("ls.currentLang"):"ar",
    }),
  ]
})
export class PreparationsModule { }
