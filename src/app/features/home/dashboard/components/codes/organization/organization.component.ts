import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SortEvent } from 'primeng/api';
import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';
import { SortOrder } from 'src/app/core/constants';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.css']
})
export class OrganizationComponent implements OnInit {
  underDeleting = {
    arabicName: '',
    id: null
  };
  organization = {
    id: null,
    code: null,
    arabicName: null,
    englishName: null,

  }
  organizations!: any[];
  parentOrganizations!: any[];
  organizationFilter = {
    pageSize: 10,
    pageIndex: 0,
    sortColumn: "",
    sortOrder: "",
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

  constructor(private organizationService: LookupsGetterService, private translateService: TranslateService, private userMsg: UserMessageService) { }

  ngOnInit() {
    this.getOrganizations();

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
    this.organizationFilter.pageIndex = 0;
    this.last = this.organizationFilter.pageIndex * this.organizationFilter.pageSize;
    this.organizationFilter.code = this.organization.code;
    this.organizationFilter.englishName = this.organization.englishName;
    this.organizationFilter.arabicName = this.organization.arabicName;
    this.getOrganizations();
  }

  getOrganizations() {
    this.loadingPanel = true;
    this.organizationService.getPageOrganizations(this.organizationFilter).subscribe((result: any) => {
      if (result != null && result != undefined) {
        this.organizations = result.data;
        if (this.organizations != undefined && this.organizations.length == 0) {
          this.noData = true;
          this.pages = 0;
        }
        else {
          this.noData = false;
          this.pages = result.data[0].totalCount;
          this.last = this.organizationFilter.pageIndex * this.organizationFilter.pageSize;
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


    this.organizationService.getOrganizationById(id).subscribe((result: any) => {

      document.getElementById("organiz").scrollIntoView({ behavior: 'smooth' });

      this.organization = result.data;
    }, () => {
      this.translateService.get('NEDSS.COMMON.INTERNAL_SERVER_ERROR').subscribe((res: string) => {
        this.userMsg.error(res);
      });
    });
  }

  save() {
    if (this.organization.id == null) {

      this.organizationService.addOrganization(this.organization).subscribe((response: any) => {
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
          this.getOrganizations();
          this.organization = { id: null, code: null, arabicName: null, englishName: null };
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

    this.organizationService.updateOrganization(this.organization).subscribe((response: any) => {

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
        this.getOrganizations();
        this.organization = { id: null, code: null, arabicName: null, englishName: null };
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
    if (event.order == -1 && this.organizationFilter.sortOrder != SortOrder.desc) {
      this.organizationFilter.sortOrder = SortOrder.desc;
      if (typeof event.field === 'string')
        this.organizationFilter.sortColumn = event.field;
      this.getOrganizations();
    } else if (event.order == 1 && this.organizationFilter.sortOrder != SortOrder.asc) {
      this.organizationFilter.sortOrder = SortOrder.asc;
      if (typeof event.field === 'string')
        this.organizationFilter.sortColumn = event.field;
      this.getOrganizations();
    }
  }
  paginate(event: any) {
    this.first = event.first;
    this.last = event.last;
    //add one as primeng pagination is zero based ,so we convert it to one based to fit with the API
    this.organizationFilter.pageIndex = event.page;
    this.organizationFilter.pageSize = event.rows;
    this.getOrganizations();
  }

  delete(id: number) {
    this.organizationService.deleteOrganization(id).subscribe((result: any) => {
      this.getOrganizations();
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
    this.organizationFilter.searchText = '';
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
