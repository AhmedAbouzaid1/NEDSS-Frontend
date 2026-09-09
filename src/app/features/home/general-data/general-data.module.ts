import { DiagonisticsComponent } from './diagonistics/diagonistics.component';
import { SideMenuComponent } from './side-menu/side-menu.component';

import { ClinicalSymptomsComponent } from './clinical-symptoms/clinical-symptoms.component';
import { IncidentInfoComponent } from './incident-info/incident-info.component';
import { GeneralDataComponent } from './general-data/general-data.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralDataRoutes } from './general-data.routing';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { ResidenceInfoComponent } from './residence-info/residence-info.component';
import { SpecialSymptomsComponent } from './special-symptoms/special-symptoms.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { NgSelectModule } from '@ng-select/ng-select';
import { DiseaseFieldListResolver } from './Resolvers/disease-Field-list.resolver';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { DemographicDataComponent } from './demographic-data/demographic-data.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';

import { StringConverterPipe } from 'src/app/core/Pipes/string-converter.pipe';
import { SentinelComponent } from './sentinel/sentinel.component';
import { NotInferringModalComponent } from './not-inferring-modal/not-inferring-modal.component';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DropdownModule } from 'primeng/dropdown';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DialogModule } from 'primeng/dialog';

@NgModule({
  declarations: [
    GeneralDataComponent,
    IncidentInfoComponent,
    ClinicalSymptomsComponent,
    DemographicDataComponent,
    SideMenuComponent,
    ResidenceInfoComponent,
    SpecialSymptomsComponent,
    StringConverterPipe,
    DiagonisticsComponent,
    SentinelComponent,
    NotInferringModalComponent,
  ],
  imports: [
    CommonModule,
    NgSelectModule,
    GeneralDataRoutes,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    SharedModule,
    CalendarModule,
    InputTextModule,
    InputTextareaModule,
    NgMultiSelectDropDownModule.forRoot(),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => {
          return new TranslateHttpLoader(http, './assets/i18n/', '.json');
        },
        deps: [HttpClient],
      },
    }),
    MatNativeDateModule,
    DropdownModule,
    NgbNavModule,
    DialogModule,
  ],
  providers: [
    DiseaseFieldListResolver,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
  ],
  exports: [TranslateModule],
})
export class GeneralDataModule {}
