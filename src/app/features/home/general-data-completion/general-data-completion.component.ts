import { Component, ElementRef, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SortEvent } from 'primeng/api';
import { fromEvent, map, debounceTime, distinctUntilChanged } from 'rxjs';
import {
  MultipleDropdownSettings,
  SingleDropdownSettings,
  SortOrder,
} from 'src/app/core/constants';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { environment } from 'src/environments/environment';
import { GeneralDataCompletionServiceService } from './services/general-data-completion-service.service';
import { Router } from '@angular/router';
import { SharedDataService } from '../general-data/services/shared-data.service';
// import { ExportService } from '../../../core/services/export.service';
import { ExportService } from 'src/app/core/services/export.service';
import { ExportAsConfig } from 'ngx-export-as';
@Component({
  selector: 'app-general-data-completion',
  templateUrl: './general-data-completion.component.html',
  styleUrls: ['./general-data-completion.component.css'],
})
export class GeneralDataCompletionComponent {
  levelId: any;
  maxDate = new Date();
  currentLang: string;
  dir: string;
  delay: boolean = false;
  timer: any;

  math: Math;
  selectedAdministrationId: number;
  healthAdministration: any[];
  startDate: any;
  endDate: any;
  currentConfig: string = 'myTableElementId';
  exportAsPdfConfig: ExportAsConfig = {
    type: 'pdf', // the type you want to download
    elementIdOrContent: this.currentConfig, // the id of html/table element
    // options: { // html-docx-js document options

    // }
  };

  @ViewChild('myTableElementId', { static: false }) tableElement: ElementRef;

  screenName: string;
  selectedGovernmentId: number = -1;
  generalDataCompletions!: any[];
  governments: any[];
  healthAdministrations!: any[];
  incidentSources!: any[];
  departments!: any[];
  singleDropdownSettings = SingleDropdownSettings;
  selectedDeseaiesIds: any[] = [];
  generalDataCompletionFilter = {
    pageSize: 10,
    pageIndex: 0,
    sortColumn: '',
    sortOrder: '',
    searchText: '',
    incidentGovernmentId: null,
    incidentHealthAdministrationId: null,
    incidentSourceId: null,
    incidentDepartmentId: null,
    caseDiscoveryFromDate: null,
    caseDiscoveryToDate: null,
    isNullNationalIdOrPassport: false,
    isNullMaritalStatusId: false,
    isNullInfectionDate: false,
    isNullTestCheck: false,
    isNullMobile: false,
    isNullGetSampleDate: false,
    isNullHospitalEntryDate: false,
    isNullTestResult: false,
    isNullPatientJobId: false,
    isNullTestResultDate: false,
    isNullHospitalLeaveDate: false,
    isNullLivingAddress: false,
    isNullDiseaseSeverity: false,
    isNullFinalResult: false,
    DiseaseIds: null,
  };

  noData: boolean = true;
  loadError: boolean = false;
  loadingPanel: boolean = false;
  first: number = 0;
  last: number = 0;
  pages: number = 0;
  all: string = 'all';

  selecteddepartmentId: number;
  selectedDepartment: any[] = [];
  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;
  messageService: any;
  pleaseComplete: boolean;
  Diseasies: any[] = [];
  healthAdministrationId: number;
  selectincidentSource: any;
  multipleDropdownSettings = MultipleDropdownSettings;
  incidentDepartmentId:number = 0;
  departments2:any[] = [];
  governmentsLoading = false;
  healthAdministrationsLoading = false;
  incidentSourcesLoading = false;
  departmentsLoading = false;
  diseasesLoading = false;
  constructor(
    private lookupsGetterService: LookupsGetterService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private generalDataCompletionServiceService: GeneralDataCompletionServiceService,
    private data: SharedDataService,
    private router: Router,
    private lookupsService: LookupsGetterService,
    private exportService: ExportService
  ) {}

