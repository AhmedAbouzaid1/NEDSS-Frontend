import { IncidentSourceHospitalDTO } from './../../features/home/chat/Models/incident-source-hospital-dto';
import { BaseAPIService } from 'src/app/core/services/BaseAPI.service';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ChatFilter } from 'src/app/models/chat-filter';
import { Result } from 'src/app/features/Result';
import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { dispatch } from '../../../../node_modules/@types/d3';
import { SystemUserMainDataFilter } from 'src/app/features/home/epidemiological-thresholds/epidemiological-thresholds-users/Model/system-user-main-data-filter';

@Injectable({
  providedIn: 'root',
})
export class LookupsGetterService {
  private GovernmentControllerURL: string =
    environment.baseApiUrl + 'Government/';
  private FinalResultControllerURL: string =
    environment.baseApiUrl + 'FinalResult/';
  private HealthAdministrationControllerURL: string =
    environment.baseApiUrl + 'HealthAdministration/';
  private AppLanguageControllerURL: string =
    environment.baseApiUrl + 'AppLanguage/';
  private AppPageControllerURL: string = environment.baseApiUrl + 'AppPage/';
  private AppPageLabelControllerURL: string =
    environment.baseApiUrl + 'AppPageLabel/';
  private AppPageLabelTextControllerURL: string =
    environment.baseApiUrl + 'AppPageLabelText/';
  private CaseResultCategoryControllerURL: string =
    environment.baseApiUrl + 'CaseResultCategory/';
  private CityControllerURL: string = environment.baseApiUrl + 'City/';
  private DepartmentControllerURL: string =
    environment.baseApiUrl + 'Department/';
  private DeviceCategoryControllerURL: string =
    environment.baseApiUrl + 'DeviceCategory/';
  private DeviceTypeControllerURL: string =
    environment.baseApiUrl + 'DeviceType/';
  private DiseaseCategoryControllerURL: string =
    environment.baseApiUrl + 'DiseaseCategory/';
  private DiseaseCheckControllerURL: string =
    environment.baseApiUrl + 'DiseaseCheck/';
  private DiseaseGroupControllerURL: string =
    environment.baseApiUrl + 'DiseaseGroup/';
  private DiseaseControllerURL: string = environment.baseApiUrl + 'Disease/';
  private DiseaseLabTestControllerURL: string =
    environment.baseApiUrl + 'DiseaseLabTest/';
  private DiseaseLabTestResultControllerURL: string =
    environment.baseApiUrl + 'DiseaseLabTestResult/';
  private DiseaseRuleControllerURL: string =
    environment.baseApiUrl + 'DiseaseRule/';
  private DiseaseClinicalSymptomControllerURL: string =
    environment.baseApiUrl + 'DiseaseClinicalSymptom/';

  private ClinicalSymptomControllerURL: string =
    environment.baseApiUrl + 'ClinicalSymptom/';
  private HealthOfficeControllerURL: string =
    environment.baseApiUrl + 'HealthOffice/';
  private IncidentSourceHospitalControllerURL: string =
    environment.baseApiUrl + 'IncidentSourceHospital/';
  private IncidentSourceHospitalTypeControllerURL: string =
    environment.baseApiUrl + 'IncidentSourceHospitalType/';
  private LabPlaceControllerURL: string = environment.baseApiUrl + 'LabPlace/';
  private NationalityControllerURL: string =
    environment.baseApiUrl + 'Nationality/';
  private PatientJobCategoryControllerURL: string =
    environment.baseApiUrl + 'PatientJobCategory/';
  private PatientJobControllerURL: string =
    environment.baseApiUrl + 'PatientJob/';
  private PositionControllerURL: string = environment.baseApiUrl + 'Position/';
  private PrincipalityControllerURL: string =
    environment.baseApiUrl + 'Principality/';
  private UnitResponsibilityLevelControllerURL: string =
    environment.baseApiUrl + 'UnitResponsibilityLevel/';
  private UserGroupControllerURL: string =
    environment.baseApiUrl + 'UserGroup/';

  private OrganizationURL: string = environment.baseApiUrl + 'Organization/';
  private LevelURL: string = environment.baseApiUrl + 'Level/';
  private BranchURL: string = environment.baseApiUrl + 'Branch/';
  private AreaURL: string = environment.baseApiUrl + 'Area/';
  private DependencyURL: string = environment.baseApiUrl + 'Dependency/';
  private ChartsApiUrl: string =
    environment.baseApiUrl + 'ChartsApiControllers/';
  private ReportsApiUrl: string = environment.baseApiUrl + 'Reporting/';
  private AccountApiUrl: string = environment.baseApiUrl + 'Account/';
  private DashBoardApiUrl: string = environment.baseApiUrl + 'ChartToUser/';
  private ChronicDiseaseApiUrl: string =
    environment.baseApiUrl + 'ChronicDisease/';

  private ReportApiController: string = environment.baseApiUrl + 'Reports/';
  private RoleApiController: string = environment.baseApiUrl + 'Role/';

  // New By Hatem
  private NewDashboardApiUrl: string = environment.baseApiUrl + 'Dashboard/';
  private appSettingsApiUrl: string = environment.baseApiUrl + 'AppSettings/';

  public $ConnectedUsersCount: Subject<string> = new Subject<string>();

  constructor(private APIs: BaseAPIService) {}

  getChronicDiseases() {
    return this.APIs.get(this.ChronicDiseaseApiUrl + 'GetAll');
  }

  //New By Hatem
  getOnlineUsers(Filter: any) {
    return this.APIs.post(this.NewDashboardApiUrl + 'GetOnlineUsers', Filter);
  }
  getPatients() {
    return this.APIs.get(this.NewDashboardApiUrl + 'GetPatients');
  }
  getIncompletePatients() {
    return this.APIs.get(
      this.NewDashboardApiUrl + 'GetPatientsWithIncompleteInvestigations'
    );
  }
  getSilentSources() {
    return this.APIs.get(this.NewDashboardApiUrl + 'GetSilentSources');
  }
  getSignutares() {
    return this.APIs.get(
      this.NewDashboardApiUrl +
        'GetPercentageOfPatientsReportedInTheLast24Hours'
    );
  }
  getCompleteData() {
    return this.APIs.get(
      this.NewDashboardApiUrl +
        'GetPercentageOfPatientsReportedWithCompletedData'
    );
  }
  getNonInferentialPatients() {
    return this.APIs.get(this.NewDashboardApiUrl + 'GetNonInferentialPatients');
  }
  getPatientsWithLabChecks() {
    return this.APIs.get(this.NewDashboardApiUrl + 'GetPatientWithLabChecks');
  }
  GetPatientsVersusAgeDashboard() {
    return this.APIs.get(this.NewDashboardApiUrl + 'GetPatientsVersusAge');
  }
  GetPatientsVersusFinalDiagnosticsDashboard() {
    return this.APIs.get(
      this.NewDashboardApiUrl + 'GetPatientsVersusFinalDiagnostics'
    );
  }
  GetPatientsVersusGenderDashboard() {
    return this.APIs.get(this.NewDashboardApiUrl + 'GetPatientsVersusGender');
  }
  GetPatientsVersusInitialDiagnosticsDashboard() {
    return this.APIs.get(
      this.NewDashboardApiUrl + 'GetPatientsVersusInitialDiagnostics'
    );
  }
  GetPatientsVersusPatientsResultDiagnosticsDashboard() {
    return this.APIs.get(
      this.NewDashboardApiUrl + 'GetPatientsVersusPatientsResultDiagnostics'
    );
  }
  GetPatientsVersusResultDashboard() {
    return this.APIs.get(this.NewDashboardApiUrl + 'GetPatientsVersusResult');
  }
  GetPatientsVersusYearsDashboard() {
    return this.APIs.get(this.NewDashboardApiUrl + 'GetPatientsVersusYears');
  }
  GetPatientsVersusGovernmentsDashboard() {
    return this.APIs.get(
      this.NewDashboardApiUrl + 'GetPatientsVersusGovernments'
    );
  }
  GetReportedCasesRatesVersusGovernoratesDashboard(Filter: any) {
    return this.APIs.post(
      this.NewDashboardApiUrl + 'GetReportedCasesRatesVersusGovernoratesChart',
      Filter
    );
  }
  GetReportedCasesCountsVersusEpidemicWeeksDashboard(Filter: any) {
    return this.APIs.post(
      this.NewDashboardApiUrl +
        'GetReportedCasesCountsVersusEpidemicWeeksChart',
      Filter
    );
  }
  GetReportedCasesRatesOverYearsVersusGovernoratesChartDashboard(Filter: any) {
    return this.APIs.post(
      this.NewDashboardApiUrl +
        'GetReportedCasesRatesOverYearsVersusGovernoratesChart',
      Filter
    );
  }
  GetReportedCasesCountsDistributedOverYearsVersusEpidemicWeeksChartDashboard(
    Filter: any
  ) {
    return this.APIs.post(
      this.NewDashboardApiUrl +
        'GetReportedCasesCountsDistributedOverYearsVersusEpidemicWeeksChart',
      Filter
    );
  }
  GetInfectedCasesRatesVersusGovernoratesDashboard(Filter: any) {
    return this.APIs.post(
      this.NewDashboardApiUrl + 'GetInfectedCasesRatesVersusGovernoratesChart',
      Filter
    );
  }
  GetInfectedCasesCountsVersusEpidemicWeeksDashboard(Filter: any) {
    return this.APIs.post(
      this.NewDashboardApiUrl +
        'GetInfectedCasesCountsVersusEpidemicWeeksChart',
      Filter
    );
  }
  GetInfectedCasesRatesOverYearsVersusGovernoratesDashboard(Filter: any) {
    return this.APIs.post(
      this.NewDashboardApiUrl +
        'GetInfectedCasesRatesOverYearsVersusGovernoratesChart',
      Filter
    );
  }
  GetInfectedCasesCountsDistributedOverYearsVersusEpidemicWeeksDashboard(
    Filter: any
  ) {
    return this.APIs.post(
      this.NewDashboardApiUrl +
        'GetInfectedCasesCountsDistributedOverYearsVersusEpidemicWeeksChart',
      Filter
    );
  }

