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
  selector: 'app-device-category',
  templateUrl: './device-category.component.html',
  styleUrls: ['./device-category.component.css'],
})
export class DeviceCategoryComponent {
  underDeleting = {
    arabicName: '',
    id: null
  };
  deviceCategory = {
    id: null,
    code: null,
    arabicName: null,
    englishName: null,
  };
  deviceCategorys!: any[];
  deviceCategoryFilter = {
    pageSize: 10,
    pageIndex: 0,
    sortColumn: 'code',
    sortOrder: 'desc',
    searchText: '',
    code: "",
    arabicName: "",
    englishName: "",
  };
  noData: boolean = true;
  loadingPanel: boolean = false;
  first: number = 0;
  last: number = 0;
  pages: number = 0;
  codeValidationMsg: string = '';
  ArabicValidationMsg: string = '';
  EnglishNameValidationMsg: string = '';

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
    private deviceCategoryService: LookupsGetterService,
    private translateService: TranslateService,
    private userMsg: UserMessageService
  ) { }

  ngOnInit() {
    this.getDeviceCategorys();
  }

  search() {

    this.first = 0;
    this.deviceCategoryFilter.pageIndex = 0;
    this.last = this.deviceCategoryFilter.pageIndex * this.deviceCategoryFilter.pageSize;
    this.deviceCategoryFilter.code = this.deviceCategory.code;
    this.deviceCategoryFilter.arabicName = this.deviceCategory.arabicName;
    this.deviceCategoryFilter.englishName = this.deviceCategory.englishName;
    this.getDeviceCategorys();
  }

  getDeviceCategorys() {
    this.loadingPanel = true;
    this.deviceCategoryService
      .getPageDeviceCategorys(this.deviceCategoryFilter)
      .subscribe(
        (result: any) => {

          if (result != null && result != undefined) {
            this.deviceCategorys = result.data;
            if (
              this.deviceCategorys != undefined &&
              this.deviceCategorys.length == 0
            ) {
              this.noData = true;
              this.pages = 0;
            } else {
              this.noData = false;
              this.pages = result.data[0].totalCount;
              this.last =
                this.deviceCategoryFilter.pageIndex *
                this.deviceCategoryFilter.pageSize;
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
    this.deviceCategoryService.getDeviceCategoryById(id).subscribe(
      (result: any) => {
        document.getElementById("device-cat").scrollIntoView({ behavior: 'smooth' });
        this.deviceCategory = result.data;
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
    if (this.deviceCategory.id == null) {
      this.deviceCategoryService
        .addDeviceCategory(this.deviceCategory)
        .subscribe(
          (response: any) => {
            if (response) {
              this.translateService
                .get('NEDSS.COMMON.SENT_SUCESSFULLY')
                .subscribe((res: string) => {
                  this.userMsg.success(res);
                });
              this.getDeviceCategorys();
              this.deviceCategory = {
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
              error.error.messages.forEach(msg => {

                if (msg.includes("Code")) {
                  this.codeValidationMsg = msg;
                  this.translateService.get('NEDSS.COMMON.CODEVALIDATEMSG').subscribe((res: string) => {
                    this.userMsg.error(res);
                  });
                }
                if (msg.includes("Arabic")) {
                  this.ArabicValidationMsg = msg;
                  this.translateService.get('NEDSS.COMMON.ARABICNAMEVALIDATEMSG').subscribe((res: string) => {
                    this.userMsg.error(res);
                  });
                }

                if (msg.includes("English")) {
                  this.EnglishNameValidationMsg = msg;
                  this.translateService.get('NEDSS.COMMON.ENGLISHNAMEVALIDATEMSG').subscribe((res: string) => {
                    this.userMsg.error(res);
                  });
                }

                // this.userMsg.error('NEDSS.COMMO.' + msg);


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
    this.deviceCategoryService
      .updateDeviceCategory(this.deviceCategory)
      .subscribe(
        (response: any) => {
          if (response?.statusCode == 500) {
            //this.userMsg.error(res);

            // this.translateService
            //   .get('NEDSS.COMMON.' + response.messages[0])
            //   .subscribe((res: string) => {
            //     this.userMsg.error(res);
            //   });
            // this.translateService
            //   .get('NEDSS.COMMON.SENT_FAILD')
            //   .subscribe((res: string) => {
            //     this.userMsg.error(res);
            //   });
            response.messages.forEach(msg => {
              this.translateService.get('NEDSS.HOME.USERS.ADD_USER.' + msg).subscribe(res => {
                if (msg.includes("Code")) {
                  this.codeValidationMsg = msg;
                  this.translateService.get('NEDSS.COMMON.CODEVALIDATEMSG').subscribe((res: string) => {
                    this.userMsg.error(res);
                  });
                }
                if (msg.includes("Arabic")) {
                  this.ArabicValidationMsg = msg;
                  this.translateService.get('NEDSS.COMMON.ARABICNAMEVALIDATEMSG').subscribe((res: string) => {
                    this.userMsg.error(res);
                  });
                }

                if (msg.includes("English")) {
                  this.EnglishNameValidationMsg = msg;
                  this.translateService.get('NEDSS.COMMON.ENGLISHNAMEVALIDATEMSG').subscribe((res: string) => {
                    this.userMsg.error(res);
                  });
                }

                // this.userMsg.error('NEDSS.COMMO.' + msg);

              });
            });

            return;
          }
          if (response) {
            this.translateService
              .get('NEDSS.COMMON.UPDATE_SUCESSFULLY')
              .subscribe((res: string) => {
                this.userMsg.success(res);
              });
            this.getDeviceCategorys();
            this.deviceCategory = {
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
    if (
      event.order == -1 &&
      this.deviceCategoryFilter.sortOrder != SortOrder.desc
    ) {
      this.deviceCategoryFilter.sortOrder = SortOrder.desc;
      if (typeof event.field === 'string')
        this.deviceCategoryFilter.sortColumn = event.field;
      this.getDeviceCategorys();
    } else if (
      event.order == 1 &&
      this.deviceCategoryFilter.sortOrder != SortOrder.asc
    ) {
      this.deviceCategoryFilter.sortOrder = SortOrder.asc;
      if (typeof event.field === 'string')
        this.deviceCategoryFilter.sortColumn = event.field;
      this.getDeviceCategorys();
    }
  }
  paginate(event: any) {
    this.first = event.first;
    this.last = event.last;
    //add one as primeng pagination is zero based ,so we convert it to one based to fit with the API
    this.deviceCategoryFilter.pageIndex = event.page;
    this.deviceCategoryFilter.pageSize = event.rows;
    this.getDeviceCategorys();
  }

  delete(id: number) {
    this.deviceCategoryService.deleteDeviceCategory(id).subscribe(
      (result: any) => {
        this.getDeviceCategorys();
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
    this.deviceCategoryFilter.searchText = '';
    this.search();
  }

  nameToDelete(ele) {
    this.underDeleting.id = ele.id;
    this.underDeleting.arabicName = ele.arabicName;
  }
  codeChange() {

    this.codeValidationMsg = '';
  }
  arabicNameChange() {

    this.ArabicValidationMsg = '';
  }
  englishNameChange() {

    this.EnglishNameValidationMsg = '';
  }
}
