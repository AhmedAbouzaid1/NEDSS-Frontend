import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SortEvent } from 'primeng/api';
import { fromEvent, map, debounceTime, distinctUntilChanged } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { SortOrder } from 'src/app/core/constants';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dependency',
  templateUrl: './dependency.component.html',
  styleUrls: ['./dependency.component.css']
})
export class DependencyComponent implements OnInit {

  underDeleting = {
    arabicName: '',
    id: null
  };
  dependency = {
    id: null,
    code: null,
    arabicName: null,
    englishName: null,
    organizationID: null
  }
  dependencys!: any[];
  organizations!: any[];
  dependencyFilter = {
    pageSize: 10,
    pageIndex: 0,
    sortColumn: "",
    sortOrder: "",
    searchText: "",
    code: "",
    arabicName: "",
    englishName: "",
    organizationID: null
  }
  noData: boolean = true;
  loadingPanel: boolean = false;
  organizationsLoading: boolean = false;
  first: number = 0;
  last: number = 0;
  pages: number = 0;
  codeValidationMsg: string = '';

  ArabicNameValidationMsg: string = '';

  EnglishNameValidationMsg: string = '';

  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;

  constructor(private dependencyService: LookupsGetterService, private translateService: TranslateService, private userMsg: UserMessageService) { }

