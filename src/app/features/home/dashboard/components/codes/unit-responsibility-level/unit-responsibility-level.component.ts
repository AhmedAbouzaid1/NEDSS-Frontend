import { Component, ElementRef, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SortEvent } from 'primeng/api';
import { fromEvent, map, debounceTime, distinctUntilChanged } from 'rxjs';
import { SortOrder } from 'src/app/core/constants';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-unit-responsibility-level',
  templateUrl: './unit-responsibility-level.component.html',
  styleUrls: ['./unit-responsibility-level.component.css'],
})
export class UnitResponsibilityLevelComponent {
  underDeleting = {
    arabicName: '',
    id: null
  };
  unitResponsibilityLevel = {
    id: null,
    code: null,
    arabicName: null,
    englishName: null,
  };
  unitResponsibilityLevels!: any[];
  unitResponsibilityLevelFilter = {
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
    private unitResponsibilityLevelService: LookupsGetterService,
    private translateService: TranslateService,
    private userMsg: UserMessageService
  ) { }

  ngOnInit() {
    this.getUnitResponsibilityLevels();
  }

  search() {
    this.first = 0;
    this.unitResponsibilityLevelFilter.pageIndex = 0;
    this.last =
      this.unitResponsibilityLevelFilter.pageIndex *
      this.unitResponsibilityLevelFilter.pageSize;
    this.unitResponsibilityLevelFilter.code = this.unitResponsibilityLevel.code;
    this.unitResponsibilityLevelFilter.arabicName = this.unitResponsibilityLevel.arabicName;
    this.unitResponsibilityLevelFilter.englishName = this.unitResponsibilityLevel.englishName;
    this.getUnitResponsibilityLevels();
  }

  getUnitResponsibilityLevels() {
    this.loadingPanel = true;
    this.unitResponsibilityLevelService
      .getPageUnitResponsibilityLevels(this.unitResponsibilityLevelFilter)
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.unitResponsibilityLevels = result.data;
            if (
              this.unitResponsibilityLevels != undefined &&
              this.unitResponsibilityLevels.length == 0
            ) {
              this.noData = true;
              this.pages = 0;
            } else {
              this.noData = false;
              this.pages = result.data[0].totalCount;
              this.last =
                this.unitResponsibilityLevelFilter.pageIndex *
                this.unitResponsibilityLevelFilter.pageSize;
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
    this.unitResponsibilityLevelService
      .getUnitResponsibilityLevelById(id)
      .subscribe(
        (result: any) => {
          document.getElementById("unit-res").scrollIntoView({ behavior: 'smooth' });
          this.unitResponsibilityLevel = result.data;
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
    if (this.unitResponsibilityLevel.id == null) {
      this.unitResponsibilityLevelService
        .addUnitResponsibilityLevel(this.unitResponsibilityLevel)
        .subscribe(
          (response: any) => {
            if (response) {
              this.translateService
                .get('NEDSS.COMMON.SENT_SUCESSFULLY')
                .subscribe((res: string) => {
                  this.userMsg.success(res);
                });
              this.getUnitResponsibilityLevels();
              this.unitResponsibilityLevel = {
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
              // this.translateService
              //   .get('NEDSS.COMMON.' + error.error.messages[0])
              //   .subscribe((res: string) => {
              //     this.userMsg.error(res);
              //     if (res.includes("Code")) {
              //       this.codeValidationMsg = res;
              //     }
              //     if (res.includes("Arabic")) {
              //       this.ArabicValidationMsg = res;
              //     }

              //     if (res.includes("English")) {
              //       this.EnglishNameValidationMsg = res;
              //     }


              //   });
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
    this.unitResponsibilityLevelService
      .updateUnitResponsibilityLevel(this.unitResponsibilityLevel)
      .subscribe(
        (response: any) => {
          if (response) {
            this.translateService
              .get('NEDSS.COMMON.UPDATE_SUCESSFULLY')
              .subscribe((res: string) => {
                this.userMsg.success(res);
              });
            this.getUnitResponsibilityLevels();
            this.unitResponsibilityLevel = {
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
      this.unitResponsibilityLevelFilter.sortOrder != SortOrder.desc
    ) {
      this.unitResponsibilityLevelFilter.sortOrder = SortOrder.desc;
      if (typeof event.field === 'string')
        this.unitResponsibilityLevelFilter.sortColumn = event.field;
      this.getUnitResponsibilityLevels();
    } else if (
      event.order == 1 &&
      this.unitResponsibilityLevelFilter.sortOrder != SortOrder.asc
    ) {
      this.unitResponsibilityLevelFilter.sortOrder = SortOrder.asc;
      if (typeof event.field === 'string')
        this.unitResponsibilityLevelFilter.sortColumn = event.field;
      this.getUnitResponsibilityLevels();
    }
  }
  paginate(event: any) {
    this.first = event.first;
    this.last = event.last;
    this.unitResponsibilityLevelFilter.pageIndex = event.page;
    this.unitResponsibilityLevelFilter.pageSize = event.rows;
    this.getUnitResponsibilityLevels();
  }

  delete(id: number) {
    this.unitResponsibilityLevelService
      .deleteUnitResponsibilityLevel(id)
      .subscribe(
        (result: any) => {
          this.getUnitResponsibilityLevels();
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
    this.unitResponsibilityLevelFilter.searchText = '';
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
