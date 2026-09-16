import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig, SortEvent } from 'primeng/api';
import {
  Organizations,
  SingleDropdownSettings,
  SortOrder,
} from 'src/app/core/constants';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { UserService } from './Services/user.service';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { ExportService } from '../../../core/services/export.service';
import { ActiveUserService } from 'src/app/core/services/active-user.service';
import { LevelsEnum } from './models/levels.enum';
import { ActiveUserEnabledData } from 'src/app/core/models/active-user-enabled-data.model';
import { OrganizationsEnum } from './models/organizations.enum';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent {
  @ViewChild('myTableElementId', { static: false }) tableElement: ElementRef;
  screenName: string;

  users!: any[];
  userTypes!: any[];
  levels: any[] = [];
  positions!: any[];
  organizations!: any[];
  roles!: any[];
  governments!: any[];
  healthAdministrations!: any[];
  incidentSources!: any[];
  branches!: any[];
  areas!: any[];
  admin!: any[];

  userFilter = {
    pageSize: 10,
    pageIndex: 0,
    sortColumn: '',
    sortOrder: '',
    searchText: '',
    fullName: null,
    userName: null,
    levelId: null,
    positionId: null,
    organizationId: null,
    roleId: null,
    govenmentId: null,
    healthAdministrationId: null,
    branchId: null,
    areaId: null,
    incidentSourceId: null,
    active: null,
    isSuperAdmin: null,
  };
  noData: boolean = true;
  loadingPanel: boolean = false;
  organizationsLoading: boolean = false;
  levelsLoading: boolean = false;
  governmentsLoading: boolean = false;
  healthAdministrationsLoading: boolean = false;
  branchesLoading: boolean = false;
  areasLoading: boolean = false;
  incidentSourcesLoading: boolean = false;
  rolesLoading: boolean = false;
  positionsLoading: boolean = false;
  first: number = 0;
  last: number = 0;
  pages: number = 0;
  SelectedgovenmentId: number = -1;
  SelectedincidentSourceId: number = -1;
  Selectedposition: number = -1;
  Selectedrole: number = -1;
  SelectedBranchId: number = -1;
  SelectedAreaId: number = -1;
  Selectedorganization: any;
  selectedOrganizationName: string;
  SelectedActive = null;
  currentLang: string;
  dir: string;
  delay: boolean = false;
  timer: any;
  levelId: any;
  adminBool: any;
  singleDropdownSettings = SingleDropdownSettings;
  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;
  messageService: any;
  underDeleting = {
    fullName: '',
    id: null,
  };
  active = [
    { id: null, arabicName: 'الكل', englishName: 'All' },
    { id: true, arabicName: 'نشط', englishName: 'Active' },
    { id: false, arabicName: 'غير نشط', englishName: 'InActive' },
  ];

  disableGovernment: boolean = true;
  disableAdmin: boolean = true;
  disableIncidentSrc: boolean = true;

  showDropdowns: ActiveUserEnabledData = new ActiveUserEnabledData();

  constructor(
    private lookupsGetterService: LookupsGetterService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private userService: UserService,
    private primengConfig: PrimeNGConfig,
    private exportService: ExportService,
    private activeUserService: ActiveUserService,
    private router: Router
  ) {}

  BasicShow: boolean = false;
  addChoiceShow: boolean = false;
  SelectedhealthAdministrationId: number = -1;

  openAddChoice() {
    this.addChoiceShow = true;
  }

  addUserMyself() {
    this.addChoiceShow = false;
    this.router.navigate(['/home/add-user']);
  }

  inviteUser() {
    this.addChoiceShow = false;
    this.router.navigate(['/home/add-user'], { queryParams: { mode: 'invite' } });
  }

  showDialog() {
    this.BasicShow = true;
  }

  public get levelsEnum(): typeof LevelsEnum {
    return LevelsEnum;
  }

  public get organizationsEnum(): typeof OrganizationsEnum {
    return OrganizationsEnum;
  }

  ngOnInit() {
    let incidentInfoLink = document.getElementById(
      'incidentInfo'
    ) as HTMLElement;
    incidentInfoLink.classList.remove('active');
    this.primengConfig.ripple = true;
    this.currentLang =
      localStorage.getItem('ls.currentLang') !== undefined &&
      localStorage.getItem('ls.currentLang') !== 'undefined'
        ? localStorage.getItem('ls.currentLang')
        : 'ar';

    this.dir = this.currentLang == 'ar' ? 'rtl' : 'ltr';

    this.userFilter.organizationId = JSON.parse(
      localStorage.getItem('ls.authorizationData')
    )?.user?.organizationId;
    this.Selectedorganization = this.userFilter.organizationId;
    this.selectedOrganizationName = JSON.parse(
      localStorage.getItem('ls.authorizationData')
    )?.user?.organizationName;

    this.levelId = JSON.parse(
      localStorage.getItem('ls.authorizationData')
    )?.user?.levelId;

    this.adminBool = JSON.parse(
      localStorage.getItem('ls.authorizationData')
    )?.user?.isSuperAdmin;

    this.getUsers();
    // this.getLevels();
    this.getPositions();
    // this.getRoles();
    this.getGovernments();
    this.getBranchesForUsers();
    this.getOrganizations();
    this.getResponspility();
    this.translateService
      .get('NEDSS.HOME.USERS.SHOW_USERS')
      .subscribe((res) => {
        this.screenName = res;
      });
  }

  getOrganizations() {
    this.organizationsLoading = true;
    this.lookupsGetterService.getAllOrganizations().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.organizations = [
            { id: -1, arabicName: 'إختر', englishName: 'Select' },
          ];
          result.data.forEach((nat) => {
            this.organizations.push(nat);
          });
        }
        this.organizationsLoading = false;
        this.loadingPanel = false;
      },
      (error) => {
        this.organizationsLoading = false;
        this.loadingPanel = false;
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }

  getLevels() {
    this.levelsLoading = true;
    this.lookupsGetterService
      .getAllLevels(this.userFilter.organizationId)
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.levels = result.data;
            this.levels.unshift({
              id: -1,
              arabicName: 'إختر',
              englishName: 'Select',
            });
          }
          this.levelsLoading = false;
          this.loadingPanel = false;
        },
        (error) => {
          this.levelsLoading = false;
          this.loadingPanel = false;
          this.translateService
            .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
            .subscribe((res: string) => {
              this.userMsg.error(res);
            });
        }
      );
  }

  onUserLevelChange(isResetIncidentSource = false) {
    this.showDropdowns = new ActiveUserEnabledData();
    this.getRoles();
    switch (
      this.levels.find((item) => item.id == this.userFilter.levelId)?.code
    ) {
      case this.levelsEnum.Governorate:
        this.showDropdowns.showGovernments = true;
        break;
      case this.levelsEnum.Administration:
        this.showDropdowns.showGovernments = true;
        this.showDropdowns.showDepartments = true;
        break;
      case this.levelsEnum.Branch:
        this.showDropdowns.showBranches = true;
        break;
      case this.levelsEnum.Area:
        this.showDropdowns.showBranches = true;
        this.showDropdowns.showAreas = true;
        break;
      case this.levelsEnum.University:
        this.showDropdowns.showUniversities = true;
        break;
      case this.levelsEnum.Incident_Source:
        this.showDropdowns.showSources = true;
        switch (this.userFilter.organizationId + '') {
          case this.organizationsEnum.Ministry_of_Health:
            this.showDropdowns.showGovernments = true;
            this.showDropdowns.showDepartments = true;
            break;
          case this.organizationsEnum.Health_Insurance:
            this.showDropdowns.showBranches = true;
            this.showDropdowns.showAreas = true;
            break;
          case this.organizationsEnum.University_Hospitals:
            this.showDropdowns.showUniversities = true;
            break;
          case this.organizationsEnum
            .General_Organization_For_Teaching_Hospitals_and_Institutes:
            this.showDropdowns.showGovernments = true;
            break;
          case this.organizationsEnum.Aman_Hospitals:
            this.showDropdowns.showGovernments = true;
            break;
          case this.organizationsEnum.Health_Care_Authority:
            this.showDropdowns.showBranches = true;
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }
  }

  search() {
    this.first = 0;
    this.userFilter.pageIndex = 0;
    this.last = this.userFilter.pageIndex * this.userFilter.pageSize;
    this.getUsers();
  }

  getRoles() {
    this.rolesLoading = true;
    this.userService.getPageRoles({
      organizationId:this.userFilter.organizationId,
      levelId:this.userFilter.levelId
    }).subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.roles = [{ id: -1, arabicName: 'إختر', englishName: 'Select' }];
          result.data.forEach((nat) => {
            this.roles.push(nat);
          });
        }
        this.rolesLoading = false;
        this.loadingPanel = false;
      },
      (error) => {
        this.rolesLoading = false;
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
    this.positionsLoading = true;
    this.lookupsGetterService.getAllPositions().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.positions = [
            { id: -1, arabicName: 'إختر', englishName: 'Select' },
          ];
          result.data.forEach((nat) => {
            this.positions.push(nat);
          });
        }
        this.positionsLoading = false;
        this.loadingPanel = false;
      },
      (error) => {
        this.positionsLoading = false;
        this.loadingPanel = false;
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }

  getResponspility() {
    if (this.adminBool && this.adminBool == true) {
      this.admin = [
        { id: null, arabicName: 'الكل', englishName: 'All' },
        { id: true, arabicName: 'مسؤولية كاملة', englishName: 'Super Admin' },
        { id: false, arabicName: 'مسؤولية جزئية', englishName: 'Admin' },
      ];
    } else {
      this.admin = [
        { id: false, arabicName: 'مسؤولية جزئية', englishName: 'Admin' },
      ];
    }
  }

  getGovernments() {
    this.governmentsLoading = true;
    this.lookupsGetterService.getAllGovernments().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.governments = [
            { id: -1, arabicName: 'إختر', englishName: 'Select' },
          ];
          result.data.forEach((he) => {
            this.governments.push(he);
          });

          if (result.data.length > 0) {
            //this.SelectedgovenmentId = JSON.parse(localStorage.getItem('ls.authorizationData')).user.govenmentId;
            if (this.SelectedgovenmentId != null) {
              this.governmentSelected();
            } else {
              this.SelectedgovenmentId = -1;
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
    this.userFilter.govenmentId =
      this.SelectedgovenmentId != -1 ? this.SelectedgovenmentId : null;
    this.healthAdministrations = [];
    this.userFilter.healthAdministrationId = null;
    this.SelectedhealthAdministrationId = null;

    if (
      this.userFilter.govenmentId != null &&
      this.userFilter.govenmentId != -1
    )
      this.getHealthAdministrations(this.userFilter.govenmentId);
  }

  governmentDeSelected() {
    this.userFilter.govenmentId = null;
    this.healthAdministrations = [];
    this.userFilter.healthAdministrationId = null;
    this.SelectedhealthAdministrationId = null;
    this.healthAdministrationDeSelected();
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
            if (result.data.length > 0) {
              this.SelectedhealthAdministrationId = JSON.parse(
                localStorage.getItem('ls.authorizationData')
              ).user.healthAdministrationId;
              if (
                this.SelectedhealthAdministrationId != null &&
                this.SelectedhealthAdministrationId != -1
              ) {
                this.healthAdministrationSelected();
              } else {
                this.SelectedhealthAdministrationId = -1;
              }
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
    this.userFilter.healthAdministrationId =
      this.SelectedhealthAdministrationId != -1
        ? this.SelectedhealthAdministrationId
        : null;
    this.incidentSources = [];
    this.userFilter.incidentSourceId = null;

    if (
      this.userFilter.healthAdministrationId != null &&
      this.userFilter.healthAdministrationId != -1
    )
      this.getIncidentSources(this.userFilter.healthAdministrationId);
  }

  incidentSourceselected() {
    this.userFilter.incidentSourceId =
      this.SelectedincidentSourceId != -1
        ? this.SelectedincidentSourceId
        : null;
  }

  incidentSourceDeselected() {
    this.userFilter.incidentSourceId = null;
  }

  healthAdministrationDeSelected() {
    this.userFilter.healthAdministrationId = null;
    this.incidentSources = [];
    this.userFilter.incidentSourceId = null;
    this.SelectedincidentSourceId = null;
  }

  positionsSelected() {
    this.userFilter.positionId =
      this.Selectedposition != -1 ? this.Selectedposition : null;
  }

  activeSelected() {
    this.userFilter.active =
      this.SelectedActive != null ? this.SelectedActive : null;
  }

  positionsDeSelected() {
    this.userFilter.positionId = null;
  }

  roleSelected() {
    this.userFilter.roleId = this.Selectedrole != -1 ? this.Selectedrole : null;
  }

  roleDeSelected() {
    this.userFilter.roleId = null;
  }

  organizationSelected(event:any) {
    this.levels=[];
    this.roles = [];
    if(event.value == -1){
      this.userFilter.organizationId = null;
    } else{
      this.userFilter.organizationId = event.value;
      this.getBranchesForUsers();
      this.getLevels();
    }
    // this.userFilter.organizationId =
    //   this.Selectedorganization != -1 ? this.Selectedorganization : null;
    
  }

  // organizationDeSelected() {
  //   this.userFilter.organizationId = null;
  // }

  getIncidentSourcesByType(
    healthAdministrationId: any,
    incedentSourceType: any
  ) {
    if (
      (healthAdministrationId > 0 && incedentSourceType > 0) ||
      this.SelectedgovenmentId > 0 ||
      this.SelectedBranchId > 0
    ) {
      this.incidentSourcesLoading = true;
      this.lookupsGetterService
        .getPageIncidentSourceHospitals({
          healthAdministrationId: healthAdministrationId,
          organizationID: incedentSourceType,
          areaId: this.SelectedAreaId ? this.SelectedAreaId : null,
        })
        .subscribe(
          (result: any) => {
            if (result != null && result != undefined) {
              this.incidentSources = result.data;
              this.incidentSources.unshift({
                id: -1,
                arabicName: 'إختر',
                englishName: 'Select',
              });
              if (this.userFilter.incidentSourceId > 0) {
                this.SelectedincidentSourceId = this.incidentSources.find(
                  (x) => x.id == this.userFilter.incidentSourceId
                )?.id;
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
  }

  getIncidentSources(healthAdministrationId: any) {
    if (healthAdministrationId != -1) {
      this.incidentSourcesLoading = true;
      this.lookupsGetterService
        .getPageIncidentSourceHospitals({
          healthAdministrationId: healthAdministrationId,
        })
        .subscribe(
          (result: any) => {
            if (result != null && result != undefined) {
              this.incidentSources = [
                { id: -1, arabicName: 'إختر', englishName: 'Select' },
              ];
              result.data.forEach((he) => {
                this.incidentSources.push(he);
              });

              if (result.data.length > 0) {
                this.SelectedincidentSourceId = JSON.parse(
                  localStorage.getItem('ls.authorizationData')
                ).user.incidentSourceId;
                if (this.SelectedincidentSourceId != null) {
                  this.incidentSourceselected();
                } else {
                  this.SelectedincidentSourceId = -1;
                }
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
  }

  getBranchesForUsers() {
    this.branchesLoading = true;
    this.lookupsGetterService
      .getAllBranchesForUsers(this.userFilter.organizationId, true)
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.branches = result.data;
            this.branches?.unshift({
              id: null,
              arabicName: 'إختر',
              englishName: 'Select',
            });
            if (
              this.userFilter.branchId > 0 &&
              this.showDropdowns.showBranches
            ) {
              this.SelectedBranchId = this.branches.find(
                (item) => item.id === this.userFilter.branchId
              )?.id;
              this.branchSelected();
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
    // this.governmentDeSelected();
    if (this.SelectedBranchId) {
      this.userFilter.branchId = this.SelectedBranchId;
      // this.healthAdministrations = [];
      // this.getHealthAdministrationsForUsers(this.userFilter.branchId);
      this.getAreas();
      this.getIncidentSourcesByType(
        this.userFilter.healthAdministrationId,
        this.userFilter.organizationId
      );
    }
  }

  getAreas() {
    this.areasLoading = true;
    this.lookupsGetterService.getAllAreas(this.SelectedBranchId).subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.areas = result.data;
          this.areas.unshift({
            id: null,
            arabicName: 'إختر',
            englishName: 'Select',
          });
          if (this.userFilter.areaId > 0 && this.showDropdowns.showAreas) {
            this.SelectedAreaId = this.areas.find(
              (item) => item.id === this.userFilter.areaId
            )?.id;
            this.areaSelected();
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
    // this.governmentDeSelected();
    if (this.SelectedAreaId) {
      this.userFilter.areaId = this.SelectedAreaId;
      // this.isAreaValid = this.checkAreaValid();
      this.getIncidentSourcesByType(
        this.userFilter.healthAdministrationId,
        this.userFilter.organizationId
      );
    }
  }

  getUsers() {
    this.loadingPanel = true;
    this.userService.getPageUsers(this.userFilter).subscribe(
      (result: any) => {
        console.log('filter', this.userFilter, 'res', result);
        if (result != null && result != undefined) {
          this.users = result.data;
          if (this.users != undefined && this.users.length == 0) {
            this.noData = true;
            this.pages = 0;
          } else {
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

  sort(event: SortEvent) {
    const order = event.order == -1 ? SortOrder.desc : SortOrder.asc;
    const field =
      typeof event.field === 'string'
        ? event.field
        : this.userFilter.sortColumn;
    if (
      this.userFilter.sortColumn == field &&
      this.userFilter.sortOrder == order
    ) {
      return;
    }
    this.userFilter.sortColumn = field;
    this.userFilter.sortOrder = order;
    this.userFilter.pageIndex = 0;
    this.first = 0;
    this.getUsers();
  }

  paginate(event: any) {
    this.first = event.first;
    this.last = event.last;
    this.userFilter.pageIndex = event.page;
    this.userFilter.pageSize = event.rows;
    this.getUsers();
  }

  delete(id: number) {
    this.userService.deleteUser(id).subscribe(
      (result: any) => {
        if (result.statusCode == 200) {
          this.getUsers();
          this.translateService
            .get('NEDSS.COMMON.DELETED_SUCESSFULLY')
            .subscribe((res: string) => {
              this.userMsg.success(res);
            });
        } else {
          this.userMsg.error(result.messages[0]);
        }
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
    this.userFilter.searchText = '';
    this.search();
  }

  exportPatiantsAsExcel() {
    this.exportService.exportTableAsExcel(this.tableElement, this.screenName);
  }

  exportPatientsAsPdf() {
    this.exportService.exportTableAsPdf(this.tableElement, this.screenName);
  }

  nameToDelete(ele) {
    this.underDeleting.id = ele.id;
    this.underDeleting.fullName = ele.fullName;
  }
}
