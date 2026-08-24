import { CodesModule } from './components/codes/codes.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlPanelRoutes } from './controlPanel.routing';
import { ControlPanelComponent } from './components/controlPanel/controlPanel.component';
import { CodesRoutes } from './components/codes/codes.routing';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { UsersRolesComponent } from './components/users-roles/users-roles.component';
import { UsersRolesPermissionsComponent } from './components/users-roles-permissions/users-roles-permissions.component';
import { DiseaseRulesComponent } from './components/disease-rules/disease-rules.component';
import { AuditTrialComponent } from './components/audit-trial/audit-trial.component';
import { DiseaseSpecialSymptomsComponent } from './components/disease-special-symptoms/disease-special-symptoms.component';
import { DynamicFormsComponent } from './components/dynamic-forms/dynamic-forms.component';
import { UserManualComponent } from './components/user-manual/user-manual.component';
import { SelectedLocationQuestionsComponent } from './components/selected-location-questions/selected-location-questions.component';
import { ChangeColorsComponent } from './components/change-colors/change-colors.component';
import { EvaluationQuestionsComponent } from './components/evaluation-questions/evaluation-questions.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { DynamicFormDesignComponent } from './components/dynamic-form-design/dynamic-form-design.component';
import { BuildControlComponent } from './components/build-control/build-control.component';
import { FormContainerComponent } from './components/form-container/form-container.component';
import { ContainerFieldComponent } from './components/container-field/container-field.component';
import { ViewFormsComponent } from './view-forms/view-forms.component';
import { UsersRolesIndexComponent } from './components/users-roles-permissions/users-roles-index/users-roles-index.component';
import { ConnectedUsersComponent } from './components/connected-users/connected-users.component';
import { TimesDifferenceComponent } from './components/times-difference/times-difference.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FullDataPercentageComponent } from './components/full-data-percentage/full-data-percentage.component';
import { NgxPrintModule } from 'ngx-print';
import { ExportAsModule } from 'ngx-export-as';
import { ZeroNotificationComponent } from './components/zero-notification/zero-notification.component';
import { ReportedCasesComponent } from './components/reported-cases/reported-cases.component';
import { UncompletedInvestigationsComponent } from './components/uncompleted-investigations/uncompleted-investigations.component';
import { ExamineCasesComponent } from './components/examine-cases/examine-cases.component';
import { NonInferenceCasesComponent } from './components/non-inference-cases/non-inference-cases.component';
import { SystemSettingsComponent } from './components/controlPanel/system-settings/system-settings.component';
import { VisitNewReviewComponent } from './components/visit-new-review/visit-new-review.component';
import { SidebarModule } from 'primeng/sidebar';
import { InputTextModule } from 'primeng/inputtext';
import { AddUpdateContainerFieldComponent } from './components/add-update-container-field/add-update-container-field.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { PeriodOfCardsComponent } from './components/period-of-cards/period-of-cards.component';
import { DiseaseClinicalSymptomsMappingComponent } from './components/controlPanel/disease-clinical-symptoms-mapping/disease-clinical-symptoms-mapping.component';
import { DataFetchDaysComponent } from './components/controlPanel/data-fetch-days/data-fetch-days.component';
import { ChartsTabVisibilityComponent } from './components/controlPanel/charts-tab-visibility/charts-tab-visibility.component';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    ControlPanelComponent,
    UsersRolesComponent,
    UsersRolesPermissionsComponent,
    DiseaseRulesComponent,
    AuditTrialComponent,
    DiseaseSpecialSymptomsComponent,
    DynamicFormsComponent,
    UserManualComponent,
    SelectedLocationQuestionsComponent,
    ChangeColorsComponent,
    EvaluationQuestionsComponent,
    DynamicFormDesignComponent,
    BuildControlComponent,
    FormContainerComponent,
    ContainerFieldComponent,
    ViewFormsComponent,
    UsersRolesIndexComponent,
    ConnectedUsersComponent,
    TimesDifferenceComponent,
    FullDataPercentageComponent,
    ZeroNotificationComponent,
    ReportedCasesComponent,
    UncompletedInvestigationsComponent,
    ExamineCasesComponent,
    NonInferenceCasesComponent,
    SystemSettingsComponent,
    VisitNewReviewComponent,
    AddUpdateContainerFieldComponent,
    PeriodOfCardsComponent,
    DiseaseClinicalSymptomsMappingComponent,
    DataFetchDaysComponent,
    ChartsTabVisibilityComponent,
  ],
  imports: [
    CommonModule,
    ControlPanelRoutes,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    NgxPrintModule,
    ExportAsModule,
    PaginatorModule,
    TooltipModule,
    ConfirmDialogModule,
    DialogModule,
    ButtonModule,
    SharedModule,
    ConfirmDialogModule,
    DialogModule,
    ButtonModule,
    NgxPrintModule,
    ConfirmPopupModule,
    TableModule,
    PaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    TooltipModule,
    SidebarModule,
    InputTextModule,
    MultiSelectModule,
    NgMultiSelectDropDownModule.forRoot(),
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
  ],
})
export class ControlPanelModule {}
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