  GetDistributionOfDeathsByGenderDashboard(Filter: any) {
    return this.APIs.post(
      this.NewDashboardApiUrl + 'GetDistributionOfDeathsByGender',
      Filter
    );
  }

  GetDistributionOfDeathsByCaseDiagnosisDashboard(Filter: any) {
    return this.APIs.post(
      this.NewDashboardApiUrl + 'GetDistributionOfDeathsByCaseDiagnosis',
      Filter
    );
  }

  GetDistributionOfDeathsByAgeRangeDashboard(Filter: any) {
    return this.APIs.post(
      this.NewDashboardApiUrl + 'GetDistributionOfDeathsByAgeRange',
      Filter
    );
  }

  GetCaseFatalityRateDashboard(Filter: any) {
    return this.APIs.post(
      this.NewDashboardApiUrl + 'GetCaseFatalityRate',
      Filter
    );
  }

  GetReportingTimingsChartDashboard(Filter: any) {
    return this.APIs.post(
      this.NewDashboardApiUrl + 'GetReportingTimingsChart',
      Filter
    );
  }

  GetInvestigationsTimingsChartDashboard(Filter: any) {
    return this.APIs.post(
      this.NewDashboardApiUrl + 'GetInvestigationsTimingsChart',
      Filter
    );
  }

  ///#region  Dashboards
  getOnlineCount() {
    let data = this.APIs.get(this.AccountApiUrl + 'GetOnlineCount');
    var r = data.subscribe((result: any) => {
      return result.data;
    });

    return data;
  }
  getConnectedUsers(UserFilter: any) {
    return this.APIs.create(
      this.AccountApiUrl + 'GetConnectedUsers',
      UserFilter
    );
  }

  getDashBoardsByUserId(id) {
    let data = this.APIs.get(
      this.DashBoardApiUrl + 'GetDashBordByUserId?User_Id=' + id
    );
    var r = data.subscribe((result: any) => {
      return result.data;
    });
    localStorage.setItem('getDashBoardsByUserId', JSON.stringify(data));
    return data;
  }
  getAllDashBoards() {
    return this.APIs.get(this.DashBoardApiUrl + 'GetAllDashBords');
  }
  addDashBoard(UserFilter: any) {
    return this.APIs.post(this.DashBoardApiUrl + 'AddDashBord', UserFilter);
  }
  getDashBoardById(UserFilter: any) {
    return this.APIs.get(
      this.DashBoardApiUrl + 'GetDashBordToEdit?Dash_Id=' + UserFilter
    );
  }
  DeleteDashBoardById(id: any) {
    return this.APIs.delete(this.DashBoardApiUrl + 'DeleteDashBords?id=' + id);
  }
  UpdateDashBoardById(updateFilter: any) {
    return this.APIs.update(
      this.DashBoardApiUrl + 'UpdateDashBords',
      updateFilter
    );
  }

  /// End Region Dashboards
  ///#region  Users

  getPageUsers(UserFilter: any) {
    return this.APIs.create(this.AccountApiUrl + 'GetPage', UserFilter);
  }

  /// End Region User

  ///#region  ChartLookup

  getReportingRateOfDiseaseCharts(ChartFilter: any) {
    return this.APIs.create(
      this.ChartsApiUrl + 'ReportingRateOfDiseaseCasesByDate',
      ChartFilter
    );
  }

  getReportingRateChangeCharts(ChartFilter: any) {
    return this.APIs.create(
      this.ChartsApiUrl + 'ReportingRateChangeByDate',
      ChartFilter
    );
  }

  getReportingInfectionRateByYearCharts(ChartFilter: any) {
    var years = [];
    return this.APIs.post(
      this.ChartsApiUrl + 'ReportingInfectionRateByYear',
      ChartFilter
    );
  }

  ///#endregion ChartLookup
  ///#region  ReportReport

  DiseaseByWeekReport(ByWeekFilter: any) {
    return this.APIs.post(
      this.ReportsApiUrl + 'DiseaseByWeekReport',
      ByWeekFilter
    );
  }
  DiseaseByMonthReport(ByMonthFilter: any) {
    return this.APIs.post(
      this.ReportsApiUrl + 'DiseaseByMonthReport',
      ByMonthFilter
    );
  }
  FinalResultToDiseaseReport(finalResultFilter: any) {
    return this.APIs.get(
      this.ReportsApiUrl +
        `FinalResultToDiseaseReport?result=${finalResultFilter.result}&From_Date=${finalResultFilter.from_Date}&To_Date=${finalResultFilter.to_Date}`
    );
  }

  FinalResultToDiseaseReport1(finalResultFilter: any) {
    return this.APIs.post(
      this.ReportsApiUrl + 'FinalResultToDiseaseReport',
      finalResultFilter
    );
  }
  getAccordingPatientJob(patientJopFilter: any) {
    return this.APIs.post(
      this.ReportsApiUrl + 'FinalResultsToPatientJopReport',
      patientJopFilter
    );
  }
  FinalResultToIncedentSourceReport(finalResultFilter: any) {
    return this.APIs.post(
      this.ReportsApiUrl + 'FinalResultToIncedentSourceReport',
      finalResultFilter
    );
  }
  getSecondChartById(id: string) {
    return this.APIs.get(
      this.ReportsApiUrl + 'CountOfCacesByCountry?Ids=' + id
    );
  }
  getHealthAdministrationReport(
    id: string,
    departmentIds: string,
    isHome: boolean,
    categoryIds: string,
    tarasodSelect: number,
    StartSelectedDiseaseIds: string,
    EndSelectedDiseaseIds: string,
    years: string,
    filterDateDTO: any
  ) {
    let home = 1;
    if (isHome) home = 1;
    else home = 0;
    return this.APIs.create(
      this.ReportsApiUrl +
        'GetHealthAdministrationPatiensReport?ints=' +
        id +
        '&departments=' +
        departmentIds +
        '&isHome=' +
        home +
        '&categoryIds=' +
        categoryIds +
        '&tarasodSelect=' +
        tarasodSelect +
        '&StartSelectedDiseaseIds=' +
        StartSelectedDiseaseIds +
        '&EndSelectedDiseaseIds=' +
        EndSelectedDiseaseIds +
        '&years=' +
        years,
      filterDateDTO
    );
  }
  getIncedanceReport(
    id: string,
    departmentIds: string,
    isHome: boolean,
    categoryIds: string,
    tarasodSelect: number,
    StartSelectedDiseaseIds: string,
    EndSelectedDiseaseIds: string,
    years: string,
    filterDateDTO: any
  ) {
    let home = 1;
    if (isHome) home = 1;
    else home = 0;
    return this.APIs.create(
      this.ReportsApiUrl +
        'GetIncidentCasesOfPopulationReport?parameters=' +
        id +
        '&departments=' +
        departmentIds +
        '&isHome=' +
        home +
        '&categoryIds=' +
        categoryIds +
        '&tarasodSelect=' +
        tarasodSelect +
        '&StartSelectedDiseaseIds=' +
        StartSelectedDiseaseIds +
        '&EndSelectedDiseaseIds=' +
        EndSelectedDiseaseIds +
        '&years=' +
        years,
      filterDateDTO
    );
  }
  getDiseaseAccordingToAgeGroups(
    Diseases: string,
    From_Date: string,
    To_Date: string
  ) {
    return this.APIs.get(
      this.ReportsApiUrl +
        `DiseaseAccordingToAgeGroups?Disease=${Diseases}&From_Date=${From_Date}&To_Date=${To_Date}`
    );
  }
  PrevalenceRateToHealthAdministration(
    healthAdministration: string,
    year: number
  ) {
    return this.APIs.get(
      this.ReportsApiUrl +
        `PrevalenceRateToHealthAdministrationReport?HealthAdministrations=${healthAdministration}&Year=${year}`
    );
  }
  PrevalenceRateToDiseaseReport(diseas: string, year: number) {
    return this.APIs.get(
      this.ReportsApiUrl +
        `PrevalenceRateToDiseaseReport?Disease=${diseas}&Year=${year}`
    );
  }
  PrevalenceRateToDiseaseFinalReport(diseas: string, year: number) {
    return this.APIs.get(
      this.ReportsApiUrl +
        `PrevalenceRateToDiseaseFinalReport?Disease=${diseas}&Year=${year}`
    );
  }
  PrevalenceRateToDeathReport(diseas: string, year: number) {
    return this.APIs.get(
      this.ReportsApiUrl +
        `PrevalenceRateDethResoultReport?Disease=${diseas}&Year=${year}`
    );
  }
  UsersReport(IncedanceSource: string) {
    return this.APIs.get(
      this.ReportsApiUrl + `UserRreport?sourc=${IncedanceSource}`
    );
  }
  getDiseaseAccordingToGender(
    Diseases: string,
    From_Date: string,
    To_Date: string
  ) {
    return this.APIs.get(
      this.ReportsApiUrl +
        `DiseaseAccordingToGender?Disease=${Diseases}&From_Date=${From_Date}&To_Date=${To_Date}`
    );
  }
  getIncidentDepartmentReport(
    Diseases: string,
    Department: string,
    From_Date: string,
    To_Date: string,
    source: string,
    isHome: boolean,
    categoryIds: string,
    tarasodSelect: number,
    StartSelectedDiseaseIds: string,
    EndSelectedDiseaseIds: string,
    years: string
  ) {
    let home = 0;
    if (isHome) home = 1;
    else home = 0;
    if (Diseases == '') Diseases = '-1';
    if (Department == '') Department = '-1';
    return this.APIs.get(
      this.ReportsApiUrl +
        `GetIncidentDepartmentToDiseasesReport?DiseasesPra=${Diseases}&DepartmentPra=${Department}&From_DatePra=${From_Date}&To_DatePra=${To_Date}&Sorce=${source}&isHome=${home}&categoryIds=${categoryIds}&tarasodSelect=${tarasodSelect}&StartSelectedDiseaseIds=${StartSelectedDiseaseIds}&EndSelectedDiseaseIds=${EndSelectedDiseaseIds}&years=${years}`
    );
  }
  getCaseResultCategoryReport(
    Diseases: string,
    caseResulCateg: string,
    From_Date: string,
    To_Date: string
  ) {
    return this.APIs.get(
      this.ReportsApiUrl +
        `CaseResultCategoryReport?Disease=${Diseases}&CaseResultCategory=${caseResulCateg}&From_Date=${From_Date}&To_Date=${To_Date}`
    );
  }
  getIncedencSourceToCategoryReport(
    sourCe: string,
    caseResulCateg: string,
    From_Date: string,
    To_Date: string
  ) {
    return this.APIs.get(
      this.ReportsApiUrl +
        `IncedentSourceToCaseResults?IncedentSource=${sourCe}&CaseResult=${caseResulCateg}&From_Date=${From_Date}&To_Date=${To_Date}`
    );
  }
  getUserMonitoringReport(
    Diseases: string,
    From_Date: string,
    To_Date: string,
    sourCe: string
  ) {
    return this.APIs.get(
      this.ReportsApiUrl +
        `InvistgationToDiseaseReport?Disease=${Diseases}&From_Date=${From_Date}&To_Date=${To_Date}&IncidentSource=${sourCe}`
    );
  }
  getDataMonitoringReport(sourCe: string, From_Date: string, To_Date: string) {
    return this.APIs.get(
      this.ReportsApiUrl +
        `UserFilds?Source=${sourCe}&From_Date=${From_Date}&To_Date=${To_Date}`
    );
  }
  getIncidentSourceToDepartmentReport(
    source: string,
    Department: string,
    From_Date: string,
    To_Date: string,
    Diseases: string
  ) {
    return this.APIs.get(
      this.ReportsApiUrl +
        `IncedentSourceToDepartmentsReport?IncedentSource=${source}&Department=${Department}&From_Date=${From_Date}&To_Date=${To_Date}&Disease=${Diseases}`
    );
  }
  getSourceCasesOfPopulationReport(id: string) {
    return this.APIs.get(
      this.ReportsApiUrl + 'GetSourceCasesOfPopulationReport?parameters=' + id
    );
  }

