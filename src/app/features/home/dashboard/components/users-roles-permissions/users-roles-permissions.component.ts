import { Component, ElementRef, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SortEvent } from 'primeng/api';
import { fromEvent, map, debounceTime, distinctUntilChanged } from 'rxjs';
import { SortOrder } from 'src/app/core/constants';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { environment } from 'src/environments/environment';
import { UsersRolesPermissionsService } from './Services/users-roles-permissions.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DiseaseFormService } from '../disease-special-symptoms/services/disease-form.service';
import { Organiztion } from '../../../chat/Models/organiztion';
import { Result } from 'src/app/features/Result';

@Component({
  selector: 'app-users-roles-permissions',
  templateUrl: './users-roles-permissions.component.html',
  styleUrls: ['./users-roles-permissions.component.css'],
})
export class UsersRolesPermissionsComponent {
  usersRolesPermission = {
    id: null,
    arabicName: null,
    englishName: null,
    systemPageIds: null,
    diseaseIds: null,
    selectedDiseaseIds: null,
    diseaseFieldIds: null,
    isSelectedSubject: false,
    organizationId: null,
    levelsIds: null,
  };
  selectlist: any;
  selectedFieldlist: any;
  usersRolesPermissions!: any[];
  diseases!: any[];
  selectedDiseases!: any[];
  systemPages!: any[];
  // systemPageIds!: any[];
  systemPageIds: Array<number> = [];
  diseaseIds: Array<number> = [];
  selectedDiseaseIds: Array<number> = [];
  diseaseFieldIds: Array<number> = [];
  usersRolesPermissionFilter = {
    pageSize: 10,
    pageIndex: 0,
    sortColumn: '',
    sortOrder: '',
    searchText: '',
  };
  noData: boolean = true;
  loadingPanel: boolean = false;
  first: number = 0;
  last: number = 0;
  pages: number = 0;
  isShowErrorAr: Boolean = false;
  isShowErrorEn: Boolean = false;
  isShowErrorOrgn: Boolean = false;
  isShowErrorLvl: Boolean = false;

  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;
  messageService: any;
  currentId: any;
  currentLang: string;
  organizations: Organiztion[] = [];
  selectedOrganizationId: number = null;
  levels: any[] = [];
  selectedLevelId: number[] = [];
  constructor(
    private lookupsService: LookupsGetterService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private usersRolesPermissionService: UsersRolesPermissionsService,

    private route: ActivatedRoute,
    private router: Router,
    private diseaseFormService: DiseaseFormService
  ) {
    this.currentLang =
      localStorage.getItem('ls.currentLang') !== undefined &&
      localStorage.getItem('ls.currentLang') !== 'undefined'
        ? localStorage.getItem('ls.currentLang')
        : 'ar';
  }

