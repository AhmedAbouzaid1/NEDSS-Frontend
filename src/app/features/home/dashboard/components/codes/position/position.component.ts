import { Component, ElementRef, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SortEvent } from 'primeng/api';
import { fromEvent, map, debounceTime, distinctUntilChanged } from 'rxjs';
import { SortOrder } from 'src/app/core/constants';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.css']
})
export class PositionComponent {
  underDeleting = {
    arabicName: '',
    id: null
  };
  position = {
    id: null,
    code: null,
    arabicName: null,
    englishName: null,
  };
  positions!: any[];
  citys!: any[];
  positionFilter = {
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
    private positionService: LookupsGetterService,
    private translateService: TranslateService,
    private userMsg: UserMessageService
  ) { }

  ngOnInit() {
    this.getPositions();
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
    this.positionFilter.pageIndex = 0;
    this.last =
      this.positionFilter.pageIndex * this.positionFilter.pageSize;
    this.positionFilter.code = this.position.code;
    this.positionFilter.arabicName = this.position.arabicName;
    this.positionFilter.englishName = this.position.englishName;
    this.getPositions();
  }

  getPositions() {
    this.loadingPanel = true;
    this.positionService
      .getPagePositions(this.positionFilter)
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.positions = result.data;
            if (
              this.positions != undefined &&
              this.positions.length == 0
            ) {
              this.noData = true;
              this.pages = 0;
            } else {
              this.noData = false;
              this.pages = result.data[0].totalCount;
              this.last =
                this.positionFilter.pageIndex *
                this.positionFilter.pageSize;
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
    this.positionService.getPositionById(id).subscribe(
      (result: any) => {
        document.getElementById("positio").scrollIntoView({ behavior: 'smooth' });
        this.position = result.data;
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
    if (this.position.id == null) {
      this.positionService.addPosition(this.position).subscribe(
        (response: any) => {
          if (response) {
            this.translateService
              .get('NEDSS.COMMON.SENT_SUCESSFULLY')
              .subscribe((res: string) => {
                this.userMsg.success(res);
              });
            this.getPositions();
            this.position = {
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
    this.positionService.updatePosition(this.position).subscribe(
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
          this.getPositions();
          this.position = {
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
      this.positionFilter.sortOrder != SortOrder.desc
    ) {
      this.positionFilter.sortOrder = SortOrder.desc;
      if (typeof event.field === 'string')
        this.positionFilter.sortColumn = event.field;
      this.getPositions();
    } else if (
      event.order == 1 &&
      this.positionFilter.sortOrder != SortOrder.asc
    ) {
      this.positionFilter.sortOrder = SortOrder.asc;
      if (typeof event.field === 'string')
        this.positionFilter.sortColumn = event.field;
      this.getPositions();
    }
  }
  paginate(event: any) {
    this.first = event.first;
    this.last = event.last;
    this.positionFilter.pageIndex = event.page;
    this.positionFilter.pageSize = event.rows;
    this.getPositions();
  }

  delete(id: number) {
    this.positionService.deletePosition(id).subscribe(
      (result: any) => {
        this.getPositions();
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
    this.positionFilter.searchText = '';
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
