import { Router, ActivatedRoute } from '@angular/router';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SingleDropdownSettings } from 'src/app/core/constants';
import { OrganizationsEnum } from '../../models/organizations.enum';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { UserService } from '../../Services/user.service';
import { UsersRolesPermissionsService } from '../../../dashboard/components/users-roles-permissions/Services/users-roles-permissions.service';
import { GeneralDataService } from '../../../general-data/services/general-data.service';
import { ExportService } from '../../../../../core/services/export.service';
import { ActiveUserService } from 'src/app/core/services/active-user.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'],
})
export class AddUserComponent {
  @ViewChild('myTableElementId', { static: false }) tableElement: ElementRef;

  IsPrivateLab = false;
  isNew: boolean = true;
  loaded: boolean = false;
  resettingPassword = false;
  overlayColor: string = 'rgba(255,255,255,0.5)';
  imageSrc: string = 'assets/upload-image.webp';
  adminBool: any;
  inviteMode: boolean = false;
  creatingInvite: boolean = false;
  showInviteDialog: boolean = false;
  inviteResult: { url: string; code: string; expiresAt: string } | null = null;
  linkCopied: boolean = false;
  codeCopied: boolean = false;
  user = {
    id: null,
    roleId: null,
    govenmentId: null,
    healthAdministrationId: null,
    incidentSourceId: null,
    positionId: null,
    departmentId: null,
    organizationId: null,
    branchId: null,
    fullName: null,
    phoneNo: null,
    email: null,
    address: null,
    password: '123',
    profilePic: '',
    levelId: null,
    externalLabId: null,
    userGroupId: null,
    userName: null,
    areaId: null,
    diseaseFormsIds: [],
    active: true,
    isSuperAdmin: false,
    notActiveReason: null,
  };
  users!: any[];
  roles!: any[];
  governments!: any[];
  positions!: any[];
  healthAdministrations!: any[];
  incidentSources!: any[];
  departments!: any[];
  organizations!: any[];
  branches!: any[];
  areas!: any[];
  loadingPanel: boolean = false;
  organizationsLoading: boolean = false;
  levelsLoading: boolean = false;
  governmentsLoading: boolean = false;
  branchesLoading: boolean = false;
  areasLoading: boolean = false;
  healthAdministrationsLoading: boolean = false;
  incidentSourcesLoading: boolean = false;
  rolesLoading: boolean = false;
  positionsLoading: boolean = false;
  departmentsLoading: boolean = false;
  imageLoaded: boolean = false;
  messageService: any;
  systemPages!: any[];
  diseases!: any[];
  selectedDiseases!: any[];
  evaluation!: any[];
  iconColor: string;
  Selectedorganization: any;
  SelectedgovenmentId: any;
  SelectedbranchId: any;
  SelectedareaId: any;
  SelectedhealthAdministrationId: any;
  SelectedincidentSource;
  Selectedrole: any;
  SelectedpositionId: any;
  SelecteddepartmentId: any;
  SelectedEvaluation: any;
  singleDropdownSettings = SingleDropdownSettings;
  disableGovernment: boolean;
  disableGovernments: boolean = true;
  disableDepartments: boolean = true;
  disableBranches: boolean = true;
  disableAreas: boolean = true;
  disableUniversities: boolean = true;
  disableSources: boolean = true;
  disableAdmin: boolean;
  disableIncidentSrc: boolean;

  isOrganizationValid: boolean = true;
  isGovernmentValid: boolean = true;
  isAreaValid: boolean = true;
  isHealthAdminValid: boolean = true;
  isIncidentSourceValid: boolean = true;
  isRoleValid: boolean = true;
  isEvaluationValid: boolean = true;

  usernameValidationMsg: string = '';
  emailValidationMsg: string = '';

  currentLang: string = 'ar';

  levels: any[];

