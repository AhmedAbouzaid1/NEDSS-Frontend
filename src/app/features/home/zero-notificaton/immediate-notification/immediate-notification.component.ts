import { Component, ElementRef, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SortEvent } from 'primeng/api';
import {
  MultipleDropdownSettings,
  SingleDropdownSettings,
  SortOrder,
} from 'src/app/core/constants';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { ZeroInstantNotificationService } from '../Services/zero-instant-notification.service';
import { DatePipe } from '@angular/common';
import { GeneralDataService } from '../../general-data/services/general-data.service';
import { ExportService } from '../../../../core/services/export.service';
import { ExportAsConfig } from 'ngx-export-as';
import { ActiveUserService } from 'src/app/core/services/active-user.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-immediate-notification',
  templateUrl: './immediate-notification.component.html',
  styleUrls: ['./immediate-notification.component.css'],
})
export class ImmediateNotificationComponent {
  @ViewChild('myTableElementId', { static: false }) tableElement: ElementRef;
  screenName: string;
  minDate = new Date(1900, 0, 1);
  maxDate = new Date();
  currentLang =
    localStorage.getItem('ls.currentLang') !== undefined &&
    localStorage.getItem('ls.currentLang') !== 'undefined'
      ? localStorage.getItem('ls.currentLang')
      : 'ar';
  TotalValid = false;
  selecteddiseases: number = -1;
  levelId: any;
  selectedgovernment: number = -1;
  selectedhealthAdministration: number = -1;
  selectedincidentSource: number = -1;

  selectedAdministrationId: number;
  SelectedbranchId: number;
  SelectedareaId: number;
  departments: any;
  selectedDepartment: any[] = [];
  startDate: any;
  endDate: any;
  branches: any[];
  areas: any[];

  currentConfig: string = 'myTableElementId';
  exportAsPdfConfig: ExportAsConfig = {
    type: 'pdf', // the type you want to download
    elementIdOrContent: this.currentConfig, // the id of html/table element
  };

  isDiseaseValid: boolean = true;
  isGovernmentValid: boolean = true;
  isHealthAdministrationValid: boolean = true;
  isIncidentSourceValid: boolean = true;
  isBranchValid: boolean = true;
  isAreaValid: boolean = true;
  isToDateValid: boolean = true;
  isFromDateValid: boolean = true;

  immediateNotification = {
    id: null,
    isZero: false,
    diseasesIds: [],
    governmentId: null,
    healthAdministrationId: null,
    incidentSourceId: null,
    branchId: null,
    areaId: null,
    casesPartioning: null,
    infectionsCount: null,
    maleCount: null,
    femaleCount: null,

    ageLowerThanMonth: null,
    ageLowerThanYear: null,
    ageUpTo5: null,
    ageUpTo15: null,
    ageUpTo35: null,
    ageUpTo65: null,
    ageMoreThan65: null,

    fromDate: null,
    toDate: null,
  };

  singleDropdownSettings = SingleDropdownSettings;
  multiDropdownSettings = MultipleDropdownSettings;
  diseases!: any;
  selectedDisase: any;
  governments!: any[];
  healthAdministrations!: any[];
  incidentSources!: any[];
  loadingPanel: boolean = false;
  diseasesLoading: boolean = false;
  governmentsLoading: boolean = false;
  healthAdministrationsLoading: boolean = false;
  branchesLoading: boolean = false;
  areasLoading: boolean = false;
  incidentSourcesLoading: boolean = false;
  immediateNotificationFilter = {
    pageSize: 10,
    pageIndex: 0,
    sortOrder: SortOrder.asc,
    sortColumn: 'GovernmentName',
    searchText: '',
    isZero: false,
  };
  immediateNotifications!: any[];
  organizationId = null;
  selectedGovernment: number = -1;
  dir: string;
  noData: boolean = true;
  first: number = 0;
  last: number = 0;
  pages: number = 0;

  DiseasesArr: any = [];
  healthAdministrationId: number;
  selectedHealthAdministration: number;
  multipleDropdownSettings = MultipleDropdownSettings;

  constructor(
    private lookupsService: LookupsGetterService,
    private immediateNotificationService: ZeroInstantNotificationService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private datePipe: DatePipe,
    private exportService: ExportService,
    public activeUSerService: ActiveUserService,
    public generalDataService: GeneralDataService
  ) {}

  // ngOnInit() {
  //   console.log("user objexct");
  //   console.log(JSON.parse(localStorage.getItem('ls.authorizationData')).user);
  //   this.levelId = JSON.parse(localStorage.getItem('ls.authorizationData'))?.user?.levelId;
  //   let healthAdministrationId = JSON.parse(localStorage.getItem('ls.authorizationData')).user.healthAdministrationId;
  //   let govenmentId = JSON.parse(localStorage.getItem('ls.authorizationData')).user.govenmentId;
  //   let incidentSourceId = JSON.parse(localStorage.getItem('ls.authorizationData')).user.incidentSourceId;
  //   this.getDiseases();
  //   this.getGovernments(true);
  //   this.getImmediateNotifications();
  //   this.translateService.get('NEDSS.HOME.ZERO_INSTANT_NOTIFICATION.INSTANT_NOTIFICATION.INSTANT_NOTIFICATION').subscribe(res => {
  //     this.screenName = res;
  //   });
  // }

