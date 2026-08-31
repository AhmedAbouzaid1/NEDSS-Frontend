import { Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { ExportAsConfig, ExportAsService } from 'ngx-export-as';
import { SharedDataService } from '../../../general-data/services/shared-data.service';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { ZeroInstantNotificationService } from '../../../zero-notificaton/Services/zero-instant-notification.service';
import { TranslateService } from '@ngx-translate/core';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { DatePipe } from '@angular/common';
import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { MultipleDropdownSettings, SingleDropdownSettings, SortOrder } from 'src/app/core/constants';
import { environment } from 'src/environments/environment';
import { SortEvent } from 'primeng/api';
import { FormControl, FormGroup } from '@angular/forms';
import { ExportService } from '../../../../../core/services/export.service';

@Component({
  selector: 'app-connected-users',
  templateUrl: './connected-users.component.html',
  styleUrls: ['./connected-users.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ConnectedUsersComponent {
  @ViewChild('myTableElementId', { static: false }) tableElement: ElementRef;
  currentLang: string;
  dir: string;
  delay: boolean = false;
  timer: any;

  selectedGovernmentId: number = -1;

  selectedHealthAdministrationId: number;

  selectedIncidentSourceId: number;


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

  zeroInstantNotification = {
    id: null,
    isZero: null,
    diseaseId: null,
    govenmentId: null,
    healthAdministrationId: null,
    incidentSourceId: null,
    casesPartioning: null,
    maleCount: null,
    femaleCount: null,

    fromDate: null,
    toDate: null
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
  governmentsLoading: boolean = false;
  healthAdministrationsLoading: boolean = false;
  incidentSourcesLoading: boolean = false;
  selectedincidentSource: any
  selectedDisase: any
  zeroInstantNotificationFilter = {
    pageSize: 10,
    pageIndex: 0,
    sortColumn: '',
    sortOrder: '',
    searchText: '',
    isZero: true,
    firstTime: false
  };
  zeroInstantNotifications!: any[];
  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;

  noData: boolean = true;
  first: number = 0;
  last: number = 0;
  pages: number = 0;
  healthAdministrationId: any


  selectedGovernment: any;
  selectedHealthAdministration: any;
  selectedIncedentSource: any;
  screenName: string = '';
  constructor(
    private sharedDataService: SharedDataService,
    private lookupsService: LookupsGetterService,
    private zeroInstantNotificationService: ZeroInstantNotificationService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private datePipe: DatePipe,
    private exportService: ExportService
  ) { }

  ngOnInit() {
    this.currentLang =
      localStorage.getItem('ls.currentLang') !== undefined &&
        localStorage.getItem('ls.currentLang') !== 'undefined'
        ? localStorage.getItem('ls.currentLang')
        : 'ar';

    this.dir = this.currentLang == 'ar' ? 'rtl' : 'ltr';

    let link = document.getElementById('home') as HTMLElement;
    link.classList.add('active');
    this.getUsers();
    this.levelId = JSON.parse(localStorage.getItem('ls.authorizationData'))?.user?.levelId;

    this.translateService.get('NEDSS.HOME.GENERAL_DATA_COMPLETION.UsersReport').subscribe((res: string) => {
      this.screenName = res;
    });
    this.selectedGovernment = [];
    this.singleDropdownSettings = SingleDropdownSettings;;
    this.multiDropdownSettings = MultipleDropdownSettings;;
    this.getDiseases();
    this.getGovernments(true);
  }

  ngOnDestroy() {
    let link = document.getElementById('home') as HTMLElement;
    link.classList.remove('active');
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

  getGovernments(setDefault?: boolean) {
    this.governmentsLoading = true;
    this.lookupsService
      .getAllGovernments()
      .pipe(finalize(() => (this.governmentsLoading = false)))
      .subscribe(
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
      this.zeroInstantNotification.govenmentId = this.selectedGovernmentId;
      this.getHealthAdministrations(this.zeroInstantNotification.govenmentId);

      this.selectedHealthAdministrationId = -1;
      this.incidentSources = [];
      this.selectedIncidentSourceId = null;

      this.zeroInstantNotification.healthAdministrationId = null;
      this.zeroInstantNotification.incidentSourceId = null;
    } else {
      this.zeroInstantNotification.govenmentId = null;
      this.healthAdministrations = [];
      this.selectedHealthAdministration = null;
      this.selectedHealthAdministrationId = -1;
      this.selectedIncidentSourceId = -1;
      this.incidentSources = [];
      this.selectedIncidentSourceId = null;
      this.zeroInstantNotification.healthAdministrationId = null;
      this.zeroInstantNotification.incidentSourceId = null;
    }

    this.getUsers();
  }
  governmentDSelected() {
    this.zeroInstantNotification.govenmentId = null
    this.healthAdministrationId = null
    this.healthAdministrations = null
    this.zeroInstantNotification.healthAdministrationId = null;
    this.selectedincidentSource = null
    this.incidentSources = null
    // this.getHealthAdministrations(
    //   this.zeroInstantNotification.govenmentId
    // );
  }
  getHealthAdministrations(governmentID: any, setDefault?: boolean) {
    this.healthAdministrationsLoading = true;
    this.lookupsService
      .getPageHealthAdministrations({
        governmentID: governmentID,
      })
      .pipe(finalize(() => (this.healthAdministrationsLoading = false)))
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
      this.zeroInstantNotification.healthAdministrationId = this.selectedHealthAdministrationId;
      this.selectedIncidentSourceId = -1;
      this.zeroInstantNotification.incidentSourceId = null;
    }
    else {
      this.zeroInstantNotification.healthAdministrationId = null;
      this.incidentSources = [];
      this.selectedIncidentSourceId = null;
    }
    this.getIncidentSources(
      this.zeroInstantNotification.healthAdministrationId
    );
    this.getUsers();
  }
  onIncidentSourceChanged() {
    if (this.selectedIncidentSourceId != -1) {
      this.zeroInstantNotification.incidentSourceId = this.selectedIncidentSourceId;
    }
    else {
      this.zeroInstantNotification.incidentSourceId = null;
    }
  }
  healthAdministrationDSelected() {
    this.zeroInstantNotification.healthAdministrationId = null;
    this.selectedincidentSource = null
    this.incidentSources = null
    this.selectedincidentSource = null;
  }

  getIncidentSources(healthAdministrationID: any, setDefault?: boolean) {
    this.incidentSourcesLoading = true;
    this.lookupsService
      .getPageIncidentSourceHospitals({
        healthAdministrationID: healthAdministrationID,
      })
      .pipe(finalize(() => (this.incidentSourcesLoading = false)))
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
      this.zeroInstantNotificationFilter.pageIndex * this.zeroInstantNotificationFilter.pageSize;
    this.getZeroInstantNotifications();
  }

  getZeroInstantNotifications(firstTime?: boolean) {
    this.loadingPanel = true;
    this.zeroInstantNotificationFilter.firstTime = firstTime;
    this.delay= true;
    this.timer= setTimeout(() => {
      if (this.delay)
      {
        this.translateService.get('NOUR.WaitPlease').subscribe(msg => this.userMsg.info(msg));
      }
      
    }, 500);

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
              this.last =
                this.zeroInstantNotificationFilter.pageIndex *
                this.zeroInstantNotificationFilter.pageSize;
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
        this.zeroInstantNotification = result.data;
        var datePipe = new DatePipe("en-EG");
        this.zeroInstantNotification.fromDate = datePipe.transform(this.zeroInstantNotification.fromDate, 'yyyy-MM-dd');
        this.zeroInstantNotification.toDate = datePipe.transform(this.zeroInstantNotification.toDate, 'yyyy-MM-dd');
        //  this.zeroInstantNotification.diseaseId=result.diseaseId;
        //  this.zeroInstantNotification.govenmentId=result.govenmentId
        //  this.zeroInstantNotification.healthAdministrationId=result.healthAdministrationId
        //  this.zeroInstantNotification.incidentSourceId=result.incidentSourceId

        //  this.getGovernments();
        // this.getHealthAdministrations(
        //   this.zeroInstantNotification.govenmentId
        // );
        // this.getIncidentSources(
        //   this.zeroInstantNotification.healthAdministrationId
        // );
        if (this.zeroInstantNotification.diseaseId > 0) {
          this.selectedDisase = this.diseases.filter(
            item => item.id === this.zeroInstantNotification.diseaseId);
          // this.getHealthAdministrations(this.zeroInstantNotification.diseaseId);
        }
        if (this.zeroInstantNotification.govenmentId > 0) {
          this.selectedGovernment = this.governments.filter(
            item => item.id === this.zeroInstantNotification.govenmentId);
          this.getHealthAdministrations(this.zeroInstantNotification.govenmentId);
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

  save() {
    if (this.validateRequiredData()) {
      if (this.zeroInstantNotification.id == null) {

        this.zeroInstantNotificationService.addZeroInstantNotification(this.zeroInstantNotification).subscribe(
          (response: any) => {
            if (response) {
              this.translateService
                .get('NEDSS.COMMON.SENT_SUCESSFULLY')
                .subscribe((res: string) => {
                  this.userMsg.success(res);
                });
              this.getZeroInstantNotifications();
              this.zeroInstantNotification = {
                id: null,
                isZero: null,
                diseaseId: null,
                govenmentId: null,
                healthAdministrationId: null,
                incidentSourceId: null,
                casesPartioning: null,
                maleCount: null,
                femaleCount: null,
                fromDate: null,
                toDate: null
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
      this.userMsg.error("يجب ادخال كل الحقول");
    }
  }

  update() {
    this.zeroInstantNotificationService.updateZeroInstantNotification(this.zeroInstantNotification).subscribe(
      (response: any) => {
        if (response) {
          this.translateService
            .get('NEDSS.COMMON.UPDATE_SUCESSFULLY')
            .subscribe((res: string) => {
              this.userMsg.success(res);
            });
          this.getZeroInstantNotifications();
          this.zeroInstantNotification = {
            id: null,
            isZero: null,
            diseaseId: null,
            govenmentId: null,
            healthAdministrationId: null,
            incidentSourceId: null,
            casesPartioning: null,
            maleCount: null,
            femaleCount: null,
            fromDate: null,
            toDate: null
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
      this.zeroInstantNotificationFilter.sortOrder != SortOrder.desc
    ) {
      this.zeroInstantNotificationFilter.sortOrder = SortOrder.desc;
      if (typeof event.field === 'string')
        this.zeroInstantNotificationFilter.sortColumn = event.field;
      this.getZeroInstantNotifications();
    } else if (
      event.order == 1 &&
      this.zeroInstantNotificationFilter.sortOrder != SortOrder.asc
    ) {
      this.zeroInstantNotificationFilter.sortOrder = SortOrder.asc;
      if (typeof event.field === 'string')
        this.zeroInstantNotificationFilter.sortColumn = event.field;
      this.getZeroInstantNotifications();
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
  validateRequiredData(): boolean {
    if (this.zeroInstantNotification.diseaseId == null || this.zeroInstantNotification.govenmentId == null
      || this.zeroInstantNotification.healthAdministrationId == null || this.zeroInstantNotification.incidentSourceId == null
      || this.zeroInstantNotification.toDate == null || this.zeroInstantNotification.fromDate == null
    )
      return false;
    return true;
  }

  exportPatiantsAsExcel() {
    this.exportService.exportTableAsExcel(this.tableElement, this.screenName);
  }
  exportPatientsAsPdf() {
    this.exportService.exportTableAsPdf(this.tableElement, this.screenName);
  }

  setdiseasesValue(event) {
    this.zeroInstantNotification.diseaseId = event.id
    this.getUsers();

  }
  setdiseasesDValue() {
    this.zeroInstantNotification.diseaseId = null
  }
  incidentSourcesSelected(event) {
    this.zeroInstantNotification.incidentSourceId = event.id
    this.getUsers();

  }
  incidentSourcesDSelected() {
    this.zeroInstantNotification.incidentSourceId = null
  }
  fromDateSelected(event) {
    this.zeroInstantNotification.fromDate = event.value;
  }
  toDateSelected(event) {
    this.zeroInstantNotification.toDate = event.value;
  }





  /************************************************ */




  users: any[] = [];
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

  Selectedposition: any;
  Selectedrole: any;
  Selectedorganization: any;

  messageService: any;



  BasicShow: boolean = false;
  SelectedhealthAdministrationId: any;
  showDialog() {
    this.BasicShow = true;
  }

  getOrganizations() {
    this.lookupsService
      .getAllOrganizations()
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.organizations = result.data;
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



  getPositions() {
    this.lookupsService.getAllPositions().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.positions = result.data;
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



  positionsSelected() {
    this.userFilter.positionId = this.Selectedposition[0].id;
  }
  positionsDeSelected() {
    this.userFilter.positionId = null;
  }
  roleSelected() {
    this.userFilter.roleId = this.Selectedrole[0].id;
  }
  roleDeSelected() {
    this.userFilter.roleId = null;
  }

  organizationSelected() {
    this.userFilter.organizationId = this.Selectedorganization[0].id;
  }
  organizationDeSelected() {
    this.userFilter.organizationId = null;
  }
  searchUserFormGroup: FormGroup;



  getUsers() {
    this.loadingPanel = true;
    this.lookupsService
      .getConnectedUsers(this.zeroInstantNotification)
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.users = result.data;
            this.users.forEach(item => {
              let incident = this.incidentSources.find(s => s.id == item.incidentSourceId);
              if (incident != null) {
                item.incidentSourceName = this.currentLang == 'ar' ? incident.arabicName : incident.englishName;
              }
              let health = this.healthAdministrations.find(s => s.id == item.healthAdministrationId);
              if (health != null) {
                item.healthAdministrationName = this.currentLang == 'ar' ? health.arabicName : health.englishName;
              }

            });
            if (
              this.users != undefined &&
              this.users.length == 0
            ) {
              this.noData = true;
              this.pages = 0;
            } else {
              this.noData = false;
              this.pages = this.users.length;
              this.last =
                this.userFilter.pageIndex *
                this.userFilter.pageSize;
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






}



