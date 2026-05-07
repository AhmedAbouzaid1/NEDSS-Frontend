import { GeneralDataModule } from './general-data/general-data.module';
import { HomeRoutes } from './home.routing';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';

import { ControlPanelModule } from './dashboard/controlPanel.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { NavbarComponent } from 'src/app/core/components/navbar/navbar.component';
import { SidebarComponent } from 'src/app/core/components/sidebar/sidebar.component';
import { ChartsDashboardComponent } from './charts-dashboard/charts-dashboard.component';
import { MatIconModule } from '@angular/material/icon';
import { RepeatedRecordsComponent } from './repeated-records/repeated-records.component';
import { LabCasesComponent } from './lab-cases/lab-cases.component';
import { EventsComponent } from './events/events.component';
import { InvestigationComponent } from './investigation/investigation.component';
import { SelectedLocationsComponent } from './selected-locations/selected-locations.component';
import { NotInferringComponent } from './not-inferring/not-inferring.component';
import { PopulationDataComponent } from './population-data/population-data.component';
import { PreparationsComponent } from './preparations/preparations.component';
import { UsersComponent } from './users/users.component';
import { ReportsComponent } from './reports/reports.component';
import { AnnouncementsComponent } from './announcements/announcements.component';
import { UserHelpComponent } from './user-help/user-help.component';
import { TableModule } from 'primeng/table';
import { TabMenuModule } from 'primeng/tabmenu';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { DialogModule } from 'primeng/dialog';
import { StepsModule } from 'primeng/steps';
import { CardModule } from 'primeng/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { GeneralDataCompletionComponent } from './general-data-completion/general-data-completion.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ChatComponent } from './chat/chat.component';