  ngOnInit() {
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
    this.levelId = JSON.parse(
      localStorage.getItem('ls.authorizationData')
    )?.user?.levelId;
    let healthAdministrationId = JSON.parse(
      localStorage.getItem('ls.authorizationData')
    ).user.healthAdministrationId;
    let govenmentId = JSON.parse(localStorage.getItem('ls.authorizationData'))
      .user.govenmentId;
    let incidentSourceId = JSON.parse(
      localStorage.getItem('ls.authorizationData')
    ).user.incidentSourceId;
    this.organizationId = JSON.parse(
      localStorage.getItem('ls.authorizationData')
    ).user?.organizationId;

    this.selectedGovernment = -1;
    this.singleDropdownSettings = SingleDropdownSettings;
    this.multiDropdownSettings = MultipleDropdownSettings;
    this.getDiseases();
    this.getGovernments(true);
    if (
      this.activeUSerService.getAccessibleParts?.showBranches ||
      this.activeUSerService.getAccessibleParts?.showUniversities
    ) {
      this.getBranches();
    }

    this.getImmediateNotifications();
    // fromEvent(this.searchInput.nativeElement, 'keyup')
    //   .pipe(
    //     map((event: any) => {
    //       return event.target.value;
    //     }),
    //     debounceTime(environment.DebounceWaiting),
    //     distinctUntilChanged()
    //   )
    //   .subscribe(() => {
    //     this.search();
    //   });

    this.translateService
      .get(
        'NEDSS.HOME.ZERO_INSTANT_NOTIFICATION.ZERO_NOTIFICATION.ZERO_NOTIFICATION'
      )
      .subscribe((res) => {
        this.screenName = res;
      });
  }

  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd');
  }

  // getDiseases() {
  //   this.lookupsService.getAllDiseases().subscribe(
  //     (result: any) => {
  //       if (result != null && result != undefined) {
  //         this.diseases = [{ id: -1, arabicName: 'إختر', englishName: 'Select' }];
  //         result.data.forEach(gov => {
  //           this.diseases.push(gov);
  //         });
  //       }
  //       this.loadingPanel = false;
  //     },
  //     (error) => {
  //       this.loadingPanel = false;
  //       this.translateService
  //         .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
  //         .subscribe((res: string) => {
  //           this.userMsg.error(res);
  //         });
  //     }
  //   );
  // }

  getDiseases() {
    this.diseasesLoading = true;
    this.lookupsService.getAllDiseaseGroups().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.diseases = result.data;
          this.diseases.unshift({
            id: null,
            arabicName: 'إختر',
            englishName: 'Select',
          });
          // result.data.forEach((nat) => {
          //   this.diseases.push(nat);
          // });
          this.selectedHealthAdministration = -1;

          if (this.immediateNotification.diseasesIds != null) {
            this.selectedDisase = this.diseases.filter((x) =>
              this.immediateNotification.diseasesIds.includes(x.id)
            )?.[0]?.id;
          } else {
            this.selectedDisase = null;
          }
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
  onDiseaseChanged() {
    this.DiseasesArr = [];
    // this.selectedDisase.forEach((x) => {
    //   this.DiseasesArr.push(x.id);
    // });
    this.immediateNotification.diseasesIds = [this.selectedDisase];
    // this.immediateNotification.diseasesIds = this.DiseasesArr;
    this.isDiseaseValid = this.generalDataService.validateField(
      this.immediateNotification.diseasesIds
    );
  }
  onDiseaseDisChanged() {
    this.DiseasesArr = this.selectedDisase.map((x) => x.id);
    this.immediateNotification.diseasesIds = this.DiseasesArr;
    this.isDiseaseValid = this.generalDataService.validateField(
      this.immediateNotification.diseasesIds
    );
  }
  onAllDiseaseChanged($event) {
    this.selectedDisase = $event;
    this.DiseasesArr = [];
    this.selectedDisase.forEach((x) => {
      this.DiseasesArr.push(x.id);
    });
    this.immediateNotification.diseasesIds = this.DiseasesArr;
    this.isDiseaseValid = this.generalDataService.validateField(
      this.immediateNotification.diseasesIds
    );
  }
  onAllDiseaseDisChanged($event) {
    this.selectedDisase = $event;
    this.DiseasesArr = this.selectedDisase.map((x) => x.id);
    this.immediateNotification.diseasesIds = this.DiseasesArr;
    this.isDiseaseValid = this.generalDataService.validateField(
      this.immediateNotification.diseasesIds
    );
  }

  // diseasesSelected() {
  //   this.immediateNotification.diseaseId = this.selecteddiseases;
  //   this.isDiseaseValid = this.generalDataService.validateField(this.immediateNotification.diseaseId);
  // }
  // diseasesDSelected() {
  //   this.immediateNotification.diseaseId = null;
  //   this.isDiseaseValid = this.generalDataService.validateField(this.immediateNotification.diseaseId);
  // }

  getBranches() {
    this.branchesLoading = true;
    this.lookupsService.getAllBranchesForUsers(this.organizationId,true).subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.branches = result.data;
          this.branches.unshift({
            id: null,
            arabicName: 'إختر',
            englishName: 'Select',
          });
          if (this.immediateNotification.branchId != null) {
            this.SelectedbranchId = this.immediateNotification.branchId;
            this.branchSelected();
          } else if (
            JSON.parse(localStorage.getItem('ls.authorizationData')).user
              .branchId != null
          ) {
            this.SelectedbranchId = JSON.parse(
              localStorage.getItem('ls.authorizationData')
            ).user.branchId;
            if (this.SelectedbranchId != null) {
              this.branchSelected();
            }
          } else {
            this.SelectedbranchId = -1;
          }
        }
        this.branchesLoading = false;
        this.loadingPanel = false;
      },
      (error) => {
        this.branchesLoading = false;
        this.loadingPanel = false;
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }

  branchSelected() {
    if (this.SelectedbranchId > 0) {
      this.immediateNotification.branchId = this.SelectedbranchId;
      this.getAreas();
      this.getIncidentSources(this.SelectedbranchId);
    } else {
      this.immediateNotification.branchId = null;
    }
    this.isBranchValid = this.generalDataService.validateField(
      this.immediateNotification.branchId
    );
  }

  getAreas() {
    this.areasLoading = true;
    this.lookupsService.getAllAreas(this.SelectedbranchId).subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.areas = result.data;
          this.areas.unshift({
            id: null,
            arabicName: 'إختر',
            englishName: 'Select',
          });

          if (this.immediateNotification.areaId != null) {
            this.SelectedareaId = this.immediateNotification.areaId;
            this.areaSelected();
          } else if (
            JSON.parse(localStorage.getItem('ls.authorizationData')).user
              .areaId != null
          ) {
            this.SelectedareaId = JSON.parse(
              localStorage.getItem('ls.authorizationData')
            ).user.areaId;
            if (this.SelectedareaId != null) {
              this.areaSelected();
            }
          } else {
            this.SelectedareaId = -1;
          }
        }
        this.areasLoading = false;
        this.loadingPanel = false;
      },
      (error) => {
        this.areasLoading = false;
        this.loadingPanel = false;
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }

  areaSelected() {
    if (this.SelectedareaId > 0) {
      this.immediateNotification.areaId = this.SelectedareaId;
      this.getIncidentSources(this.SelectedareaId);
    } else {
      this.immediateNotification.areaId = null;
    }
    this.isAreaValid = this.generalDataService.validateField(
      this.immediateNotification.areaId
    );
  }

  getGovernments(setDefault?: boolean) {
    this.governmentsLoading = true;
    this.lookupsService.getAllGovernments().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.governments = [
            { id: -1, arabicName: 'إختر', englishName: 'Select' },
          ];
          result.data.forEach((gov) => {
            this.governments.push(gov);
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
    if (this.selectedGovernment > 0) {
      this.incidentSources = [];
      this.immediateNotification.governmentId = this.selectedGovernment;
      if(this.organizationId === 4 || this.organizationId === 5){
        this.getPageIncidentSourceHospitalsForEductionalAndAmmana();
    } else {
      this.getHealthAdministrations(this.immediateNotification.governmentId);
    }
    } else {
      this.immediateNotification.governmentId = null;
      this.healthAdministrations = [];
      this.selectedHealthAdministration = -1;
    }
  }
  governmentDSelected() {
    this.immediateNotification.governmentId = null;
    this.immediateNotification = null;
    this.healthAdministrations = null;
    this.immediateNotification.healthAdministrationId = null;
    this.selectedincidentSource = null;
    this.incidentSources = null;
  }
  getHealthAdministrations(governmentID: any, setDefault?: boolean) {
    this.healthAdministrationsLoading = true;
    this.lookupsService
      .getPageHealthAdministrations({
        governmentID: governmentID,
      })
      .subscribe(
        (result: any) => {
          //alert("inside get health admin with set default = " + setDefault);
          if (result != null && result != undefined) {
            this.healthAdministrations = [
              { id: -1, arabicName: 'إختر', englishName: 'Select' },
            ];
            result.data.forEach((gov) => {
              this.healthAdministrations.push(gov);
            });
            if (
              this.immediateNotification.healthAdministrationId != null &&
              this.immediateNotification.healthAdministrationId != -1
            ) {
              this.selectedhealthAdministration =
                this.immediateNotification.healthAdministrationId;
              this.healthAdministrationSelected();
            } else if (
              JSON.parse(localStorage.getItem('ls.authorizationData')).user
                .healthAdministrationId != null
            ) {
              this.selectedhealthAdministration = JSON.parse(
                localStorage.getItem('ls.authorizationData')
              ).user.healthAdministrationId;
              if (this.selectedhealthAdministration != null) {
                this.healthAdministrationSelected();
              }
            } else {
              this.selectedhealthAdministration = -1;
            }
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
    if (this.selectedhealthAdministration != -1) {
      this.immediateNotification.healthAdministrationId =
        this.selectedhealthAdministration;
      this.isHealthAdministrationValid = this.generalDataService.validateField(
        this.immediateNotification.healthAdministrationId
      );
      this.getIncidentSources(
        this.immediateNotification.healthAdministrationId
      );
    }
  }
  healthAdministrationDSelected() {
    this.immediateNotification.healthAdministrationId = null;
    this.isHealthAdministrationValid = this.generalDataService.validateField(
      this.immediateNotification.healthAdministrationId
    );
    this.incidentSources = null;
    this.selectedincidentSource = null;
  }
  incidentSourcesSelected() {
    this.immediateNotification.incidentSourceId = this.selectedincidentSource;
    this.isIncidentSourceValid = this.generalDataService.validateField(
      this.immediateNotification.incidentSourceId
    );
  }
  incidentSourcesDeSelected() {
    this.immediateNotification.incidentSourceId = null;
    this.isIncidentSourceValid = this.generalDataService.validateField(
      this.immediateNotification.incidentSourceId
    );
  }
  getIncidentSources(healthAdministrationID: any, setDefault?: boolean) {
    this.incidentSourcesLoading = true;
    this.lookupsService
      .getPageIncidentSourceHospitals({
        healthAdministrationID:
          this.activeUSerService.getAccessibleParts?.showBranches ||
          this.activeUSerService.getAccessibleParts?.showUniversities
            ? null
            : healthAdministrationID,
        branchId: this.activeUSerService.getAccessibleParts?.showAreas
          ? null
          : this.SelectedbranchId,
        areaId: this.SelectedareaId,
      })
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.incidentSources = [
              { id: -1, arabicName: 'إختر', englishName: 'Select' },
            ];
            result.data.forEach((incident) => {
              this.incidentSources.push(incident);
            });
            // this.incidentSources = result.data;
            if (
              this.immediateNotification.incidentSourceId != null &&
              this.immediateNotification.incidentSourceId != -1
            ) {
              this.selectedincidentSource =
                this.immediateNotification.incidentSourceId;
            } else if (
              JSON.parse(localStorage.getItem('ls.authorizationData')).user
                .incidentSourceId != null
            ) {
              setTimeout(() => {
                this.selectedincidentSource = JSON.parse(
                  localStorage.getItem('ls.authorizationData')
                ).user.incidentSourceId;
                if (this.selectedincidentSource != null) {
                  this.incidentSourcesSelected();
                }
              }, 200);
            } else {
              this.selectedincidentSource = -1;
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

  search() {
    this.first = 0;
    this.immediateNotificationFilter.pageIndex = 0;
    this.last =
      this.immediateNotificationFilter.pageIndex *
      this.immediateNotificationFilter.pageSize;
    this.getImmediateNotifications();
  }

  getImmediateNotifications() {
    this.loadingPanel = true;
    this.immediateNotificationService
      .getPageNotifications(this.immediateNotificationFilter)
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.immediateNotifications = result.data;
            if (
              this.immediateNotifications != undefined &&
              this.immediateNotifications.length == 0
            ) {
              this.noData = true;
              this.pages = 0;
            } else {
              this.noData = false;
              this.pages = result.data[0].totalCount;
              this.last =
                this.immediateNotificationFilter.pageIndex *
                this.immediateNotificationFilter.pageSize;
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

  getById(id: number) {
    this.immediateNotificationService.getNotificationById(id).subscribe(
      (result: any) => {
        // document
        //   .getElementById('jump_to_this_location')
        //   .scrollIntoView({ behavior: 'smooth' });
        this.immediateNotification = result.data;
        this.immediateNotification.fromDate = this.datePipe.transform(
          this.immediateNotification.fromDate,
          'yyyy-MM-dd'
        );
        this.immediateNotification.toDate = this.datePipe.transform(
          this.immediateNotification.toDate,
          'yyyy-MM-dd'
        );

        this.selectedDisase = this.immediateNotification.diseasesIds[0];
        if (this.selectedDisase) {
          this.getDiseases();
        } else {
          this.selectedDisase = [];
        }
        this.selectedGovernment = this.immediateNotification.governmentId;
        if (this.selectedGovernment) {
          this.getHealthAdministrations(
            this.immediateNotification.governmentId
          );
        } else {
          this.selectedGovernment = -1;
        }
        if (this.immediateNotification.branchId > 0) {
          this.SelectedbranchId = this.immediateNotification.branchId;
        }
        if (this.immediateNotification.areaId > 0) {
          this.SelectedareaId = this.immediateNotification.areaId;
        }
        if (this.immediateNotification.incidentSourceId > 0) {
          this.selectedincidentSource =
            this.immediateNotification.incidentSourceId;
        }
      },
      () => {
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }

  isValidInfectionsCount: boolean = true;
  isValidMaleCount: boolean = true;
  isValidFemaleCount: boolean = true;
  isValidAgeLowerThanMonth: boolean = true;
  isValidAgeLowerThanYear: boolean = true;
  isValidageUpToFive: boolean = true;
  isValidageUpToFifteen: boolean = true;
  isValidageUpToThirtyFive: boolean = true;
  isValidageUpToSixtyFive: boolean = true;
  isValidAgeMoreThan65:boolean = true;
  validateRequiredData(): boolean {
    this.isDiseaseValid = this.generalDataService.validateArr(
      this.immediateNotification.diseasesIds
    );

    if(this.organizationId === 1 || 
      this.organizationId === 4 || 
      this.organizationId === 5
     ){
      this.isGovernmentValid = this.generalDataService.validateField(
        this.immediateNotification.governmentId
      );
    }

    this.isHealthAdministrationValid = this.activeUSerService.getAccessibleParts
      ?.showDepartments
      ? this.generalDataService.validateField(
          this.immediateNotification.healthAdministrationId
        )
      : true;

    this.isBranchValid =
      this.activeUSerService.getAccessibleParts?.showUniversities ||
      this.activeUSerService.getAccessibleParts?.showBranches
        ? this.generalDataService.validateField(
            this.immediateNotification.branchId
          )
        : true;

    this.isAreaValid = this.activeUSerService.getAccessibleParts?.showAreas
      ? this.generalDataService.validateField(this.immediateNotification.areaId)
      : true;

    this.isIncidentSourceValid = this.activeUSerService.getAccessibleParts
      ?.showSources
      ? this.generalDataService.validateField(
          this.immediateNotification.incidentSourceId
        )
      : true;

    this.isToDateValid = this.generalDataService.validateField(
      this.immediateNotification.toDate
    );
    this.isFromDateValid = this.generalDataService.validateField(
      this.immediateNotification.fromDate
    );
    this.isValidInfectionsCount = this.generalDataService.validateField(
      this.immediateNotification.infectionsCount
    );
    this.isValidMaleCount = this.immediateNotification.femaleCount
      ? this.generalDataService.validateField(
          this.immediateNotification.maleCount
        )
      : true;
    this.isValidFemaleCount = this.immediateNotification.maleCount
      ? this.generalDataService.validateField(
          this.immediateNotification.femaleCount
        )
      : true;
    this.isValidAgeLowerThanMonth =
      this.immediateNotification.ageLowerThanYear ||
      this.immediateNotification.ageUpTo5 ||
      this.immediateNotification.ageUpTo15 ||
      this.immediateNotification.ageUpTo35 ||
      this.immediateNotification.ageUpTo65 ||
      this.immediateNotification.ageMoreThan65
        ? this.generalDataService.validateField(
            this.immediateNotification.ageLowerThanMonth
          )
        : true;

    this.isValidAgeLowerThanYear =
      this.immediateNotification.ageLowerThanMonth ||
      this.immediateNotification.ageUpTo5 ||
      this.immediateNotification.ageUpTo15 ||
      this.immediateNotification.ageUpTo35 ||
      this.immediateNotification.ageUpTo65 ||
      this.immediateNotification.ageMoreThan65
        ? this.generalDataService.validateField(
            this.immediateNotification.ageLowerThanYear
          )
        : true;

    this.isValidageUpToFive =
      this.immediateNotification.ageLowerThanYear ||
      this.immediateNotification.ageLowerThanMonth ||
      this.immediateNotification.ageUpTo15 ||
      this.immediateNotification.ageUpTo35 ||
      this.immediateNotification.ageUpTo65 ||
      this.immediateNotification.ageMoreThan65
        ? this.generalDataService.validateField(
            this.immediateNotification.ageUpTo5
          )
        : true;

    this.isValidageUpToFifteen =
      this.immediateNotification.ageLowerThanYear ||
      this.immediateNotification.ageLowerThanMonth ||
      this.immediateNotification.ageUpTo5 ||
      this.immediateNotification.ageUpTo35 ||
      this.immediateNotification.ageUpTo65 ||
      this.immediateNotification.ageMoreThan65
        ? this.generalDataService.validateField(
            this.immediateNotification.ageUpTo15
          )
        : true;

    this.isValidageUpToThirtyFive =
      this.immediateNotification.ageLowerThanYear ||
      this.immediateNotification.ageLowerThanMonth ||
      this.immediateNotification.ageUpTo5 ||
      this.immediateNotification.ageUpTo15 ||
      this.immediateNotification.ageUpTo65 ||
      this.immediateNotification.ageMoreThan65
        ? this.generalDataService.validateField(
            this.immediateNotification.ageUpTo35
          )
        : true;

    this.isValidageUpToSixtyFive =
      this.immediateNotification.ageLowerThanYear ||
      this.immediateNotification.ageLowerThanMonth ||
      this.immediateNotification.ageUpTo5 ||
      this.immediateNotification.ageUpTo15 ||
      this.immediateNotification.ageUpTo35 ||
      this.immediateNotification.ageMoreThan65
        ? this.generalDataService.validateField(
            this.immediateNotification.ageUpTo65
          )
        : true;

      this.isValidAgeMoreThan65 = 
      this.immediateNotification.ageLowerThanYear ||
      this.immediateNotification.ageLowerThanMonth ||
      this.immediateNotification.ageUpTo5 ||
      this.immediateNotification.ageUpTo15 ||
      this.immediateNotification.ageUpTo35 ||
      this.immediateNotification.ageUpTo65
        ? this.generalDataService.validateField(
            this.immediateNotification.ageMoreThan65
          )
        : true;

    if (
      !this.isDiseaseValid ||
      !this.isGovernmentValid ||
      !this.isHealthAdministrationValid ||
      !this.isBranchValid ||
      !this.isAreaValid ||
      !this.isIncidentSourceValid ||
      !this.isToDateValid ||
      !this.isFromDateValid ||
      !this.isValidInfectionsCount ||
      !this.isValidMaleCount ||
      !this.isValidFemaleCount ||
      !this.isValidAgeLowerThanMonth ||
      !this.isValidAgeLowerThanYear ||
      !this.isValidageUpToFive ||
      !this.isValidageUpToFifteen ||
      !this.isValidageUpToThirtyFive ||
      !this.isValidageUpToSixtyFive ||
      !this.isValidAgeMoreThan65
    )
      return false;

    return true;
  }
  validateInfectionsMaleFemalCount() {
    if (this.immediateNotification.infectionsCount != null) {
      if (
        this.immediateNotification.maleCount &&
        this.immediateNotification.femaleCount
      ) {
        let maleCount =
          this.immediateNotification.maleCount != '' &&
          this.immediateNotification.maleCount != null
            ? parseInt(this.immediateNotification.maleCount)
            : 0;
        let femaleCount =
          this.immediateNotification.femaleCount != '' &&
          this.immediateNotification.femaleCount != null
            ? parseInt(this.immediateNotification.femaleCount)
            : 0;
        let allCount = maleCount + femaleCount;
        if (allCount != this.immediateNotification.infectionsCount) {
          return false;
        }
      }
    }
    return true;
  }
  validateInfectionsYearCount() {
    if (this.immediateNotification.infectionsCount != null) {
      if (
        this.immediateNotification.ageLowerThanMonth &&
        this.immediateNotification.ageLowerThanYear &&
        this.immediateNotification.ageUpTo5 &&
        this.immediateNotification.ageUpTo15 &&
        this.immediateNotification.ageUpTo35 &&
        this.immediateNotification.ageUpTo65
      ) {
        let ageLowerThanMonth =
          this.immediateNotification.ageLowerThanMonth != '' &&
          this.immediateNotification.ageLowerThanMonth != null
            ? parseInt(this.immediateNotification.ageLowerThanMonth)
            : 0;
        let ageLowerThanYear =
          this.immediateNotification.ageLowerThanYear != '' &&
          this.immediateNotification.ageLowerThanYear != null
            ? parseInt(this.immediateNotification.ageLowerThanYear)
            : 0;
        let ageUpTo15 =
          this.immediateNotification.ageUpTo15 != '' &&
          this.immediateNotification.ageUpTo15 != null
            ? parseInt(this.immediateNotification.ageUpTo15)
            : 0;
        let ageUpTo35 =
          this.immediateNotification.ageUpTo35 != '' &&
          this.immediateNotification.ageUpTo35 != null
            ? parseInt(this.immediateNotification.ageUpTo35)
            : 0;
        let ageUpTo5 =
          this.immediateNotification.ageUpTo5 != '' &&
          this.immediateNotification.ageUpTo5 != null
            ? parseInt(this.immediateNotification.ageUpTo5)
            : 0;
        let ageUpTo65 =
          this.immediateNotification.ageUpTo65 != '' &&
          this.immediateNotification.ageUpTo65 != null
            ? parseInt(this.immediateNotification.ageUpTo65)
            : 0;

        let ageMoreThan65 =
            this.immediateNotification.ageMoreThan65 != '' &&
            this.immediateNotification.ageMoreThan65 != null
              ? parseInt(this.immediateNotification.ageMoreThan65)
              : 0;

        let allCount =
          ageLowerThanMonth +
          ageLowerThanYear +
          ageMoreThan65 +
          ageUpTo15 +
          ageUpTo35 +
          ageUpTo5 +
          ageUpTo65;
        if (allCount != this.immediateNotification.infectionsCount) {
          return false;
        }
      }
    }
    return true;
  }

  onNumberKeyPress(event: KeyboardEvent): void {
    let inputKey = event.key;
    if (
      inputKey !== '+' &&
      inputKey !== 'Backspace' &&
      isNaN(Number(inputKey))
    ) {
      event.preventDefault();
    }
  }

  resetForm() {
    this.selectedDisase = [];
    this.selectedAdministrationId = -1;
    this.selectedhealthAdministration = -1;
    this.selectedgovernment = -1;
    this.selectedincidentSource = -1;
    this.SelectedareaId = -1;
    this.SelectedbranchId = -1;
    this.getGovernments(true);
    this.selecteddiseases = -1;
  }

  save() {
    this.TotalValid = false;
    if (
      !this.validateInfectionsMaleFemalCount() ||
      !this.validateInfectionsYearCount()
      //   &&
      // (this.immediateNotification.ageLowerThanMonth ||
      //   this.immediateNotification.ageLowerThanYear ||
      //   this.immediateNotification.ageUpTo5 ||
      //   this.immediateNotification.ageUpTo15 ||
      //   this.immediateNotification.ageUpTo35 ||
      //   this.immediateNotification.ageUpTo65)
    ) {
      this.userMsg.error(
        this.currentLang == 'ar'
          ? 'عدد الحالات الاجمالي يجب ان يساوى عدد الحالات الذكور والاناث معا و يجب ان يساوى عدد الحالات الموزعه علي السنوات'
          : 'Total count should be equal to the sum of male and femal count and equal to the sum of all years count'
      );
      return;
    }

    if (!this.validateRequiredData()) {
      this.userMsg.error(
        this.currentLang == 'ar'
          ? 'يجب ادخال كل الحقول'
          : 'All required fields should be filled'
      );
      return;
    }
    if (this.immediateNotification.id == null) {
      if (this.immediateNotification.incidentSourceId == null) {
        this.immediateNotification.incidentSourceId = JSON.parse(
          localStorage.getItem('ls.authorizationData')
        ).user.incidentSourceId;
      }
      if (
        this.selectedgovernment != undefined &&
        this.selectedGovernment != -1
      ) {
        this.immediateNotification.governmentId = this.selectedGovernment;
      }
      if (
        this.selectedhealthAdministration != undefined &&
        this.selectedhealthAdministration != -1
      ) {
        this.immediateNotification.healthAdministrationId =
          this.selectedhealthAdministration;
      }

      this.immediateNotificationService
        .addImmediateInstantNotification(this.immediateNotification)
        .subscribe(
          (response: any) => {
            if (response) {
              this.translateService
                .get('NEDSS.COMMON.SENT_SUCESSFULLY')
                .subscribe((res: string) => {
                  this.userMsg.success(res);
                });
              this.resetForm();
              this.getImmediateNotifications();
              this.immediateNotification = {
                id: null,
                isZero: false,
                diseasesIds: null,
                governmentId: null,
                healthAdministrationId: null,
                incidentSourceId: null,
                branchId: null,
                areaId: null,
                casesPartioning: null,
                infectionsCount: null,
                maleCount: null,
                femaleCount: null,
                fromDate: null,
                toDate: null,
                ageLowerThanMonth: null,
                ageLowerThanYear: null,
                ageUpTo5: null,
                ageUpTo15: null,
                ageUpTo35: null,
                ageUpTo65: null,
                ageMoreThan65: null,
              };
            }
          },
          (error) => {
            this.translateService
              .get('NEDSS.COMMON.SENT_FAILD')
              .subscribe((res: string) => {
                this.userMsg.error(res);
              });
          }
        );
    } else this.update();
    //}
  }

  update() {
    this.immediateNotificationService
      .updateImmediateInstantNotification(this.immediateNotification)
      .subscribe(
        (response: any) => {
          if (response) {
            this.translateService
              .get('NEDSS.COMMON.UPDATE_SUCESSFULLY')
              .subscribe((res: string) => {
                this.userMsg.success(res);
              });
            this.resetForm();
            this.getImmediateNotifications();
            this.immediateNotification = {
              id: null,
              isZero: false,
              diseasesIds: null,
              governmentId: null,
              healthAdministrationId: null,
              incidentSourceId: null,
              branchId: null,
              areaId: null,
              casesPartioning: null,
              infectionsCount: null,
              maleCount: null,
              femaleCount: null,
              fromDate: null,
              toDate: null,
              ageLowerThanMonth: null,
              ageLowerThanYear: null,
              ageUpTo5: null,
              ageUpTo15: null,
              ageUpTo35: null,
              ageUpTo65: null,
              ageMoreThan65: null,
            };
          }
        },
        (error) => {
          this.translateService
            .get('NEDSS.COMMON.UPDATE_FAILD')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
        }
      );
  }

  sort(event: SortEvent) {
    if (
      event.order == -1 &&
      (this.immediateNotificationFilter.sortOrder != SortOrder.desc ||
        this.immediateNotificationFilter.sortColumn != event.field)
    ) {
      this.immediateNotificationFilter.sortOrder = SortOrder.desc;
      this.immediateNotificationFilter.sortColumn = event.field;
      this.getImmediateNotifications();
    } else if (
      event.order == 1 &&
      (this.immediateNotificationFilter.sortOrder != SortOrder.asc ||
        this.immediateNotificationFilter.sortColumn != event.field)
    ) {
      this.immediateNotificationFilter.sortOrder = SortOrder.asc;
      this.immediateNotificationFilter.sortColumn = event.field;
      this.getImmediateNotifications();
    }
    // if (
    //   event.order == -1 &&
    //   this.immediateNotificationFilter.sortOrder != SortOrder.desc
    // ) {
    //   this.immediateNotificationFilter.sortOrder = SortOrder.desc;
    //   if (typeof event.field === 'string')
    //     this.immediateNotificationFilter.sortColumn = event.field;
    //   this.getImmediateNotifications();
    // } else if (
    //   event.order == 1 &&
    //   this.immediateNotificationFilter.sortOrder != SortOrder.asc
    // ) {
    //   this.immediateNotificationFilter.sortOrder = SortOrder.asc;
    //   if (typeof event.field === 'string')
    //     this.immediateNotificationFilter.sortColumn = event.field;
    //   this.getImmediateNotifications();
    // }
  }

  paginate(event: any) {
    this.first = event.first;
    this.last = event.last;
    this.immediateNotificationFilter.pageIndex = event.page;
    this.immediateNotificationFilter.pageSize = event.rows;
    this.getImmediateNotifications();
  }

  delete(id: number) {
    this.immediateNotificationService.deleteNotification(id).subscribe(
      (result: any) => {
        this.getImmediateNotifications();
        this.translateService
          .get('NEDSS.COMMON.DELETED_SUCESSFULLY')
          .subscribe((res: string) => {
            this.userMsg.success(res);
          });
        this.resetForm();
        this.getImmediateNotifications();
        this.immediateNotification = {
          id: null,
          isZero: false,
          diseasesIds: null,
          governmentId: null,
          healthAdministrationId: null,
          incidentSourceId: null,
          branchId: null,
          areaId: null,
          casesPartioning: null,
          infectionsCount: null,
          maleCount: null,
          femaleCount: null,
          fromDate: null,
          toDate: null,
          ageLowerThanMonth: null,
          ageLowerThanYear: null,
          ageUpTo5: null,
          ageUpTo15: null,
          ageUpTo35: null,
          ageUpTo65: null,
          ageMoreThan65: null,
        };
      },
      (error) => {
        this.translateService
          .get('NEDSS.COMMON.DELETED_FAILED')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }

  clearSearch() {
    this.immediateNotificationFilter.searchText = '';
    this.search();
  }

  exportPatiantsAsExcel() {
    this.exportService.exportTableAsExcel(this.tableElement, this.screenName);
  }

  exportPatientsAsPdf() {
    let governmentNames = this.immediateNotifications?.map(
      (item) => item.governmentName
    );
    let uniqueGovernmentNamesSet = new Set(governmentNames);
    let uniqueGovernmentNamesArray = Array.from(uniqueGovernmentNamesSet);
    // console.log(uniqueGovernmentNamesArray);

    let selectedAdmNames = this.immediateNotifications?.map(
      (item) => item.healthAdministrationName
    );
    let uniqueselectedAdmNamesSet = new Set(selectedAdmNames);
    let uniqueselectedAdmNamesArray = Array.from(uniqueselectedAdmNamesSet);
    // console.log(uniqueselectedAdmNamesArray);

    let selectedIncsNames = this.immediateNotifications?.map(
      (item) => item.incidentSourceName
    );
    let uniqueselectedIncsNamesSet = new Set(selectedIncsNames);
    let uniqueselectedIncsNamesArray = Array.from(uniqueselectedIncsNamesSet);
    // console.log(uniqueselectedIncsNamesArray);

    this.exportService.exportTemplateAsPdfSave(
      document.getElementById(this.currentConfig),
      'الابلاغ الفوري',
      [
        uniqueGovernmentNamesArray,
        uniqueselectedAdmNamesArray,
        uniqueselectedIncsNamesArray,
      ]
    );
  }

  // exportPatientsAsPdf() {
  //   this.exportService.exportTemplateAsPdfLogoTitle(document.getElementById(this.currentConfig),
  //    'الابلاغ الفوري'
  //  );
  // }

  fromDateSelected(event) {
    this.immediateNotification.fromDate = event.value;
    this.isFromDateValid = this.generalDataService.validateField(
      this.immediateNotification.fromDate
    );
  }
  toDateSelected(event) {
    this.immediateNotification.toDate = event.value;
    this.isToDateValid = this.generalDataService.validateField(
      this.immediateNotification.toDate
    );
  }

  getPageIncidentSourceHospitalsForEductionalAndAmmana(){
    this.incidentSourcesLoading = true;
    this.lookupsService.getPageIncidentSourceHospitals({
      GovernmentID:this.immediateNotification.governmentId,
      organizationID:this.organizationId,
      forSystemUser:true
    }).pipe(finalize(() => (this.incidentSourcesLoading = false))).subscribe({
      next:(result) => {
        if (result != null && result != undefined) {
          this.incidentSources = [
            { id: -1, arabicName: 'إختر', englishName: 'Select' },
          ];
          result.data.forEach((gov) => {
            this.incidentSources.push(gov);
          });

          if (this.immediateNotification.incidentSourceId != null) {
            this.selectedincidentSource =
              this.immediateNotification.incidentSourceId;
          } else if (
            JSON.parse(localStorage.getItem('ls.authorizationData')).user
              .incidentSourceId != null
          ) {
            setTimeout(() => {
              this.selectedincidentSource = JSON.parse(
                localStorage.getItem('ls.authorizationData')
              ).user.incidentSourceId;
              if (this.selectedincidentSource != null) {
                this.incidentSourcesSelected();
              }
            }, 200);
          } else {
            this.selectedincidentSource = -1;
          }
        }
        this.loadingPanel = false;
      }
    })

  }
}
