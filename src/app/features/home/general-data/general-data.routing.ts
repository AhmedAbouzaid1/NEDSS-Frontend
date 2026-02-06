import { SpecialSymptomsComponent } from './special-symptoms/special-symptoms.component';
import { ResidenceInfoComponent } from './residence-info/residence-info.component';
import { DiagonisticsComponent } from './diagonistics/diagonistics.component';
import { ClinicalSymptomsComponent } from './clinical-symptoms/clinical-symptoms.component';
import { DemographicDataComponent } from './demographic-data/demographic-data.component';
import { IncidentInfoComponent } from './incident-info/incident-info.component';
import { GeneralDataComponent } from './general-data/general-data.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DiseaseFieldListResolver } from './Resolvers/disease-Field-list.resolver';
import { DemographicListResolver } from './resolve/desease-from-list.resolver';
import { SentinelComponent } from './sentinel/sentinel.component';

const routes: Routes = [
  {
    path: '',
    component: GeneralDataComponent,
    children: [
      { path: '', component: GeneralDataComponent },
      // { path: 'incident-info', component: IncidentInfoComponent },
      // { path: 'demographic-info', component: DemographicDataComponent , resolve: { data: DemographicListResolver }},
      // { path: 'residence-info', component: ResidenceInfoComponent },
      // { path: 'clinical-symptoms', component: ClinicalSymptomsComponent },
      //  { path: 'special-symptoms', resolve: { data: DiseaseFieldListResolver }, component: SpecialSymptomsComponent },
      // { path: 'diagonistic-info', component: DiagonisticsComponent },
      // { path: 'sentinel', component: SentinelComponent }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GeneralDataRoutes {}