  // /Reports/GetUsersReport
  getUsersReport(userReport: any) {
    return this.APIs.post(
      this.ReportApiController + 'GetUsersReport',
      userReport
    );
  }

  // /Reports/GetMonitorUnitsReport
  getMonitorUnitsReport(monitorUnitsReportFilter: any) {
    return this.APIs.post(
      this.ReportApiController + 'GetMonitorUnitsReport',
      monitorUnitsReportFilter
    );
  }

  // /Reports/GetMonitorUnitsTeamMembersReport
  getMonitorUnitsTeamMembersReport(monitorUnitsReportFilter: any) {
    return this.APIs.post(
      this.ReportApiController + 'GetMonitorUnitsTeamMembersReport',
      monitorUnitsReportFilter
    );
  }

  // /Reports/GetMonitorUnitsTeamMembersDetailsReport
  getMonitorUnitsTeamMembersDetailsReport(monitorUnitsReportFilter: any) {
    return this.APIs.post(
      this.ReportApiController + 'GetMonitorUnitsTeamMembersDetailsReport',
      monitorUnitsReportFilter
    );
  }
  // /Reports/GetDiseasesRulesReport
  getDiseasesRulesReport(diseasesRulesReportFilter: any) {
    return this.APIs.post(
      this.ReportApiController + 'GetDiseasesRulesReport',
      diseasesRulesReportFilter
    );
  }

  // /Reports/GetPopulationsReport
  getPopulationsReport(populationReportFilter: any) {
    return this.APIs.post(
      this.ReportApiController + 'GetPopulationsReport',
      populationReportFilter
    );
  }

  ///#endregion ReportReport
  ///#region  GovernmentLookup
  getAllGovernments() {
    return this.APIs.get(this.GovernmentControllerURL + 'GetAll');
    if (navigator.onLine) {
      var data = this.APIs.get(this.GovernmentControllerURL + 'GetAll');
      data.subscribe((result: any) => {
        localStorage.setItem('getAllGovernments', JSON.stringify(result));
      });
      return data;
    } else {
      const data = new Observable((observer) => {
        observer.next(JSON.parse(localStorage.getItem('getAllGovernments')));
        observer.complete();
      });
      return data;
    }
  }
  getAllGovernmentsForUser(forSystemUser: boolean) {
    return this.APIs.get(
      this.GovernmentControllerURL + 'GetAll?forSystemUser=' + true
    );
    if (navigator.onLine) {
      var data = this.APIs.get(
        this.GovernmentControllerURL + 'GetAll?forSystemUser=' + true
      );
      data.subscribe((result: any) => {
        localStorage.setItem('getAllGovernments', JSON.stringify(result));
      });
      return data;
    } else {
      const data = new Observable((observer) => {
        observer.next(JSON.parse(localStorage.getItem('getAllGovernments')));
        observer.complete();
      });
      return data;
    }
  }
  getPageGovernments(GovernmentFilter: any) {
    return this.APIs.create(
      this.GovernmentControllerURL + 'GetPage',
      GovernmentFilter
    );
  }
  getParentGovernments() {
    return this.APIs.get(this.GovernmentControllerURL + 'GetParent');
  }
  deleteGovernment(id: number) {
    return this.APIs.delete(this.GovernmentControllerURL + 'Delete?id=' + id);
  }
  getGovernmentById(id: number) {
    return this.APIs.get(this.GovernmentControllerURL + 'GetById?id=' + id);
  }
  updateGovernment(Government: any) {
    return this.APIs.update(
      this.GovernmentControllerURL + 'Update',
      Government
    );
  }

  addGovernment(Government: any) {
    return this.APIs.post(this.GovernmentControllerURL + 'Add', Government);
  }
  ///#endregion

  ///#region  AppLanguageLookup
  getAllAppLanguages() {
    return this.APIs.get(this.AppLanguageControllerURL + 'GetAll');
  }
  getPageAppLanguages(AppLanguageFilter: any) {
    return this.APIs.create(
      this.AppLanguageControllerURL + 'GetPage',
      AppLanguageFilter
    );
  }
  deleteAppLanguage(id: number) {
    return this.APIs.delete(this.AppLanguageControllerURL + 'Delete?id=' + id);
  }
  getAppLanguageById(id: number) {
    return this.APIs.get(this.AppLanguageControllerURL + 'GetById?id=' + id);
  }
  updateAppLanguage(AppLanguage: any) {
    return this.APIs.update(
      this.AppLanguageControllerURL + 'Update',
      AppLanguage
    );
  }
  addAppLanguage(AppLanguage: any) {
    return this.APIs.post(this.AppLanguageControllerURL + 'Add', AppLanguage);
  }
  ///#endregion

  ///#region  AppPageLookup
  getAllAppPages() {
    return this.APIs.get(this.AppPageControllerURL + 'GetAll');
  }
  getPageAppPages(AppPageFilter: any) {
    return this.APIs.create(
      this.AppPageControllerURL + 'GetPage',
      AppPageFilter
    );
  }
  deleteAppPage(id: number) {
    return this.APIs.delete(this.AppPageControllerURL + 'Delete?id=' + id);
  }
  getAppPageById(id: number) {
    return this.APIs.get(this.AppPageControllerURL + 'GetById?id=' + id);
  }
  updateAppPage(AppPage: any) {
    return this.APIs.update(this.AppPageControllerURL + 'Update', AppPage);
  }
  addAppPage(AppPage: any) {
    return this.APIs.post(this.AppPageControllerURL + 'Add', AppPage);
  }
  ///#endregion
  ///#region  AppPageLabelLookup
  getAllAppPageLabels() {
    return this.APIs.get(this.AppPageLabelControllerURL + 'GetAll');
  }
  getPageAppPageLabels(AppPageLabelFilter: any) {
    return this.APIs.create(
      this.AppPageLabelControllerURL + 'GetPage',
      AppPageLabelFilter
    );
  }
  deleteAppPageLabel(id: number) {
    return this.APIs.delete(this.AppPageLabelControllerURL + 'Delete?id=' + id);
  }
  getAppPageLabelById(id: number) {
    return this.APIs.get(this.AppPageLabelControllerURL + 'GetById?id=' + id);
  }
  updateAppPageLabel(AppPageLabel: any) {
    return this.APIs.update(
      this.AppPageLabelControllerURL + 'Update',
      AppPageLabel
    );
  }
  addAppPageLabel(AppPageLabel: any) {
    return this.APIs.post(this.AppPageLabelControllerURL + 'Add', AppPageLabel);
  }
  ///#endregion

