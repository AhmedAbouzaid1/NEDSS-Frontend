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
  selector: 'app-lab-places',
  templateUrl: './lab-places.component.html',
  styleUrls: ['./lab-places.component.css'],
})
export class LabPlacesComponent {
  underDeleting = {
    arabicName: '',
    id: null
  };
  labPlace = {
    id: null,
    code: null,
    arabicName: null,
    englishName: null,
  };
  labPlaces!: any[];
  labPlaceFilter = {
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
    private labPlaceService: LookupsGetterService,
    private translateService: TranslateService,
    private userMsg: UserMessageService
  ) { }

  ngOnInit() {
    this.getLabPlaces();
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
    this.labPlaceFilter.pageIndex = 0;
    this.last = this.labPlaceFilter.pageIndex * this.labPlaceFilter.pageSize;
    this.labPlaceFilter.code = this.labPlace.code;
    this.labPlaceFilter.arabicName = this.labPlace.arabicName;
    this.labPlaceFilter.englishName = this.labPlace.englishName;
    this.getLabPlaces();
  }

  getLabPlaces() {
    this.loadingPanel = true;
    this.labPlaceService.getPageLabPlaces(this.labPlaceFilter).subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.labPlaces = result.data;
          if (this.labPlaces != undefined && this.labPlaces.length == 0) {
            this.noData = true;
            this.pages = 0;
          } else {
            this.noData = false;
            this.pages = result.data[0].totalCount;
            this.last =
              this.labPlaceFilter.pageIndex * this.labPlaceFilter.pageSize;
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
    this.labPlaceService.getLabPlaceById(id).subscribe(
      (result: any) => {
        document.getElementById("lab-place").scrollIntoView({ behavior: 'smooth' });
        this.labPlace = result.data;
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
    if (this.labPlace.id == null) {
      this.labPlaceService.addLabPlace(this.labPlace).subscribe(
        (response: any) => {
          if (response) {
            this.translateService
              .get('NEDSS.COMMON.SENT_SUCESSFULLY')
              .subscribe((res: string) => {
                this.userMsg.success(res);
              });
            this.getLabPlaces();
            this.labPlace = {
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
    this.labPlaceService.updateLabPlace(this.labPlace).subscribe(
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
          this.getLabPlaces();
          this.labPlace = {
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
    if (event.order == -1 && this.labPlaceFilter.sortOrder != SortOrder.desc) {
      this.labPlaceFilter.sortOrder = SortOrder.desc;
      if (typeof event.field === 'string')
        this.labPlaceFilter.sortColumn = event.field;
      this.getLabPlaces();
    } else if (
      event.order == 1 &&
      this.labPlaceFilter.sortOrder != SortOrder.asc
    ) {
      this.labPlaceFilter.sortOrder = SortOrder.asc;
      if (typeof event.field === 'string')
        this.labPlaceFilter.sortColumn = event.field;
      this.getLabPlaces();
    }
  }
  paginate(event: any) {
    this.first = event.first;
    this.last = event.last;
    this.labPlaceFilter.pageIndex = event.page;
    this.labPlaceFilter.pageSize = event.rows;
    this.getLabPlaces();
  }

  delete(id: number) {
    this.labPlaceService.deleteLabPlace(id).subscribe(
      (result: any) => {
        this.getLabPlaces();
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
    this.labPlaceFilter.searchText = '';
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
