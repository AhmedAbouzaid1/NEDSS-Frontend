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
  selector: 'app-health-administration',
  templateUrl: './health-administration.component.html',
  styleUrls: ['./health-administration.component.css']
})
export class HealthAdministrationComponent {
  underDeleting = {
    arabicName: '',
    id: null
  };
  healthAdministration = {
    id: null,
    code: null,
    arabicName: null,
    englishName: null,
    governmentID: null
  }
  healthAdministrations!: any[];
  governments!: any[];
  healthAdministrationFilter = {
    pageSize: 10,
    pageIndex: 0,
    sortColumn: "",
    sortOrder: "",
    searchText: "",
    governmentID: null,
    code: "",
    arabicName: "",
    englishName: ""
  }
  noData: boolean = true;
  loadingPanel: boolean = false;
  first: number = 0;
  last: number = 0;
  pages: number = 0;
  codeValidationMsg: string = '';
  ArabicValidationMsg: string = '';
  EnglishNameValidationMsg: string = '';

  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;

  constructor(private healthAdministrationService: LookupsGetterService, private translateService: TranslateService, private userMsg: UserMessageService) { }

  ngOnInit() {
    this.getGovernment();
    this.getHealthAdministrations();
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
  getGovernment() {
    this.healthAdministrationService.getAllGovernments().subscribe((result: any) => {
      if (result != null && result != undefined) {
        this.governments = result.data;
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
    this.healthAdministrationFilter.pageIndex = 0;
    this.last = this.healthAdministrationFilter.pageIndex * this.healthAdministrationFilter.pageSize;
    this.healthAdministrationFilter.governmentID = this.healthAdministration.governmentID;
    this.healthAdministrationFilter.code = this.healthAdministration.code;
    this.healthAdministrationFilter.arabicName = this.healthAdministration.arabicName;
    this.healthAdministrationFilter.englishName = this.healthAdministration.englishName;

    this.getHealthAdministrations()
  }


  getHealthAdministrations() {
    this.loadingPanel = true;
    this.healthAdministrationService.getPageHealthAdministrations(this.healthAdministrationFilter).subscribe((result: any) => {
      if (result != null && result != undefined) {
        this.healthAdministrations = result.data;
        if (this.healthAdministrations != undefined && this.healthAdministrations.length == 0) {
          this.noData = true;
          this.pages = 0;
        }
        else {
          this.noData = false;
          this.pages = result.data[0].totalCount;
          this.last = this.healthAdministrationFilter.pageIndex * this.healthAdministrationFilter.pageSize;
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
    this.healthAdministrationService.getHealthAdministrationById(id).subscribe((result: any) => {
      document.getElementById("health-admin").scrollIntoView({ behavior: 'smooth' });
      this.healthAdministration = result.data;
    }, () => {
      this.translateService.get('NEDSS.COMMON.INTERNAL_SERVER_ERROR').subscribe((res: string) => {
        this.userMsg.error(res);
      });
    });
  }

  save() {
    if (this.healthAdministration.id == null) {
      this.healthAdministrationService.addHealthAdministration(this.healthAdministration).subscribe((response: any) => {


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
          this.getHealthAdministrations();
          this.healthAdministration = { id: null, code: null, arabicName: null, englishName: null, governmentID: null, };
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
    this.healthAdministrationService.updateHealthAdministration(this.healthAdministration).subscribe((response: any) => {
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
        this.translateService.get('NEDSS.COMMON.UPDATE_SUCESSFULLY').subscribe((res: string) => {
          this.userMsg.success(res);
        });
        this.getHealthAdministrations();
        this.healthAdministration = { id: null, code: null, arabicName: null, englishName: null, governmentID: null, };
      }
    }, (error) => {
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
    });
  }

  sort(event: SortEvent) {
    if (event.order == -1 && this.healthAdministrationFilter.sortOrder != SortOrder.desc) {
      this.healthAdministrationFilter.sortOrder = SortOrder.desc;
      if (typeof event.field === 'string')
        this.healthAdministrationFilter.sortColumn = event.field;
      this.getHealthAdministrations();
    } else if (event.order == 1 && this.healthAdministrationFilter.sortOrder != SortOrder.asc) {
      this.healthAdministrationFilter.sortOrder = SortOrder.asc;
      if (typeof event.field === 'string')
        this.healthAdministrationFilter.sortColumn = event.field;
      this.getHealthAdministrations();
    }
  }
  paginate(event: any) {
    this.first = event.first;
    this.last = event.last;
    //add one as primeng pagination is zero based ,so we convert it to one based to fit with the API
    this.healthAdministrationFilter.pageIndex = event.page;
    this.healthAdministrationFilter.pageSize = event.rows;
    this.getHealthAdministrations();
  }

  delete(id: number) {
    this.healthAdministrationService.deleteHealthAdministration(id).subscribe((result: any) => {
      this.getHealthAdministrations();
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
    this.healthAdministrationFilter.searchText = '';
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

