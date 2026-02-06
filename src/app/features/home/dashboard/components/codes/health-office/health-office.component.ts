import { LookupsGetterService } from './../../../../../../core/services/lookups-getter.service';
import { UserMessageService } from './../../../../../../core/services/user.message.service';
import { TranslateService } from '@ngx-translate/core';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs/internal/observable/fromEvent';
import { map } from 'rxjs/internal/operators/map';
import { environment } from 'src/environments/environment';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SortEvent } from 'primeng/api';
import { SortOrder } from 'src/app/core/constants';

@Component({
  selector: 'app-health-office',
  templateUrl: './health-office.component.html',
  styleUrls: ['./health-office.component.css'],
})
export class HealthOfficeComponent {
  underDeleting = {
    arabicName: '',
    id: null
  };
  healthOffice = {
    id: null,
    code: null,
    arabicName: null,
    englishName: null,
    cityID: null,
  };
  healthOffices!: any[];
  citys!: any[];
  healthOfficeFilter = {
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

  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;
  messageService: any;

  constructor(
    private healthOfficeService: LookupsGetterService,
    private translateService: TranslateService,
    private userMsg: UserMessageService
  ) { }

  ngOnInit() {
    this.getHealthOffices();
    this.getCitys();

    fromEvent(this.searchInput.nativeElement, 'keyup')
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
  getCitys() {
    this.healthOfficeService.getAllCitys().subscribe(
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
    this.healthOfficeFilter.pageIndex = 0;
    this.last =
      this.healthOfficeFilter.pageIndex * this.healthOfficeFilter.pageSize;
    this.getHealthOffices();
  }

  getHealthOffices() {
    this.loadingPanel = true;
    this.healthOfficeService
      .getPageHealthOffices(this.healthOfficeFilter)
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.healthOffices = result.data;
            if (
              this.healthOffices != undefined &&
              this.healthOffices.length == 0
            ) {
              this.noData = true;
              this.pages = 0;
            } else {
              this.noData = false;
              this.pages = result.data[0].totalCount;
              this.last =
                this.healthOfficeFilter.pageIndex *
                this.healthOfficeFilter.pageSize;
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
    this.healthOfficeService.getHealthOfficeById(id).subscribe(
      (result: any) => {
        this.healthOffice = result.data;
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
    if (this.healthOffice.id == null) {
      this.healthOfficeService.addHealthOffice(this.healthOffice).subscribe(
        (response: any) => {
          if (response) {
            this.translateService
              .get('NEDSS.COMMON.SENT_SUCESSFULLY')
              .subscribe((res: string) => {
                this.userMsg.success(res);
              });
            this.getHealthOffices();
            this.healthOffice = {
              id: null,
              code: null,
              arabicName: null,
              englishName: null,
              cityID: null,
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
    this.healthOfficeService.updateHealthOffice(this.healthOffice).subscribe(
      (response: any) => {
        if (response) {
          this.translateService
            .get('NEDSS.COMMON.UPDATE_SUCESSFULLY')
            .subscribe((res: string) => {
              this.userMsg.success(res);
            });
          this.getHealthOffices();
          this.healthOffice = {
            id: null,
            code: null,
            arabicName: null,
            englishName: null,
            cityID: null,
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
    if (
      event.order == -1 &&
      this.healthOfficeFilter.sortOrder != SortOrder.desc
    ) {
      this.healthOfficeFilter.sortOrder = SortOrder.desc;
      if (typeof event.field === 'string')
        this.healthOfficeFilter.sortColumn = event.field;
      this.getHealthOffices();
    } else if (
      event.order == 1 &&
      this.healthOfficeFilter.sortOrder != SortOrder.asc
    ) {
      this.healthOfficeFilter.sortOrder = SortOrder.asc;
      if (typeof event.field === 'string')
        this.healthOfficeFilter.sortColumn = event.field;
      this.getHealthOffices();
    }
  }
  paginate(event: any) {
    this.first = event.first;
    this.last = event.last;
    this.healthOfficeFilter.pageIndex = event.page;
    this.healthOfficeFilter.pageSize = event.rows;
    this.getHealthOffices();
  }

  delete(id: number) {
    this.healthOfficeService.deleteHealthOffice(id).subscribe(
      (result: any) => {
        this.getHealthOffices();
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
    this.healthOfficeFilter.searchText = '';
    this.search();
  }

  nameToDelete(ele) {
    this.underDeleting.id = ele.id;
    this.underDeleting.arabicName = ele.arabicName;
  }
}
