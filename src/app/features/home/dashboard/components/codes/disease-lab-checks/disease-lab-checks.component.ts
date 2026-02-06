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
  selector: 'app-disease-lab-checks',
  templateUrl: './disease-lab-checks.component.html',
  styleUrls: ['./disease-lab-checks.component.css'],
})
export class DiseaseLabChecksComponent {
  underDeleting = {
    arabicName: '',
    id: null
  };
  diseaseLabCheck = {
    id: null,
    code: null,
    arabicName: null,
    englishName: null,
  };
  diseaseLabChecks!: any[];
  diseaseLabCheckFilter = {
    pageSize: 10,
    pageIndex: 0,
    sortColumn: '',
    sortOrder: '',
    searchText: '',
    code: "",
    arabicName: "",
    englishName: ""
  };
  noData: boolean = true;
  loadingPanel: boolean = false;
  first: number = 0;
  last: number = 0;
  pages: number = 0;
  codeValidationMsg: string = '';
  ArabicValidationMsg: string = '';
  EnglishNameValidationMsg: string = '';
  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;

  constructor(
    private diseaseLabCheckService: LookupsGetterService,
    private translateService: TranslateService,
    private userMsg: UserMessageService
  ) { }

  ngOnInit() {
    this.getDiseaseLabTests();
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

  search() {
    this.first = 0;
    this.diseaseLabCheckFilter.pageIndex = 0;
    this.last =
      this.diseaseLabCheckFilter.pageIndex *
      this.diseaseLabCheckFilter.pageSize;
    this.diseaseLabCheckFilter.code = this.diseaseLabCheck.code;
    this.diseaseLabCheckFilter.arabicName = this.diseaseLabCheck.arabicName;
    this.diseaseLabCheckFilter.englishName = this.diseaseLabCheck.englishName;
    this.getDiseaseLabTests();
  }

  getDiseaseLabTests() {
    this.loadingPanel = true;
    this.diseaseLabCheckService
      .getPageDiseaseLabTests(this.diseaseLabCheckFilter)
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.diseaseLabChecks = result.data;
            if (
              this.diseaseLabChecks != undefined &&
              this.diseaseLabChecks.length == 0
            ) {
              this.noData = true;
              this.pages = 0;
            } else {
              this.noData = false;
              this.pages = result.data[0].totalCount;
              this.last =
                this.diseaseLabCheckFilter.pageIndex *
                this.diseaseLabCheckFilter.pageSize;
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
    this.diseaseLabCheckService.getDiseaseLabTestById(id).subscribe(
      (result: any) => {
        document.getElementById("disease-lab-check").scrollIntoView({ behavior: 'smooth' });
        this.diseaseLabCheck = result.data;
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
    if (this.diseaseLabCheck.id == null) {
      this.diseaseLabCheckService
        .addDiseaseLabTest(this.diseaseLabCheck)
        .subscribe(
          (response: any) => {
            if (response) {
              this.translateService
                .get('NEDSS.COMMON.SENT_SUCESSFULLY')
                .subscribe((res: string) => {
                  this.userMsg.success(res);
                });
              this.getDiseaseLabTests();
              this.diseaseLabCheck = {
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
    this.diseaseLabCheckService
      .updateDiseaseLabTest(this.diseaseLabCheck)
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
            this.getDiseaseLabTests();
            this.diseaseLabCheck = {
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
      this.diseaseLabCheckFilter.sortOrder != SortOrder.desc
    ) {
      this.diseaseLabCheckFilter.sortOrder = SortOrder.desc;
      if (typeof event.field === 'string')
        this.diseaseLabCheckFilter.sortColumn = event.field;
      this.getDiseaseLabTests();
    } else if (
      event.order == 1 &&
      this.diseaseLabCheckFilter.sortOrder != SortOrder.asc
    ) {
      this.diseaseLabCheckFilter.sortOrder = SortOrder.asc;
      if (typeof event.field === 'string')
        this.diseaseLabCheckFilter.sortColumn = event.field;
      this.getDiseaseLabTests();
    }
  }
  paginate(event: any) {
    this.first = event.first;
    this.last = event.last;
    this.diseaseLabCheckFilter.pageIndex = event.page;
    this.diseaseLabCheckFilter.pageSize = event.rows;
    this.getDiseaseLabTests();
  }

  delete(id: number) {
    this.diseaseLabCheckService.deleteDiseaseLabTest(id).subscribe(
      (result: any) => {
        this.getDiseaseLabTests();
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
    this.diseaseLabCheckFilter.searchText = '';
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
