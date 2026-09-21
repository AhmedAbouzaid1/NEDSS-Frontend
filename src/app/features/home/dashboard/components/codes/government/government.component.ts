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
  selector: 'app-government',
  templateUrl: './government.component.html',
  styleUrls: ['./government.component.css']
})
export class GovernmentComponent implements OnInit {
  underDeleting = {
    arabicName: '',
    id: null
  };
  government = {
    id: null,
    code: null,
    arabicName: null,
    englishName: null,
    isParent: false,
    parentId: null
  }
  governments!: any[];
  parentGovernments!: any[];
  governmentFilter = {
    pageSize: 10,
    pageIndex: 0,
    sortColumn: 'code',
    sortOrder: 'desc',
    searchText: "",
    code: "",
    arabicName: "",
    englishName: "",

  }
  noData: boolean = true;
  loadingPanel: boolean = false;
  first: number = 0;
  last: number = 0;
  pages: number = 0;
  totalCount: number = 0;
  codeValidationMsg: string = '';
  ArabicNameValidationMsg: string = '';
  EnglishNameValidationMsg: string = '';
  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;

  constructor(private governmentService: LookupsGetterService, private translateService: TranslateService, private userMsg: UserMessageService) { }

  ngOnInit() {
    this.getGovernments();
    this.getParentGovernment();
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

  search() {
    this.first = 0;
    this.governmentFilter.pageIndex = 0;
    this.last = this.governmentFilter.pageIndex * this.governmentFilter.pageSize;
    this.governmentFilter.code = this.government.code;
    this.governmentFilter.englishName = this.government.englishName;
    this.governmentFilter.arabicName = this.government.arabicName;
    this.getGovernments();
  }
  getParentGovernment() {
    this.governmentService.getParentGovernments().subscribe((result: any) => {
      if (result != null && result != undefined) {
        this.parentGovernments = result.data;
      }
      this.loadingPanel = false;
    }, error => {
      this.loadingPanel = false;
      this.translateService.get('NEDSS.COMMON.INTERNAL_SERVER_ERROR').subscribe((res: string) => {
        this.userMsg.error(res);
      });
    });
  }
  getGovernments() {
    this.loadingPanel = true;
    this.governmentService.getPageGovernments(this.governmentFilter).subscribe((result: any) => {
      if (result != null && result != undefined) {
        this.governments = result.data;
        if (this.governments != undefined && this.governments.length == 0) {
          this.noData = true;
          this.pages = 0;
        }
        else {
          this.noData = false;
          this.pages = result.data[0].totalCount;
          this.last = this.governmentFilter.pageIndex * this.governmentFilter.pageSize;
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
    this.governmentService.getGovernmentById(id).subscribe((result: any) => {
      document.getElementById("govern").scrollIntoView({ behavior: 'smooth' });
      this.government = result.data;
    }, () => {
      this.translateService.get('NEDSS.COMMON.INTERNAL_SERVER_ERROR').subscribe((res: string) => {
        this.userMsg.error(res);
      });
    });
  }

  save() {
    if (this.government.id == null) {
      this.governmentService.addGovernment(this.government).subscribe((response: any) => {


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
        else {
          this.translateService.get('NEDSS.COMMON.SENT_SUCESSFULLY').subscribe((res: string) => {
            this.userMsg.success(res);
          });
          this.getGovernments();
          this.government = { id: null, code: null, arabicName: null, englishName: null, isParent: false, parentId: null, };
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

    this.governmentService.updateGovernment(this.government).subscribe((response: any) => {


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
        this.getGovernments();
        this.government = { id: null, code: null, arabicName: null, englishName: null, isParent: false, parentId: null, };
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
    if (event.order == -1 && this.governmentFilter.sortOrder != SortOrder.desc) {
      this.governmentFilter.sortOrder = SortOrder.desc;
      if (typeof event.field === 'string')
        this.governmentFilter.sortColumn = event.field;
      this.getGovernments();
    } else if (event.order == 1 && this.governmentFilter.sortOrder != SortOrder.asc) {
      this.governmentFilter.sortOrder = SortOrder.asc;
      if (typeof event.field === 'string')
        this.governmentFilter.sortColumn = event.field;
      this.getGovernments();
    }
  }
  paginate(event: any) {
    this.first = event.first;
    this.last = event.last;
    //add one as primeng pagination is zero based ,so we convert it to one based to fit with the API
    this.governmentFilter.pageIndex = event.page;
    this.governmentFilter.pageSize = event.rows;
    this.getGovernments();
  }

  delete(id: number) {
    this.governmentService.deleteGovernment(id).subscribe((result: any) => {
      this.getGovernments();
      this.translateService.get('NEDSS.COMMON.DELETED_SUCESSFULLY').subscribe((res: string) => {
        this.userMsg.success(res);
      });
    }, (error) => {
      this.translateService.get('NEDSS.COMMON.DELETED_FAILED').subscribe((res: string) => {
        this.userMsg.error(res);
      });
    });
  }

  // view(id) {
  //   // this.$state.go("home.announcements.details", { id: id }, { reload: true });
  //   this.router.navigate(['/forms/announcements',id])
  // }

  clearSearch() {
    this.governmentFilter.searchText = '';
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

    this.ArabicNameValidationMsg = '';
  }
  englishNameChange() {

    this.EnglishNameValidationMsg = '';
  }
}