  ngOnInit() {
    this.currentId = this.route.snapshot.paramMap.get('id');
    if (this.currentId != null) this.getById(this.currentId);
    this.getUsersRolesPermissions();
    this.getOrganizations();
    this.getDiseases();
    this.getDiseaseField();
    this.getSelectedDiseases();
    this.getSystemPages();

    this.diseaseFormService.getAllDiseaseField().subscribe(
      (result: any) => {
        this.selectlist = result.data;
      },
      () => {
        this.translateService
          .get('NEDSS.COMMON.failaddField')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }
  getDiseases() {
    this.usersRolesPermissionService
      .getAlRolelDiseases(this.currentId ?? 0)
      .subscribe(
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
  getDiseaseField() {
    this.usersRolesPermissionService
      .getAllRoleDiseaseField(this.currentId ?? 0)
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.selectedFieldlist = result.data;
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

  getSelectedDiseases() {
    this.usersRolesPermissionService
      .getAllSelectedRoleDiseases(this.currentId ?? 0)
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

  getSystemPages() {
    this.usersRolesPermissionService
      .GetAllSystemPages(this.currentId ?? 0, true)
      .subscribe(
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
  search() {
    this.first = 0;
    this.usersRolesPermissionFilter.pageIndex = 0;
    this.last =
      this.usersRolesPermissionFilter.pageIndex *
      this.usersRolesPermissionFilter.pageSize;
    this.getUsersRolesPermissions();
  }
  valueChecked: HTMLInputElement;
  chkAllSystemPageChange(e) {
    let checkbox = document.getElementsByName('systemPages');
    if (e.target.checked) {
      if (checkbox != null) {
        for (var i = 0; i < checkbox.length; i++) {
          this.valueChecked = checkbox[i] as HTMLInputElement;
          this.valueChecked.checked = true;
          this.systemPageIds.push(Number(this.valueChecked.value));
        }
      }
    } else {
      if (checkbox != null) {
        for (var i = 0; i < checkbox.length; i++) {
          this.valueChecked = checkbox[i] as HTMLInputElement;
          this.valueChecked.checked = false;
          this.systemPageIds = [];
        }
      }
    }
    console.log(this.systemPageIds);
  }
  chkSystemPageChange(e) {
    if (e.target.checked) this.systemPageIds.push(e.target.value);
    else
      this.systemPageIds.splice(
        this.systemPageIds.indexOf(parseInt(e.target.value)),
        1
      );
  }
  chkAllDiseaseChange(e) {
    let checkbox = document.getElementsByName('chkdiseases');
    if (e.target.checked) {
      if (checkbox != null) {
        for (var i = 0; i < checkbox.length; i++) {
          this.valueChecked = checkbox[i] as HTMLInputElement;
          this.valueChecked.checked = true;
          this.diseaseIds.push(Number(this.valueChecked.value));
        }
      }
    } else {
      if (checkbox != null) {
        for (var i = 0; i < checkbox.length; i++) {
          this.valueChecked = checkbox[i] as HTMLInputElement;
          this.valueChecked.checked = false;
          this.diseaseIds = [];
        }
      }
    }
  }
  chkAllChange(e) {
    let checkbox = document.getElementsByName('chks');
    if (e.target.checked) {
      if (checkbox != null) {
        for (var i = 0; i < checkbox.length; i++) {
          this.valueChecked = checkbox[i] as HTMLInputElement;
          this.valueChecked.checked = true;
          this.diseaseFieldIds.push(Number(this.valueChecked.value));
        }
      }
    } else {
      if (checkbox != null) {
        for (var i = 0; i < checkbox.length; i++) {
          this.valueChecked = checkbox[i] as HTMLInputElement;
          this.valueChecked.checked = false;
          this.diseaseFieldIds = [];
        }
      }
    }
  }
  chkDiseaseChange(e) {
    if (e.target.checked) this.diseaseIds.push(e.target.value);
    else
      this.diseaseIds.splice(
        this.diseaseIds.indexOf(parseInt(e.target.value)),
        1
      );
  }

  chkDiseasefiledChange(e) {
    if (e.target.checked) this.diseaseFieldIds.push(e.target.value);
    else
      this.diseaseFieldIds.splice(
        this.diseaseFieldIds.indexOf(parseInt(e.target.value)),
        1
      );
  }

  chkAllSelectedDiseaseChange(e) {
    let checkbox = document.getElementsByName('chkSelectedDiseases');
    if (e.target.checked) {
      if (checkbox != null) {
        for (var i = 0; i < checkbox.length; i++) {
          this.valueChecked = checkbox[i] as HTMLInputElement;
          this.valueChecked.checked = true;
          this.selectedDiseaseIds.push(Number(this.valueChecked.value));
        }
      }
    } else {
      if (checkbox != null) {
        for (var i = 0; i < checkbox.length; i++) {
          this.valueChecked = checkbox[i] as HTMLInputElement;
          this.valueChecked.checked = false;
          this.selectedDiseaseIds = [];
        }
      }
    }
  }

  chkSelectedDiseaseChange(e) {
    if (e.target.checked) this.selectedDiseaseIds.push(e.target.value);
    else
      this.selectedDiseaseIds.splice(
        this.selectedDiseaseIds.indexOf(parseInt(e.target.value)),
        1
      );
  }

  getUsersRolesPermissions() {
    this.loadingPanel = true;
    this.usersRolesPermissionService
      .getPageUsersRolesPermissions(this.usersRolesPermissionFilter)
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.usersRolesPermissions = result.data;
            if (
              this.usersRolesPermissions != undefined &&
              this.usersRolesPermissions.length == 0
            ) {
              this.noData = true;
              this.pages = 0;
            } else {
              this.noData = false;
              this.pages = result.data[0].totalCount;
              this.last =
                this.usersRolesPermissionFilter.pageIndex *
                this.usersRolesPermissionFilter.pageSize;
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
    this.usersRolesPermissionService.getUsersRolesPermissionById(id).subscribe(
      (result: any) => {
        console.log(result);
        this.usersRolesPermission = result.data;
        if (result.data.roleDiseases != null)
          this.diseaseIds = result.data.roleDiseases.map(
            (a) => a.diseaseGroupId
          );
        if (result.data.roleDiseaseFields != null)
          this.diseaseFieldIds = result.data.roleDiseaseFields.map(
            (a) => a.diseaseFieldId
          );
        if (result.data.roleSelectedSubjects != null)
          this.selectedDiseaseIds = result.data.roleSelectedSubjects.map(
            (a) => a.diseaseGroupId
          );

        if (result.data.rolePermissions != null)
          this.systemPageIds = result.data.rolePermissions.map((a) => a.pageId);

        if (result.data.organizationId != null){
          this.selectedOrganizationId = result.data.organizationId;
        }

        if (result.data.levelsIds != null){
          console.log(result.data.levelsIds);
          this.selectedLevelId = result.data.levelsIds;
        }
        this.getLevels();

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

  chkSelectedSubChange(e) {
    if (e.target.checked) this.usersRolesPermission.isSelectedSubject = true;
    else this.usersRolesPermission.isSelectedSubject = false;
  }
  save() {
    if (!this.usersRolesPermission.arabicName) {
      this.isShowErrorAr = true;
    } else if (!this.usersRolesPermission.englishName) {
      this.isShowErrorEn = true;
    } else if (!this.usersRolesPermission.organizationId) {
      this.isShowErrorOrgn = true;
    } else if (!this.usersRolesPermission.levelsIds) {
      this.isShowErrorLvl = true;
    }  else if (!this.validate()) {
      this.userMsg.error('يجب اضافة كل الحقول');
    } else if (!this.validatePages()) {
      this.userMsg.error('يجب اختيار صلاحية واحدة علي الاقل');
    } else if (!this.validatedisieses()) {
      this.userMsg.error('يجب اختيار مرض واحد علي الاقل');
    } else {
      this.usersRolesPermission.systemPageIds = this.systemPageIds;
      this.usersRolesPermission.diseaseIds = this.diseaseIds;
      this.usersRolesPermission.selectedDiseaseIds = this.selectedDiseaseIds;
      this.usersRolesPermission.diseaseFieldIds = this.diseaseFieldIds;
      if (this.usersRolesPermission.id == null) {
        this.usersRolesPermissionService
          .addUsersRolesPermission(this.usersRolesPermission)
          .subscribe(
            (response: any) => {
              if (response) {
                this.translateService
                  .get('NEDSS.COMMON.SENT_SUCESSFULLY')
                  .subscribe((res: string) => {
                    this.userMsg.success(res);
                    this.router.navigateByUrl(
                      '/home/control-panel/permissions'
                    );
                  });
                this.getUsersRolesPermissions();
                this.usersRolesPermission = {
                  id: null,
                  arabicName: null,
                  englishName: null,
                  systemPageIds: null,
                  diseaseIds: null,
                  selectedDiseaseIds: null,
                  isSelectedSubject: null,
                  diseaseFieldIds: null,
                  organizationId: null,
                  levelsIds: null,
                };
              }
            },
            (error) => {
              if (
                error.error?.messages?.includes('DuplicatedCode') ||
                error?.error?.messages?.includes('DuplicatedEnglishName') ||
                error.error?.messages?.includes('DuplicatedArabicName')
              ) {
                this.translateService
                  .get('NEDSS.COMMON.' + error.error.messages[0])
                  .subscribe((res: string) => {
                    this.userMsg.error(res);
                  });
              } else {
                this.translateService
                  .get('NEDSS.COMMON.SENT_FAILD')
                  .subscribe((res: string) => {
                    this.userMsg.error(res);
                  });
              }
            }
          );
      } else this.update();
    }
  }

  update() {
    this.usersRolesPermissionService
      .updateUsersRolesPermission(this.usersRolesPermission)
      .subscribe(
        (response: any) => {
          if (response) {
            this.translateService
              .get('NEDSS.COMMON.UPDATE_SUCESSFULLY')
              .subscribe((res: string) => {
                this.userMsg.success(res);
                this.router.navigateByUrl('/home/control-panel/permissions');
              });
            this.getUsersRolesPermissions();
            this.usersRolesPermission = {
              id: null,
              arabicName: null,
              englishName: null,
              systemPageIds: null,
              diseaseIds: null,
              selectedDiseaseIds: null,
              isSelectedSubject: null,
              diseaseFieldIds: null,
              organizationId: null,
              levelsIds: null,
            };
          }
        },
        (error) => {
          if (
            error.error?.messages?.includes('DuplicatedCode') ||
            error?.error?.messages?.includes('DuplicatedEnglishName') ||
            error.error?.messages?.includes('DuplicatedArabicName')
          ) {
            this.translateService
              .get('NEDSS.COMMON.' + error.error.messages[0])
              .subscribe((res: string) => {
                this.userMsg.error(res);
              });
          } else {
            this.translateService
              .get('NEDSS.COMMON.SENT_FAILD')
              .subscribe((res: string) => {
                this.userMsg.error(res);
              });
          }
        }
      );
  }

  sort(event: SortEvent) {
    if (
      event.order == -1 &&
      this.usersRolesPermissionFilter.sortOrder != SortOrder.desc
    ) {
      this.usersRolesPermissionFilter.sortOrder = SortOrder.desc;
      if (typeof event.field === 'string')
        this.usersRolesPermissionFilter.sortColumn = event.field;
      this.getUsersRolesPermissions();
    } else if (
      event.order == 1 &&
      this.usersRolesPermissionFilter.sortOrder != SortOrder.asc
    ) {
      this.usersRolesPermissionFilter.sortOrder = SortOrder.asc;
      if (typeof event.field === 'string')
        this.usersRolesPermissionFilter.sortColumn = event.field;
      this.getUsersRolesPermissions();
    }
  }
  paginate(event: any) {
    this.first = event.first;
    this.last = event.last;
    this.usersRolesPermissionFilter.pageIndex = event.page;
    this.usersRolesPermissionFilter.pageSize = event.rows;
    this.getUsersRolesPermissions();
  }

  delete(id: number) {
    this.usersRolesPermissionService.deleteUsersRolesPermission(id).subscribe(
      (result: any) => {
        this.getUsersRolesPermissions();
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

  clearSearch() {
    this.usersRolesPermissionFilter.searchText = '';
    this.search();
  }

  validate(): boolean {
    if (
      this.usersRolesPermission.arabicName == null ||
      this.usersRolesPermission.arabicName == '' ||
      this.usersRolesPermission.englishName == null ||
      this.usersRolesPermission.englishName == '' ||
      this.usersRolesPermission.organizationId == null ||
      this.usersRolesPermission.organizationId == '' ||
      this.usersRolesPermission.levelsIds == null ||
      this.usersRolesPermission.levelsIds.length == 0
    )
      return false;

    return true;
  }
  validatePages(): boolean {
    if (this.systemPageIds.length > 0) return true;
    return false;
  }
  validatedisieses(): boolean {
    if (this.diseaseIds.length > 0) return true;
    return false;
  }
  validatedisiesefield(): boolean {
    if (this.diseaseFieldIds.length > 0) return true;
    return false;
  }

  getOrganizations() {
    this.lookupsService.getAllOrganizations().subscribe({
      next: (response: Result<Organiztion[]>) => {
        let selectionObject = {
          id: null,
          englishName: '',
          arabicName: '',
        };
        this.organizations = response.data;
        this.organizations.unshift(selectionObject);
        this.loadingPanel = false;
      },
      error: (error) => {
        this.loadingPanel = false;
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      },
      complete: () => (this.loadingPanel = false),
    });
  }

  onOrganizationChange(event: any) {
    this.levels = [];
    this.selectedLevelId = null;
    this.selectedOrganizationId = event.value;
    this.usersRolesPermission.organizationId = this.selectedOrganizationId;
    if (this.selectedOrganizationId == null) {
      this.isShowErrorOrgn = true;
      return;
    }
    this.isShowErrorOrgn = false;
    this.getLevels();
  }

  getLevels() {
    this.lookupsService.getAllLevels(this.selectedOrganizationId).subscribe({
      next: (response: any) => {
        // let selectionObject = {
        //   id: null,
        //   englishName: '',
        //   arabicName: '',
        // };
        this.levels = response.data;
        // this.levels.unshift(selectionObject);
      },
      error: (error) => {
        this.loadingPanel = false;
        this.translateService
          .get('NEDSS.COMMON.INTERNAL_SERVER_ERROR')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      },
      complete: () => {},
    });
  }

  onLevelChange(event: any) {
    this.selectedLevelId = event.value;
    if (this.selectedLevelId == null || this.selectedLevelId.length == 0) {
      this.isShowErrorLvl = true;
      return;
    }
    this.isShowErrorLvl = false;
    this.usersRolesPermission.levelsIds = this.selectedLevelId;
  }
}
