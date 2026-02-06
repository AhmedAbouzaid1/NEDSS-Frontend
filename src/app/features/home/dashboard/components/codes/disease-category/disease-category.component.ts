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
  selector: 'app-disease-category',
  templateUrl: './disease-category.component.html',
  styleUrls: ['./disease-category.component.css'],
})
export class DiseaseCategoryComponent {
  underDeleting = {
    arabicName: '',
    id: null
  };
  diseaseCategory = {
    id: null,
    code: null,
    arabicName: null,
    englishName: null,
  };
  diseaseCategorys!: any[];
  diseaseCategoryFilter = {
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

  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;

  constructor(
    private diseaseCategoryService: LookupsGetterService,
    private translateService: TranslateService,
    private userMsg: UserMessageService
  ) { }

  ngOnInit() {
    this.getDiseaseCategorys();
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
    this.diseaseCategoryFilter.pageIndex = 0;
    this.last = this.diseaseCategoryFilter.pageIndex * this.diseaseCategoryFilter.pageSize;
    this.diseaseCategoryFilter.code = this.diseaseCategory.code;
    this.diseaseCategoryFilter.arabicName = this.diseaseCategory.arabicName;
    this.diseaseCategoryFilter.englishName = this.diseaseCategory.englishName;

    this.getDiseaseCategorys();
  }

  getDiseaseCategorys() {
    this.loadingPanel = true;
    this.diseaseCategoryService
      .getPageDiseaseCategorys(this.diseaseCategoryFilter)
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.diseaseCategorys = result.data;
            if (
              this.diseaseCategorys != undefined &&
              this.diseaseCategorys.length == 0
            ) {
              this.noData = true;
              this.pages = 0;
            } else {
              this.noData = false;
              this.pages = result.data[0].totalCount;
              this.last =
                this.diseaseCategoryFilter.pageIndex *
                this.diseaseCategoryFilter.pageSize;
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
    this.diseaseCategoryService.getDiseaseCategoryById(id).subscribe(
      (result: any) => {
        document.getElementById("diseas-cat").scrollIntoView({ behavior: 'smooth' });
        this.diseaseCategory = result.data;
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
    if (this.diseaseCategory.id == null) {
      this.diseaseCategoryService
        .addDiseaseCategory(this.diseaseCategory)
        .subscribe(
          (response: any) => {
            if (response) {
              this.translateService
                .get('NEDSS.COMMON.SENT_SUCESSFULLY')
                .subscribe((res: string) => {
                  this.userMsg.success(res);
                });
              this.getDiseaseCategorys();
              this.diseaseCategory = {
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
    this.diseaseCategoryService
      .updateDiseaseCategory(this.diseaseCategory)
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
            this.getDiseaseCategorys();
            this.diseaseCategory = {
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
      this.diseaseCategoryFilter.sortOrder != SortOrder.desc
    ) {
      this.diseaseCategoryFilter.sortOrder = SortOrder.desc;
      if (typeof event.field === 'string')
        this.diseaseCategoryFilter.sortColumn = event.field;
      this.getDiseaseCategorys();
    } else if (
      event.order == 1 &&
      this.diseaseCategoryFilter.sortOrder != SortOrder.asc
    ) {
      this.diseaseCategoryFilter.sortOrder = SortOrder.asc;
      if (typeof event.field === 'string')
        this.diseaseCategoryFilter.sortColumn = event.field;
      this.getDiseaseCategorys();
    }
  }
  paginate(event: any) {
    this.first = event.first;
    this.last = event.last;
    //add one as primeng pagination is zero based ,so we convert it to one based to fit with the API
    this.diseaseCategoryFilter.pageIndex = event.page;
    this.diseaseCategoryFilter.pageSize = event.rows;
    this.getDiseaseCategorys();
  }

  delete(id: number) {
    this.diseaseCategoryService.deleteDiseaseCategory(id).subscribe(
      (result: any) => {
        this.getDiseaseCategorys();
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
    this.diseaseCategoryFilter.searchText = '';
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