  ///#region  AppPageLabelTextLookup
  getAllAppPageLabelTexts() {
    return this.APIs.get(this.AppPageLabelTextControllerURL + 'GetAll');
  }
  getPageAppPageLabelTexts(AppPageLabelTextFilter: any) {
    return this.APIs.create(
      this.AppPageLabelTextControllerURL + 'GetPage',
      AppPageLabelTextFilter
    );
  }
  deleteAppPageLabelText(id: number) {
    return this.APIs.delete(
      this.AppPageLabelTextControllerURL + 'Delete?id=' + id
    );
  }
  getAppPageLabelTextById(id: number) {
    return this.APIs.get(
      this.AppPageLabelTextControllerURL + 'GetById?id=' + id
    );
  }
  updateAppPageLabelText(AppPageLabelText: any) {
    return this.APIs.update(
      this.AppPageLabelTextControllerURL + 'Update',
      AppPageLabelText
    );
  }
  addAppPageLabelText(AppPageLabelText: any) {
    return this.APIs.post(
      this.AppPageLabelTextControllerURL + 'Add',
      AppPageLabelText
    );
  }
  ///#endregion

  ///#region  CaseResultCategoryLookup

  getAllCaseResultCategorys() {
    return this.APIs.get(this.CaseResultCategoryControllerURL + 'GetAll');
  }
  getPageCaseResultCategorys(CaseResultCategoryFilter: any) {
    return this.APIs.create(
      this.CaseResultCategoryControllerURL + 'GetPage',
      CaseResultCategoryFilter
    );
  }
  deleteCaseResultCategory(id: number) {
    return this.APIs.delete(
      this.CaseResultCategoryControllerURL + 'Delete?id=' + id
    );
  }
  getCaseResultCategoryById(id: number) {
    return this.APIs.get(
      this.CaseResultCategoryControllerURL + 'GetById?id=' + id
    );
  }
  updateCaseResultCategory(CaseResultCategory: any) {
    return this.APIs.update(
      this.CaseResultCategoryControllerURL + 'Update',
      CaseResultCategory
    );
  }
  addCaseResultCategory(CaseResultCategory: any) {
    return this.APIs.post(
      this.CaseResultCategoryControllerURL + 'Add',
      CaseResultCategory
    );
  }
  ///#endregion

  ///#region  CityLookup
  getAllCitys() {
    return this.APIs.get(this.CityControllerURL + 'GetAll');
    if (navigator.onLine) {
      var data = this.APIs.get(this.CityControllerURL + 'GetAll');
      data.subscribe((result: any) => {
        localStorage.setItem('getAllCitys', JSON.stringify(result));
      });
      return data;
    } else {
      const data = new Observable((observer) => {
        observer.next(JSON.parse(localStorage.getItem('getAllCitys')));
        observer.complete();
      });
      return data;
    }
  }
  getPageCitys(CityFilter: any) {
    return this.APIs.create(this.CityControllerURL + 'GetPage', CityFilter);
    if (navigator.onLine) {
      var data = this.APIs.create(
        this.CityControllerURL + 'GetPage',
        CityFilter
      );

      return data;
    } else {
      const data = new Observable((observer) => {
        observer.next({
          messages: JSON.parse(localStorage.getItem('getAllCitys')).messages,
          statusCode: JSON.parse(localStorage.getItem('getAllCitys'))
            .statusCode,
          data: JSON.parse(localStorage.getItem('getAllCitys')).data.filter(
            (innerList) => innerList.governmentID === CityFilter.governmentID
          ),
        });
        observer.complete();
      });
      return data;
    }
  }
  deleteCity(id: number) {
    return this.APIs.delete(this.CityControllerURL + 'Delete?id=' + id);
  }
  getCityById(id: number) {
    return this.APIs.get(this.CityControllerURL + 'GetById?id=' + id);
  }
  updateCity(City: any) {
    return this.APIs.update(this.CityControllerURL + 'Update', City);
  }
  addCity(City: any) {
    return this.APIs.post(this.CityControllerURL + 'Add', City);
  }
  ///#endregion

  ///#region  DepartmentLookup
  getAllDepartments() {
    return this.APIs.get(this.DepartmentControllerURL + 'GetAll');
    if (navigator.onLine) {
      var data = this.APIs.get(this.DepartmentControllerURL + 'GetAll');
      data.subscribe((result: any) => {
        localStorage.setItem('getAllDepartments', JSON.stringify(result));
      });
      return data;
    } else {
      const data = new Observable((observer) => {
        observer.next(JSON.parse(localStorage.getItem('getAllDepartments')));
        observer.complete();
      });
      return data;
    }
  }
  getPageDepartments(DepartmentFilter: any) {
    let userOrganization = JSON.parse(
      localStorage.getItem('ls.authorizationData')
    ).user.organizationId;
    return this.APIs.create(
      this.DepartmentControllerURL +
        'GetPage?userOrganization=' +
        userOrganization,
      DepartmentFilter
    );
  }
  deleteDepartment(id: number) {
    return this.APIs.delete(this.DepartmentControllerURL + 'Delete?id=' + id);
  }
  getDepartmentById(id: number) {
    return this.APIs.get(this.DepartmentControllerURL + 'GetById?id=' + id);
  }
  updateDepartment(Department: any) {
    return this.APIs.update(
      this.DepartmentControllerURL + 'Update',
      Department
    );
  }
  addDepartment(Department: any) {
    return this.APIs.post(this.DepartmentControllerURL + 'Add', Department);
  }
  ///#endregion

  ///#region  DeviceCategoryLookup
  getAllDeviceCategorys() {
    return this.APIs.get(this.DeviceCategoryControllerURL + 'GetAll');
  }
  getPageDeviceCategorys(DeviceCategoryFilter: any) {
    return this.APIs.create(
      this.DeviceCategoryControllerURL + 'GetPage',
      DeviceCategoryFilter
    );
  }
  deleteDeviceCategory(id: number) {
    return this.APIs.delete(
      this.DeviceCategoryControllerURL + 'Delete?id=' + id
    );
  }
  getDeviceCategoryById(id: number) {
    return this.APIs.get(this.DeviceCategoryControllerURL + 'GetById?id=' + id);
  }
  updateDeviceCategory(DeviceCategory: any) {
    return this.APIs.update(
      this.DeviceCategoryControllerURL + 'Update',
      DeviceCategory
    );
  }
  addDeviceCategory(DeviceCategory: any) {
    return this.APIs.post(
      this.DeviceCategoryControllerURL + 'Add',
      DeviceCategory
    );
  }
  ///#endregion

  ///#region  DeviceTypeLookup
  getAllDeviceTypes() {
    return this.APIs.get(this.DeviceTypeControllerURL + 'GetAll');
  }
  getPageDeviceTypes(DeviceTypeFilter: any) {
    return this.APIs.create(
      this.DeviceTypeControllerURL + 'GetPage',
      DeviceTypeFilter
    );
  }
  deleteDeviceType(id: number) {
    return this.APIs.delete(this.DeviceTypeControllerURL + 'Delete?id=' + id);
  }
  getDeviceTypeById(id: number) {
    return this.APIs.get(this.DeviceTypeControllerURL + 'GetById?id=' + id);
  }
  updateDeviceType(DeviceType: any) {
    return this.APIs.update(
      this.DeviceTypeControllerURL + 'Update',
      DeviceType
    );
  }
  addDeviceType(DeviceType: any) {
    return this.APIs.post(this.DeviceTypeControllerURL + 'Add', DeviceType);
  }
  ///#endregion

  ///#region  DiseaseLookup
  getAllDiseases() {
    return this.APIs.get(this.DiseaseControllerURL + 'GetAll');
  }
  getPageDiseases(DiseaseFilter: any) {
    return this.APIs.create(
      this.DiseaseControllerURL + 'GetPage',
      DiseaseFilter
    );
  }
  deleteDisease(id: number) {
    return this.APIs.delete(this.DiseaseControllerURL + 'Delete?id=' + id);
  }
  getDiseaseById(id: number) {
    return this.APIs.get(this.DiseaseControllerURL + 'GetById?id=' + id);
  }
  updateDisease(Disease: any) {
    return this.APIs.update(this.DiseaseControllerURL + 'Update', Disease);
  }
  addDisease(Disease: any) {
    return this.APIs.post(this.DiseaseControllerURL + 'Add', Disease);
  }
  ///#endregion
  ///#region  DiseaseLookup
  getAllDependencys() {
    return this.APIs.get(this.DependencyURL + 'GetAll');
  }
  getPageDependencys(DependencyFilter: any) {
    return this.APIs.create(this.DependencyURL + 'GetPage', DependencyFilter);
  }
  deleteDependency(id: number) {
    return this.APIs.delete(this.DependencyURL + 'Delete?id=' + id);
  }
  getDependencyById(id: number) {
    return this.APIs.get(this.DependencyURL + 'GetById?id=' + id);
  }
  updateDependency(Dependency: any) {
    return this.APIs.update(this.DependencyURL + 'Update', Dependency);
  }
  addDependency(Dependency: any) {
    return this.APIs.post(this.DependencyURL + 'Add', Dependency);
  }
  ///#endregion

  ///#region  DiseaseCategoryLookup
  getAllDiseaseCategorys() {
    return this.APIs.get(this.DiseaseCategoryControllerURL + 'GetAll');
  }
  getPageDiseaseCategorys(DiseaseCategoryFilter: any) {
    return this.APIs.create(
      this.DiseaseCategoryControllerURL + 'GetPage',
      DiseaseCategoryFilter
    );
  }
  deleteDiseaseCategory(id: number) {
    return this.APIs.delete(
      this.DiseaseCategoryControllerURL + 'Delete?id=' + id
    );
  }
  getDiseaseCategoryById(id: number) {
    return this.APIs.get(
      this.DiseaseCategoryControllerURL + 'GetById?id=' + id
    );
  }
  updateDiseaseCategory(DiseaseCategory: any) {
    return this.APIs.update(
      this.DiseaseCategoryControllerURL + 'Update',
      DiseaseCategory
    );
  }
  addDiseaseCategory(DiseaseCategory: any) {
    return this.APIs.post(
      this.DiseaseCategoryControllerURL + 'Add',
      DiseaseCategory
    );
  }
  ///#endregion

