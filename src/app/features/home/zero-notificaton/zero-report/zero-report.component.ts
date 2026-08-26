import { Component, ElementRef, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  MultipleDropdownSettings,
  SingleDropdownSettings,
  SortOrder,
} from 'src/app/core/constants';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { SharedDataService } from '../../general-data/services/shared-data.service';
import { SortEvent } from 'primeng/api';
import { fromEvent, map, debounceTime, distinctUntilChanged } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ZeroInstantNotificationService } from '../Services/zero-instant-notification.service';
import { DatePipe } from '@angular/common';
import { GeneralDataService } from '../../general-data/services/general-data.service';
import { ExportService } from '../../../../core/services/export.service';
import { Router } from '@angular/router';
import { ExportAsConfig } from 'ngx-export-as';
import { ActiveUserService } from 'src/app/core/services/active-user.service';

@Component({
  selector: 'app-zero-report',
  templateUrl: './zero-report.component.html',
  styleUrls: ['./zero-report.component.css'],
})
export class ZeroReportComponent {
  @ViewChild('myTableElementId', { static: false }) tableElement: ElementRef;
  screenName: string;
  minDate = new Date(1900, 0, 1);
  maxDate = new Date();
  singleDropdownSettings = {};
  multiDropdownSettings = {};
  currentLang: string;
  dir: string;
  delay: boolean = false;
  event: boolean = false;
  timer: any;
  departments: any;
  selectedDepartment: any[] = [];
  startDate: any;
  endDate: any;
  currentConfig: string = 'myTableElementId';
  exportAsPdfConfig: ExportAsConfig = {
    type: 'pdf', // the type you want to download
    elementIdOrContent: this.currentConfig, // the id of html/table element
  };
  multipleDropdownSettings = MultipleDropdownSettings;

  zeroInstantNotification = {
    id: null,
    isZero: null,
    diseasesIds: [],
    governmentId: null,
    healthAdministrationId: null,
    incidentSourceId: null,
    branchId: null,
    areaId: null,
    casesPartioning: null,
    maleCount: null,
    femaleCount: null,

    fromDate: null,
    toDate: null,
  };
  underDeleting = {
    diseaseName: '',
    id: null,
  };
  levelId: any;
  dvalue: any;
  diseases!: any[];
  governments!: any[];
  healthAdministrations!: any[];
  incidentSources!: any[];
  loadingPanel: boolean = false;
  selectedincidentSource: any;
  selectedDisase: any;
  zeroInstantNotificationFilter = {
    pageSize: 10,
    pageIndex: 0,
    sortOrder: SortOrder.asc,
    sortColumn: 'GovernmentName',
    searchText: '',
    isZero: true,
    firstTime: false,
  };
  zeroInstantNotifications!: any[];
  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;

  noData: boolean = true;
  first: number = 0;
  last: number = 0;
  pages: number = 0;
  healthAdministrationId: number;
  organizationId = null;
  selectedGovernment: number = -1;
  selectedHealthAdministration: number;
  selectedIncedentSource: any;
  DiseasesArr: any = [];
  SelectedbranchId: number;
  branches: any[];
  SelectedareaId: number;
  areas: any[];

  constructor(
    private sharedDataService: SharedDataService,
    private lookupsService: LookupsGetterService,
    private zeroInstantNotificationService: ZeroInstantNotificationService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private datePipe: DatePipe,
    private exportService: ExportService,
    public router: Router,
    public generalDataService: GeneralDataService,
    public activeUSerService: ActiveUserService
  ) {}

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
    this.healthAdministrationId = JSON.parse(
      localStorage.getItem('ls.authorizationData')
    ).user.healthAdministrationId;
    this.selectedGovernment = JSON.parse(
      localStorage.getItem('ls.authorizationData')
    ).user.govenmentId;
    setTimeout(() => {
      this.selectedincidentSource = JSON.parse(
        localStorage.getItem('ls.authorizationData')
      ).user.incidentSourceId;
    }, 200);

    this.organizationId = JSON.parse(
      localStorage.getItem('ls.authorizationData')
    ).user?.organizationId;

    this.selectedGovernment = -1;
    this.singleDropdownSettings = SingleDropdownSettings;
    this.multiDropdownSettings = MultipleDropdownSettings;
    // this.getDiseases();
    this.getGovernments(true);
    if (
      this.activeUSerService.getAccessibleParts?.showBranches ||
      this.activeUSerService.getAccessibleParts?.showUniversities
    ) {
      this.getBranches();
    }

