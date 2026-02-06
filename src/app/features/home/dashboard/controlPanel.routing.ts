import { EvaluationQuestionsComponent } from './components/evaluation-questions/evaluation-questions.component';
import { ChangeColorsComponent } from './components/change-colors/change-colors.component';
import { SelectedLocationQuestionsComponent } from './components/selected-location-questions/selected-location-questions.component';
import { UserManualComponent } from './components/user-manual/user-manual.component';
import { DynamicFormsComponent } from './components/dynamic-forms/dynamic-forms.component';
import { DiseaseSpecialSymptomsComponent } from './components/disease-special-symptoms/disease-special-symptoms.component';
import { AuditTrialComponent } from './components/audit-trial/audit-trial.component';
import { DiseaseRulesComponent } from './components/disease-rules/disease-rules.component';
import { UsersRolesPermissionsComponent } from './components/users-roles-permissions/users-roles-permissions.component';
import { NgModule } from '@angular/core';
import { UsersComponent } from '../users/users.component';
import { Routes, RouterModule } from '@angular/router';
import { ControlPanelComponent } from './components/controlPanel/controlPanel.component';
import { DynamicFormDesignComponent } from './components/dynamic-form-design/dynamic-form-design.component';
import { DiseaseFormListResolver } from './components/dynamic-form-design/resolve/desease-from-list.resolver';
import { FormContainerComponent } from './components/form-container/form-container.component';
import { ContainerFieldComponent } from './components/container-field/container-field.component';
import { ViewFormsComponent } from './view-forms/view-forms.component';
import { UsersRolesIndexComponent } from './components/users-roles-permissions/users-roles-index/users-roles-index.component';
import { NavigationGuard } from 'src/app/core/guards/navigation.guard.service';
import { ConnectedUsersComponent } from './components/connected-users/connected-users.component';
import { TimesDifferenceComponent } from './components/times-difference/times-difference.component';
import { FullDataPercentageComponent } from './components/full-data-percentage/full-data-percentage.component';
import { ZeroNotificationComponent } from './components/zero-notification/zero-notification.component';
import { ReportedCasesComponent } from './components/reported-cases/reported-cases.component';
import { ExamineCasesComponent } from './components/examine-cases/examine-cases.component';
import { NonInferenceCasesComponent } from './components/non-inference-cases/non-inference-cases.component';
import { UncompletedInvestigationsComponent } from './components/uncompleted-investigations/uncompleted-investigations.component';
import { SystemSettingsComponent } from './components/controlPanel/system-settings/system-settings.component';
import { VisitNewReviewComponent } from './components/visit-new-review/visit-new-review.component';
import { AddUpdateContainerFieldComponent } from './components/add-update-container-field/add-update-container-field.component';
import { PeriodOfCardsComponent } from './components/period-of-cards/period-of-cards.component';

const routes: Routes = [
  { path: '', component: ControlPanelComponent },
  {
    path: 'codes',
    loadChildren: () =>
      import('./components/codes/codes.module').then((m) => m.CodesModule),
  },
  {
    path: 'permissions',
    component: UsersRolesIndexComponent,
    canActivate: [NavigationGuard],
  },
  {
    path: 'add-roles',
    component: UsersRolesPermissionsComponent,
    canActivate: [NavigationGuard],
  },
  {
    path: 'add-roles/:id',
    component: UsersRolesPermissionsComponent,
    canActivate: [NavigationGuard],
  },
  {
    path: 'disease-rules',
    component: DiseaseRulesComponent,
    canActivate: [NavigationGuard],
  },
  {
    path: 'audit-trial',
    component: AuditTrialComponent,
    canActivate: [NavigationGuard],
  },
  {
    path: 'disease-symptoms',
    component: DiseaseSpecialSymptomsComponent,
    canActivate: [NavigationGuard],
  },
  {
    path: 'dynamic-forms',
    component: DynamicFormsComponent,
    canActivate: [NavigationGuard],
  },
  {
    path: 'user-manual',
    component: UserManualComponent,
    canActivate: [NavigationGuard],
  },
  {
    path: 'selected-locations-questions',
    component: SelectedLocationQuestionsComponent,
    canActivate: [NavigationGuard],
  },
  {
    path: 'change-colors',
    component: ChangeColorsComponent,
    canActivate: [NavigationGuard],
  },
  {
    path: 'evaluation-questions',
    component: EvaluationQuestionsComponent,
    canActivate: [NavigationGuard],
  },
  {
    path: 'reported-cases',
    component: ReportedCasesComponent,
    canActivate: [NavigationGuard],
  },
  {
    path: 'connected-users',
    component: ConnectedUsersComponent,
    canActivate: [NavigationGuard],
  },
  {
    path: 'system-settings',
    component: SystemSettingsComponent,
    canActivate: [NavigationGuard],
  },
  {
    path: 'full-data',
    component: FullDataPercentageComponent,
    canActivate: [NavigationGuard],
  },
  {
    path: 'zero-notification',
    component: ZeroNotificationComponent,
    canActivate: [NavigationGuard],
  },
  {
    path: 'times-difference',
    component: TimesDifferenceComponent,
    canActivate: [NavigationGuard],
  },
  {
    path: 'examine-cases',
    component: ExamineCasesComponent,
    canActivate: [NavigationGuard],
  },
  {
    path: 'non-inferring',
    component: NonInferenceCasesComponent,
    canActivate: [NavigationGuard],
  },
  {
    path: 'un-completed-inv',
    component: UncompletedInvestigationsComponent,
    canActivate: [NavigationGuard],
  },
  {
    path: 'dynamic-forms/design/:id',
    component: DynamicFormDesignComponent,
    canActivate: [NavigationGuard],
    resolve: { data: DiseaseFormListResolver },
  },
  {
    path: 'dynamic-forms/sections/:id',
    component: FormContainerComponent,
    canActivate: [NavigationGuard],
  },
  {
    path: 'dynamic-forms/controls/:id/:containerId',
    component: ContainerFieldComponent,
    canActivate: [NavigationGuard],
  },
  {
    path: 'qustion-form/:id/:containerId',
    component: AddUpdateContainerFieldComponent,
    canActivate: [NavigationGuard],
  },
  {
    path: 'qustion-form/:id/:containerId/:questionId',
    component: AddUpdateContainerFieldComponent,
    canActivate: [NavigationGuard],
  },
  {
    path: 'view-form/:id',
    component: ViewFormsComponent,
    canActivate: [NavigationGuard],
    resolve: { data: DiseaseFormListResolver },
  },
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [NavigationGuard],
    data: { types: [3] },
  },
  { path: 'Visit-new-review', component: VisitNewReviewComponent },
  { path: 'period-of-cards', component: PeriodOfCardsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ControlPanelRoutes {}