import { AddPopulationDataComponent } from './population-data/add-population-data/add-population-data.component';
import { ExportAsModule } from 'ngx-export-as';
import { NgxPrintModule } from 'ngx-print';
import { MaterialModule } from 'src/app/core/shared/material-module';
import { DuplicationViewComponent } from './repeated-records/duplicationView/duplicationView.component';
import { DuplicationReviewComponent } from './repeated-records/duplicationReview/duplicationReview.component';
import { AddUserComponent } from './users/components/add-user/add-user.component';
import { SearchPopulationExpectationComponent } from './population-data/search-populationExpectation/search-populationExpectation.component';
import { PopulationIncreaseCoefficientComponent } from './population-data/population-increase-coefficient/population-increase-coefficient.component';
import { InvestigationDetailesComponent } from './investigation/investigation-detailes/investigation-detailes.component';
import { CompleteInvestigationComponent } from './investigation/complete-investigation/complete-investigation.component';
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
import { SchistosomiasisFasciolaComponent } from './investigation/complete-investigation/schistosomiasis-fasciola/schistosomiasis-fasciola.component';
import { BrucellaComponent } from './investigation/complete-investigation/brucella/brucella.component';
import { H5n1Component } from './investigation/complete-investigation/h5n1/h5n1.component';
import { MeningealComponent } from './investigation/complete-investigation/meningeal/meningeal.component';
import { SevereFoodPoisoningComponent } from './investigation/complete-investigation/severe-food-poisoning/severe-food-poisoning.component';
import { MumpsComponent } from './investigation/complete-investigation/mumps/mumps.component';
import { CholeraComponent } from './investigation/complete-investigation/cholera/cholera.component';
import { TyphoidComponent } from './investigation/complete-investigation/typhoid/typhoid.component';
import { DiarrheaComponent } from './investigation/complete-investigation/diarrhea/diarrhea.component';
import { MumbariPoisoningComponent } from './investigation/complete-investigation/mumbari-poisoning/mumbari-poisoning.component';
import { BloodyDiarrheaComponent } from './investigation/complete-investigation/bloody-diarrhea/bloody-diarrhea.component';
import { HepatitisVirusesComponent } from './investigation/complete-investigation/hepatitis-viruses/hepatitis-viruses.component';
import { TuberculosisComponent } from './investigation/complete-investigation/tuberculosis/tuberculosis.component';
import { LeperComponent } from './investigation/complete-investigation/leper/leper.component';
import { FalseChickenpoxComponent } from './investigation/complete-investigation/false-chickenpox/false-chickenpox.component';
import { ChatFilterComponent } from './chat/chat-filter/chat-filter.component';
import { ChatUsersComponent } from './chat/chat-users/chat-users.component';
import { FilariasisComponent } from './investigation/complete-investigation/filariasis/filariasis.component';
import { LeishmaniaComponent } from './investigation/complete-investigation/leishmania/leishmania.component';
import { PatientVisitHistoryComponent } from './investigation/complete-investigation/shared/patient-visit-history/patient-visit-history.component';
import { LocalTravelHistoryComponent } from './investigation/complete-investigation/shared/local-travel-history/local-travel-history.component';
import { InternationalTravelHistoryComponent } from './investigation/complete-investigation/shared/international-travel-history/international-travel-history.component';
import { InvestigationSummaryComponent } from './investigation/complete-investigation/shared/investigation-summary/investigation-summary.component';
import { LabSamplesComponent } from './investigation/complete-investigation/shared/lab-samples/lab-samples.component';
import { ViewUserComponent } from './users/view-user/view-user.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { IncedanceReportComponent } from './reports/incedance-report/incedance-report.component';
import { IncidentDepartmentReportComponent } from './reports/incident-department-report/incident-department-report.component';
import { IncidentSourceToDepartmentReportComponent } from './reports/incident-source-to-department-report/incident-source-to-department-report.component';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { HivComponent } from './investigation/complete-investigation/hiv/hiv.component';
import { AriComponent } from './investigation/complete-investigation/ari/ari.component';
import { MersComponent } from './investigation/complete-investigation/mers/mers.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { CaseResultCategoryComponent } from './reports/caseResultCategory/caseResultCategory.component';
import { AcuteFlaccidParalysisComponent } from './investigation/complete-investigation/acute-flaccid-paralysis/acute-flaccid-paralysis.component';
import { FinalResultToDiseasesComponent } from './reports/finalResultToDiseases/finalResultToDiseases.component';
import { IncedentSourceToCaseComponent } from './reports/incedentSourceToCase/incedentSourceToCase.component';
import { FinalResultToIncedentComponent } from './reports/finalResultToIncedent/finalResultToIncedent.component';
import { AgeCategoriesReportComponent } from './reports/ageCategoriesReport/ageCategoriesReport.component';
import { WithGenderReportComponent } from './reports/withGenderReport/withGenderReport.component';
import { WithJobTitleReportComponent } from './reports/withJobTitleReport/withJobTitleReport.component';
import { HealthAdministrationReportComponent } from './reports/HealthAdministrationReport/health-administration-report.component';
import { DiseaseByMonthReportComponent } from './reports/diseaseByMonthReport/diseaseByMonthReport.component';
import { DiseaseByWeekReportComponent } from './reports/diseaseByWeekReport/diseaseByWeekReport.component';
import { PrevalenceRateToHealthAdministrationComponent } from './reports/PrevalenceRateToHealthAdministration/PrevalenceRateToHealthAdministration.component';
import { PrevalenceRateToDiseaseReportComponent } from './reports/PrevalenceRateToDiseaseReport/PrevalenceRateToDiseaseReport.component';
import { PrevalenceRateToDiseaseFinalComponent } from './reports/PrevalenceRateToDiseaseFinal/PrevalenceRateToDiseaseFinal.component';
import { PrevalenceRateToDeathReportComponent } from './reports/PrevalenceRateToDeathReport/PrevalenceRateToDeathReport.component';
import { UsersReportComponent } from './reports/usersReport/usersReport.component';
import { DynamicChartComponent } from './dynamic-chart/dynamic-chart.component';
import { UserMonitoringReportComponent } from './reports/user-monitoring-report/user-monitoring-report.component';
import { DynaFilterComponent } from './dyna-filter/dyna-filter.component';
import { DataMonitoringReportComponent } from './reports/data-monitoring-report/data-monitoring-report.component';
import { UploadExcelfileComponent } from './population-data/upload-excelfile/upload-excelfile.component';
import { ChangePasswordComponent } from '../auth/change-password/change-password.component';
import { AuthModule } from '../auth/auth.module';
import { ChangenpasswordComponent } from 'src/app/core/components/changenpassword/changenpassword.component';
import { ScrollComponent } from './scroll/scroll.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProfileComponent } from './profile/profile.component';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DiseaseBasedOnGenderComponent } from './reports/disease-based-on-gender/disease-based-on-gender.component';
import { FilterArrayReportPipe } from './reports/pipes/filter-array-report.pipe';
import { AccumelateDiseaseByTypePipe } from './reports/pipes/accumelate-disease-by-type.pipe';
import { DiseaseBasedOnGenderPDFComponent } from './reports/disease-based-on-gender/disease-based-on-gender-pdf/disease-based-on-gender-pdf.component';
import { DiseaseBasedOnResultComponent } from './reports/disease-based-on-result/disease-based-on-result.component';
import { DiseaseBasedOnResultPdfComponent } from './reports/disease-based-on-result/disease-based-on-result-pdf/disease-based-on-result-pdf.component';
import { DiseaseBasedOnDiagnosisComponent } from './reports/disease-based-on-diagnosis/disease-based-on-diagnosis.component';
import { DiseaseBasedOnDiagnosisPdfComponent } from './reports/disease-based-on-diagnosis/disease-based-on-diagnosis-pdf/disease-based-on-diagnosis-pdf.component';
import { DiseaseBasedOnAgeComponent } from './reports/disease-based-on-age/disease-based-on-age.component';
import { DiseaseBasedOnAgePdfComponent } from './reports/disease-based-on-age/disease-based-on-age-pdf/disease-based-on-age-pdf.component';
import { AccumelateDiseaseByAgePipe } from './reports/pipes/accumelate-disease-by-age.pipe';
import { DiseaseBasedOnPatientComponent } from './reports/disease-based-on-patient/disease-based-on-patient.component';
import { DiseaseBasedOnPatientPdfComponent } from './reports/disease-based-on-patient/disease-based-on-patient-pdf/disease-based-on-patient-pdf.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { MatNativeDateModule } from '@angular/material/core';
import { MergeRepeatedRecordsComponent } from './repeated-records/merge-repeated-records/merge-repeated-records.component';
import { MergeRecordsPerAttributeComponent } from './repeated-records/merge-records-per-attribute/merge-records-per-attribute.component';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { EpidemiologicalThresholdsUsersComponent } from './epidemiological-thresholds/epidemiological-thresholds-users/epidemiological-thresholds-users.component';
import { UserReportComponent } from './reports/user-report/user-report.component';
import { UserReportPdfComponent } from './reports/user-report/user-report-pdf/user-report-pdf.component';
import { DiseasesRulesReportComponent } from './reports/diseases-rules-report/diseases-rules-report.component';
import { DiseasesRulesReportPdfComponent } from './reports/diseases-rules-report/diseases-rules-report-pdf/diseases-rules-report-pdf.component';
import { ZeroReportingReportComponent } from './reports/zero-reporting-report/zero-reporting-report.component';
import { ZeroReportingReportPdfComponent } from './reports/zero-reporting-report/zero-reporting-report-pdf/zero-reporting-report-pdf.component';
import { ImmediateReportingReportComponent } from './reports/immediate-reporting-report/immediate-reporting-report.component';
import { ImmediateReportingReportPdfComponent } from './reports/immediate-reporting-report/immediate-reporting-report-pdf/immediate-reporting-report-pdf.component';
import { RolesReportComponent } from './reports/roles-report/roles-report.component';
import { RolesReportPdfComponent } from './reports/roles-report/roles-report-pdf/roles-report-pdf.component';
import { NotInferringReportComponent } from './reports/not-inferring-report/not-inferring-report.component';
import { NotInferringReportPdfComponent } from './reports/not-inferring-report/not-inferring-report-pdf/not-inferring-report-pdf.component';
import { PopulationsReportComponent } from './reports/populations-report/populations-report.component';
import { PopulationsReportPDFComponent } from './reports/populations-report/populations-report-pdf/populations-report-pdf.component';
import { MonitorUnitsPeparationsReportComponent } from './reports/monitor-units-peparations-report/monitor-units-peparations-report.component';
import { MonitorUnitsPeparationsReportPdfComponent } from './reports/monitor-units-peparations-report/monitor-units-peparations-report-pdf/monitor-units-peparations-report-pdf.component';
import { EpidemiologicalThresholdsReportComponent } from './reports/epidemiological-thresholds-report/epidemiological-thresholds-report.component';
import { EpidemiologicalThresholdsReportPdfComponent } from './reports/epidemiological-thresholds-report/epidemiological-thresholds-report-pdf/epidemiological-thresholds-report-pdf.component';
import { MonitorUnitsReportComponent } from './reports/monitor-units-report/monitor-units-report.component';
import { MonitorUnitsReportPDFComponent } from './reports/monitor-units-report/monitor-units-report-pdf/monitor-units-report-pdf.component';
import { MonitorUnitsTeamMembersReportComponent } from './reports/monitor-units-team-members-report/monitor-units-team-members-report.component';
import { MonitorUnitsTeamMembersDetailsReportComponent } from './reports/monitor-units-team-members-details-report/monitor-units-team-members-details-report.component';
import { MonitorUnitsTeamMembersReportPDFComponent } from './reports/monitor-units-team-members-report/monitor-units-team-members-report-pdf/monitor-units-team-members-report-pdf.component';
import { MonitorUnitsTeamMembersDetailsReportPDFComponent } from './reports/monitor-units-team-members-details-report/monitor-units-team-members-details-report-pdf/monitor-units-team-members-details-report-pdf.component';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}
@NgModule({
  declarations: [
    PopulationIncreaseCoefficientComponent,
    SearchPopulationExpectationComponent,
    InvestigationComponent,
    InvestigationDetailesComponent,
    CompleteInvestigationComponent,
    EpidemiologicalThresholdsComponent,
    H5n1Component,
    MonkeypoxComponent,
    RabiesComponent,
    PlagueComponent,
    FeverRashComponent,
    RiftValleyComponent,
    NotificationsComponent,
    HealthAdministrationReportComponent,
    IncedanceReportComponent,
    WithGenderReportComponent,
    IncedentSourceToCaseComponent,
    IncidentDepartmentReportComponent,
    IncidentSourceToDepartmentReportComponent,
    CaseResultCategoryComponent,
    FinalResultToDiseasesComponent,
    TetanusComponent,
    WhoopingCoughComponent,
    MalariaComponent,
    FeverRashComponent,
    DiphtheriaComponent,
    UsersReportComponent,
    DataMonitoringReportComponent,
    UserMonitoringReportComponent,
    PrevalenceRateToHealthAdministrationComponent,
    PrevalenceRateToDiseaseReportComponent,
    PrevalenceRateToDiseaseFinalComponent,
    PrevalenceRateToDeathReportComponent,
    DiseaseByMonthReportComponent,
    DiseaseByWeekReportComponent,
    FinalResultToIncedentComponent,
    AgeCategoriesReportComponent,
    WithJobTitleReportComponent,
    SchistosomiasisFasciolaComponent,
    HemorrhagicFeversComponent,
    HomeComponent,
    NavbarComponent,
    SidebarComponent,
    ChartsDashboardComponent,
    DuplicationViewComponent,
    RepeatedRecordsComponent,
    AddPopulationDataComponent,
    LabCasesComponent,
    ChatComponent,
    EventsComponent,
    DuplicationReviewComponent,
    AddPopulationDataComponent,
    SelectedLocationsComponent,
    NotInferringComponent,
    PopulationDataComponent,
    PreparationsComponent,
    UsersComponent,
    ReportsComponent,
    AnnouncementsComponent,
    UserHelpComponent,
    //CreateChatComponent,
    GeneralDataCompletionComponent,
    AddUserComponent,
    BrucellaComponent,
    MeningealComponent,
    SevereFoodPoisoningComponent,
    MumpsComponent,
    CholeraComponent,
    TyphoidComponent,
    DiarrheaComponent,
    MumbariPoisoningComponent,
    BloodyDiarrheaComponent,
    HepatitisVirusesComponent,
    TuberculosisComponent,
    LeperComponent,
    FalseChickenpoxComponent,
    ChatFilterComponent,
    ChatUsersComponent,
    FilariasisComponent,
    LeishmaniaComponent,
    PatientVisitHistoryComponent,
    LocalTravelHistoryComponent,
    InternationalTravelHistoryComponent,
    InvestigationSummaryComponent,
    LabSamplesComponent,
    HivComponent,
    AriComponent,
    MersComponent,
    ViewUserComponent,
    AcuteFlaccidParalysisComponent,
    DynamicChartComponent,
    DynaFilterComponent,
    UploadExcelfileComponent,
    ChangenpasswordComponent,
    ScrollComponent,
    ProfileComponent,
    DiseaseBasedOnGenderComponent,
    FilterArrayReportPipe,
    AccumelateDiseaseByTypePipe,
    DiseaseBasedOnGenderPDFComponent,
    DiseaseBasedOnResultComponent,
    DiseaseBasedOnResultPdfComponent,
    DiseaseBasedOnDiagnosisComponent,
    DiseaseBasedOnDiagnosisPdfComponent,
    DiseaseBasedOnAgeComponent,
    DiseaseBasedOnAgePdfComponent,
    AccumelateDiseaseByAgePipe,
    DiseaseBasedOnPatientComponent,
    DiseaseBasedOnPatientPdfComponent,
    MergeRepeatedRecordsComponent,
    MergeRecordsPerAttributeComponent,
    EpidemiologicalThresholdsUsersComponent,
    UserReportComponent,
    UserReportPdfComponent,
    DiseasesRulesReportComponent,
    DiseasesRulesReportPdfComponent,
    ZeroReportingReportComponent,
    ZeroReportingReportPdfComponent,
    ImmediateReportingReportComponent,
    ImmediateReportingReportPdfComponent,
    RolesReportComponent,
    RolesReportPdfComponent,
    NotInferringReportComponent,
    NotInferringReportPdfComponent,
    PopulationsReportComponent,
    PopulationsReportPDFComponent,
    MonitorUnitsPeparationsReportComponent,
    MonitorUnitsPeparationsReportPdfComponent,
    EpidemiologicalThresholdsReportComponent,
    EpidemiologicalThresholdsReportPdfComponent,
    MonitorUnitsReportComponent,
    MonitorUnitsReportPDFComponent,
    MonitorUnitsTeamMembersReportComponent,
    MonitorUnitsTeamMembersDetailsReportComponent,
    MonitorUnitsTeamMembersReportPDFComponent,
    MonitorUnitsTeamMembersDetailsReportPDFComponent,
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ExportAsModule,
    NgxPrintModule,
    HomeRoutes,
    NgbModule,
    SharedModule,
    MaterialModule,
    NgbPaginationModule,
    ReactiveFormsModule,
    ControlPanelModule,
    GeneralDataModule,
    TableModule,
    MatIconModule,
    FormsModule,
    PaginatorModule,
    StepsModule,
    DialogModule,
    ButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgMultiSelectDropDownModule.forRoot(),
    // ngx-translate and the loader module
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    TabMenuModule,
    MultiSelectModule,
    InputTextModule,
    InputTextareaModule,
    RadioButtonModule,
    ConfirmDialogModule,
    HighchartsChartModule,
    CardModule,
    CalendarModule,
    DropdownModule,
  ],
  exports: [
    NavbarComponent,
    ChangenpasswordComponent,
    SidebarComponent,
    TranslateModule,
    ToastModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeModule { }
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