  ///#region  DiseaseCheckLookup
  getAllDiseaseChecks() {
    return this.APIs.get(this.DiseaseCheckControllerURL + 'GetAll');
    if (navigator.onLine) {
      var data = this.APIs.get(this.DiseaseCheckControllerURL + 'GetAll');
      data.subscribe((result: any) => {
        localStorage.setItem('getAllDiseaseChecks', JSON.stringify(result));
      });
      return data;
    } else {
      const data = new Observable((observer) => {
        observer.next(JSON.parse(localStorage.getItem('getAllDiseaseChecks')));
        observer.complete();
      });
      return data;
    }
  }
  GetByPatientId(diseaseId: number) {
    return this.APIs.get(
      this.DiseaseCheckControllerURL + 'GetByPatientId?diseaseId=' + diseaseId
    );
  }
  getPageDiseaseChecks(DiseaseCheckFilter: any) {
    return this.APIs.create(
      this.DiseaseCheckControllerURL + 'GetPage',
      DiseaseCheckFilter
    );
  }
  deleteDiseaseCheck(id: number) {
    return this.APIs.delete(this.DiseaseCheckControllerURL + 'Delete?id=' + id);
  }
  getDiseaseCheckById(id: number) {
    return this.APIs.get(this.DiseaseCheckControllerURL + 'GetById?id=' + id);
  }
  updateDiseaseCheck(DiseaseCheck: any) {
    return this.APIs.update(
      this.DiseaseCheckControllerURL + 'Update',
      DiseaseCheck
    );
  }
  addDiseaseCheck(DiseaseCheck: any) {
    return this.APIs.post(this.DiseaseCheckControllerURL + 'Add', DiseaseCheck);
  }
  ///#endregion

  ///#region  DiseaseGroupLookup
  private _diseaseGroupsCache$: Observable<any>;
  getAllDiseaseGroups() {
    if (!this._diseaseGroupsCache$) {
      this._diseaseGroupsCache$ = this.APIs.get(
        this.DiseaseGroupControllerURL + 'GetAll'
      ).pipe(shareReplay(1));
    }
    return this._diseaseGroupsCache$;
    if (navigator.onLine) {
      var data = this.APIs.get(this.DiseaseGroupControllerURL + 'GetAll');
      data.subscribe((result: any) => {
        localStorage.setItem('getAllDiseaseGroups', JSON.stringify(result));
      });
      return data;
    } else {
      const data = new Observable((observer) => {
        observer.next(JSON.parse(localStorage.getItem('getAllDiseaseGroups')));
        observer.complete();
      });
      return data;
    }
  }
  getPageDiseaseGroups(DiseaseGroupFilter: any) {
    return this.APIs.create(
      this.DiseaseGroupControllerURL + 'GetPage',
      DiseaseGroupFilter
    );
  }
  deleteDiseaseGroup(id: number) {
    return this.APIs.delete(this.DiseaseGroupControllerURL + 'Delete?id=' + id);
  }
  getDiseaseGroupById(id: number) {
    return this.APIs.get(this.DiseaseGroupControllerURL + 'GetById?id=' + id);
  }
  updateDiseaseGroup(DiseaseGroup: any) {
    return this.APIs.update(
      this.DiseaseGroupControllerURL + 'Update',
      DiseaseGroup
    );
  }
  addDiseaseGroup(DiseaseGroup: any) {
    return this.APIs.post(this.DiseaseGroupControllerURL + 'Add', DiseaseGroup);
  }
  ///#endregion

  ///#region  DiseaseLabTestLookup
  getAllDiseaseLabTests() {
    return this.APIs.get(this.DiseaseLabTestControllerURL + 'GetAll');
  }
  GetDiseaseLabTestByPatientId(diseaseId: number, sampleId: number) {
    return this.APIs.get(
      this.DiseaseLabTestControllerURL +
        'GetByPatientId?diseaseId=' +
        diseaseId +
        '&diseaseCheckId=' +
        sampleId
    );
  }
  getPageDiseaseLabTests(DiseaseLabTestFilter: any) {
    return this.APIs.create(
      this.DiseaseLabTestControllerURL + 'GetPage',
      DiseaseLabTestFilter
    );
  }
  deleteDiseaseLabTest(id: number) {
    return this.APIs.delete(
      this.DiseaseLabTestControllerURL + 'Delete?id=' + id
    );
  }
  getDiseaseLabTestById(id: number) {
    return this.APIs.get(this.DiseaseLabTestControllerURL + 'GetById?id=' + id);
  }
  updateDiseaseLabTest(DiseaseLabTest: any) {
    return this.APIs.update(
      this.DiseaseLabTestControllerURL + 'Update',
      DiseaseLabTest
    );
  }
  addDiseaseLabTest(DiseaseLabTest: any) {
    return this.APIs.post(
      this.DiseaseLabTestControllerURL + 'Add',
      DiseaseLabTest
    );
  }
  ///#endregion

  ///#region  DiseaseLabTestResultLookup
  getAllDiseaseLabTestResults() {
    return this.APIs.get(this.DiseaseLabTestResultControllerURL + 'GetAll');
  }
  GetDiseaseLabTestResultByPatientId(
    diseaseId: number,
    diseaseCheckId: number,
    dieaseLabTestId: number
  ) {
    return this.APIs.get(
      this.DiseaseLabTestResultControllerURL +
        'GetByPatientId?diseaseId=' +
        diseaseId +
        '&diseaseCheckId=' +
        diseaseCheckId +
        '&dieaseLabTestId=' +
        dieaseLabTestId
    );
  }
  getPageDiseaseLabTestResults(DiseaseLabTestResultFilter: any) {
    return this.APIs.create(
      this.DiseaseLabTestResultControllerURL + 'GetPage',
      DiseaseLabTestResultFilter
    );
  }
  deleteDiseaseLabTestResult(id: number) {
    return this.APIs.delete(
      this.DiseaseLabTestResultControllerURL + 'Delete?id=' + id
    );
  }
  getDiseaseLabTestResultById(id: number) {
    return this.APIs.get(
      this.DiseaseLabTestResultControllerURL + 'GetById?id=' + id
    );
  }
  updateDiseaseLabTestResult(DiseaseLabTestResult: any) {
    return this.APIs.update(
      this.DiseaseLabTestResultControllerURL + 'Update',
      DiseaseLabTestResult
    );
  }
  addDiseaseLabTestResult(DiseaseLabTestResult: any) {
    return this.APIs.post(
      this.DiseaseLabTestResultControllerURL + 'Add',
      DiseaseLabTestResult
    );
  }
  ///#endregion

  ///#region  DiseaseRuleLookup
  getAllDiseaseRules() {
    return this.APIs.get(this.DiseaseRuleControllerURL + 'GetAll');
  }
  getPageDiseaseRules(DiseaseRuleFilter: any) {
    return this.APIs.create(
      this.DiseaseRuleControllerURL + 'GetPage',
      DiseaseRuleFilter
    );
  }
  deleteDiseaseRule(id: number) {
    return this.APIs.delete(this.DiseaseRuleControllerURL + 'Delete?id=' + id);
  }
  getDiseaseRuleById(id: number) {
    return this.APIs.get(this.DiseaseRuleControllerURL + 'GetById?id=' + id);
  }
  updateDiseaseRule(DiseaseRule: any) {
    return this.APIs.update(
      this.DiseaseRuleControllerURL + 'Update',
      DiseaseRule
    );
  }
  addDiseaseRule(DiseaseRule: any) {
    return this.APIs.post(this.DiseaseRuleControllerURL + 'Add', DiseaseRule);
  }
  ///#endregion

  //#region DiseaseClinicalSymptomLookup
  getDiseaseClinicalSymptomsByDiseaseGroupId(diseaseGroupId: number) {
    return this.APIs.get(
      this.DiseaseClinicalSymptomControllerURL +
      'GetByDiseaseGroupId?diseaseGroupId=' + diseaseGroupId
    );
  }

  saveDiseaseClinicalSymptomMappings(diseaseGroupId: number, mappings: any[]) {
    return this.APIs.post(
      this.DiseaseClinicalSymptomControllerURL +
      'SaveMappings?diseaseGroupId=' + diseaseGroupId,
      mappings || []
    );
  }
  //#endregion

  //#region ClinicalSymptomLookup
  getAllClinicalSymptoms() {
    return this.APIs.get(this.ClinicalSymptomControllerURL + 'GetAll');
  }

  getPageClinicalSymptoms(filter: any) {
    return this.APIs.create(
      this.ClinicalSymptomControllerURL + 'GetPage',
      filter
    );
  }

  getClinicalSymptomById(id: number) {
    return this.APIs.get(
      this.ClinicalSymptomControllerURL + 'GetById?id=' + id
    );
  }

  addClinicalSymptom(symptom: any) {
    return this.APIs.post(this.ClinicalSymptomControllerURL + 'Add', symptom);
  }

  updateClinicalSymptom(symptom: any) {
    return this.APIs.update(this.ClinicalSymptomControllerURL + 'Update', symptom);
  }

  deleteClinicalSymptom(id: number) {
    return this.APIs.delete(
      this.ClinicalSymptomControllerURL + 'Delete?id=' + id
    );
  }
  //#endregion

