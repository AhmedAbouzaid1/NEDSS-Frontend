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
  selector: 'app-principality',
  templateUrl: './principality.component.html',
  styleUrls: ['./principality.component.css'],
})
export class PrincipalityComponent {
  underDeleting = {
    arabicName: '',
    id: null
  };
  principality = {
    id: null,
    code: null,
    arabicName: null,
    englishName: null,
    cityID: null,
  };
  principalitys!: any[];
  healthOffices!: any[];
  principalityFilter = {
    pageSize: 10,
    pageIndex: 0,
    sortColumn: '',
    sortOrder: '',
    searchText: '',
    code: "",
    arabicName: "",
    englishName: "",
    cityID: null,
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
    private principalityService: LookupsGetterService,
    private translateService: TranslateService,
    private userMsg: UserMessageService
  ) { }

  ngOnInit() {
    this.getPrincipalitys();
    this.gethealthOffices();
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

  gethealthOffices() {
    this.principalityService.getAllCitys().subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.healthOffices = result.data;
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
    this.principalityFilter.pageIndex = 0;
    this.last = this.principalityFilter.pageIndex * this.principalityFilter.pageSize;
    this.principalityFilter.code = this.principality.code;
    this.principalityFilter.englishName = this.principality.englishName;
    this.principalityFilter.arabicName = this.principality.arabicName;
    this.principalityFilter.cityID = this.principality.cityID;
    this.getPrincipalitys();
  }

  getPrincipalitys() {
    this.loadingPanel = true;
    this.principalityService
      .getPagePrincipalitys(this.principalityFilter)
      .subscribe(
        (result: any) => {
          if (result != null && result != undefined) {
            this.principalitys = result.data;
            if (
              this.principalitys != undefined &&
              this.principalitys.length == 0
            ) {
              this.noData = true;
              this.pages = 0;
            } else {
              this.noData = false;
              this.pages = result.data[0].totalCount;
              this.last =
                this.principalityFilter.pageIndex *
                this.principalityFilter.pageSize;
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
    this.principalityService.getPrincipalityById(id).subscribe(
      (result: any) => {
        document.getElementById("princip").scrollIntoView({ behavior: 'smooth' });
        this.principality = result.data;
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
    if (this.principality.id == null) {
      this.principalityService.addPrincipality(this.principality).subscribe(
        (response: any) => {

          //       if (response) {
          //         this.translateService
          //           .get('NEDSS.COMMON.SENT_SUCESSFULLY')
          //           .subscribe((res: string) => {
          //             this.userMsg.success(res);
          //           });
          // this.getPrincipalitys();
          // this.principality = {
          //   id: null,
          //   code: null,
          //   arabicName: null,
          //   englishName: null,
          //   cityID: null,
          // };
          //       }
          //     },
          //     (error) => {
          //       if (error.error?.messages?.includes("DuplicatedCode") || error?.error?.messages?.includes("DuplicatedEnglishName")
          //         || error.error?.messages?.includes("DuplicatedArabicName")) {
          //         // this.translateService
          //         //   .get('NEDSS.COMMON.' + error.error.messages[0])
          //         //   .subscribe((res: string) => {
          //         //     this.userMsg.error(res);
          //         //   });

          //         error.error.messages.forEach(msg => {
          //           
          //           if (msg.includes("Code")) {
          //             this.codeValidationMsg = msg;
          //             this.translateService.get('NEDSS.COMMON.CODEVALIDATEMSG').subscribe((res: string) => {
          //               this.userMsg.error(res);
          //             });
          //           }
          //           if (msg.includes("Arabic")) {
          //             this.ArabicValidationMsg = msg;
          //             this.translateService.get('NEDSS.COMMON.ARABICNAMEVALIDATEMSG').subscribe((res: string) => {
          //               this.userMsg.error(res);
          //             });
          //           }

          //           if (msg.includes("English")) {
          //             this.EnglishNameValidationMsg = msg;
          //             this.translateService.get('NEDSS.COMMON.ENGLISHNAMEVALIDATEMSG').subscribe((res: string) => {
          //               this.userMsg.error(res);
          //             });
          //           }

          //           // this.userMsg.error('NEDSS.COMMO.' + msg);


          //         });
          //       } else {
          //         this.translateService
          //           .get('NEDSS.COMMON.SENT_FAILD')
          //           .subscribe((res: string) => {
          //             this.userMsg.error(res);
          //           });
          //       }
          //     }
          //   );
          // } else this.update();

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

                // this.userMsg.error('NEDSS.COMMO.' + msg);

              });
            });

            return;
          }
          else {
            this.translateService.get('NEDSS.COMMON.SENT_SUCESSFULLY').subscribe((res: string) => {
              this.userMsg.success(res);
            });
            this.getPrincipalitys();
            this.principality = {
              id: null,
              code: null,
              arabicName: null,
              englishName: null,
              cityID: null,
            };
          }
        }, (error) => {
          if (error.error?.messages?.includes("DuplicatedCode") || error?.error?.messages?.includes("DuplicatedEnglishName")
            || error.error?.messages?.includes("DuplicatedArabicName")) {


            error.error?.messages.forEach(msg => {
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
          } else {
            this.translateService
              .get('NEDSS.COMMON.SENT_FAILD')
              .subscribe((res: string) => {
                this.userMsg.error(res);
              });
          }
        });
    } else
      this.update();
  }

  update() {

    // this.principalityService.updatePrincipality(this.principality).subscribe(
    //   (response: any) => {
    //     if (response) {
    //       this.translateService
    //         .get('NEDSS.COMMON.UPDATE_SUCESSFULLY')
    //         .subscribe((res: string) => {
    //           this.userMsg.success(res);
    //         });
    //       this.getPrincipalitys();
    //       this.principality = {
    //         id: null,
    //         code: null,
    //         arabicName: null,
    //         englishName: null,
    //         cityID: null,
    //       };
    //     }
    //   },
    //   (error) => {
    //     if (error.error?.messages?.includes("DuplicatedCode") || error?.error?.messages?.includes("DuplicatedEnglishName")
    //       || error.error?.messages?.includes("DuplicatedArabicName")) {
    //       this.translateService
    //         .get('NEDSS.COMMON.' + error.error.messages[0])
    //         .subscribe((res: string) => {
    //           this.userMsg.error(res);
    //         });
    //     } else {
    //       this.translateService
    //         .get('NEDSS.COMMON.SENT_FAILD')
    //         .subscribe((res: string) => {
    //           this.userMsg.error(res);
    //         });
    //     }
    //   }
    // );
    this.principalityService.updatePrincipality(this.principality).subscribe(
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

              // this.userMsg.error('NEDSS.COMMO.' + msg);

            });
          });

          return;
        }
        if (response) {
          this.translateService.get('NEDSS.COMMON.UPDATE_SUCESSFULLY').subscribe((res: string) => {
            this.userMsg.success(res);
          });
          this.getPrincipalitys();
          this.principality = {
            id: null,
            code: null,
            arabicName: null,
            englishName: null,
            cityID: null,
          };
        }
      }, (error) => {
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
      });
  }

  sort(event: SortEvent) {
    if (
      event.order == -1 &&
      this.principalityFilter.sortOrder != SortOrder.desc
    ) {
      this.principalityFilter.sortOrder = SortOrder.desc;
      if (typeof event.field === 'string')
        this.principalityFilter.sortColumn = event.field;
      this.getPrincipalitys();
    } else if (
      event.order == 1 &&
      this.principalityFilter.sortOrder != SortOrder.asc
    ) {
      this.principalityFilter.sortOrder = SortOrder.asc;
      if (typeof event.field === 'string')
        this.principalityFilter.sortColumn = event.field;
      this.getPrincipalitys();
    }
  }
  paginate(event: any) {
    this.first = event.first;
    this.last = event.last;
    //add one as primeng pagination is zero based ,so we convert it to one based to fit with the API
    this.principalityFilter.pageIndex = event.page;
    this.principalityFilter.pageSize = event.rows;
    this.getPrincipalitys();
  }

  delete(id: number) {
    this.principalityService.deletePrincipality(id).subscribe(
      (result: any) => {
        this.getPrincipalitys();
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
    this.principalityFilter.searchText = '';
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
