import { Component, ElementRef, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SortEvent } from 'primeng/api';
import { fromEvent, map, debounceTime, distinctUntilChanged } from 'rxjs';
import { SortOrder } from 'src/app/core/constants';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-nationality',
  templateUrl: './nationality.component.html',
  styleUrls: ['./nationality.component.css'],
})
export class NationalityComponent {
  underDeleting = {
    arabicName: '',
    id: null
  };
  nationality = {
    id: null,
    code: null,
    arabicName: null,
    englishName: null,
  };
  nationalitys!: any[];
  citys!: any[];
  nationalityFilter = {
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
    private nationalityService: LookupsGetterService,
    private translateService: TranslateService,
    private userMsg: UserMessageService
  ) { }

  ngOnInit() {
    this.getNationalitys();
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
    this.nationalityFilter.pageIndex = 0;
    this.last =
      this.nationalityFilter.pageIndex * this.nationalityFilter.pageSize;
    this.nationalityFilter.code = this.nationality.code;
    this.nationalityFilter.arabicName = this.nationality.arabicName;
    this.nationalityFilter.englishName = this.nationality.englishName;

    this.getNationalitys();
  }

  getNationalitys() {
    this.loadingPanel = true;
    this.nationalityService
      .getPageNationalitys(this.nationalityFilter)
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.nationalitys = result.data;
            if (
              this.nationalitys != undefined &&
              this.nationalitys.length == 0
            ) {
              this.noData = true;
              this.pages = 0;
            } else {
              this.noData = false;
              this.pages = result.data[0].totalCount;
              this.last =
                this.nationalityFilter.pageIndex *
                this.nationalityFilter.pageSize;
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
    this.nationalityService.getNationalityById(id).subscribe(
      (result: any) => {
        document.getElementById("nationlt").scrollIntoView({ behavior: 'smooth' });
        this.nationality = result.data;
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
    if (this.nationality.id == null) {
      this.nationalityService.addNationality(this.nationality).subscribe(
        (response: any) => {
          if (response) {
            this.translateService
              .get('NEDSS.COMMON.SENT_SUCESSFULLY')
              .subscribe((res: string) => {
                this.userMsg.success(res);
              });
            this.getNationalitys();
            this.nationality = {
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
    this.nationalityService.updateNationality(this.nationality).subscribe(
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
          this.getNationalitys();
          this.nationality = {
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
            .get('NEDSS.COMMON.UPDATE_FAILD')
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
      this.nationalityFilter.sortOrder != SortOrder.desc
    ) {
      this.nationalityFilter.sortOrder = SortOrder.desc;
      if (typeof event.field === 'string')
        this.nationalityFilter.sortColumn = event.field;
      this.getNationalitys();
    } else if (
      event.order == 1 &&
      this.nationalityFilter.sortOrder != SortOrder.asc
    ) {
      this.nationalityFilter.sortOrder = SortOrder.asc;
      if (typeof event.field === 'string')
        this.nationalityFilter.sortColumn = event.field;
      this.getNationalitys();
    }
  }
  paginate(event: any) {
    this.first = event.first;
    this.last = event.last;
    this.nationalityFilter.pageIndex = event.page;
    this.nationalityFilter.pageSize = event.rows;
    this.getNationalitys();
  }

  delete(id: number) {
    this.nationalityService.deleteNationality(id).subscribe(
      (result: any) => {
        this.getNationalitys();
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
    this.nationalityFilter.searchText = '';
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