  ///#region  FinalResultLookup
  getAllFinalResults() {
    return this.APIs.get(this.FinalResultControllerURL + 'GetAll');
    if (navigator.onLine) {
      var data = this.APIs.get(this.FinalResultControllerURL + 'GetAll');
      data.subscribe((result: any) => {
        localStorage.setItem('getAllFinalResults', JSON.stringify(result));
      });
      return data;
    } else {
      const data = new Observable((observer) => {
        observer.next(JSON.parse(localStorage.getItem('getAllFinalResults')));
        observer.complete();
      });
      return data;
    }
  }
  getPageFinalResults(FinalResultFilter: any) {
    return this.APIs.create(
      this.FinalResultControllerURL + 'GetPage',
      FinalResultFilter
    );
  }
  deleteFinalResult(id: number) {
    return this.APIs.delete(this.FinalResultControllerURL + 'Delete?id=' + id);
  }
  getFinalResultById(id: number) {
    return this.APIs.get(this.FinalResultControllerURL + 'GetById?id=' + id);
  }
  updateFinalResult(FinalResult: any) {
    return this.APIs.update(
      this.FinalResultControllerURL + 'Update',
      FinalResult
    );
  }
  addFinalResult(FinalResult: any) {
    return this.APIs.post(this.FinalResultControllerURL + 'Add', FinalResult);
  }
  ///#endregion

  ///#region  HealthOfficeLookup
  getAllHealthOffices() {
    return this.APIs.get(this.HealthOfficeControllerURL + 'GetAll');
  }
  getPageHealthOffices(HealthOfficeFilter: any) {
    return this.APIs.create(
      this.HealthOfficeControllerURL + 'GetPage',
      HealthOfficeFilter
    );
  }
  deleteHealthOffice(id: number) {
    return this.APIs.delete(this.HealthOfficeControllerURL + 'Delete?id=' + id);
  }
  getHealthOfficeById(id: number) {
    return this.APIs.get(this.HealthOfficeControllerURL + 'GetById?id=' + id);
  }
  updateHealthOffice(HealthOffice: any) {
    return this.APIs.update(
      this.HealthOfficeControllerURL + 'Update',
      HealthOffice
    );
  }
  addHealthOffice(HealthOffice: any) {
    return this.APIs.post(this.HealthOfficeControllerURL + 'Add', HealthOffice);
  }
  ///#endregion

  ///#region  IncidentSourceHospitalLookup
  getAllIncidentSourceHospitals() {
    let userOrganization = JSON.parse(
      localStorage.getItem('ls.authorizationData')
    ).user.organizationId;

    return this.APIs.get(this.IncidentSourceHospitalControllerURL + 'GetAll');

    if (navigator.onLine) {
      var data = this.APIs.get(
        this.IncidentSourceHospitalControllerURL + 'GetAll'
      );
      data.subscribe((result: any) => {
        localStorage.setItem(
          'getAllIncidentSourceHospitals',
          JSON.stringify(result)
        );
      });
      return data;
    } else {
      const data = new Observable((observer) => {
        observer.next(
          JSON.parse(localStorage.getItem('getAllIncidentSourceHospitals'))
        );
        observer.complete();
      });
      return data;
    }
  }
  getIncidentSourceHospitalsByAdminID(administrationID: number) {
    return this.APIs.get(
      this.IncidentSourceHospitalControllerURL +
        'GetByAdminID?id=' +
        administrationID
    );
  }
  getIncidentSourceHospitalsByGovID(govID: number) {
    return this.APIs.get(
      this.IncidentSourceHospitalControllerURL + 'GetByGovID?id=' + govID
    );
  }
  getIncidentSourceHospitalsByOrgID(orgID: number) {
    return this.APIs.get(
      this.IncidentSourceHospitalControllerURL + 'GetByOrgID?id=' + orgID
    );
  }

  GetIncidentSourcesByGovernmentId(govID) {
    return this.APIs.get(
      this.IncidentSourceHospitalControllerURL +
        'GetIncidentSourcesByGovernmentId?governmentId=' +
        govID
    );
  }
  GetTransferedIncidentSources(healthAdminId: number) {
    return this.APIs.get(
      this.IncidentSourceHospitalControllerURL +
        'GetTransferedIncidentSources?healthAdministrationId=' +
        healthAdminId
    );
  }
  getIncidentSourceHospitalsByGovernmentsIds(IncidentSourceByGovernments: any) {
    return this.APIs.post(
      this.IncidentSourceHospitalControllerURL + 'GetIncidentSources',
      IncidentSourceByGovernments
    );
  }
  getIncidentSourceHospitalsByIncidentGovernmentsIds(
    IncidentSourceByGovernments: any
  ) {
    return this.APIs.post(
      this.IncidentSourceHospitalControllerURL + 'GetIncidentSources',
      IncidentSourceByGovernments
    );
  }
  getPageIncidentSourceHospitals(IncidentSourceHospitalFilter: any) {
    let userOrganization;

    if (
      IncidentSourceHospitalFilter.organizationID != undefined &&
      IncidentSourceHospitalFilter.organizationID
    )
      userOrganization = IncidentSourceHospitalFilter.organizationID;
    else
      userOrganization = JSON.parse(
        localStorage.getItem('ls.authorizationData')
      )?.user.organizationId;
    if (IncidentSourceHospitalFilter.organizationID != undefined)
      console.log(
        'USER DATA',
        userOrganization,
        'fitler',
        IncidentSourceHospitalFilter.organizationID
      );

    if (navigator.onLine) {
      var data = this.APIs.create(
        this.IncidentSourceHospitalControllerURL +
          'GetPage?userOrganization=' +
          userOrganization,
        IncidentSourceHospitalFilter
      );

      return data;
    } else {
      const data = new Observable((observer) => {
        observer.next({
          messages: JSON.parse(
            localStorage.getItem('getAllIncidentSourceHospitals')
          ).messages,
          statusCode: JSON.parse(
            localStorage.getItem('getAllIncidentSourceHospitals')
          ).statusCode,
          data: JSON.parse(
            localStorage.getItem('getAllIncidentSourceHospitals')
          ).data.filter(
            (innerList) =>
              innerList.healthAdministrationID ===
                IncidentSourceHospitalFilter.healthAdministrationID &&
              (innerList.reportingOrResidence == 0 ||
                innerList.reportingOrResidence ===
                  IncidentSourceHospitalFilter.reportingOrResidence)
          ),
        });
        observer.complete();
      });
      return data;
    }
  }

  getPageIncidentSourceHospitalsTable(IncidentSourceHospitalFilter:any) {
    return this.APIs.create(
        this.IncidentSourceHospitalControllerURL +
          'GetIncidentSourcePage' ,
        IncidentSourceHospitalFilter
      );
  }

  public incidentsForOrg: number[];

  getFilteredSourceHospitals(
    chatFilter: ChatFilter
  ): Observable<Result<IncidentSourceHospitalDTO[]>> {
    return this.APIs.create(
      this.IncidentSourceHospitalControllerURL + 'GetFilteredSources',
      chatFilter
    );
  }
  deleteIncidentSourceHospital(id: number) {
    return this.APIs.delete(
      this.IncidentSourceHospitalControllerURL + 'Delete?id=' + id
    );
  }
  getIncidentSourceHospitalById(id: number) {
    return this.APIs.get(
      this.IncidentSourceHospitalControllerURL + 'GetById?id=' + id
    );
  }
  updateIncidentSourceHospital(IncidentSourceHospital: any) {
    return this.APIs.update(
      this.IncidentSourceHospitalControllerURL + 'Update',
      IncidentSourceHospital
    );
  }
  addIncidentSourceHospital(IncidentSourceHospital: any) {
    return this.APIs.post(
      this.IncidentSourceHospitalControllerURL + 'Add',
      IncidentSourceHospital
    );
  }
  ///#endregion

  ///#region  IncidentSourceHospitalTypeLookup
  getAllIncidentSourceHospitalTypes() {
    return this.APIs.get(
      this.IncidentSourceHospitalTypeControllerURL + 'GetAll'
    );
  }
  getPageIncidentSourceHospitalTypes(
    IncidentSourceHospitalTypeFilter: any,
    considerUserOrg: boolean = true
  ) {
    const USER_DATA = JSON.parse(localStorage.getItem('ls.authorizationData'));
    return this.APIs.create(
      this.IncidentSourceHospitalTypeControllerURL +
        `GetPage${
          considerUserOrg
            ? '?userOrganization=' + USER_DATA.user.organizationId
            : ''
        }`,
      IncidentSourceHospitalTypeFilter
    );
  }
  deleteIncidentSourceHospitalType(id: number) {
    return this.APIs.delete(
      this.IncidentSourceHospitalTypeControllerURL + 'Delete?id=' + id
    );
  }
  getIncidentSourceHospitalTypeById(id: number) {
    return this.APIs.get(
      this.IncidentSourceHospitalTypeControllerURL + 'GetById?id=' + id
    );
  }
  updateIncidentSourceHospitalType(IncidentSourceHospitalType: any) {
    return this.APIs.update(
      this.IncidentSourceHospitalTypeControllerURL + 'Update',
      IncidentSourceHospitalType
    );
  }
  addIncidentSourceHospitalType(IncidentSourceHospitalType: any) {
    return this.APIs.post(
      this.IncidentSourceHospitalTypeControllerURL + 'Add',
      IncidentSourceHospitalType
    );
  }
  ///#endregion