  ngOnInit() {
    this.getOrganization();
    this.getDependencys();
    fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      })
      , debounceTime(environment.DebounceWaiting)
      , distinctUntilChanged()
    ).subscribe(() => {
      this.search();
    })

  }
  getOrganization() {
    this.organizationsLoading = true;
    this.dependencyService.getAllOrganizations().pipe(finalize(() => (this.organizationsLoading = false))).subscribe((result: any) => {
      if (result != null && result != undefined) {
        this.organizations = result.data;
      }
      this.loadingPanel = false;
    }, error => {
      this.loadingPanel = false;
      this.translateService.get('NEDSS.COMMON.INTERNAL_SERVER_ERROR').subscribe((res: string) => {
        this.userMsg.error(res);
      });
    });
  }
  search() {

    this.first = 0;
    this.dependencyFilter.pageIndex = 0;
    this.last = this.dependencyFilter.pageIndex * this.dependencyFilter.pageSize;
    this.dependencyFilter.code = this.dependency.code;
    this.dependencyFilter.englishName = this.dependency.englishName;
    this.dependencyFilter.arabicName = this.dependency.arabicName;
    this.dependencyFilter.organizationID = this.dependency.organizationID;

    this.getDependencys();
  }

  getDependencys() {
    this.loadingPanel = true;
    this.dependencyService.getPageDependencys(this.dependencyFilter).subscribe((result: any) => {

      if (result != null && result != undefined) {
        this.dependencys = result.data;
        if (this.dependencys != undefined && this.dependencys.length == 0) {
          this.noData = true;
          this.pages = 0;
        }
        else {
          this.noData = false;
          this.pages = result.data[0].totalCount;
          this.last = this.dependencyFilter.pageIndex * this.dependencyFilter.pageSize;
        }
      }
      this.loadingPanel = false;
    }, error => {
      this.loadingPanel = false;
      this.translateService.get('NEDSS.COMMON.INTERNAL_SERVER_ERROR').subscribe((res: string) => {
        this.userMsg.error(res);
      });
    });
  }

  getById(id: number) {
    this.dependencyService.getDependencyById(id).subscribe((result: any) => {
      document.getElementById("depend").scrollIntoView({ behavior: 'smooth' });
      this.dependency = result.data;
    }, () => {
      this.translateService.get('NEDSS.COMMON.INTERNAL_SERVER_ERROR').subscribe((res: string) => {
        this.userMsg.error(res);
      });
    });
  }

  save() {

    if (this.dependency.id == null) {
      this.dependencyService.addDependency(this.dependency).subscribe((response: any) => {


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
                this.ArabicNameValidationMsg = msg;
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

              //   this.userMsg.error(msg);
            });
          });

          return;
        }
        else {
          this.translateService.get('NEDSS.COMMON.SENT_SUCESSFULLY').subscribe((res: string) => {
            this.userMsg.success(res);
          });
          this.getDependencys();
          this.dependency = { id: null, code: null, arabicName: null, englishName: null, organizationID: null };
        }

      }, (error) => {

        if (error.error?.messages?.includes("DuplicatedCode") || error?.error?.messages?.includes("DuplicatedEnglishName")
          || error.error?.messages?.includes("DuplicatedArabicName")) {
          // this.translateService
          //   .get('NEDSS.COMMON.' + error.error.messages[0])
          //   .subscribe((res: string) => {
          //     this.userMsg.error(res);
          //     if (error.includes("Code")) {
          //       this.codeValidationMsg = res;
          //       this.translateService.get('NEDSS.COMMON.CODEVALIDATEMSG').subscribe((res: string) => {
          //         this.userMsg.error(res);
          //       });

          //     }
          //     else if (error.includes("Arabic")) {
          //       this.ArabicNameValidationMsg = res;
          //       this.translateService.get('NEDSS.COMMON.ARABICNAMEVALIDATEMSG').subscribe((res: string) => {
          //         this.userMsg.error(res);
          //       });
          //     }

          //     else if (error.includes("English")) {
          //       
          //       this.EnglishNameValidationMsg = res;
          //       this.translateService.get('NEDSS.COMMON.ENGLISHNAMEVALIDATEMSG').subscribe((res: string) => {
          //         this.userMsg.error(res);
          //       });
          //     }
          //   });

          error.error?.messages.forEach(msg => {
            this.translateService.get('NEDSS.HOME.USERS.ADD_USER.' + msg).subscribe(res => {
              if (msg.includes("Code")) {
                this.codeValidationMsg = msg;
                this.translateService.get('NEDSS.COMMON.CODEVALIDATEMSG').subscribe((res: string) => {
                  this.userMsg.error(res);
                });
              }
              if (msg.includes("Arabic")) {
                this.ArabicNameValidationMsg = msg;
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
    this.dependencyService.updateDependency(this.dependency).subscribe((response: any) => {
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
              this.ArabicNameValidationMsg = msg;
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
        this.getDependencys();
        this.dependency = { id: null, code: null, arabicName: null, englishName: null, organizationID: null, };
      }
    }, (error) => {

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
            this.ArabicNameValidationMsg = msg;
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
    if (event.order == -1 && this.dependencyFilter.sortOrder != SortOrder.desc) {
      this.dependencyFilter.sortOrder = SortOrder.desc;
      if (typeof event.field === 'string')
        this.dependencyFilter.sortColumn = event.field;
      this.getDependencys();
    } else if (event.order == 1 && this.dependencyFilter.sortOrder != SortOrder.asc) {
      this.dependencyFilter.sortOrder = SortOrder.asc;
      if (typeof event.field === 'string')
        this.dependencyFilter.sortColumn = event.field;
      this.getDependencys();
    }
  }
  paginate(event: any) {
    this.first = event.first;
    this.last = event.last;
    //add one as primeng pagination is zero based ,so we convert it to one based to fit with the API
    this.dependencyFilter.pageIndex = event.page;
    this.dependencyFilter.pageSize = event.rows;
    this.getDependencys();
  }

  delete(id: number) {
    this.dependencyService.deleteDependency(id).subscribe((result: any) => {
      this.getDependencys();
      this.translateService.get('NEDSS.COMMON.DELETED_SUCESSFULLY').subscribe((res: string) => {
        this.userMsg.success(res);
      });
    }, (error) => {
      this.translateService.get('NEDSS.COMMON.DELETED_FAILED').subscribe((res: string) => {
        this.userMsg.error(res);
      });
    });
  }

  clearSearch() {
    this.dependencyFilter.searchText = '';
    this.search();
  }


  nameToDelete(ele) {
    this.underDeleting.id = ele.id;
    this.underDeleting.arabicName = ele.arabicName;
  }
  iderror = true;
  validate(value: any) {
    if (value === 0) {
      this.iderror = true;
    }
    else {
      this.iderror = false;
    }
  }
  codeChange() {

    this.codeValidationMsg = '';
  }
  arabicNameChange() {

    this.ArabicNameValidationMsg = '';
  }
  englishNameChange() {

    this.EnglishNameValidationMsg = '';
  }

}
