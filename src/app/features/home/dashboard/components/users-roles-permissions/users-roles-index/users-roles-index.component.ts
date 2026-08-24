import { Component, ElementRef, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { UsersRolesPermissionsService } from '../Services/users-roles-permissions.service';
import { PrimeNGConfig, SortEvent } from 'primeng/api';
import { SortOrder } from 'src/app/core/constants';
import { ExportService } from '../../../../../../core/services/export.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Organiztion } from 'src/app/features/home/chat/Models/organiztion';
import { Result } from 'src/app/features/Result';

@Component({
  selector: 'app-users-roles-index',
  templateUrl: './users-roles-index.component.html',
  styleUrls: ['./users-roles-index.component.css'],
})
export class UsersRolesIndexComponent {
  underDeleting2 = {
    arabicName: '',
    id: null,
    englishName: '',
  };
  users!: any[];
  roleFilterForm: FormGroup;
  noData: boolean = true;
  loadingPanel: boolean = false;
  first: number = 0;
  last: number = 0;
  pages: number = 0;
  userFilter = {
    pageSize: 10,
    pageIndex: 0,
    sortColumn: '',
    sortOrder: '',
    searchText: '',
    name: null,
    userType: null,
    level: null,
    position: null,
  };
  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;
  messageService: any;
  underDeleting = {
    fullName: '',
    id: null,
  };
  currentLang: string;
  @ViewChild('myTableElementId', { static: false }) tableElement: ElementRef;
  screenName: string;
  organizations: any[] = [];
  selectedOrganizationId:number = null;
  levels: any[] = [];
  selectedLevelId:number[] = [];
  constructor(
    private lookupsService: LookupsGetterService,
    private lookupsGetterService: LookupsGetterService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private usersRolesPermissionService: UsersRolesPermissionsService,
    private primengConfig: PrimeNGConfig,
    private exportService: ExportService
  ) {}
  BasicShow: boolean = false;
  ngOnInit() {
    this.currentLang =
      localStorage.getItem('ls.currentLang') !== undefined &&
      localStorage.getItem('ls.currentLang') !== 'undefined'
        ? localStorage.getItem('ls.currentLang')
        : 'ar';
    this.primengConfig.ripple = true;
    this.roleFilterForm = new FormGroup({
      arabicName: new FormControl(),
      englishName: new FormControl(),
      pageSize: new FormControl(10),
      pageIndex: new FormControl(0),
      sortColumn: new FormControl(''),
      sortOrder: new FormControl(''),
      searchText: new FormControl(),
      levelsIds: new FormControl(null),
      organizationId: new FormControl(null),
    });

    this.getOrganizations();
    // this.GetRoles();

    this.translateService
      .get('NEDSS.HOME.USERS.ADD_USER.ROLE')
      .subscribe((res) => (this.screenName = res));
  }
  showDialog() {
    this.BasicShow = true;
  }

  GetRoles() {
    this.loadingPanel = true;
    this.usersRolesPermissionService
      .getPageUsersRolesPermissions(this.roleFilterForm.getRawValue())
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.users = result.data;
            if (this.users != undefined && this.users.length == 0) {
              this.noData = true;
              this.pages = 0;
            } else {
              this.noData = false;
              this.pages = result.data[0].totalCount;
              this.last =
                this.roleFilterForm.get('pageIndex').value *
                this.roleFilterForm.get('pageSize').value;
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
    this.users = [];
    this.first = 0;
    this.roleFilterForm.patchValue({
      pageIndex: 0,
      organizationId: this.selectedOrganizationId,
      levelsIds: this.selectedLevelId,
    });
    this.last =
      this.roleFilterForm.get('pageIndex').value *
      this.roleFilterForm.get('pageSize').value;
    this.GetRoles();
  }

  sort(event: SortEvent) {
    if (
      event.order == -1 &&
      this.roleFilterForm.get('sortOrder').value != SortOrder.desc
    ) {
      this.roleFilterForm.patchValue({
        sortOrder: SortOrder.desc,
        sortColumn:
          typeof event.field === 'string'
            ? event.field
            : this.roleFilterForm.get('sortColumn').value,
      });
      this.GetRoles();
    } else if (
      event.order == 1 &&
      this.roleFilterForm.get('sortOrder').value != SortOrder.asc
    ) {
      this.roleFilterForm.patchValue({
        sortOrder: SortOrder.asc,
        sortColumn:
          typeof event.field === 'string'
            ? event.field
            : this.roleFilterForm.get('sortColumn').value,
      });
      this.GetRoles();
    }
  }
  paginate(event: any) {
    this.first = event.first;
    this.last = event.last;
    this.roleFilterForm.patchValue({
      pageIndex: event.page,
      pageSize: event.rows,
    });
    this.GetRoles();
  }
  delete(id: number) {}
  clearSearch() {
    this.roleFilterForm.patchValue({ searchText: '' });
    this.search();
  }

  exportEventsAsExcel() {
    this.exportService.exportTableAsExcel(this.tableElement, this.screenName);
  }
  exportEventsAsPdf() {
    this.exportService.exportTableAsPdf(this.tableElement, this.screenName);
  }

  nameTodelete(id) {
    this.usersRolesPermissionService.deleteUsersRolesPermission(id).subscribe(
      (res) => {
        if(res.statusCode == 500){
          this.userMsg.error(res.messages[0]);
        } else{
          this.userMsg.success('تم الحذف بنجاح');
          this.GetRoles();
        }
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
  nameToDelete(ele) {
    this.underDeleting2.id = ele.id;
    this.underDeleting2.arabicName = ele.arabicName;
    this.underDeleting2.englishName = ele.englishName;
  }

  getOrganizations() {
    this.lookupsService.getAllOrganizations().subscribe({
      next: (response: Result<Organiztion[]>) => {
        let selectionObject = {
          id: null,
          englishName: '',
          arabicName: '',
          code: '',
          totalCount: -1,
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
    this.selectedOrganizationId = event.value.id;
    if (this.selectedOrganizationId == null) {
      return;
    }
    this.getLevels();
  }

  getLevels(){
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
      error:(error) => {
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
    if(this.selectedLevelId == null){
      return;
    }
  }
}