  ///#region  LabPlaceLookup
  getAllLabPlaces() {
    return this.APIs.get(this.LabPlaceControllerURL + 'GetAll');
  }
  getPageLabPlaces(LabPlaceFilter: any) {
    return this.APIs.create(
      this.LabPlaceControllerURL + 'GetPage',
      LabPlaceFilter
    );
  }
  deleteLabPlace(id: number) {
    return this.APIs.delete(this.LabPlaceControllerURL + 'Delete?id=' + id);
  }
  getLabPlaceById(id: number) {
    return this.APIs.get(this.LabPlaceControllerURL + 'GetById?id=' + id);
  }
  updateLabPlace(LabPlace: any) {
    return this.APIs.update(this.LabPlaceControllerURL + 'Update', LabPlace);
  }
  addLabPlace(LabPlace: any) {
    return this.APIs.post(this.LabPlaceControllerURL + 'Add', LabPlace);
  }
  ///#endregion

  ///#region  NationalityLookup
  getAllNationalitys() {
    return this.APIs.get(this.NationalityControllerURL + 'GetAll');
    if (navigator.onLine) {
      var data = this.APIs.get(this.NationalityControllerURL + 'GetAll');
      data.subscribe((result: any) => {
        localStorage.setItem('getAllNationalitys', JSON.stringify(result));
      });
      return data;
    } else {
      const data = new Observable((observer) => {
        observer.next(JSON.parse(localStorage.getItem('getAllNationalitys')));
        observer.complete();
      });
      return data;
    }
  }
  getPageNationalitys(NationalityFilter: any) {
    return this.APIs.create(
      this.NationalityControllerURL + 'GetPage',
      NationalityFilter
    );
  }
  deleteNationality(id: number) {
    return this.APIs.delete(this.NationalityControllerURL + 'Delete?id=' + id);
  }
  getNationalityById(id: number) {
    return this.APIs.get(this.NationalityControllerURL + 'GetById?id=' + id);
  }
  updateNationality(Nationality: any) {
    return this.APIs.update(
      this.NationalityControllerURL + 'Update',
      Nationality
    );
  }
  addNationality(Nationality: any) {
    return this.APIs.post(this.NationalityControllerURL + 'Add', Nationality);
  }
  ///#endregion

  ///#region  PatientJobCategoryLookup
  getAllPatientJobCategorys() {
    return this.APIs.get(this.PatientJobCategoryControllerURL + 'GetAll');
    if (navigator.onLine) {
      var data = this.APIs.get(this.PatientJobCategoryControllerURL + 'GetAll');
      data.subscribe((result: any) => {
        localStorage.setItem(
          'getAllPatientJobCategorys',
          JSON.stringify(result)
        );
      });
      return data;
    } else {
      const data = new Observable((observer) => {
        observer.next(
          JSON.parse(localStorage.getItem('getAllPatientJobCategorys'))
        );
        observer.complete();
      });
      return data;
    }
  }
  getPagePatientJobCategorys(PatientJobCategoryFilter: any) {
    return this.APIs.create(
      this.PatientJobCategoryControllerURL + 'GetPage',
      PatientJobCategoryFilter
    );
  }
  deletePatientJobCategory(id: number) {
    return this.APIs.delete(
      this.PatientJobCategoryControllerURL + 'Delete?id=' + id
    );
  }
  getPatientJobCategoryById(id: number) {
    return this.APIs.get(
      this.PatientJobCategoryControllerURL + 'GetById?id=' + id
    );
  }
  updatePatientJobCategory(PatientJobCategory: any) {
    return this.APIs.update(
      this.PatientJobCategoryControllerURL + 'Update',
      PatientJobCategory
    );
  }
  addPatientJobCategory(PatientJobCategory: any) {
    return this.APIs.post(
      this.PatientJobCategoryControllerURL + 'Add',
      PatientJobCategory
    );
  }
  ///#endregion

  ///#region  PatientJobLookup
  getAllPatientJobs() {
    return this.APIs.get(this.PatientJobControllerURL + 'GetAll');
    if (navigator.onLine) {
      var data = this.APIs.get(this.PatientJobControllerURL + 'GetAll');
      data.subscribe((result: any) => {
        localStorage.setItem('getAllPatientJobs', JSON.stringify(result));
      });
      return data;
    } else {
      const data = new Observable((observer) => {
        observer.next(JSON.parse(localStorage.getItem('getAllPatientJobs')));
        observer.complete();
      });
      return data;
    }
  }
  getPagePatientJobs(PatientJobFilter: any) {
    return this.APIs.create(
      this.PatientJobControllerURL + 'GetPage',
      PatientJobFilter
    );
    if (navigator.onLine) {
      var data = this.APIs.create(
        this.PatientJobControllerURL + 'GetPage',
        PatientJobFilter
      );
      return data;
    } else {
      const data = new Observable((observer) => {
        observer.next({
          messages: JSON.parse(localStorage.getItem('getAllPatientJobs'))
            .messages,
          statusCode: JSON.parse(localStorage.getItem('getAllPatientJobs'))
            .statusCode,
          data: JSON.parse(
            localStorage.getItem('getAllPatientJobs')
          ).data.filter(
            (innerList) =>
              innerList.patientJobCategoryID ===
              PatientJobFilter.patientJobCategoryID
          ),
        });
        observer.complete();
      });
      return data;
    }
  }
  GetEpidemiologicalThresholds(epidmiologicalForm: any) {
    return this.APIs.create(
      this.PatientJobControllerURL + 'GetEpidemiologicalThresholds',
      epidmiologicalForm
    );
  }
  deletePatientJob(id: number) {
    return this.APIs.delete(this.PatientJobControllerURL + 'Delete?id=' + id);
  }
  getPatientJobById(id: number) {
    return this.APIs.get(this.PatientJobControllerURL + 'GetById?id=' + id);
  }
  updatePatientJob(PatientJob: any) {
    return this.APIs.update(
      this.PatientJobControllerURL + 'Update',
      PatientJob
    );
  }
  addPatientJob(PatientJob: any) {
    return this.APIs.post(this.PatientJobControllerURL + 'Add', PatientJob);
  }
  ///#endregion

  ///#region  PositionLookup
  getAllPositions() {
    return this.APIs.get(this.PositionControllerURL + 'GetAll');
  }
  getPagePositions(PositionFilter: any) {
    return this.APIs.create(
      this.PositionControllerURL + 'GetPage',
      PositionFilter
    );
  }
  deletePosition(id: number) {
    return this.APIs.delete(this.PositionControllerURL + 'Delete?id=' + id);
  }
  getPositionById(id: number) {
    return this.APIs.get(this.PositionControllerURL + 'GetById?id=' + id);
  }
  updatePosition(Position: any) {
    return this.APIs.update(this.PositionControllerURL + 'Update', Position);
  }
  addPosition(Position: any) {
    return this.APIs.post(this.PositionControllerURL + 'Add', Position);
  }
  ///#endregion

  ///#region  PrincipalityLookup
  getAllPrincipalitys() {
    return this.APIs.get(this.PrincipalityControllerURL + 'GetAll');
    if (navigator.onLine) {
      var data = this.APIs.get(this.PrincipalityControllerURL + 'GetAll');
      data.subscribe((result: any) => {
        localStorage.setItem('getAllPrincipalitys', JSON.stringify(result));
      });
      return data;
    } else {
      const data = new Observable((observer) => {
        observer.next(JSON.parse(localStorage.getItem('getAllPrincipalitys')));
        observer.complete();
      });
      return data;
    }
  }
  getPagePrincipalitys(PrincipalityFilter: any) {
    return this.APIs.create(
      this.PrincipalityControllerURL + 'GetPage',
      PrincipalityFilter
    );
    if (navigator.onLine) {
      var data = this.APIs.create(
        this.PrincipalityControllerURL + 'GetPage',
        PrincipalityFilter
      );
      return data;
    } else {
      const data = new Observable((observer) => {
        observer.next({
          messages: JSON.parse(localStorage.getItem('getAllPrincipalitys'))
            .messages,
          statusCode: JSON.parse(localStorage.getItem('getAllPrincipalitys'))
            .statusCode,
          data: JSON.parse(
            localStorage.getItem('getAllPrincipalitys')
          ).data.filter(
            (innerList) => innerList.cityID === PrincipalityFilter.cityID
          ),
        });
        observer.complete();
      });
      return data;
    }
  }
  deletePrincipality(id: number) {
    return this.APIs.delete(this.PrincipalityControllerURL + 'Delete?id=' + id);
  }
  getPrincipalityById(id: number) {
    return this.APIs.get(this.PrincipalityControllerURL + 'GetById?id=' + id);
  }
  updatePrincipality(Principality: any) {
    return this.APIs.update(
      this.PrincipalityControllerURL + 'Update',
      Principality
    );
  }
  addPrincipality(Principality: any) {
    return this.APIs.post(this.PrincipalityControllerURL + 'Add', Principality);
  }
  ///#endregion

  ///#region  UnitResponsibilityLevelLookup
  getAllUnitResponsibilityLevels() {
    return this.APIs.get(this.UnitResponsibilityLevelControllerURL + 'GetAll');
  }
  getPageUnitResponsibilityLevels(UnitResponsibilityLevelFilter: any) {
    return this.APIs.create(
      this.UnitResponsibilityLevelControllerURL + 'GetPage',
      UnitResponsibilityLevelFilter
    );
  }
  deleteUnitResponsibilityLevel(id: number) {
    return this.APIs.delete(
      this.UnitResponsibilityLevelControllerURL + 'Delete?id=' + id
    );
  }
  getUnitResponsibilityLevelById(id: number) {
    return this.APIs.get(
      this.UnitResponsibilityLevelControllerURL + 'GetById?id=' + id
    );
  }
  updateUnitResponsibilityLevel(UnitResponsibilityLevel: any) {
    return this.APIs.update(
      this.UnitResponsibilityLevelControllerURL + 'Update',
      UnitResponsibilityLevel
    );
  }
  addUnitResponsibilityLevel(UnitResponsibilityLevel: any) {
    return this.APIs.post(
      this.UnitResponsibilityLevelControllerURL + 'Add',
      UnitResponsibilityLevel
    );
  }
  ///#endregion

