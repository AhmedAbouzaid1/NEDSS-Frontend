import { Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { ExportAsConfig, ExportAsService } from 'ngx-export-as';
import { SharedDataService } from '../../../general-data/services/shared-data.service';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { ZeroInstantNotificationService } from '../../../zero-notificaton/Services/zero-instant-notification.service';
import { TranslateService } from '@ngx-translate/core';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { DatePipe } from '@angular/common';
import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';
import { MultipleDropdownSettings, SingleDropdownSettings, SortOrder } from 'src/app/core/constants';
import { environment } from 'src/environments/environment';
import { SortEvent } from 'primeng/api';
import { FormControl, FormGroup } from '@angular/forms';
import { GeneralDataService } from '../../../general-data/services/general-data.service';
import { ExportService } from '../../../../../core/services/export.service';
@Component({
  selector: 'app-full-data-percentage',
  templateUrl: './full-data-percentage.component.html',
  styleUrls: ['./full-data-percentage.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class FullDataPercentageComponent {
  @ViewChild('myTableElementId', { static: false }) tableElement: ElementRef;
  currentLang: string;
  dir: string;
  delay: boolean = false;
  timer: any;
  selectedGovernmentId: number = -1;

  fromDate: string | number | Date;
  toDate: string | number | Date;
  selectedHealthAdministrationId: number;

  selectedIncidentSourceId: number;
  noData: boolean = true;
  exportAsExcelConfig: ExportAsConfig = {
    type: 'xlsx', // the type you want to download
    elementIdOrContent: 'myTableElementId', // the id of html/table element
  };
  exportAsPdfConfig: ExportAsConfig = {
    type: 'pdf', // the type you want to download
    elementIdOrContent: 'myTableElementId', // the id of html/table element
  }
  singleDropdownSettings = {};
  multiDropdownSettings = {};
  fullDataFilter = {
    incidentGovernmentId: null,
    incidentHealthAdministrationId: null,
    incidentSourceId: null,
    startDate: null,
    endDate: null,
    filterType: 1,
    InvestigationStatus: 0,
    isInvistegationDone: null
  }
  timePercentageFilter = {
    incidentGovernmentId: null,
    incidentHealthAdministrationId: null,
    incidentSourceId: null,
    startDate: null,
    endDate: null,
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
    isNullFinalResult: true
  };
  underDeleting = {
    diseaseName: '',
    id: null
  };
  levelId: any;
  dvalue: any;
  diseases!: any[];
  governments!: any[];
  healthAdministrations!: any[];
  incidentSources!: any[];
  loadingPanel: boolean = false;
  selectedincidentSource: any
  selectedDisase: any
  zeroInstantNotificationFilter = {
    pageSize: 10,
    pageIndex: 0,
    sortColumn: '',
    sortOrder: '',
    searchText: '',
    firstTime: false,
    incidentGovernmentId: null,
    incidentHealthAdministrationId: null,
    incidentSourceId: null,
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
    isNullFinalResult: true
  };
  zeroInstantNotifications!: any[];
  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;

  first: number = 0;
  last: number = 0;
  pages: number = 0;
  healthAdministrationId: any;
  selectedGovernment: any;
  selectedHealthAdministration: any;
  selectedIncedentSource: any;
  viewHealthAdministration: boolean = false;
  viewIncidentSource: boolean = false;
  screenName: string = "";
  constructor(
    private sharedDataService: SharedDataService,
    private lookupsService: LookupsGetterService,
    private generalDataService: GeneralDataService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private datePipe: DatePipe,
    private exportService: ExportService
  ) { }

  ngOnDestroy() {
    let link = document.getElementById('home') as HTMLElement;
    link.classList.remove('active');
  }
  ngOnInit() {
    this.currentLang =
      localStorage.getItem('ls.currentLang') !== undefined &&
        localStorage.getItem('ls.currentLang') !== 'undefined'
        ? localStorage.getItem('ls.currentLang')
        : 'ar';

    this.dir = this.currentLang == 'ar' ? 'rtl' : 'ltr';

    const date = new Date();
    this.fromDate = null;// new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0);
    this.toDate = null; new Date(date.getFullYear(), date.getMonth(), this.getMonthDaysCount(date), 23, 59, 59);

    let link = document.getElementById('home') as HTMLElement;
    link.classList.add('active');
    console.log(JSON.parse(localStorage.getItem('ls.authorizationData')).user);
    this.levelId = JSON.parse(localStorage.getItem('ls.authorizationData'))?.user?.levelId;

    this.selectedGovernment = []

    this.translateService.get('NEDSS.SEARCH.FullData').subscribe((res: string) => {
      this.screenName = res;
    });
    this.singleDropdownSettings = SingleDropdownSettings;
    this.multiDropdownSettings = MultipleDropdownSettings;
    this.getGovernments(true);

  }

  private getMonthDaysCount(date: string | Date): number {
    const tmp = new Date(date);
    tmp.setMonth(tmp.getMonth() + 1);
    tmp.setDate(0);
    return tmp.getDate();
  };
  getGovernments(setDefault?: boolean) {
    this.lookupsService.getAllGovernments().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.governments = [{ id: -1, arabicName: 'إختر', englishName: 'Select' }];
          result.data.forEach(gov => {
            this.governments.push(gov);
          });
          if (result.data.length > 0) {
            this.selectedGovernmentId = (this.levelId != 1) ? JSON.parse(localStorage.getItem('ls.authorizationData')).user.govenmentId : -1;
            if (this.selectedGovernmentId != null) {
              this.governmentSelected();
            } else {
              this.selectedGovernmentId = -1;
            }
          }
          this.getFullDataPercentage();

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
  governmentSelected() {
    if (this.selectedGovernmentId > 0) {
      this.timePercentageFilter.incidentGovernmentId = this.selectedGovernmentId;
      this.fullDataFilter.incidentGovernmentId = this.selectedGovernmentId;
      this.getHealthAdministrations(this.timePercentageFilter.incidentGovernmentId);

      this.timePercentageFilter.incidentHealthAdministrationId = null;
      this.fullDataFilter.incidentHealthAdministrationId = null;
      this.timePercentageFilter.incidentSourceId = null;
      this.fullDataFilter.incidentSourceId = null;
      this.selectedHealthAdministrationId = -1;
      this.selectedIncidentSourceId = null;

      this.incidentSources = [];
    } else {
      this.timePercentageFilter.incidentGovernmentId = null;
      this.fullDataFilter.incidentGovernmentId = null;
      this.healthAdministrations = [];
      this.selectedHealthAdministration = null;
      this.selectedHealthAdministrationId = -1;
      this.selectedHealthAdministrationId = -1;
      this.selectedIncidentSourceId = null;
      this.timePercentageFilter.incidentHealthAdministrationId = null;
      this.fullDataFilter.incidentHealthAdministrationId = null;
      this.timePercentageFilter.incidentSourceId = null;
      this.fullDataFilter.incidentSourceId = null;

    }

    this.getFullDataPercentage();
  }

  getHealthAdministrations(governmentID: any, setDefault?: boolean) {
    this.lookupsService
      .getPageHealthAdministrations({
        governmentID: governmentID,
      })
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.healthAdministrations = [{ id: -1, arabicName: 'إختر', englishName: 'Select' }];
            result.data.forEach(gov => {
              this.healthAdministrations.push(gov);
            });
            this.selectedHealthAdministrationId = (this.levelId != 1 && this.levelId != 2) ? JSON.parse(localStorage.getItem('ls.authorizationData')).user.healthAdministrationId : -1;
            if (this.selectedHealthAdministrationId != null) {
              this.healthAdministrationSelected();
            }
            else {
              this.selectedHealthAdministrationId = -1;
            }
            this.getFullDataPercentage();
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

  healthAdministrationSelected() {
    if (this.selectedHealthAdministrationId != -1) {
      this.timePercentageFilter.incidentHealthAdministrationId = this.selectedHealthAdministrationId;
      this.fullDataFilter.incidentHealthAdministrationId = this.selectedHealthAdministrationId;

      this.timePercentageFilter.incidentSourceId = null;
      this.fullDataFilter.incidentSourceId = null;
      this.selectedIncidentSourceId = -1;
    }
    else {
      this.timePercentageFilter.incidentHealthAdministrationId = null;
      this.fullDataFilter.incidentHealthAdministrationId = null;
    }
    this.getIncidentSources(
      this.timePercentageFilter.incidentHealthAdministrationId
    );
    this.selectedIncidentSourceId = -1;
    this.getFullDataPercentage();
  }
  onIncidentSourceChanged() {
    if (this.selectedIncidentSourceId != -1) {
      this.timePercentageFilter.incidentSourceId = this.selectedIncidentSourceId;
      this.fullDataFilter.incidentSourceId = this.selectedIncidentSourceId;
    }
    else {
      this.timePercentageFilter.incidentSourceId = null;
      this.fullDataFilter.incidentSourceId = null;
    }
    this.getFullDataPercentage();
  }



  getIncidentSources(healthAdministrationID: any, setDefault?: boolean) {
    this.lookupsService
      .getPageIncidentSourceHospitals({
        healthAdministrationID: healthAdministrationID,
      })
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.incidentSources = [{ id: -1, arabicName: 'إختر', englishName: 'Select' }];
            result.data.forEach(gov => {
              this.incidentSources.push(gov);
            });

            this.selectedIncidentSourceId = (this.levelId != 1 && this.levelId != 2 && this.levelId != 3) ? JSON.parse(localStorage.getItem('ls.authorizationData')).user.incidentSourceId : -1;
            if (this.selectedIncidentSourceId != null) {
              this.onIncidentSourceChanged();
            }
            else { this.selectedIncidentSourceId = -1; }

            this.getFullDataPercentage();
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

  exportPatiantsAsExcel() {
    this.exportService.exportTableAsExcel(this.tableElement, this.screenName);
  }
  exportPatientsAsPdf() {
    this.exportService.exportTableAsPdf(this.tableElement, this.screenName);
  }

  fromDateSelected(event) {
    this.timePercentageFilter.startDate = event.value;
    this.fullDataFilter.startDate = event.value;
  }
  toDateSelected(event) {
    this.timePercentageFilter.endDate = event.value;
    this.fullDataFilter.endDate = event.value;
  }

  /************************************************ */

  timePercentageDetails: any[] = [];

  timePercentage: any = {};
  userTypes!: any[];
  levels!: any[];
  positions!: any[];
  organizations!: any[];
  roles!: any[];

  userFilter = {
    pageSize: 10,
    pageIndex: 0,
    sortColumn: '',
    sortOrder: '',
    searchText: '',
    fullName: null,
    // userTypeId: null,
    levelId: null,
    positionId: null,
    organizationId: null,
    roleId: null,
    govenmentId: null,
    healthAdministrationId: null,
    incidentSourceId: null,
  };


  SelectedgovenmentId: any;
  SelectedincidentSourceId: any;
  Selectedposition: any;
  Selectedrole: any;
  Selectedorganization: any;

  messageService: any;



  BasicShow: boolean = false;
  SelectedhealthAdministrationId: any;
  showDialog() {
    this.BasicShow = true;
  }

  searchUserFormGroup: FormGroup;
  onFromDateSelection(event) {
    this.fromDate = event.value;
    this.getFullDataPercentage();

  }
  onToDateSelection(event) {
    this.toDate = event.value;
    this.getFullDataPercentage();

  }
  getFullDataPercentage() {
    this.loadingPanel = true;
    this.timePercentageFilter.startDate = this.fromDate != null ? this.fromDate : null;
    this.timePercentageFilter.endDate = this.toDate ? this.toDate : null;
    this.timePercentageFilter.incidentGovernmentId = this.selectedGovernmentId <= 0 ? null : this.selectedGovernmentId;
    this.timePercentageFilter.incidentHealthAdministrationId = this.selectedHealthAdministrationId <= 0 ? null : this.selectedHealthAdministrationId;
    this.timePercentageFilter.incidentSourceId = this.selectedIncidentSourceId <= 0 ? null : this.selectedIncidentSourceId;

    this.delay = true;
    this.timer= setTimeout(() => {
      if (this.delay)
      {
        this.translateService.get('NOUR.WaitPlease').subscribe(msg => this.userMsg.info(msg));
      }
      
    }, 500);



    this.generalDataService
      .getPageGeneralDataFullPercentage(this.timePercentageFilter)
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.timePercentageDetails = result.data;
            this.timePercentageDetails.forEach(item => {
              let government = this.governments.find(g => g.id == item.incidentGovernmentId);
              let healthAdmition = item.incidentHealthAdministrationId != null ? this.healthAdministrations.find(g => g.id == item.incidentHealthAdministrationId) : null;
              let incedSource = item.incidentSourceId != null ? this.incidentSources.find(g => g.id == item.incidentSourceId) : null;
              this.viewIncidentSource = incedSource != null;
              this.viewHealthAdministration = healthAdmition != null;
              if (government != null) { item.incidentGovernmentName = this.currentLang == "ar" ? government.arabicName : government.englishName; }
              if (healthAdmition != null) {
                item.incidentHealthAdministrationName = healthAdmition != null && this.currentLang == "ar" ? healthAdmition.arabicName : healthAdmition.englishName;
              }
              if (incedSource != null) { item.incidentSourceName = incedSource != null && this.currentLang == "ar" ? incedSource.arabicName : incedSource.englishName; }
            });
            if (
              this.timePercentageDetails != undefined &&
              this.timePercentageDetails.length == 0
            ) {
              setTimeout(() => {
                this.delay= false;
                clearTimeout(this.timer);
              },0);
              this.noData = true;
              this.pages = 0;
            } else {
              setTimeout(() => {
                this.delay= false;
                clearTimeout(this.timer);
              },0);
              this.noData = false;
              this.pages = result.data[0].totalCount;
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
  paginate(event: any) {
    this.first = event.first;
    this.last = event.last;
    //add one as primeng pagination is zero based ,so we convert it to one based to fit with the API
    this.userFilter.pageIndex = event.page;
    this.userFilter.pageSize = event.rows;
    //this.generalReportForm.value.pageIndex = event.page;
    //this.generalReportForm.value.pageSize = event.rows;
    this.getFullDataPercentage();
  }

}