    this.getZeroInstantNotifications(true);
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

  Tablesearch(e) {
    this.zeroInstantNotificationFilter.searchText = e.target.value;
    this.getZeroInstantNotifications(false);
    // if (e.target.value.toLowerCase().length == 0) {
    //   this.search();
    // }
    // if (this.event) {
    //   this.zeroInstantNotifications = this.zeroInstantNotifications.filter(
    //     (m) => m.name.toLowerCase().includes(e.target.value.toLowerCase())
    //   );
    // } else {
    //   this.zeroInstantNotifications = this.zeroInstantNotifications.filter(
    //     (m) =>
    //       m.incidentSourceName
    //         .toLowerCase()
    //         .includes(e.target.value.toLowerCase())
    //   );
    // }
  }

  getDiseases() {
    this.lookupsService.getAllDiseases().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.diseases = result.data;
          // result.data.forEach((nat) => {
          //   this.diseases.push(nat);
          // });
          this.selectedHealthAdministration = -1;

          if (this.zeroInstantNotification.diseasesIds.length > 0) {
            this.selectedDisase = this.diseases.filter((x) =>
              this.zeroInstantNotification.diseasesIds.includes(x.id)
            );
          } else {
            this.selectedDisase = [];
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

  getBranches() {
    this.lookupsService.getAllBranchesForUsers(this.organizationId,true).subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.branches = result.data;
          this.branches.unshift({
            id: null,
            arabicName: 'إختر',
            englishName: 'Select',
          });
          if (this.zeroInstantNotification.branchId != null) {
            this.SelectedbranchId = this.zeroInstantNotification.branchId;
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

  branchSelected() {
    if (this.SelectedbranchId > 0) {
      this.zeroInstantNotification.branchId = this.SelectedbranchId;
      this.getAreas();
      this.getIncidentSources(this.SelectedbranchId);
    } else {
      this.zeroInstantNotification.branchId = null;
    }
    this.isBranchValid = this.generalDataService.validateField(
      this.zeroInstantNotification.branchId
    );
  }

  getAreas() {
    this.lookupsService.getAllAreas(this.SelectedbranchId).subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.areas = result.data;
          this.areas.unshift({
            id: null,
            arabicName: 'إختر',
            englishName: 'Select',
          });

          if (this.zeroInstantNotification.areaId != null) {
            this.SelectedareaId = this.zeroInstantNotification.areaId;
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

  areaSelected() {
    if (this.SelectedareaId > 0) {
      this.zeroInstantNotification.areaId = this.SelectedareaId;
      this.getIncidentSources(this.SelectedareaId);
    } else {
      this.zeroInstantNotification.areaId = null;
    }
    this.isAreaValid = this.generalDataService.validateField(
      this.zeroInstantNotification.areaId
    );
  }

  getGovernments(setDefault?: boolean) {
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
    if (this.selectedGovernment > 0) {
      this.incidentSources = [];
      this.zeroInstantNotification.governmentId = this.selectedGovernment;
      if(this.organizationId === 4 || this.organizationId === 5){
          this.getPageIncidentSourceHospitalsForEductionalAndAmmana();
      } else {
        
        this.getHealthAdministrations(this.zeroInstantNotification.governmentId);
      }
    } else {
      this.zeroInstantNotification.governmentId = null;
      this.healthAdministrations = [];
      this.selectedHealthAdministration = -1;
    }
  }
  governmentDSelected() {
    this.zeroInstantNotification.governmentId = null;
    this.healthAdministrationId = null;
    this.healthAdministrations = null;
    this.zeroInstantNotification.healthAdministrationId = null;
    this.selectedincidentSource = null;
    this.incidentSources = null;
  }
  getHealthAdministrations(governmentID: any, setDefault?: boolean) {
    this.lookupsService
      .getPageHealthAdministrations({
        governmentID: governmentID,
      })
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.healthAdministrations = [
              { id: -1, arabicName: 'إختر', englishName: 'Select' },
            ];
            result.data.forEach((gov) => {
              this.healthAdministrations.push(gov);
            });
            if (this.zeroInstantNotification.healthAdministrationId != null) {
              this.healthAdministrationId =
                this.zeroInstantNotification.healthAdministrationId;
              this.healthAdministrationSelected();
            } else if (
              JSON.parse(localStorage.getItem('ls.authorizationData')).user
                .healthAdministrationId != null
            ) {
              this.healthAdministrationId = JSON.parse(
                localStorage.getItem('ls.authorizationData')
              ).user.healthAdministrationId;
              if (this.healthAdministrationId != null) {
                this.healthAdministrationSelected();
              }
            } else {
              this.healthAdministrationId = -1;
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
  healthAdministrationSelected() {
    if (this.healthAdministrationId != -1) {
      this.zeroInstantNotification.healthAdministrationId =
        this.healthAdministrationId;
      this.getIncidentSources(
        this.zeroInstantNotification.healthAdministrationId
      );
    }
  }
  healthAdministrationDSelected() {
    this.zeroInstantNotification.healthAdministrationId = null;
    this.selectedincidentSource = null;
    this.incidentSources = null;
    this.selectedincidentSource = null;
  }

  getIncidentSources(healthAdministrationID: any, setDefault?: boolean) {
    this.lookupsService
      .getPageIncidentSourceHospitals({
        healthAdministrationID: this.healthAdministrationId,
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
            result.data.forEach((gov) => {
              this.incidentSources.push(gov);
            });

            if (this.zeroInstantNotification.incidentSourceId != null) {
              this.selectedincidentSource =
                this.zeroInstantNotification.incidentSourceId;
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
    this.first = 0;
    this.zeroInstantNotificationFilter.pageIndex = 0;
    this.last =
      this.zeroInstantNotificationFilter.pageIndex *
      this.zeroInstantNotificationFilter.pageSize;
    this.getZeroInstantNotifications();
  }

  getZeroInstantNotifications(firstTime?: boolean) {
    this.loadingPanel = true;
    this.zeroInstantNotificationFilter.firstTime = firstTime;
    this.zeroInstantNotificationService
      .getPageNotifications(this.zeroInstantNotificationFilter)
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.zeroInstantNotifications = result.data;
            if (
              this.zeroInstantNotifications != undefined &&
              this.zeroInstantNotifications.length == 0
            ) {
              this.noData = true;
              this.pages = 0;
              this.event = true;
            } else {
              this.noData = false;
              this.pages = result.data[0].totalCount;
              this.last =
                this.zeroInstantNotificationFilter.pageIndex *
                this.zeroInstantNotificationFilter.pageSize;
              this.event = false;
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

  fromDate: any;
  getById(id: number) {
    this.zeroInstantNotificationService.getNotificationById(id).subscribe(
      (result: any) => {
        // document
        //   .getElementById('jump_to_this_location')
        //   .scrollIntoView({ behavior: 'smooth' });
        console.log(this.organizationId);
        this.zeroInstantNotification = result.data;
        var datePipe = new DatePipe('en-EG');
        this.zeroInstantNotification.fromDate = datePipe.transform(
          this.zeroInstantNotification.fromDate,
          'yyyy-MM-dd'
        );
        this.zeroInstantNotification.toDate = datePipe.transform(
          this.zeroInstantNotification.toDate,
          'yyyy-MM-dd'
        );
        // if (this.zeroInstantNotification.diseasesIds.length > 0) {
        //   this.getDiseases();
        // } else {
        //   this.selectedDisase = [];
        // }

        this.selectedGovernment = this.zeroInstantNotification.governmentId;
        if (this.selectedGovernment) {
          this.getHealthAdministrations(
            this.zeroInstantNotification.governmentId
          );
          if(this.organizationId == 4 || this.organizationId == 5){
            this.getIncidentSources(
              this.zeroInstantNotification.governmentId
            );
          }
        }

        this.healthAdministrationId =
          this.zeroInstantNotification.healthAdministrationId;
        if (this.healthAdministrationId) {
          this.getIncidentSources(
            this.zeroInstantNotification.healthAdministrationId
          );
        }

        if (this.zeroInstantNotification.branchId > 0) {
          this.SelectedbranchId = this.zeroInstantNotification.branchId;
          if(this.organizationId == 7 || this.organizationId == 3){
            this.getIncidentSources(this.SelectedbranchId);
          } else {
            this.getAreas();
          }
        }


        if (this.zeroInstantNotification.areaId > 0) {
          this.SelectedareaId = this.zeroInstantNotification.areaId;
          this.getIncidentSources(this.SelectedareaId);
        }

        if (this.zeroInstantNotification.incidentSourceId > 0) {
          this.selectedincidentSource =
            this.zeroInstantNotification.incidentSourceId;
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

  // save() {
  //   if (this.validateRequiredData()) {
  //     if (this.zeroInstantNotification.id == null) {

  //       this.zeroInstantNotificationService.addZeroInstantNotification(this.zeroInstantNotification).subscribe(
  //         (response: any) => {
  //           if (response) {
  //             this.translateService
  //               .get('NEDSS.COMMON.SENT_SUCESSFULLY')
  //               .subscribe((res: string) => {
  //                 this.userMsg.success(res);
  //               });
  //             this.getZeroInstantNotifications();
  //             this.zeroInstantNotification = {
  //               id: null,
  //               isZero: null,
  //               diseasesIds: null,
  //               governmentId: null,
  //               healthAdministrationId: -1,
  //               incidentSourceId: null,
  //               casesPartioning: null,
  //               maleCount: null,
  //               femaleCount: null,
  //               fromDate: null,
  //               toDate: null
  //             };
  //           }
  //         },
  //         (error) => {
  //           this.translateService
  //             .get('NEDSS.COMMON.SENT_FAILD')
  //             .subscribe((res: string) => {
  //               this.userMsg.error(res);
  //             });
  //         }
  //       );
  //     } else this.update();
  //   } else {
  //     this.userMsg.error("يجب ادخال كل الحقول");
  //   }

  // }
  resetForm() {
    if(this.organizationId == 1 || this.organizationId == 4 || this.organizationId == 5){
      this.getGovernments(true);
    }
    // this.selectedDisase = [];
    this.healthAdministrations = [];
    this.incidentSources = [];
    if(this.SelectedbranchId > 0){
      this.SelectedbranchId = -1;
    }
  }
  save() {
    if (this.validateRequiredData()) {
      if (this.zeroInstantNotification.id == null) {
        this.zeroInstantNotificationService
          .addZeroInstantNotification(this.zeroInstantNotification)
          .subscribe(
            (response: any) => {
              if (response) {
                this.translateService
                  .get('NEDSS.COMMON.SENT_SUCESSFULLY')
                  .subscribe((res: string) => {
                    this.userMsg.success(res);
                  });
                this.getZeroInstantNotifications();
                this.resetForm();
                this.zeroInstantNotification = {
                  id: null,
                  isZero: null,
                  diseasesIds: [],
                  governmentId: !this.activeUSerService.getAccessibleParts
                    ?.enableGovernments
                    ? this.zeroInstantNotification.governmentId
                    : null,
                  healthAdministrationId: !this.activeUSerService
                    .getAccessibleParts?.enableDepartments
                    ? this.zeroInstantNotification.healthAdministrationId
                    : -1,
                  branchId: !this.activeUSerService.getAccessibleParts
                    ?.enableBranches
                    ? this.zeroInstantNotification.branchId
                    : null,
                  areaId: !this.activeUSerService.getAccessibleParts?.showAreas
                    ? this.zeroInstantNotification.areaId
                    : null,
                  incidentSourceId: !this.activeUSerService.getAccessibleParts
                    ?.enableSources
                    ? this.zeroInstantNotification.incidentSourceId
                    : null,
                  casesPartioning: null,
                  maleCount: null,
                  femaleCount: null,
                  fromDate: null,
                  toDate: null,
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
    } else {
      this.userMsg.error('يجب ادخال كل الحقول');
    }
  }

  update() {
    this.zeroInstantNotificationService
      .updateZeroInstantNotification(this.zeroInstantNotification)
      .subscribe(
        (response: any) => {
          if (response) {
            this.translateService
              .get('NEDSS.COMMON.UPDATE_SUCESSFULLY')
              .subscribe((res: string) => {
                this.userMsg.success(res);
              });
            this.getZeroInstantNotifications();
            this.resetForm();
            this.zeroInstantNotification = {
              id: null,
              isZero: null,
              diseasesIds: [],
              governmentId: null,
              healthAdministrationId: null,
              branchId: null,
              areaId: null,
              incidentSourceId: null,
              casesPartioning: null,
              maleCount: null,
              femaleCount: null,
              fromDate: null,
              toDate: null,
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
      (this.zeroInstantNotificationFilter.sortOrder != SortOrder.desc ||
        this.zeroInstantNotificationFilter.sortColumn != event.field)
    ) {
      this.zeroInstantNotificationFilter.sortOrder = SortOrder.desc;
      this.zeroInstantNotificationFilter.sortColumn = event.field;
      this.getZeroInstantNotifications(false);
    } else if (
      event.order == 1 &&
      (this.zeroInstantNotificationFilter.sortOrder != SortOrder.asc ||
        this.zeroInstantNotificationFilter.sortColumn != event.field)
    ) {
      this.zeroInstantNotificationFilter.sortOrder = SortOrder.asc;
      this.zeroInstantNotificationFilter.sortColumn = event.field;
      this.getZeroInstantNotifications(false);
    }
  }
  paginate(event: any) {
    this.first = event.first;
    this.last = event.last;
    this.zeroInstantNotificationFilter.pageIndex = event.page;
    this.zeroInstantNotificationFilter.pageSize = event.rows;
    this.getZeroInstantNotifications();
  }

  delete(id: number) {
    this.zeroInstantNotificationService.deleteNotification(id).subscribe(
      (result: any) => {
        this.getZeroInstantNotifications();
        this.translateService
          .get('NEDSS.COMMON.DELETED_SUCESSFULLY')
          .subscribe((res: string) => {
            this.userMsg.success(res);
          });
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

  nameToDelete(ele) {
    this.underDeleting.id = ele.id;
    this.underDeleting.diseaseName = ele.diseaseName;
  }

  clearSearch() {
    this.zeroInstantNotificationFilter.searchText = '';
    this.search();
  }

  isDiseaseValid: boolean = true;
  isGovernmentValid: boolean = true;
  isHealthAdministrationValid: boolean = true;
  isIncidentSourceValid: boolean = true;
  isBranchValid: boolean = true;
  isAreaValid: boolean = true;
  isToDateValid: boolean = true;
  isFromDateValid: boolean = true;

  validateRequiredData(): boolean {
    // this.isDiseaseValid = this.generalDataService.validateArr(
    //   this.zeroInstantNotification.diseasesIds
    // );

    if(this.organizationId === 1 || 
      this.organizationId === 4 || 
      this.organizationId === 5
     ){
    if (this.selectedGovernment) {
      this.isGovernmentValid = this.generalDataService.validateField(
        this.zeroInstantNotification.governmentId
      );
    }
  }

  if(this.organizationId === 1){
    if (this.healthAdministrationId) {
      this.isHealthAdministrationValid = this.generalDataService.validateField(
        this.zeroInstantNotification.healthAdministrationId
      );
    }
  }

    if (this.selectedincidentSource) {
      this.isIncidentSourceValid = this.generalDataService.validateField(
        this.zeroInstantNotification.incidentSourceId
      );
    }

    if (this.SelectedbranchId) {
      this.isBranchValid = this.generalDataService.validateField(
        this.zeroInstantNotification.branchId
      );
    }
    
    if(this.organizationId === 2 
     ){
      if (this.SelectedareaId) {
        this.isAreaValid = this.generalDataService.validateField(
          this.zeroInstantNotification.areaId
        );
    }
  }

    this.isToDateValid = this.generalDataService.validateField(
      this.zeroInstantNotification.toDate
    );
    this.isFromDateValid = this.generalDataService.validateField(
      this.zeroInstantNotification.fromDate
    );

    if (
      !this.isDiseaseValid ||
      !this.isGovernmentValid ||
      !this.isHealthAdministrationValid ||
      !this.isIncidentSourceValid ||
      !this.isBranchValid ||
      !this.isAreaValid ||
      !this.isToDateValid ||
      !this.isFromDateValid
    )
      return false;
    return true;
  }

  exportPatiantsAsExcel() {
    this.exportService.exportTableAsExcel(this.tableElement, this.screenName);
  }

  // exportPatientsAsPdf() {
  //   this.exportService.exportTableAsPdf(this.tableElement, this.screenName);
  // }

  exportPatientsAsPdf() {
    let governmentNames = this.zeroInstantNotifications?.map(
      (item) => item.governmentName
    );
    let uniqueGovernmentNamesSet = new Set(governmentNames);
    let uniqueGovernmentNamesArray = Array.from(uniqueGovernmentNamesSet);
    // console.log(uniqueGovernmentNamesArray);

    let selectedAdmNames = this.zeroInstantNotifications?.map(
      (item) => item.healthAdministrationName
    );
    let uniqueselectedAdmNamesSet = new Set(selectedAdmNames);
    let uniqueselectedAdmNamesArray = Array.from(uniqueselectedAdmNamesSet);
    // console.log(uniqueselectedAdmNamesArray);

    let selectedIncsNames = this.zeroInstantNotifications?.map(
      (item) => item.incidentSourceName
    );
    let uniqueselectedIncsNamesSet = new Set(selectedIncsNames);
    let uniqueselectedIncsNamesArray = Array.from(uniqueselectedIncsNamesSet);
    // console.log(uniqueselectedIncsNamesArray);

    this.exportService.exportTemplateAsPdfSave(
      document.getElementById(this.currentConfig),
      'الابلاغ الصفري',
      [
        uniqueGovernmentNamesArray,
        uniqueselectedAdmNamesArray,
        uniqueselectedIncsNamesArray,
      ]
    );
  }

  // exportPatientsAsPdf() {
  //   this.exportService.exportTemplateAsPdfLogoTitle(document.getElementById(this.currentConfig),
  //    'الابلاغ الصفري'
  //  );
  // }

  //Diseases
  onDiseaseChanged() {
    this.DiseasesArr = [];
    this.selectedDisase.forEach((x) => {
      this.DiseasesArr.push(x.id);
    });
    this.zeroInstantNotification.diseasesIds = this.DiseasesArr;
    this.isDiseaseValid = this.generalDataService.validateField(
      this.zeroInstantNotification.diseasesIds
    );
  }
  onDiseaseDisChanged() {
    this.DiseasesArr = this.selectedDisase.map((x) => x.id);
    this.zeroInstantNotification.diseasesIds = this.DiseasesArr;
    this.isDiseaseValid = this.generalDataService.validateField(
      this.zeroInstantNotification.diseasesIds
    );
  }
  onAllDiseaseChanged($event) {
    this.selectedDisase = $event;
    this.DiseasesArr = [];
    this.selectedDisase.forEach((x) => {
      this.DiseasesArr.push(x.id);
    });
    this.zeroInstantNotification.diseasesIds = this.DiseasesArr;
    this.isDiseaseValid = this.generalDataService.validateField(
      this.zeroInstantNotification.diseasesIds
    );
  }
  onAllDiseaseDisChanged($event) {
    this.selectedDisase = $event;
    this.DiseasesArr = this.selectedDisase.map((x) => x.id);
    this.zeroInstantNotification.diseasesIds = this.DiseasesArr;
    this.isDiseaseValid = this.generalDataService.validateField(
      this.zeroInstantNotification.diseasesIds
    );
  }

  setdiseasesValue() {
    this.zeroInstantNotification.diseasesIds = this.selectedDisase;
    this.isDiseaseValid = this.generalDataService.validateField(
      this.zeroInstantNotification.diseasesIds
    );
  }
  setdiseasesDValue() {
    this.zeroInstantNotification.diseasesIds = null;
    this.isDiseaseValid = this.generalDataService.validateField(
      this.zeroInstantNotification.diseasesIds
    );
  }
  incidentSourcesSelected() {
    if (this.selectedincidentSource != -1) {
      this.zeroInstantNotification.incidentSourceId =
        this.selectedincidentSource;
    }
    // this.zeroInstantNotification.incidentSourceId = this.selectedincidentSource;
    // this.isIncidentSourceValid = this.generalDataService.validateField(
    //   this.zeroInstantNotification.incidentSourceId
    // );
  }
  incidentSourcesDSelected() {
    this.zeroInstantNotification.incidentSourceId = null;
    // this.isIncidentSourceValid = this.generalDataService.validateField(
    //   this.zeroInstantNotification.incidentSourceId
    // );
  }
  fromDateSelected(event) {
    this.zeroInstantNotification.fromDate = event.value;
    this.isFromDateValid = this.generalDataService.validateField(
      this.zeroInstantNotification.fromDate
    );
    if (event.value) {
      const from = new Date(event.value);
      if (!isNaN(from.getTime())) {
        const to = new Date(from);
        to.setDate(to.getDate() + 6);
        this.zeroInstantNotification.toDate = to;
        this.isToDateValid = this.generalDataService.validateField(
          this.zeroInstantNotification.toDate
        );
      }
    }
  }
  toDateSelected(event) {
    this.zeroInstantNotification.toDate = event.value;
    this.isToDateValid = this.generalDataService.validateField(
      this.zeroInstantNotification.toDate
    );
  }

  getPageIncidentSourceHospitalsForEductionalAndAmmana(){
    this.lookupsService.getPageIncidentSourceHospitals({
      GovernmentID:this.zeroInstantNotification.governmentId,
      organizationID:this.organizationId,
      forSystemUser:true
    }).subscribe({
      next:(result) => {
        if (result != null && result != undefined) {
          this.incidentSources = [
            { id: -1, arabicName: 'إختر', englishName: 'Select' },
          ];
          result.data.forEach((gov) => {
            this.incidentSources.push(gov);
          });

          if (this.zeroInstantNotification.incidentSourceId != null) {
            this.selectedincidentSource =
              this.zeroInstantNotification.incidentSourceId;
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