  ///#region  UserGroupLookup
  getAllUserGroups() {
    return this.APIs.get(this.UserGroupControllerURL + 'GetAll');
  }
  getPageUserGroups(UserGroupFilter: any) {
    return this.APIs.create(
      this.UserGroupControllerURL + 'GetPage',
      UserGroupFilter
    );
  }
  deleteUserGroup(id: number) {
    return this.APIs.delete(this.UserGroupControllerURL + 'Delete?id=' + id);
  }
  getUserGroupById(id: number) {
    return this.APIs.get(this.UserGroupControllerURL + 'GetById?id=' + id);
  }
  updateUserGroup(UserGroup: any) {
    return this.APIs.update(this.UserGroupControllerURL + 'Update', UserGroup);
  }
  addUserGroup(UserGroup: any) {
    return this.APIs.post(this.UserGroupControllerURL + 'Add', UserGroup);
  }
  ///#endregion
  ///#region  organizationookup
  getAllOrganizations() {
    return this.APIs.get(this.OrganizationURL + 'GetAll');
  }

  getOrganizationAccessibleParts(organizationId: number) {
    return this.APIs.get(
      this.OrganizationURL +
        'GetOrganizationAccessibleParts?organziationId=' +
        organizationId
    );
  }

  getAllLevels(organizationId: any) {
    return this.APIs.get(
      this.LevelURL + 'GetAll?organizationId=' + organizationId
    );
  }
  getAllBranches(organizationId: any) {
    return this.APIs.get(
      this.BranchURL + 'GetAll?organizationId=' + organizationId
    );
  }
  getAllBranchesForUsers(organizationId: any, forSystemUser: boolean) {
    return this.APIs.get(
      this.BranchURL +
        `GetAll?organizationId=${organizationId}&forSystemUser=${true}`
    );
  }
  getAllAreas(branchId: any) {
    return this.APIs.get(this.AreaURL + 'GetAll?branchId=' + branchId);
  }

  getAreasByBranches(branchId: any) {
    return this.APIs.post(this.AreaURL + 'GetAreasBranchsIds', branchId);
  }

  getAreasByBranchFilter(areaFilter: any) {
    return this.APIs.post(this.AreaURL + 'GetAreasByBranchsIds', areaFilter);
  }

  getPageOrganizations(OrganizationFilter: any) {
    return this.APIs.create(
      this.OrganizationURL + 'GetPage',
      OrganizationFilter
    );
  }
  deleteOrganization(id: number) {
    return this.APIs.delete(this.OrganizationURL + 'Delete?id=' + id);
  }
  getOrganizationById(id: number) {
    return this.APIs.get(this.OrganizationURL + 'GetById?id=' + id);
  }
  updateOrganization(UserGroup: any) {
    return this.APIs.update(this.OrganizationURL + 'Update', UserGroup);
  }
  addOrganization(UserGroup: any) {
    return this.APIs.post(this.OrganizationURL + 'Add', UserGroup);
  }
  ///#endregion

  ///#region  HealthAdministrationLookup
  getAllHealthAdministrations() {
    return this.APIs.get(this.HealthAdministrationControllerURL + 'GetAll');
    if (navigator.onLine) {
      var data = this.APIs.get(
        this.HealthAdministrationControllerURL + 'GetAll'
      );
      data.subscribe((result: any) => {
        localStorage.setItem(
          'getAllHealthAdministrations',
          JSON.stringify(result)
        );
      });
      return data;
    } else {
      const data = new Observable((observer) => {
        observer.next(
          JSON.parse(localStorage.getItem('getAllHealthAdministrations'))
        );
        observer.complete();
      });
      return data;
    }
  }
  getAllHealthAdministrationsByGovernment() {
    return this.APIs.get(this.HealthAdministrationControllerURL + 'GetAll');
  }
  getHealthAdministrationsByGovernmentsIds(
    HealthAdministrationByGovernments: any
  ) {
    return this.APIs.post(
      this.HealthAdministrationControllerURL +
        'GetHealthAdministrationsByGovernmentsIds',
      HealthAdministrationByGovernments
    );
  }
  getHealthAdministrationsIncidentByGovernmentsIds(
    HealthAdministrationByGovernments: any
  ) {
    return this.APIs.post(
      this.HealthAdministrationControllerURL +
        'GetHealthAdministrationsFilteredByGovernmentsIds',
      HealthAdministrationByGovernments
    );
  }
  getPageHealthAdministrations(HealthAdministrationFilter: any) {
    return this.APIs.create(
      this.HealthAdministrationControllerURL + 'GetPage',
      HealthAdministrationFilter
    );
    if (navigator.onLine) {
      var data = this.APIs.create(
        this.HealthAdministrationControllerURL + 'GetPage',
        HealthAdministrationFilter
      );
      return data;
    } else {
      const data = new Observable((observer) => {
        observer.next({
          messages: JSON.parse(
            localStorage.getItem('getAllHealthAdministrations')
          ).messages,
          statusCode: JSON.parse(
            localStorage.getItem('getAllHealthAdministrations')
          ).statusCode,
          data: JSON.parse(
            localStorage.getItem('getAllHealthAdministrations')
          ).data.filter(
            (innerList) =>
              innerList.governmentID === HealthAdministrationFilter.governmentID
          ),
        });
        observer.complete();
      });
      return data;
    }
  }
  getPageHealthAdministrationsForUsers(HealthAdministrationFilter: any) {
    return this.APIs.create(
      this.HealthAdministrationControllerURL + 'GetPage',
      HealthAdministrationFilter
    );
    if (navigator.onLine) {
      var data = this.APIs.create(
        this.HealthAdministrationControllerURL + 'GetPage',
        HealthAdministrationFilter
      );
      return data;
    } else {
      const data = new Observable((observer) => {
        observer.next({
          messages: JSON.parse(
            localStorage.getItem('getAllHealthAdministrations')
          ).messages,
          statusCode: JSON.parse(
            localStorage.getItem('getAllHealthAdministrations')
          ).statusCode,
          data: JSON.parse(
            localStorage.getItem('getAllHealthAdministrations')
          ).data.filter(
            (innerList) =>
              innerList.governmentID === HealthAdministrationFilter.governmentID
          ),
        });
        observer.complete();
      });
      return data;
    }
  }
  deleteHealthAdministration(id: number) {
    return this.APIs.delete(
      this.HealthAdministrationControllerURL + 'Delete?id=' + id
    );
  }
  getHealthAdministrationById(id: number) {
    return this.APIs.get(
      this.HealthAdministrationControllerURL + 'GetById?id=' + id
    );
  }
  updateHealthAdministration(HealthAdministration: any) {
    return this.APIs.update(
      this.HealthAdministrationControllerURL + 'Update',
      HealthAdministration
    );
  }
  addHealthAdministration(HealthAdministration: any) {
    return this.APIs.post(
      this.HealthAdministrationControllerURL + 'Add',
      HealthAdministration
    );
  }

  GetRoles() {
    return this.APIs.get(this.RoleApiController + 'GetAll');
  }

  GetRolesReport(filter: any) {
    return this.APIs.post(this.ReportApiController + 'GetRolesReport', filter);
  }

  GetDiseasesReport(filter: any) {
    return this.APIs.post(
      this.ReportApiController + 'GetDiseasesReport',
      filter
    );
  }
  GetPatientReport(filter: any) {
    return this.APIs.post(
      this.ReportApiController + 'GetPatientsReport',
      filter
    );
  }
  GetZeroReport(filter: any) {
    return this.APIs.post(
      this.ReportApiController + 'GetZeroNotificationsReport',
      filter
    );
  }
  GetImmediateReport(filter: any) {
    return this.APIs.post(
      this.ReportApiController + 'GetInstantNotificationsReport',
      filter
    );
  }
  GetNotInferringReport(filter: any) {
    return this.APIs.post(
      this.ReportApiController + 'GetNotInferringReport',
      filter
    );
  }
  GetMonitorUnitsPeparationsReport(filter: any) {
    return this.APIs.post(
      this.ReportApiController + 'GetMonitorUnitsPeparationsReport',
      filter
    );
  }
  GetEpidemiologicalThresholdsReport(filter: any) {
    return this.APIs.post(
      this.ReportApiController + 'GetEpidemiologicalThresholdsReport',
      filter
    );
  }
  ExportDiseasesReportToExcel(filter: any) {
    return this.APIs.post(
      this.ReportApiController + 'ExportDiseasesReportToExcel',
      filter
    );
  }
  ExportPatientReportToExcel(filter: any) {
    return this.APIs.post(
      this.ReportApiController + 'ExportPatientsReportToExcel',
      filter
    );
  }

  ///#endregion

  //region of Epidemiological
  getUsersMainData(systemUserMainDataFilter: SystemUserMainDataFilter) {
    return this.APIs.create(
      this.AccountApiUrl + 'GetUsersMainData',
      systemUserMainDataFilter
    );
  }
  //end region

  //region of get from date above cards
  getFromDateAboveCards() {
    return this.APIs.get(this.appSettingsApiUrl + 'Get/2');
  }
  //end region
  //region of get from date above cards
  getToDateAboveCards() {
    return this.APIs.get(this.appSettingsApiUrl + 'Get/3');
  }

  getAllAppSettings() {
    return this.APIs.get(this.appSettingsApiUrl + 'GetAll');
  }

  updateDatesForCards(periodEntity:any) {
    return this.APIs.create(this.appSettingsApiUrl + 'SetCardsPeriod', periodEntity);
  }
  //end region
}
