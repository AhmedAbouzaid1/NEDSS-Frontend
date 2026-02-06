import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  ConfirmEventType,
  ConfirmationService,
  MessageService,
  PrimeNGConfig,
  SortEvent,
} from 'primeng/api';
import { SingleDropdownSettings, SortOrder } from 'src/app/core/constants';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { NotInferringService } from './Services/not-inferring.service';
import { Router } from '@angular/router';
import { SharedDataService } from '../general-data/services/shared-data.service';
import { ExportService } from '../../../core/services/export.service';
import { GeneralDataService } from '../general-data/services/general-data.service';
import { FormControl, FormGroup } from '@angular/forms';
import { GeneralDataCompletionServiceService } from '../general-data-completion/services/general-data-completion-service.service';
import { ExportAsConfig } from 'ngx-export-as';
import { ActiveUserService } from 'src/app/core/services/active-user.service';
@Component({
  selector: 'app-not-inferring',
  templateUrl: './not-inferring.component.html',
  styleUrls: ['./not-inferring.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class NotInferringComponent {
  currentLang: string;
  dir: string;
  delay: boolean = false;
  timer: any;
  startDate: any;
  endDate: any;
  selectedAdministrationId: number;
  departments: any;
  selectedDepartment: any[] = [];
  currentConfig: string = 'myTableElementId';
  exportAsPdfConfig: ExportAsConfig = {
    type: 'pdf', // the type you want to download
    elementIdOrContent: this.currentConfig, // the id of html/table element
  };

  // minDate = new Date(1900, 0, 1);
  // maxDate = new Date();
  @ViewChild('myTableElementId', { static: false }) tableElement: ElementRef;
  screenName: string;
  notInferrings!: any[];
  governments!: any[];
  selectedGovernment: number = -1;
  healthAdministrations!: any[];
  incidentSources!: any[];
  pleaseComplete: boolean = false;
  notInferringForm: FormGroup;

  notInferringFilter = {
    pageSize: 10,
    pageIndex: 0,
    sortColumn: '',
    sortOrder: '',
    searchText: '',
    incidentGovernmentId: null,
    incidentHealthAdministrationId: null,
    incidentSourceId: null,
    patientId: null,
    fullName: '',
    startDate: null,
    endDate: null,
    isMobileType: false, //1
    isAddress: false, //2
    isOtherType: false, //3
    isGovernmentType: false, //4
    isHelthAdminType: false, //5
    isNotInvestigation: false, //6
    misInvistegationType: [],
    firstTime: false,
  };

  singleDropdownSettings = SingleDropdownSettings;
  noData: boolean = true;
  loadingPanel: boolean = false;
  first: number = 0;
  last: number = 0;
  pages: number = 0;
  selectedhealthAdministration: number;
  selectedincidentSource: number;
  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;
  levelId: any;
  patientId: any = null;

  constructor(
    private lookupsGetterService: LookupsGetterService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private notInferringService: NotInferringService,
    private primengConfig: PrimeNGConfig,
    private data: SharedDataService,
    private router: Router,
    private exportService: ExportService,
    public generalDataService: GeneralDataService,
    private generalDataCompletionServiceService: GeneralDataCompletionServiceService,
    public activeUSerService: ActiveUserService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef
  ) { }
  BasicShow: boolean = false;

  showDialog() {
    this.BasicShow = true;
  }
  ngOnInit() {
    this.router.routerState.root.queryParams.subscribe((params) => {
      //alert(JSON.stringify(params)); // { orderby: "price" }
      this.patientId = params.id;
    });
    this.currentLang =
      localStorage.getItem('ls.currentLang') !== undefined &&
        localStorage.getItem('ls.currentLang') !== 'undefined'
        ? localStorage.getItem('ls.currentLang')
        : 'ar';
    this.dir = this.currentLang == 'ar' ? 'rtl' : 'ltr';

    let incidentInfoLink = document.getElementById(
      'incidentInfo'
    ) as HTMLElement;
    incidentInfoLink.classList.remove('active');
    this.primengConfig.ripple = true;
    this.levelId = JSON.parse(
      localStorage.getItem('ls.authorizationData')
    )?.user?.levelId;

    this.notInferringForm = new FormGroup({
      isMobileType: new FormControl(),
      isAddress: new FormControl(),
      isOtherType: new FormControl(),
      isGovernmentType: new FormControl(),
      isHelthAdminType: new FormControl(),
      isNotInvestigation: new FormControl(),
    });

    this.getGovernment();
    if (this.patientId) {
      setTimeout(() => {
        this.search();
      }, 1000);
    }
    this.router.routerState.root.queryParams.subscribe((params) => {
      if (params.def == null || params.def == undefined) {
        this.notInferringFilter = {
          pageSize: 10,
          pageIndex: 0,
          sortColumn: '',
          sortOrder: '',
          searchText: '',
          incidentGovernmentId: null,
          incidentHealthAdministrationId: null,
          incidentSourceId: null,
          patientId: this.patientId ? this.patientId : null,
          fullName: '',
          startDate: null,
          endDate: null,
          isMobileType: false, //1
          isAddress: false, //2
          isOtherType: false, //3
          isGovernmentType: false, //4
          isHelthAdminType: false, //5
          isNotInvestigation: false, //6
          misInvistegationType: [],
          firstTime: false,
        };
      } else {
        this.notInferringFilter = {
          pageSize: 10,
          pageIndex: 0,
          sortColumn: '',
          sortOrder: '',
          searchText: '',
          incidentGovernmentId: null,
          incidentHealthAdministrationId: null,
          incidentSourceId: null,
          patientId: this.patientId ? this.patientId : null,
          fullName: '',
          startDate: null,
          endDate: null,
          isMobileType: false, //1
          isAddress: false, //2
          isOtherType: false, //3
          isGovernmentType: false, //4
          isHelthAdminType: false, //5
          isNotInvestigation: false, //6
          misInvistegationType: [] as number[],
          firstTime: true,
        };
        this.search();
      }
    });

    this.translateService
      .get('NEDSS.HOME.SIDE_BAR.ITEM_NOT_INFERRING')
      .subscribe((res) => (this.screenName = res));
    // this.disableControls();
  }

  confirm1(id: number) {
    this.confirmationService.confirm({
      message: this.translateService.instant(
        'NEDSS.COMMON.COMMON_CONFIRMATION'
      ),
      header: this.translateService.instant('NEDSS.COMMON.CONFIRMATION'),
      icon: 'pi pi-question-circle',
      acceptLabel: this.translateService.instant('NEDSS.COMMON.YES'),
      rejectLabel: this.translateService.instant('NEDSS.COMMON.NO'),
      accept: () => {
        this.updateNotInferrings(id);
      },
      reject: (type) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Rejected',
              detail: 'You have rejected',
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Cancelled',
              detail: 'You have cancelled',
            });
            break;
        }
      },
    });
  }

  getGovernment() {
    this.lookupsGetterService.getAllGovernments().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.governments = [
            { id: -1, arabicName: 'إختر', englishName: 'Select' },
          ];
          result.data.forEach((nat) => {
            this.governments.push(nat);
          });
          if (result.data.length > 0) {
            this.selectedGovernment = JSON.parse(
              localStorage.getItem('ls.authorizationData')
            ).user.govenmentId;
            if (this.selectedGovernment != null) {
              this.governmentSelected();
            } else {
              this.selectedGovernment = -1;
            }
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
  governmentSelected() {
    this.notInferringFilter.incidentGovernmentId = this.selectedGovernment;
    if (this.notInferringFilter.incidentGovernmentId <= 0) {
      this.selectedhealthAdministration = -1;
      this.healthAdministrations = [];
    } else {
      this.getHealthAdministrations(
        this.notInferringFilter.incidentGovernmentId
      );
    }
  }
  governmentDeSelected() {
    this.notInferringFilter.incidentGovernmentId = null;
    this.selectedhealthAdministration = -1;
    this.healthAdministrations = null;
    this.notInferringFilter.incidentHealthAdministrationId = null;
    this.incidentSources = null;
    this.selectedincidentSource = -1;
  }

  getHealthAdministrations(governmentID: any) {
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
            setTimeout(() => {
              this.selectedhealthAdministration = JSON.parse(
                localStorage.getItem('ls.authorizationData')
              ).user.healthAdministrationId;
              if (this.selectedhealthAdministration != null) {
                this.healthAdministrationSelected();
              } else {
                this.selectedhealthAdministration = -1;
              }
            }, 200);
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
    this.notInferringFilter.incidentHealthAdministrationId =
      this.selectedhealthAdministration;
    if (this.notInferringFilter.incidentHealthAdministrationId <= 0) {
      this.selectedincidentSource = -1;
      this.incidentSources = [];
    } else {
      this.getIncidentSources(
        this.notInferringFilter.incidentHealthAdministrationId
      );
    }
  }
  healthAdministrationDeSelected() {
    this.notInferringFilter.incidentHealthAdministrationId = null;
    this.incidentSources = null;
    this.selectedincidentSource = -1;
  }
  incidentSourcesSelected() {
    this.notInferringFilter.incidentSourceId = this.selectedincidentSource;
  }
  incidentSourcesDSelected() {
    this.notInferringFilter.incidentSourceId = null;
  }
  getIncidentSources(healthAdministrationID: any) {
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
            setTimeout(() => {
              this.selectedincidentSource = JSON.parse(
                localStorage.getItem('ls.authorizationData')
              ).user.incidentSourceId;
              if (this.selectedincidentSource != null) {
                this.incidentSourcesSelected();
              } else {
                this.selectedincidentSource = -1;
              }
            }, 200);
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

  search() {
    // this.first = 0;
    // this.notInferringFilter.pageIndex = 0;
    // this.last =
    //   this.notInferringFilter.pageIndex * this.notInferringFilter.pageSize;
    // this.getNotInferrings();

    // let length: any[] = this.notInferringForm.value.searchKey
    // console.log('Length',this.notInferringForm.value);
    this.first = 0;
    this.notInferringFilter.pageIndex = 0;
    this.last = this.notInferringFilter.pageIndex * this.notInferringFilter.pageSize;

    if (this.notInferringFilter.startDate != null) {
      const adjustedDate = new Date((new Date(this.notInferringFilter.startDate).getTime() - new Date(this.notInferringFilter.startDate).getTimezoneOffset() * 60000)).toISOString().split('T')[0];
      this.notInferringFilter.startDate = adjustedDate;
    }
    if (this.notInferringFilter.endDate != null) {
      const adjustedDate = new Date((new Date(this.notInferringFilter.endDate).getTime() - new Date(this.notInferringFilter.endDate).getTimezoneOffset() * 60000)).toISOString().split('T')[0];
      this.notInferringFilter.endDate = adjustedDate;
    }

    this.getNotInferrings();
    //this.loadingPanel = true;
    //this.generalDataCompletionServiceService
    //  .getPageGeneralDataCompletions2(this.notInferringFilter)
    //  .subscribe(
    //    (result: any) => {
    //      if (result != null && result != undefined) {
    //        if (
    //          !this.notInferringForm.value.isMobileType &&
    //          !this.notInferringForm.value.isAddress &&
    //          !this.notInferringForm.value.isOtherType &&
    //          !this.notInferringForm.value.isGovernmentType &&
    //          !this.notInferringForm.value.isHelthAdminType) {
    //          this.notInferrings = result.data;
    //          this.pleaseComplete = true;

    //        } else {
    //          this.notInferrings = [];
    //          this.getNotInferrings();
    //          this.pleaseComplete = false;
    //        }

    //      }
    //      this.loadingPanel = false;
    //    },
    //    (error) => {
    //      this.loadingPanel = false;
    //      this.translateService
    //        .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
    //        .subscribe((res: string) => {
    //          this.userMsg.error(res);
    //        });
    //    }
    //  );
  }

  complete() {
    if (this.pleaseComplete) {
      this.pleaseComplete = false;
    }
  }
  updateNotInferrings(id: number) {
    this.data.patientId = id;
    this.notInferringService
      .updatePageNotInferrings(this.data.patientId)
      .subscribe(
        (result: any) => {
          if (result.statusCode == 200) {
            this.translateService
              .get('NEDSS.COMMON.SENT_SUCESSFULLY')
              .subscribe((res: string) => {
                this.userMsg.success(res);
              });
          } else {
            this.userMsg.error(result.messages[0]);
          }
        },
        (error) => {
          this.translateService
            .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
        }
      );
  }

  getNotInferrings() {
    if (
      this.generalDataService.validateName(
        this.notInferringFilter.fullName,
        false
      ) !== ''
    ) {
      this.translateService
        .get('NEDSS.COMMON.FILL_INVALID')
        .subscribe((res: string) => {
          this.userMsg.warn(res);
        });
      return;
    }

    this.notInferringFilter.misInvistegationType = [];
    if (
      this.notInferringFilter.isMobileType &&
      !this.notInferringFilter.misInvistegationType.includes(1)
    )
      this.notInferringFilter.misInvistegationType.push(1);
    if (
      this.notInferringFilter.isAddress &&
      !this.notInferringFilter.misInvistegationType.includes(2)
    )
      this.notInferringFilter.misInvistegationType.push(2);
    if (
      this.notInferringFilter.isOtherType &&
      !this.notInferringFilter.misInvistegationType.includes(3)
    )
      this.notInferringFilter.misInvistegationType.push(3);
    if (
      this.notInferringFilter.isGovernmentType &&
      !this.notInferringFilter.misInvistegationType.includes(4)
    )
      this.notInferringFilter.misInvistegationType.push(4);
    if (
      this.notInferringFilter.isHelthAdminType &&
      !this.notInferringFilter.misInvistegationType.includes(5)
    )
      this.notInferringFilter.misInvistegationType.push(5);
    if (
      this.notInferringFilter.isNotInvestigation &&
      !this.notInferringFilter.misInvistegationType.includes(6)
    )
      this.notInferringFilter.misInvistegationType.push(6);
    if (this.notInferringFilter.incidentGovernmentId <= 0) {
      this.notInferringFilter.incidentGovernmentId = null;
    }
    if (this.notInferringFilter.incidentHealthAdministrationId <= 0) {
      this.notInferringFilter.incidentHealthAdministrationId = null;
    }
    if (this.notInferringFilter.incidentSourceId <= 0) {
      this.notInferringFilter.incidentSourceId = null;
    }
    this.loadingPanel = true;

    this.delay = true;
    this.timer = setTimeout(() => {
      if (this.delay) {
        this.translateService
          .get('NOUR.WaitPlease')
          .subscribe((msg) => this.userMsg.info(msg));
      }
    }, 500);
    this.notInferringService
      .getPageNotInferrings(this.notInferringFilter)
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            // result = result.data.reverse();
            //TODO make sure
            let resi;
            console.log('not-inferring PAGE', resi);
            resi = result.data;
            let incedentIds = resi.map((s) => s.incidentSourceId);
            //this.notInferrings = resi?.filter((p: any) => this.lookupsGetterService.incidentsForOrg.includes(p.incidentSourceId));
            this.notInferrings = result.data;
            if (
              this.notInferrings != undefined &&
              this.notInferrings.length == 0
            ) {
              setTimeout(() => {
                this.delay = false;
                clearTimeout(this.timer);
              }, 0);
              this.noData = true;
              this.pages = 0;
              this.pleaseComplete = true;
            } else {
              setTimeout(() => {
                this.delay = false;
                clearTimeout(this.timer);
              }, 0);
              this.pleaseComplete = false;
              this.noData = false;
              this.pages = result.data[0].totalCount;
              this.last =
                this.notInferringFilter.pageIndex *
                this.notInferringFilter.pageSize;
            }
          } else {
            this.notInferrings = [];
            this.pleaseComplete = true;
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

  sort(event: SortEvent) {
    if (
      event.order == -1 &&
      this.notInferringFilter.sortOrder != SortOrder.desc
    ) {
      this.notInferringFilter.sortOrder = SortOrder.desc;
      if (typeof event.field === 'string')
        this.notInferringFilter.sortColumn = event.field;
      this.getNotInferrings();
    } else if (
      event.order == 1 &&
      this.notInferringFilter.sortOrder != SortOrder.asc
    ) {
      this.notInferringFilter.sortOrder = SortOrder.asc;
      if (typeof event.field === 'string')
        this.notInferringFilter.sortColumn = event.field;
      this.getNotInferrings();
    }
  }
  paginate(event: any) {
    this.first = event.first;
    this.last = event.last;
    this.notInferringFilter.pageIndex = event.page;
    this.notInferringFilter.pageSize = event.rows;
    this.getNotInferrings();
  }

  clearSearch() {
    this.notInferringFilter.searchText = '';
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
    let selectedGov = this.governments?.filter(
      (g) => g.id == this.selectedGovernment
    );

    let tempSelectedAdm = [this.selectedhealthAdministration];
    let selectedAdm = this.healthAdministrations?.filter((g) =>
      tempSelectedAdm.includes(g.id)
    );
    selectedAdm = selectedAdm?.map((g) => g.arabicName);

    // let tempSelectedIncs = this.incidentSources?.map(g => g.id);
    // let selectedIncs = this.incidentSources?.filter(g => tempSelectedIncs.includes(g.id))
    // selectedIncs = selectedIncs?.map(g => g.arabicName)
    // console.log(selectedIncs);

    let tempSelectedIncs = this.incidentSources?.map((g) => g.id);
    let selectedIncs = this.incidentSources?.filter((g) =>
      tempSelectedIncs.includes(g.id)
    );
    let s = selectedIncs.filter((g) => g.id == this.selectedincidentSource);
    selectedIncs = s.map((g) => g.arabicName);

    let tempSelectedDeps = this.selectedDepartment?.map((g) => g.id);
    let selectedDep = this.departments?.filter((g) =>
      tempSelectedDeps.includes(g.id)
    );
    selectedDep = selectedDep?.map((g) => g.arabicName);

    let sDate, eDate;

    try {
      // sDate = (new Date(this.startDate)?.toISOString()?.split('T'))[0];
      sDate = (new Date(this.startDate)?.toISOString());
      // eDate = (new Date(this.endDate)?.toISOString()?.split('T'))[0];
      eDate = (new Date(this.endDate)?.toISOString());
    } catch (error) {
      sDate = '';
      eDate = '';
    }
    this.exportService.exportTemplateAsPdf(
      document.getElementById(this.currentConfig),
      'حالات عدم الاستدلال ',
      [
        selectedGov,
        selectedAdm,
        selectedIncs,
        //selectedDep
      ],
      [sDate, eDate]
    );
  }

  test() {
    //console.log((new Date(this.notInferringFilter.endDate)?.toISOString()?.split('T'))[0]);
    const adjustedDate = new Date((new Date(this.notInferringFilter.endDate).getTime() - new Date(this.notInferringFilter.endDate).getTimezoneOffset() * 60000)).toISOString().split('T')[0];
    this.notInferringFilter.endDate = adjustedDate;
    console.log(this.notInferringFilter.endDate);
  }

}
