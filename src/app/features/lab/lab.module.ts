import { SideBarComponent } from './components/side-bar/side-bar.component';
import { NgModule } from '@angular/core';
import {
  CommonModule,
  DatePipe,
  HashLocationStrategy,
  LocationStrategy,
} from '@angular/common';
import { LabViewComponent } from './components/lab-view/lab-view.component';
import { AddLabPatientComponent } from './components/add-lab-patient/add-lab-patient.component';
import { AddLabTestComponent } from './components/add-lab-test/add-lab-test.component';
import { MeningitisChecksFormComponent } from './components/add-lab-test/meningitis-checks-form/meningitis-checks-form.component';
import { PatientChecksComponent } from './components/patient-checks/patient-checks.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from 'primeng/api';
import { SharedModule as CoreSharedModule } from 'src/app/core/shared/shared.module';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { LabRoutes } from './lab.routing';
import { HomeModule, HttpLoaderFactory } from '../home/home.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { CalendarModule } from 'primeng/calendar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';

export const DATE_FORMATS = {
  parse: {
    dateInput: 'YYYY-MM-DD',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@NgModule({
  declarations: [
    LabViewComponent,
    AddLabPatientComponent,
    AddLabTestComponent,
    MeningitisChecksFormComponent,
    PatientChecksComponent,
    SideBarComponent,
  ],
  imports: [
    NgSelectModule,
    CommonModule,
    LabRoutes,
    SharedModule,
    CoreSharedModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    TableModule,
    FormsModule,
    ReactiveFormsModule,
    PaginatorModule,
    HomeModule,
    CalendarModule,
    InputTextModule,
    DialogModule,
    NgMultiSelectDropDownModule.forRoot(),
    MultiSelectModule,
    // ngx-translate and the loader module
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
      defaultLanguage:
        localStorage.getItem('ls.currentLang') !== undefined &&
          localStorage.getItem('ls.currentLang') !== 'undefined'
          ? localStorage.getItem('ls.currentLang')
          : 'ar',
    }),
    InputTextareaModule
  ],
  providers: [DatePipe, { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  exports: [TranslateModule],
})
export class LabModule { }

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
