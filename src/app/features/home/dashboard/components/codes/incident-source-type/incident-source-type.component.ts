import { Component, ElementRef, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SortEvent } from 'primeng/api';
import { fromEvent, map, debounceTime, distinctUntilChanged } from 'rxjs';
import { SortOrder } from 'src/app/core/constants';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-incident-source-type',
  templateUrl: './incident-source-type.component.html',
  styleUrls: ['./incident-source-type.component.css']
})
export class IncidentSourceTypeComponent {
  underDeleting = {
    arabicName: '',
    id: null
  };
  incidentSourceType = {
    id: null,
    code: null,
    arabicName: null,
    englishName: null,
  };
  incidentSourceTypes!: any[];
  citys!: any[];
  incidentSourceTypeFilter = {
    pageSize: 10,
    pageIndex: 0,
    sortColumn: 'code',
    sortOrder: 'desc',
    searchText: "",
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
    private incidentSourceTypeService: LookupsGetterService,
    private translateService: TranslateService,
    private userMsg: UserMessageService
  ) { }

  ngOnInit() {
    this.getIncidentSourceHospitalTypes();
  }

  search() {
    this.first = 0;
    this.incidentSourceTypeFilter.pageIndex = 0;
    this.last = this.incidentSourceTypeFilter.pageIndex * this.incidentSourceTypeFilter.pageSize;
    this.incidentSourceTypeFilter.code = this.incidentSourceType.code;
    this.incidentSourceTypeFilter.englishName = this.incidentSourceType.englishName;
    this.incidentSourceTypeFilter.arabicName = this.incidentSourceType.arabicName;

    this.getIncidentSourceHospitalTypes();

  }

  getIncidentSourceHospitalTypes() {
    this.loadingPanel = true;
    this.incidentSourceTypeService
      .getPageIncidentSourceHospitalTypes(this.incidentSourceTypeFilter)
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.incidentSourceTypes = result.data;
            if (
              this.incidentSourceTypes != undefined &&
              this.incidentSourceTypes.length == 0
            ) {
              this.noData = true;
              this.pages = 0;
            } else {
              this.noData = false;
              this.pages = result.data[0].totalCount;
              this.last =
                this.incidentSourceTypeFilter.pageIndex *
                this.incidentSourceTypeFilter.pageSize;
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
    this.incidentSourceTypeService.getIncidentSourceHospitalTypeById(id).subscribe(
      (result: any) => {
        document.getElementById("incident-src").scrollIntoView({ behavior: 'smooth' });
        this.incidentSourceType = result.data;
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
    if (this.incidentSourceType.id == null) {
      this.incidentSourceTypeService.addIncidentSourceHospitalType(this.incidentSourceType).subscribe(

        (response: any) => {

          if (response) {
            this.translateService
              .get('NEDSS.COMMON.SENT_SUCESSFULLY')
              .subscribe((res: string) => {
                this.userMsg.success(res);
              });
            this.getIncidentSourceHospitalTypes();
            this.incidentSourceType = {
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
    } else this.update();
  }

  update() {
    this.incidentSourceTypeService.updateIncidentSourceHospitalType(this.incidentSourceType).subscribe(
      (response: any) => {

        if (response?.statusCode == 500) {

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
          this.getIncidentSourceHospitalTypes();
          this.incidentSourceType = {
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
      this.incidentSourceTypeFilter.sortOrder != SortOrder.desc
    ) {
      this.incidentSourceTypeFilter.sortOrder = SortOrder.desc;
      if (typeof event.field === 'string')
        this.incidentSourceTypeFilter.sortColumn = event.field;
      this.getIncidentSourceHospitalTypes();
    } else if (
      event.order == 1 &&
      this.incidentSourceTypeFilter.sortOrder != SortOrder.asc
    ) {
      this.incidentSourceTypeFilter.sortOrder = SortOrder.asc;
      if (typeof event.field === 'string')
        this.incidentSourceTypeFilter.sortColumn = event.field;
      this.getIncidentSourceHospitalTypes();
    }
  }
  paginate(event: any) {
    this.first = event.first;
    this.last = event.last;
    this.incidentSourceTypeFilter.pageIndex = event.page;
    this.incidentSourceTypeFilter.pageSize = event.rows;
    this.getIncidentSourceHospitalTypes();
  }

  delete(id: number) {
    this.incidentSourceTypeService.deleteIncidentSourceHospitalType(id).subscribe(
      (result: any) => {
        this.getIncidentSourceHospitalTypes();
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
    this.incidentSourceTypeFilter.searchText = '';
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
