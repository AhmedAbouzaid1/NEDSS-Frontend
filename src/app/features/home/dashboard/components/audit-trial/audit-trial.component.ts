import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig, SortEvent } from 'primeng/api';
import { Actions, SortOrder } from 'src/app/core/constants';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { SharedDataService } from '../../../general-data/services/shared-data.service';
import { SysAuditService } from './Services/sys-audit.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-audit-trial',
  templateUrl: './audit-trial.component.html',
  styleUrls: ['./audit-trial.component.css']
})
export class AuditTrialComponent {
  sysAudits!: any[];
  users!: any[];
  sysPages!: any[];
  actions: any[] = Actions;
  sysAuditFilter = {
    pageSize: 10,
    pageIndex: 0,
    sortColumn: '',
    sortOrder: '',
    searchText: '',

    userId: null,
    pageId: null,
    actionId: null,
    fromDate: null,
    toDate: null,
  };
  noData: boolean = true;
  loadingPanel: boolean = false;
  usersLoading: boolean = false;
  sysPagesLoading: boolean = false;
  first: number = 0;
  last: number = 0;
  pages: number = 0;

  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;
  messageService: any;

  constructor(
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private sysAuditService: SysAuditService,
    private primengConfig: PrimeNGConfig,
    private data: SharedDataService,
    private router: Router,
  ) { }
  BasicShow: boolean = false;

  showDialog() {
    this.BasicShow = true;
  }
  ngOnInit() {
    this.primengConfig.ripple = true;
    this.getUser();
    this.getAllPages();
  }
  getUser() {
    this.usersLoading = true;
    this.sysAuditService
      .getAllUsers({})
      .pipe(finalize(() => (this.usersLoading = false)))
      .subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.users = result.data;
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

  getAllPages() {
    this.sysPagesLoading = true;
    this.sysAuditService
      .getAllPages()
      .pipe(finalize(() => (this.sysPagesLoading = false)))
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.sysPages = result.data;
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
    this.sysAuditFilter.pageIndex = 0;
    this.last =
      this.sysAuditFilter.pageIndex * this.sysAuditFilter.pageSize;
    this.getSysAudits();
  }

  getSysAudits() {

    this.loadingPanel = true;
    this.sysAuditService
      .getPageSysAudits(this.sysAuditFilter)
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.sysAudits = result.data;
            if (
              this.sysAudits != undefined &&
              this.sysAudits.length == 0
            ) {
              this.noData = true;
              this.pages = 0;
            } else {
              this.noData = false;
              this.pages = result.data[0].totalCount;
              this.last =
                this.sysAuditFilter.pageIndex *
                this.sysAuditFilter.pageSize;
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
    if (
      event.order == -1 &&
      this.sysAuditFilter.sortOrder != SortOrder.desc
    ) {
      this.sysAuditFilter.sortOrder = SortOrder.desc;
      if (typeof event.field === 'string')
        this.sysAuditFilter.sortColumn = event.field;
      this.getSysAudits();
    } else if (
      event.order == 1 &&
      this.sysAuditFilter.sortOrder != SortOrder.asc
    ) {
      this.sysAuditFilter.sortOrder = SortOrder.asc;
      if (typeof event.field === 'string')
        this.sysAuditFilter.sortColumn = event.field;
      this.getSysAudits();
    }
  }
  paginate(event: any) {
    this.first = event.first;
    this.last = event.last;
    this.sysAuditFilter.pageIndex = event.page;
    this.sysAuditFilter.pageSize = event.rows;
    this.getSysAudits();
  }

  clearSearch() {
    this.sysAuditFilter.searchText = '';
    this.search();
  }
}
