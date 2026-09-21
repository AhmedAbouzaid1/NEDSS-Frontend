import { FinalResultComponent } from './final-result/final-result.component';
import { UserGroupComponent } from './user-group/user-group.component';
import { UnitResponsibilityLevelComponent } from './unit-responsibility-level/unit-responsibility-level.component';
import { PrincipalityComponent } from './principality/principality.component';
import { PatientJobCategoryComponent } from './patient-job-category/patient-job-category.component';
import { PatientJobComponent } from './patient-job/patient-job.component';
import { NationalityComponent } from './nationality/nationality.component';
import { LabPlacesComponent } from './lab-places/lab-places.component';
import { IncidentSourceComponent } from './incident-source/incident-source.component';
import { HealthOfficeComponent } from './health-office/health-office.component';
import { HealthAdministrationComponent } from './health-administration/health-administration.component';
import { DiseasesComponent } from './diseases/diseases.component';
import { DiseaseSeverityComponent } from './disease-severity/disease-severity.component';
import { DiseaseLabChecksResultComponent } from './disease-lab-checks-result/disease-lab-checks-result.component';
import { DiseaseLabChecksComponent } from './disease-lab-checks/disease-lab-checks.component';
import { DiseaseGroupComponent } from './disease-group/disease-group.component';
import { DiseaseChecksComponent } from './disease-checks/disease-checks.component';
import { DiseaseCategoryComponent } from './disease-category/disease-category.component';
import { DeviceTypeComponent } from './device-type/device-type.component';
import { DeviceCategoryComponent } from './device-category/device-category.component';
import { DepartmentComponent } from './department/department.component';
import { CityComponent } from './city/city.component';
import { CaseResultCategoryComponent } from './case-result-category/case-result-category.component';
import { CodesComponent } from './codes.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GovernmentComponent } from './government/government.component';
import { IncidentSourceTypeComponent } from './incident-source-type/incident-source-type.component';
import { PositionComponent } from './position/position.component';
import { NavigationGuard } from 'src/app/core/guards/navigation.guard.service';
import { OrganizationComponent } from './organization/organization.component';

import { DashBoardControlersComponent } from './dashBoard-Controlers/dashBoard-Controlers.component';
import { ClinicalSymptomsCodesComponent } from './clinical-symptoms/clinical-symptoms.component';

const routes: Routes = [
  { path: '', component: CodesComponent ,children:[
    { path: 'case-result-category', component: CaseResultCategoryComponent ,canActivate: [NavigationGuard]},
    { path: 'city', component: CityComponent,canActivate: [NavigationGuard] },
    { path: 'department', component: DepartmentComponent ,canActivate: [NavigationGuard]},
    { path: 'device-category', component: DeviceCategoryComponent ,canActivate: [NavigationGuard]},
    { path: 'device-type', component: DeviceTypeComponent ,canActivate: [NavigationGuard]},
    { path: 'disease-category', component: DiseaseCategoryComponent ,canActivate: [NavigationGuard]},
    { path: 'disease-checks', component: DiseaseChecksComponent ,canActivate: [NavigationGuard]},
    { path: 'disease-group', component: DiseaseGroupComponent ,canActivate: [NavigationGuard]},
    { path: 'disease-lab-checks', component: DiseaseLabChecksComponent ,canActivate: [NavigationGuard]},
    { path: 'disease-lab-checks-result', component: DiseaseLabChecksResultComponent ,canActivate: [NavigationGuard]},
    { path: 'disease-severity', component: DiseaseSeverityComponent ,canActivate: [NavigationGuard]},
    { path: 'diseases', component: DiseasesComponent ,canActivate: [NavigationGuard]},
    { path: 'final-result', component: FinalResultComponent ,canActivate: [NavigationGuard]},
    { path: 'government', component: GovernmentComponent ,canActivate: [NavigationGuard]},
    { path: 'organization', component: OrganizationComponent ,canActivate: [NavigationGuard]},
    { path: 'dashBoardControlers', component: DashBoardControlersComponent ,canActivate: [NavigationGuard]},
    { path: 'health-administration', component: HealthAdministrationComponent ,canActivate: [NavigationGuard]},
    { path: 'health-office', component: HealthOfficeComponent ,canActivate: [NavigationGuard]},
    { path: 'incident-source', component: IncidentSourceComponent ,canActivate: [NavigationGuard]},
    { path: 'lab-places', component: LabPlacesComponent ,canActivate: [NavigationGuard]},
    { path: 'nationality', component: NationalityComponent ,canActivate: [NavigationGuard]},
    { path: 'patient-job', component: PatientJobComponent },
    { path: 'patient-job-category', component: PatientJobCategoryComponent ,canActivate: [NavigationGuard]},
    { path: 'principality', component: PrincipalityComponent ,canActivate: [NavigationGuard]},
    { path: 'unit-responsibility-level', component: UnitResponsibilityLevelComponent ,canActivate: [NavigationGuard]},
    { path: 'user-group', component: UserGroupComponent ,canActivate: [NavigationGuard]},
    { path: 'position', component: PositionComponent },
    { path: 'incident-source-type', component: IncidentSourceTypeComponent ,canActivate: [NavigationGuard]},
    { path: 'clinical-symptoms', component: ClinicalSymptomsCodesComponent ,canActivate: [NavigationGuard]},
  ]},

  // {path:"edit/:id" , component:Edit_governmentComponent }

];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CodesRoutes { }

