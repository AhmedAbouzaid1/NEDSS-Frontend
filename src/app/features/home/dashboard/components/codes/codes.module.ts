import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodesRoutes } from './codes.routing';
import { GovernmentComponent } from './government/government.component';
import { CodesComponent } from './codes.component';
import { LinksComponent } from './share/links/links.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HealthAdministrationComponent } from './health-administration/health-administration.component';
import { IncidentSourceComponent } from './incident-source/incident-source.component';
import { DiseasesComponent } from './diseases/diseases.component';
import { DiseaseChecksComponent } from './disease-checks/disease-checks.component';
import { PatientJobCategoryComponent } from './patient-job-category/patient-job-category.component';
import { PatientJobComponent } from './patient-job/patient-job.component';
import { DeviceTypeComponent } from './device-type/device-type.component';
import { DeviceCategoryComponent } from './device-category/device-category.component';
import { DiseaseCategoryComponent } from './disease-category/disease-category.component';
import { DiseaseGroupComponent } from './disease-group/disease-group.component';
import { DiseaseLabChecksComponent } from './disease-lab-checks/disease-lab-checks.component';
import { DiseaseLabChecksResultComponent } from './disease-lab-checks-result/disease-lab-checks-result.component';
import { LabPlacesComponent } from './lab-places/lab-places.component';
import { UnitResponsibilityLevelComponent } from './unit-responsibility-level/unit-responsibility-level.component';
import { UserGroupComponent } from './user-group/user-group.component';
import { DepartmentComponent } from './department/department.component';
import { NationalityComponent } from './nationality/nationality.component';
import { CityComponent } from './city/city.component';
import { HealthOfficeComponent } from './health-office/health-office.component';
import { PrincipalityComponent } from './principality/principality.component';
import { FinalResultComponent } from './final-result/final-result.component';
import { CaseResultCategoryComponent } from './case-result-category/case-result-category.component';
import { DiseaseSeverityComponent } from './disease-severity/disease-severity.component';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { SharedModule } from '../../../../../core/shared/shared.module';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { IncidentSourceTypeComponent } from './incident-source-type/incident-source-type.component';
import { PositionComponent } from './position/position.component';
import { OrganizationComponent } from './organization/organization.component';
import { DependencyComponent } from './dependency/dependency.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { DashBoardControlersComponent } from './dashBoard-Controlers/dashBoard-Controlers.component';
import { InputTextModule } from 'primeng/inputtext';

@NgModule({
  declarations: [
    CodesComponent,
    GovernmentComponent,
    LinksComponent,
    HealthAdministrationComponent,
    IncidentSourceComponent,
    DiseasesComponent,
    DiseaseChecksComponent,
    PatientJobCategoryComponent,
    PatientJobComponent,
    DeviceTypeComponent,
    DeviceCategoryComponent,
    DependencyComponent,
    OrganizationComponent,
    DiseaseCategoryComponent,
    DiseaseGroupComponent,
    DiseaseLabChecksComponent,
    DiseaseLabChecksResultComponent,
    LabPlacesComponent,
    UnitResponsibilityLevelComponent,
    UserGroupComponent,
    DepartmentComponent,
    NationalityComponent,
    CityComponent,
    HealthOfficeComponent,
    PrincipalityComponent,
    FinalResultComponent,
    CaseResultCategoryComponent,
    DiseaseSeverityComponent,
    IncidentSourceTypeComponent,
    PositionComponent,
    DashBoardControlersComponent
  ],
  imports: [
    CommonModule,
    InputTextModule,
    CodesRoutes,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    PaginatorModule,
    TooltipModule,
    ConfirmDialogModule,
    DialogModule,
    ButtonModule,
    SharedModule,
    ConfirmPopupModule,
    NgMultiSelectDropDownModule
  ],
})
export class CodesModule {}
