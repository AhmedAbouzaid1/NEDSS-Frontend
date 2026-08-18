import { PrevalenceRateToDiseaseFinalComponent } from './reports/PrevalenceRateToDiseaseFinal/PrevalenceRateToDiseaseFinal.component';
import { NotInferringComponent } from './not-inferring/not-inferring.component';
import { PopulationDataComponent } from './population-data/population-data.component';
import { PreparationsComponent } from './preparations/preparations.component';
import { UsersComponent } from './users/users.component';
import { ReportsComponent } from './reports/reports.component';
import { UserHelpComponent } from './user-help/user-help.component';
import { SelectedLocationsComponent } from './selected-locations/selected-locations.component';
import { InvestigationComponent } from './investigation/investigation.component';
import { EventsComponent } from './events/events.component';
import { LabCasesComponent } from './lab-cases/lab-cases.component';
import { RepeatedRecordsComponent } from './repeated-records/repeated-records.component';

import { ChartsDashboardComponent } from './charts-dashboard/charts-dashboard.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { ChartsDisabledComponent } from './charts-disabled/charts-disabled.component';
import { ChartsTabGuard } from 'src/app/core/guards/charts-tab.guard.service';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { GeneralDataCompletionComponent } from './general-data-completion/general-data-completion.component';
import { PopulationIncreaseCoefficientComponent } from './population-data/population-increase-coefficient/population-increase-coefficient.component';
import { SearchPopulationExpectationComponent } from './population-data/search-populationExpectation/search-populationExpectation.component';
import { DuplicationViewComponent } from './repeated-records/duplicationView/duplicationView.component';
import { DuplicationReviewComponent } from './repeated-records/duplicationReview/duplicationReview.component';
import { ChatComponent } from './chat/chat.component';
import { AddUserComponent } from './users/components/add-user/add-user.component';
import { AnnouncementsComponent } from './announcements/announcements.component';
import { AddPopulationDataComponent } from './population-data/add-population-data/add-population-data.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard.service';
import { NavigationGuard } from 'src/app/core/guards/navigation.guard.service';
import { InvestigationPatientGuard } from 'src/app/core/guards/investigation-patient.guard.service';
import { SearchComponent } from './search/search.component';
import { InvestigationDetailesComponent } from './investigation/investigation-detailes/investigation-detailes.component';
import { CompleteInvestigationComponent } from './investigation/complete-investigation/complete-investigation.component';
import { H5n1Component } from './investigation/complete-investigation/h5n1/h5n1.component';
import { EpidemiologicalThresholdsComponent } from './epidemiological-thresholds/epidemiological-thresholds.component';
import { MonkeypoxComponent } from './investigation/complete-investigation/monkeypox/monkeypox.component';
import { RabiesComponent } from './investigation/complete-investigation/rabies/rabies.component';
import { PlagueComponent } from './investigation/complete-investigation/plague/plague.component';
import { FeverRashComponent } from './investigation/complete-investigation/fever-rash/fever-rash.component';
import { RiftValleyComponent } from './investigation/complete-investigation/rift-valley/rift-valley.component';
import { TetanusComponent } from './investigation/complete-investigation/tetanus/tetanus.component';
import { WhoopingCoughComponent } from './investigation/complete-investigation/whooping-cough/whooping-cough.component';
import { DiphtheriaComponent } from './investigation/complete-investigation/diphtheria/diphtheria.component';
import { HemorrhagicFeversComponent } from './investigation/complete-investigation/hemorrhagic-fevers/hemorrhagic-fevers.component';
import { MalariaComponent } from './investigation/complete-investigation/malaria/malaria.component';
import { SchistosomiasisComponent } from './investigation/complete-investigation/schistosomiasis/schistosomiasis.component';
import { FasciolaComponent } from './investigation/complete-investigation/fasciola/fasciola.component';

import { BrucellaComponent } from './investigation/complete-investigation/brucella/brucella.component';
import { MeningealComponent } from './investigation/complete-investigation/meningeal/meningeal.component';
import { AddLabPatientComponent } from '../lab/components/add-lab-patient/add-lab-patient.component';
import { AddLabTestComponent } from '../lab/components/add-lab-test/add-lab-test.component';
import { PatientChecksComponent } from '../lab/components/patient-checks/patient-checks.component';

