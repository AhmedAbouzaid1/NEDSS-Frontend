import { ZeroInstantNotificationService } from './../zero-notificaton/Services/zero-instant-notification.service';
import {
  Component,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import { GeneralDataService } from '../general-data/services/general-data.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { TranslateService } from '@ngx-translate/core';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { NotInferringService } from 'src/app/features/home/not-inferring/Services/not-inferring.service';
import * as c3 from 'c3';
import { GeneralDataCompletionServiceService } from 'src/app/features/home/general-data-completion/services/general-data-completion-service.service';
import { LabService } from 'src/app/features/lab/services/lab.service';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import * as $ from 'jquery';
import {
  CHARTS,
  DASHBOARDCaRDS,
  MultipleDropdownSettings,
  SingleDropdownSettings,
  WEAKS,
  YEARS,
} from 'src/app/core/constants';
import { DatePipe } from '@angular/common';
import { ExportService } from 'src/app/core/services/export.service';
import * as Highcharts from 'highcharts';
import { CardsPeriodDto } from '../dashboard/models/cardsPeriodDto';
import { CardsPeriodTypeEnum } from 'src/app/enums/CardsPeriodTypeEnum';
import { CardsPeriodDurationUnitEnum } from 'src/app/enums/CardsPeriodDurationUnitEnum';
declare const bootstrap: any;
@Component({
  selector: 'app-charts-dashboard',
  templateUrl: './charts-dashboard.component.html',
  styleUrls: ['./charts-dashboard.component.css'],
})
export class ChartsDashboardComponent {
  // @ViewChild('chartId', { static: false }) chartToPrint: ElementRef;
  // exportPdf() {
  //   this.exportService.exportTableAsPdf(this.chartToPrint, 'export chart')
  // }
  maxDate = new Date();
  minDate = new Date(1900, 0, 1);
  Highcharts: typeof Highcharts = Highcharts;
  barChartOptions: Highcharts.Options = {};
  ageBarChartOptions: Highcharts.Options = {};
  FinalDiagnosticsBarChartOptions: Highcharts.Options = {};
  genderBarChartOptions: Highcharts.Options = {};
  diagnosticsBarChartOptions: Highcharts.Options = {};
  resultDiagnosticsBarChartOptions: Highcharts.Options = {};
  resultBarChartOptions: Highcharts.Options = {};
  yearsBarChartOptions: Highcharts.Options = {};
  governmentsBarChartOptions: Highcharts.Options = {};
  ratesBarChartOptions: Highcharts.Options = {};
  casesBarChartOptions: Highcharts.Options = {};
  InfectedCasesRatesOptions: Highcharts.Options = {};
  InfectedCasesCountsOptions: Highcharts.Options = {};
  YearsVersusGovernoratesOptions: Highcharts.Options = {};
  ReportingTimingsOptions: Highcharts.Options = {};
  DistributedOverYearsOptions: Highcharts.Options = {};
  InfectedYearsVersusGovernoratesOptions: Highcharts.Options = {};
  InfectedDistributedOverYearsOptions: Highcharts.Options = {};
  DistributionOfDeathsByGenderOptions: Highcharts.Options = {};
  DistributionOfDeathsByCaseDiagnosisOptions: Highcharts.Options = {};
  DistributionOfDeathsByAgeRangeOptions: Highcharts.Options = {};
  InvestigationsTimingsOptions: Highcharts.Options = {};
  currentLang: string;
  dir: string;
  delay: boolean = false;
  timer: any;
  updateFlag: boolean = true;
  governments: any;
  selectedGovernment: any[] = [];
  loadingPanel: boolean;
  diseases: any;
  diseasesGroups: any;
  jobs: any;
  selectedInfectedgovernment: any;
  selectedInfectedDiseaseGroups: any;
  selectedInfectedDiseases: any;
  selectedInfectedCategories: any;
  selectedInfectedDepartments: any;
  fromInfectedDate: string | number | Date;
  toInfectedDate: string | number | Date;
  years = YEARS;
  weaks = WEAKS;
  selectedYear: any = -1;
  selectedTarasodType: number = 1;
  selectedWeaks: any[] = [];
  resultType: number = 3;
  Jobsids: any[] = [];
  AllFinalResults: any;
  selectedJobs: any[] = [];
  selectedDiseases: any;
  selectedDiseaseGroups: any;
  selectedCategories: any;
  selectedIncidentSource: any;
  selectedDepartments: any;
  healthAdministration: any;
  selectedHealthAdministration: any;
  incidentSources!: any[];
  myDiseasDepartmentData: any[] = [];
  selectedDepartment: any[] = [];
  departments: any;
  Desiesids: string = '';
  IncidentSourceids: string = '';
  levelId: any;
  Dpartmentids: string = '';
  lessThan1: [string, ...c3.PrimitiveArray] = ['اقل_من_1'];
  upTo5: [string, ...c3.PrimitiveArray] = ['من_1_الي_5'];
  upTo15: [string, ...c3.PrimitiveArray] = ['1من_5_الي_5'];
  upTo35: [string, ...c3.PrimitiveArray] = ['3من_15_الي_5'];
  upTo65: [string, ...c3.PrimitiveArray] = ['6من_35_الي_5'];
  filterdData: any[] = [];
  reportType = 0;
  type: number = 1;
  selectedCaseCategory: any[] = [];
  yearsToDraw: string[] = [];
  ids: string = '';
  selectedyears;
  isModifingView = true;
  isLoadingChart = false;

  chart1: c3.ChartAPI;
  chart2: c3.ChartAPI;
  charts3: c3.ChartAPI;
  chart4: c3.ChartAPI;
  chart5: c3.ChartAPI;
  chart6: c3.ChartAPI;
  charts7: c3.ChartAPI;
  chart8: c3.ChartAPI;
  chart9: c3.ChartAPI;
  chart10: c3.ChartAPI;
  charts11: c3.ChartAPI;
  chart12: c3.ChartAPI;
  chart13: c3.ChartAPI;
  chart14: c3.ChartAPI;
  charts15: c3.ChartAPI;
  chart16: c3.ChartAPI;

  startSelectedyears: number = -1;
  endSelectedyears: number = -1;
  StartselectedDiseases: any[] = [];
  EndselectedDiseases: any[] = [];
  date;
  Diseaseids: string = '';
  CaseCategryids: any = '';
  chartFilter: {};
  diseaseIds: any[] = [];

  sureCalculatedData: [string, ...c3.PrimitiveArray] = ['مؤكد'];
  unsureCalculatedData: [string, ...c3.PrimitiveArray] = ['محتمل'];
  injuryDate: [string, ...c3.PrimitiveArray] = ['معدل_الاصابة'];
  calculatedDataGov: [string, ...c3.PrimitiveArray] = ['المبلغة'];
  calculatedData: [string, ...c3.PrimitiveArray] = ['معدل_ابلاغ_الامراض'];
  calculatedData2: [string, ...c3.PrimitiveArray] = ['معدل_الاصابة'];
  totalPatients: any = 0;
  totalPepulation: any = 0;
  governmentIds: string = '';
  selectedReportMethod: any = 0;
  startDate: any = '';
  endDate: any = '';

  fromDate: string | number | Date;
  toDate: string | number | Date;
  max: number;
  currentCart: number = 0;
  DropDownOptin: any;
  deg = 180;
  yearsToDraw2: any[];
  chartFilter2: {
    disease_Id: number;
    reportingRate: number;
    startYear: any;
    startDate: any;
    endYear: any;
    endDate: any;
  };
  showDialog: boolean = false;
  calculatedDataGov3: [string, ...c3.PrimitiveArray] = ['المبلغة'];
  CalculatedData: [string, ...c3.PrimitiveArray] = ['عدد_الحالات'];
  yearsToDraw3: any[];
  chartFilter3: { diseaseID: number; Years: any; homeGovernmentID: any };
  ChartData: [string, ...c3.PrimitiveArray][] = [
    ['1'],
    ['2'],
    ['3'],
    ['4'],
    ['5'],
    ['6'],
    ['7'],
    ['8'],
    ['9'],
    ['10'],
  ];
  yearsToDraw4: any[];
  Categories: any;
  selectedFinalResults: any[] = [];
  AllData: any;
  userType: any;
  chart: string = 'firechart';
  myData: any;
  Diseaseids2: any[];
  FinalResultsids: any = [];
  CalculatedData1: [string, ...c3.PrimitiveArray] = [
    'معدل_الوفيات_للعام_الماضي',
  ];
  myDatalength: any;
  lastIndex: number;
  weakids: any;
  currentCart2: c3.ChartAPI;

  //////////////////////////////// New  By Hatem  /////////////////////////////////////
  onlineUsers: any;
  onlineUsersCardItems: any;
  headers: any;
  onlineUsersCount: any;
  selectedgovernment: any;
  patients: any;
  incompletePatients: any;
  silentSources: any;
  signutares: any;
  completeData: any;
  nonInferentialPatients: any;
  patientChecks: any;
  patientVersusAge: any;
  PatientsVersusFinalDiagnostics: any;
  PatientsVersusGender: any;
  PatientsVersusGenderArr: any = [];
  DiagnosticsXLabel: any;
  DiagnosticsYValue: any;
  PatientsVersusInitialDiagnostics: any;
  PatientsVersusPatientsResultDiagnostics: any;
  ratesVersusGovernorates: any;
  ratesVersusGovernoratesData: any;
  InfectedCasesRatesVersusGovernorates: any;
  InfectedCasesRatesVersusGovernoratesData: any;
  InfectedCasesCountsVersusGovernorates: any;
  InfectedCasesCountsVersusGovernoratesData: any;
  ratesTitle: any;
  caseTitle: any;
  YearsVersusGovernoratesTitle: any;
  InfectedYearsVersusGovernoratesTitle: any;
  InfectedCasesRatesTitle: any;
  InfectedCasesCountsTitle: any;
  DistributedOverYearsTitle: any;
  InfectedDistributedOverYearsTitle: any;
  CasesCountsVersusEpidemic: any;
  CasesCountsVersusEpidemicData: any;
  CasesRatesOverYearsVersusGovernorates: any;
  InfectedCasesRatesOverYearsVersusGovernorates: any;
  CasesRatesOverYearsVersusGovernoratesData: any;
  InfectedCasesRatesOverYearsVersusGovernoratesData: any;
  DistributedOverYears: any;
  InfectedDistributedOverYears: any;
  DistributedOverYearsData: any;
  InfectedDistributedOverYearsData: any;
  RatesOverYearsVersusGovernoratesStackedItems: any;
  InfectedRatesOverYearsVersusGovernoratesStackedItems: any;
  DistributedOverYearsStackedItems: any;
  InfectedDistributedOverYearsStackedItems: any;
  InitialDiagnosticsXLabel: any;
  InitialDiagnosticsYValue: any;
  ResultDiagnosticsXLabel: any;
  ResultDiagnosticsYValue: any;
  InfectedCasesRatesXLabel: any;
  InfectedCasesRatesYValue: any;
  InfectedCasesCountsXLabel: any;
  InfectedCasesCountsYValue: any;
  YearsVersusGovernoratesXLabel: any;
  YearsVersusGovernoratesYValue: any;
  InfectedYearsVersusGovernoratesXLabel: any;
  InfectedYearsVersusGovernoratesYValue: any;
  PatientsVersusResult: any;
  ResultXLabel: any;
  ResultYValue: any;
  PatientsVersusYears: any;
  YearsXLabel: any;
  YearsYValue: any;
  PatientsVersusGovernments: any;
  GovernmentsXLabel: any;
  GovernmentsYValue: any;
  RatesXLabel: any;
  RatesYValue: any;
  CasesXLabel: any;
  CasesYValue: any;
  DistributedOverYearsXLabel: any;
  DistributedOverYearsYValue: any;
  InfectedDistributedOverYearsXLabel: any;
  InfectedDistributedOverYearsYValue: any;
  seriesData: any;
  DistributedOverYearSseriesData: any;
  InfectedDistributedOverYearSseriesData: any;
  InfectedSeriesData: any;
  DistributionOfDeathsByGenderData: any;
  DistributionOfDeathsByGender: any;
  DistributionOfDeathsByGenderTitle: any;
  DistributionOfDeathsByGenderXLabel: any;
  DistributionOfDeathsByGenderYValue: any;
  DistributionOfDeathsByGenderSeries: any;
  DistributionOfDeathsByCaseDiagnosisData: any;
  DistributionOfDeathsByCaseDiagnosis: any;
  DistributionOfDeathsByCaseDiagnosisTitle: any;
  DistributionOfDeathsByCaseDiagnosisXLabel: any;
  DistributionOfDeathsByCaseDiagnosisYValue: any;
  DistributionOfDeathsByCaseDiagnosisSeries: any;
  DistributionOfDeathsByAgeRangeData: any;
  DistributionOfDeathsByAgeRange: any;
  DistributionOfDeathsByAgeRangeTitle: any;
  DistributionOfDeathsByAgeRangeXLabel: any;
  DistributionOfDeathsByAgeRangeYValue: any;
  DistributionOfDeathsByAgeRangeSeries: any;
  CaseFatalityRate: any;
  ReportingTimingsData: any;
  ReportingTimings: any;
  ReportingTimingsTitle: any;
  ReportingTimingsStackedItems: any;
  ReportingTimingsXLabel: any;
  ReportingTimingsYValue: any;
  ReportingTimingsSeriesData: any;
  InvestigationsTimingsData: any;
  InvestigationsTimings: any;
  InvestigationsTimingsTitle: any;
  InvestigationsTimingsStackedItems: any;
  InvestigationsTimingsXLabel: any;
  InvestigationsTimingsYValue: any;
  InvestigationsTimingsSeriesData: any;
  CardsPeriodDto: CardsPeriodDto = {} as CardsPeriodDto;
  CardsPeriodTypeEnum = CardsPeriodTypeEnum;
  CardsPeriodDurationUnitEnum = CardsPeriodDurationUnitEnum;
  constructor(
    private lookupsService: LookupsGetterService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private generalDataService: GeneralDataService,
    private datePipe: DatePipe,
    private zeroInstantNotificationService: ZeroInstantNotificationService,
    private notInferringService: NotInferringService,
    private labService: LabService,
    private generalDataCompletionServiceService: GeneralDataCompletionServiceService,
    public exportService: ExportService,
    private cdr: ChangeDetectorRef
  ) { }
  filteredChart: any = -1;
  Charts = CHARTS;
  chartsList = [
    { id: -1, arabicName: ' إختر', englishName: 'Select' },
    {
      id: '1',
      arabicName: 'معدل ابلاغ حالات الامراض بالسنوات',
      englishName: 'Disease case reporting rate in years',
    },
    {
      id: '2',
      arabicName: 'معدل ابلاغ حالات الامراض بالمحافظات',
      englishName: 'Rate of reporting disease cases in governorates',
    },
    {
      id: '3',
      arabicName: 'معدل ابلاغ حالات الامراض ',
      englishName: 'Disease case reporting rate ',
    },
    {
      id: '4',
      arabicName: 'معدل ابلاغ حالات الامراض بالفترة الزمنية',
      englishName: 'Rate of reporting disease cases during the time period',
    },
  ];
  tarasodType = [
    { id: 1, arabicName: ' الكل', englishName: 'All' },
    { id: 2, arabicName: 'ترصد روتيني', englishName: 'Routine surveillance' },
    { id: 3, arabicName: 'مواقع مختارة ', englishName: 'Chosen Sites' },
  ];
  selectedOption: number = -1;
  yearsOptions = [
    { id: -1, arabicName: ' إختر', englishName: 'Select' },
    { id: 1, arabicName: 'سنوات محدده', englishName: 'Period by Years' },
    // { id: 2, arabicName: 'الفتره بالتاريخ', englishName: 'Period by Date' },
    // { id: 3, arabicName: 'الفتره بالسنوات', englishName: 'Specific Years' },
    // { id: 4, arabicName: 'سنه/أسابيع محدده ', englishName: 'Specific Year/Week' },
    { id: 5, arabicName: 'مده محدده', englishName: 'Specific Period' },
  ];
  tashKhesType = [
    { id: 3, arabicName: ' الكل', englishName: 'All' },
    { id: 1, arabicName: ' تشخيص ابتدائي', englishName: 'Primary Diagnosis' },
    { id: 2, arabicName: ' تشخيص نهائي ', englishName: 'Final Diagmosis' },
  ];

  cards = DASHBOARDCaRDS;
  selectedChart;
  governmentId: number = null;
  administrtionId: number = null;
  incidentId: number = null;
  firstLoad: boolean = true;
  selectedDisease: string;
  isReset: Boolean = false;
  isReset2: Boolean = false;
  isReset3: Boolean = false;
  isReset4: Boolean = false;
  isReset5: Boolean = false;
  isReset6: Boolean = false;
  isDeathReset: Boolean = false;
  isDeathReset2: Boolean = false;
  isDeathReset3: Boolean = false;
  modalData: string = '';
  noData: boolean = true;
  first: number = 0;
  last: number = 0;
  pages: number = 0;
  userFilter = {
    pageSize: 10,
    pageIndex: 0,
    sortColumn: '',
    sortOrder: '',
    searchText: '',
  };
  cardsPeriodFromDate: string = '';
  cardsPeriodToDate: string = '';

  ngOnInit(): void {
    //New By Hatem
    this.getAllAppSettings();
    this.getOnlineUsers();
    this.getMultiGovernments();
    this.getDiseases();
    this.getDiseaseGroups();
    this.getCaseCategories();
    this.getDepartments();
    this.getPatients();
    this.getIncompletePatients();
    this.getSilentSources();
    this.getSignutares();
    this.getCompleteData();
    this.getNonInferentialPatients();
    this.getPatientsWithLabChecks();
    // this.GetPatientsVersusAge();
    // this.GetPatientsVersusFinalDiagnostics();
    // this.GetPatientsVersusGender();
    // this.GetPatientsVersusInitialDiagnostics();
    // this.GetPatientsVersusPatientsResultDiagnostics();
    // this.GetPatientsVersusResult();
    // this.GetPatientsVersusYears();
    // this.GetPatientsVersusGovernments();
    this.GetReportedCasesRatesVersusGovernorates();
    // this.GetReportedCasesCountsVersusEpidemicWeeks();
    this.GetInfectedCasesRatesVersusGovernorates();
    // this.GetInfectedCasesCountsVersusEpidemicWeeks();
    this.GetReportedCasesRatesOverYearsVersusGovernorates();
    this.GetReportedCasesCountsDistributedOverYearsVersusEpidemicWeeks();
    this.GetInfectedCasesCountsDistributedOverYearsVersusEpidemicWeeks();
    this.GetInfectedCasesRatesOverYearsVersusGovernorates();
    this.GetDistributionOfDeathsByGender();
    this.GetDistributionOfDeathsByCaseDiagnosis();
    this.GetDistributionOfDeathsByAgeRange();
    this.GetCaseFatalityRate();
    this.GetReportingTimingsChart();
    this.GetInvestigationsTimingsChart();
    this.selectedDisease = this.diseases?.find(
      (y) => y.code == this.selectedDiseases
    );

    this.isModifingView = false;

    // this.getPageData();
    // this.getDiseases();
    // this.getCaseCategories();
    // this.getGovernments();
    // this.getDepartments();
    // this.getAllFinalResults();
    // this.getJobs();
    this.date = new Date();
    this.DropDownOptin = this.multipleDropdownSettings;
    this.currentLang = localStorage.getItem('ls.currentLang');
    const date = new Date();
    // this.selectedGovernment
    this.levelId = JSON.parse(
      localStorage.getItem('ls.authorizationData')
    ).user.levelId;
    // console.log('govs',this.governments, JSON.parse(localStorage.getItem('ls.authorizationData')).user.govenmentId)
    this.governmentId = JSON.parse(
      localStorage.getItem('ls.authorizationData')
    ).user.govenmentId;
    this.administrtionId = JSON.parse(
      localStorage.getItem('ls.authorizationData')
    ).user.healthAdministrationId;
    this.incidentId = JSON.parse(
      localStorage.getItem('ls.authorizationData')
    ).user.incidentSourceId;
    let healthAdministrationId = JSON.parse(
      localStorage.getItem('ls.authorizationData')
    ).user.healthAdministrationId;
    let govenmentId = JSON.parse(localStorage.getItem('ls.authorizationData'))
      .user.govenmentId;
    let incidentSourceId = JSON.parse(
      localStorage.getItem('ls.authorizationData')
    ).user.incidentSourceId;

    if (this.governments?.length > 0) {
      var userGov = this.governments.find((d) => d.id == govenmentId);
      this.selectedGovernment.push(userGov);
    }
    if (this.healthAdministration?.length > 0)
      this.selectedHealthAdministration = this.healthAdministration?.filter(
        (o) => o.id == healthAdministrationId
      );
    if (this.incidentSources?.length > 0)
      this.selectedIncidentSource = this.incidentSources?.filter(
        (o) => o.id == incidentSourceId
      );

    // if (this.governments?.length > 0)
    //   this.governmentId = govenmentId != null ? govenmentId : -1;
    // // this.patient.incidentGovernmentId = govenmentId;
    // if (this.healthAdministration?.length > 0)
    //   this.selectedHealthAdministration = this.healthAdministration?.filter(o => o.id == healthAdministrationId);
    // // this.patient.incidentHealthAdministrationId = healthAdministrationId;
    // if (this.incidentSources?.length > 0)
    //   this.incidentId = this.incidentSources?.filter(o => o.id == incidentSourceId);
    // this.patient.incidentSourceId = incidentSourceId;
  }
  singleDropdownSettings = SingleDropdownSettings;
  multipleDropdownSettings = MultipleDropdownSettings;
  singleYearDropdownSettings = {
    singleSelection: true,
    idField: 'id',
    textField: 'arabicName',
    searchPlaceholderText:
      localStorage.getItem('ls.currentLang') == 'ar' ? 'بحث' : 'Search Items',
    noDataAvailablePlaceholderText:
      localStorage.getItem('ls.currentLang') == 'ar'
        ? 'لا يوجد بيانات'
        : 'No Data',
    noFilteredDataAvailablePlaceholderText:
      localStorage.getItem('ls.currentLang') == 'ar'
        ? 'لا يوجد بيانات'
        : 'No Data',
    itemsShowLimit: 3,
    allowSearchFilter: true,
    enableCheckAll: false,
  };
  multipleYearDropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'arabicName',
    selectAllText:
      localStorage.getItem('ls.currentLang') == 'ar'
        ? 'اختار الكل'
        : 'Select All',
    unSelectAllText:
      localStorage.getItem('ls.currentLang') == 'ar'
        ? 'الغاء الاختيار'
        : 'UnSelect All',
    placeholder:
      localStorage.getItem('ls.currentLang') == 'ar' ? 'اختر' : 'Choose',
    searchPlaceholderText:
      localStorage.getItem('ls.currentLang') == 'ar' ? 'بحث' : 'Search Items',
    noDataAvailablePlaceholderText:
      localStorage.getItem('ls.currentLang') == 'ar'
        ? 'لا يوجد بيانات'
        : 'No Data',
    itemsShowLimit: 3,
    allowSearchFilter: true,
    enableCheckAll: true,
  };

  private getMonthDaysCount(date: string | Date): number {
    const tmp = new Date(date);
    tmp.setMonth(tmp.getMonth() + 1);
    tmp.setDate(0);
    return tmp.getDate();
  }

  //New By Hatem
  openModal(data) {
    console.log(data);

    // Get the modal element by its ID
    const modalElement = document.getElementById('myModal');
    if (modalElement) {
      // Initialize the Bootstrap modal
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  Delay() {
    this.delay = true;
    this.timer = setTimeout(() => {
      if (this.delay) {
        this.translateService
          .get('NOUR.WaitPlease')
          .subscribe((msg) => this.userMsg.info(msg));
      }
    }, 500);
  }
  RemoveDelay() {
    setTimeout(() => {
      this.delay = false;
      clearTimeout(this.timer);
    }, 0);
  }
  paginate(event: any) {
    this.first = event.first;
    this.last = event.last;
    this.userFilter.pageIndex = event.page;
    this.userFilter.pageSize = event.rows;
    this.getOnlineUsers();
  }
  onPaginatorClick(event: MouseEvent) {
    event.preventDefault(); // Prevent the default behavior
  }
  getOnlineUsers() {
    this.lookupsService.getOnlineUsers(this.userFilter).subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.onlineUsers = result.data;
          this.onlineUsersCardItems = result.data.onineUsersCardItems;
          this.headers = result.data.headers;
          this.onlineUsersCount = result.data.totalCount;
          if (this.onlineUsers != undefined && this.onlineUsers.length == 0) {
            this.noData = true;
            this.pages = 0;
          } else {
            this.noData = false;
            // this.pages = result.data[0].totalCount;
            this.last = this.userFilter.pageIndex * this.userFilter.pageSize;
          }
        }
        this.loadingPanel = false;
      },
      (error) => {
        this.loadingPanel = false;
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }

  getMultiGovernments() {
    this.lookupsService.getAllGovernmentsForUser(true).subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.governments = result.data;
        }
        this.loadingPanel = false;
      },
      (error) => {
        this.loadingPanel = false;
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }

  getPatients() {
    this.lookupsService.getPatients().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.patients = result.data;
        }
        this.loadingPanel = false;
      },
      (error) => {
        this.loadingPanel = false;
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }

  getIncompletePatients() {
    this.lookupsService.getIncompletePatients().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.incompletePatients = result.data;
        }
        this.loadingPanel = false;
      },
      (error) => {
        this.loadingPanel = false;
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }

  getSignutares() {
    this.lookupsService.getSignutares().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.signutares = result.data;
        }
        this.loadingPanel = false;
      },
      (error) => {
        this.loadingPanel = false;
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }

  getSilentSources() {
    this.lookupsService.getSilentSources().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.silentSources = result.data;
        }
        this.loadingPanel = false;
      },
      (error) => {
        this.loadingPanel = false;
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }

  getCompleteData() {
    this.lookupsService.getCompleteData().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.completeData = result.data;
        }
        this.loadingPanel = false;
      },
      (error) => {
        this.loadingPanel = false;
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }

  getNonInferentialPatients() {
    this.lookupsService.getNonInferentialPatients().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.nonInferentialPatients = result.data;
        }
        this.loadingPanel = false;
      },
      (error) => {
        this.loadingPanel = false;
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }

  getPatientsWithLabChecks() {
    this.lookupsService.getPatientsWithLabChecks().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.patientChecks = result.data;
        }
        this.loadingPanel = false;
      },
      (error) => {
        this.loadingPanel = false;
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }

  GetPatientsVersusAge() {
    this.lookupsService.GetPatientsVersusAgeDashboard().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.patientVersusAge = result.data;
          this.ageBarChart();
        }
        this.loadingPanel = false;
      },
      (error) => {
        this.loadingPanel = false;
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }

  GetPatientsVersusFinalDiagnostics() {
    this.lookupsService.GetPatientsVersusFinalDiagnosticsDashboard().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.PatientsVersusFinalDiagnostics = result.data.chartItemsData;
          this.DiagnosticsXLabel = this.PatientsVersusFinalDiagnostics.map(
            (x) => x.xLabel
          );
          this.DiagnosticsYValue = this.PatientsVersusFinalDiagnostics.map(
            (y) => y.yValue
          );
          this.FinalDiagnosticsBarChart();
        }
        this.loadingPanel = false;
      },
      (error) => {
        this.loadingPanel = false;
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }

  GetPatientsVersusGender() {
    this.lookupsService.GetPatientsVersusGenderDashboard().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.PatientsVersusGender = result.data.chartItemsData;
          result.data.chartItemsData.map((x) => {
            this.PatientsVersusGenderArr?.push({
              name: x?.xLabel,
              y: x?.yValue,
            });
          });
          this.GenderBarChart();
        }
        this.loadingPanel = false;
      },
      (error) => {
        this.loadingPanel = false;
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }

  GetPatientsVersusInitialDiagnostics() {
    this.lookupsService
      .GetPatientsVersusInitialDiagnosticsDashboard()
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.PatientsVersusInitialDiagnostics = result.data.chartItemsData;
            this.InitialDiagnosticsXLabel =
              this.PatientsVersusInitialDiagnostics.map((x) => x.xLabel);
            this.InitialDiagnosticsYValue =
              this.PatientsVersusInitialDiagnostics.map((y) => y.yValue);
            this.DiagnosticsBarChart();
          }
          this.loadingPanel = false;
        },
        (error) => {
          this.loadingPanel = false;
          this.translateService
            .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
        }
      );
  }

  GetPatientsVersusPatientsResultDiagnostics() {
    this.lookupsService
      .GetPatientsVersusPatientsResultDiagnosticsDashboard()
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.PatientsVersusPatientsResultDiagnostics =
              result.data.chartItemsData;
            this.ResultDiagnosticsXLabel =
              this.PatientsVersusPatientsResultDiagnostics.map((x) => x.xLabel);
            this.ResultDiagnosticsYValue =
              this.PatientsVersusPatientsResultDiagnostics.map((y) => y.yValue);
            this.ResultDiagnosticsBarChart();
          }
          this.loadingPanel = false;
        },
        (error) => {
          this.loadingPanel = false;
          this.translateService
            .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
        }
      );
  }

  GetPatientsVersusResult() {
    this.lookupsService.GetPatientsVersusResultDashboard().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.PatientsVersusResult = result.data.chartItemsData;
          this.ResultXLabel = this.PatientsVersusResult.map((x) => x.xLabel);
          this.ResultYValue = this.PatientsVersusResult.map((y) => y.yValue);
          this.ResultBarChart();
        }
        this.loadingPanel = false;
      },
      (error) => {
        this.loadingPanel = false;
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }

  GetPatientsVersusYears() {
    this.lookupsService.GetPatientsVersusYearsDashboard().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.PatientsVersusYears = result.data.chartItemsData;
          this.YearsXLabel = this.PatientsVersusYears.map((x) => x.xLabel);
          this.YearsYValue = this.PatientsVersusYears.map((y) => y.yValue);
          this.YearsBarChart();
        }
        this.loadingPanel = false;
      },
      (error) => {
        this.loadingPanel = false;
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }

  GetPatientsVersusGovernments() {
    this.lookupsService.GetPatientsVersusGovernmentsDashboard().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.PatientsVersusGovernments = result.data.chartItemsData;
          this.GovernmentsXLabel = this.PatientsVersusGovernments.map(
            (x) => x.xLabel
          );
          this.GovernmentsYValue = this.PatientsVersusGovernments.map(
            (y) => y.yValue
          );
          this.GovernmentsBarChart();
        }
        this.loadingPanel = false;
      },
      (error) => {
        this.loadingPanel = false;
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }

  GetReportedCasesRatesVersusGovernorates() {
    this.lookupsService
      .GetReportedCasesRatesVersusGovernoratesDashboard({
        governmentsIds: this.selectedgovernment?.map((x) => x.id),
        diseasesGroupsIds: this.selectedDiseaseGroups?.map((x) => x.id),
        diseasesIds: this.selectedDiseases?.map((x) => x.id),
        casesResultsCategoriesIds: this.selectedCategories?.map((x) => x.id),
        departmentsIds: this.selectedDepartments?.map((x) => x.id),
        fromDate: this.datePipe.transform(this.fromDate, 'yyyy-MM-dd'),
        toDate: this.datePipe.transform(this.toDate, 'yyyy-MM-dd'),
      })
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.ratesVersusGovernoratesData = result.data;
            this.ratesVersusGovernorates = result.data.chartItemsData;
            this.ratesTitle = result.data.chartTitle;
            this.RatesXLabel = this.ratesVersusGovernorates.map(
              (x) => x.xLabel
            );
            this.RatesYValue = this.ratesVersusGovernorates.map(
              (y) => y.yValue
            );
            this.RatesBarChart();
          }
          this.loadingPanel = false;
        },
        (error) => {
          this.loadingPanel = false;
          this.translateService
            .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
        }
      );
  }

  GetReportedCasesCountsDistributedOverYearsVersusEpidemicWeeks() {
    this.isReset = true;
    this.lookupsService
      .GetReportedCasesCountsDistributedOverYearsVersusEpidemicWeeksChartDashboard(
        {
          governmentsIds: this.selectedgovernment?.map((x) => x.id),
          diseasesGroupsIds: this.selectedDiseaseGroups?.map((x) => x.id),
          diseasesIds: this.selectedDiseases?.map((x) => x.id),
          casesResultsCategoriesIds: this.selectedCategories?.map((x) => x.id),
          departmentsIds: this.selectedDepartments?.map((x) => x.id),
          fromDate: this.datePipe.transform(this.fromDate, 'yyyy-MM-dd'),
          toDate: this.datePipe.transform(this.toDate, 'yyyy-MM-dd'),
        }
      )
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.DistributedOverYearsData = result.data;
            this.DistributedOverYears = result.data.multiLineChartItemsData;
            this.DistributedOverYearsStackedItems =
              result.data.availableXLabels;
            this.DistributedOverYearsTitle = result.data.chartTitle;
            this.DistributedOverYearsXLabel = this.DistributedOverYears.map(
              (x) => x.lineLabel
            );
            this.DistributedOverYearsYValue = this.DistributedOverYears.map(
              (y) => y.yValues
            );
            this.DistributedOverYearSseriesData = this.DistributedOverYears.map(
              (x) => ({
                name: x.lineLabel,
                data: x.yValues,
              })
            );
            this.DistributedOverYearsChart(this.DistributedOverYearSseriesData);
            this.isReset = false;
          }
          this.loadingPanel = false;
        },
        (error) => {
          this.loadingPanel = false;
          this.translateService
            .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
        }
      );
  }

  GetReportedCasesRatesOverYearsVersusGovernorates() {
    this.isReset2 = true;
    this.lookupsService
      .GetReportedCasesRatesOverYearsVersusGovernoratesChartDashboard({
        governmentsIds: this.selectedgovernment?.map((x) => x.id),
        diseasesGroupsIds: this.selectedDiseaseGroups?.map((x) => x.id),
        diseasesIds: this.selectedDiseases?.map((x) => x.id),
        casesResultsCategoriesIds: this.selectedCategories?.map((x) => x.id),
        departmentsIds: this.selectedDepartments?.map((x) => x.id),
        fromDate: this.datePipe.transform(this.fromDate, 'yyyy-MM-dd'),
        toDate: this.datePipe.transform(this.toDate, 'yyyy-MM-dd'),
      })
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.CasesRatesOverYearsVersusGovernoratesData = result.data;
            this.CasesRatesOverYearsVersusGovernorates =
              result.data.chartItemsData;
            this.RatesOverYearsVersusGovernoratesStackedItems =
              result.data.stackedItems;
            this.YearsVersusGovernoratesTitle = result.data.chartTitle;
            this.YearsVersusGovernoratesXLabel =
              this.CasesRatesOverYearsVersusGovernorates.map((x) => x.xLabel);
            this.YearsVersusGovernoratesYValue =
              this.CasesRatesOverYearsVersusGovernorates.map((y) => y.yValue);
            this.seriesData = this.CasesRatesOverYearsVersusGovernorates.map(
              (x) => ({
                name: x.xLabel,
                data: x.yValues,
              })
            );
            this.YearsVersusGovernoratesChart(this.seriesData);
            this.isReset2 = false;
          }
          this.loadingPanel = false;
        },
        (error) => {
          this.loadingPanel = false;
          this.translateService
            .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
        }
      );
  }

  GetReportingTimingsChart() {
    this.isReset5 = true;
    this.lookupsService
      .GetReportingTimingsChartDashboard({
        governmentsIds: this.selectedgovernment?.map((x) => x.id),
        diseasesGroupsIds: this.selectedDiseaseGroups?.map((x) => x.id),
        diseasesIds: this.selectedDiseases?.map((x) => x.id),
        casesResultsCategoriesIds: this.selectedCategories?.map((x) => x.id),
        departmentsIds: this.selectedDepartments?.map((x) => x.id),
        fromDate: this.datePipe.transform(this.fromDate, 'yyyy-MM-dd'),
        toDate: this.datePipe.transform(this.toDate, 'yyyy-MM-dd'),
      })
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.ReportingTimingsData = result.data;
            this.ReportingTimings = result.data.chartItemsData;
            this.ReportingTimingsStackedItems = result.data.stackedItems;
            this.ReportingTimingsTitle = result.data.chartTitle;
            this.ReportingTimingsXLabel = this.ReportingTimings.map(
              (x) => x.xLabel
            );
            this.ReportingTimingsYValue = this.ReportingTimings.map(
              (y) => y.yValue
            );
            this.ReportingTimingsSeriesData = this.ReportingTimings.map(
              (x) => ({
                name: x.xLabel,
                data: x.yValues,
              })
            );
            this.ReportingTimingsChart(this.ReportingTimingsSeriesData);
            this.isReset5 = false;
          }
          this.loadingPanel = false;
        },
        (error) => {
          this.loadingPanel = false;
          this.translateService
            .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
        }
      );
  }

  GetReportedCasesCountsVersusEpidemicWeeks() {
    this.lookupsService
      .GetReportedCasesCountsVersusEpidemicWeeksDashboard({
        governmentsIds: this.selectedgovernment?.map((x) => x.id),
        diseasesGroupsIds: this.selectedDiseaseGroups?.map((x) => x.id),
        diseasesIds: this.selectedDiseases?.map((x) => x.id),
        casesResultsCategoriesIds: this.selectedCategories?.map((x) => x.id),
        departmentsIds: this.selectedDepartments?.map((x) => x.id),
        fromDate: this.datePipe.transform(this.fromDate, 'yyyy-MM-dd'),
        toDate: this.datePipe.transform(this.toDate, 'yyyy-MM-dd'),
      })
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.CasesCountsVersusEpidemicData = result.data;
            this.CasesCountsVersusEpidemic = result.data.chartItemsData;
            this.caseTitle = result.data.chartTitle;
            this.CasesXLabel = this.CasesCountsVersusEpidemic.map(
              (x) => x.xLabel
            );
            this.CasesYValue = this.CasesCountsVersusEpidemic.map(
              (y) => y.yValue
            );
            this.CasesBarChart();
          }
          this.loadingPanel = false;
        },
        (error) => {
          this.loadingPanel = false;
          this.translateService
            .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
        }
      );
  }

  getInciedentResult() {
    this.GetReportedCasesCountsDistributedOverYearsVersusEpidemicWeeks();
    this.GetReportedCasesRatesVersusGovernorates();
    this.GetReportedCasesCountsVersusEpidemicWeeks();
    this.GetReportedCasesRatesOverYearsVersusGovernorates();
    this.GetReportingTimingsChart();
  }

  GetInfectedCasesRatesVersusGovernorates() {
    this.lookupsService
      .GetInfectedCasesRatesVersusGovernoratesDashboard({
        governmentsIds: this.selectedInfectedgovernment?.map((x) => x.id),
        diseasesGroupsIds: this.selectedInfectedDiseaseGroups?.map((x) => x.id),
        diseasesIds: this.selectedInfectedDiseases?.map((x) => x.id),
        casesResultsCategoriesIds: this.selectedInfectedCategories?.map(
          (x) => x.id
        ),
        departmentsIds: this.selectedInfectedDepartments?.map((x) => x.id),
        fromDate: this.datePipe.transform(this.fromInfectedDate, 'yyyy-MM-dd'),
        toDate: this.datePipe.transform(this.toInfectedDate, 'yyyy-MM-dd'),
      })
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.InfectedCasesRatesVersusGovernoratesData = result.data;
            this.InfectedCasesRatesVersusGovernorates =
              result.data.chartItemsData;
            this.InfectedCasesRatesTitle = result.data.chartTitle;
            this.InfectedCasesRatesXLabel =
              this.InfectedCasesRatesVersusGovernorates.map((x) => x.xLabel);
            this.InfectedCasesRatesYValue =
              this.InfectedCasesRatesVersusGovernorates.map((y) => y.yValue);
            this.InfectedCasesRatesBarChart();
          }
          this.loadingPanel = false;
        },
        (error) => {
          this.loadingPanel = false;
          this.translateService
            .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
        }
      );
  }

  GetInfectedCasesCountsVersusEpidemicWeeks() {
    this.lookupsService
      .GetInfectedCasesCountsVersusEpidemicWeeksDashboard({
        governmentsIds: this.selectedInfectedgovernment?.map((x) => x.id),
        diseasesGroupsIds: this.selectedInfectedDiseaseGroups?.map((x) => x.id),
        diseasesIds: this.selectedInfectedDiseases?.map((x) => x.id),
        casesResultsCategoriesIds: this.selectedInfectedCategories?.map(
          (x) => x.id
        ),
        departmentsIds: this.selectedInfectedDepartments?.map((x) => x.id),
        fromDate: this.datePipe.transform(this.fromInfectedDate, 'yyyy-MM-dd'),
        toDate: this.datePipe.transform(this.toInfectedDate, 'yyyy-MM-dd'),
      })
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.InfectedCasesCountsVersusGovernoratesData = result.data;
            this.InfectedCasesCountsVersusGovernorates =
              result.data.chartItemsData;
            this.InfectedCasesCountsTitle = result.data.chartTitle;
            this.InfectedCasesCountsXLabel =
              this.InfectedCasesCountsVersusGovernorates.map((x) => x.xLabel);
            this.InfectedCasesCountsYValue =
              this.InfectedCasesCountsVersusGovernorates.map((y) => y.yValue);
            this.InfectedCasesCountsChart();
          }
          this.loadingPanel = false;
        },
        (error) => {
          this.loadingPanel = false;
          this.translateService
            .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
        }
      );
  }

  GetInfectedCasesCountsDistributedOverYearsVersusEpidemicWeeks() {
    this.isReset4 = true;
    this.lookupsService
      .GetInfectedCasesCountsDistributedOverYearsVersusEpidemicWeeksDashboard({
        governmentsIds: this.selectedgovernment?.map((x) => x.id),
        diseasesGroupsIds: this.selectedDiseaseGroups?.map((x) => x.id),
        diseasesIds: this.selectedDiseases?.map((x) => x.id),
        casesResultsCategoriesIds: this.selectedCategories?.map((x) => x.id),
        departmentsIds: this.selectedDepartments?.map((x) => x.id),
        fromDate: this.datePipe.transform(this.fromDate, 'yyyy-MM-dd'),
        toDate: this.datePipe.transform(this.toDate, 'yyyy-MM-dd'),
      })
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.InfectedDistributedOverYearsData = result.data;
            this.InfectedDistributedOverYears =
              result.data.multiLineChartItemsData;
            this.InfectedDistributedOverYearsStackedItems =
              result.data.availableXLabels;
            this.InfectedDistributedOverYearsTitle = result.data.chartTitle;
            this.InfectedDistributedOverYearsXLabel =
              this.InfectedDistributedOverYears.map((x) => x.lineLabel);
            this.InfectedDistributedOverYearsYValue =
              this.InfectedDistributedOverYears.map((y) => y.yValues);
            this.InfectedDistributedOverYearSseriesData =
              this.InfectedDistributedOverYears.map((x) => ({
                name: x.lineLabel,
                data: x.yValues,
              }));
            this.InfectedDistributedOverYearsChart(
              this.InfectedDistributedOverYearSseriesData
            );
            this.isReset4 = false;
          }
          this.loadingPanel = false;
        },
        (error) => {
          this.loadingPanel = false;
          this.translateService
            .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
        }
      );
  }

  GetInfectedCasesRatesOverYearsVersusGovernorates() {
    this.isReset3 = true;
    this.lookupsService
      .GetInfectedCasesRatesOverYearsVersusGovernoratesDashboard({
        governmentsIds: this.selectedgovernment?.map((x) => x.id),
        diseasesGroupsIds: this.selectedDiseaseGroups?.map((x) => x.id),
        diseasesIds: this.selectedDiseases?.map((x) => x.id),
        casesResultsCategoriesIds: this.selectedCategories?.map((x) => x.id),
        departmentsIds: this.selectedDepartments?.map((x) => x.id),
        fromDate: this.datePipe.transform(this.fromDate, 'yyyy-MM-dd'),
        toDate: this.datePipe.transform(this.toDate, 'yyyy-MM-dd'),
      })
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.InfectedCasesRatesOverYearsVersusGovernoratesData =
              result.data;
            this.InfectedCasesRatesOverYearsVersusGovernorates =
              result.data.chartItemsData;
            this.InfectedRatesOverYearsVersusGovernoratesStackedItems =
              result.data.stackedItems;
            this.InfectedYearsVersusGovernoratesTitle = result.data.chartTitle;
            this.InfectedYearsVersusGovernoratesXLabel =
              this.InfectedCasesRatesOverYearsVersusGovernorates.map(
                (x) => x.xLabel
              );
            this.InfectedYearsVersusGovernoratesYValue =
              this.InfectedCasesRatesOverYearsVersusGovernorates.map(
                (y) => y.yValue
              );
            this.InfectedSeriesData =
              this.InfectedCasesRatesOverYearsVersusGovernorates.map((x) => ({
                name: x.xLabel,
                data: x.yValues,
              }));
            this.InfectedYearsVersusGovernoratesChart(this.InfectedSeriesData);
            this.isReset3 = false;
          }
          this.loadingPanel = false;
        },
        (error) => {
          this.loadingPanel = false;
          this.translateService
            .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
        }
      );
  }

  GetInvestigationsTimingsChart() {
    this.isReset6 = true;
    this.lookupsService
      .GetInvestigationsTimingsChartDashboard({
        governmentsIds: this.selectedgovernment?.map((x) => x.id),
        diseasesGroupsIds: this.selectedDiseaseGroups?.map((x) => x.id),
        diseasesIds: this.selectedDiseases?.map((x) => x.id),
        casesResultsCategoriesIds: this.selectedCategories?.map((x) => x.id),
        departmentsIds: this.selectedDepartments?.map((x) => x.id),
        fromDate: this.datePipe.transform(this.fromDate, 'yyyy-MM-dd'),
        toDate: this.datePipe.transform(this.toDate, 'yyyy-MM-dd'),
      })
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.InvestigationsTimingsData = result.data;
            this.InvestigationsTimings = result.data.chartItemsData;
            this.InvestigationsTimingsStackedItems = result.data.stackedItems;
            this.InvestigationsTimingsTitle = result.data.chartTitle;
            this.InvestigationsTimingsXLabel = this.InvestigationsTimings.map(
              (x) => x.xLabel
            );
            this.InvestigationsTimingsYValue = this.InvestigationsTimings.map(
              (y) => y.yValue
            );
            this.InvestigationsTimingsSeriesData =
              this.InvestigationsTimings.map((x) => ({
                name: x.xLabel,
                data: x.yValues,
              }));
            this.InvestigationsTimingsChart(
              this.InvestigationsTimingsSeriesData
            );
            this.isReset6 = false;
          }
          this.loadingPanel = false;
        },
        (error) => {
          this.loadingPanel = false;
          this.translateService
            .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
        }
      );
  }

  getInjuriesResult() {
    this.GetInfectedCasesRatesVersusGovernorates();
    this.GetInfectedCasesCountsVersusEpidemicWeeks();
    this.GetInfectedCasesRatesOverYearsVersusGovernorates();
    this.GetInfectedCasesCountsDistributedOverYearsVersusEpidemicWeeks();
    this.GetInvestigationsTimingsChart();
  }

  GetDistributionOfDeathsByGender() {
    this.isDeathReset = true;
    this.lookupsService
      .GetDistributionOfDeathsByGenderDashboard({
        governmentsIds: this.selectedInfectedgovernment?.map((x) => x.id),
        diseasesGroupsIds: this.selectedInfectedDiseaseGroups?.map((x) => x.id),
        diseasesIds: this.selectedInfectedDiseases?.map((x) => x.id),
        casesResultsCategoriesIds: this.selectedInfectedCategories?.map(
          (x) => x.id
        ),
        departmentsIds: this.selectedInfectedDepartments?.map((x) => x.id),
        fromDate: this.datePipe.transform(this.fromInfectedDate, 'yyyy-MM-dd'),
        toDate: this.datePipe.transform(this.toInfectedDate, 'yyyy-MM-dd'),
      })
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.DistributionOfDeathsByGenderData = result.data;
            this.DistributionOfDeathsByGender = result.data.chartItemsData;
            this.DistributionOfDeathsByGenderTitle = result.data.chartTitle;
            this.DistributionOfDeathsByGenderXLabel =
              this.DistributionOfDeathsByGender.map((x) => x.xLabel);
            this.DistributionOfDeathsByGenderYValue =
              this.DistributionOfDeathsByGender.map((y) => y.yValue);
            this.DistributionOfDeathsByGenderSeries =
              this.DistributionOfDeathsByGender.map((x) => ({
                name: x.xLabel,
                y: x.yValue,
              }));
            this.DistributionOfDeathsByGenderChart(
              this.DistributionOfDeathsByGenderSeries
            );
            this.isDeathReset = false;
          }
          this.loadingPanel = false;
        },
        (error) => {
          this.loadingPanel = false;
          this.translateService
            .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
        }
      );
  }

  GetDistributionOfDeathsByCaseDiagnosis() {
    this.isDeathReset2 = true;
    this.lookupsService
      .GetDistributionOfDeathsByCaseDiagnosisDashboard({
        governmentsIds: this.selectedInfectedgovernment?.map((x) => x.id),
        diseasesGroupsIds: this.selectedInfectedDiseaseGroups?.map((x) => x.id),
        diseasesIds: this.selectedInfectedDiseases?.map((x) => x.id),
        casesResultsCategoriesIds: this.selectedInfectedCategories?.map(
          (x) => x.id
        ),
        departmentsIds: this.selectedInfectedDepartments?.map((x) => x.id),
        fromDate: this.datePipe.transform(this.fromInfectedDate, 'yyyy-MM-dd'),
        toDate: this.datePipe.transform(this.toInfectedDate, 'yyyy-MM-dd'),
      })
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.DistributionOfDeathsByCaseDiagnosisData = result.data;
            this.DistributionOfDeathsByCaseDiagnosis =
              result.data.chartItemsData;
            this.DistributionOfDeathsByCaseDiagnosisTitle =
              result.data.chartTitle;
            this.DistributionOfDeathsByCaseDiagnosisXLabel =
              this.DistributionOfDeathsByCaseDiagnosis.map((x) => x.xLabel);
            this.DistributionOfDeathsByCaseDiagnosisYValue =
              this.DistributionOfDeathsByCaseDiagnosis.map((y) => y.yValue);
            this.DistributionOfDeathsByCaseDiagnosisSeries =
              this.DistributionOfDeathsByCaseDiagnosis.map((x) => ({
                name: x.xLabel,
                y: x.yValue,
              }));
            this.DistributionOfDeathsByCaseDiagnosisChart(
              this.DistributionOfDeathsByCaseDiagnosisSeries
            );
            this.isDeathReset2 = false;
          }
          this.loadingPanel = false;
        },
        (error) => {
          this.loadingPanel = false;
          this.translateService
            .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
        }
      );
  }

  GetDistributionOfDeathsByAgeRange() {
    this.isDeathReset3 = true;
    this.lookupsService
      .GetDistributionOfDeathsByAgeRangeDashboard({
        governmentsIds: this.selectedInfectedgovernment?.map((x) => x.id),
        diseasesGroupsIds: this.selectedInfectedDiseaseGroups?.map((x) => x.id),
        diseasesIds: this.selectedInfectedDiseases?.map((x) => x.id),
        casesResultsCategoriesIds: this.selectedInfectedCategories?.map(
          (x) => x.id
        ),
        departmentsIds: this.selectedInfectedDepartments?.map((x) => x.id),
        fromDate: this.datePipe.transform(this.fromInfectedDate, 'yyyy-MM-dd'),
        toDate: this.datePipe.transform(this.toInfectedDate, 'yyyy-MM-dd'),
      })
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.DistributionOfDeathsByAgeRangeData = result.data;
            this.DistributionOfDeathsByAgeRange = result.data.chartItemsData;
            this.DistributionOfDeathsByAgeRangeTitle = result.data.chartTitle;
            this.DistributionOfDeathsByAgeRangeXLabel =
              this.DistributionOfDeathsByAgeRange.map((x) => x.xLabel);
            this.DistributionOfDeathsByAgeRangeYValue =
              this.DistributionOfDeathsByAgeRange.map((y) => y.yValue);
            this.DistributionOfDeathsByAgeRangeSeries =
              this.DistributionOfDeathsByAgeRange.map((x) => ({
                name: x.xLabel,
                data: x.yValue,
              }));
            this.DistributionOfDeathsByAgeRangeChart();
            this.isDeathReset3 = false;
          }
          this.loadingPanel = false;
        },
        (error) => {
          this.loadingPanel = false;
          this.translateService
            .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
        }
      );
  }

  GetCaseFatalityRate() {
    this.lookupsService
      .GetCaseFatalityRateDashboard({
        governmentsIds: this.selectedInfectedgovernment?.map((x) => x.id),
        diseasesGroupsIds: this.selectedInfectedDiseaseGroups?.map((x) => x.id),
        diseasesIds: this.selectedInfectedDiseases?.map((x) => x.id),
        casesResultsCategoriesIds: this.selectedInfectedCategories?.map(
          (x) => x.id
        ),
        departmentsIds: this.selectedInfectedDepartments?.map((x) => x.id),
        fromDate: this.datePipe.transform(this.fromInfectedDate, 'yyyy-MM-dd'),
        toDate: this.datePipe.transform(this.toInfectedDate, 'yyyy-MM-dd'),
      })
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.CaseFatalityRate = result.data;
          }
          this.loadingPanel = false;
        },
        (error) => {
          this.loadingPanel = false;
          this.translateService
            .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
        }
      );
  }

  getDeathsResult() {
    this.GetDistributionOfDeathsByGender();
    this.GetDistributionOfDeathsByCaseDiagnosis();
    this.GetDistributionOfDeathsByAgeRange();
    this.GetCaseFatalityRate();
  }

  ////////////////////////////////////////////// CHARTS //////////////////////////////////////////////////

  FinalDiagnosticsBarChart() {
    this.FinalDiagnosticsBarChartOptions = {
      chart: {
        type: 'bar',
      },
      title: {
        text: '',
      },
      xAxis: {
        categories: this.DiagnosticsXLabel,
        title: {
          text: null,
        },
        accessibility: {
          description: 'FinalDiagnostics',
        },
        labels: {
          style: {
            color: '#000000',
          },
        },
      },
      yAxis: {
        min: 0,
        tickInterval: 1,
        title: {
          text: null,
        },
        accessibility: {
          description: 'Organic farming area',
        },
        labels: {
          overflow: 'justify',
          format: '{value}',
          style: {
            color: '#000000',
          },
        },
      },
      plotOptions: {
        bar: {
          borderRadius: 12,
          dataLabels: {
            enabled: true,
            format: '{y}',
          },
        },
      },
      tooltip: {
        valueSuffix: '{y}',
        stickOnContact: true,
        backgroundColor: 'rgba(255, 255, 255, 0.93)',
      },
      legend: {
        enabled: false,
      },
      series: [
        {
          name: 'Organic farming area',
          color: '#0778be',
          borderColor: '#0778be',
          data: this.DiagnosticsYValue,
        } as any,
      ],
    };
  }

  ageBarChart() {
    this.ageBarChartOptions = {
      chart: {
        type: 'column',
        spacingBottom: 5,
        spacingTop: 15,
        spacingLeft: 35,
        spacingRight: 35,
      },
      title: {
        text: '',
      },
      xAxis: {
        categories: [
          this.currentLang == 'ar' ? 'اصغر من شهر' : 'less Than 1 Month',
          this.currentLang == 'ar' ? 'اصغر من سنة' : 'less Than 1 Year',
          this.currentLang == 'ar' ? '1 : 5' : 'up To 5',
          this.currentLang == 'ar' ? '5 : 15' : 'up To 15',
          this.currentLang == 'ar' ? '15 : 35' : 'up To 35',
          this.currentLang == 'ar' ? '35 : 65' : 'up To 65',
          this.currentLang == 'ar' ? 'اكبر من 65' : 'more Than 65',
        ],
        title: {
          text: null,
        },
        accessibility: {
          description: 'Countries',
        },
        labels: {
          style: {
            color: '#000000',
          },
        },
      },
      yAxis: {
        min: 0,
        tickInterval: 1,
        title: {
          text: null,
        },
        labels: {
          overflow: 'justify',
          format: '{value}',
          style: {
            color: '#000000',
          },
        },
      },
      plotOptions: {
        column: {
          borderRadius: 12,
          // borderWidth: .5,
          //   borderColor: 'black',
          dataLabels: {
            enabled: true,
            format: '{y}',
          },
        },
      },
      tooltip: {
        valueSuffix: '{y}',
        stickOnContact: true,
        backgroundColor: 'rgba(255, 255, 255, 0.93)',
      },
      legend: {
        enabled: false,
      },
      series: [
        {
          pointWidth: 30,
          color: '#0778be',
          borderColor: '#0778be',
          data: [
            { y: this.patientVersusAge.lessThan1Month, color: '#0778be' },
            { y: this.patientVersusAge.lessThan1Year, color: '#0778be' },
            { y: this.patientVersusAge.moreThan65, color: '#0778be' },
            { y: this.patientVersusAge.upTo5, color: '#0778be' },
            { y: this.patientVersusAge.upTo15, color: '#0778be' },
            { y: this.patientVersusAge.upTo35, color: '#0778be' },
            { y: this.patientVersusAge.upTo65, color: '#0778be' },
          ],
        },
      ] as any,
    };
  }

  // FinalDiagnosticsBarChart() {
  //   this.FinalDiagnosticsBarChartOptions = {
  //     chart: {
  //       type: 'column',
  //       spacingBottom: 5,
  //       spacingTop: 15,
  //       spacingLeft: 35,
  //       spacingRight: 35,
  //     },
  //     title: {
  //       text: '',
  //     },
  //     xAxis: {
  //       categories: this.DiagnosticsXLabel,
  //       title: {
  //         text: null,
  //       },
  //       accessibility: {
  //         description: 'Countries',
  //       },
  //       labels: {
  //         style: {
  //           color: '#000000',
  //         },
  //       },
  //     },
  //     yAxis: {
  //       min: 0,
  //       tickInterval: 1,
  //       title: {
  //         text: null,
  //       },
  //       labels: {
  //         overflow: 'justify',
  //         format: '{value}',
  //         style: {
  //           color: '#000000',
  //         },
  //       },
  //     },
  //     plotOptions: {
  //       column: {
  //         borderRadius: 12,
  //         // borderWidth: .5,
  //         //   borderColor: 'black',
  //         dataLabels: {
  //           enabled: true,
  //           format: '{y}%',
  //         },
  //       },
  //     },
  //     tooltip: {
  //       valueSuffix: '{y}%',
  //       stickOnContact: true,
  //       backgroundColor: 'rgba(255, 255, 255, 0.93)',
  //     },
  //     legend: {
  //       enabled: false,
  //     },
  //     series: [
  //       {
  //         pointWidth: 30,
  //         color: '#0778be',
  //         borderColor: '#0778be',
  //         data: this.DiagnosticsYValue,
  //       },
  //     ] as any,
  //   };
  // }

  GenderBarChart() {
    this.genderBarChartOptions = {
      chart: {
        type: 'pie',
      },
      colors: ['#0778be', '#f15a31'],
      title: {
        text: '',
      },
      tooltip: {
        valueSuffix: '',
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            // format: "{point.name}: {y} %",
          },
          showInLegend: true,
        },
      },
      legend: {
        shadow: true,
        itemStyle: {
          color: '#000000',
          cursor: 'pointer',
          fontSize: '11px',
          fontWeight: '400',
          textOverflow: 'ellipsis',
        },
      },
      series: [
        {
          name: 'Percentage',
          colorByPoint: true,
          innerSize: '75%',
          data: this.PatientsVersusGenderArr,
        } as any,
      ],
    };
  }

  DiagnosticsBarChart() {
    this.diagnosticsBarChartOptions = {
      chart: {
        type: 'column',
        spacingBottom: 5,
        spacingTop: 15,
        spacingLeft: 35,
        spacingRight: 35,
      },
      title: {
        text: '',
      },
      xAxis: {
        categories: this.InitialDiagnosticsXLabel,
        title: {
          text: null,
        },
        accessibility: {
          description: 'diagnostics',
        },
        labels: {
          style: {
            color: '#000000',
          },
        },
      },
      yAxis: {
        min: 0,
        tickInterval: 1,
        title: {
          text: null,
        },
        labels: {
          overflow: 'justify',
          format: '{value}',
          style: {
            color: '#000000',
          },
        },
      },
      plotOptions: {
        column: {
          borderRadius: 12,
          // borderWidth: .5,
          //   borderColor: 'black',
          dataLabels: {
            enabled: true,
            format: '{y}',
          },
        },
      },
      tooltip: {
        valueSuffix: '{y}',
        stickOnContact: true,
        backgroundColor: 'rgba(255, 255, 255, 0.93)',
      },
      legend: {
        enabled: false,
      },
      series: [
        {
          pointWidth: 30,
          color: '#0778be',
          borderColor: '#0778be',
          data: this.InitialDiagnosticsYValue,
        },
      ] as any,
    };
  }

  ResultDiagnosticsBarChart() {
    this.resultDiagnosticsBarChartOptions = {
      chart: {
        type: 'line',
        spacingBottom: 5,
        spacingTop: 15,
        spacingLeft: 35,
        spacingRight: 35,
      },
      title: {
        text: '',
      },
      xAxis: {
        categories: this.ResultDiagnosticsXLabel,
        title: {
          text: null,
        },
        accessibility: {
          description: 'diagnostics',
        },
        labels: {
          style: {
            color: '#000000',
          },
        },
      },
      yAxis: {
        min: 0,
        tickInterval: 1,
        title: {
          text: null,
        },
        labels: {
          overflow: 'justify',
          format: '{value}',
          style: {
            color: '#000000',
          },
        },
      },
      plotOptions: {
        column: {
          borderRadius: 12,
          // borderWidth: .5,
          //   borderColor: 'black',
          dataLabels: {
            enabled: true,
            format: '{y}',
          },
        },
      },
      tooltip: {
        valueSuffix: '{y}',
        stickOnContact: true,
        backgroundColor: 'rgba(255, 255, 255, 0.93)',
      },
      legend: {
        enabled: false,
      },
      series: [
        {
          pointWidth: 30,
          color: '#0778be',
          borderColor: '#0778be',
          data: this.ResultDiagnosticsYValue,
        },
      ] as any,
    };
  }

  ResultBarChart() {
    this.resultBarChartOptions = {
      chart: {
        type: 'column',
        spacingBottom: 5,
        spacingTop: 15,
        spacingLeft: 35,
        spacingRight: 35,
      },
      title: {
        text: '',
      },
      xAxis: {
        categories: this.ResultXLabel,
        title: {
          text: null,
        },
        accessibility: {
          description: 'diagnostics',
        },
        labels: {
          style: {
            color: '#000000',
          },
        },
      },
      yAxis: {
        min: 0,
        tickInterval: 1,
        title: {
          text: null,
        },
        labels: {
          overflow: 'justify',
          format: '{value}',
          style: {
            color: '#000000',
          },
        },
      },
      plotOptions: {
        column: {
          borderRadius: 12,
          // borderWidth: .5,
          //   borderColor: 'black',
          dataLabels: {
            enabled: true,
            format: '{y}',
          },
        },
      },
      tooltip: {
        valueSuffix: '{y}',
        stickOnContact: true,
        backgroundColor: 'rgba(255, 255, 255, 0.93)',
      },
      legend: {
        enabled: false,
      },
      series: [
        {
          pointWidth: 30,
          color: '#0778be',
          borderColor: '#0778be',
          data: this.ResultYValue,
        },
      ] as any,
    };
  }

  YearsBarChart() {
    this.yearsBarChartOptions = {
      chart: {
        type: 'column',
        spacingBottom: 5,
        spacingTop: 15,
        spacingLeft: 35,
        spacingRight: 35,
      },
      title: {
        text: '',
      },
      xAxis: {
        categories: this.YearsXLabel,
        title: {
          text: null,
        },
        accessibility: {
          description: 'diagnostics',
        },
        labels: {
          style: {
            color: '#000000',
          },
        },
      },
      yAxis: {
        min: 0,
        tickInterval: 1,
        title: {
          text: null,
        },
        labels: {
          overflow: 'justify',
          format: '{value}',
          style: {
            color: '#000000',
          },
        },
      },
      plotOptions: {
        column: {
          borderRadius: 12,
          // borderWidth: .5,
          //   borderColor: 'black',
          dataLabels: {
            enabled: true,
            format: '{y}',
          },
        },
      },
      tooltip: {
        valueSuffix: '{y}',
        stickOnContact: true,
        backgroundColor: 'rgba(255, 255, 255, 0.93)',
      },
      legend: {
        enabled: false,
      },
      series: [
        {
          pointWidth: 30,
          color: '#0778be',
          borderColor: '#0778be',
          data: this.YearsYValue,
        },
      ] as any,
    };
  }

  GovernmentsBarChart() {
    this.governmentsBarChartOptions = {
      chart: {
        type: 'column',
        spacingBottom: 5,
        spacingTop: 15,
        spacingLeft: 35,
        spacingRight: 35,
      },
      title: {
        text: '',
      },
      xAxis: {
        categories: this.GovernmentsXLabel,
        title: {
          text: null,
        },
        accessibility: {
          description: 'Governments',
        },
        labels: {
          style: {
            color: '#000000',
          },
        },
      },
      yAxis: {
        min: 0,
        tickInterval: 1,
        title: {
          text: null,
        },
        labels: {
          overflow: 'justify',
          format: '{value}',
          style: {
            color: '#000000',
          },
        },
      },
      plotOptions: {
        column: {
          borderRadius: 12,
          // borderWidth: .5,
          //   borderColor: 'black',
          dataLabels: {
            enabled: true,
            format: '{y}',
          },
        },
      },
      tooltip: {
        valueSuffix: '{y}',
        stickOnContact: true,
        backgroundColor: 'rgba(255, 255, 255, 0.93)',
      },
      legend: {
        enabled: false,
      },
      series: [
        {
          pointWidth: 30,
          color: '#0778be',
          borderColor: '#0778be',
          data: this.GovernmentsYValue,
        },
      ] as any,
    };
  }

  RatesBarChart() {
    this.ratesBarChartOptions = {
      chart: {
        type: 'column',
        spacingBottom: 5,
        spacingTop: 15,
        spacingLeft: 35,
        spacingRight: 35,
      },
      title: {
        text: '',
      },
      xAxis: {
        categories: this.RatesXLabel,
        title: {
          text: this.ratesVersusGovernoratesData.xAxisTitle,
        },
        accessibility: {
          description: 'Rates',
        },
        labels: {
          style: {
            color: '#000000',
          },
        },
      },
      yAxis: {
        min: 0,
        tickInterval: 1,
        title: {
          text: this.ratesVersusGovernoratesData.yAxisTitle,
        },
        labels: {
          overflow: 'justify',
          format: '{value}',
          style: {
            color: '#000000',
          },
        },
        plotLines: [
          {
            color: 'red',
            value: this.ratesVersusGovernoratesData.averageValue,
            width: 1,
            dashStyle: 'ShortDash',
            label: {
              text: this.ratesVersusGovernoratesData.averageValueTitle,
              align: 'right',
              style: {
                color: 'red',
                fontWeight: 'bold',
              },
            },
          },
        ],
      },
      plotOptions: {
        column: {
          borderRadius: 12,
          // borderWidth: .5,
          //   borderColor: 'black',
          dataLabels: {
            enabled: true,
            format: '{y}',
          },
        },
      },

      tooltip: {
        valueSuffix: '{y}',
        stickOnContact: true,
        backgroundColor: 'rgba(255, 255, 255, 0.93)',
      },
      legend: {
        enabled: false,
      },
      series: [
        {
          pointWidth: 30,
          color: '#0778be',
          borderColor: '#0778be',
          data: this.RatesYValue,
        },
      ] as any,
    };
  }

  CasesBarChart() {
    this.casesBarChartOptions = {
      chart: {
        type: 'column',
        spacingBottom: 5,
        spacingTop: 15,
        spacingLeft: 35,
        spacingRight: 35,
      },
      title: {
        text: '',
      },
      xAxis: {
        categories: this.CasesXLabel,
        title: {
          text: this.CasesCountsVersusEpidemicData.xAxisTitle,
        },
        accessibility: {
          description: 'Cases',
        },
        labels: {
          style: {
            color: '#000000',
          },
        },
      },
      yAxis: {
        min: 0,
        tickInterval: 1,
        title: {
          text: this.CasesCountsVersusEpidemicData.yAxisTitle,
        },
        labels: {
          overflow: 'justify',
          format: '{value}',
          style: {
            color: '#000000',
          },
        },
      },
      plotOptions: {
        column: {
          borderRadius: 12,
          // borderWidth: .5,
          //   borderColor: 'black',
          dataLabels: {
            enabled: true,
            format: '{y}',
          },
        },
      },
      tooltip: {
        valueSuffix: '{y}',
        stickOnContact: true,
        backgroundColor: 'rgba(255, 255, 255, 0.93)',
      },
      legend: {
        enabled: false,
      },
      series: [
        {
          pointWidth: 30,
          color: '#0778be',
          borderColor: '#0778be',
          data: this.CasesYValue,
        },
      ] as any,
    };
  }

  InfectedCasesRatesBarChart() {
    this.InfectedCasesRatesOptions = {
      chart: {
        type: 'column',
        spacingBottom: 5,
        spacingTop: 15,
        spacingLeft: 35,
        spacingRight: 35,
      },
      title: {
        text: '',
      },
      xAxis: {
        categories: this.InfectedCasesRatesXLabel,
        title: {
          text: this.InfectedCasesRatesVersusGovernoratesData.xAxisTitle,
        },
        accessibility: {
          description: 'InfectedCasesRates',
        },
        labels: {
          style: {
            color: '#000000',
          },
        },
      },
      yAxis: {
        min: 0,
        tickInterval: 1,
        title: {
          text: this.InfectedCasesRatesVersusGovernoratesData.yAxisTitle,
        },
        labels: {
          overflow: 'justify',
          format: '{value}',
          style: {
            color: '#000000',
          },
        },
        plotLines: [
          {
            color: 'red',
            value: this.InfectedCasesRatesVersusGovernoratesData.averageValue,
            width: 1,
            dashStyle: 'ShortDash',
            label: {
              text: this.InfectedCasesRatesVersusGovernoratesData
                .averageValueTitle,
              align: 'right',
              style: {
                color: 'red',
                fontWeight: 'bold',
              },
            },
          },
        ],
      },
      plotOptions: {
        column: {
          borderRadius: 12,
          // borderWidth: .5,
          //   borderColor: 'black',
          dataLabels: {
            enabled: true,
            format: '{y}',
          },
        },
      },
      tooltip: {
        valueSuffix: '{y}',
        stickOnContact: true,
        backgroundColor: 'rgba(255, 255, 255, 0.93)',
      },
      legend: {
        enabled: false,
      },
      series: [
        {
          pointWidth: 30,
          color: '#0778be',
          borderColor: '#0778be',
          data: this.InfectedCasesRatesYValue,
        },
      ] as any,
    };
  }

  InfectedCasesCountsChart() {
    this.InfectedCasesCountsOptions = {
      chart: {
        type: 'column',
        spacingBottom: 5,
        spacingTop: 15,
        spacingLeft: 35,
        spacingRight: 35,
      },
      title: {
        text: '',
      },
      xAxis: {
        categories: this.InfectedCasesCountsXLabel,
        title: {
          text: this.InfectedCasesCountsVersusGovernoratesData.xAxisTitle,
        },
        accessibility: {
          description: 'InfectedCasesCounts',
        },
        labels: {
          style: {
            color: '#000000',
          },
        },
      },
      yAxis: {
        min: 0,
        tickInterval: 1,
        title: {
          text: this.InfectedCasesCountsVersusGovernoratesData.yAxisTitle,
        },
        labels: {
          overflow: 'justify',
          format: '{value}',
          style: {
            color: '#000000',
          },
        },
      },
      plotOptions: {
        column: {
          borderRadius: 12,
          // borderWidth: .5,
          //   borderColor: 'black',
          dataLabels: {
            enabled: true,
            format: '{y}',
          },
        },
      },
      tooltip: {
        valueSuffix: '{y}',
        stickOnContact: true,
        backgroundColor: 'rgba(255, 255, 255, 0.93)',
      },
      legend: {
        enabled: false,
      },
      series: [
        {
          pointWidth: 30,
          color: '#0778be',
          borderColor: '#0778be',
          data: this.InfectedCasesCountsYValue,
        },
      ] as any,
    };
  }

  ReportingTimingsChart(series) {
    if (this.ReportingTimingsOptions && this.ReportingTimingsOptions.series) {
      this.ReportingTimingsOptions.series = []; // Clear existing series
    }
    this.ReportingTimingsOptions = {
      chart: {
        type: 'column',
      },
      title: {
        text: null,
      },
      xAxis: {
        categories: this.ReportingTimingsStackedItems,
        title: {
          text: this.ReportingTimingsData.xAxisTitle,
        },
      },
      yAxis: {
        min: 0,
        title: {
          text: this.ReportingTimingsData.yAxisTitle,
        },
      },
      tooltip: {
        pointFormat:
          '<span style="color:{series.color}">{series.name}</span>' +
          ': <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
        shared: true,
      },
      plotOptions: {
        column: {
          stacking: 'percent',
          dataLabels: {
            enabled: true,
            format: '{point.percentage:.0f}%',
          },
        },
      },
      series: [...series], // Only new data
    };
    this.updateFlag = false;
    setTimeout(() => {
      this.updateFlag = true;
    }, 0);
  }

  YearsVersusGovernoratesChart(series) {
    if (
      this.YearsVersusGovernoratesOptions &&
      this.YearsVersusGovernoratesOptions.series
    ) {
      this.YearsVersusGovernoratesOptions.series = []; // Clear existing series
    }
    this.YearsVersusGovernoratesOptions = {
      chart: {
        type: 'column',
      },
      title: {
        text: null,
      },
      xAxis: {
        categories: this.RatesOverYearsVersusGovernoratesStackedItems,
        title: {
          text: this.CasesRatesOverYearsVersusGovernoratesData.xAxisTitle,
        },
      },
      yAxis: {
        min: 0,
        title: {
          text: this.CasesRatesOverYearsVersusGovernoratesData.yAxisTitle,
        },
      },
      tooltip: {
        pointFormat:
          '<span style="color:{series.color}">{series.name}</span>' +
          ': <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
        shared: true,
      },
      plotOptions: {
        column: {
          stacking: 'percent',
          dataLabels: {
            enabled: true,
            format: '{point.percentage:.0f}%',
          },
        },
      },
      series: [...series], // Only new data
    };
    this.updateFlag = false;
    setTimeout(() => {
      this.updateFlag = true;
    }, 0);
  }

  DistributedOverYearsChart(series) {
    if (
      this.DistributedOverYearsOptions &&
      this.DistributedOverYearsOptions.series
    ) {
      this.DistributedOverYearsOptions.series = []; // Clear existing series
    }
    this.DistributedOverYearsOptions = {
      chart: {
        type: 'line',
      },
      title: {
        text: null,
      },
      xAxis: {
        categories: this.DistributedOverYearsStackedItems,
        title: {
          text: this.DistributedOverYearsData.xAxisTitle,
        },
      },
      yAxis: {
        title: {
          text: this.DistributedOverYearsData.yAxisTitle,
        },
      },
      plotOptions: {
        line: {
          dataLabels: {
            enabled: true,
          },
          enableMouseTracking: false,
        },
      },
      series: [...series], // Only new data
    };
    this.updateFlag = false;
    setTimeout(() => {
      this.updateFlag = true;
    }, 0);
  }

  InfectedYearsVersusGovernoratesChart(series) {
    if (
      this.InfectedYearsVersusGovernoratesOptions &&
      this.InfectedYearsVersusGovernoratesOptions.series
    ) {
      this.InfectedYearsVersusGovernoratesOptions.series = []; // Clear existing series
    }
    this.InfectedYearsVersusGovernoratesOptions = {
      chart: {
        type: 'column',
      },
      title: {
        text: null,
      },
      xAxis: {
        categories: this.InfectedRatesOverYearsVersusGovernoratesStackedItems,
        title: {
          text: this.InfectedCasesRatesOverYearsVersusGovernoratesData
            .xAxisTitle,
        },
      },
      yAxis: {
        min: 0,
        title: {
          text: this.InfectedCasesRatesOverYearsVersusGovernoratesData
            .yAxisTitle,
        },
      },
      tooltip: {
        pointFormat:
          '<span style="color:{series.color}">{series.name}</span>' +
          ': <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
        shared: true,
      },
      plotOptions: {
        column: {
          stacking: 'percent',
          dataLabels: {
            enabled: true,
            format: '{point.percentage:.0f}%',
          },
        },
      },
      series: [...series], // Only new data
    };
    this.updateFlag = false;
    setTimeout(() => {
      this.updateFlag = true;
    }, 0);
  }

  InvestigationsTimingsChart(series) {
    if (
      this.InvestigationsTimingsOptions &&
      this.InvestigationsTimingsOptions.series
    ) {
      this.InvestigationsTimingsOptions.series = []; // Clear existing series
    }
    this.InvestigationsTimingsOptions = {
      chart: {
        type: 'column',
      },
      title: {
        text: null,
      },
      xAxis: {
        categories: this.InvestigationsTimingsStackedItems,
        title: {
          text: this.InvestigationsTimingsData.xAxisTitle,
        },
      },
      yAxis: {
        min: 0,
        title: {
          text: this.InvestigationsTimingsData.yAxisTitle,
        },
      },
      tooltip: {
        pointFormat:
          '<span style="color:{series.color}">{series.name}</span>' +
          ': <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
        shared: true,
      },
      plotOptions: {
        column: {
          stacking: 'percent',
          dataLabels: {
            enabled: true,
            format: '{point.percentage:.0f}%',
          },
        },
      },
      series: [...series], // Only new data
    };
    this.updateFlag = false;
    setTimeout(() => {
      this.updateFlag = true;
    }, 0);
  }

  InfectedDistributedOverYearsChart(series) {
    if (
      this.InfectedDistributedOverYearsOptions &&
      this.InfectedDistributedOverYearsOptions.series
    ) {
      this.InfectedDistributedOverYearsOptions.series = []; // Clear existing series
    }
    this.InfectedDistributedOverYearsOptions = {
      chart: {
        type: 'line',
      },
      title: {
        text: null,
      },
      xAxis: {
        categories: this.InfectedDistributedOverYearsStackedItems,
        title: {
          text: this.InfectedDistributedOverYearsData.xAxisTitle,
        },
      },
      yAxis: {
        title: {
          text: this.InfectedDistributedOverYearsData.yAxisTitle,
        },
      },
      plotOptions: {
        line: {
          dataLabels: {
            enabled: true,
          },
          enableMouseTracking: false,
        },
      },
      series: [...series], // Only new data
    };
    this.updateFlag = false;
    setTimeout(() => {
      this.updateFlag = true;
    }, 0);
  }

  DistributionOfDeathsByGenderChart(series) {
    if (
      this.DistributionOfDeathsByGenderOptions &&
      this.DistributionOfDeathsByGenderOptions.series
    ) {
      this.DistributionOfDeathsByGenderOptions.series = []; // Clear existing series
    }
    this.DistributionOfDeathsByGenderOptions = {
      chart: {
        type: 'pie',
      },
      title: {
        text: null,
      },
      tooltip: {
        valueSuffix: '%',
      },
      subtitle: {
        text: null,
      },
      legend: {
        enabled: true,
        align: 'center',
        verticalAlign: 'bottom',
        layout: 'horizontal',
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
          },
          showInLegend: true,
        },
        series: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: [
            {
              enabled: true,
              distance: 20,
            },
            {
              enabled: true,
              distance: -40,
              format: '{point.percentage:.1f}%',
              style: {
                fontSize: '1.2em',
                textOutline: 'none',
                opacity: 0.7,
              },
              filter: {
                operator: '>',
                property: 'percentage',
                value: 10,
              },
            },
          ],
        },
      } as any,
      series: [
        {
          name: 'Percentage',
          colorByPoint: true,
          data: series,
        },
      ] as any,
    };
    this.updateFlag = false;
    setTimeout(() => {
      this.updateFlag = true;
    }, 0);
  }

  DistributionOfDeathsByCaseDiagnosisChart(series) {
    if (
      this.DistributionOfDeathsByCaseDiagnosisOptions &&
      this.DistributionOfDeathsByCaseDiagnosisOptions.series
    ) {
      this.DistributionOfDeathsByCaseDiagnosisOptions.series = []; // Clear existing series
    }
    this.DistributionOfDeathsByCaseDiagnosisOptions = {
      chart: {
        type: 'pie',
      },
      title: {
        text: null,
      },
      tooltip: {
        valueSuffix: '%',
      },
      subtitle: {
        text: null,
      },
      legend: {
        enabled: true,
        align: 'center',
        verticalAlign: 'bottom',
        layout: 'horizontal',
      },
      colors: ['#a2343d', '#0b844f', '#efe198'], // Custom colors for slices
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
          },
          showInLegend: true,
        },
        series: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: [
            {
              enabled: true,
              distance: 20,
            },
            {
              enabled: true,
              distance: -40,
              format: '{point.percentage:.1f}%',
              style: {
                fontSize: '1.2em',
                textOutline: 'none',
                opacity: 0.7,
              },
              filter: {
                operator: '>',
                property: 'percentage',
                value: 10,
              },
            },
          ],
        },
      } as any,
      series: [
        {
          name: 'Percentage',
          colorByPoint: true,
          data: series,
        },
      ] as any,
    };
    this.updateFlag = false;
    setTimeout(() => {
      this.updateFlag = true;
    }, 0);
  }

  DistributionOfDeathsByAgeRangeChart() {
    if (
      this.DistributionOfDeathsByAgeRangeOptions &&
      this.DistributionOfDeathsByAgeRangeOptions.series
    ) {
      this.DistributionOfDeathsByAgeRangeOptions.series = []; // Clear existing series
    }
    this.DistributionOfDeathsByAgeRangeOptions = {
      chart: {
        type: 'bar',
      },
      title: {
        text: '',
      },
      xAxis: {
        categories: this.DistributionOfDeathsByAgeRangeXLabel,
        title: {
          text: this.DistributionOfDeathsByAgeRangeData.xAxisTitle,
        },
        accessibility: {
          description: 'DistributionOfDeathsByAgeRange',
        },
        labels: {
          style: {
            color: '#000000',
          },
        },
      },
      yAxis: {
        min: 0,
        tickInterval: 1,
        title: {
          text: this.DistributionOfDeathsByAgeRangeData.xAxisTitle,
        },
        accessibility: {
          description: 'DistributionOfDeathsByAgeRange',
        },
        labels: {
          overflow: 'justify',
          format: '{value}',
          style: {
            color: '#000000',
          },
        },
      },
      plotOptions: {
        bar: {
          borderRadius: 12,
          dataLabels: {
            enabled: true,
            format: '{y}',
          },
        },
      },
      tooltip: {
        valueSuffix: '{y}',
        stickOnContact: true,
        backgroundColor: 'rgba(255, 255, 255, 0.93)',
      },
      legend: {
        enabled: false,
      },
      series: [
        {
          name: 'Organic farming area',
          color: '#0778be',
          borderColor: '#0778be',
          data: this.DistributionOfDeathsByAgeRangeYValue,
        } as any,
      ],
    };
  }

  getPageData() {
    let key = JSON.parse(localStorage.getItem('ls.authorizationData'));
    let userId = key.userId;
    this.userType = key.userType;
    this.lookupsService.getDashBoardsByUserId(userId).subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.AllData = result.data;
          this.Charts = this.Charts.filter((m) =>
            result.data.chartNumbers.includes(m.id)
          );
          this.cards = this.cards.filter((m) =>
            result.data.cardNumbers.includes(m.id)
          );
          let healthAdministrationId = JSON.parse(
            localStorage.getItem('ls.authorizationData')
          ).user.healthAdministrationId;
          this.cards.forEach((element) => {
            if (element.id == 1) {
              this.lookupsService
                .getConnectedUsers({
                  GovenmentId: this.levelId != 1 ? this.governmentId : null,
                  HealthAdministrationId:
                    this.levelId != 1 && this.levelId != 2
                      ? this.administrtionId
                      : null,
                  incidentSourceId:
                    this.levelId != 1 && this.levelId != 2 && this.levelId != 3
                      ? this.incidentId
                      : null,
                })
                .subscribe((result: any) => {
                  if (result.data.length > 0) {
                    element.value = result.data.length;
                  }
                });
            }
            if (element.id == 2) {
              healthAdministrationId = null;
              let govenmentId = null;
              let incidentSourceId = null;
              this.generalDataService
                .getAllDashboard({
                  incidentGovernmentId:
                    this.levelId != 1 ? this.governmentId : null,
                  incidentHealthAdministrationId:
                    this.levelId != 1 && this.levelId != 2
                      ? this.administrtionId
                      : null,
                  incidentSourceId:
                    this.levelId != 1 && this.levelId != 2 && this.levelId != 3
                      ? this.incidentId
                      : null,
                  incidentDepartmentId: null,
                  startDate: null,
                  fullName: '',
                  endDate: null,
                  nationalityId: 1,
                  nationalId: null,
                  passportNo: null,
                  relativeTypeId: null,
                  HomeGovernmentId: null,
                  HomeHealthAdministrationId: null,
                  HomeHealthOfficeId: null,
                  pageIndex: 0,
                  pageSize: 10,
                  filterType: 1,
                })
                .subscribe((result: any) => {
                  if (result.data.length > 0) {
                    element.value = result.data[0].totalCount;
                  }
                });
            }
            //if (element.id == 3) {
            //  this.generalDataService.getAll(
            //    {
            //      incidentGovernmentId: (this.levelId != -1) ? this.governmentId : null,
            //      incidentHealthAdministrationId: (this.levelId != -1 && this.levelId != 2) ? this.administrtionId : null,
            //      incidentSourceId: (this.levelId != 1 && this.levelId != 2 && this.levelId != 3) ? this.incidentId : null,
            //      pageSize: 10,
            //      pageIndex: 0,
            //      sortColumn: '',
            //      sortOrder: '',
            //      searchText: '',
            //      filterType: 2,
            //      InvestigationStatus: 1,
            //      isInvistegationDone: true,
            //      firstTime: true
            //    }
            //  ).subscribe(
            //    (result: any) => {
            //      if (result.data.length > 0)
            //        element.value = result.data[0].totalCount;
            //    }

            //  );
            //}
            if (element.id == 4) {
              this.generalDataService
                .getAllDashboard({
                  pageSize: 10,
                  pageIndex: 0,
                  incidentGovernmentId:
                    this.levelId != 1 ? this.governmentId : null,
                  incidentHealthAdministrationId:
                    this.levelId != 1 && this.levelId != 2
                      ? this.administrtionId
                      : null,
                  incidentSourceId:
                    this.levelId != 1 && this.levelId != 2 && this.levelId != 3
                      ? this.incidentId
                      : null,
                  sortColumn: '',
                  sortOrder: '',
                  searchText: '',
                  filterType: 2,
                  InvestigationStatus: '2',
                  isInvistegationDone: false,
                  firstTime: true,
                })
                .subscribe((result: any) => {
                  if (result.data.length > 0)
                    element.value = result.data[0].totalCount;
                });
            }
            if (element.id == 5) {
              this.zeroInstantNotificationService
                .getPageNotifications({
                  pageSize: 10,
                  pageIndex: 0,
                  sortColumn: '',
                  sortOrder: '',
                  searchText: '',
                  isZero: true,
                  incidentGovernmentId:
                    this.levelId != 1 ? this.governmentId : null,
                  incidentHealthAdministrationId:
                    this.levelId != 1 && this.levelId != 2
                      ? this.administrtionId
                      : null,
                  incidentSourceId:
                    this.levelId != 1 && this.levelId != 2 && this.levelId != 3
                      ? this.incidentId
                      : null,
                })
                .subscribe((result: any) => {
                  if (result.data.length > 0)
                    element.value = result.data[0].totalCount;
                });
            }
            if (element.id == 6) {
              this.generalDataService
                .getTimePerctenage({
                  incidentGovernmentId:
                    this.levelId != 1 ? this.governmentId : null,
                  incidentHealthAdministrationId:
                    this.levelId != 1 && this.levelId != 2
                      ? this.administrtionId
                      : null,
                  incidentSourceId:
                    this.levelId != 1 && this.levelId != 2 && this.levelId != 3
                      ? this.incidentId
                      : null,
                })
                .subscribe((result: any) => {
                  if (result.data) element.value = result.data.toFixed(2) + '%';
                });
            }
            if (element.id == 7) {
              this.generalDataCompletionServiceService
                .getPageGeneralDataCompletions2({
                  pageSize: 10,
                  pageIndex: 0,
                  sortColumn: '',
                  sortOrder: '',
                  searchText: '',
                  incidentGovernmentId:
                    this.levelId != 1 ? this.governmentId : null,
                  incidentHealthAdministrationId:
                    this.levelId != 1 && this.levelId != 2
                      ? this.administrtionId
                      : null,
                  incidentSourceId:
                    this.levelId != 1 && this.levelId != 2 && this.levelId != 3
                      ? this.incidentId
                      : null,
                  incidentDepartmentId: null,
                  caseDiscoveryFromDate: null,
                  caseDiscoveryToDate: null,
                  isNullNationalIdOrPassport: true,
                  isNullMaritalStatusId: true,
                  isNullInfectionDate: true,
                  isNullTestCheck: true,
                  isNullMobile: true,
                  isNullGetSampleDate: true,
                  isNullHospitalEntryDate: true,
                  isNullTestResult: true,
                  isNullPatientJobId: true,
                  isNullTestResultDate: true,
                  isNullHospitalLeaveDate: true,
                  isNullLivingAddress: true,
                  isNullDiseaseSeverity: true,
                  isNullFinalResult: true,
                })
                .subscribe((result: any) => {
                  var totalCount;
                  if (result.data.length > 0) {
                    totalCount = result.data[0].totalCount;
                  }
                  this.generalDataService
                    .getAll({
                      pageSize: 10,
                      pageIndex: 0,
                      sortColumn: '',
                      sortOrder: '',
                      searchText: '',
                      filterType: 1,
                      InvestigationStatus: 0,
                      isInvistegationDone: null,
                      incidentGovernmentId:
                        this.levelId != 1 ? this.governmentId : null,
                      incidentHealthAdministrationId:
                        this.levelId != 1 && this.levelId != 2
                          ? this.administrtionId
                          : null,
                      incidentSourceId:
                        this.levelId != 1 &&
                          this.levelId != 2 &&
                          this.levelId != 3
                          ? this.incidentId
                          : null,
                    })
                    .subscribe((res: any) => {
                      if (res.data.length > 0 && totalCount != undefined) {
                        element.value =
                          res.data[0].totalCount != 0
                            ? (
                              (parseFloat(totalCount.toString()) /
                                parseFloat(
                                  res.data[0].totalCount.toString()
                                )) *
                              100
                            ).toFixed(2) + '%'
                            : '0%';
                      }
                    });
                });
            }
            if (element.id == 8) {
              this.notInferringService
                .getPageNotInferrings({
                  pageSize: 10,
                  pageIndex: 0,
                  sortColumn: '',
                  sortOrder: '',
                  searchText: '',
                  incidentGovernmentId:
                    this.levelId != 1 ? this.governmentId : null,
                  incidentHealthAdministrationId:
                    this.levelId != 1 && this.levelId != 2
                      ? this.administrtionId
                      : null,
                  incidentSourceId:
                    this.levelId != 1 && this.levelId != 2 && this.levelId != 3
                      ? this.incidentId
                      : null,
                  isMobileType: false, //1
                  isAddress: false, //2
                  isOtherType: false, //3
                  isGovernmentType: false, //4
                  isHelthAdminType: false, //5
                  misInvistegationType: [] as number[],
                  firstTime: true,
                })
                .subscribe((result: any) => {
                  if (result.data.length > 0)
                    element.value = result.data[0].totalCount;
                });
            }
            if (element.id == 9) {
              this.labService
                .getPatientsDashboard({
                  pageSize: 10,
                  pageIndex: 0,
                  sortColumn: '',
                  sortOrder: '',
                  searchText: '',
                  id: null,
                  nationalityId: null,
                  homeGovernmentId: null,
                  homeHealthAdministrationId: null,
                  homeCityId: null,
                  homeHealthOfficeId: null,
                  homePrincipalityId: null,
                  fullName: null,
                  nationalId: null,
                  passportNo: null,
                  livingAddress: null,
                  phoneNo: null,
                  fromDate: null,
                  toDate: null,
                  insertedByLab: null,
                  hasLabChecks: false,
                  incidentGovernmentId:
                    this.levelId != 1 ? this.governmentId : null,
                  incidentHealthAdministrationId:
                    this.levelId != 1 && this.levelId != 2
                      ? this.administrtionId
                      : null,
                  incidentSourceId:
                    this.levelId != 1 && this.levelId != 2 && this.levelId != 3
                      ? this.incidentId
                      : null,
                })
                .subscribe((result: any) => {
                  if (result.data.length > 0)
                    element.value = result.data[0].totalCount;
                });
            }
          });
        }
        this.loadingPanel = false;
      },
      (error) => {
        this.loadingPanel = false;
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      },
      () => {
        setTimeout(() => {
          this.firechartSSSS();
        }, 1000);
      }
    );
  }

  ConvertChart(id) {
    switch (id) {
      case 1:
        this.currentCart2 = this.chart1;
        break;
      case 2:
        this.currentCart2 = this.chart2;
        break;
      case 3:
        this.currentCart2 = this.charts3;
        break;
      case 4:
        this.currentCart2 = this.chart4;
        break;
      case 5:
        this.currentCart2 = this.chart5;
        break;
      case 6:
        this.currentCart2 = this.chart6;
        break;
      case 7:
        this.currentCart2 = this.charts7;
        break;
      case 8:
        this.currentCart2 = this.chart8;
        break;
      case 9:
        this.currentCart2 = this.chart9;
        break;
      case 10:
        this.currentCart2 = this.chart10;
        break;
      case 11:
        this.currentCart2 = this.charts11;
        break;
      case 12:
        this.currentCart2 = this.chart12;
        break;
      case 13:
        this.currentCart2 = this.chart13;
        break;
      case 14:
        this.currentCart2 = this.chart14;
        break;
      case 15:
        this.currentCart2 = this.charts15;
        break;

      default:
        break;
    }
    if (this.type == 1) {
      this.type = 2;
      this.currentCart2.transform('pie');
    } else {
      this.type = 1;
      this.currentCart2.transform('bar');
    }
  }
  getGovernments() {
    this.lookupsService.getAllGovernments().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.governments = result.data;
          let govenmentId = JSON.parse(
            localStorage.getItem('ls.authorizationData')
          ).user.govenmentId;

          //if (this.levelId != 1) {
          this.selectedGovernment.push(
            this.governments.find((gov) => gov.id === this.governmentId)
          );

          if (this.governments?.length > 0) {
            var userGov = this.governments.find((d) => d.id == govenmentId);
            this.selectedGovernment.push(userGov);
          }
          this.onGovernmentChanged();
          //}
        }
        this.loadingPanel = false;
      },
      (error) => {
        this.loadingPanel = false;
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }
  getAllFinalResults() {
    this.lookupsService.getAllFinalResults().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.AllFinalResults = result.data;
        }
        this.loadingPanel = false;
      },
      (error) => {
        this.loadingPanel = false;
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }

  getDepartments() {
    this.lookupsService.getAllDepartments().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.departments = result.data;
        }
        this.loadingPanel = false;
      },
      (error) => {
        this.loadingPanel = false;
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }

  onGovernmentChanged() {
    if (this.selectedGovernment.length > 0) {
      this.getHealthAdministration(this.selectedGovernment[0].id);
    } else {
      this.healthAdministration = [];
    }
  }
  getHealthAdministration(governmentID: any) {
    this.lookupsService
      .getPageHealthAdministrations({ governmentID: governmentID })
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.healthAdministration = result.data;
            if (this.levelId != 1 && this.levelId != 2) {
              this.selectedHealthAdministration = this.administrtionId;
              this.onHealthAdministrationChanged();
            }
          }
          this.loadingPanel = false;
        },
        (error) => {
          this.loadingPanel = false;
          this.translateService
            .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
        }
      );
  }
  getIncidentSources(healthAdministrationID: any) {
    //, reportingOrResidence: 1
    this.lookupsService
      .getPageIncidentSourceHospitals({
        healthAdministrationID: healthAdministrationID,
      })
      .subscribe(
        (result: any) => {
          console.log('DATA TO TEST', result);
          if (result != null && result != undefined) {
            this.incidentSources = result.data;
            if (this.levelId != 1 && this.levelId != 2 && this.levelId != 3) {
              this.selectedIncidentSource = this.incidentId;
            } else {
              this.selectedIncidentSource = this.incidentSources[0];
            }
          }
          this.loadingPanel = false;
        },
        (error) => {
          this.loadingPanel = false;
          this.translateService
            .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
        }
      );
  }
  onHealthAdministrationChanged() {
    if (this.selectedHealthAdministration != undefined) {
      this.getIncidentSources(this.selectedHealthAdministration);
    } else {
      this.incidentSources = [];
    }
  }
  getJobs() {
    this.lookupsService.getAllPatientJobs().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.jobs = result.data;
        }
        this.loadingPanel = false;
      },
      (error) => {
        this.loadingPanel = false;
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }
  getDiseases() {
    this.lookupsService.getAllDiseases().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.diseases = result.data;
        }
        this.loadingPanel = false;
      },
      (error) => {
        this.loadingPanel = false;
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }

  getDiseaseGroups() {
    this.lookupsService.getAllDiseaseGroups().subscribe({
      next: (data) => {
        this.diseasesGroups = data.data;
      },
      error: (error) => {
        this.loadingPanel = false;
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      },
      complete: () => { },
    });
  }
  ngAfterViewInit() {
    let collapse: boolean[] = [];
    $('.closeBtn').click(function () {
      $(this).closest('div').hide();
    });

    $('.Minimize').click(function () {
      let _id = $(this).attr('id');
      $('#container' + _id).slideToggle(50);
      if (undefined == collapse[_id]) collapse[_id] = true;
      if (collapse[_id]) {
        $(this).closest('div').css('transition-duration', '.5s');
        // .css('height', '0rem');
        collapse[_id] = false;
      } else {
        $(this).closest('div').css('transition-duration', '.5s');
        // .css('height', '20rem');
        collapse[_id] = true;
      }
    });

    let i = 0;
    $('.toggelBtn').on('click', function () {
      if (i == 0) {
        $('.pi-chevron-down').attr('class', 'pi pi-chevron-up');
        i++;
      } else {
        $('.pi-chevron-up').attr('class', 'pi pi-chevron-down');
        i--;
      }

      $('#craiteria').toggle(600).css('display', 'flex');
    });

    //this.chart1 = c3.generate({
    //  bindto: '#chart1',
    //  size: {
    //    height: 260,
    //    width: 0
    //  },
    //  zoom: {
    //    enabled: true,
    //  },
    //  data: {
    //    type: 'bar',
    //    types: {
    //      معدل_الاصابة: 'line',
    //    },
    //    columns: [
    //      ['معدل_ابلاغ_الامراض', 3500],
    //      ['معدل_الاصابة', 30000],
    //    ],
    //  },
    //  axis: {
    //    x: {
    //      type: 'category',
    //      categories: [ '2023'],
    //    },
    //    y: {
    //      tick: {
    //        outer: true,
    //      },
    //    },
    //  },
    //  bar: {
    //    width: {
    //      ratio: 0.5, // this makes bar width 50% of length between ticks
    //    },
    //    // or
    //    //width: 100 // this makes bar width 100px
    //  },
    //});

    this.chart2 = c3.generate({
      bindto: '#chart2',
      size: {
        height: 260,
        width: 0,
      },
      grid: {
        lines: {
          front: false,
        },
        y: {
          lines: [
            { value: 2000, text: 'My cool label at value 150', class: 'red' },
          ],
        },
        x: {
          lines: undefined,
        },
      },
      data: {
        type: 'bar',
        types: {
          معدل_الاصابة: 'line',
        },
        columns: [['المبلغة', 3000]],
        axes: {
          المبلغة: 'y2',
        },
      },
      legend: {
        position: 'inset',
      },

      axis: {
        x: {
          padding: { left: -0.1, right: -0.1 },
          type: 'category',
          tick: {
            rotate: -90,
            multiline: false,
          },
          categories: ['القاهره '],
        },
        y: { show: false },

        y2: {
          // padding: {top: 100, bottom: 100},
          label: 'معدل الاصابة',
          show: true,
        },
      },
      bar: {
        width: {
          ratio: 0.3, // this makes bar width 50% of length between ticks
        },
        // or
        //width: 100 // this makes bar width 100px
      },
    });

    this.charts3 = c3.generate({
      bindto: '#chart3',
      // grid: {
      //   lines: {
      //     front: false
      //   },
      //   y : {

      //     lines: [
      //         {value: 0},
      //     ]
      // }

      // },
      size: {
        height: 250,
        width: 0,
      },
      legend: {
        // padding: 20,
        position: 'inset',
      },
      data: {
        type: 'bar',
        labels: true,
        types: {
          معدل_الاصابة: 'line',
        },
        columns: [['المبلغة', 3000]],
        axes: {
          معدل_الاصابة: 'y2',
        },
      },

      axis: {
        x: {
          show: true,
          type: 'category',
          categories: ['القاهرة'],
          tick: {
            rotate: -90,
            multiline: false,
          },
        },
        y: { show: true },
        y2: {
          padding: { top: 10, bottom: 10 },
          label: 'معدل الاصابة',
          show: false,
        },
      },
      bar: {
        width: {
          ratio: 0.5, // this makes bar width 50% of length between ticks
        },
        // or
        //width: 100 // this makes bar width 100px
      },
    });

    this.chart4 = c3.generate({
      bindto: '#chart4',
      size: {
        height: 250,
        width: 0,
      },
      legend: {
        // padding: 200,
        hide: true,
        position: 'inset',
      },
      data: {
        type: 'bar',
        labels: true,
        types: {
          معدل_الاصابة: 'line',
        },
        columns: [['معدل_الاصابة', 3000]],
        axes: {
          معدل_الاصابة: 'y2',
        },
      },

      axis: {
        x: {
          show: true,
          type: 'category',
          tick: {
            rotate: -90,

            multiline: false,
          },
          // height: 200,
          // padding: { right: 20, left: 20 },
          categories: ['القاهرة'],
        },
        y: { show: true },
        y2: {
          padding: { top: 20, bottom: 20 },
          label: 'معدل الاصابة',
          show: false,
        },
      },
      bar: {
        width: {
          ratio: 0.5, // this makes bar width 50% of length between ticks
        },
        // or
        //width: 100 // this makes bar width 100px
      },
    });
  }
  getCaseCategories() {
    this.lookupsService.getAllCaseResultCategorys().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.Categories = result.data;
        }
        this.loadingPanel = false;
      },
      (error) => {
        this.loadingPanel = false;
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }
  changeChart2Data() {
    this.chart2.load({
      columns: [
        ['المبلغة', 350000, 300000, 100000, 45000, 150000, 45000, 200000],
        ['2المبلغة', 150000, 100000, 100000, 20000, 250000, 30000, 100000],
      ],
    });
    setTimeout(() => {
      this.chart2.ygrids([
        { value: 150000, text: 'My cool label at value 150', class: 'red' },
      ]);
    }, 1000);
    setTimeout(() => {
      this.chart2.ygrids([]);
      this.chart2.transform('pie');
    }, 2000);
  }

  timePeriods = [
    { label: 'اجمالي عدد السكان', value: 110251275, icon: 'pi-users' },
    {
      label: 'اجمالي عدد المصابين',
      value: 110251275,
      icon: 'pi-exclamation-circle',
    },
    { label: ' نسبة الاصابة ', value: '24.3%', icon: 'pi-chart-pie' },
    { label: ' عدد المستخدمين', value: 110251275, icon: 'pi-user' },
  ];

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.timePeriods, event.previousIndex, event.currentIndex);
  }
  todo = ['chart2', 'chart3'];

  done = [
    { chart: 'chart1', label: 'معدل ابلاغ حالات الامراض بالسنوات' },
    { chart: 'chart4', label: 'معدل ابلاغ حالات الامراض بالفترة الزمنية' },
    { chart: 'chart2', label: 'معدل ابلاغ حالات الامراض بالمحافظات' },
    { chart: 'chart3', label: 'معدل ابلاغ حالات الامراض ' },
  ];

  drop2(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
  drop3(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.done, event.previousIndex, event.currentIndex);
  }

  show() {
    //------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------
  }

  ChangeCart() {
    if (this.selectedChart) {
      this.currentCart = this.selectedChart[0].id;
    }

    if (this.currentCart == 4) {
      this.DropDownOptin = this.singleDropdownSettings;
    }
  }
  methodChange() {
    if (this.selectedReportMethod != 0) {
      if (this.selectedReportMethod == 1) {
        this.startDate = 1;
        this.endDate = 52;
        this.max = 52;
      } else if (this.selectedReportMethod == 2) {
        this.max = 12;
        this.startDate = 1;
        this.endDate = 12;
      } else {
        this.max = 4;
        this.startDate = 1;
        this.endDate = 4;
      }
    }
  }
  DefineChart1() {
    this.chart1 = c3.generate({
      bindto: '#chart1',
      size: {
        height: 260,
        width: 0,
      },
      zoom: {
        enabled: true,
      },
      legend: {
        position: 'inset',
      },
      data: {
        type: 'bar',
        types: {
          معدل_الاصابة: 'line',
        },

        columns: [
          ['معدل ابلاغ حالات الامراض بالسنوات'], //pepole count having specific disease / people count
        ],
        // axes: {
        //   : 'x',

        //     // معدل_ابلاغ_الامراض: 'y2'
        // }
      },
      axis: {
        x: {
          type: 'category',
          tick: {
            rotate: -90,
            multiline: false,
          },
          categories: ['2022', '2023'],
        },
        y: {
          tick: {
            outer: true,
          },
        },
      },
      bar: {
        width: {
          ratio: 0.5, // this makes bar width 50% of length between ticks
        },
      },
    });
  }

  onFilteredChartChanged() {
    this.selectedyears = [];
    if (this.levelId == 1) {
      this.selectedGovernment = [];
    }
    this.selectedDiseases = [];
    this.startDate = 1;
    this.endDate = 52;
    this.DropDownOptin = this.multipleDropdownSettings;
    if (this.filteredChart == 1 || this.filteredChart == 4) {
      if (this.filteredChart == 4) {
        this.DropDownOptin = this.singleDropdownSettings;
      }
      this.yearsOptions = [
        { id: -1, arabicName: ' إختر', englishName: 'Select' },
        { id: 1, arabicName: 'سنوات محدده', englishName: 'Period by Years' },
      ];
    } else if (this.filteredChart == 3) {
      this.yearsOptions = [
        { id: -1, arabicName: ' إختر', englishName: 'Select' },
        {
          id: 5,
          arabicName: ' الفتره بالسنوات و مده محدده',
          englishName: 'Specific Period',
        },
      ];
    } else {
      this.yearsOptions = [
        { id: -1, arabicName: ' إختر', englishName: 'Select' },
        { id: 1, arabicName: 'سنوات محدده', englishName: 'Period by Years' },
        { id: 2, arabicName: 'الفتره بالتاريخ', englishName: 'Period by Date' },
        { id: 3, arabicName: 'الفتره بالسنوات', englishName: 'Specific Years' },
        {
          id: 4,
          arabicName: 'سنه/أسابيع محدده ',
          englishName: 'Specific Year/Week',
        },
        { id: 5, arabicName: 'مده محدده', englishName: 'Specific Period' },
      ];
    }
  }
  Allcharts = {
    1: () => {
      try {
        var yearslist = [];
        this.selectedyears?.forEach((element) => {
          yearslist.push(element.arabicName);
        });
        if (yearslist.length == 0) {
          yearslist.push(this.date.getFullYear());
        }
        var diseaseId = 0;
        if (this.selectedDiseases > 0) {
          diseaseId = this.selectedDiseases;
        }
        this.chartFilter = {
          year: yearslist,
          disease_Id: diseaseId,
        };
        if (this.isModifingView == false) {
          this.lookupsService
            .getReportingRateOfDiseaseCharts(this.chartFilter)
            .subscribe(
              (res) => {
                // ;
                this.yearsToDraw = [];
                this.calculatedData =
                  this.currentLang == 'ar'
                    ? ['معدل ابلاغ حالات الامراض بالسنوات']
                    : ['Disease case reporting rate in years']; //pepole count having specific disease / people count
                res.data.forEach((element) => {
                  this.yearsToDraw.push(element.year);
                  this.calculatedData.push(
                    Math.round(
                      (element.numOfCases / element.numOfOPeople) * 100000
                    )
                  );
                });
                this.DefineChart1();
                this.chart1.categories(this.yearsToDraw);
                this.chart1.load({
                  columns: [this.calculatedData],
                });
              },
              (error) => {
                this.loadingPanel = false;
                //this.translateService
                //  .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
                //  .subscribe((res: string) => {
                //    this.userMsg.error(res);
                //  });
              }
            );
        } else {
          this.isModifingView = true;
          this.chart1 = c3.generate({
            bindto: '#chart1',
            size: {
              height: 260,
              width: 0,
            },
            zoom: {
              enabled: true,
            },
            data: {
              type: 'bar',
              types: {
                معدل_الاصابة: 'line',
              },
              columns: [
                ['معدل_ابلاغ_الامراض', 3500, 3000],
                ['معدل_الاصابة', 35000, 10000],
              ],
              // axes: {
              //   : 'x',

              //     // معدل_ابلاغ_الامراض: 'y2'
              // }
            },
            axis: {
              x: {
                type: 'category',
                categories: ['2022', '2023'],
              },
              y: {
                tick: {
                  outer: true,
                },
              },
            },
            bar: {
              width: {
                ratio: 0.5, // this makes bar width 50% of length between ticks
              },
            },
          });
        }
      } catch (err) {
        console.log('fail card 1 with err : ' + err);
      }
    },
    2: () => {
      try {
        this.governmentIds = '';
        this.selectedGovernment.forEach((element) => {
          if (this.levelId == 2) {
            if (element) {
              this.governmentIds = this.governmentIds + element.id + ',';
            }
          } else {
            if (element.length != 0) {
              element.forEach((e) => {
                this.governmentIds = this.governmentIds + e.id + ',';
              });
            }
          }
        });
        this.governmentIds = this.governmentIds.substring(
          0,
          this.governmentIds.length - 1
        );

        if (this.governmentIds == '') {
          this.governmentIds = '-1';
        }
        if (this.isModifingView == false) {
          this.lookupsService.getSecondChartById(this.governmentIds).subscribe(
            (res) => {
              this.yearsToDraw2 = [];
              this.calculatedDataGov = ['المبلغة'];
              if (res.data != null) {
                res.data.forEach((element) => {
                  this.yearsToDraw2.push(element.governmentAr);
                  var calculatedNumner =
                    element.population != undefined && element.population != 0
                      ? (element.patientCount / element.population) * 100000
                      : 0;
                  this.calculatedDataGov.push(Math.round(calculatedNumner));
                });
                this.chart2.categories(this.yearsToDraw2);
                this.chart2.load({
                  columns: [this.calculatedDataGov],
                });
              }
            },
            (error) => {
              this.loadingPanel = false;
              //this.translateService
              //  .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
              //  .subscribe((res: string) => {
              //    this.userMsg.error(res);
              //  });
            }
          );
        } else {
          this.isModifingView = true;
          this.chart2 = c3.generate({
            bindto: '#chart2',
            size: {
              height: 260,
              width: 0,
            },
            grid: {
              lines: {
                front: false,
              },
              y: {
                lines: [
                  {
                    value: 2000,
                    text: 'My cool label at value 150',
                    class: 'red',
                  },
                ],
              },
              x: {
                lines: undefined,
              },
            },
            data: {
              type: 'bar',
              types: {
                معدل_الاصابة: 'line',
              },
              columns: [['المبلغة', 3000]],
              axes: {
                المبلغة: 'y2',
              },
            },

            axis: {
              x: {
                padding: { left: -0.1, right: -0.1 },
                type: 'category',
                categories: ['القاهرة '],
              },
              y: { show: false },
              y2: {
                label: '',
                show: true,
              },
            },
            bar: {
              width: {
                ratio: 0.3, // this makes bar width 50% of length between ticks
              },
            },
          });
        }
      } catch (err) {
        console.log('fail card 2 with err : ' + err);
      }
    },
    3: () => {
      try {
        var diseaseId = 0;
        if (this.selectedDiseases > 0) {
          diseaseId = this.selectedDiseases;
        }
        if (this.isModifingView == false) {
          this.chartFilter2 = {
            disease_Id: diseaseId,
            reportingRate:
              this.selectedReportMethod != 0
                ? parseInt(this.selectedReportMethod)
                : 3,
            startYear:
              this.startSelectedyears != -1 ? this.startSelectedyears : 2023,
            startDate:
              !this.startDate && this.startDate != '' ? this.startDate : 2,
            endYear: this.endSelectedyears != -1 ? this.endSelectedyears : 2024,
            endDate: !this.endDate && this.endDate != '' ? this.endDate : 30,
          };
          this.lookupsService
            .getReportingRateChangeCharts(this.chartFilter2)
            .subscribe(
              (res) => {
                this.yearsToDraw3 = [];
                this.calculatedDataGov3 = ['المبلغة'];
                res.data.forEach((element) => {
                  this.yearsToDraw3.push(element.govName);
                  var calculatedNumber =
                    element.totalPopulation != undefined &&
                      element.totalPopulation != 0
                      ? ((element.first - element.last) /
                        element.totalPopulation) *
                      100000
                      : 0;
                  this.calculatedDataGov3.push(Math.round(calculatedNumber));
                });
                this.charts3.categories(this.yearsToDraw3);
                this.charts3.load({
                  columns: [this.calculatedDataGov3],
                });
              },
              (error) => {
                this.chartFilter = {};
                this.loadingPanel = false;
                //this.translateService
                //  .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
                //  .subscribe((res: string) => {
                //    this.userMsg.error(res);
                //  });
              }
            );
        } else {
          this.isModifingView = true;
          this.charts3 = c3.generate({
            bindto: '#chart3',
            size: {
              height: 260,
              width: 0,
            },
            data: {
              labels: true,
              columns: [['المبلغة', 200]],
              type: 'bar',
            },
            axis: {
              x: {
                show: true,
                type: 'category',
                categories: ['القاهرة '],
                tick: {
                  rotate: -90,
                  multiline: false,
                },
              },
            },
            grid: {
              y: {
                lines: [{ value: 0 }],
              },
            },
          });
        }
      } catch (err) {
        console.log('fail card 3 with err : ' + err);
      }
    },
    4: () => {
      try {
        if (this.isModifingView == false) {
          var years = [];
          if (this.selectedyears != null && this.selectedyears.length > 0) {
            for (var i = 0; i < this.selectedyears.length; i++) {
              years.push(this.selectedyears[i].arabicName);
            }
          }
          if (years.length == 0) {
            years.push(this.date.getFullYear());
          }
          var selectedGov =
            this.levelId != 2 && this.selectedGovernment[0].length > 0
              ? this.selectedGovernment[0][0].id
              : this.levelId == 2
                ? this.selectedGovernment[0].id
                : 1;
          var diseaseId = 0;
          if (this.selectedDiseases > 0) {
            diseaseId = this.selectedDiseases;
          }
          this.chartFilter3 = {
            diseaseID: diseaseId,
            Years: years,
            homeGovernmentID: selectedGov,
          };

          this.lookupsService
            .getReportingInfectionRateByYearCharts(this.chartFilter3)
            .subscribe(
              (res) => {
                this.yearsToDraw4 = [];
                this.sureCalculatedData = ['مؤكد'];
                this.injuryDate = ['معدل_الاصابة'];
                this.unsureCalculatedData = ['محتمل'];
                res.data.forEach((element) => {
                  this.yearsToDraw4.push(element.year);
                  this.sureCalculatedData.push(element.numberOfCertainCases);
                  this.unsureCalculatedData.push(element.numberOfPossibleCases);
                  var calculatedNumber =
                    element.totalPopulation != undefined &&
                      element.totalPopulation != 0
                      ? ((element.numberOfCertainCases +
                        element.numberOfPossibleCases) /
                        element.totalPopulation) *
                      100000
                      : 0;
                  this.injuryDate.push(calculatedNumber);
                });

                this.chart4.categories(this.yearsToDraw4);
                this.chart4.load({
                  columns: [
                    this.sureCalculatedData,
                    this.unsureCalculatedData,
                    this.injuryDate,
                  ],
                });
              },
              (error) => {
                this.chartFilter = {};
                this.loadingPanel = false;
                //this.translateService
                //  .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
                //  .subscribe((res: string) => {
                //    this.userMsg.error(res);
                //  });
              }
            );
        } else {
          this.isModifingView = true;
          this.chart4 = c3.generate({
            bindto: '#chart4',
            // grid: {
            //   lines: {
            //     front: false
            //   },
            //   y : {

            //     lines: [
            //         {value: 0},
            //     ]
            // }

            // },
            size: {
              height: 250,
              width: 0,
            },
            legend: {
              // padding: 20,
              position: 'inset',
            },
            data: {
              type: 'bar',
              labels: true,
              types: {
                معدل_الاصابة: 'line',
              },
              columns: [['معدل_الاصابة', 200]],
              axes: {
                معدل_الاصابة: 'y2',
              },
            },

            axis: {
              x: {
                show: true,
                type: 'category',
                categories: ['القاهرة'],
              },
              y: { show: true },
              y2: {
                padding: { top: 100, bottom: 100 },
                label: '',
                show: false,
              },
            },
            bar: {
              width: {
                ratio: 0.5, // this makes bar width 50% of length between ticks
              },
            },
          });
        }
      } catch (err) {
        console.log('fail card 4 with err : ' + err);
      }
    },
    //5: () => {
    //  try {
    //    if (this.isModifingView == false && this.selectedDiseases.length > 0) {
    //      if (this.selectedDiseases.length > 0) {
    //        this.Diseaseids = this.selectedDiseases;
    //      } else {
    //        this.Diseaseids = "-1";
    //      }
    //      if (this.selectedCaseCategory.length > 0) {
    //        this.selectedCaseCategory?.forEach((element) => {
    //          this.CaseCategryids = this.CaseCategryids + element.id + ',';
    //        });
    //      } else {
    //        this.CaseCategryids = "-1";
    //      }
    //      this.lookupsService
    //        .getCaseResultCategoryReport(
    //          this.Diseaseids,
    //          this.CaseCategryids != null ? this.CaseCategryids.slice(0, -1) : '',
    //          this.datePipe.transform(this.fromDate, 'MM-dd-yyyy'),
    //          this.datePipe.transform(this.toDate, 'MM-dd-yyyy')
    //        )
    //        .subscribe(
    //          (res) => {
    //            this.Diseaseids = '';
    //            this.CaseCategryids = '';
    //            this.myData = res.data;
    //            this.Diseaseids = '';
    //            this.CaseCategryids = '';
    //          },
    //          (err) => {
    //          },
    //          () => {

    //            let i = 0;

    //            let selected = this.diseases.find(s => s.id == this.selectedDiseases)
    //            let name = selected != null ? selected.arabicName : '';
    //            this.yearsToDraw.push(name);

    //            this.yearsToDraw.push("الاجمالي");
    //            this.selectedCaseCategory.forEach(element2 => {
    //              this.ChartData[i] = [element2.arabicName]
    //              this.myData?.forEach((element) => {
    //                this.ChartData[i].push(element.count_of_Pationt[i])
    //              })
    //              this.chart5.load({
    //                columns: [this.ChartData[i]],
    //              });
    //              i++;
    //            });

    //            this.chart5.categories(this.yearsToDraw);

    //            setTimeout(() => {
    //              this.yearsToDraw = [];
    //              this.ChartData = [['.'], ['.'], ['.'], ['.'], ['.'], ['.'], ['.'], ['.'], ['.'], ['.']];
    //            }, 700);

    //          })
    //    }
    //    else {
    //      this.isModifingView = true;
    //      this.chart5 = c3.generate({
    //        bindto: '#chart5',
    //        size: {
    //          height: 250,
    //          width: 0,
    //        },
    //        legend: {
    //          padding: 20,
    //          position: 'bottom',
    //        },
    //        data: {
    //          type: 'pie',
    //          labels: true,
    //          types: {
    //            معدل_الاصابة: 'line',
    //          },
    //          columns: [
    //            ['اجمالي', 350000, 300000, 100000, 45000],
    //            ['التيفود', 35000, 1000, 10000, 4500],
    //            ['البروسيلا', 30200, 302000, 10200, 45000],
    //          ],
    //        },
    //      })
    //    };
    //  } catch (err) {
    //    console.log("fail card 5 with err : " + err);
    //  }
    //},
    //6: () => {
    //  if (this.isModifingView == false && this.selectedDiseases.length > 0) {
    //    this.CaseCategryids = "1,2,3";
    //    var dis ="-1"
    //    if (this.selectedDiseases.length > 0)
    //      dis = this.selectedDiseases;
    //    var cat = "-1";
    //    if (this.CaseCategryids.length>0) cat = this.CaseCategryids;
    //    this.lookupsService
    //      .getCaseResultCategoryReport(
    //        dis,
    //        cat,
    //        this.datePipe.transform(this.fromDate, 'MM-dd-yyyy'),
    //        this.datePipe.transform(this.toDate, 'MM-dd-yyyy')
    //      )
    //      .subscribe(
    //        (res) => {
    //          this.Diseaseids = '';
    //          this.CaseCategryids = '';
    //          this.myData = res.data;
    //          this.Diseaseids = '';
    //          this.CaseCategryids = '';
    //        },
    //        (err) => {
    //        },
    //        () => {
    //          let i = 0;
    //          let selected = this.diseases.find(s => s.id == this.selectedDiseases)
    //          let name = selected != null ? selected.arabicName : '';
    //          this.yearsToDraw.push(name);

    //          this.yearsToDraw.push("الاجمالي");
    //          this.selectedCaseCategory?.forEach(element2 => {
    //            this.ChartData[i] = [element2.arabicName]
    //            this.myData?.forEach((element) => {
    //              this.ChartData[i].push(element.count_of_Pationt[i])
    //            })
    //            this.chart6.load({
    //              columns: [this.ChartData[i]],
    //            });
    //            i++;
    //          });
    //          this.chart6.categories(this.yearsToDraw);

    //          setTimeout(() => {
    //            this.yearsToDraw = [];
    //            this.ChartData = [['.'], ['.'], ['.'], ['.'], ['.'], ['.'], ['.'], ['.'], ['.'], ['.']];
    //          }, 700);

    //        })

    //  } else {
    //    this.isModifingView = true;
    //    this.chart6 = c3.generate({
    //      bindto: '#chart6',

    //      size: {
    //        height: 250,
    //        width: 0,
    //      },
    //      legend: {
    //        padding: 20,
    //        position: 'bottom',
    //      },
    //      data: {
    //        type: 'bar',
    //        labels: true,
    //        types: {
    //          معدل_الاصابة: 'line',
    //        },
    //        columns: [
    //          ['عدد_الحالات', 350000, 300000, 100000],

    //        ],

    //      },

    //      axis: {
    //        x: {
    //          show: true,
    //          type: 'category',
    //          categories: ['مشتبه', 'محتمل', 'مؤكد'],
    //        },

    //      },
    //      bar: {
    //        width: {
    //          ratio: 0.5, // this makes bar width 50% of length between ticks
    //        },

    //      },
    //    })
    //  };
    //},
    //7: () => {
    //  if (this.isModifingView == false && this.selectedIncidentSource.length>0) {
    //    this.ids = this.selectedIncidentSource;
    //    if (!this.ids) { this.ids = "-1" };
    //      let filterDateDTO: any = {
    //        startDate: this.startDate,
    //        endDate: this.endDate
    //      }
    //      this.lookupsService.getIncedanceReport(this.ids, '-1,', false, '-1', -1, '-1', '-1', '-1', filterDateDTO).subscribe(
    //        (res) => {
    //          this.ids = '';

    //          this.myData = res.data;
    //          res.data?.forEach((element) => {
    //            this.yearsToDraw.push(element.arabicName);
    //            this.CalculatedData.push(element.countOFCases);
    //          });
    //        },
    //        (err) => {
    //          this.ids = '';
    //        }, () => {

    //          this.charts7.load({
    //            columns: [this.CalculatedData],
    //          });
    //          this.charts7.categories(this.yearsToDraw);
    //        }
    //      );

    //      setTimeout(() => {
    //        this.yearsToDraw = [];
    //        this.CalculatedData = ['عدد_الحالات'];
    //      }, 600);
    //    } else {
    //      this.isModifingView = true;
    //      this.charts7 = c3.generate({
    //        bindto: '#chart7',

    //        size: {
    //          height: 250,
    //          width: 0,
    //        },
    //        legend: {
    //          padding: 20,
    //          position: 'bottom',
    //        },
    //        data: {
    //          type: 'bar',
    //          labels: true,
    //          types: {
    //            معدل_الاصابة: 'line',
    //          },
    //          columns: [
    //            ['عدد_الحالات', 350000, 300000, 100000, 411000, 912100, 523010, 460000],

    //          ],

    //        },

    //        axis: {
    //          x: {
    //            show: true,
    //            type: 'category',
    //            categories: ['مكتب صحة', 'عيادة طلبة تأمين', 'عيادة خاصة', 'مستشفي عام', 'مستشفي صدر', 'مركز طبي حضري', 'مركز طب اسرة'],
    //          },

    //        },
    //        bar: {
    //          width: {
    //            ratio: 0.5, // this makes bar width 50% of length between ticks
    //          },
    //          // or
    //          //width: 100 // this makes bar width 100px
    //        },
    //      });
    //    }

    //},
    //8: () => {
    //  if (this.isModifingView == false && this.selectedIncidentSource.length>0) {
    //    this.Desiesids = this.selectedDiseases;
    //    this.selectedDepartment?.forEach(element => {
    //      this.Dpartmentids = this.Dpartmentids + element.id + ","
    //    });
    //    this.Dpartmentids = this.Dpartmentids.slice(0, -1);
    //    this.IncidentSourceids = this.selectedIncidentSource;

    //    this.lookupsService.getIncidentDepartmentReport(this.Desiesids, this.Dpartmentids,
    //      this.datePipe.transform(this.fromDate, 'MM-dd-yyyy'),
    //      this.datePipe.transform(this.toDate, 'MM-dd-yyyy'), this.IncidentSourceids, false, '-1', -1, '-1', '-1', '-1').subscribe(

    //        (res) => {
    //          this.ids = '';
    //          this.Desiesids = '';
    //          this.Dpartmentids = '';
    //          this.IncidentSourceids = '';
    //          this.myData = res.data;

    //          let i = 0;

    //          this.myData?.forEach((element) => {
    //            this.yearsToDraw.push(element.diseases_NameAr);
    //          });
    //          this.chart8.categories(this.yearsToDraw);

    //          this.yearsToDraw.push("الاجمالي");
    //          this.selectedDepartment?.forEach(element2 => {
    //            this.ChartData[i] = [element2.arabicName]
    //            this.myData?.forEach((element) => {
    //              if (element.count_of_Pationt != null && element.count_of_Pationt[i] != undefined && element.count_of_Pationt[i] != null) {
    //                this.ChartData[i].push(element.count_of_Pationt[i]);
    //              }
    //            })
    //            this.chart8.load({
    //              columns: [this.ChartData[i]],
    //            });
    //            i++;
    //          });
    //        },
    //        (err) => {
    //          this.ids = '';
    //        }, () => {
    //          this.chart8 = c3.generate({
    //            bindto: '#chart8',
    //            size: {
    //              height: 250,
    //              width: 0,
    //            },
    //            zoom: {
    //              enabled: true,
    //            },
    //            data: {
    //              type: 'bar',

    //              columns: [],
    //            },
    //            axis: {
    //              x: {
    //                type: 'category',
    //                categories: ['القاهرة'],
    //              },
    //              y: {
    //                tick: {
    //                  outer: true,
    //                },
    //              },
    //            },
    //            bar: {
    //              width: {
    //                ratio: 0.5, // this makes bar width 50% of length between ticks
    //              },
    //              // or
    //              //width: 100 // this makes bar width 100px
    //            },
    //          });

    //          //  $('.page-item .active').addClass('bg');

    //        }
    //      );

    //    setTimeout(() => {
    //      this.yearsToDraw = [];
    //      //  this.ChartData = [['.'], ['.'], ['.'], ['.'], ['.'], ['.'], ['.'], ['.'], ['.'], ['.']];
    //    }, 700);
    //  } else {
    //    this.isModifingView = true;
    //    this.chart8 = c3.generate({
    //      bindto: '#chart8',

    //      size: {
    //        height: 250,
    //        width: 0,
    //      },
    //      legend: {
    //        padding: 20,
    //        position: 'bottom',
    //      },
    //      data: {
    //        type: 'bar',
    //        labels: true,
    //        types: {
    //          معدل_الاصابة: 'line',
    //        },
    //        columns: [
    //          ['عدد_الحالات', 35000, 30000, 10000, 41100, 91200, 52010, 46000],

    //        ],
    //      },
    //      axis: {
    //        x: {
    //          show: true,
    //          type: 'category',
    //          categories: ['استقبال', ' معمل', ' بنك دم', 'غسيل كلوي', 'فحص مسافرين', 'قادمين من الخارج', 'عناية مركزة'],
    //        },
    //      },
    //      bar: {
    //        width: {
    //          ratio: 0.5, // this makes bar width 50% of length between ticks
    //        },
    //      },
    //    })
    //  };
    //},
    //9: () => {
    //  if (this.isModifingView == false && this.selectedDiseases.length>0) {

    //    this.Diseaseids2 = this.selectedDiseases;
    //    this.selectedJobs?.forEach((element) => {
    //      this.Jobsids.push(element.id);
    //    });

    //    this.lookupsService
    //      .getAccordingPatientJob(
    //        {
    //          ids_Disease: this.Diseaseids,
    //          from_Date: this.datePipe.transform(this.fromDate, 'MM-dd-yyyy'),
    //          to_Date: this.datePipe.transform(this.toDate, 'MM-dd-yyyy'),
    //          ids_PationtJop: this.Jobsids
    //        }
    //      )
    //      .subscribe(
    //        (res) => {
    //          this.myData = res.data;
    //          this.ids = '';
    //          this.Diseaseids2 = [];
    //          this.Jobsids = [];
    //          let i = 0;

    //          this.myData?.forEach((element) => {
    //            this.yearsToDraw.push(element.resultAr);
    //          });
    //          this.yearsToDraw.push("الاجمالي");
    //          this.chart9.categories(this.yearsToDraw);
    //          this.selectedJobs?.forEach(element2 => {
    //            this.ChartData[i] = [element2.arabicName]
    //            this.myData?.forEach((element) => {
    //              this.ChartData[i].push(element.countOfPatient[i])
    //            })
    //            this.chart9.load({
    //              columns: [this.ChartData[i]],
    //            });
    //            i++;
    //          });

    //        },
    //        (err) => {
    //          this.ids = '';
    //        }, () => {
    //          this.chart9 = c3.generate({
    //            bindto: '#chart9',
    //            size: {
    //              height: 250,
    //              width: 0,
    //            },
    //            zoom: {
    //              enabled: true,
    //            },
    //            data: {
    //              type: 'bar',

    //              columns: [],
    //            },
    //            axis: {
    //              x: {
    //                type: 'category',
    //                categories: ['القاهرة'],
    //              },
    //              y: {
    //                tick: {
    //                  outer: true,
    //                },
    //              },
    //            },
    //            bar: {
    //              width: {
    //                ratio: 0.5, // this makes bar width 50% of length between ticks
    //              },
    //              // or
    //              //width: 100 // this makes bar width 100px
    //            },
    //          });

    //          // $('.page-item .active').addClass('bg');
    //        }
    //      );
    //    setTimeout(() => {
    //      this.yearsToDraw = [];
    //      this.ChartData = [['.'], ['.'], ['.'], ['.'], ['.'], ['.'], ['.'], ['.'], ['.'], ['.']];
    //    }, 1000)
    //  } else {
    //    this.isModifingView = true;
    //    this.chart9 = c3.generate({
    //      bindto: '#chart9',
    //      size: {
    //        height: 250,
    //        width: 0,
    //      },
    //      legend: {
    //        padding: 20,
    //        position: 'bottom',
    //      },
    //      data: {
    //        type: 'bar',
    //        labels: true,
    //        types: {
    //          معدل_الاصابة: 'line',
    //        },
    //        columns: [
    //          ['عدد_الحالات', 35000, 30000, 10000, 41100, 91200, 52010, 46000],

    //        ],
    //      },
    //      axis: {
    //        x: {
    //          show: true,
    //          type: 'category',
    //          categories: ['ربه منزل', ' فريق طبي', 'طالب', ' مزارع', 'مدرس', 'عامل', 'معاش'],
    //        },
    //      },
    //      bar: {
    //        width: {
    //          ratio: 0.5, // this makes bar width 50% of length between ticks
    //        },
    //        // or
    //        //width: 100 // this makes bar width 100px
    //      },
    //    })
    //  };
    //},
    //10: () => {
    //  if (this.isModifingView == false && this.selectedDiseases.length>0) {
    //    this.Desiesids = this.selectedDiseases;
    //    this.lookupsService
    //      .getDiseaseAccordingToAgeGroups(this.Desiesids,
    //        this.datePipe.transform(this.fromDate, 'MM-dd-yyyy'),
    //        this.datePipe.transform(this.toDate, 'MM-dd-yyyy'))
    //      .subscribe(
    //        (res) => {
    //          this.ids = '';
    //          this.myData = res.data;
    //          this.myData?.forEach((element) => {
    //            this.yearsToDraw.push(element.diseaseAr);
    //            this.lessThan1.push(element.lessThan1);
    //            this.upTo5.push(element.upTo5);
    //            this.upTo15.push(element.upTo15);
    //            this.upTo35.push(element.upTo35);
    //            this.upTo65.push(element.upTo65);
    //          });
    //          this.chart10.load({
    //            columns: [
    //              this.lessThan1,
    //              this.upTo5,
    //              this.upTo15,
    //              this.upTo35,
    //              this.upTo65],
    //          });
    //          this.chart10.categories(this.yearsToDraw);

    //        },
    //        (err) => {
    //          this.ids = '';
    //        }, () => {
    //          this.chart10 = c3.generate({
    //            bindto: '#chart10',
    //            size: {
    //              height: 250,
    //              width: 0,
    //            },
    //            zoom: {
    //              enabled: true,
    //            },
    //            data: {
    //              type: 'bar',

    //              columns: [['عدد_الحالات']],
    //            },
    //            axis: {
    //              x: {
    //                type: 'category',
    //                categories: ['القاهرة'],
    //              },
    //              y: {
    //                tick: {
    //                  outer: true,
    //                },
    //              },
    //            },
    //            bar: {
    //              width: {
    //                ratio: 0.5, // this makes bar width 50% of length between ticks
    //              },
    //              // or
    //              //width: 100 // this makes bar width 100px
    //            },
    //          });

    //        }
    //      );

    //    setTimeout(() => {
    //      this.yearsToDraw = [];
    //      this.lessThan1 = ['اقل_من_1'];
    //      this.upTo5 = ['من_1_الي_5'];
    //      this.upTo15 = ['1من_5_الي_5'];
    //      this.upTo35 = ['3من_15_الي_5']
    //      this.upTo65 = ['6من_35_الي_5']
    //    }, 600);
    //  } else {
    //    this.isModifingView = true;
    //    this.chart10 = c3.generate({
    //      bindto: '#chart10',

    //      size: {
    //        height: 250,
    //        width: 0,
    //      },
    //      legend: {
    //        padding: 20,
    //        position: 'bottom',
    //      },
    //      data: {
    //        type: 'bar',
    //        labels: true,
    //        types: {
    //          معدل_الاصابة: 'line',
    //        },
    //        columns: [
    //          ['عدد_الحالات', 35000, 30000, 10000, 41100, 91200, 46000],

    //        ],

    //      },

    //      axis: {
    //        x: {
    //          show: true,
    //          type: 'category',
    //          categories: [' اكبر من 65', 'من 35 الي 65', 'من 15 الي 35', ' من 5 ال 15', ' من 1 الي 5', 'اقل من عام'],
    //        },

    //      },
    //      bar: {
    //        width: {
    //          ratio: 0.5, // this makes bar width 50% of length between ticks
    //        },
    //        // or
    //        //width: 100 // this makes bar width 100px
    //      },
    //    })
    //  };
    //},
    //11: () => {
    //  if (this.isModifingView == false && this.selectedDiseases.length>0) {
    //    this.Diseaseids2 = this.selectedDiseases;
    //    this.selectedFinalResults?.forEach((element) => {
    //      this.FinalResultsids.push(element.id);
    //    });

    //    this.lookupsService
    //      .FinalResultToDiseaseReport(
    //        {
    //          ids_Disease: this.Diseaseids,
    //          from_Date: this.datePipe.transform(this.fromDate, 'MM-dd-yyyy'),
    //          to_Date: this.datePipe.transform(this.toDate, 'MM-dd-yyyy'),
    //          ids_FinalResult: this.FinalResultsids,
    //          result: this.resultType,
    //        }

    //      )
    //      .subscribe(
    //        (res) => {
    //          this.myData = res?.data;
    //          this.ids = '';
    //          this.Diseaseids2 = [];
    //          this.FinalResultsids = [];
    //          let i = 0;
    //          this.myData?.forEach((element) => {
    //            this.yearsToDraw.push(element.resultAr);

    //          });

    //          this.yearsToDraw.push("الاجمالي");
    //          this.charts11.categories(this.yearsToDraw);

    //          this.EndselectedDiseases?.forEach(element2 => {
    //            this.ChartData[i] = [element2.arabicName]
    //            this.myData?.forEach((element) => {
    //              this.ChartData[i].push(element.countOfPatient[i])
    //            })
    //            if (this.ChartData[0] != null) {
    //              this.charts11.load({
    //                columns: [this.ChartData[0]],
    //              });
    //            }
    //            i++;
    //          });
    //        },
    //        (err) => {
    //          this.ids = '';
    //        }, () => {

    //          this.charts11 = c3.generate({
    //            bindto: '#chart11',
    //            size: {
    //              height: 250,
    //              width: 0,
    //            },
    //            zoom: {
    //              enabled: true,
    //            },
    //            data: {
    //              type: 'bar',

    //              columns: [],
    //            },
    //            axis: {
    //              x: {
    //                type: 'category',
    //                categories: ['القاهرة'],
    //              },
    //              y: {
    //                tick: {
    //                  outer: true,
    //                },
    //              },
    //            },
    //            bar: {
    //              width: {
    //                ratio: 0.5, // this makes bar width 50% of length between ticks
    //              },
    //              // or
    //              //width: 100 // this makes bar width 100px
    //            },
    //          });
    //          //    $('.page-item .active').addClass('bg');

    //        }
    //      );
    //    setTimeout(() => {
    //      this.yearsToDraw = [];
    //      this.ChartData = [['.'], ['.'], ['.'], ['.'], ['.'], ['.'], ['.'], ['.'], ['.'], ['.']];
    //    }, 1000)
    //  } else {
    //    this.isModifingView = true;
    //    this.charts11 = c3.generate({
    //      bindto: '#chart11',

    //      size: {
    //        height: 250,
    //        width: 0,
    //      },
    //      legend: {
    //        padding: 20,
    //        position: 'bottom',
    //      },
    //      data: {
    //        type: 'bar',
    //        labels: true,
    //        types: {
    //          معدل_الاصابة: 'line',
    //        },
    //        columns: [
    //          ['عدد_الحالات', 41100, 91200, 52010, 46000],

    //        ],

    //      },

    //      axis: {
    //        x: {
    //          show: true,
    //          type: 'category',
    //          categories: ['تحت العلاج', ' وفاة', 'هروب', ' شفاء'],
    //        },

    //      },
    //      bar: {
    //        width: {
    //          ratio: 0.5, // this makes bar width 50% of length between ticks
    //        },
    //        // or
    //        //width: 100 // this makes bar width 100px
    //      },
    //    })
    //  };
    //},
    //12: () => {
    //  if (this.isModifingView == false && this.selectedDiseases.length>0) {
    //    this.ids = this.selectedDiseases;
    //    var selectedYear = this.currentLang == 'ar' ? this.selectedYear?.[0]?.arabicName : this.selectedYear?.[0]?.englishName;
    //    if (this.selectedYear != -1) {
    //      this.lookupsService
    //        .PrevalenceRateToDeathReport(this.ids.slice(0, -1), selectedYear)
    //        .subscribe(
    //          (res) => {
    //            this.ids = '';
    //            this.myData = res.data;
    //            this.myDatalength = this.myData.length;
    //            this.lastIndex = this.myDatalength - 1;
    //            let i = 0;
    //            res.data?.forEach((element) => {
    //              i++;
    //              if (i <= this.lastIndex) {

    //                this.yearsToDraw.push(element.resultAr);
    //                this.CalculatedData.push(element.prevalenceRateThisYear);
    //                this.CalculatedData1.push(element.prevalenceRatePreviousYear);
    //              }
    //            });
    //            this.chart12.load({
    //              columns: [this.CalculatedData, this.CalculatedData1],
    //            }); this.chart12.categories(this.yearsToDraw);
    //          },
    //          (err) => {
    //            this.ids = '';
    //          }, () => {
    //            this.chart12 = c3.generate({
    //              bindto: '#chart12',
    //              size: {
    //                height: 250,
    //                width: 0,
    //              },
    //              zoom: {
    //                enabled: true,
    //              },
    //              data: {
    //                type: 'bar',

    //                columns: [],
    //              },
    //              axis: {
    //                x: {
    //                  type: 'category',
    //                  categories: ['القاهرة'],
    //                },
    //                y: {
    //                  tick: {
    //                    outer: true,
    //                  },
    //                },
    //              },
    //              bar: {
    //                width: {
    //                  ratio: 0.5, // this makes bar width 50% of length between ticks
    //                },
    //                // or
    //                //width: 100 // this makes bar width 100px
    //              },
    //            });

    //          }
    //        );
    //    }

    //    setTimeout(() => {
    //      this.yearsToDraw = [];
    //      this.CalculatedData = ['معدل_الوفيات'];
    //      this.CalculatedData1 = ['معدل_الوفيات_للعام_الماضي'];
    //    }, 600);
    //  } else {
    //    this.isModifingView = true;
    //    this.chart12 = c3.generate({
    //      bindto: '#chart12',

    //      size: {
    //        height: 250,
    //        width: 0,
    //      },
    //      legend: {
    //        padding: 20,
    //        position: 'bottom',
    //      },
    //      data: {
    //        type: 'bar',
    //        labels: true,
    //        types: {
    //          معدل_الاصابة: 'line',
    //        },
    //        columns: [
    //          ['عدد_الحالات', 600, 500, 400, 300, 200, 100],

    //        ],

    //      },

    //      axis: {
    //        x: {
    //          show: true,
    //          type: 'category',
    //          categories: [' اكبر من 65', 'من 35 الي 65', 'من 15 الي 35', ' من 5 ال 15', ' من 1 الي 5', 'اقل من عام'],
    //        },

    //      },
    //      bar: {
    //        width: {
    //          ratio: 0.5, // this makes bar width 50% of length between ticks
    //        },
    //        // or
    //        //width: 100 // this makes bar width 100px
    //      },
    //    })
    //  };
    //},
    //13: () => {
    //  if (this.isModifingView == false && this.selectedDiseases.length>0) {

    //    this.Diseaseids2 = this.selectedDiseases;
    //    this.selectedWeaks?.forEach((element) => {
    //      this.weakids.push(element.id);
    //    });
    //    var selectedYear = this.currentLang == 'ar' ? this.selectedYear?.[0]?.arabicName : this.selectedYear?.[0]?.englishName;

    //    if (this.selectedYear != -1) {
    //      this.lookupsService
    //        .DiseaseByWeekReport(
    //          {
    //            ids_Disease: this.Diseaseids,
    //            from_Date: (selectedYear)?.toString(),

    //            numOfWeek: this.weakids,

    //          }

    //        )
    //        .subscribe(
    //          (res) => {
    //            this.myData = res.data;
    //            this.myDatalength = res.data.length;
    //            this.ids = '';
    //            this.Diseaseids2 = [];
    //            this.weakids = [];
    //            let i = 0;
    //            this.selectedWeaks?.forEach(element2 => {
    //              this.ChartData[i] = [element2.arabicName]
    //              this.myData?.forEach((element) => {
    //                this.ChartData[i].push(element.countOfPatient[i])
    //              })
    //              this.chart13.load({
    //                columns: [this.ChartData[i]],
    //              });
    //              i++;
    //            });
    //            this.myData?.forEach((element) => {

    //              this.yearsToDraw.push(element.resultAr);
    //              ;
    //            });

    //            this.yearsToDraw.push("الاجمالي");
    //            this.chart13.categories(this.yearsToDraw);

    //          },
    //          (err) => {
    //            this.ids = '';
    //          }, () => {

    //            this.chart13 = c3.generate({
    //              bindto: '#chart13',
    //              size: {
    //                height: 250,
    //                width: 0,
    //              },
    //              zoom: {
    //                enabled: true,
    //              },
    //              data: {
    //                type: 'bar',

    //                columns: [],
    //              },
    //              axis: {
    //                x: {
    //                  type: 'category',
    //                  categories: ['القاهرة'],
    //                },
    //                y: {
    //                  tick: {
    //                    outer: true,
    //                  },
    //                },
    //              },
    //              bar: {
    //                width: {
    //                  ratio: 0.5, // this makes bar width 50% of length between ticks
    //                },
    //                // or
    //                //width: 100 // this makes bar width 100px
    //              },
    //            });

    //            // $('.page-item .active').addClass('bg');

    //          }
    //        );
    //    }
    //    setTimeout(() => {
    //      this.yearsToDraw = [];
    //      this.ChartData = [['.'], ['.'], ['.'], ['.'], ['.'], ['.'], ['.'], ['.'], ['.'], ['.']];
    //    }, 1000)
    //  } else {

    //    this.isModifingView = true;
    //    this.chart13 = c3.generate({
    //      bindto: '#chart13',

    //      size: {
    //        height: 250,
    //        width: 0,
    //      },
    //      legend: {
    //        padding: 20,
    //        position: 'bottom',
    //      },
    //      data: {
    //        type: 'line',
    //        labels: true,
    //        types: {
    //          معدل_الاصابة: 'line',
    //        },
    //        columns: [
    //          ['عدد_الحالات', 35000, 30000, 10000, 41100, 91200, 52010, 46000],

    //        ],

    //      },

    //      bar: {
    //        width: {
    //          ratio: 0.5, // this makes bar width 50% of length between ticks
    //        },
    //        // or
    //        //width: 100 // this makes bar width 100px
    //      },
    //    })
    //  };
    //},
    //14: () => {
    //  if (this.isModifingView == false) {

    //  } else {

    //  }
    //  this.isModifingView = true;
    //  c3.generate({
    //    bindto: '#chart14',

    //    size: {
    //      height: 250,
    //      width: 0,
    //    },
    //    legend: {
    //      padding: 20,
    //      position: 'bottom',
    //    },
    //    data: {
    //      type: 'pie',
    //      labels: true,

    //      columns: [
    //        ['مكتمل ', 350000, 300000, 100000],
    //        ['لم يكتمل', 350000, 100000],

    //      ],

    //    },

    //  });
    //},
    //15: () => {
    //  if (this.isModifingView == false) {

    //  } else {

    //  }
    //  this.isModifingView = true;
    //  c3.generate({
    //    bindto: '#chart14',

    //    size: {
    //      height: 250,
    //      width: 0,
    //    },
    //    legend: {
    //      padding: 20,
    //      position: 'bottom',
    //    },
    //    data: {
    //      type: 'pie',
    //      labels: true,

    //      columns: [
    //        ['ف خلال يوم ', 350000, 300000, 100000],
    //        [' ف خلال يومين', 350000, 100000],
    //        [' ف خلال اكثر من يومين', 30000, 1000],

    //      ],

    //    },

    //  });
    //},
  };

  selectedDiseaseTitle: any[] = ['', '', '', ''];

  firechartSSSS() {
    //GET CHARTS TITLES FROM TRANSLATION IF FIRST LOAD
    let inValidFilter = true;
    if (this.firstLoad == false) {
      if (this.filteredChart == -1) {
        this.translateService
          .get('NEDSS.COMMON.ChartAlertMessage')
          .subscribe((res: string) => {
            this.userMsg.info(res);
          });
        document
          .getElementById('jump_to_this_location')
          .scrollIntoView({ behavior: 'smooth' });
      } else {
        let transParam =
          this.filteredChart == 1 &&
            (this.selectedDiseases.length == 0 || this.selectedyears.length == 0)
            ? 'NEDSS.COMMON.ChartAlertMessageChart13'
            : this.filteredChart == 2 &&
              this.selectedGovernment[0] == null &&
              this.levelId != 2
              ? 'NEDSS.COMMON.ChartAlertMessageChart2'
              : this.filteredChart == 3 &&
                (this.startSelectedyears == -1 ||
                  this.startSelectedyears == null ||
                  this.endSelectedyears == -1 ||
                  this.endSelectedyears == null ||
                  this.startDate == null ||
                  this.endDate == null ||
                  this.selectedDiseases.length == 0)
                ? 'NEDSS.COMMON.ChartAlertMessageChart13'
                : this.filteredChart == 4 &&
                  (this.selectedGovernment.length == 0 ||
                    this.selectedyears.length == 0)
                  ? 'NEDSS.COMMON.ChartAlertMessageChart4'
                  : '';

        if (transParam) {
          this.translateService.get(transParam).subscribe((res: string) => {
            this.userMsg.info(res);
          });
          inValidFilter = false;
        }
      }
    }
    if (inValidFilter) {
      this.isModifingView = false;
      this.AllData.chartNumbers?.forEach((element) => {
        try {
          if (!this.firstLoad && element != this.filteredChart)
            throw 'no changes in this chart';

          this.Allcharts[element]();

          let diseaseChosen =
            this.selectedDiseases == 0
              ? this.currentLang == 'ar'
                ? 'كل الأمراض'
                : 'All Diseases'
              : this.diseases[this.selectedDiseases - 1][
              this.currentLang == 'ar' ? 'arabicName' : 'englishName'
              ];

          document.getElementById(
            `chart_title${this.filteredChart}`
          ).innerText = diseaseChosen;
          document
            .getElementById(`container${element}`)
            .scrollIntoView({ behavior: 'smooth' });

          this.isLoadingChart = false;
        } catch (ignored) { }
      });
    } else {
      document
        .getElementById('jump_to_this_location')
        .scrollIntoView({ behavior: 'smooth' });
    }
  }

  cloneChartToDialog(id) {
    alert('Test_' + id);

    // document.getElementById('dialog_body').innerHTML = document.getElementById(`container${id}`).cloneNode(true)
    this.showDialog = true;
  }


  getAllAppSettings() {
    this.lookupsService.getAllAppSettings().subscribe({
      next: (res) => {
        this.CardsPeriodDto = res;
        console.log(this.CardsPeriodDto);
        console.log(res);
      },
      error: (err) => {
        console.error('Error fetching app settings:', err);
      }
    });
  }

  getDurationUnit(value: CardsPeriodDurationUnitEnum): string {
    const units = this.currentLang === 'ar' ? {
      [CardsPeriodDurationUnitEnum.Hour]: 'ساعات',
      [CardsPeriodDurationUnitEnum.Day]: 'ايام',
      [CardsPeriodDurationUnitEnum.Week]: 'أسابيع',
      [CardsPeriodDurationUnitEnum.Month]: 'شهور',
      [CardsPeriodDurationUnitEnum.Year]: 'سنين'
    } : {
      [CardsPeriodDurationUnitEnum.Hour]: 'Hours',
      [CardsPeriodDurationUnitEnum.Day]: 'Days',
      [CardsPeriodDurationUnitEnum.Week]: 'Weeks',
      [CardsPeriodDurationUnitEnum.Month]: 'Months',
      [CardsPeriodDurationUnitEnum.Year]: 'Years'
    };

    return units[value] || '';
  }





}