  ngOnInit() {
    this.getDepartments2()
    this.currentLang =
      localStorage.getItem('ls.currentLang') !== undefined &&
      localStorage.getItem('ls.currentLang') !== 'undefined'
        ? localStorage.getItem('ls.currentLang')
        : 'ar';
    this.dir = this.currentLang == 'ar' ? 'rtl' : 'ltr';

    this.levelId = JSON.parse(
      localStorage.getItem('ls.authorizationData')
    )?.user?.levelId;

    let incidentInfoLink = document.getElementById(
      'incidentInfo'
    ) as HTMLElement;
    incidentInfoLink.classList.remove('active');
    this.getGovernment();
    this.getAllDiseases();
    this.Diseasies.forEach((element) => {
      element.selected = false;
    });
    if (this.searchInput.nativeElement != undefined) {
      fromEvent(this.searchInput.nativeElement, 'keyup')
        .pipe(
          map((event: any) => {
            return event.target.value;
          }),
          debounceTime(environment.DebounceWaiting),
          distinctUntilChanged()
        )
        .subscribe(() => {
          this.search();
        });
    }
    this.router.routerState.root.queryParams.subscribe((params) => {
      if (params.def == null || params.def == undefined) {
        this.generalDataCompletionFilter = {
          pageSize: 10,
          pageIndex: 0,
          sortColumn: '',
          sortOrder: '',
          searchText: '',
          incidentGovernmentId: null,
          incidentHealthAdministrationId: null,
          incidentSourceId: null,
          incidentDepartmentId: null,
          caseDiscoveryFromDate: null,
          caseDiscoveryToDate: null,
          isNullNationalIdOrPassport: false,
          isNullMaritalStatusId: false,
          isNullInfectionDate: false,
          isNullTestCheck: false,
          isNullMobile: false,
          isNullGetSampleDate: false,
          isNullHospitalEntryDate: false,
          isNullTestResult: false,
          isNullPatientJobId: false,
          isNullTestResultDate: false,
          isNullHospitalLeaveDate: false,
          isNullLivingAddress: false,
          isNullDiseaseSeverity: false,
          isNullFinalResult: false,
          DiseaseIds: null,
        };
      } else {
        this.generalDataCompletionFilter = {
          pageSize: 10,
          pageIndex: 0,
          sortColumn: '',
          sortOrder: '',
          searchText: '',
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
          isNullFinalResult: true,
          DiseaseIds: null,
        };
        this.search();
      }
    });

    this.translateService
      .get('NEDSS.HOME.SIDE_BAR.ITEM_GENERAL_DATA_COMPLETION')
      .subscribe((res) => (this.screenName = res));
  }
  getGovernment() {
    this.governmentsLoading = true;
    this.lookupsGetterService.getAllGovernments().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.governments = [
            { id: -1, arabicName: 'إختر', englishName: 'Select' },
          ];
          result.data.forEach((nat) => {
            this.governments.push(nat);
          });
          this.selectedGovernmentId = JSON.parse(
            localStorage.getItem('ls.authorizationData')
          ).user.govenmentId;
          if (this.selectedGovernmentId != null) {
            this.governmentSelected();
          } else {
            this.selectedGovernmentId = -1;
          }
        }
        this.governmentsLoading = false;
        this.loadingPanel = false;
      },
      (error) => {
        this.governmentsLoading = false;
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
    console.log('governmentSelected', this.selectedGovernmentId);
    if (this.selectedGovernmentId != -1) {
      this.generalDataCompletionFilter.incidentGovernmentId =
        this.selectedGovernmentId;
    }
    this.healthAdministrationId = -1;
    this.selectincidentSource = null;
    this.incidentSources = [];
    this.healthAdministrations = [];
    if (this.selectedGovernmentId != -1) {
      this.getHealthAdministrations(
        this.generalDataCompletionFilter.incidentGovernmentId
      );
      this.getCitys(this.generalDataCompletionFilter.incidentGovernmentId);
    } else {
      this.governmentDeSelected();
    }
  }
  governmentDeSelected() {
    this.generalDataCompletionFilter.incidentGovernmentId = null;
    this.healthAdministrationId = -1;
    this.healthAdministrations = null;
    this.healthAdministrationDeSelected();
    this.departments = null;
    this.selecteddepartmentId = -1;
  }
  getHealthAdministrations(governmentID: any) {
    this.healthAdministrationsLoading = true;
    this.lookupsGetterService
      .getPageHealthAdministrations({
        governmentID: governmentID,
      })
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.healthAdministrations = [
              { id: -1, arabicName: 'إختر', englishName: 'Select' },
            ];
            result.data.forEach((nat) => {
              this.healthAdministrations.push(nat);
            });
            this.incidentSources = [];
            this.healthAdministrationId = JSON.parse(
              localStorage.getItem('ls.authorizationData')
            ).user.healthAdministrationId;
            if (this.healthAdministrationId != null) {
              // this.healthAdministrationId = -1;
              this.healthAdministrationSelected();
            } else {
              this.healthAdministrationId = -1;
            }
            this.selectincidentSource = -1;
          }
          this.healthAdministrationsLoading = false;
          this.loadingPanel = false;
        },
        (error) => {
          this.healthAdministrationsLoading = false;
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
    if (this.healthAdministrationId != -1) {
      this.generalDataCompletionFilter.incidentHealthAdministrationId =
        this.healthAdministrationId;
      this.getIncidentSources(
        this.generalDataCompletionFilter.incidentHealthAdministrationId
      );
    } else {
      this.healthAdministrationDeSelected();
    }
  }
  healthAdministrationDeSelected() {
    this.generalDataCompletionFilter.incidentHealthAdministrationId = null;
    this.selectincidentSource = -1;
    this.incidentSources = null;
  }

  getIncidentSources(healthAdministrationID: any) {
    this.incidentSourcesLoading = true;
    this.lookupsGetterService
      .getPageIncidentSourceHospitals({
        healthAdministrationID: healthAdministrationID,
      })
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.incidentSources = [
              { id: -1, arabicName: 'إختر', englishName: 'Select' },
            ];
            result.data.forEach((nat) => {
              this.incidentSources.push(nat);
            });
            this.selectincidentSource = JSON.parse(
              localStorage.getItem('ls.authorizationData')
            ).user.incidentSourceId;
            if (this.selectincidentSource != null) {
              this.incidentSourcesSelected();
            } else {
              this.selectincidentSource = -1;
            }
          }

          this.incidentSourcesLoading = false;
          this.loadingPanel = false;
        },
        (error) => {
          this.incidentSourcesLoading = false;
          this.loadingPanel = false;
          this.translateService
            .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
        }
      );
  }

  incidentSourcesSelected() {
    this.pleaseComplete = false;
    if (this.selectincidentSource != -1) {
      this.generalDataCompletionFilter.incidentSourceId =
        this.selectincidentSource;
      this.selecteddepartmentId = -1;
    } else {
      this.incidentSourcesDeSelected();
    }
  }

  incidentSourcesDeSelected() {
    this.generalDataCompletionFilter.incidentSourceId = null;
  }
  
  getDepartments(incidentSourceId: any) {
    this.departmentsLoading = true;
    this.lookupsGetterService
      .getPageDepartments({
        incidentSourceHospitalID: incidentSourceId,
      })
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.departments = [
              { id: -1, arabicName: 'إختر', englishName: 'Select' },
            ];
            result.data.forEach((nat) => {
              this.departments.push(nat);
            });
          }
          this.departmentsLoading = false;
          this.loadingPanel = false;
        },
        (error) => {
          this.departmentsLoading = false;
          this.loadingPanel = false;
          this.translateService
            .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
        }
      );
  }

  departmentsSelected() {
    if (this.selecteddepartmentId != -1) {
      this.generalDataCompletionFilter.incidentDepartmentId =
        this.selecteddepartmentId;
    } else {
      this.generalDataCompletionFilter.incidentDepartmentId = null;
    }
  }
  getCitys(governmentID: any) {
    this.departmentsLoading = true;
    this.lookupsGetterService
      .getPageCitys({
        governmentID: governmentID,
      })
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.departments = [
              { id: -1, arabicName: 'إختر', englishName: 'Select' },
            ];
            result.data.forEach((nat) => {
              this.departments.push(nat);
            });
          }
          this.departmentsLoading = false;
          this.loadingPanel = false;
        },
        (error) => {
          this.departmentsLoading = false;
          this.loadingPanel = false;
          this.translateService
            .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
        }
      );
  }
  getAllDiseases() {
    this.diseasesLoading = true;
    this.lookupsService.getAllDiseases().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.Diseasies = result.data;
        }
        this.diseasesLoading = false;
        this.loadingPanel = false;
      },
      (error) => {
        this.diseasesLoading = false;
        this.loadingPanel = false;
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }

  onDiseasiesSelected(event) {
    if (Array.isArray(event)) {
      event.forEach((element) => {
        if (!this.selectedDeseaiesIds.find((e) => e.id === element.id)) {
          this.selectedDeseaiesIds.push(element);
        }
      });
    } else {
      if (!this.selectedDeseaiesIds.find((e) => e.id === event.id)) {
        this.selectedDeseaiesIds.push(event);
      }
    }
  }
  onDiseasiesDeSelected(event) {
    this.selectedDeseaiesIds = this.selectedDeseaiesIds.filter(
      (m) => m.id != event.id
    );
  }

  search() {
    var selectedDeseaiesIds = [];
    this.selectedDeseaiesIds?.forEach((element) => {
      selectedDeseaiesIds?.push(element.id);
    });
    this.generalDataCompletionFilter.DiseaseIds = selectedDeseaiesIds;
    if (
      this.generalDataCompletionFilter.isNullNationalIdOrPassport == false &&
      this.generalDataCompletionFilter.isNullMaritalStatusId == false &&
      this.generalDataCompletionFilter.isNullInfectionDate == false &&
      this.generalDataCompletionFilter.isNullTestCheck == false &&
      this.generalDataCompletionFilter.isNullMobile == false &&
      this.generalDataCompletionFilter.isNullGetSampleDate == false &&
      this.generalDataCompletionFilter.isNullHospitalEntryDate == false &&
      this.generalDataCompletionFilter.isNullTestResult == false &&
      this.generalDataCompletionFilter.isNullPatientJobId == false &&
      this.generalDataCompletionFilter.isNullTestResultDate == false &&
      this.generalDataCompletionFilter.isNullHospitalLeaveDate == false &&
      this.generalDataCompletionFilter.isNullLivingAddress == false &&
      this.generalDataCompletionFilter.isNullDiseaseSeverity == false &&
      this.generalDataCompletionFilter.isNullFinalResult == false
    ) {
      this.pleaseComplete = true;
    } else {
      this.first = 0;
      this.generalDataCompletionFilter.pageIndex = 0;
      this.last =
        this.generalDataCompletionFilter.pageIndex *
        this.generalDataCompletionFilter.pageSize;

      this.generalDataCompletionFilter.incidentDepartmentId = this.incidentDepartmentId;
      this.getGeneralDataCompletions();
    }
  }





  
  complete() {
    if (this.pleaseComplete) {
      this.pleaseComplete = false;
    }
  }
  showCheckbox = false;

  showCheckboxes() {
    this.showCheckbox = !this.showCheckbox;
  }

  getGeneralDataCompletions() {
    this.loadingPanel = true;
    this.loadError = false;
    this.Delay();
    this.generalDataCompletionServiceService
      .getPageGeneralDataCompletions2(this.generalDataCompletionFilter)
      .subscribe(
        (result: any) => {
          this.loadError = false;
          if (result != null && result != undefined) {
            //TODO Remove !p.incidentSourceId condition when backend be edited
            console.log('general-data-completion', result.data);
            this.generalDataCompletions = result?.data ?? [];
            // ?.filter(
            //   (p: any) =>
            //     this.lookupsService.incidentsForOrg.includes(
            //       p.incidentSourceId
            //     ) || !p.incidentSourceId
            // );
            if (
              this.generalDataCompletions != undefined &&
              this.generalDataCompletions.length == 0
            ) {
              this.RemoveDelay();

              this.noData = true;
              this.pages = 0;
              this.translateService
                .get('NOUR.NO_RESULTS')
                .subscribe((msg) => this.userMsg.warn(msg));
            } else {
              this.RemoveDelay();
              this.noData = false;
              this.pages = result.data[0].totalCount;

              this.last =
                this.generalDataCompletionFilter.pageIndex *
                this.generalDataCompletionFilter.pageSize;
              document
                .getElementById('goto')
                .scrollIntoView({ behavior: 'smooth' });
              //window.location.href = '#goto'
            }
          }

          this.loadingPanel = false;
          this.delay = false;
        },
        (error) => {
          this.loadingPanel = false;
          this.delay = false;
          this.loadError = true;
          this.noData = false;
          this.generalDataCompletions = [];
          this.pages = 0;
          this.translateService
            .get('NEDSS.COMMON.COULD_NOT_LOAD_RESULTS')
            .subscribe((res: string) => this.userMsg.error(res));
        }
      );
  }

  sort(event: SortEvent) {
    if (
      event.order == -1 &&
      this.generalDataCompletionFilter.sortOrder != SortOrder.desc
    ) {
      this.generalDataCompletionFilter.sortOrder = SortOrder.desc;
      if (typeof event.field === 'string')
        this.generalDataCompletionFilter.sortColumn = event.field;
      this.getGeneralDataCompletions();
    } else if (
      event.order == 1 &&
      this.generalDataCompletionFilter.sortOrder != SortOrder.asc
    ) {
      this.generalDataCompletionFilter.sortOrder = SortOrder.asc;
      if (typeof event.field === 'string')
        this.generalDataCompletionFilter.sortColumn = event.field;
      this.getGeneralDataCompletions();
    }
  }
  paginate(event: any) {
    this.first = event.first;
    this.last = event.last;
    // this.all= this.pages.toString();

    this.generalDataCompletionFilter.pageIndex = event.page;
    this.generalDataCompletionFilter.pageSize = event.rows;
    this.getGeneralDataCompletions();
  }

  clearSearch() {
    this.generalDataCompletionFilter.searchText = '';
    this.search();
  }

  getById(id: number) {
    this.data.patientId = id;
    this.router.navigateByUrl('/home/general-data');
  }
  exportPatiantsAsExcel() {
    this.exportService.exportTableAsExcel(this.tableElement, this.screenName);
  }
  // exportPatientsAsPdf() {
  //   this.exportService.exportTableAsPdf(this.tableElement, this.screenName);
  // }

  exportPatientsAsPdf() {
    let selectedGov = this.governments.filter(
      (g) => g.id == this.selectedGovernmentId
    );

    let tempSelectedAdm = [this.healthAdministrationId];
    let selectedAdm = this.healthAdministrations?.filter((g) =>
      tempSelectedAdm.includes(g.id)
    );
    selectedAdm = selectedAdm?.map((g) => g.arabicName);

    let tempSelectedIncs = this.incidentSources.map((g) => g.id);
    let selectedIncs = this.incidentSources?.filter((g) =>
      tempSelectedIncs.includes(g.id)
    );
    let s = selectedIncs.filter((g) => g.id == this.selectincidentSource);
    let as = s.map((g) => g.arabicName);
    // selectedIncs = selectedIncs?.map(g => g.arabicName)

    let tempSelectedDeps = this.selectedDepartment.map((g) => g.id);
    let selectedDep = this.departments?.filter((g) =>
      tempSelectedDeps.includes(g.id)
    );
    selectedDep = selectedDep?.map((g) => g.arabicName);

    let sDate, eDate;
    // console.log( (((new Date(this.generalDataCompletionFilter.caseDiscoveryFromDate))?.toISOString())?.split('T'))[0])
    try {
      // sDate = (((new Date(this.startDate))?.toISOString())?.split('T'))[0]
      sDate =
        this.generalDataCompletionFilter.caseDiscoveryFromDate &&
        new Date(
          this.generalDataCompletionFilter.caseDiscoveryFromDate
        ).toLocaleDateString('en-GB');
      // eDate = (((new Date(this.endDate))?.toISOString())?.split('T'))[0]
      eDate =
        this.generalDataCompletionFilter.caseDiscoveryToDate &&
        new Date(
          this.generalDataCompletionFilter.caseDiscoveryToDate
        ).toLocaleDateString('en-GB');
    } catch (error) {
      sDate = '';
      eDate = '';
    }
    // //////
    // const reader = new FileReader();
    // const fileInfo = event.target.files[0];
    // if (fileInfo) {
    //     reader.readAsBinaryString(event.target.files[0]);
    //     reader.onloadend = () => {
    //         const count = reader.result.match(/\/Type[\s]*\/Page[^s]/g).length;
    //         console.log('Number of Pages:', count);
    //     }
    // }
    // //////////////////

    // var pdfInfo = {};
    // var x = document.location.search.substring(1).split('&');
    // for (var i in x) { var z = x[i].split('=',2); pdfInfo[z[0]] = unescape(z[1]); }
    // function getPdfInfo() {
    //   var page = pdfInfo.page || 1;
    //   var pageCount = pdfInfo.topage || 1;
    //   document.getElementById('pdfkit_page_current').textContent = page;
    //   document.getElementById('pdfkit_page_count').textContent = pageCount;
    // }

    this.exportService.exportTemplateAsPdf(
      document.getElementById(this.currentConfig),
      ' الحالات الغير مكتمله',
      [
        selectedGov,
        selectedAdm,
        as,
        // selectedIncs,
        selectedDep,
      ],
      [sDate, eDate]
    );
  }

  fromDateSelected(event) {
    this.generalDataCompletionFilter.caseDiscoveryFromDate = event.value;
  }
  toDateSelected(event) {
    this.generalDataCompletionFilter.caseDiscoveryToDate = event.value;
  }

  hidColName: boolean = false;
  hidColFather: boolean = false;
  hidColAdress: boolean = false;
  hidColDate: boolean = false;
  hidColdeport: boolean = false;
  hidColDetals: boolean = false;

  toHidColName() {
    this.hidColName = !this.hidColName;
  }
  toHhidColFather() {
    this.hidColFather = !this.hidColFather;
  }
  toHidColAdress() {
    this.hidColAdress = !this.hidColAdress;
  }
  toHidColDate() {
    this.hidColDate = !this.hidColDate;
  }
  toHidColdeport() {
    this.hidColdeport = !this.hidColdeport;
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



  getDepartments2() {
    this.departmentsLoading = true;
    this.lookupsService.getAllDepartments().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.departments2 = [
            { id: -1, arabicName: 'إختر', englishName: 'Select' },
          ];
          result.data.forEach((nat) => {
            this.departments2.push(nat);
          });
        }
        this.departmentsLoading = false;
        this.loadingPanel = false;
      },
      (error) => {
        this.departmentsLoading = false;
        this.loadingPanel = false;
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }
}