import { IncidentSourceToDepartmentReportComponent } from './reports/incident-source-to-department-report/incident-source-to-department-report.component';
import { IncidentDepartmentReportComponent } from './reports/incident-department-report/incident-department-report.component';
import { IncedanceReportComponent } from './reports/incedance-report/incedance-report.component';
import { AriComponent } from './investigation/complete-investigation/ari/ari.component';
import { BloodyDiarrheaComponent } from './investigation/complete-investigation/bloody-diarrhea/bloody-diarrhea.component';
import { CholeraComponent } from './investigation/complete-investigation/cholera/cholera.component';
import { DiarrheaComponent } from './investigation/complete-investigation/diarrhea/diarrhea.component';
import { FalseChickenpoxComponent } from './investigation/complete-investigation/false-chickenpox/false-chickenpox.component';
import { FilariasisComponent } from './investigation/complete-investigation/filariasis/filariasis.component';
import { TrachomaComponent } from './investigation/complete-investigation/trachoma/trachoma.component';
import { HepatitisVirusesComponent } from './investigation/complete-investigation/hepatitis-viruses/hepatitis-viruses.component';
import { HivComponent } from './investigation/complete-investigation/hiv/hiv.component';
import { LeishmaniaComponent } from './investigation/complete-investigation/leishmania/leishmania.component';
import { LeperComponent } from './investigation/complete-investigation/leper/leper.component';
import { MersComponent } from './investigation/complete-investigation/mers/mers.component';
import { MumbariPoisoningComponent } from './investigation/complete-investigation/mumbari-poisoning/mumbari-poisoning.component';
import { MumpsComponent } from './investigation/complete-investigation/mumps/mumps.component';
import { SevereFoodPoisoningComponent } from './investigation/complete-investigation/severe-food-poisoning/severe-food-poisoning.component';
import { TuberculosisComponent } from './investigation/complete-investigation/tuberculosis/tuberculosis.component';
import { TyphoidComponent } from './investigation/complete-investigation/typhoid/typhoid.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { ViewUserComponent } from './users/view-user/view-user.component';
import { AcuteFlaccidParalysisComponent } from './investigation/complete-investigation/acute-flaccid-paralysis/acute-flaccid-paralysis.component';
import { CaseResultCategoryComponent } from './reports/caseResultCategory/caseResultCategory.component';
import { FinalResultToDiseasesComponent } from './reports/finalResultToDiseases/finalResultToDiseases.component';
import { IncedentSourceToCaseComponent } from './reports/incedentSourceToCase/incedentSourceToCase.component';
import { FinalResultToIncedentComponent } from './reports/finalResultToIncedent/finalResultToIncedent.component';
import { AgeCategoriesReportComponent } from './reports/ageCategoriesReport/ageCategoriesReport.component';
import { WithGenderReportComponent } from './reports/withGenderReport/withGenderReport.component';
import { HealthAdministrationReportComponent } from './reports/HealthAdministrationReport/health-administration-report.component';
import { WithJobTitleReportComponent } from './reports/withJobTitleReport/withJobTitleReport.component';
import { DiseaseByWeekReportComponent } from './reports/diseaseByWeekReport/diseaseByWeekReport.component';
import { DiseaseByMonthReportComponent } from './reports/diseaseByMonthReport/diseaseByMonthReport.component';
import { PrevalenceRateToHealthAdministrationComponent } from './reports/PrevalenceRateToHealthAdministration/PrevalenceRateToHealthAdministration.component';
import { PrevalenceRateToDiseaseReportComponent } from './reports/PrevalenceRateToDiseaseReport/PrevalenceRateToDiseaseReport.component';
import { PrevalenceRateToDeathReportComponent } from './reports/PrevalenceRateToDeathReport/PrevalenceRateToDeathReport.component';
import { UsersReportComponent } from './reports/usersReport/usersReport.component';
import { UserMonitoringReportComponent } from './reports/user-monitoring-report/user-monitoring-report.component';
import { DynamicChartComponent } from './dynamic-chart/dynamic-chart.component';
import { DataMonitoringReportComponent } from './reports/data-monitoring-report/data-monitoring-report.component';
import { UploadExcelfileComponent } from './population-data/upload-excelfile/upload-excelfile.component';
import { ProfileComponent } from './profile/profile.component';
import { RedirectComponent } from 'src/app/core/shared/components/redirect/redirect.component';
import { DiseaseBasedOnGenderComponent } from './reports/disease-based-on-gender/disease-based-on-gender.component';
import { DiseaseBasedOnResultComponent } from './reports/disease-based-on-result/disease-based-on-result.component';
import { DiseaseBasedOnDiagnosisComponent } from './reports/disease-based-on-diagnosis/disease-based-on-diagnosis.component';
import { DiseaseBasedOnAgeComponent } from './reports/disease-based-on-age/disease-based-on-age.component';
import { DiseaseBasedOnPatientComponent } from './reports/disease-based-on-patient/disease-based-on-patient.component';
import { MergeRepeatedRecordsComponent } from './repeated-records/merge-repeated-records/merge-repeated-records.component';
import { UserReportComponent } from './reports/user-report/user-report.component';
import { DiseasesRulesReportComponent } from './reports/diseases-rules-report/diseases-rules-report.component';
import { ZeroReportingReportComponent } from './reports/zero-reporting-report/zero-reporting-report.component';
import { ImmediateReportingReportComponent } from './reports/immediate-reporting-report/immediate-reporting-report.component';
import { RolesReportComponent } from './reports/roles-report/roles-report.component';
import { NotInferringReportComponent } from './reports/not-inferring-report/not-inferring-report.component';
import { PopulationsReportComponent } from './reports/populations-report/populations-report.component';
import { MonitorUnitsPeparationsReportComponent } from './reports/monitor-units-peparations-report/monitor-units-peparations-report.component';
import { EpidemiologicalThresholdsReportComponent } from './reports/epidemiological-thresholds-report/epidemiological-thresholds-report.component';
import { MonitorUnitsReportComponent } from './reports/monitor-units-report/monitor-units-report.component';
import { MonitorUnitsTeamMembersReportComponent } from './reports/monitor-units-team-members-report/monitor-units-team-members-report.component';
import { MonitorUnitsTeamMembersDetailsReportComponent } from './reports/monitor-units-team-members-details-report/monitor-units-team-members-details-report.component';
const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
    data: { types: [3] },
    children: [
      {
        path: 'add-patient',
        component: AddLabPatientComponent,
        canActivate: [AuthGuard, NavigationGuard],
        data: { types: [1, 2] },
      },
      {
        path: 'patient-checks',
        component: PatientChecksComponent,
        canActivate: [AuthGuard, NavigationGuard],
        data: { types: [1, 2] },
      },
      {
        path: 'add-checks/:id',
        component: AddLabTestComponent,
        canActivate: [AuthGuard, NavigationGuard],
        data: { types: [1, 2] },
      },

      {
        path: 'welcome',
        component: WelcomeComponent,
        canActivate: [AuthGuard],
        data: { types: [3] },
      },
      {
        path: 'chart',
        component: ChartsDashboardComponent,
        canActivate: [AuthGuard, NavigationGuard, ChartsTabGuard],
        data: { types: [3] },
      },
      {
        path: 'chart-disabled',
        component: ChartsDisabledComponent,
        canActivate: [AuthGuard],
        data: { types: [3] },
      },
      {
        path: 'general-data',
        loadChildren: () =>
          import('./general-data/general-data.module').then(
            (m) => m.GeneralDataModule
          ),
        canActivate: [AuthGuard, NavigationGuard],
        data: { types: [3] },
      },
      {
        path: 'search',
        component: SearchComponent,
        loadChildren: () =>
          import('./search/search.module').then((m) => m.SearchModule),
        canActivate: [AuthGuard, NavigationGuard],
        data: { types: [3] },
      },
      {
        path: 'repeated-records',
        component: RepeatedRecordsComponent,
        canActivate: [AuthGuard, NavigationGuard],
        data: { types: [3] },
      },
      {
        path: 'duplication-view',
        component: DuplicationViewComponent,
        canActivate: [AuthGuard, NavigationGuard],
        data: { types: [3] },
      },
      {
        path: 'duplication-view/:id',
        component: DuplicationViewComponent,
        canActivate: [AuthGuard],
        data: { types: [3] },
      },
      {
        path: 'duplication-review',
        component: DuplicationReviewComponent,
        canActivate: [AuthGuard],
        data: { types: [3] },
      },
      {
        path: 'merge-records',
        component: MergeRepeatedRecordsComponent,
        canActivate: [AuthGuard],
        data: { types: [3] },
      },
      {
        path: 'zero-notification',
        loadChildren: () =>
          import('./zero-notificaton/zero-notificaton.module').then(
            (m) => m.ZeroNotificatonModule
          ),
        canActivate: [AuthGuard],
        data: { types: [3] },
      },
      {
        path: 'lab-cases',
        component: LabCasesComponent,
        canActivate: [NavigationGuard],
        data: { types: [3] },
      },
      {
        path: 'events',
        component: EventsComponent,
        canActivate: [NavigationGuard],
        data: { types: [3] },
      },
      {
        path: 'Notifications',
        component: NotificationsComponent,
        canActivate: [NavigationGuard],
        data: { types: [3] },
      },
      {
        path: 'lab-cases',
        component: LabCasesComponent,
        canActivate: [NavigationGuard],
        data: { types: [3] },
      },
      {
        path: 'events',
        component: EventsComponent,
        canActivate: [NavigationGuard],
        data: { types: [3] },
      },
      {
        path: 'ari/:id/diseaseId/:diseaseId',
        component: AriComponent,
        canActivate: [NavigationGuard],
        data: { types: [3] },
      },
      {
        path: 'brucella/:id/diseaseId/:diseaseId',
        component: BrucellaComponent,
        canActivate: [AuthGuard, NavigationGuard],
        data: { types: [3] },
      },
      {
        path: 'meningeal/:id/diseaseId/:diseaseId',
        component: MeningealComponent,
        canActivate: [AuthGuard, NavigationGuard],
        data: { types: [3] },
      },
      {
        path: 'monkeypox/:id/diseaseId/:diseaseId',
        component: MonkeypoxComponent,
        canActivate: [AuthGuard, NavigationGuard],
        data: { types: [3] },
      },
      {
        path: 'rabies/:id/diseaseId/:diseaseId',
        component: RabiesComponent,
        canActivate: [AuthGuard, NavigationGuard],
        data: { types: [3] },
      },
      {
        path: 'plague/:id/diseaseId/:diseaseId',
        component: PlagueComponent,
        canActivate: [AuthGuard, NavigationGuard],
        data: { types: [3] },
      },
      {
        path: 'fever-rash/:id/diseaseId/:diseaseId',
        component: FeverRashComponent,
        canActivate: [AuthGuard, NavigationGuard],
        data: { types: [3] },
      },
      {
        path: 'rift-valley/:id/diseaseId/:diseaseId',
        component: RiftValleyComponent,
        canActivate: [AuthGuard, NavigationGuard],
        data: { types: [3] },
      },
      {
        path: 'tetanus/:id/diseaseId/:diseaseId',
        component: TetanusComponent,
        canActivate: [AuthGuard, NavigationGuard],
        data: { types: [3] },
      },
      {
        path: 'whooping-cough/:id/diseaseId/:diseaseId',
        component: WhoopingCoughComponent,
        canActivate: [AuthGuard, NavigationGuard],
        data: { types: [3] },
      },
      {
        path: 'diphtheria/:id/diseaseId/:diseaseId',
        component: DiphtheriaComponent,
        canActivate: [AuthGuard, NavigationGuard],
        data: { types: [3] },
      },
      {
        path: 'hemorrhagic-fevers/:id/diseaseId/:diseaseId',
        component: HemorrhagicFeversComponent,
        canActivate: [AuthGuard, NavigationGuard],
        data: { types: [3] },
      },
      {
        path: 'malaria/:id/diseaseId/:diseaseId',
        component: MalariaComponent,
        canActivate: [AuthGuard, NavigationGuard],
        data: { types: [3] },
      },
      {
        path: 'schistosomiasis/:id/diseaseId/:diseaseId',
        component: SchistosomiasisComponent,
        canActivate: [AuthGuard, NavigationGuard],
        data: { types: [3] },
      },
      {
        path: 'fasciola/:id/diseaseId/:diseaseId',
        component: FasciolaComponent,
        canActivate: [AuthGuard, NavigationGuard],
        data: { types: [3] },
      },
      {
        path: 'hepatitisViruses/:id/diseaseId/:diseaseId',
        component: HepatitisVirusesComponent,
        canActivate: [AuthGuard, NavigationGuard],
        data: { types: [3] },
      },
      {
        path: 'typhoid/:id/diseaseId/:diseaseId',
        component: TyphoidComponent,
        canActivate: [AuthGuard, NavigationGuard],
        data: { types: [3] },
      },
      {
        path: 'cholera/:id/diseaseId/:diseaseId',
        component: CholeraComponent,
        canActivate: [AuthGuard, NavigationGuard],
        data: { types: [3] },
      },
      {
        path: 'NfalseChickenpoxULL/:id/diseaseId/:diseaseId',
        component: FalseChickenpoxComponent,
        canActivate: [AuthGuard, NavigationGuard],
        data: { types: [3] },
      },
      {
        path: 'severeFoodPoisoning/:id/diseaseId/:diseaseId',
        component: SevereFoodPoisoningComponent,
        canActivate: [AuthGuard, NavigationGuard],
        data: { types: [3] },
      },
      {
        path: 'bloodyDiarrhea/:id/diseaseId/:diseaseId',
        component: BloodyDiarrheaComponent,
        canActivate: [AuthGuard, NavigationGuard],
        data: { types: [3] },
      },
      {
        path: 'filariasis/:id/diseaseId/:diseaseId',
        component: FilariasisComponent,
        canActivate: [AuthGuard, NavigationGuard],
        data: { types: [3] },
      },
      {
        path: 'trachoma/:id/diseaseId/:diseaseId',
        component: TrachomaComponent,
        canActivate: [AuthGuard, NavigationGuard],
        data: { types: [3] },
      },
      {
        path: 'leishmania/:id/diseaseId/:diseaseId',
        component: LeishmaniaComponent,
        canActivate: [AuthGuard, NavigationGuard],
        data: { types: [3] },
      },
      {
        path: 'tuberculosis/:id/diseaseId/:diseaseId',
        component: TuberculosisComponent,
        canActivate: [AuthGuard, NavigationGuard],
        data: { types: [3] },
      },
      {
        path: 'diarrhea/:id/diseaseId/:diseaseId',
        component: DiarrheaComponent,
        canActivate: [AuthGuard, NavigationGuard],
        data: { types: [3] },
      },
      {
        path: 'falseChickenpox/:id/diseaseId/:diseaseId',
        component: FalseChickenpoxComponent,
        canActivate: [AuthGuard, NavigationGuard],
        data: { types: [3] },
      },
      {
        path: 'hepatitisViruses/:id/diseaseId/:diseaseId',
        component: HepatitisVirusesComponent,
        canActivate: [AuthGuard, NavigationGuard],
        data: { types: [3] },
      },
      {
        path: 'leper/:id/diseaseId/:diseaseId',
        component: LeperComponent,
        canActivate: [AuthGuard, NavigationGuard],
        data: { types: [3] },
      },
      {
        path: 'mumbariPoisoning/:id/diseaseId/:diseaseId',
        component: MumbariPoisoningComponent,
        canActivate: [AuthGuard, NavigationGuard],
        data: { types: [3] },
      },
      {
        path: 'mumps/:id/diseaseId/:diseaseId',
        component: MumpsComponent,
        canActivate: [AuthGuard, NavigationGuard],
        data: { types: [3] },
      },
      {
        path: 'severeFoodPoisoning/:id/diseaseId/:diseaseId',
        component: SevereFoodPoisoningComponent,
        canActivate: [AuthGuard, NavigationGuard],
        data: { types: [3] },
      },
      {
        path: 'typhoid/:id/diseaseId/:diseaseId',
        component: TyphoidComponent,
        canActivate: [AuthGuard, NavigationGuard],
        data: { types: [3] },
      },
      {
        path: 'hiv/:id/diseaseId/:diseaseId',
        component: HivComponent,
        canActivate: [AuthGuard, NavigationGuard],
        data: { types: [3] },
      },
      {
        path: 'mers/:id/diseaseId/:diseaseId',
        component: MersComponent,
        canActivate: [AuthGuard, NavigationGuard],
        data: { types: [3] },
      },
      {
        path: 'mumbariPoisoning/:id/diseaseId/:diseaseId',
        component: MumbariPoisoningComponent,
        canActivate: [AuthGuard, NavigationGuard],
        data: { types: [3] },
      },
      {
        path: 'acute/:id/diseaseId/:diseaseId',
        component: AcuteFlaccidParalysisComponent,
        canActivate: [AuthGuard, NavigationGuard],
        data: { types: [3] },
      },

      // {
      //   path: 'investigations/investigation-detailes/:id',
      //   component: InvestigationDetailesComponent,
      //   canActivate: [AuthGuard, NavigationGuard],
      //   data: { types: [3] },
      // },

      {
        path: 'investigations',
        component: InvestigationComponent,
        canActivate: [AuthGuard, NavigationGuard],
        data: { types: [3] },
        children: [
          {
            path: 'investigation-detailes/:id',
            component: InvestigationDetailesComponent,
          },
          {
            path: 'compelete-investigation',
            component: CompleteInvestigationComponent,
            canActivate: [InvestigationPatientGuard],
            children: [
              { path: 'h5n1', component: H5n1Component },
              { path: 'brucella', component: BrucellaComponent },
              { path: 'animal', component: RabiesComponent },
              { path: 'meningeal', component: MeningealComponent },
              { path: 'monkeypox', component: MonkeypoxComponent },
              { path: 'rabies', component: RabiesComponent },
              { path: 'plague', component: PlagueComponent },
              { path: 'fever-rash', component: FeverRashComponent },
              { path: 'rift-valley', component: RiftValleyComponent },
              { path: 'tetanus', component: TetanusComponent },
              { path: 'whooping-cough', component: WhoopingCoughComponent },
              { path: 'diphtheria', component: DiphtheriaComponent },
              {
                path: 'acute-flaccid-paralysis',
                component: AcuteFlaccidParalysisComponent,
              },
              {
                path: 'hemorrhagic-fevers',
                component: HemorrhagicFeversComponent,
              },
              { path: 'malaria', component: MalariaComponent },
              {
                path: 'schistosomiasis',
                component: SchistosomiasisComponent,
              },
              {
                path: 'fasciola',
                component: FasciolaComponent,
              },
              { path: 'typhoid', component: TyphoidComponent },
              { path: 'cholera', component: CholeraComponent },
              {
                path: 'NfalseChickenpoxULL',
                component: FalseChickenpoxComponent,
              },
              {
                path: 'severeFoodPoisoning',
                component: SevereFoodPoisoningComponent,
              },
              { path: 'bloodyDiarrhea', component: BloodyDiarrheaComponent },
              //bloodyDiarrhea
              { path: 'filariasis', component: FilariasisComponent },
              { path: 'trachoma', component: TrachomaComponent },
              { path: 'leishmania', component: LeishmaniaComponent },
              { path: 'tuberculosis', component: TuberculosisComponent },
              { path: 'bloodyDiarrhea', component: BloodyDiarrheaComponent },
              { path: 'cholera', component: CholeraComponent },
              { path: 'diarrhea', component: DiarrheaComponent },
              { path: 'falseChickenpox', component: FalseChickenpoxComponent },
              {
                path: 'hepatitisViruses',
                component: HepatitisVirusesComponent,
              },
              { path: 'leper', component: LeperComponent },
              {
                path: 'mumbariPoisoning',
                component: MumbariPoisoningComponent,
              },
              { path: 'mumps', component: MumpsComponent },
              {
                path: 'severeFoodPoisoning',
                component: SevereFoodPoisoningComponent,
              },
              { path: 'typhoid', component: TyphoidComponent },
              { path: 'hiv', component: HivComponent },
              { path: 'ari', component: AriComponent },
              { path: 'mers', component: MersComponent },
              {
                path: 'mumbariPoisoning',
                component: MumbariPoisoningComponent,
              },
              //
              { path: 'acute', component: AcuteFlaccidParalysisComponent },
            ],
          },
        ],
      },

      {
        path: 'epidemiological-thresholds',
        component: EpidemiologicalThresholdsComponent,
        canActivate: [AuthGuard, NavigationGuard],
        data: { types: [3] },
      },
      {
        path: 'epidemiological-thresholds/:id',
        component: EpidemiologicalThresholdsComponent,
        canActivate: [AuthGuard, NavigationGuard],
        data: { types: [3] },
      },
      {
        path: 'selected-locations',
        component: SelectedLocationsComponent,
        canActivate: [AuthGuard, NavigationGuard],
        data: { types: [3] },
      },
      {
        path: 'not-inferring',
        component: NotInferringComponent,
        canActivate: [NavigationGuard],
        data: { types: [3] },
      },
      {
        path: 'population-data',
        component: PopulationDataComponent,
        canActivate: [AuthGuard, NavigationGuard],
        data: { types: [3] },
        children: [
          {
            path: 'increase-coeffiecnt',
            component: PopulationIncreaseCoefficientComponent,
            canActivate: [AuthGuard, NavigationGuard],
            data: { types: [3] },
          },
          {
            path: 'populationExpectation',
            component: SearchPopulationExpectationComponent,
            canActivate: [AuthGuard, NavigationGuard],
            data: { types: [3] },
          },
          {
            path: 'add-population-data',
            component: AddPopulationDataComponent,
            canActivate: [AuthGuard, NavigationGuard],
            data: { types: [3] },
          },
          {
            path: 'upload-excel-file.html',
            component: UploadExcelfileComponent,
            canActivate: [AuthGuard, NavigationGuard],
            data: { types: [3] },
          },
          {
            path: 'edit-population-data/:id',
            component: AddPopulationDataComponent,
            canActivate: [AuthGuard, NavigationGuard],
            data: { types: [3] },
          },
        ],
      },

      {
        path: 'preparations',
        loadChildren: () =>
          import('./preparations/preparations.module').then(
            (m) => m.PreparationsModule
          ),
        canActivate: [AuthGuard, NavigationGuard],
        data: { types: [3] },
      },
      // { path: 'preparations/add-preparations', loadChildren: () => import('./preparations/preparations.module').then(m => m.PreparationsModule) },
      // { path: 'preparations', component: PreparationsComponent },
      {
        path: 'users',
        component: UsersComponent,
        canActivate: [AuthGuard, NavigationGuard],
        data: { types: [3] },
      },
      {
        path: 'reports',
        component: ReportsComponent,
        canActivate: [AuthGuard, NavigationGuard],
        data: { types: [3] },
      },
      { path: 'report1', component: HealthAdministrationReportComponent },
      { path: 'report2', component: IncedanceReportComponent },
      { path: 'report3', component: IncidentDepartmentReportComponent },
      { path: 'report4', component: IncidentSourceToDepartmentReportComponent },
      {
        path: 'disease-based-on-gender',
        component: DiseaseBasedOnGenderComponent,
      },
      {
        path: 'disease-based-on-result',
        component: DiseaseBasedOnResultComponent,
      },
      {
        path: 'disease-based-on-diagnosis',
        component: DiseaseBasedOnDiagnosisComponent,
      },
      {
        path: 'disease-based-on-age',
        component: DiseaseBasedOnAgeComponent,
      },
      {
        path: 'disease-based-on-patient',
        component: DiseaseBasedOnPatientComponent,
      },
      {
        path: 'zero-reporting-report',
        component: ZeroReportingReportComponent,
      },
      {
        path: 'immediate-reporting-report',
        component: ImmediateReportingReportComponent,
      },
      {
        path: 'roles-report',
        component: RolesReportComponent,
      },
      {
        path: 'notInferring-report',
        component: NotInferringReportComponent,
      },
      {
        path: 'monitorUnitsPeparations-report',
        component: MonitorUnitsPeparationsReportComponent,
      },
      {
        path: 'epidemiologicalThresholds-report',
        component: EpidemiologicalThresholdsReportComponent,
      },
      {
        path: 'caseResultCatesgReport',
        component: CaseResultCategoryComponent,
      },
      {
        path: 'incedentSourceToCase',
        component: IncedentSourceToCaseComponent,
      },
      {
        path: 'finalResultToDiseasReport',
        component: FinalResultToDiseasesComponent,
      },
      {
        path: 'ageCategoriesReport',
        component: AgeCategoriesReportComponent,
      },
      {
        path: 'withGenderReport',
        component: WithGenderReportComponent,
      },
      {
        path: 'withJobTitleReport',
        component: WithJobTitleReportComponent,
      },
      {
        path: 'DiseaseByWeekReport',
        component: DiseaseByWeekReportComponent,
      },
      {
        path: 'DiseaseByMonthReport',
        component: DiseaseByMonthReportComponent,
      },
      {
        path: 'PrevalenceRateToHealthAdministration',
        component: PrevalenceRateToHealthAdministrationComponent,
      },
      {
        path: 'PrevalenceRateToDiseaseReport',
        component: PrevalenceRateToDiseaseReportComponent,
      },
      {
        path: 'PrevalenceRateToDiseaseFinalReport',
        component: PrevalenceRateToDiseaseFinalComponent,
      },
      {
        path: 'UsersReport',
        component: UsersReportComponent,
      },
      {
        path: 'DataMonitoringReport',
        component: DataMonitoringReportComponent,
      },
      {
        path: 'UsersMonitoring',
        component: UserMonitoringReportComponent,
      },
      {
        path: 'PrevalenceRateToDeathReport',
        component: PrevalenceRateToDeathReportComponent,
      },
      {
        path: 'finalResultToIncedentReport',
        component: FinalResultToIncedentComponent,
      },
      {
        path: 'user-report',
        component: UserReportComponent,
      },
      {
        path: 'diseases-rules-report',
        component: DiseasesRulesReportComponent,
      },
      {
        path: 'populations-report',
        component: PopulationsReportComponent,
      },
      {
        path: 'monitor-units-report',
        component: MonitorUnitsReportComponent,
      },
      {
        path: 'monitor-units-team-members-report',
        component: MonitorUnitsTeamMembersReportComponent,
      },
      {
        path: 'monitor-units-team-members-details-report',
        component: MonitorUnitsTeamMembersDetailsReportComponent,
      },
      {
        path: 'announcements',
        component: AnnouncementsComponent,
        canActivate: [AuthGuard, NavigationGuard],
        data: { types: [3] },
      },
      {
        path: 'help',
        component: UserHelpComponent,
        canActivate: [AuthGuard, NavigationGuard],
        data: { types: [3] },
      },

      {
        path: 'general-data-completion',
        component: GeneralDataCompletionComponent,
        canActivate: [NavigationGuard],
        data: { types: [3] },
      },
      {
        path: 'control-panel',
        loadChildren: () =>
          import('./dashboard/controlPanel.module').then(
            (m) => m.ControlPanelModule
          ),
        canActivate: [AuthGuard, NavigationGuard],
        data: { types: [3] },
      },
      {
        path: 'add-user',
        component: AddUserComponent,
        canActivate: [AuthGuard, NavigationGuard],
        data: { types: [3] },
      },
      {
        path: 'edit-user/:id',
        component: AddUserComponent,
        canActivate: [AuthGuard, NavigationGuard],
        data: { types: [3] },
      },
      {
        path: 'view-user/:id',
        component: ViewUserComponent,
        canActivate: [AuthGuard, NavigationGuard],
        data: { types: [3] },
      },
      {
        path: 'chat',
        component: ChatComponent,
        canActivate: [AuthGuard, NavigationGuard],
        data: { types: [1, 2, 3] },
      },
      //Remove this FOR TESTING ONLY
      {
        path: 'dyna-chart',
        component: DynamicChartComponent,
      },
      {
        path: 'profile',
        component: ProfileComponent,
      },
      //END OF TESTING REGION
      {
        path: 'redirect',
        component: RedirectComponent,
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [NavigationGuard],
})
export class HomeRoutes {}
