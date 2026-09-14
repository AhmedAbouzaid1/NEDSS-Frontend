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
  selector: 'app-disease-lab-checks-result',
  templateUrl: './disease-lab-checks-result.component.html',
  styleUrls: ['./disease-lab-checks-result.component.css'],
})
export class DiseaseLabChecksResultComponent {
  underDeleting = {
    arabicName: '',
    id: null
  };
  diseaseLabChecksResult = {
    id: null,
    code: null,
    arabicName: null,
    englishName: null,
  };
  diseaseLabChecksResults!: any[];
  diseaseLabChecksResultFilter = {
    pageSize: 10,
    pageIndex: 0,
    sortColumn: 'code',
    sortOrder: 'desc',
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
    private diseaseLabChecksResultService: LookupsGetterService,
    private translateService: TranslateService,
    private userMsg: UserMessageService
  ) { }

  ngOnInit() {
    this.getDiseaseLabChecksResults();
  }

  search() {
    this.first = 0;
    this.diseaseLabChecksResultFilter.pageIndex = 0;
    this.last =
      this.diseaseLabChecksResultFilter.pageIndex *
      this.diseaseLabChecksResultFilter.pageSize;
    this.diseaseLabChecksResultFilter.code = this.diseaseLabChecksResult.code;
    this.diseaseLabChecksResultFilter.arabicName = this.diseaseLabChecksResult.arabicName;
    this.diseaseLabChecksResultFilter.englishName = this.diseaseLabChecksResult.englishName;
    this.getDiseaseLabChecksResults();
  }

  getDiseaseLabChecksResults() {
    this.loadingPanel = true;
    this.diseaseLabChecksResultService
      .getPageDiseaseLabTestResults(this.diseaseLabChecksResultFilter)
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.diseaseLabChecksResults = result.data;
            if (
              this.diseaseLabChecksResults != undefined &&
              this.diseaseLabChecksResults.length == 0
            ) {
              this.noData = true;
              this.pages = 0;
            } else {
              this.noData = false;
              this.pages = result.data[0].totalCount;
              this.last =
                this.diseaseLabChecksResultFilter.pageIndex *
                this.diseaseLabChecksResultFilter.pageSize;
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
    this.diseaseLabChecksResultService
      .getDiseaseLabTestResultById(id)
      .subscribe(
        (result: any) => {
          document.getElementById("disease-lab-check-res").scrollIntoView({ behavior: 'smooth' });
          this.diseaseLabChecksResult = result.data;
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
    if (this.diseaseLabChecksResult.id == null) {
      this.diseaseLabChecksResultService
        .addDiseaseLabTestResult(this.diseaseLabChecksResult)
        .subscribe(
          (response: any) => {
            if (response) {
              this.translateService
                .get('NEDSS.COMMON.SENT_SUCESSFULLY')
                .subscribe((res: string) => {
                  this.userMsg.success(res);
                });
              this.getDiseaseLabChecksResults();
              this.diseaseLabChecksResult = {
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
    this.diseaseLabChecksResultService
      .updateDiseaseLabTestResult(this.diseaseLabChecksResult)
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
            this.getDiseaseLabChecksResults();
            this.diseaseLabChecksResult = {
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
      this.diseaseLabChecksResultFilter.sortOrder != SortOrder.desc
    ) {
      this.diseaseLabChecksResultFilter.sortOrder = SortOrder.desc;
      if (typeof event.field === 'string')
        this.diseaseLabChecksResultFilter.sortColumn = event.field;
      this.getDiseaseLabChecksResults();
    } else if (
      event.order == 1 &&
      this.diseaseLabChecksResultFilter.sortOrder != SortOrder.asc
    ) {
      this.diseaseLabChecksResultFilter.sortOrder = SortOrder.asc;
      if (typeof event.field === 'string')
        this.diseaseLabChecksResultFilter.sortColumn = event.field;
      this.getDiseaseLabChecksResults();
    }
  }
  paginate(event: any) {
    this.first = event.first;
    this.last = event.last;
    this.diseaseLabChecksResultFilter.pageIndex = event.page;
    this.diseaseLabChecksResultFilter.pageSize = event.rows;
    this.getDiseaseLabChecksResults();
  }

  delete(id: number) {
    this.diseaseLabChecksResultService.deleteDiseaseLabTestResult(id).subscribe(
      (result: any) => {
        this.getDiseaseLabChecksResults();
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
    this.diseaseLabChecksResultFilter.searchText = '';
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
