import { Component, ElementRef, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SortEvent } from 'primeng/api';
import { fromEvent, map, debounceTime, distinctUntilChanged } from 'rxjs';
import { SortOrder } from 'src/app/core/constants';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-group',
  templateUrl: './user-group.component.html',
  styleUrls: ['./user-group.component.css'],
})
export class UserGroupComponent {
  underDeleting = {
    arabicName: '',
    id: null
  };
  userGroup = {
    id: null,
    code: null,
    arabicName: null,
    englishName: null,
  };
  userGroups!: any[];
  citys!: any[];
  userGroupFilter = {
    pageSize: 10,
    pageIndex: 0,
    sortColumn: 'code',
    sortOrder: 'desc',
    searchText: '',
  };
  noData: boolean = true;
  loadingPanel: boolean = false;
  first: number = 0;
  last: number = 0;
  pages: number = 0;

  private searchWired = false;
  @ViewChild('searchInput') set searchInput(el: ElementRef) {
    if (el && !this.searchWired) {
      this.searchWired = true;
      fromEvent(el.nativeElement, 'keyup')
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
  }

  constructor(
    private userGroupService: LookupsGetterService,
    private translateService: TranslateService,
    private userMsg: UserMessageService
  ) { }

  ngOnInit() {
    this.getUserGroups();
    this.getCitys();
  }

  getCitys() {
    this.userGroupService.getAllCitys().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.citys = result.data;
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
    this.userGroupFilter.pageIndex = 0;
    this.last = this.userGroupFilter.pageIndex * this.userGroupFilter.pageSize;
    this.getUserGroups();
  }

  getUserGroups() {
    this.loadingPanel = true;
    this.userGroupService.getPageUserGroups(this.userGroupFilter).subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.userGroups = result.data;
          if (this.userGroups != undefined && this.userGroups.length == 0) {
            this.noData = true;
            this.pages = 0;
          } else {
            this.noData = false;
            this.pages = result.data[0].totalCount;
            this.last =
              this.userGroupFilter.pageIndex * this.userGroupFilter.pageSize;
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
    this.userGroupService.getUserGroupById(id).subscribe(
      (result: any) => {
        this.userGroup = result.data;
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
    if (this.userGroup.id == null) {
      this.userGroupService.addUserGroup(this.userGroup).subscribe(
        (response: any) => {
          if (response) {
            this.translateService
              .get('NEDSS.COMMON.SENT_SUCESSFULLY')
              .subscribe((res: string) => {
                this.userMsg.success(res);
              });
            this.getUserGroups();
            this.userGroup = {
              id: null,
              code: null,
              arabicName: null,
              englishName: null,
            };
          }
        },
        (error) => {
          if (error.error?.messages?.includes("DuplicatedCode") || error?.error?.messages?.includes("DuplicatedEnglishName")
            || error.error?.messages?.includes("DuplicatedArabicName")) {
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

  update() {
    this.userGroupService.updateUserGroup(this.userGroup).subscribe(
      (response: any) => {
        if (response) {
          this.translateService
            .get('NEDSS.COMMON.UPDATE_SUCESSFULLY')
            .subscribe((res: string) => {
              this.userMsg.success(res);
            });
          this.getUserGroups();
          this.userGroup = {
            id: null,
            code: null,
            arabicName: null,
            englishName: null,
          };
        }
      },
      (error) => {
        if (error.error?.messages?.includes("DuplicatedCode") || error?.error?.messages?.includes("DuplicatedEnglishName")
          || error.error?.messages?.includes("DuplicatedArabicName")) {
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
    if (event.order == -1 && this.userGroupFilter.sortOrder != SortOrder.desc) {
      this.userGroupFilter.sortOrder = SortOrder.desc;
      if (typeof event.field === 'string')
        this.userGroupFilter.sortColumn = event.field;
      this.getUserGroups();
    } else if (
      event.order == 1 &&
      this.userGroupFilter.sortOrder != SortOrder.asc
    ) {
      this.userGroupFilter.sortOrder = SortOrder.asc;
      if (typeof event.field === 'string')
        this.userGroupFilter.sortColumn = event.field;
      this.getUserGroups();
    }
  }
  paginate(event: any) {
    this.first = event.first;
    this.last = event.last;
    this.userGroupFilter.pageIndex = event.page;
    this.userGroupFilter.pageSize = event.rows;
    this.getUserGroups();
  }

  delete(id: number) {
    this.userGroupService.deleteUserGroup(id).subscribe(
      (result: any) => {
        this.getUserGroups();
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
    this.userGroupFilter.searchText = '';
    this.search();
  }
  nameToDelete(ele) {
    this.underDeleting.id = ele.id;
    this.underDeleting.arabicName = ele.arabicName;
  }
}
