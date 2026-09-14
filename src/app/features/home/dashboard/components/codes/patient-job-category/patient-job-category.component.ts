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
  selector: 'app-patient-job-category',
  templateUrl: './patient-job-category.component.html',
  styleUrls: ['./patient-job-category.component.css'],
})
export class PatientJobCategoryComponent {
  underDeleting = {
    arabicName: '',
    id: null
  };
  patientJobCategory = {
    id: null,
    code: null,
    arabicName: null,
    englishName: null,
  };
  patientJobCategorys!: any[];
  patientJobCategoryFilter = {
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
    private patientJobCategoryService: LookupsGetterService,
    private translateService: TranslateService,
    private userMsg: UserMessageService
  ) { }

  ngOnInit() {
    this.getPatientJobCategorys();
  }

  search() {
    this.first = 0;
    this.patientJobCategoryFilter.pageIndex = 0;
    this.last =
      this.patientJobCategoryFilter.pageIndex *
      this.patientJobCategoryFilter.pageSize;
    this.patientJobCategoryFilter.code = this.patientJobCategory.code;
    this.patientJobCategoryFilter.arabicName = this.patientJobCategory.arabicName;
    this.patientJobCategoryFilter.englishName = this.patientJobCategory.englishName;
    this.getPatientJobCategorys();
  }

  getPatientJobCategorys() {
    this.loadingPanel = true;
    this.patientJobCategoryService
      .getPagePatientJobCategorys(this.patientJobCategoryFilter)
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.patientJobCategorys = result.data;
            if (
              this.patientJobCategorys != undefined &&
              this.patientJobCategorys.length == 0
            ) {
              this.noData = true;
              this.pages = 0;
            } else {
              this.noData = false;
              this.pages = result.data[0].totalCount;
              this.last =
                this.patientJobCategoryFilter.pageIndex *
                this.patientJobCategoryFilter.pageSize;
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
    this.patientJobCategoryService.getPatientJobCategoryById(id).subscribe(
      (result: any) => {
        document.getElementById("patientJobCat").scrollIntoView({ behavior: 'smooth' });
        this.patientJobCategory = result.data;
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

    if (this.patientJobCategory.id == null) {
      this.patientJobCategoryService
        .addPatientJobCategory(this.patientJobCategory)
        .subscribe(
          (response: any) => {

            if (response) {
              this.translateService
                .get('NEDSS.COMMON.SENT_SUCESSFULLY')
                .subscribe((res: string) => {
                  this.userMsg.success(res);
                });
              this.getPatientJobCategorys();
              this.patientJobCategory = {
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
    this.patientJobCategoryService
      .updatePatientJobCategory(this.patientJobCategory)
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
            this.getPatientJobCategorys();
            this.patientJobCategory = {
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

                if (res.includes("Code")) {
                  this.codeValidationMsg = res;
                }
                if (res.includes("Arabic")) {
                  this.ArabicValidationMsg = res;
                }

                if (res.includes("English")) {
                  this.EnglishNameValidationMsg = res;
                }
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
      this.patientJobCategoryFilter.sortOrder != SortOrder.desc
    ) {
      this.patientJobCategoryFilter.sortOrder = SortOrder.desc;
      if (typeof event.field === 'string')
        this.patientJobCategoryFilter.sortColumn = event.field;
      this.getPatientJobCategorys();
    } else if (
      event.order == 1 &&
      this.patientJobCategoryFilter.sortOrder != SortOrder.asc
    ) {
      this.patientJobCategoryFilter.sortOrder = SortOrder.asc;
      if (typeof event.field === 'string')
        this.patientJobCategoryFilter.sortColumn = event.field;
      this.getPatientJobCategorys();
    }
  }
  paginate(event: any) {
    this.first = event.first;
    this.last = event.last;
    //add one as primeng pagination is zero based ,so we convert it to one based to fit with the API
    this.patientJobCategoryFilter.pageIndex = event.page;
    this.patientJobCategoryFilter.pageSize = event.rows;
    this.getPatientJobCategorys();
  }

  delete(id: number) {
    this.patientJobCategoryService.deletePatientJobCategory(id).subscribe(
      (result: any) => {
        this.getPatientJobCategorys();
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
    this.patientJobCategoryFilter.searchText = '';
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
