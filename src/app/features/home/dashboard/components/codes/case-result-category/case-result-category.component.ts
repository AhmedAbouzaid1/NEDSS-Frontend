import { Component, ElementRef, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SortEvent } from 'primeng/api';
import { fromEvent, map, debounceTime, distinctUntilChanged } from 'rxjs';
import { SortOrder } from 'src/app/core/constants';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-case-result-category',
  templateUrl: './case-result-category.component.html',
  styleUrls: ['./case-result-category.component.css'],
})
export class CaseResultCategoryComponent {
  underDeleting = {
    arabicName: '',
    id: null
  };
  caseResultCategory = {
    id: null,
    code: null,
    arabicName: null,
    englishName: null,
  };
  caseResultCategorys!: any[];
  citys!: any[];
  caseResultCategoryFilter = {
    pageSize: 10,
    pageIndex: 0,
    sortColumn: '',
    sortOrder: '',
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
  savebtn: boolean = false;

  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;

  constructor(
    private caseResultCategoryService: LookupsGetterService,
    private translateService: TranslateService,
    private userMsg: UserMessageService
  ) { }

  ngOnInit() {
    this.getCaseResultCategorys();
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
    this.caseResultCategoryService.getAllCitys().subscribe(
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
    this.caseResultCategoryFilter.pageIndex = 0;
    this.last =
      this.caseResultCategoryFilter.pageIndex *
      this.caseResultCategoryFilter.pageSize;
    this.caseResultCategoryFilter.code = this.caseResultCategory.code;
    this.caseResultCategoryFilter.arabicName = this.caseResultCategory.arabicName;
    this.caseResultCategoryFilter.englishName = this.caseResultCategory.englishName;

    this.getCaseResultCategorys();
  }

  getCaseResultCategorys() {
    this.loadingPanel = true;
    this.caseResultCategoryService
      .getPageCaseResultCategorys(this.caseResultCategoryFilter)
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.caseResultCategorys = result.data;
            if (
              this.caseResultCategorys != undefined &&
              this.caseResultCategorys.length == 0
            ) {
              this.noData = true;
              this.pages = 0;
            } else {
              this.noData = false;
              this.pages = result.data[0].totalCount;
              this.last =
                this.caseResultCategoryFilter.pageIndex *
                this.caseResultCategoryFilter.pageSize;
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
    this.caseResultCategoryService.getCaseResultCategoryById(id).subscribe(
      (result: any) => {
        this.caseResultCategory = result.data;
        document.getElementById("caseRes").scrollIntoView({ behavior: 'smooth' });
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
    if (this.caseResultCategory.id == null) {
      this.caseResultCategoryService
        .addCaseResultCategory(this.caseResultCategory)
        .subscribe(
          (response: any) => {
            if (response) {
              this.translateService
                .get('NEDSS.COMMON.SENT_SUCESSFULLY')
                .subscribe((res: string) => {
                  this.userMsg.success(res);
                });
              this.getCaseResultCategorys();
              this.caseResultCategory = {
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
      this.savebtn = true;

    } else this.update();
  }

  update() {
    this.caseResultCategoryService
      .updateCaseResultCategory(this.caseResultCategory)
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
            this.getCaseResultCategorys();
            this.caseResultCategory = {
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
      this.caseResultCategoryFilter.sortOrder != SortOrder.desc
    ) {
      this.caseResultCategoryFilter.sortOrder = SortOrder.desc;
      if (typeof event.field === 'string')
        this.caseResultCategoryFilter.sortColumn = event.field;
      this.getCaseResultCategorys();
    } else if (
      event.order == 1 &&
      this.caseResultCategoryFilter.sortOrder != SortOrder.asc
    ) {
      this.caseResultCategoryFilter.sortOrder = SortOrder.asc;
      if (typeof event.field === 'string')
        this.caseResultCategoryFilter.sortColumn = event.field;
      this.getCaseResultCategorys();
    }
  }
  paginate(event: any) {
    this.first = event.first;
    this.last = event.last;
    this.caseResultCategoryFilter.pageIndex = event.page;
    this.caseResultCategoryFilter.pageSize = event.rows;
    this.getCaseResultCategorys();
  }

  delete(id: number) {
    this.caseResultCategoryService.deleteCaseResultCategory(id).subscribe(
      (result: any) => {
        this.getCaseResultCategorys();
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
    this.caseResultCategoryFilter.searchText = '';
    this.search();
  }

  nameToDelete(ele) {
    this.underDeleting.id = ele.id;
    this.underDeleting.arabicName = ele.arabicName;
  }

  hidColName: boolean = false;
  hidColFather: boolean = false;
  hidColAdress: boolean = false;
  hidColDate: boolean = false;
  hidColdeport: boolean = false;
  hidColDetals: boolean = false;

  toHidColName() {
    this.hidColName = !this.hidColName
  }
  toHhidColFather() {
    this.hidColFather = !this.hidColFather
  }
  toHidColAdress() {
    this.hidColAdress = !this.hidColAdress
  }
  toHidColDate() {
    this.hidColDate = !this.hidColDate
  }
  toHidColdeport() {
    this.hidColdeport = !this.hidColdeport
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