  constructor(
    private userService: UserService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private lookupsGetterService: LookupsGetterService,
    private route: ActivatedRoute,
    private router: Router,
    private usersRolesPermissionService: UsersRolesPermissionsService,
    public generalDataService: GeneralDataService,
    private exportService: ExportService,
    public activeUSerService: ActiveUserService
  ) {}
  id: any;
  ngOnInit() {
    this.currentLang =
      localStorage.getItem('ls.currentLang') !== undefined &&
      localStorage.getItem('ls.currentLang') !== 'undefined'
        ? localStorage.getItem('ls.currentLang')
        : 'ar';

    this.disableGovernment = true;
    this.disableAdmin = true;
    this.disableIncidentSrc = true;
    this.adminBool = JSON.parse(
      localStorage.getItem('ls.authorizationData')
    )?.user?.isSuperAdmin;
    this.user.isSuperAdmin = false;

    this.inviteMode = this.route.snapshot.queryParamMap.get('mode') === 'invite';
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id != null) {
      this.getById(this.id);
    } else {
      this.getGovernmentsForUser();
      // this.getRoles();
      this.getPositions();
      this.getOrganizations();
      this.getDepartments();
      this.getDiseases();
    }
  }

  getPlaceholder() {
    return localStorage.getItem('ls.currentLang') == 'ar' ? 'اختر' : 'Select';
  }
  getDiseases() {
    this.userService.getAllDiseaseField().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.evaluation = result.data;
          if (this.user.diseaseFormsIds.length > 0) {
            this.SelectedEvaluation = this.evaluation.filter((x) =>
              this.user.diseaseFormsIds.includes(x.id)
            );
            this.evaluationSelected();
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

  evaluationSelected() {
    if (this.SelectedEvaluation != null) {
      this.user.diseaseFormsIds = this.SelectedEvaluation;
    }
    this.isEvaluationValid = this.checkEvaluationValid();
  }
  getRoles() {
    this.rolesLoading = true;
    this.userService.getPageRoles({
      organizationId:this.user.organizationId,
      levelId:this.user.levelId
    }).subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.roles = result.data;
          this.roles.unshift({
            id: null,
            arabicName: 'إختر',
            englishName: 'Select',
          });
          if (this.user.roleId) {
            this.Selectedrole = this.roles.find(
              (x) => x.id === this.user.roleId
            )?.id;
            this.rolesSelected();
          }
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
  rolesSelected() {
    if (this.Selectedrole != null) {
      this.user.roleId = this.Selectedrole;
      this.getSystemPages(this.user.roleId);
      this.getAlRolelDiseases(this.user.roleId);
      this.GetAllUserRoleSelectedDiseases(this.user.roleId);
    }
    this.isRoleValid = this.checkRoleValid();
  }
  rolesDeSelected() {
    this.user.roleId = null;
    this.isRoleValid = this.checkRoleValid();
    this.systemPages = null;
    this.diseases = null;
    this.selectedDiseases = null;
  }
  getSystemPages(roleId) {
    this.usersRolesPermissionService.GetAllUserSystemPages(roleId).subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.systemPages = result.data;
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
  getAlRolelDiseases(roleId) {
    this.usersRolesPermissionService.GetAllUserRoleDiseases(roleId).subscribe(
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
  handleInputChange(e) {
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];

    var pattern = /image-*/;
    var reader = new FileReader();

    if (!file.type.match(pattern)) {
      return;
    }

    this.loaded = false;

    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }

  _handleReaderLoaded(e) {
    var reader = e.target;
    this.imageSrc = reader.result;
    this.user.profilePic = this.imageSrc;
    this.loaded = true;
  }
  handleImageError() {
    this.imageSrc = 'assets/upload-image.webp';
  }

  handleImageLoad() {
    this.imageLoaded = true;
    this.iconColor = this.overlayColor;
  }
  GetAllUserRoleSelectedDiseases(roleId) {
    this.usersRolesPermissionService
      .GetAllUserRoleSelectedDiseases(roleId)
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.selectedDiseases = result.data;
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
    this.positionsLoading = true;
    this.lookupsGetterService.getAllPositions().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.positions = result.data;
          this.positions.unshift({
            id: null,
            arabicName: 'إختر',
            englishName: 'Select',
          });
          if (this.user.positionId > 0) {
            this.SelectedpositionId = this.positions.find(
              (x) => x.id === this.user.positionId
            )?.id;
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
  getGovernments() {
    this.lookupsGetterService.getAllGovernments().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.governments = result.data;
          this.governments.unshift({
            id: null,
            arabicName: 'إختر',
            englishName: 'Select',
          });
          if (this.user.govenmentId > 0) {
            this.SelectedgovenmentId = this.governments.find(
              (item) => item.id === this.user.govenmentId
            )?.id;
            this.governmentSelected();
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
  getGovernmentsForUser() {
    this.lookupsGetterService.getAllGovernmentsForUser(true).subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.governments = result.data;
          this.governments.unshift({
            id: null,
            arabicName: 'إختر',
            englishName: 'Select',
          });
          if (this.user.govenmentId > 0) {
            this.SelectedgovenmentId = this.governments.find(
              (item) => item.id === this.user.govenmentId
            )?.id;
            this.governmentSelected();
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
    // this.governmentDeSelected();
    if (this.SelectedgovenmentId) {
      this.user.govenmentId = this.SelectedgovenmentId;
      this.isGovernmentValid = this.checkGovernmentValid();
      this.healthAdministrations = [];
      // this.getHealthAdministrations(this.user.govenmentId);
      this.getHealthAdministrationsForUsers(this.user.govenmentId);
      //this.getAreas();
      if (
        this.Selectedorganization ==
          OrganizationsEnum.General_Organization_For_Teaching_Hospitals_and_Institutes ||
        this.Selectedorganization == OrganizationsEnum.Aman_Hospitals
      ) {
        this.getIncidentSources(
          this.user.healthAdministrationId,
          this.user.organizationId
        );
      }
    }
  }

  governmentDeSelected() {
    this.user.govenmentId = null;
    this.isGovernmentValid = this.checkGovernmentValid();
    this.healthAdministrations = [];
    this.SelectedhealthAdministrationId = null;
    this.healthAdministrationDeSelected();
  }

  getHealthAdministrations(governmentID: any) {
    this.lookupsGetterService
      .getPageHealthAdministrations({
        governmentID: governmentID,
      })
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.healthAdministrations = result.data;
            this.healthAdministrations.unshift({
              id: null,
              arabicName: 'إختر',
              englishName: 'Select',
            });
            if (this.user.healthAdministrationId > 0) {
              if (this.user.healthAdministrationId > 0) {
                this.SelectedhealthAdministrationId =
                  this.healthAdministrations.find(
                    (x) => x.id === this.user.healthAdministrationId
                  )?.id;
              }
            }
            this.healthAdministrationSelected();
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

  getHealthAdministrationsForUsers(governmentID: any) {
    this.lookupsGetterService
      .getPageHealthAdministrationsForUsers({
        governmentID: governmentID,
        forSystemUser: true,
      })
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.healthAdministrations = result.data;
            this.healthAdministrations.unshift({
              id: null,
              arabicName: 'إختر',
              englishName: 'Select',
            });
            if (this.user.healthAdministrationId > 0) {
              if (this.user.healthAdministrationId > 0) {
                this.SelectedhealthAdministrationId =
                  this.healthAdministrations.find(
                    (x) => x.id === this.user.healthAdministrationId
                  )?.id;
              }
            }
            this.healthAdministrationSelected();
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
    // this.healthAdministrationDeSelected()
    if (
      this.SelectedhealthAdministrationId !== undefined &&
      this.SelectedhealthAdministrationId !== null
    ) {
      this.incidentSources = [];
      this.user.healthAdministrationId = this.SelectedhealthAdministrationId;
      this.isHealthAdminValid = this.checkHealthAdminValid();
      this.getIncidentSources(
        this.user.healthAdministrationId,
        this.user.organizationId
      );
    }
  }

  healthAdministrationDeSelected() {
    this.incidentSources = [];
    this.user.healthAdministrationId = null;
    this.isHealthAdminValid = this.checkHealthAdminValid();
    this.SelectedincidentSource = null;
    this.incidentSourceDeSelected();
  }

  onUserLevelChange(isResetIncidentSource = false) {
    this.resetAll();
    this.SelectedincidentSource = null;
    if (!isResetIncidentSource) this.user.incidentSourceId = null;
    this.SelectedareaId = null;
    // this.user.areaId = null;
    // MARK IMP
    if (this.user.levelId != undefined && this.user.levelId != null) {
      this.getRoles();
      this.disableGovernment = true;
      this.disableAdmin = true;
      this.disableIncidentSrc = true;

      if (this.user.levelId == 2) {
        this.disableGovernment = false;
      } else if (this.user.levelId == 3) {
        this.disableGovernment = false;
        this.disableAdmin = false;
      } else if (this.user.levelId != 1) {
        this.disableGovernment = false;
        this.disableAdmin = false;
        this.disableIncidentSrc = false;
      }
    }
  }

  resetAll() {
    let selectedLevel = this.levels?.find(
      (item) => item.id == this.user.levelId
    );
    this.disableGovernments = !selectedLevel?.showGovernments;
    this.disableDepartments = !selectedLevel?.showDepartments;
    this.disableBranches = !selectedLevel?.showBranches;
    this.disableAreas = !selectedLevel?.showAreas;
    this.disableUniversities = !selectedLevel?.showUniversities;
    this.disableSources = !selectedLevel?.showSources;
  }

  organizationschange() {
    this.incidentSources = [];
    this.user.incidentSourceId = null;
    this.getIncidentSources(
      this.user.healthAdministrationId,
      this.user.organizationId
    );
  }

  organizationSelected() {
    this.organizationDeSelected();
    this.user.organizationId = this.Selectedorganization;
    this.isOrganizationValid = this.checkOrganizationValid();
    this.organizationschange();
    if (this.Selectedorganization) {
      this.getLevels();
      // this.getBranches();
      this.getBranchesForUsers();
    }
  }

  organizationDeSelected() {
    this.user.organizationId = null;
    this.user.levelId = null;
    // this.user.areaId = null;
    this.user.healthAdministrationId = null;
    this.SelectedhealthAdministrationId = null;
    this.SelectedincidentSource = null;
    // this.SelectedareaId = null;
    this.isOrganizationValid = this.checkOrganizationValid();
    this.SelectedincidentSource = null;
    this.incidentSources = null;
    this.levels = [];
    this.resetAll();
  }

  getIncidentSources(healthAdministrationId: any, incedentSourceType: any) {
    if (
      (healthAdministrationId > 0 && incedentSourceType > 0) ||
      this.SelectedgovenmentId > 0 ||
      this.SelectedbranchId > 0
    ) {
      this.lookupsGetterService
        .getPageIncidentSourceHospitals({
          healthAdministrationId: healthAdministrationId,
          organizationID: incedentSourceType,
          branchId: this.activeUSerService.getAccessibleParts?.showAreas
            ? null
            : this.SelectedbranchId,
          areaId: this.SelectedareaId ? this.SelectedareaId : null,
          GovernmentID:
            this.Selectedorganization ==
              OrganizationsEnum.General_Organization_For_Teaching_Hospitals_and_Institutes ||
            this.Selectedorganization == OrganizationsEnum.Aman_Hospitals
              ? this.SelectedgovenmentId
              : null,
        })
        .subscribe(
          (result: any) => {
            if (result != null && result != undefined) {
              this.incidentSources = result.data;
              this.incidentSources.unshift({
                id: null,
                arabicName: 'إختر',
                englishName: 'Select',
              });
              if (this.user.incidentSourceId > 0) {
                this.SelectedincidentSource = this.incidentSources.find(
                  (x) => x.id == this.user.incidentSourceId
                )?.id;
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

  incidentSourceSelected() {
    this.user.incidentSourceId = this.SelectedincidentSource;
    this.isIncidentSourceValid = this.checkIncidentSourceValid();
  }

  incidentSourceDeSelected() {
    this.user.incidentSourceId = null;
    this.isIncidentSourceValid = this.checkIncidentSourceValid();
  }

  positionIdSelected() {
    this.user.positionId = this.SelectedpositionId;
  }

  positionIdDeSelected() {
    this.user.positionId = null;
  }
  departmentIdDeSelected() {
    this.user.departmentId = null;
  }
  departmentIdSelected() {
    this.user.departmentId = this.SelecteddepartmentId;
  }
  getDepartments() {
    this.lookupsGetterService
      .getPageDepartments({
        pageSize: 10,
        pageIndex: 0,
        sortColumn: '',
        sortOrder: '',
        searchText: '',
        code: '',
        arabicName: '',
        englishName: '',
        incidentSourceID: null,
        governmentID: null,
        healthAdministrationID: null,
      })
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.departments = result.data;
            if (this.departments?.length > 2) {
              this.departments.unshift({
                id: null,
                arabicName: 'الكل',
                englishName: 'All',
              });
            } else {
              this.departments.unshift({
                id: null,
                arabicName: 'إختر',
                englishName: 'Select',
              });
            }
            if (this.user.departmentId > 0) {
              this.SelecteddepartmentId = this.departments.find(
                (x) => x.id == this.user.departmentId
              )?.id;
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

  getOrganizations() {
    this.lookupsGetterService.getAllOrganizations().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.organizations = result.data;
          this.organizations.unshift({
            id: null,
            arabicName: 'إختر',
            englishName: 'Select',
          });
          if (this.user.organizationId > 0) {
            this.Selectedorganization = this.organizations.find(
              (item) => item.id === this.user.organizationId
            )?.id;
            this.getLevels();
            // this.getBranches();
            this.getBranchesForUsers();
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

  getLevels() {
    this.lookupsGetterService.getAllLevels(this.Selectedorganization).subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.levels = result.data;
          this.levels.unshift({
            id: null,
            arabicName: 'إختر',
            englishName: 'Select',
          });
          if (this.user.levelId > 0) {
            // this.Selectedorganization =
            //   this.levels.find((item) => item.id === this.user.organizationId)?.id;
            this.getRoles();
            this.resetAll();
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
    this.lookupsGetterService
      .getAllBranches(this.Selectedorganization)
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.branches = result.data;
            this.branches.unshift({
              id: null,
              arabicName: 'إختر',
              englishName: 'Select',
            });
            if (this.user.govenmentId > 0 && !this.disableBranches) {
              this.SelectedgovenmentId = this.branches.find(
                (item) => item.id === this.user.govenmentId
              )?.id;
              this.governmentSelected();
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

  getBranchesForUsers() {
    this.lookupsGetterService
      .getAllBranchesForUsers(this.Selectedorganization, true)
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.branches = result.data;
            this.branches.unshift({
              id: null,
              arabicName: 'إختر',
              englishName: 'Select',
            });
            setTimeout(() => {
              if (
                (this.user.branchId > 0 && !this.disableBranches) ||
                (this.user.branchId > 0 && !this.disableUniversities)
              ) {
                this.SelectedbranchId = this.branches.find(
                  (item) => item.id === this.user.branchId
                )?.id;
                this.branchSelected();
              }
            }, 500);
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
    // this.governmentDeSelected();
    if (this.SelectedbranchId) {
      this.user.branchId = this.SelectedbranchId;
      // this.healthAdministrations = [];
      // this.getHealthAdministrationsForUsers(this.user.branchId);
      this.getAreas();
      this.getIncidentSources(
        this.user.healthAdministrationId,
        this.user.organizationId
      );
    }
  }

  getAreas() {
    this.lookupsGetterService.getAllAreas(this.SelectedbranchId).subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.areas = result.data;
          this.areas.unshift({
            id: null,
            arabicName: 'إختر',
            englishName: 'Select',
          });
          if (this.user.areaId > 0 && !this.disableAreas) {
            this.SelectedareaId = this.areas.find(
              (item) => item.id === this.user.areaId
            )?.id;
            this.areaSelected();
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
    // this.governmentDeSelected();
    if (this.SelectedareaId) {
      this.user.areaId = this.SelectedareaId;
      this.isAreaValid = this.checkAreaValid();
      this.getIncidentSources(
        this.user.healthAdministrationId,
        this.user.organizationId
      );
    }
  }

  save() {
    if (this.Selectedorganization)
      this.user.organizationId = this.Selectedorganization;

    if (this.SelectedgovenmentId)
      this.user.govenmentId = this.SelectedgovenmentId;

    // if (this.SelectedareaId)
    this.user.areaId = this.SelectedareaId;

    if (this.SelectedbranchId) this.user.branchId = this.SelectedbranchId;

    if (this.SelectedhealthAdministrationId)
      this.user.healthAdministrationId = this.SelectedhealthAdministrationId;

    if (this.SelectedincidentSource)
      this.user.incidentSourceId = this.SelectedincidentSource;

    if (this.Selectedrole) this.user.roleId = this.Selectedrole;

    if (this.SelectedpositionId) this.user.positionId = this.SelectedpositionId;

    if (this.SelecteddepartmentId)
      this.user.departmentId = this.SelecteddepartmentId;

    if (this.SelectedEvaluation)
      this.user.diseaseFormsIds = this.SelectedEvaluation.map((x) => x.id);

    if (this.validate()) {
      if (this.inviteMode) {
        this.createInvitation();
        return;
      }
      if (this.user.id == null) {
        this.userService.addUser(this.user).subscribe(
          (response: any) => {
            if (response?.statusCode === 500) {
              response.messages.forEach((msg) => {
                this.translateService
                  .get('NEDSS.HOME.USERS.ADD_USER.' + msg)
                  .subscribe((res) => {
                    if (msg.includes('Username')) {
                      this.usernameValidationMsg = res;
                    } else if (msg.includes('Email')) {
                      this.emailValidationMsg = res;
                    }
                  });
              });
              this.translateService
                .get('NEDSS.COMMON.SENT_FAILD')
                .subscribe((res: string) => {
                  this.userMsg.error(res);
                });
              return;
            }
            if (response) {
              this.translateService
                .get('NEDSS.COMMON.SENT_SUCESSFULLY_Email')
                .subscribe((res: string) => {
                  this.userMsg.success(res);
                });
              this.user = {
                id: null,
                roleId: null,
                govenmentId: null,
                areaId: null,
                healthAdministrationId: null,
                incidentSourceId: null,
                positionId: null,
                departmentId: null,
                fullName: null,
                phoneNo: null,
                email: null,
                profilePic: '',
                organizationId: null,
                branchId: null,
                address: null,
                password: '123',
                levelId: null,
                externalLabId: null,
                userGroupId: null,
                userName: null,
                diseaseFormsIds: [],
                active: true,
                isSuperAdmin: this.adminBool ? true : false,
                notActiveReason: null,
              };

              this.router.navigateByUrl('/home/control-panel/users');
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
      this.userMsg.error(' * يجب اضافة كل الحقول');
    }
  }

  createInvitation() {
    if (this.creatingInvite || this.showInviteDialog) {
      return;
    }
    this.creatingInvite = true;
    const scope = {
      roleId: this.user.roleId,
      levelId: this.user.levelId,
      organizationId: this.user.organizationId,
      govenmentId: this.user.govenmentId,
      healthAdministrationId: this.user.healthAdministrationId,
      incidentSourceId: this.user.incidentSourceId,
      positionId: this.user.positionId,
      departmentId: this.user.departmentId,
      branchId: this.user.branchId,
      areaId: this.user.areaId,
      userGroupId: this.user.userGroupId,
      externalLabId: this.user.externalLabId,
      isSuperAdmin: this.user.isSuperAdmin,
      diseaseFormsIds: this.user.diseaseFormsIds,
    };
    this.userService.createInvitation(scope).subscribe(
      (response: any) => {
        this.creatingInvite = false;
        const data = response?.data;
        if (!data || !data.token) {
          this.translateService
            .get('NEDSS.COMMON.SENT_FAILD')
            .subscribe((res: string) => this.userMsg.error(res));
          return;
        }
        this.inviteResult = {
          url: window.location.origin + '/#/user-onboarding/' + data.token,
          code: data.code,
          expiresAt: data.expiresAt,
        };
        this.linkCopied = false;
        this.codeCopied = false;
        this.showInviteDialog = true;
      },
      (error) => {
        this.creatingInvite = false;
        this.translateService
          .get('NEDSS.COMMON.SENT_FAILD')
          .subscribe((res: string) => this.userMsg.error(res));
      }
    );
  }

  copyInviteText(text: string, which: 'link' | 'code') {
    navigator.clipboard?.writeText(text);
    if (which === 'link') this.linkCopied = true;
    else this.codeCopied = true;
  }

  closeInviteDialog() {
    this.showInviteDialog = false;
    this.router.navigateByUrl('/home/control-panel/users');
  }

  usernameChange() {
    this.usernameValidationMsg = '';
  }

  emailChange() {
    this.emailValidationMsg = '';
  }

  update() {
    this.userService.updateUser(this.user).subscribe(
      (response: any) => {
        if (response) {
          this.translateService
            .get('NEDSS.COMMON.UPDATE_SUCESSFULLY')
            .subscribe((res: string) => {
              this.userMsg.success(res);
            });
          this.user = {
            id: null,
            roleId: null,
            profilePic: '',
            govenmentId: null,
            healthAdministrationId: null,
            incidentSourceId: null,
            positionId: null,
            departmentId: null,
            fullName: null,
            phoneNo: null,
            email: null,
            address: null,
            password: '123',
            levelId: null,
            externalLabId: null,
            userGroupId: null,
            organizationId: null,
            branchId: null,
            userName: null,
            areaId: null,
            diseaseFormsIds: [],
            active: true,
            isSuperAdmin: this.adminBool ? true : false,
            notActiveReason: null,
          };

          this.router.navigateByUrl('/home/control-panel/users');
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

  getById(id) {
    this.userService.getUserById(id).subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.user = result.data;
          this.isNew = false;
          this.imageSrc = this.user.profilePic
            ? this.user.profilePic
            : 'assets/upload-image.webp';
          this.onUserLevelChange(true);
          this.getGovernmentsForUser();
          this.getRoles();
          this.getPositions();
          this.getOrganizations();
          this.getDepartments();
          this.getSystemPages(this.user.roleId);
          this.getAlRolelDiseases(this.user.roleId);
          this.getDiseases();

          this.loadingPanel = false;
          var e = this.Selectedorganization;
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

  validate(): boolean {
    this.isOrganizationValid = this.checkOrganizationValid();
    this.isGovernmentValid = this.checkGovernmentValid();
    this.isAreaValid = this.checkAreaValid();
    this.isHealthAdminValid = this.checkHealthAdminValid();
    this.isIncidentSourceValid = this.checkIncidentSourceValid();
    this.isRoleValid = this.checkRoleValid();
    this.isEvaluationValid = this.checkEvaluationValid();

    if (
      !this.isOrganizationValid ||
      !this.isGovernmentValid ||
      !this.isAreaValid ||
      !this.isHealthAdminValid ||
      !this.isIncidentSourceValid ||
      !this.isRoleValid ||
      !this.isEvaluationValid
    ) {
      return false;
    }

    return true;
  }

  checkEvaluationValid = () => this.user.diseaseFormsIds !== null;
  checkOrganizationValid = () => this.user.organizationId !== null;
  checkGovernmentValid = () =>
    (this.user.govenmentId !== null && !this.disableGovernments) ||
    this.disableGovernments;
  checkAreaValid = () =>
    (this.user.areaId !== null && !this.disableAreas) || this.disableAreas;
  checkHealthAdminValid = () =>
    (this.user.healthAdministrationId !== null && !this.disableDepartments) ||
    this.disableDepartments;
  checkIncidentSourceValid = () =>
    (this.user.incidentSourceId !== null && !this.disableSources) ||
    this.disableSources;
  checkRoleValid = () => this.user.roleId !== null;

  exportPatientsAsPdf() {
    this.exportService.exportTableAsPdf(this.tableElement, this.user.fullName);
  }

  confirmResetPassword() {
    if (!this.user?.id) {
      return;
    }

    this.resettingPassword = true;
    this.userService.resetUserPassword(this.user.id).subscribe({
      next: () => {
        this.resettingPassword = false;
        this.translateService
          .get('NEDSS.HOME.USERS.ADD_USER.RESET_PASSWORD_SUCCESS')
          .subscribe((res: string) => {
            this.userMsg.success(res);
          });
      },
      error: () => {
        this.resettingPassword = false;
        this.translateService
          .get('NEDSS.HOME.USERS.ADD_USER.RESET_PASSWORD_FAILED')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      },
    });
  }
}
