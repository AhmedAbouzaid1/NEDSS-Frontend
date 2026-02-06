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
  selector: 'app-disease-group',
  templateUrl: './disease-group.component.html',
  styleUrls: ['./disease-group.component.css'],
})
export class DiseaseGroupComponent {
  underDeleting = {
    arabicName: '',
    id: null
  };
  diseaseGroup = {
    id: null,
    code: null,
    arabicName: null,
    englishName: null,
    isSentinel: false,
  };
  diseaseGroups!: any[];
  diseaseGroupFilter = {
    pageSize: 10,
    pageIndex: 0,
    sortColumn: '',
    sortOrder: '',
    searchText: '',
    code: "",
    arabicName: "",
    englishName: "",
    isSentinel: false,
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
    private diseaseGroupService: LookupsGetterService,
    private translateService: TranslateService,
    private userMsg: UserMessageService
  ) { }

  ngOnInit() {
    this.getDiseaseGroups();
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
    this.diseaseGroupFilter.pageIndex = 0;
    this.last =
      this.diseaseGroupFilter.pageIndex * this.diseaseGroupFilter.pageSize;
    this.diseaseGroupFilter.code = this.diseaseGroup.code;
    this.diseaseGroupFilter.arabicName = this.diseaseGroup.arabicName;
    this.diseaseGroupFilter.englishName = this.diseaseGroup.englishName;
    this.diseaseGroupFilter.isSentinel = this.diseaseGroup.isSentinel;
    this.getDiseaseGroups();
  }

  getDiseaseGroups() {
    this.loadingPanel = true;
    this.diseaseGroupService
      .getPageDiseaseGroups(this.diseaseGroupFilter)
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.diseaseGroups = result.data;
            if (
              this.diseaseGroups != undefined &&
              this.diseaseGroups.length == 0
            ) {
              this.noData = true;
              this.pages = 0;
            } else {
              this.noData = false;
              this.pages = result.data[0].totalCount;
              this.last =
                this.diseaseGroupFilter.pageIndex *
                this.diseaseGroupFilter.pageSize;
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
    this.diseaseGroupService.getDiseaseGroupById(id).subscribe(
      (result: any) => {
        document.getElementById("diseas-gro").scrollIntoView({ behavior: 'smooth' });
        this.diseaseGroup = result.data;
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
    if (this.diseaseGroup.id == null) {
      this.diseaseGroupService.addDiseaseGroup(this.diseaseGroup).subscribe(
        (response: any) => {
          if (response) {
            this.translateService
              .get('NEDSS.COMMON.SENT_SUCESSFULLY')
              .subscribe((res: string) => {
                this.userMsg.success(res);
              });
            this.getDiseaseGroups();
            this.diseaseGroup = {
              id: null,
              code: null,
              arabicName: null,
              englishName: null,
              isSentinel: false,
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
    this.diseaseGroupService.updateDiseaseGroup(this.diseaseGroup).subscribe(
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
          this.getDiseaseGroups();
          this.diseaseGroup = {
            id: null,
            code: null,
            arabicName: null,
            englishName: null,
            isSentinel: false,
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
      this.diseaseGroupFilter.sortOrder != SortOrder.desc
    ) {
      this.diseaseGroupFilter.sortOrder = SortOrder.desc;
      if (typeof event.field === 'string')
        this.diseaseGroupFilter.sortColumn = event.field;
      this.getDiseaseGroups();
    } else if (
      event.order == 1 &&
      this.diseaseGroupFilter.sortOrder != SortOrder.asc
    ) {
      this.diseaseGroupFilter.sortOrder = SortOrder.asc;
      if (typeof event.field === 'string')
        this.diseaseGroupFilter.sortColumn = event.field;
      this.getDiseaseGroups();
    }
  }
  paginate(event: any) {
    this.first = event.first;
    this.last = event.last;
    this.diseaseGroupFilter.pageIndex = event.page;
    this.diseaseGroupFilter.pageSize = event.rows;
    this.getDiseaseGroups();
  }

  delete(id: number) {
    this.diseaseGroupService.deleteDiseaseGroup(id).subscribe(
      (result: any) => {
        this.getDiseaseGroups();
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
    this.diseaseGroupFilter.searchText = '';
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
